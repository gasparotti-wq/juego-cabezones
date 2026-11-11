import test from 'node:test';
import assert from 'node:assert/strict';
import { RoomManager } from '../server/rooms.js';

function fakeConnection() {
    const sent = [];
    return {
        sent,
        roomCode: null,
        role: null,
        finished: false,
        sendJson(value) { sent.push(value); },
        send(text) { sent.push(JSON.parse(text)); }
    };
}

function last(connection) {
    return connection.sent[connection.sent.length - 1];
}

test('crea una sala con código válido y rol de anfitrión', () => {
    const rooms = new RoomManager();
    const host = fakeConnection();
    const room = rooms.create(host);

    assert.ok(room);
    assert.match(room.code, /^[A-HJ-NP-Z2-9]{4}$/);
    assert.equal(host.roomCode, room.code);
    assert.equal(host.role, 'host');
    assert.deepEqual(last(host), { t: 'room', code: room.code, role: 'host' });
});

test('un invitado entra y el anfitrión recibe el aviso', () => {
    const rooms = new RoomManager();
    const host = fakeConnection();
    const guest = fakeConnection();
    const room = rooms.create(host);

    const joined = rooms.join(guest, room.code.toLowerCase());

    assert.equal(joined, room);
    assert.equal(guest.roomCode, room.code);
    assert.equal(guest.role, 'guest');
    assert.deepEqual(last(host), { t: 'peer', event: 'joined' });
    assert.deepEqual(last(guest), { t: 'room', code: room.code, role: 'guest' });
});

test('retransmite mensajes del juego entre los dos jugadores', () => {
    const rooms = new RoomManager();
    const host = fakeConnection();
    const guest = fakeConnection();
    const room = rooms.create(host);
    rooms.join(guest, room.code);

    rooms.relay(guest, { k: 'i', q: 1, l: 1 });

    assert.deepEqual(last(host), { t: 'relay', d: { k: 'i', q: 1, l: 1 } });
    assert.equal(room.lastActivity > 0, true);
});

test('rechaza códigos inválidos, salas inexistentes y salas llenas', () => {
    const rooms = new RoomManager();
    const host = fakeConnection();
    const guest = fakeConnection();
    const other = fakeConnection();
    const room = rooms.create(host);

    rooms.join(guest, 'ABC');
    assert.equal(last(guest).code, 'BAD_CODE');

    rooms.join(guest, 'ZZZZ');
    assert.equal(last(guest).code, 'ROOM_NOT_FOUND');

    rooms.join(guest, room.code);
    rooms.join(other, room.code);
    assert.equal(last(other).code, 'ROOM_FULL');
});

test('salir cierra la sala y avisa al rival', () => {
    const rooms = new RoomManager();
    const host = fakeConnection();
    const guest = fakeConnection();
    const room = rooms.create(host);
    rooms.join(guest, room.code);

    rooms.leave(host);

    assert.equal(rooms.rooms.has(room.code), false);
    assert.equal(guest.roomCode, null);
    assert.deepEqual(last(guest), { t: 'peer', event: 'left' });
});

test('rechaza mensajes de relay inválidos o demasiado grandes', () => {
    const rooms = new RoomManager();
    const host = fakeConnection();
    const guest = fakeConnection();
    const room = rooms.create(host);
    rooms.join(guest, room.code);

    rooms.relay(guest, null);
    assert.equal(last(guest).code, 'BAD_MESSAGE');

    rooms.relay(guest, { data: 'x'.repeat(17 * 1024) });
    assert.equal(last(guest).code, 'MESSAGE_TOO_LARGE');
});

test('la limpieza borra salas vencidas', () => {
    const rooms = new RoomManager();
    const host = fakeConnection();
    const room = rooms.create(host);
    room.lastActivity = Date.now() - 3 * 60 * 60 * 1000;

    rooms.cleanup();

    assert.equal(rooms.rooms.has(room.code), false);
    assert.equal(host.roomCode, null);
});

test('los códigos no usan letras ambiguas', () => {
    const rooms = new RoomManager();
    for (let i = 0; i < 80; i++) {
        const room = rooms.create(fakeConnection());
        assert.doesNotMatch(room.code, /[IO01]/);
    }
});
