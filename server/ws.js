import crypto from 'node:crypto';
import { EventEmitter } from 'node:events';

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_MESSAGE_BYTES = 16 * 1024;
const PING_INTERVAL = 20000;
const PONG_TIMEOUT = 60000;

function encodeFrame(opcode, payload) {
    const length = payload.length;
    let header;

    if (length < 126) {
        header = Buffer.alloc(2);
        header[1] = length;
    } else if (length < 65536) {
        header = Buffer.alloc(4);
        header[1] = 126;
        header.writeUInt16BE(length, 2);
    } else {
        header = Buffer.alloc(10);
        header[1] = 127;
        header.writeBigUInt64BE(BigInt(length), 2);
    }

    header[0] = 0x80 | opcode; // FIN + opcode
    return Buffer.concat([header, payload]);
}

export class WsConnection extends EventEmitter {
    constructor(socket, request, head = Buffer.alloc(0)) {
        super();
        this.socket = socket;
        this.request = request;
        this.remoteAddress = request.socket.remoteAddress;
        this.buffer = Buffer.alloc(0);
        this.fragments = null;
        this.closeSent = false;
        this.finished = false;
        this.lastActivity = Date.now();
        this.lastPing = Date.now();
        this.roomCode = null;
        this.role = null;
        this._head = head;
        this._started = false;
    }

    start() {
        if (this._started) return;
        this._started = true;
        this.socket.setNoDelay(true);
        this.socket.on('data', chunk => this._onData(chunk));
        this.socket.on('close', () => this._finish());
        this.socket.on('error', () => this._finish());
        if (this._head.length) this._onData(this._head);
        this._head = Buffer.alloc(0);
    }

    send(text) {
        if (this.finished || this.socket.destroyed) return false;
        const payload = Buffer.isBuffer(text) ? text : Buffer.from(String(text), 'utf8');
        if (payload.length > MAX_MESSAGE_BYTES) return false;
        if (this.socket.writableLength > 512 * 1024) return false;

        try {
            this.socket.write(encodeFrame(0x1, payload));
            return true;
        } catch {
            this.terminate();
            return false;
        }
    }

    sendJson(value) {
        return this.send(JSON.stringify(value));
    }

    ping() {
        if (this.finished || this.socket.destroyed) return;
        try {
            this.socket.write(encodeFrame(0x9, Buffer.alloc(0)));
        } catch {
            this.terminate();
        }
    }

    close(code = 1000, reason = '') {
        if (this.closeSent || this.finished) return;
        this.closeSent = true;

        try {
            const reasonBuffer = Buffer.from(String(reason), 'utf8');
            const payload = Buffer.alloc(2 + reasonBuffer.length);
            payload.writeUInt16BE(code, 0);
            reasonBuffer.copy(payload, 2);
            this.socket.write(encodeFrame(0x8, payload));
        } catch {
            // La conexión ya no está disponible.
        }

        this.socket.end();
    }

    terminate() {
        this.closeSent = true;
        try {
            this.socket.destroy();
        } catch {
            // Ignorar.
        }
        this._finish();
    }

    _finish() {
        if (this.finished) return;
        this.finished = true;
        this.emit('close');
    }

    _protocolError(code, reason) {
        this.closeReason = `protocol ${code}: ${reason}`;
        this.close(code, reason);
    }

    _onData(chunk) {
        if (this.finished) return;
        this.buffer = this.buffer.length ? Buffer.concat([this.buffer, chunk]) : chunk;
        this._parseFrames();
    }

    _parseFrames() {
        while (!this.finished) {
            const available = this.buffer.length;
            if (available < 2) return;

            const first = this.buffer[0];
            const second = this.buffer[1];
            const fin = (first & 0x80) !== 0;
            const rsv = first & 0x70;
            const opcode = first & 0x0f;
            const masked = (second & 0x80) !== 0;
            let length = second & 0x7f;
            let offset = 2;

            if (rsv !== 0) return this._protocolError(1002, 'RSV no permitido');
            if (!masked) return this._protocolError(1002, 'Falta la máscara');

            if (length === 126) {
                if (available < 4) return;
                length = this.buffer.readUInt16BE(2);
                offset = 4;
            } else if (length === 127) {
                if (available < 10) return;
                const bigLength = this.buffer.readBigUInt64BE(2);
                if (bigLength > BigInt(MAX_MESSAGE_BYTES)) return this._protocolError(1009, 'Mensaje demasiado grande');
                length = Number(bigLength);
                offset = 10;
            }

            if (length > MAX_MESSAGE_BYTES) return this._protocolError(1009, 'Mensaje demasiado grande');
            if (available < offset + 4 + length) return;

            const mask = this.buffer.subarray(offset, offset + 4);
            const payload = Buffer.from(this.buffer.subarray(offset + 4, offset + 4 + length));
            for (let i = 0; i < payload.length; i++) payload[i] ^= mask[i & 3];
            this.buffer = this.buffer.subarray(offset + 4 + length);

            if (opcode >= 0x8) {
                if (!fin) return this._protocolError(1002, 'Frame de control fragmentado');
                if (length > 125) return this._protocolError(1002, 'Frame de control demasiado grande');
                this._handleControl(opcode, payload);
                if (this.finished) return;
                continue;
            }

            if (opcode === 0x0) {
                if (!this.fragments) return this._protocolError(1002, 'Continuación inesperada');
                this.fragments.chunks.push(payload);
                this.fragments.size += payload.length;
                if (this.fragments.size > MAX_MESSAGE_BYTES) return this._protocolError(1009, 'Mensaje demasiado grande');
                if (fin) {
                    const complete = Buffer.concat(this.fragments.chunks);
                    const messageOpcode = this.fragments.opcode;
                    this.fragments = null;
                    this._deliver(messageOpcode, complete);
                }
                continue;
            }

            if (opcode === 0x1 || opcode === 0x2) {
                if (this.fragments) return this._protocolError(1002, 'Mensaje sin terminar');
                if (fin) {
                    this._deliver(opcode, payload);
                } else {
                    this.fragments = { opcode, chunks: [payload], size: payload.length };
                }
                continue;
            }

            return this._protocolError(1002, 'Opcode desconocido');
        }
    }

    _handleControl(opcode, payload) {
        if (opcode === 0x8) {
            if (!this.closeSent) {
                const code = payload.length >= 2 ? payload.readUInt16BE(0) : 1000;
                this.closeSent = true;
                try {
                    this.socket.write(encodeFrame(0x8, Buffer.from([code >> 8, code & 0xff])));
                } catch {
                    // Ignorar.
                }
            }
            this.socket.end();
            return;
        }

        if (opcode === 0x9) {
            try {
                this.socket.write(encodeFrame(0xA, payload));
            } catch {
                this.terminate();
            }
            return;
        }

        if (opcode === 0xA) {
            this.lastActivity = Date.now();
            return;
        }

        this._protocolError(1002, 'Opcode de control desconocido');
    }

    _deliver(opcode, payload) {
        if (opcode !== 0x1) {
            return this._protocolError(1003, 'Solo se admite texto');
        }

        let text;
        try {
            text = new TextDecoder('utf-8', { fatal: true }).decode(payload);
        } catch {
            return this._protocolError(1007, 'UTF-8 inválido');
        }

        // Cualquier mensaje entrante prueba que la conexión está viva.
        this.lastActivity = Date.now();
        this.emit('message', text);
    }
}

export function attachWebSocketServer(server, onConnection) {
    server.on('upgrade', (request, socket, head) => {
        let pathname;
        try {
            pathname = new URL(request.url, 'http://localhost').pathname;
        } catch {
            socket.destroy();
            return;
        }

        if (pathname !== '/ws') {
            socket.write('HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n');
            socket.destroy();
            return;
        }

        const key = request.headers['sec-websocket-key'];
        const version = request.headers['sec-websocket-version'];
        const upgrade = String(request.headers.upgrade || '').toLowerCase();

        if (upgrade !== 'websocket' || !key || version !== '13') {
            socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
            socket.destroy();
            return;
        }

        const accept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
        socket.write(
            'HTTP/1.1 101 Switching Protocols\r\n' +
            'Upgrade: websocket\r\n' +
            'Connection: Upgrade\r\n' +
            `Sec-WebSocket-Accept: ${accept}\r\n` +
            '\r\n'
        );

        const connection = new WsConnection(socket, request, head);
        onConnection(connection, request);
        connection.start();
    });
}

export function startHeartbeat(connections) {
    const timer = setInterval(() => {
        const now = Date.now();
        for (const connection of connections) {
            if (connection.finished) {
                connections.delete(connection);
                continue;
            }
            if (now - connection.lastActivity > PONG_TIMEOUT) {
                connection.closeReason = 'heartbeat: sin tráfico del cliente';
                connection.terminate();
                connections.delete(connection);
                continue;
            }
            if (now - connection.lastPing >= PING_INTERVAL) {
                connection.lastPing = now;
                connection.ping();
            }
        }
    }, 10000);

    timer.unref();
    return timer;
}
