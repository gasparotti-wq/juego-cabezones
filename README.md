# Cabezones de la Tec

Fútbol arcade 2D de cabezones, hecho con HTML, CSS y JavaScript puro. Tiene modos locales (CPU, 1 vs 1 y torneos) y un modo **JUGAR EN LAN** con salas automáticas por WebSocket.

## Estado actual

- El juego funciona y ya se probó una partida real entre dos computadoras.
- La conexión puede variar mucho según la red local. En el partido aparece un indicador **LAN BUENA / REGULAR / MALA** con la latencia medida.
- El anfitrión simula el partido y el invitado dibuja lo que recibe. El servidor solo administra salas y retransmite mensajes.
- Todavía no hay reconexión: si alguien se desconecta, la partida termina y hay que volver a crear la sala.

## Requisitos

- Node.js 18 o superior.
- Un navegador moderno (Chrome, Edge, Firefox o Safari).
- **No hace falta `npm install`**: el servidor y el protocolo WebSocket están escritos sin dependencias.

Las imágenes, la fuente y el servidor funcionan de forma local. El modo LAN usa la red local, no internet.

## Cómo iniciar

```bash
npm start
```

El servidor muestra las direcciones disponibles:

```
  Local:  http://localhost:3000
  Red:    http://10.0.3.124:3000  (Wi-Fi)
```

- En la misma PC, abrí la dirección **Local**.
- Desde otra PC o celular conectado a la misma red, abrí la dirección **Red**.
- Si Windows pregunta por el firewall, permití Node.js en **redes privadas**.

Para desarrollo, con recarga automática del servidor:

```bash
npm run dev
```

Si el puerto 3000 está ocupado:

```bash
PORT=3001 npm start
```

En PowerShell:

```powershell
$env:PORT=3001
npm start
```

## Controles

| Acción | Jugador 1 | Jugador 2 |
| --- | --- | --- |
| Mover | A / D | ← / → |
| Saltar | W | ↑ |
| Patear | F (o G / Espacio) | Enter, punto o 0 |
| Súper | Mantener patear hasta llenar la barra | Mantener patear hasta llenar la barra |
| Pausa | P o Esc | P o Esc |

El súper no tiene tecla propia: se carga manteniendo el botón de patear. En los modos contra la CPU se puede usar cualquiera de los dos conjuntos de teclas. En pantallas táctiles aparecen los controles en pantalla.

## Modos

- 1 vs CPU, con dificultad fácil, normal o difícil.
- 1 vs 1 local.
- Torneo contra la CPU.
- Torneo 1 vs 1 con 2, 4 u 8 jugadores humanos; la CPU completa el cuadro.
- **Jugar en LAN** 1 vs 1: un jugador crea la sala y comparte un código de 4 caracteres.
- Ajustes de duración, goles para ganar, música, efectos y controles táctiles.
- 4 estadios, 14 personajes, power-ups, súper tiros, repeticiones, muerte súbita y estadísticas.

## Cómo jugar en LAN

1. Los dos abren el juego desde el servidor (`http://IP:3000`).
2. Uno elige **JUGAR EN LAN → CREAR SALA**. Aparece un código de 4 caracteres (por ejemplo `K7Q2`) y un botón para copiarlo.
3. El otro elige **JUGAR EN LAN → UNIRME**, escribe el código y toca **UNIRME**.
4. El anfitrión configura duración y goles, y cada uno elige su personaje. Cuando el anfitrión elige el estadio, empieza el partido.
5. Al terminar, el anfitrión puede pedir **REVANCHA**. Si alguien sale, el otro recibe el aviso y vuelve al menú.

No se copian códigos largos ni se configura nada: la sala se crea y se une sola.

## Si la conexión va mal

El indicador de la esquina superior izquierda muestra la calidad estimada y la latencia:

| Indicador | Latencia aproximada | Qué significa |
| --- | --- | --- |
| LAN BUENA | menos de 70 ms | La red responde bien. |
| LAN REGULAR | entre 70 y 140 ms | Puede haber tirones o pequeños retrasos. |
| LAN MALA | más de 140 ms o mucha variación | La partida se va a sentir pesada. |

Checklist para mejorar la conexión:

1. **Usá cable en el anfitrión** si se puede. Todo el estado del partido sale de su PC.
2. Preferí **Wi-Fi de 5 GHz**. La banda de 2.4 GHz suele estar saturada.
3. Acercá las dos computadoras al router y evitá paredes gruesas.
4. Cerrá descargas, videos en 4K y otras aplicaciones que usen la red.
5. Evitá VPN y redes de invitados con aislamiento de clientes.
6. Verificá que las dos PCs estén en la **misma red** y que el firewall permita Node.js en redes privadas.
7. Si una PC usa Wi-Fi y la otra también, probá con una por cable para descartar la mitad del problema.
8. Desde otro dispositivo, abrí `http://IP:3000/health`. Debería responder algo como:

```json
{"ok":true,"uptime":120,"connections":2,"rooms":1,"players":2}
```

Si el servidor responde pero la partida va mal, el problema está en la red o en el netcode, no en el servidor.

### Síntomas y causas probables

- **Se congela un momento y sigue**: pico de latencia o jitter del Wi-Fi.
- **Los jugadores se mueven a saltos**: pérdida de paquetes o mucha variación.
- **Aparece “SE CORTÓ LA PARTIDA”**: pasaron más de 6 segundos sin datos del rival.
- **No se puede crear o unir la sala**: firewall, IP equivocada o servidor apagado.
- **El código no existe**: los dos están usando servidores distintos.

## Cómo funciona el modo LAN

La partida es **1 contra 1 con el anfitrión autoritativo**: el navegador del anfitrión simula el partido y envía instantáneas (posiciones, marcador, power-ups, efectos) al invitado, que solo dibuja e interpola. El invitado manda sus entradas (izquierda, derecha, salto, patada) al anfitrión.

El servidor solo administra salas y retransmite mensajes entre los dos jugadores:

- Un solo puerto (3000) sirve los archivos del juego y el WebSocket en la ruta `/ws`.
- Códigos de sala de 4 caracteres con un alfabeto sin letras ambiguas (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`).
- Máximo 2 jugadores por sala y hasta 250 salas simultáneas.
- Las salas vacías se limpian solas (TTL de 2 horas, revisión cada 30 segundos).
- Mensajes de hasta 16 KB, con límite de 2000 mensajes por segundo y descarte de retransmisiones excedentes (150 por segundo) para tolerar picos sin cortar la partida.
- Latido cada 20 segundos: si un jugador deja de dar señales durante 60 segundos, se libera la sala y el rival recibe el aviso.
- `GET /health` devuelve un resumen del servidor para diagnóstico.

Para que la partida aguante redes flojas:

- El anfitrión manda instantáneas a **30 Hz** y baja a **20 Hz** si detecta latencia o acumulación.
- El invitado manda entradas a **50 Hz** y baja a **30 Hz** en las mismas condiciones.
- El invitado extrapola un poco entre instantáneas y suaviza el salto cuando llega una nueva.
- Si el rival deja de mandar datos durante 6 segundos, se muestra un aviso claro en vez de dejar la pantalla congelada.

### Protocolo (resumen)

Mensajes JSON del cliente al servidor:

| Tipo | Contenido | Uso |
| --- | --- | --- |
| `create` | — | Crea una sala y devuelve el código. |
| `join` | `code` | Entra a una sala existente. |
| `relay` | `d` | Retransmite un mensaje al rival. |
| `leave` | — | Sale de la sala. |
| `ping` | `ts` | Mide latencia (responde `pong`). |

Mensajes del servidor al cliente: `room` (código y rol), `peer` (`joined`/`left`), `relay`, `pong` y `error` (con `code` como `ROOM_NOT_FOUND`, `ROOM_FULL`, `BAD_CODE`, etc.).

Dentro del `relay` viajan los mensajes del juego: `pick`, `start`, `over`, `k` (estado del anfitrión) e `i` (entrada del invitado).

## Pruebas

```bash
npm run check   # valida la sintaxis de servidor y cliente
npm test        # tests de salas, relay y limpieza (node --test)
```

## Estructura

```
index.html              Página principal
styles.css              Estilos y fuente local
client/game.js          Lógica, dibujo, audio y modo LAN
client/net.js           Transporte WebSocket del cliente (crear/unirse/relay)
server/index.js         Servidor HTTP estático + WebSocket en el mismo puerto
server/ws.js            Implementación WebSocket (RFC 6455) sin dependencias
server/rooms.js         Salas de 4 caracteres, relay y limpieza
test/rooms.test.js      Pruebas de las salas y el relay
assets/heads/           Retratos de los 14 personajes
assets/fonts/           Fuente Press Start 2P
legacy/                 Versiones anteriores de un solo archivo
```

## Desarrollo y pruebas

```bash
npm run check   # valida la sintaxis de todos los JS
npm test        # prueba salas, relay, límites y limpieza
npm start       # levanta el juego
```

Para probar el modo LAN en una sola PC, abrí el juego en dos navegadores distintos (o dos perfiles) y usá **CREAR SALA** en uno y **UNIRME** en el otro.

## Próximos pasos

Ordenados por impacto y esfuerzo:

1. **Diagnóstico de red más completo**: guardar ping/jitter, contar instantáneas perdidas y mostrar un resumen al final del partido.
2. **Reconexión y pausa por desconexión**: dar unos segundos para volver a la sala sin perder el partido.
3. **Predicción del invitado**: que su jugador responda al instante y se corrija con las instantáneas del anfitrión.
4. **Servidor autoritativo real**: extraer la simulación a `shared/` y correrla en Node, dejando al cliente solo como render + entrada.
5. **Optimizar el ancho de banda**: instantáneas binarias o delta para redes muy flojas.
6. **Espectadores y torneos LAN**.
7. **Pruebas automáticas de integración** con dos navegadores.

## Créditos

Hecho en la Tec con mucho cariño.
