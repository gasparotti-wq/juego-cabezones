# Cabezones de la Tec - Online

Fútbol arcade 2D de cabezones, hecho con HTML, CSS y JavaScript puro. Incluye modos locales (CPU, 1 vs 1, torneos) y un modo **JUGAR ONLINE** por WebRTC.

## Requisitos

- Node.js 18 o superior.
- Un navegador moderno (Chrome, Edge, Firefox o Safari).

Las imágenes y la fuente funcionan de forma local. El modo online usa servidores STUN públicos de Google, así que necesita conexión a internet.

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

El súper ya no tiene tecla propia: se carga manteniendo el botón de patear. En los modos contra la CPU se puede usar cualquiera de los dos conjuntos de teclas. En pantallas táctiles aparecen los controles en pantalla.

## Modos

- 1 vs CPU, con dificultad fácil, normal o difícil.
- 1 vs 1 local.
- Torneo contra la CPU.
- Torneo 1 vs 1 con 2, 4 u 8 jugadores humanos; la CPU completa el cuadro.
- **Jugar online** 1 vs 1: un jugador crea la sala, copia el código y se lo pasa al otro, que lo pega para conectarse.
- Ajustes de duración, goles para ganar, música, efectos y controles táctiles.
- 4 estadios, 14 personajes, power-ups, súper tiros, repeticiones, muerte súbita y estadísticas.

### Sobre el modo online

Por ahora usa WebRTC entre pares con intercambio manual de códigos (no hay salas automáticas). Para jugar en la misma red:

1. Los dos abren el juego desde el servidor (`http://IP:3000`).
2. Uno elige **JUGAR ONLINE → CREAR** y comparte el código.
3. El otro elige **JUGAR ONLINE → UNIRSE**, pega el código y responde con el suyo.

La próxima fase reemplaza este intercambio manual por salas LAN automáticas con un servidor WebSocket autoritativo.

## Estructura

```
index.html              Página principal
styles.css              Estilos y fuente local
client/game.js          Lógica, dibujo, audio y modo online
assets/heads/           Retratos de los 14 personajes
assets/fonts/           Fuente Press Start 2P
server/index.js         Servidor estático para jugar en red
legacy/cabezones_online.html  Versión original de un solo archivo (base de esta reorganización)
legacy/head_soccer_pro.html   Versión anterior, sin modo online
```

## Estado del proyecto

**Fase 1 lista:** el juego correcto (con modo online) está separado en archivos, con assets y fuente locales, y se sirve desde un servidor estático accesible en toda la red.

Próximas fases:

1. Extraer la simulación a `shared/` para que cliente y servidor usen el mismo código.
2. Agregar salas LAN automáticas con WebSocket y servidor autoritativo.
3. Interfaz de sala (crear/unirse, listo, elegir personaje) y reconexión.

## Créditos

Hecho en la Tec con mucho cariño.
