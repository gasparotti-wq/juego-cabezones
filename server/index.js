import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { attachWebSocketServer, startHeartbeat } from './ws.js';
import { RoomManager } from './rooms.js';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.txt': 'text/plain; charset=utf-8',
    '.map': 'application/json; charset=utf-8'
};

function send(res, status, body, headers = {}) {
    res.writeHead(status, {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
        ...headers
    });
    res.end(body);
}

function sendJson(res, status, value) {
    send(res, status, JSON.stringify(value), {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
}

function resolveRequestPath(requestUrl) {
    let pathname;
    try {
        pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
    } catch {
        return null;
    }

    if (pathname.includes('\0')) return null;
    if (pathname.endsWith('/')) pathname += 'index.html';

    const filePath = path.resolve(ROOT, '.' + pathname);
    const insideRoot = filePath === ROOT || filePath.startsWith(ROOT + path.sep);
    return insideRoot ? filePath : null;
}

const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        send(res, 405, 'Método no permitido', { Allow: 'GET, HEAD' });
        return;
    }

    let pathname;
    try {
        pathname = new URL(req.url, 'http://localhost').pathname;
    } catch {
        send(res, 400, 'Ruta inválida');
        return;
    }

    if (pathname === '/health') {
        const stats = rooms.stats();
        sendJson(res, 200, {
            ok: true,
            uptime: Math.round(process.uptime()),
            connections: connections.size,
            rooms: stats.rooms,
            players: stats.players
        });
        return;
    }

    const filePath = resolveRequestPath(req.url);
    if (!filePath) {
        send(res, 400, 'Ruta inválida');
        return;
    }

    let stat;
    try {
        stat = fs.statSync(filePath);
    } catch {
        send(res, 404, 'No encontrado');
        return;
    }

    if (stat.isDirectory()) {
        const indexPath = path.join(filePath, 'index.html');
        try {
            stat = fs.statSync(indexPath);
        } catch {
            send(res, 404, 'No encontrado');
            return;
        }
        return serveFile(req, res, indexPath, stat);
    }

    serveFile(req, res, filePath, stat);
});

// ===================== SALAS LAN POR WEBSOCKET =====================
const rooms = new RoomManager();
const connections = new Set();

attachWebSocketServer(server, connection => {
    connections.add(connection);
    const hardLimit = { since: Date.now(), count: 0 };
    // Token bucket para retransmisiones: absorbe ráfagas (por ejemplo, si el proceso
    // estuvo ocupado y llegan mensajes acumulados) y solo descarta si el ritmo
    // sostenido supera ~150 mensajes/s.
    const relayBucket = { tokens: 300, max: 300, rate: 150, last: Date.now() };

    connection.on('message', text => {
        const now = Date.now();
        if (now - hardLimit.since >= 1000) {
            hardLimit.since = now;
            hardLimit.count = 0;
        }
        if (++hardLimit.count > 2000) {
            connection.closeReason = 'rate limit (>2000 msg/s)';
            connection.close(1008, 'Demasiados mensajes');
            return;
        }

        let message;
        try {
            message = JSON.parse(text);
        } catch {
            connection.sendJson({ t: 'error', code: 'BAD_MESSAGE', message: 'Mensaje inválido.' });
            return;
        }

        if (!message || typeof message !== 'object' || Array.isArray(message)) {
            connection.sendJson({ t: 'error', code: 'BAD_MESSAGE', message: 'Mensaje inválido.' });
            return;
        }

        switch (message.t) {
            case 'create': {
                const room = rooms.create(connection);
                if (room) console.log(`  Sala ${room.code} creada`);
                break;
            }
            case 'join': {
                const room = rooms.join(connection, message.code);
                if (room) console.log(`  Sala ${room.code}: rival conectado`);
                break;
            }
            case 'relay': {
                // Ambos lados aplican siempre el último mensaje recibido, así que
                // descartar excedentes no rompe la partida.
                relayBucket.tokens = Math.min(relayBucket.max, relayBucket.tokens + (now - relayBucket.last) / 1000 * relayBucket.rate);
                relayBucket.last = now;
                if (relayBucket.tokens >= 1) {
                    relayBucket.tokens -= 1;
                    rooms.relay(connection, message.d);
                }
                break;
            }
            case 'leave':
                rooms.leave(connection);
                break;
            case 'ping':
                connection.sendJson({ t: 'pong', ts: message.ts });
                break;
            default:
                connection.sendJson({ t: 'error', code: 'BAD_MESSAGE', message: 'Tipo de mensaje desconocido.' });
        }
    });

    connection.on('close', () => {
        connections.delete(connection);
        const room = connection.roomCode ? ` sala ${connection.roomCode} (${connection.role || '?'})` : '';
        console.log(`  Conexion cerrada${room}${connection.closeReason ? ` motivo: ${connection.closeReason}` : ''}`);
        rooms.leave(connection);
    });
});

startHeartbeat(connections);
setInterval(() => rooms.cleanup(), 30000).unref();

function shutdown(signal) {
    console.log(`\n  Cerrando servidor (${signal})...`);
    for (const connection of connections) {
        try { connection.close(1001, 'servidor apagado'); } catch {}
    }
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 1500).unref();
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// Diagnóstico: registrar errores no capturados en vez de morir en silencio.
process.on('uncaughtException', error => {
    console.error(`  ERROR NO CAPTURADO: ${error && error.stack || error}`);
});
process.on('unhandledRejection', reason => {
    console.error(`  RECHAZO NO MANEJADO: ${reason && reason.stack || reason}`);
});

function serveFile(req, res, filePath, stat) {
    const ext = path.extname(filePath).toLowerCase();
    const isAsset = filePath.startsWith(path.join(ROOT, 'assets') + path.sep);
    res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Content-Length': stat.size,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': isAsset ? 'public, max-age=3600' : 'no-cache'
    });

    if (req.method === 'HEAD') {
        res.end();
        return;
    }

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
}

function lanAddresses() {
    const addresses = [];
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
                addresses.push({ name, address: net.address });
            }
        }
    }
    return addresses;
}

server.listen(PORT, HOST, () => {
    console.log('');
    console.log('  CABEZONES DE LA TEC - SERVIDOR LOCAL');
    console.log('');
    console.log(`  Local:  http://localhost:${PORT}`);
    for (const { name, address } of lanAddresses()) {
        console.log(`  Red:    http://${address}:${PORT}  (${name})`);
    }
    console.log('');
    console.log('  Abri una de esas direcciones desde otra PC o celular');
    console.log('  conectado a la misma red. Ctrl+C para detener.');
    console.log('');
    console.log('  Salas LAN: 4 caracteres, sin instalar nada mas.');
    console.log('');
});

server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
        console.error(`El puerto ${PORT} ya esta en uso. Proba con otro:`);
        console.error(`  PORT=3001 npm start`);
    } else {
        console.error(error);
    }
    process.exitCode = 1;
});
