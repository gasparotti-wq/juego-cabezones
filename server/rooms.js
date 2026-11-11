const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 4;
const MAX_ROOMS = 250;
const ROOM_TTL = 2 * 60 * 60 * 1000;
const MAX_RELAY_BYTES = 16 * 1024;

function normalizeCode(value) {
    return String(value || '')
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, CODE_LENGTH);
}

export class RoomManager {
    constructor() {
        this.rooms = new Map();
    }

    create(connection) {
        if (connection.roomCode) {
            this.error(connection, 'ALREADY_IN_ROOM', 'Ya estás en una sala.');
            return null;
        }

        if (this.rooms.size >= MAX_ROOMS) {
            this.error(connection, 'SERVER_FULL', 'El servidor llegó al límite de salas.');
            return null;
        }

        const code = this.generateCode();
        if (!code) {
            this.error(connection, 'SERVER_FULL', 'No se pudo crear la sala.');
            return null;
        }

        const room = {
            code,
            host: connection,
            guest: null,
            createdAt: Date.now(),
            lastActivity: Date.now()
        };

        this.rooms.set(code, room);
        connection.roomCode = code;
        connection.role = 'host';
        connection.sendJson({ t: 'room', code, role: 'host' });
        return room;
    }

    join(connection, rawCode) {
        if (connection.roomCode) {
            this.error(connection, 'ALREADY_IN_ROOM', 'Ya estás en una sala.');
            return null;
        }

        const code = normalizeCode(rawCode);
        if (code.length !== CODE_LENGTH) {
            this.error(connection, 'BAD_CODE', 'El código tiene que tener 4 caracteres.');
            return null;
        }

        const room = this.rooms.get(code);
        if (!room) {
            this.error(connection, 'ROOM_NOT_FOUND', 'No existe una sala con ese código.');
            return null;
        }

        if (room.guest || !room.host || room.host.finished) {
            this.error(connection, 'ROOM_FULL', 'Esa sala ya está llena.');
            return null;
        }

        room.guest = connection;
        room.lastActivity = Date.now();
        connection.roomCode = code;
        connection.role = 'guest';

        connection.sendJson({ t: 'room', code, role: 'guest' });
        room.host.sendJson({ t: 'peer', event: 'joined' });
        return room;
    }

    relay(connection, data) {
        const room = this.roomOf(connection);
        if (!room) {
            this.error(connection, 'NOT_IN_ROOM', 'No estás en una sala.');
            return;
        }

        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            this.error(connection, 'BAD_MESSAGE', 'Mensaje inválido.');
            return;
        }

        let serialized;
        try {
            serialized = JSON.stringify(data);
        } catch {
            this.error(connection, 'BAD_MESSAGE', 'Mensaje inválido.');
            return;
        }

        if (serialized.length > MAX_RELAY_BYTES) {
            this.error(connection, 'MESSAGE_TOO_LARGE', 'Mensaje demasiado grande.');
            return;
        }

        const peer = connection === room.host ? room.guest : room.host;
        if (!peer || peer.finished) return;

        room.lastActivity = Date.now();
        peer.send(`{"t":"relay","d":${serialized}}`);
    }

    leave(connection) {
        const room = this.roomOf(connection);
        if (!room) {
            connection.roomCode = null;
            connection.role = null;
            return;
        }

        this.rooms.delete(room.code);
        connection.roomCode = null;
        connection.role = null;

        const peer = connection === room.host ? room.guest : room.host;
        if (peer && !peer.finished) {
            peer.roomCode = null;
            peer.role = null;
            peer.sendJson({ t: 'peer', event: 'left' });
        }
    }

    roomOf(connection) {
        if (!connection.roomCode) return null;
        const room = this.rooms.get(connection.roomCode);
        if (!room) {
            connection.roomCode = null;
            connection.role = null;
            return null;
        }
        return room;
    }

    cleanup() {
        const now = Date.now();
        for (const [code, room] of this.rooms) {
            const empty = !room.host && !room.guest;
            const hostGone = !room.host || room.host.finished;
            const guestGone = !room.guest || room.guest.finished;
            const dead = hostGone && guestGone;
            const expired = now - room.lastActivity > ROOM_TTL;

            if (empty || dead || expired) {
                if (room.host) room.host.roomCode = room.host.roomCode === code ? null : room.host.roomCode;
                if (room.guest) room.guest.roomCode = room.guest.roomCode === code ? null : room.guest.roomCode;
                this.rooms.delete(code);
            }
        }
    }

    stats() {
        return {
            rooms: this.rooms.size,
            players: [...this.rooms.values()].reduce((total, room) => total + (room.host ? 1 : 0) + (room.guest ? 1 : 0), 0)
        };
    }

    generateCode() {
        for (let attempt = 0; attempt < 60; attempt++) {
            let code = '';
            for (let i = 0; i < CODE_LENGTH; i++) {
                code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
            }
            if (!this.rooms.has(code)) return code;
        }
        return null;
    }

    error(connection, code, message) {
        connection.sendJson({ t: 'error', code, message });
    }
}
