// Transporte WebSocket del modo LAN.
// No depende de librerías: usa el WebSocket nativo del navegador.
(function (global) {
    const listeners = new Map();

    function emit(event, data) {
        for (const listener of listeners.get(event) || []) {
            try {
                listener(data);
            } catch (error) {
                console.error('Error en el manejador de red:', error);
            }
        }
    }

    function normalizeCode(value) {
        return String(value || '')
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, 4);
    }

    const Net = {
        ws: null,
        code: null,
        role: null,
        peer: false,
        connecting: null,
        manualClose: false,
        pingTimer: null,

        on(event, listener) {
            if (!listeners.has(event)) listeners.set(event, []);
            listeners.get(event).push(listener);
            return () => {
                const list = listeners.get(event) || [];
                const index = list.indexOf(listener);
                if (index >= 0) list.splice(index, 1);
            };
        },

        isOpen() {
            return !!(this.ws && this.ws.readyState === WebSocket.OPEN);
        },

        connect() {
            if (this.isOpen()) return Promise.resolve();
            if (this.connecting) return this.connecting;

            const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
            const url = protocol + location.host + '/ws';

            this.connecting = new Promise((resolve, reject) => {
                let settled = false;
                let socket;

                try {
                    socket = new WebSocket(url);
                } catch (error) {
                    this.connecting = null;
                    reject(new Error('No se pudo abrir la conexión.'));
                    return;
                }

                this.ws = socket;
                this.manualClose = false;

                const timeout = setTimeout(() => {
                    if (settled) return;
                    settled = true;
                    this.connecting = null;
                    try { socket.close(); } catch {}
                    reject(new Error('El servidor no respondió.'));
                }, 8000);

                socket.onopen = () => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeout);
                    this.connecting = null;
                    this.startPing();
                    emit('open');
                    resolve();
                };

                socket.onmessage = event => {
                    let message;
                    try {
                        message = JSON.parse(event.data);
                    } catch {
                        return;
                    }
                    this.handle(message);
                };

                socket.onerror = () => {
                    if (settled) return;
                    settled = true;
                    clearTimeout(timeout);
                    this.connecting = null;
                    reject(new Error('No se pudo conectar al servidor.'));
                };

                socket.onclose = () => {
                    clearTimeout(timeout);
                    if (this.ws !== socket) return;
                    this.stopPing();
                    this.ws = null;
                    this.connecting = null;
                    this.peer = false;
                    this.code = null;
                    this.role = null;
                    if (!settled) {
                        settled = true;
                        reject(new Error('No se pudo conectar al servidor.'));
                    }
                    emit('close', { manual: this.manualClose });
                };
            });

            return this.connecting;
        },

        handle(message) {
            if (!message || typeof message !== 'object') return;

            switch (message.t) {
                case 'room':
                    this.code = message.code;
                    this.role = message.role;
                    emit('room', message);
                    break;
                case 'peer':
                    this.peer = message.event === 'joined';
                    emit('peer', message);
                    break;
                case 'relay':
                    emit('relay', message.d);
                    break;
                case 'pong':
                    emit('latency', Date.now() - Number(message.ts || Date.now()));
                    break;
                case 'error':
                    emit('server-error', message);
                    break;
            }
        },

        startPing() {
            this.stopPing();
            this.pingTimer = setInterval(() => {
                this.send({ t: 'ping', ts: Date.now() });
            }, 5000);
        },

        stopPing() {
            if (this.pingTimer) clearInterval(this.pingTimer);
            this.pingTimer = null;
        },

        send(message) {
            if (!this.isOpen()) return false;
            if (this.ws.bufferedAmount > 256 * 1024) return false;
            try {
                this.ws.send(JSON.stringify(message));
                return true;
            } catch {
                return false;
            }
        },

        sendRelay(data) {
            return this.send({ t: 'relay', d: data });
        },

        createRoom() {
            return this.send({ t: 'create' });
        },

        joinRoom(code) {
            const normalized = normalizeCode(code);
            return this.send({ t: 'join', code: normalized });
        },

        leaveRoom() {
            this.send({ t: 'leave' });
        },

        close() {
            this.manualClose = true;
            this.stopPing();

            const socket = this.ws;
            if (socket && socket.readyState === WebSocket.OPEN) {
                try { socket.send(JSON.stringify({ t: 'leave' })); } catch {}
            }

            this.ws = null;
            this.connecting = null;
            this.peer = false;
            this.code = null;
            this.role = null;

            if (socket) {
                try { socket.close(1000, 'salir'); } catch {}
            }
        },

        normalizeCode
    };

    global.CabezonesNet = Net;
})(window);
