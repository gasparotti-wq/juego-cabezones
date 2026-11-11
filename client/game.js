const ROSTER = [
        { id: 1, name: 'Juan "El Caniche" Prochetto', nickname: 'EL CANICHE', color: '#ff595e', skinColor: '#fcd5ce', hairColor: '#ffffff', style: 'curly', stripeColor: '#ffffff', badge: '🐩', headScale: 0.985, headSrc: 'assets/heads/01.png' },
        { id: 2, name: 'Agustín "El Ñandú" Gasparotti', nickname: 'EL ÑANDÚ', color: '#ffca3a', skinColor: '#e8b89e', hairColor: '#3a2e28', style: 'spiky', stripeColor: '#000000', badge: '🦩', headFlip: true, headScale: 0.983, headSrc: 'assets/heads/02.png' },
        { id: 3, name: 'Bruno "El Dictador" Della Flora', nickname: 'EL DICTADOR', color: '#8ac926', skinColor: '#fcd5ce', hairColor: '#2b211e', style: 'beard', stripeColor: '#ffffff', badge: '🎖️', headFlip: true, headScale: 1.04, headSrc: 'assets/heads/03.png' },
        { id: 4, name: 'Lolo "El Bobinado" Rivero', nickname: 'EL BOBINADO', color: '#1982c4', skinColor: '#c58c67', hairColor: '#111111', style: 'cap', stripeColor: '#ff0000', badge: '🧢', headScale: 1.027, headSrc: 'assets/heads/04.png' },
        { id: 5, name: 'Lauti "Gagá" Gabutti', nickname: 'GAGÁ', color: '#6a4c93', skinColor: '#fcd5ce', hairColor: '#8a624a', style: 'messy', stripeColor: '#ffd166', badge: '🤪', headScale: 1.105, headSrc: 'assets/heads/05.png' },
        { id: 6, name: 'Mateo "La Calesita" Donna', nickname: 'LA CALESITA', color: '#f15bb5', skinColor: '#e8b89e', hairColor: '#c08552', style: 'headband', stripeColor: '#00f5d4', badge: '🎠', headScale: 1.016, headSrc: 'assets/heads/06.png' },
        { id: 7, name: 'Pedro "El Sexoso" Capella', nickname: 'EL SEXOSO', color: '#00bbf9', skinColor: '#fcd5ce', hairColor: '#000000', style: 'slick', stripeColor: '#ff007f', badge: '🔥', headScale: 1.069, headSrc: 'assets/heads/07.png' },
        { id: 8, name: 'Tomás "El Electrónico" Bork', nickname: 'EL ELECTRÓNICO', color: '#00f5d4', skinColor: '#c58c67', hairColor: '#333333', style: 'visor', stripeColor: '#000000', badge: '⚡', headScale: 1.129, headSrc: 'assets/heads/08.png' },
        { id: 9, name: 'Bautista "La Babosa" Bessone', nickname: 'LA BABOSA', color: '#fee440', skinColor: '#fcd5ce', hairColor: '#5e4334', style: 'flat', stripeColor: '#7209b7', badge: '🐌', headFlip: true, headScale: 1.016, headSrc: 'assets/heads/09.png' },
        { id: 10, name: 'Joaquín "El Paja" Franco', nickname: 'EL PAJA', color: '#9b5de5', skinColor: '#e8b89e', hairColor: '#7c5f4d', style: 'messy', stripeColor: '#ffffff', badge: '🦥', headScale: 1.032, headSrc: 'assets/heads/10.png' },
        { id: 11, name: 'Facundo "Floresrica" Porta', nickname: 'FLORESRICA', color: '#f1c0e8', skinColor: '#fcd5ce', hairColor: '#2b211e', style: 'flower', stripeColor: '#ff007f', badge: '🌸', headScale: 1.03, headSrc: 'assets/heads/11.png' },
        { id: 12, name: 'Pepa "El Matero" Ocampo', nickname: 'EL MATERO', color: '#ff99c8', skinColor: '#e8b89e', hairColor: '#000000', style: 'mate', stripeColor: '#3a5a40', badge: '🧉', headScale: 1.019, headSrc: 'assets/heads/12.png' },
        { id: 13, name: 'Vale "Gargamel" Ricca', nickname: 'GARGAMEL', color: '#a3c4f3', skinColor: '#c58c67', hairColor: '#ffffff', style: 'bald', stripeColor: '#1d3557', badge: '🧙', headScale: 1.1, headSrc: 'assets/heads/13.png' },
        { id: 14, name: 'Álvaro "Chupetín" López', nickname: 'CHUPETÍN', color: '#cfbaf0', skinColor: '#fcd5ce', hairColor: '#4f3b2f', style: 'lollipop', stripeColor: '#f72585', badge: '🍭', headScale: 1.006, headSrc: 'assets/heads/14.png' }
    ];

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const uiMenu = document.getElementById('ui-menu');
    const uiSelect = document.getElementById('ui-select');
    const uiGameover = document.getElementById('ui-gameover');
    const uiHud = document.getElementById('hud');
    const uiPause = document.getElementById('ui-pause');

    const CW = canvas.width, CH = canvas.height, GROUND_Y = 620;
    const GRAVITY = 0.6, BALL_GRAVITY = 0.32, FRICTION = 0.85;
    const PLAYER_RADIUS = 44, FOOT_SIZE = 20, BASE_JUMP_FORCE = 14.5, MOVE_SPEED = 7;
    const BALL_RADIUS = 22, BALL_BOUNCE = 0.85, MAX_BALL_SPEED = 30;
    let MAX_GOALS = 5, MATCH_DURATION = 150;
    const GOAL_W = 150, GOAL_H = 210, POST_RADIUS = 10;
    const SUPER_CHARGE = 45, MAX_CHARGE = 60, STEP = 1000 / 60;

    const rnd = (a, b) => a + Math.random() * (b - a);
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const de = n => n.startsWith('EL ') ? 'DEL ' + n.slice(3) : 'DE ' + n;
    const al = n => n.startsWith('EL ') ? 'AL ' + n.slice(3) : 'A ' + n;

    const SUPERS = [
        { name: 'FUEGO', ang: 0.18, spd: 27, col: '#ff006e' },
        { name: 'COHETE', ang: 0.8, spd: 26, col: '#ffb703' },
        { name: 'CURVA', ang: 0.42, spd: 24, col: '#7209b7', curve: true }
    ];
    const PU_TYPES = {
        superJump: ['SALTO LOCO', 300], freeze: ['CONGELAR', 180], giantGoal: ['ARCO GIGANTE', 300],
        speedBoost: ['TURBO', 300], bigBall: ['PELOTÓN', 260], moon: ['GRAVEDAD LUNAR', 320]
    };

    const crowd = [];
    const fanCols = ['#8e44ad', '#c0392b', '#e84393', '#2980b9', '#f1c40f', '#ecf0f1', '#e67e22', '#5b3cc4'];
    const fanSkins = ['#fcd5ce', '#e8b89e', '#c58c67', '#8d5524'];
    for (let row = 0; row < 11; row++) for (let x = -10 + (row % 2) * 12; x < CW; x += 24 + Math.random() * 6)
        crowd.push({ x: x + rnd(-3, 3), y: 185 + row * 25, s: 8 + row * 0.6, c: pick(fanCols), sk: pick(fanSkins), js: 0.003 + Math.random() * 0.007 });

    let confetti = [];
    function spawnConfetti() {
        const cols = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#f15bb5', '#00f5d4', '#ffffff'];
        confetti = Array.from({ length: 200 }, () => ({ x: CW / 2 + rnd(-60, 60), y: CH / 2 + rnd(-30, 30), vx: rnd(-9, 9), vy: rnd(-14, 2) - 4, size: rnd(6, 14), color: pick(cols), rot: rnd(0, 360), rs: rnd(-7, 7) }));
    }

    let gameState = 'MENU', currentMode = 'PVP', selectingPlayer = 1, p1Choice = null, p2Choice = null;
    let player1, player2, ball, activePowerup = null, lastTouch = null, prevTouch = null;
    let p1Score = 0, p2Score = 0, timeRemaining = MATCH_DURATION, tickFrames = 0, suddenDeath = false;
    let pauseFrames = 0, pendingEnd = false, goalInfo = ['', ''], banner = { text: '', timer: 0, color: '#fff' };
    let goalH = [GOAL_H, GOAL_H], goalTarget = [GOAL_H, GOAL_H], gravityMul = 1, barCooldown = 0, matchFrames = 0;
    let boxTimer = 200, lastBoxType = '', goalSide = -1, flashT = 0, flashCol = '#fff';
    const PU_STYLE = { superJump: ['#06d6a0', '▲'], freeze: ['#90e0ef', '❄'], giantGoal: ['#ffd166', '▣'], speedBoost: ['#ef476f', '»'], bigBall: ['#ffffff', '●'], moon: ['#b8c0ff', '☾'] };
    let fx = [], shake = 0, countdown = 0, sfxOff = false, musicOff = false, actx = null;
    const net = { on: false, host: false, active: false, code: '', role: '', myChar: null, otherChar: null, stSel: false, rq: 0, iq: 0, lastN: 0, sq: 0, since: 0, base: null, correction: null, lastInputAt: 0, lastSnapAt: 0, lastSnapRecvAt: 0, lastRemoteAt: 0, statusAt: 0, remote: { left: false, right: false, jump: false, kickHold: false } };
    let netEv = [];
    try { sfxOff = localStorage.getItem('cdt_sfx') === '0'; musicOff = localStorage.getItem('cdt_music') === '0'; } catch (e) {}
    let stats = [], rec = [], replayData = null, replayI = 0, musicOn = false, mStep = 0;
    const newStats = () => [0, 1].map(() => ({ g: 0, k: 0, s: 0, b: 0, p: 0 }));
    function burst(x, y, col, n = 8, sp = 5) { if (net.on && net.host) netEv.push(['b', Math.round(x), Math.round(y), col, n, sp]); for (let i = 0; i < n; i++) fx.push({ x, y, vx: rnd(-sp, sp), vy: rnd(-sp, sp * 0.3), life: rnd(18, 36), col, s: rnd(3, 7) }); }
    function sfx(k) {
        if (net.on && net.host) netEv.push(['f', k]);
        if (sfxOff) return;
        try {
            actx = actx || new (window.AudioContext || window.webkitAudioContext)();
            const P = { kick: [180, 0.08, 'square'], super: [90, 0.35, 'sawtooth'], bar: [520, 0.12, 'triangle'], goal: [440, 0.7, 'square'], pu: [660, 0.2, 'sine'], whistle: [1500, 0.35, 'sine'], bounce: [140, 0.05, 'sine'] }[k];
            const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime;
            o.type = P[2]; o.frequency.setValueAtTime(P[0], t); if (k === 'goal' || k === 'pu') o.frequency.linearRampToValueAtTime(P[0] * 1.8, t + P[1]);
            g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.0001, t + P[1]);
            o.connect(g); g.connect(actx.destination); o.start(); o.stop(t + P[1]);
        } catch (e) {}
    }
    function tone(f, d, type, v) {
        if (musicOff) return;
        try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.value = f; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g); g.connect(actx.destination); o.start(); o.stop(t + d); } catch (e) {}
    }
    const LEAD = [440, 523, 659, 523, 440, 523, 784, 659, 349, 440, 523, 440, 392, 494, 587, 494], BASS = [110, 110, 87.3, 87.3, 130.8, 130.8, 98, 98];
    function startMusic() { if (musicOn) return; musicOn = true; setInterval(() => { if (musicOff || gameState === 'PAUSED') return; const i = mStep++ % 16; tone(LEAD[i], 0.18, 'square', 0.02); if (i % 2 === 0) tone(BASS[i >> 1], 0.3, 'triangle', 0.05); }, 170); }
    function refreshAudioUI() { document.getElementById('music-btn').classList.toggle('off', musicOff); document.getElementById('sfx-btn').classList.toggle('off', sfxOff); }
    function toggleMusic() { musicOff = !musicOff; try { localStorage.setItem('cdt_music', musicOff ? '0' : '1'); } catch (e) {} refreshAudioUI(); }
    function toggleSfx() { sfxOff = !sfxOff; try { localStorage.setItem('cdt_sfx', sfxOff ? '0' : '1'); } catch (e) {} refreshAudioUI(); if (!sfxOff) sfx('kick'); }

    const keys = {};
    window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
    window.addEventListener('keydown', e => { if (e.target && e.target.tagName === 'TEXTAREA') return; keys[e.code] = true; if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Slash'].includes(e.code)) e.preventDefault(); if ((e.code === 'KeyP' || e.code === 'Escape') && !e.repeat) togglePause(); if (gameState === 'REPLAY' && !e.repeat && ['Space', 'Enter', 'KeyF'].includes(e.code)) endReplay(); });
    window.addEventListener('keyup', e => { keys[e.code] = false; });

    function announce(text, color = '#ffb703') { if (net.on && net.host) netEv.push(['a', text, color]); banner = { text, timer: 150, color }; }
    function ring(x, y, col, life) { fx.push({ ring: true, x, y, vx: 0, vy: 0, life, col }); if (net.on && net.host) netEv.push(['g', Math.round(x), Math.round(y), col, life]); }
    function touch(p) { if (lastTouch !== p) { prevTouch = lastTouch; lastTouch = p; } }

    // Colisión círculo vs travesaño (cápsula). Evita atravesarlo y rebota arriba, abajo y por el borde.
    function barCollide(o, rest) {
        let hit = false;
        for (let s = 0; s < 2; s++) {
            const by = GROUND_Y - goalH[s];
            const cx = Math.max(s ? CW - GOAL_W : 0, Math.min(s ? CW : GOAL_W, o.x));
            let dx = o.x - cx, dy = o.y - by, d = Math.hypot(dx, dy);
            const min = o.radius + POST_RADIUS;
            if (d < min) {
                if (d === 0) { dx = 0; dy = -1; d = 1; }
                const nx = dx / d, ny = dy / d;
                o.x += nx * (min - d); o.y += ny * (min - d);
                const vn = o.vx * nx + o.vy * ny;
                if (vn < 0) { o.vx -= (1 + rest) * vn * nx; o.vy -= (1 + rest) * vn * ny; }
                if (o.grounded !== undefined && ny < -0.5) { o.grounded = true; if (o.vy > 0) o.vy = 0; }
                hit = true;
            }
        }
        return hit;
    }

    class PowerupBox {
        constructor() { this.size = 42; this.active = false; this.x = 0; this.y = 0; this.life = 0; this.type = 'superJump'; }
        spawn() {
            this.x = rnd(350, CW - 350); this.y = rnd(GROUND_Y - 300, GROUND_Y - 90);
            this.type = pick(Object.keys(PU_TYPES).filter(t => t !== lastBoxType)); lastBoxType = this.type;
            this.life = rnd(600, 900); this.active = true;
            burst(this.x, this.y, '#ffffff', 26, 9); ring(this.x, this.y, '#ffd166', 26); sfx('pu');
        }
        update() { if (--this.life <= 0) { this.active = false; boxTimer = rnd(200, 360); } }
        draw() {
            if (this.life < 120 && Math.floor(this.life / 6) % 2) return; // parpadea antes de desaparecer
            const t = matchFrames, y = this.y + Math.sin(t * 0.08) * 8, s2 = this.size + Math.sin(t * 0.2) * 3, hue = (t * 6) % 360;
            const g = ctx.createLinearGradient(0, 0, 0, y); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, `hsla(${hue},100%,70%,0.4)`);
            ctx.fillStyle = g; ctx.fillRect(this.x - 14, 0, 28, y);
            ctx.fillStyle = `hsla(${hue},100%,60%,0.28)`; ctx.beginPath(); ctx.arc(this.x, y, s2 * 1.25 + Math.sin(t * 0.3) * 5, 0, 7); ctx.fill();
            ctx.save(); ctx.translate(this.x, y); ctx.rotate(Math.sin(t * 0.05) * 0.4);
            ctx.shadowColor = `hsl(${hue},100%,60%)`; ctx.shadowBlur = 22; ctx.fillStyle = `hsl(${hue},95%,55%)`; rr(-s2 / 2, -s2 / 2, s2, s2, 9); ctx.fill();
            ctx.shadowBlur = 0; ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.font = '24px "Press Start 2P", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 0, 3); ctx.restore();
            ctx.fillStyle = '#fff'; for (let k = 0; k < 4; k++) { const a = t * 0.07 + k * 1.571; ctx.fillRect(this.x + Math.cos(a) * 38 - 2, y + Math.sin(a) * 38 - 2, 5, 5); }
        }
    }

    class Player {
        constructor(x, isP1, data, isCPU) {
            this.startX = x; this.x = x; this.y = GROUND_Y - PLAYER_RADIUS; this.vx = 0; this.vy = 0;
            this.radius = PLAYER_RADIUS; this.isP1 = isP1; this.isCPU = isCPU; this.data = data;
            this.facing = isP1 ? 1 : -1; this.kickAnimTimer = 0; this.kickCooldown = 0; this.chargeTimer = 0;
            this.grounded = true; this.frozen = false; this.jumpForce = BASE_JUMP_FORCE; this.moveSpeed = this.baseSpeed = MOVE_SPEED; this.cpuTarget = 12;
        }
        resetPos() {
            this.x = this.startX; this.y = GROUND_Y - this.radius; this.vx = this.vy = 0;
            this.kickAnimTimer = this.kickCooldown = this.chargeTimer = 0; this.facing = this.isP1 ? 1 : -1;
        }
        canReach() {
            // alcance generoso: mira la pelota ahora y unos cuadros adelante, y perdona si pasó un poco por encima de la cabeza
            const R = this.radius + ball.radius + 52;
            for (const k of [0, 2, 4]) {
                const dx = ball.x + ball.vx * k - (this.x + this.vx * k), dy = ball.y + ball.vy * k - this.y;
                if (Math.hypot(dx, dy) < R && dx * this.facing > -this.radius * 0.8) return true;
            }
            return false;
        }
        getInputs() {
            if (this.frozen) return { left: false, right: false, jump: false, kickHold: false };
            if (net.on) return this.isP1 === net.host ? localInput() : net.remote;
            if (!this.isCPU) {
                const any = a => a.some(c => keys[c]);
                const s1 = { left: any(['KeyA']), right: any(['KeyD']), jump: any(['KeyW']), kickHold: any(['KeyF', 'KeyG', 'Space']) };
                const s2 = { left: any(['ArrowLeft']), right: any(['ArrowRight']), jump: any(['ArrowUp']), kickHold: any(['Enter', 'NumpadEnter', 'Numpad0', 'Period', 'Slash', 'ShiftRight']) };
                if (!this.isP1) return s2;
                return currentMode === 'CPU' ? { left: s1.left || s2.left, right: s1.right || s2.right, jump: s1.jump || s2.jump, kickHold: s1.kickHold || s2.kickHold } : s1;
            }
            const i = { left: false, right: false, jump: false, kickHold: false };
            const L = this.lvl === undefined ? 1 : this.lvl;
            if (!this.thinkT || --this.thinkT <= 0) { this.thinkT = [16, 8, 3][L]; this.noise = rnd(-1, 1) * [90, 40, 8][L]; }
            const atk = this.isP1 ? 1 : -1, dx = (ball.x + this.noise - atk * 48) - this.x; // se ubica detrás de la pelota
            if (dx < -14) i.left = true; else if (dx > 14) i.right = true; else this.facing = atk;
            if (ball.y - this.y < -60 && Math.abs(ball.x - this.x) < [110, 150, 190][L]) i.jump = true;
            if (this.facing === atk && this.canReach()) i.kickHold = this.chargeTimer < this.cpuTarget;
            return i;
        }
        update() {
            if (this.buf) { if (this.kickCooldown <= 0 && this.canReach()) { const b = this.buf; this.buf = null; this.executeKick(b.sup); } else if (--this.buf.t <= 0) this.buf = null; }
            const inp = this.getInputs(); let mv = false;
            if (!this.frozen) {
                if (inp.left) { this.vx -= 1.5; this.facing = -1; mv = true; }
                if (inp.right) { this.vx += 1.5; this.facing = 1; mv = true; }
                this.vx = Math.max(-this.moveSpeed, Math.min(this.moveSpeed, this.vx));
                if (inp.jump && this.grounded) { this.vy = -this.jumpForce; this.grounded = false; }
                if (inp.kickHold) { if (this.chargeTimer < MAX_CHARGE) this.chargeTimer++; }
                else if (this.chargeTimer > 0) {
                    this.executeKick(this.chargeTimer >= SUPER_CHARGE); this.chargeTimer = 0;
                    this.cpuTarget = Math.random() < [0.05, 0.18, 0.3][this.lvl === undefined ? 1 : this.lvl] ? SUPER_CHARGE + 3 : pick([3, 8, 15, 30]);
                }
            } else this.chargeTimer = 0;
            if (!mv) this.vx *= FRICTION;
            this.vy += GRAVITY * gravityMul; this.x += this.vx; this.y += this.vy; this.grounded = false;
            if (this.y + this.radius >= GROUND_Y) { this.y = GROUND_Y - this.radius; this.vy = 0; this.grounded = true; }
            if (this.x - this.radius < 0) { this.x = this.radius; this.vx = 0; }
            if (this.x + this.radius > CW) { this.x = CW - this.radius; this.vx = 0; }
            if (this.y - this.radius < 0) { this.y = this.radius; this.vy = Math.max(0, this.vy); }
            barCollide(this, 0);
            if (this.kickCooldown > 0) this.kickCooldown--;
            if (this.kickAnimTimer > 0) this.kickAnimTimer--;
        }
        executeKick(sup) {
            this.kickAnimTimer = 15;
            if (this.kickCooldown > 0 || !this.canReach()) { if (!this.buf || sup) this.buf = { sup, t: sup ? 40 : 14 }; return; }
            this.kickCooldown = 12;
            let ang = 0.75 + Math.max(-0.2, Math.min(0.35, -(ball.y - this.y) / 160)), spd = 15, v = null;
            if (sup) { v = pick(SUPERS); ang = v.ang; spd = v.spd; announce(`¡SÚPER TIRO ${v.name} ${de(this.data.nickname)}!`, v.col); }
            ball.vx = this.facing * Math.cos(ang) * spd + this.vx * 0.3;
            ball.vy = -Math.sin(ang) * spd + this.vy * 0.2;
            ball.superType = v; ball.curveDir = Math.random() < 0.5 ? -1 : 1; ball.viaBar = false;
            touch(this); stats[this.isP1 ? 0 : 1].k++; if (sup) stats[this.isP1 ? 0 : 1].s++; sfx(sup ? 'super' : 'kick'); burst(ball.x, ball.y, sup ? v.col : '#ffffff', sup ? 22 : 7, sup ? 7 : 4); if (sup) shake = 14;
        }
        draw() {
            const R = this.radius, k = R / 38, wx = this.x, wy = this.y, r = 38, f = this.facing, d = this.data, x = 0, y = 0, st = d.style, hi = headImg(d), sc = hi ? Math.min(92 / hi.naturalHeight, 88 / hi.naturalWidth) * (d.headScale || 1) : 1, up = hi ? Math.max(0, hi.naturalHeight * sc - 76) + 12 : 0;
            const air = Math.max(0, GROUND_Y - (wy + R));
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(wx, GROUND_Y + 12, 46 * Math.max(0.4, 1 - air / 450), 10, 0, 0, 7); ctx.fill();
            ctx.save(); ctx.translate(wx, wy); ctx.scale(k, k);
            // championes
            const shoe = (sx, sy, rot) => {
                ctx.save(); ctx.translate(sx, sy); ctx.scale(f, 1); ctx.rotate(rot);
                rr(-24, -13, 50, 26, 11); ctx.fillStyle = '#111'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#000'; ctx.stroke();
                ctx.fillStyle = '#fff'; rr(-24, 8, 50, 6, 3); ctx.fill();
                ctx.fillStyle = d.color; ctx.fillRect(-14, -3, 22, 5);
                ctx.fillStyle = '#e9ecef'; ctx.fillRect(2, -12, 3, 7); ctx.fillRect(9, -10, 3, 7); ctx.fillRect(16, -7, 3, 6);
                ctx.restore();
            };
            const fy = y + r - 2;
            shoe(x - f * 12, fy, 0);
            if (this.chargeTimer >= SUPER_CHARGE) { ctx.fillStyle = 'rgba(255,0,110,0.35)'; ctx.beginPath(); ctx.arc(x + f * 16, fy, 30, 0, 7); ctx.fill(); }
            if (this.kickAnimTimer > 0) shoe(x + f * 54, fy - 10, -0.5); else shoe(x + f * 14, fy, 0);
            ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = '#000';
            if (!hi) {
            // oreja
            ctx.fillStyle = d.skinColor; ctx.fillRect(x - f * (r + 2) - 4, y - 4, 8, 16); ctx.lineWidth = 3; ctx.strokeRect(x - f * (r + 2) - 4, y - 4, 8, 16);
            // cabeza
            ctx.lineWidth = 4; rr(x - r, y - r, r * 2, r * 2 - 4, 22); ctx.fillStyle = this.frozen ? '#b8e6f5' : d.skinColor; ctx.fill();
            ctx.save(); rr(x - r, y - r, r * 2, r * 2 - 4, 22); ctx.clip(); ctx.fillStyle = d.hairColor;
            if (st === 'bald') { ctx.fillRect(x - r, y - 18, 10, 26); ctx.fillRect(x + r - 10, y - 18, 10, 26); }
            else ctx.fillRect(x - r, y - r, r * 2, st === 'slick' ? 26 : st === 'flat' ? 20 : 24);
            if (st === 'beard') ctx.fillRect(x - r, y + 12, r * 2, r);
            if (st === 'headband') { ctx.fillStyle = d.stripeColor; ctx.fillRect(x - r, y - r + 24, r * 2, 10); }
            ctx.restore();
            rr(x - r, y - r, r * 2, r * 2 - 4, 22); ctx.stroke();
            ctx.fillStyle = d.hairColor;
            if (st === 'curly') for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x - r + 10 + i * (r * 2 - 20) / 4, y - r + 4, 13, 0, 7); ctx.fill(); }
            else if (st === 'spiky') for (let i = 0; i < 5; i++) { const bx = x - r + 8 + i * 15; ctx.beginPath(); ctx.moveTo(bx, y - r + 6); ctx.lineTo(bx + 7, y - r - 16); ctx.lineTo(bx + 14, y - r + 6); ctx.fill(); }
            else if (st === 'messy') { ctx.fillRect(x - 20, y - r - 8, 12, 12); ctx.fillRect(x + 4, y - r - 12, 14, 16); ctx.fillRect(x - r + 2, y - r - 4, 10, 10); ctx.fillRect(x + r - 14, y - r - 4, 12, 10); }
            else if (st === 'flower') { ctx.fillStyle = '#ff007f'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(x - f * 20 + Math.cos(i * 1.257) * 8, y - r + 6 + Math.sin(i * 1.257) * 8, 6, 0, 7); ctx.fill(); } ctx.fillStyle = '#ffd60a'; ctx.beginPath(); ctx.arc(x - f * 20, y - r + 6, 5, 0, 7); ctx.fill(); }
            else if (st === 'cap') { rr(x - r - 2, y - r - 8, r * 2 + 4, 32, 12); ctx.fillStyle = d.color; ctx.fill(); ctx.lineWidth = 3; ctx.stroke(); rr(f > 0 ? x + 6 : x - 46, y - r + 18, 40, 9, 4); ctx.fillStyle = d.stripeColor; ctx.fill(); ctx.stroke(); }
            // cara
            const ex = [x + f * 6, x + f * 26];
            ctx.lineWidth = 2;
            for (const e of ex) {
                ctx.fillStyle = '#fff'; ctx.fillRect(e - 6, y - 12, 13, 15); ctx.strokeRect(e - 6, y - 12, 13, 15);
                ctx.fillStyle = '#000'; ctx.fillRect(e + (f > 0 ? 1 : -5), y - 8, 6, 9);
                ctx.fillRect(e - 7, y - (this.chargeTimer >= SUPER_CHARGE ? 15 : 19), 15, 4);
            }
            if (st === 'visor') { ctx.fillStyle = 'rgba(0,245,212,0.55)'; ctx.fillRect(x - r + 4, y - 15, r * 2 - 8, 20); ctx.strokeRect(x - r + 4, y - 15, r * 2 - 8, 20); ctx.fillStyle = '#000'; ctx.fillRect(x + f * 12, y - r - 10, 3, 12); }
            ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(x + f * 36 - (f < 0 ? 6 : 0), y - 2, 6, 9);
            const mx = x + f * 18, open = this.kickAnimTimer > 0 || this.chargeTimer > 20;
            rr(mx - 11, y + 9, 22, open ? 16 : 10, 3); ctx.fillStyle = open ? '#000' : '#fff'; ctx.fill(); ctx.lineWidth = 3; ctx.stroke();
            if (st === 'lollipop') { ctx.beginPath(); ctx.moveTo(mx + f * 6, y + 15); ctx.lineTo(mx + f * 24, y + 3); ctx.stroke(); ctx.fillStyle = d.stripeColor; ctx.beginPath(); ctx.arc(mx + f * 26, y + 1, 12, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(mx + f * 26, y + 1, 6, 0, 7); ctx.fill(); }
            if (st === 'mate') { ctx.fillStyle = '#7f5539'; rr(x + f * (r - 4) - (f < 0 ? 16 : 0), y + 12, 16, 20, 4); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#3a5a40'; ctx.fillRect(x + f * (r - 4) - (f < 0 ? 16 : 0) + 2, y + 12, 12, 4); }
            }
            if (hi) { const hh = hi.naturalHeight * sc, hw = hi.naturalWidth * sc; ctx.save(); ctx.imageSmoothingEnabled = false; ctx.scale(d.headFlip ? -f : f, 1); ctx.drawImage(hi, -hw / 2, y + r - 2 - hh, hw, hh); ctx.restore(); }
            if (this.frozen) { ctx.fillStyle = 'rgba(144,224,239,0.5)'; rr(x - r, y - r, r * 2, r * 2 + 10, 20); ctx.fill(); }
            ctx.restore();
            // nombre y barra de carga
            ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.font = '10px "Press Start 2P"'; ctx.lineWidth = 3; ctx.strokeStyle = '#000';
            ctx.strokeText(d.nickname, wx, wy - R - 22 - up); ctx.fillStyle = this.isP1 ? '#48cae4' : '#f72585'; ctx.fillText(d.nickname, wx, wy - R - 22 - up);
            if (this.chargeTimer > 0) {
                ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(wx - 35, wy - R - 48 - up, 70, 9);
                ctx.fillStyle = this.chargeTimer >= SUPER_CHARGE ? '#ff006e' : '#ffb703';
                ctx.fillRect(wx - 33, wy - R - 46 - up, 66 * (this.chargeTimer / MAX_CHARGE), 5);
            }
        }
    }

    class Ball {
        constructor() { this.radius = BALL_RADIUS; this.angle = 0; this.curveDir = 1; this.resetPos(); }
        resetPos() { this.x = CW / 2; this.y = GROUND_Y - 260; this.vx = this.vy = 0; this.superType = null; this.viaBar = false; }
        setRadius(r) { this.radius = r; if (this.y + r > GROUND_Y) this.y = GROUND_Y - r; }
        update() {
            let sp = Math.hypot(this.vx, this.vy);
            if (sp > MAX_BALL_SPEED) { this.vx *= MAX_BALL_SPEED / sp; this.vy *= MAX_BALL_SPEED / sp; sp = MAX_BALL_SPEED; }
            this.vy += BALL_GRAVITY * gravityMul;
            if (this.superType && this.superType.curve) this.vy += Math.sin(matchFrames * 0.25) * 0.6 * this.curveDir;
            const n = Math.max(1, Math.ceil(sp / 12)); // subpasos: la pelota rápida no atraviesa nada
            for (let i = 0; i < n; i++) {
                this.x += this.vx / n; this.y += this.vy / n;
                this.collide();
                hitPlayer(player1, this); hitPlayer(player2, this);
            }
            this.vx *= 0.996; this.vy *= 0.996;
            if (this.y + this.radius >= GROUND_Y - 0.5) this.vx *= 0.99;
            this.angle += this.vx / this.radius * 0.5;
        }
        collide() {
            const r = this.radius;
            if (this.y + r > GROUND_Y) {
                this.y = GROUND_Y - r;
                if (this.vy > 2.5) { if (this.vy > 6) { burst(this.x, GROUND_Y, '#d8d8d8', 5, 3); sfx('bounce'); } this.vy *= -BALL_BOUNCE; this.superType = null; } else this.vy = 0;
            }
            if (this.y - r < 0) { this.y = r; this.vy *= -BALL_BOUNCE; }
            const left = this.x - r < 0, right = this.x + r > CW;
            if (left || right) { // el fondo de la red amortigua; el resto de la pared rebota normal
                const s = left ? 0 : 1, e = this.y > GROUND_Y - goalH[s] ? 0.2 : BALL_BOUNCE;
                this.x = left ? r : CW - r; this.vx *= -e;
            }
            if (barCollide(this, 0.72)) {
                this.viaBar = true;
                if (barCooldown <= 0 && Math.hypot(this.vx, this.vy) > 9) {
                    barCooldown = 90; sfx('bar'); shake = 6; if (lastTouch) stats[lastTouch.isP1 ? 0 : 1].b++;
                    announce(lastTouch ? `¡AL TRAVESAÑO! CASI GOL ${de(lastTouch.data.nickname)}` : '¡AL TRAVESAÑO!', '#ffd166');
                }
            }
        }
        draw() {
            const r = this.radius, st = this.superType, h = Math.max(0, GROUND_Y - (this.y + r));
            ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.beginPath(); ctx.ellipse(this.x, GROUND_Y + 6, r * Math.max(0.35, 1 - h / 600), 6, 0, 0, 7); ctx.fill();
            ctx.save(); ctx.translate(this.x, this.y);
            if (st) {   // estela de color del súper tiro
                for (let k = 3; k >= 1; k--) { ctx.fillStyle = st.col + (k === 3 ? '33' : k === 2 ? '55' : '88'); ctx.beginPath(); ctx.arc(-this.vx * 0.28 * k, -this.vy * 0.28 * k, r * (1.35 - k * 0.1), 0, 7); ctx.fill(); }
                ctx.shadowColor = st.col; ctx.shadowBlur = 24;
            }
            const base = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r);
            base.addColorStop(0, '#ffffff'); base.addColorStop(0.6, st ? '#fff4e0' : '#f2f4f8'); base.addColorStop(1, st ? '#e8b36b' : '#aeb6c4');
            ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = base; ctx.fill(); ctx.shadowBlur = 0;
            // parches y costuras (giran con la pelota)
            ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.clip(); ctx.rotate(this.angle);
            const pc = st ? st.col : '#1b1f2a', pent = (cx, cy, rad, rot) => { ctx.beginPath(); for (let k = 0; k < 5; k++) { const a = rot + k * 1.2566; ctx.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); } ctx.closePath(); ctx.fill(); };
            ctx.strokeStyle = 'rgba(27,31,42,0.55)'; ctx.lineWidth = Math.max(1.5, r * 0.07); ctx.lineCap = 'round'; ctx.beginPath();
            for (let k = 0; k < 5; k++) {
                const v = -1.5708 + k * 1.2566, e = v + 0.6283, ex = Math.cos(e) * r * 0.98, ey = Math.sin(e) * r * 0.98;
                ctx.moveTo(Math.cos(v) * r * 0.36, Math.sin(v) * r * 0.36); ctx.lineTo(Math.cos(v) * r * 0.68, Math.sin(v) * r * 0.68);
                ctx.lineTo(Math.cos(v + 0.6283) * r * 0.86, Math.sin(v + 0.6283) * r * 0.86); ctx.moveTo(Math.cos(v) * r * 0.68, Math.sin(v) * r * 0.68); ctx.lineTo(Math.cos(v - 0.6283) * r * 0.86, Math.sin(v - 0.6283) * r * 0.86);
            }
            ctx.stroke(); ctx.fillStyle = pc; pent(0, 0, r * 0.37, -1.5708);
            for (let k = 0; k < 5; k++) { const e = -1.5708 + k * 1.2566 + 0.6283; pent(Math.cos(e) * r * 1.0, Math.sin(e) * r * 1.0, r * 0.36, e + 3.1416); }
            ctx.restore();
            // sombreado de esfera y brillo
            const sh = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.25, 0, 0, r * 1.02); sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.65, 'rgba(0,0,0,0.04)'); sh.addColorStop(1, 'rgba(0,0,0,0.4)');
            ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = sh; ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(-r * 0.4, -r * 0.44, r * 0.22, r * 0.12, -0.75, 0, 7); ctx.fill();
            ctx.lineWidth = Math.max(2, r * 0.1); ctx.strokeStyle = '#0b0d12'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke();
            ctx.restore();
        }
    }

    const powerupBox = new PowerupBox();

    // Choque elástico: el jugador es mucho más pesado que la pelota
    function hitPlayer(p, b) {
        const dx = b.x - p.x, dy = b.y - p.y, d = Math.hypot(dx, dy), min = p.radius + b.radius;
        if (d >= min || d === 0) return;
        const nx = dx / d, ny = dy / d;
        b.x += nx * (min - d); b.y += ny * (min - d);
        const rel = (b.vx - p.vx) * nx + (b.vy - p.vy) * ny;
        if (rel < 0) { const j = -1.7 * rel * 0.857; b.vx += j * nx; b.vy += j * ny; }
        b.superType = null; b.viaBar = false; touch(p);
    }
    function pushPlayers(a, b) {
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.radius + b.radius;
        if (d >= min || d === 0) return;
        const nx = dx / d, ny = dy / d, o = (min - d) / 2;
        a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o;
        if (Math.abs(ny) > 0.6) {                      // uno arriba del otro: rebote vertical
            const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
            if (rel < 0) { const j = -1.1 * rel / 2; b.vx += j * nx; b.vy += j * ny; a.vx -= j * nx; a.vy -= j * ny; }
            if (ny > 0.6) a.grounded = true; else b.grounded = true;
        } else if ((a.vx - b.vx) * Math.sign(nx) > 0) { // lado a lado: choque parejo, el que llega primero no arrastra al otro
            const avg = (a.vx + b.vx) / 2; a.vx = b.vx = avg * 0.3;
        }
    }
    // Si la pelota queda aplastada entre los dos jugadores, sale disparada hacia arriba (no se traba ni se arrastra hasta el arco)
    let sqCd = 0;
    function sandwich() {
        if (sqCd > 0) { sqCd--; return; }
        const b = ball, d1 = Math.hypot(b.x - player1.x, b.y - player1.y), d2 = Math.hypot(b.x - player2.x, b.y - player2.y);
        if (d1 > player1.radius + b.radius + 6 || d2 > player2.radius + b.radius + 6) return;
        if ((b.x - player1.x) * (b.x - player2.x) >= 0) return;          // no está entre los dos
        sqCd = 24; b.superType = null; b.viaBar = false;
        b.vy = -rnd(11, 14); b.vx = rnd(-1.5, 1.5) + (player1.vx + player2.vx) * 0.15; b.y -= 6;
        const dir = Math.sign(player2.x - player1.x) || 1;
        player1.vx = -dir * 3; player2.vx = dir * 3; player1.x -= dir * 4; player2.x += dir * 4;
        burst(b.x, b.y, '#ffffff', 10, 4); sfx('bounce');
    }

    function endPowerup() {
        player1.jumpForce = player2.jumpForce = BASE_JUMP_FORCE;
        player1.moveSpeed = player1.baseSpeed; player2.moveSpeed = player2.baseSpeed;
        player1.frozen = player2.frozen = false;
        ball.setRadius(BALL_RADIUS); gravityMul = 1; goalTarget = [GOAL_H, GOAL_H]; activePowerup = null;
    }
    function triggerPowerup(p, type) {
        endPowerup();
        const q = p === player1 ? player2 : player1, A = p.data.nickname, B = q.data.nickname;
        const dur = Math.round(PU_TYPES[type][1] * rnd(0.75, 1.3));
        if (type === 'superJump') { p.jumpForce = BASE_JUMP_FORCE * 1.5; announce(`¡${A} AGARRÓ SALTO LOCO!`, '#06d6a0'); }
        else if (type === 'freeze') { q.frozen = true; announce(`¡${A} CONGELÓ ${al(B)}!`, '#90e0ef'); }
        else if (type === 'giantGoal') { goalTarget[q === player1 ? 0 : 1] = GOAL_H * 1.5; announce(`¡${A} AGRANDÓ EL ARCO ${de(B)}!`, '#ffd166'); }
        else if (type === 'speedBoost') { p.moveSpeed = p.baseSpeed * 1.6; announce(`¡${A} ACTIVÓ EL TURBO!`, '#ef476f'); }
        else if (type === 'bigBall') { ball.setRadius(BALL_RADIUS * 1.5); announce(`¡PELOTÓN! LA PELOTA CRECIÓ POR ${A}`, '#ffffff'); }
        else { gravityMul = 0.5; announce(`¡GRAVEDAD LUNAR POR CULPA ${de(A)}!`, '#b8c0ff'); }
        activePowerup = { type, timer: dur, max: dur, owner: p }; sfx('pu');
        const col = PU_STYLE[type][0]; burst(p.x, p.y, col, 40, 10); burst(p.x, p.y, '#ffffff', 16, 6);
        for (let k = 0; k < 3; k++) ring(p.x, p.y, col, 28 + k * 5);
        shake = 12; flashT = 16; flashCol = col; stats[p.isP1 ? 0 : 1].p++;
    }

    // ---------- Reglas y carteles ----------
    function checkGoal() {
        const r = ball.radius; // solo es gol si la pelota ENTERA cruzó la línea y va por debajo del travesaño
        if (ball.y > GROUND_Y - goalH[0] && ball.x + r < GOAL_W) registerGoal(0);
        else if (ball.y > GROUND_Y - goalH[1] && ball.x - r > CW - GOAL_W) registerGoal(1);
    }
    function makePhrase(o) {
        const A = o.att.data.nickname, B = o.def.data.nickname, f = o.f, a = o.a, D = de(A), Bd = de(B);
        if (o.own) return pick([
            [`¡GOL EN CONTRA ${Bd}!`, `${A} lo agradece`], [`¡${B} LA METIÓ EN SU PROPIO ARCO!`, `Regalito para ${A}`],
            [`¡AUTOGOL ${Bd}!`, `${A} suma sin tocarla`], [`¡${B} SE HIZO UN GOL!`, `Nadie lo puede creer`],
            [`¡QUÉ ERROR ${Bd}!`, `Gol en contra para ${A}`], [`¡ARCO EQUIVOCADO, ${B}!`, `${A} festeja sin hacer nada`],
            [`¡${B} LE REGALÓ EL GOL ${al(A)}!`, `Autogol de manual`], [`¡SE LE ESCAPÓ ${al(B)}!`, `La pelota fue para el lado que no era`]]);
        if (suddenDeath) return pick([[`¡GOL DE ORO ${D}!`, `${B} se queda sin tiempo extra`], [`¡${A} LO DEFINIÓ EN EL TIEMPO EXTRA!`, `Muerte súbita para ${B}`], [`¡${A} ES LEYENDA!`, `Gol de oro, partido liquidado`]]);
        if (o.end) return pick([[`¡${A} CERRÓ EL PARTIDO!`, `${B} no tiene respuesta`], [`¡${A} SE QUEDA CON LA VICTORIA!`, `${f} a ${a}`], [`¡PARTIDAZO ${D}!`, `Final cantado para ${B}`], [`¡${A} TIENE LA COPA EN LA MANO!`, `${B} se despide del partido`]]);
        if (o.sup) return pick([[`¡SUPERGOLAZO ${D}!`, `Un misil que ${B} ni vio pasar`], [`¡${A} ROMPIÓ LA RED!`, `Disparo imparable`], [`¡QUÉ BOMBA ${D}!`, `${B} quedó petrificado`], [`¡PELOTAZO DE ${A}!`, `Mirá cómo la clavó`], [`¡${A} LA CLAVÓ EN EL ÁNGULO!`, `El estadio se viene abajo`]]);
        if (o.bar) return pick([[`¡${A} LA METIÓ DESPUÉS DEL TRAVESAÑO!`, `${B} no lo puede creer`], [`¡EL TRAVESAÑO LE DIO UNA MANO ${al(A)}!`, `Rebotó y adentro`], [`¡GOL SUFRIDO ${D}!`, `Pegó en el travesaño y entró`]]);
        if (timeRemaining <= 15) return pick([[`¡GOL SOBRE LA HORA ${D}!`, `${B} lo sufre en el final`], [`¡${A} LO GRITA EN EL ÚLTIMO SUSPIRO!`, `Faltaban segundos`], [`¡DRAMA FINAL! GOL ${D}`, `${B} no lo puede creer`]]);
        if (f === a) return pick([[`¡${A} IGUALÓ EL PARTIDO!`, `${f} a ${a}, todo abierto`], [`¡TODO IGUAL! GOL ${D}`, `${B} ya no festeja`], [`¡${A} EMPATÓ Y LA CANCHA EXPLOTA!`, `Otra vez de cero`]]);
        if (f === 1 && a === 0) return pick([[`¡${A} ABRIÓ EL MARCADOR!`, `${B} ya va perdiendo`], [`¡PRIMER GOL ${D}!`, `${B} tiene que reaccionar`], [`¡${A} SE ADELANTÓ A TODOS!`, `1 a 0 para ${A}`]]);
        if (f - a >= 3) return pick([[`¡${A} ESTÁ DESTROZANDO ${al(B)}!`, `Paliza en marcha: ${f} a ${a}`], [`¡${A} ESTÁ DE PASEO!`, `${B} no encuentra la salida`], [`¡${A} HACE LO QUE QUIERE!`, `${f} a ${a}, el partido ya tiene dueño`]]);
        if (f === a + 1 && a > 0) return pick([[`¡${A} SE PUSO ADELANTE!`, `${B} tiene que reaccionar`], [`¡${A} DIO VUELTA EL PARTIDO!`, `${f} a ${a}`], [`¡GOL ${D} Y PASA AL FRENTE!`, `Esto se pone picante`]]);
        if (a > f) return pick([[`¡DESCUENTO ${D}!`, `Todavía hay partido: ${a} a ${f}`], [`¡${A} NO SE RINDE!`, `Se acerca en el marcador`], [`¡${A} SIGUE VIVO!`, `Gol de descuento`]]);
        return pick([[`¡GOLAZO ${D}!`, `${B} no pudo hacer nada`], [`¡${A} LA MANDÓ A LA RED!`, `Gol para ${A}`], [`¡GOOOL ${D}!`, `${B} se lamenta`], [`¡${A} NO PERDONA!`, `${B} la mira pasar`], [`¡QUÉ GOL ${D}!`, `Para el recuerdo`], [`¡${A} FIRMA SU GOL!`, `${B} baja la cabeza`]]);
    }
    function registerGoal(c) { // c = índice del arco donde entró (0 = arco de J1)
        if (gameState !== 'PLAYING') return;
        const att = c === 0 ? player2 : player1, def = c === 0 ? player1 : player2;
        if (c === 0) p2Score++; else p1Score++;
        stats[att.isP1 ? 0 : 1].g++; goalSide = c;
        const f = att === player1 ? p1Score : p2Score, a = att === player1 ? p2Score : p1Score;
        const own = lastTouch === def;
        goalInfo = makePhrase({ att, def, own, f, a, sup: !!ball.superType, bar: ball.viaBar, end: f >= MAX_GOALS }).concat([own, (own ? def : (lastTouch || att)).data]);
        sfx('goal'); shake = 22; for (let i = 0; i < 6; i++) burst(rnd(300, CW - 300), rnd(150, 400), pick(['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#f15bb5']), 14, 8);
        pendingEnd = suddenDeath || p1Score >= MAX_GOALS || p2Score >= MAX_GOALS;
        gameState = 'GOAL_PAUSE'; pauseFrames = 170; banner.timer = 0; spawnConfetti(); updateScoreUI();
    }
    function afterGoal() {
        if (pendingEnd) { showGameOver(); return; }
        player1.resetPos(); player2.resetPos(); ball.resetPos(); endPowerup();
        powerupBox.active = false; boxTimer = rnd(120, 240); lastTouch = prevTouch = null; barCooldown = 0; countdown = 120; fx = []; rec = [];
        gameState = 'PLAYING';
    }

    function recFrame() { rec.push({ b: [ball.x, ball.y, ball.angle, ball.superType, ball.radius], p: [player1, player2].map(q => [q.x, q.y, q.facing, q.kickAnimTimer, q.chargeTimer, q.frozen]) }); if (rec.length > 220) rec.shift(); }
    function startReplay() { replayData = rec.slice(-150); if (replayData.length < 40) { endReplay(); return; } replayI = 0; fx = []; gameState = 'REPLAY'; }
    function endReplay() { replayData = null; afterGoal(); }
    function applyReplay() {
        if (!replayData) return;
        const f = replayData[Math.min(Math.floor(replayI), replayData.length - 1)];
        ball.x = f.b[0]; ball.y = f.b[1]; ball.angle = f.b[2]; ball.superType = f.b[3]; ball.radius = f.b[4];
        [player1, player2].forEach((q, k) => { const d = f.p[k]; q.x = d[0]; q.y = d[1]; q.facing = d[2]; q.kickAnimTimer = d[3]; q.chargeTimer = d[4]; q.frozen = d[5]; });
    }
    function step() {
        stepCore();
        if (net.on && net.host && net.active) {
            // 30 Hz en una red sana y 20 Hz si hay latencia o acumulación.
            const interval = netLinkBad() ? 50 : 33;
            if (performance.now() - net.lastSnapAt >= interval) netSendState();
        }
    }
    function stepCore() {
        matchFrames++; shake *= 0.9;
        fx = fx.filter(p => (p.x += p.vx, p.y += p.vy, p.vy += (p.ring ? 0 : 0.25), p.age = (p.age || 0) + 1, --p.life > 0));
        if (barCooldown > 0) barCooldown--;
        if (banner.timer > 0) banner.timer--;
        for (let s = 0; s < 2; s++) goalH[s] += (goalTarget[s] - goalH[s]) * 0.08;
        if (gameState === 'REPLAY') { replayI += 0.5; if (replayI >= replayData.length - 1) endReplay(); return; }
        if (gameState === 'GOAL_PAUSE') {
            if (pauseFrames > 150) recFrame();
            ball.update();
            confetti.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.4; p.rot += p.rs; });
            if (--pauseFrames <= 0) startReplay();
            return;
        }
        if (gameState !== 'PLAYING') return;
        if (countdown > 0) { if (--countdown === 0) { sfx('whistle'); announce('¡A JUGAR!', '#ffd166'); } return; }
        if (!suddenDeath && ++tickFrames >= 60) {
            tickFrames = 0; timeRemaining--;
            if (timeRemaining <= 0) {
                if (p1Score === p2Score) { suddenDeath = true; announce('¡TIEMPO EXTRA! GOL DE ORO', '#ffd700'); }
                else { showGameOver(); return; }
            }
            updateScoreUI();
        }
        player1.update(); player2.update(); pushPlayers(player1, player2); ball.update(); sandwich();
        if (powerupBox.active) {
            powerupBox.update();
            let who = null;
            for (const p of [player1, player2]) if (Math.hypot(p.x - powerupBox.x, p.y - powerupBox.y) < p.radius + powerupBox.size / 2) who = p;
            if (!who && lastTouch && Math.hypot(ball.x - powerupBox.x, ball.y - powerupBox.y) < ball.radius + powerupBox.size / 2) who = lastTouch;
            if (who) { powerupBox.active = false; boxTimer = rnd(240, 420); triggerPowerup(who, powerupBox.type); }
        } else if (--boxTimer <= 0) { powerupBox.spawn(); }
        if (activePowerup && --activePowerup.timer <= 0) endPowerup();
        recFrame(); checkGoal();
    }

    // ---------- Dibujo ----------
    function rr(x, y, w, h, r, c = ctx) {
        c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
    }
    const headCache = {};
    function headImg(d) {
        if (!d.headSrc) return null;
        let im = headCache[d.id];
        if (!im) { im = headCache[d.id] = new Image(); im.src = d.headSrc; }
        return im.complete && im.naturalWidth ? im : null;
    }
    const STADIUMS = [
        { name: 'EL PATIO', sub: 'Cancha de cemento de la escuela', crowd: ['#f94144', '#f9c74f', '#90be6e', '#43aa8b', '#577590', '#ffffff'], minY: 330 },
        { name: 'LOS MIELEROS', sub: 'Noche de luces y panal', crowd: ['#f4a300', '#ffd60a', '#1d1d1d', '#ffffff', '#c77d00', '#ffe08a'], minY: 0 },
        { name: 'LA BOMBONERA', sub: 'Azul y oro, la 12 en las tribunas', crowd: ['#0b3d91', '#ffd100', '#0b3d91', '#ffd100', '#ffffff', '#12285e'], minY: 0 },
        { name: 'EL MONUMENTAL', sub: 'La banda roja en el Monumental', crowd: ['#ffffff', '#e10600', '#ffffff', '#ffffff', '#c40000', '#f1f1f1'], minY: 0 }];
    let stadiumId = 1, bgCache = {};
    if (document.fonts) document.fonts.ready.then(() => { bgCache = {}; });
    function applyStadiumCrowd() { const p = STADIUMS[stadiumId].crowd; crowd.forEach(h => h.c = pick(p)); }
    function buildBg(id) {
        const cv = document.createElement('canvas'); cv.width = CW; cv.height = CH; const c = cv.getContext('2d');
        const F = (a, b, y0 = 0, y1 = 460) => { const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
        const T = (t, x, y, px, col) => { c.font = `${px}px "Press Start 2P", monospace`; c.textAlign = 'center'; c.fillStyle = col; c.fillText(t, x, y); };
        const bands = (a, b) => { for (let i = 0; i < 11; i++) { c.fillStyle = i % 2 ? a : b; c.fillRect(0, 172 + i * 25, CW, 25); } };
        const lamps = (xs, col) => xs.forEach(lx => {
            c.fillStyle = F(col + '40', col + '00', 40, 450); c.beginPath(); c.moveTo(lx - 16, 44); c.lineTo(lx + 16, 44); c.lineTo(lx + 200, 450); c.lineTo(lx - 120, 450); c.fill();
            const r = c.createRadialGradient(lx, 44, 2, lx, 44, 70); r.addColorStop(0, '#fff'); r.addColorStop(0.3, col + 'aa'); r.addColorStop(1, col + '00');
            c.fillStyle = r; c.fillRect(lx - 70, 0, 140, 120); c.fillStyle = '#fff'; c.fillRect(lx - 26, 38, 52, 8);
        });
        const hex = (x, y, r) => { c.beginPath(); for (let k = 0; k < 6; k++) c.lineTo(x + Math.cos(Math.PI / 3 * k) * r, y + Math.sin(Math.PI / 3 * k) * r); c.closePath(); };
        const bee = (x, y) => { c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(x - 6, y - 14, 10, 6, -0.5, 0, 7); c.ellipse(x + 8, y - 14, 10, 6, 0.5, 0, 7); c.fill(); c.fillStyle = '#ffd60a'; c.beginPath(); c.ellipse(x, y, 22, 14, 0, 0, 7); c.fill(); c.fillStyle = '#111'; for (let k = 0; k < 3; k++) c.fillRect(x - 10 + k * 10, y - 13, 5, 26); c.beginPath(); c.arc(x + 22, y - 2, 6, 0, 7); c.fill(); };
        const sign = (txt, fill, stroke, col, px) => [380, CW - 380].forEach(x => { c.fillStyle = fill; rr(x - 230, 52, 460, 62, 10, c); c.fill(); c.strokeStyle = stroke; c.lineWidth = 5; c.stroke(); T(txt, x, 94, px, col); });
        let bA, bB, bTxt, bCol, rail = '#cfd8ff', grass = ['#2e9b3f', '#37ab49'], cement = false;
        if (id === 0) {
            c.fillStyle = F('#6ec6ff', '#e8f7ff'); c.fillRect(0, 0, CW, 460);
            c.fillStyle = '#e9c46a'; c.fillRect(0, 118, CW, 340); c.fillStyle = '#c9a227'; c.fillRect(0, 108, CW, 14);
            for (let x = 40; x < CW; x += 160) for (const y of [150, 300]) { c.fillStyle = '#5aa9e6'; c.fillRect(x, y, 96, 110); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x + 8, y + 8, 36, 94); c.strokeStyle = '#8d6e63'; c.lineWidth = 6; c.strokeRect(x, y, 96, 110); }
            sign('ESCUELA SECUNDARIA', '#2a9d8f', '#1b6f65', '#fff', 20);
            for (let x = 0; x < CW; x += 60) { c.fillStyle = ['#e63946', '#ffd166', '#06d6a0', '#118ab2'][(x / 60) % 4]; c.beginPath(); c.moveTo(x, 122); c.lineTo(x + 44, 122); c.lineTo(x + 22, 154); c.fill(); }
            c.strokeStyle = '#444'; c.lineWidth = 2; for (let x = 0; x < CW; x += 18) { c.beginPath(); c.moveTo(x, 380); c.lineTo(x, 452); c.stroke(); } c.fillStyle = '#444'; c.fillRect(0, 376, CW, 5);
            bA = '#cfcfcf'; bB = '#9a9a9a'; bTxt = 'ESCUELA'; bCol = '#333'; rail = '#555'; cement = true;
        } else if (id === 1) {
            c.fillStyle = F('#120a02', '#7a4a00'); c.fillRect(0, 0, CW, 460); bands('rgba(0,0,0,.2)', 'rgba(255,200,60,.06)');
            c.strokeStyle = 'rgba(244,163,0,.5)'; c.lineWidth = 3; for (let r = 0; r < 4; r++) for (let x = (r % 2) * 30; x < CW + 60; x += 60) { hex(x, 40 + r * 44, 27); c.stroke(); }
            sign('LOS MIELEROS', '#f4a300', '#111', '#1a1002', 26); bee(CW / 2 - 330, 150); bee(CW / 2 + 330, 150); bee(110, 90); bee(CW - 110, 90);
            lamps([160, 560, 960, 1340, 1740], '#ffe08a');
            bA = '#f4a300'; bB = '#b36b00'; bTxt = 'LOS MIELEROS'; bCol = '#1a1002';
        } else if (id === 2) {
            c.fillStyle = F('#050d24', '#12307a'); c.fillRect(0, 0, CW, 460); bands('rgba(0,0,0,.22)', 'rgba(255,255,255,.04)');
            c.fillStyle = '#ffd100'; c.fillRect(0, 150, CW, 12); c.fillRect(0, 330, CW, 14);
            c.fillStyle = 'rgba(255,255,255,.07)'; for (let x = 0; x < CW; x += 90) c.fillRect(x, 162, 4, 290);
            sign('LA BOMBONERA', '#0b3d91', '#ffd100', '#ffd100', 26);
            for (let x = 120; x < CW; x += 240) for (let k = 0; k < 3; k++) { c.fillStyle = k === 1 ? '#ffd100' : '#0b3d91'; c.fillRect(x - 45 + k * 30, 112, 30, 90); }
            T('LA 12', 72, 96, 18, '#ffd100'); T('LA 12', CW - 72, 96, 18, '#ffd100');
            for (let i = 0; i < 260; i++) { c.fillStyle = i % 2 ? '#ffd100' : '#2f6fe0'; c.fillRect(rnd(0, CW), rnd(40, 430), 4, 8); }
            lamps([200, 700, 1200, 1700], '#fff6c0');
            bA = '#0b3d91'; bB = '#08235a'; bTxt = 'BOCA JUNIORS'; bCol = '#ffd100'; rail = '#ffd100';
        } else {
            c.fillStyle = F('#080b18', '#252b44', 0, 130); c.fillRect(0, 0, CW, 135);
            c.fillStyle = F('#eceef6', '#a9b0c6', 130, 460); c.fillRect(0, 130, CW, 330); bands('rgba(0,0,0,.10)', 'rgba(255,255,255,.10)');
            c.fillStyle = '#e10600'; c.beginPath(); c.moveTo(0, 430); c.lineTo(0, 350); c.lineTo(CW, 150); c.lineTo(CW, 230); c.fill();
            for (let x = 20; x < CW; x += 70) { c.fillStyle = '#fff'; c.fillRect(x, 20, 34, 10); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x - 4, 30, 42, 16); }
            sign('EL MONUMENTAL', '#e10600', '#fff', '#fff', 26);
            for (let x = 140; x < CW; x += 260) for (let k = 0; k < 3; k++) { c.fillStyle = k === 1 ? '#fff' : '#e10600'; c.fillRect(x - 45 + k * 30, 140, 30, 80); c.strokeStyle = '#e10600'; c.lineWidth = 1; c.strokeRect(x - 45 + k * 30, 140, 30, 80); }
            lamps([260, 760, 1260, 1660], '#ffffff');
            bA = '#ffffff'; bB = '#d9d9e6'; bTxt = 'MONUMENTAL'; bCol = '#e10600'; grass = ['#33a84a', '#3dba54']; rail = '#e10600';
        }
        c.fillStyle = rail; c.fillRect(0, 448, CW, 4);
        c.fillStyle = F(bA, bB, 452, 498); c.fillRect(0, 452, CW, 46);
        c.fillStyle = 'rgba(255,255,255,.18)'; for (let x = 0; x < CW; x += 140) { c.beginPath(); c.moveTo(x + 30, 452); c.lineTo(x + 70, 452); c.lineTo(x + 40, 498); c.lineTo(x, 498); c.fill(); }
        for (let x = 130; x < CW; x += 300) T(bTxt, x, 482, 14, bCol);
        if (id === 3) { c.fillStyle = '#e10600'; c.beginPath(); c.moveTo(0, 498); c.lineTo(0, 476); c.lineTo(CW, 458); c.lineTo(CW, 480); c.fill(); }
        c.fillStyle = '#0a0618'; c.fillRect(0, 498, CW, 5);
        if (cement) {
            c.fillStyle = '#9aa0a6'; c.fillRect(0, 503, CW, 165); c.strokeStyle = 'rgba(0,0,0,.14)'; c.lineWidth = 2;
            for (let x = 0; x < CW; x += 120) { c.beginPath(); c.moveTo(x, 503); c.lineTo(x, 668); c.stroke(); }
            for (let y = 503; y < 668; y += 55) { c.beginPath(); c.moveTo(0, y); c.lineTo(CW, y); c.stroke(); }
        } else for (let x = 0, i = 0; x < CW; x += 100, i++) { c.fillStyle = i % 2 ? grass[0] : grass[1]; c.fillRect(x, 503, 100, 165); }
        c.fillStyle = F('rgba(0,0,0,.28)', 'rgba(255,255,255,.06)', 503, 668); c.fillRect(0, 503, CW, 165);
        c.fillStyle = cement ? '#3a3a3a' : '#1f0c12'; c.fillRect(0, 668, CW, 32); c.fillStyle = cement ? '#4a4a4a' : '#2e1118'; for (let x = 20; x < CW; x += 140) c.fillRect(x, 682, 50, 10);
        c.strokeStyle = '#fff'; c.fillStyle = '#fff'; c.lineWidth = 4;
        c.strokeRect(GOAL_W, 522, CW - 2 * GOAL_W, 134);
        c.beginPath(); c.moveTo(CW / 2, 522); c.lineTo(CW / 2, 656); c.stroke();
        c.beginPath(); c.ellipse(CW / 2, 589, 120, 44, 0, 0, 7); c.stroke(); c.beginPath(); c.arc(CW / 2, 589, 5, 0, 7); c.fill();
        for (const sd of [0, 1]) {
            const gx = sd ? CW - GOAL_W : GOAL_W, dr = sd ? -1 : 1;
            c.strokeRect(Math.min(gx, gx + dr * 260), 538, 260, 102); c.strokeRect(Math.min(gx, gx + dr * 100), 566, 100, 46);
            c.beginPath(); c.arc(gx + dr * 170, 589, 5, 0, 7); c.fill();
        }
        return cv;
    }
    function drawField(t) {
        ctx.drawImage(bgCache[stadiumId] || (bgCache[stadiumId] = buildBg(stadiumId)), 0, 0);
        const cheer = gameState === 'GOAL_PAUSE', minY = STADIUMS[stadiumId].minY;
        crowd.forEach(h => {
            if (h.y < minY) return;
            const j = Math.abs(Math.sin(t * h.js)) * (cheer ? 22 : 10), s = h.s;
            ctx.fillStyle = h.c; ctx.fillRect(h.x, h.y - j, s * 1.3, s * 1.2);
            ctx.fillStyle = h.sk; ctx.fillRect(h.x + s * 0.1, h.y - j - s, s * 1.1, s);
            if (cheer) { ctx.fillRect(h.x - 2, h.y - j - s * 1.8, 3, s); ctx.fillRect(h.x + s * 1.3 - 1, h.y - j - s * 1.8, 3, s); }
        });
    }
    function menuScene(t) {
        drawField(t); const n = ROSTER.length;
        ROSTER.forEach((d, i) => {
            const hi = headImg(d); if (!hi) return;
            const x = ((t * 0.06 + i * (CW / n)) % (CW + 200)) - 100, y = GROUND_Y - 30 - Math.abs(Math.sin(t * 0.007 + i * 1.3)) * 40, h = 70 * (d.headScale || 1), w = h * hi.naturalWidth / hi.naturalHeight;
            ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(x, y); if (d.headFlip) ctx.scale(-1, 1); ctx.drawImage(hi, -w / 2, -h, w, h); ctx.restore();
        });
    }
    function timeText() { return suddenDeath ? 'GOL ORO' : `${String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:${String(timeRemaining % 60).padStart(2, '0')}`; }
    function drawScoreboard() {
        const w = 560, h = 118, x = CW / 2 - w / 2;
        ctx.strokeStyle = '#222'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 70, 0); ctx.lineTo(x + 70, 12); ctx.moveTo(x + w - 70, 0); ctx.lineTo(x + w - 70, 12); ctx.stroke();
        rr(x, 10, w, h, 14); ctx.fillStyle = '#1b1f2a'; ctx.fill(); ctx.strokeStyle = '#4a5068'; ctx.lineWidth = 4; ctx.stroke();
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        fit(player1.data.nickname, 12, 150); ctx.fillStyle = '#48cae4'; ctx.fillText(player1.data.nickname, x + 105, 38);
        fit(player2.data.nickname, 12, 150); ctx.fillStyle = '#f72585'; ctx.fillText(player2.data.nickname, x + w - 105, 38);
        [[x + 60, p1Score], [x + w - 150, p2Score]].forEach(([bx, sc]) => {
            rr(bx, 50, 90, 62, 8); ctx.fillStyle = '#0b2e13'; ctx.fill(); ctx.strokeStyle = '#7CFC00'; ctx.lineWidth = 3; ctx.stroke();
            ctx.font = '40px "Press Start 2P"'; ctx.fillStyle = '#9dff4a'; ctx.fillText(sc, bx + 45, 100);
        });
        ctx.save(); ctx.shadowColor = '#fff'; ctx.shadowBlur = 12; ctx.fillStyle = '#fff'; fit(timeText(), 34, 220); ctx.fillText(timeText(), CW / 2, 98); ctx.restore();
    }
    function togglePause() {
        if (net.on) return;   // online no se pausa
        if (gameState === 'PAUSED') { gameState = prePause; uiPause.classList.add('hidden'); acc = 0; lastT = performance.now(); }
        else if (gameState === 'PLAYING' || gameState === 'GOAL_PAUSE' || gameState === 'REPLAY') { prePause = gameState; gameState = 'PAUSED'; uiPause.classList.remove('hidden'); for (const k in keys) keys[k] = false; }
    }
    let prePause = 'PLAYING';
    const GOAL_THEME = [
        { c1: '#ff7b00', c2: '#ffffff', net: '#ffe8cc', glow: '#ffb347' },   // patio: naranja y blanco
        { c1: '#ffd60a', c2: '#1a1a1a', net: '#ffe9a0', glow: '#f4a300' },   // Los Mieleros: abeja
        { c1: '#ffd100', c2: '#0b3d91', net: '#cfe0ff', glow: '#3a7bff' },   // Bombonera: azul y oro
        { c1: '#e10600', c2: '#ffffff', net: '#ffffff', glow: '#ff5a5a' }];  // Monumental: rojo y blanco
    function drawGoals() {
        const th = GOAL_THEME[stadiumId];
        for (let s = 0; s < 2; s++) {
            const h = goalH[s], x0 = s ? CW - GOAL_W : 0, top = GROUND_Y - h, mouth = s ? x0 : x0 + GOAL_W;
            const g = ctx.createLinearGradient(0, top, 0, GROUND_Y); g.addColorStop(0, th.glow + '66'); g.addColorStop(1, th.glow + '14');
            ctx.fillStyle = g; ctx.fillRect(x0, top, GOAL_W, h);
            ctx.fillStyle = th.glow + '30'; ctx.fillRect(x0, 548, GOAL_W, GROUND_Y + 8 - 548);
            if (gameState === 'GOAL_PAUSE' && s === goalSide && Math.floor(matchFrames / 5) % 2 === 0) { ctx.fillStyle = th.glow + 'aa'; ctx.fillRect(x0 - 20, top - 30, GOAL_W + 20, h + 40); }
            ctx.strokeStyle = th.net + 'bb'; ctx.lineWidth = 2; ctx.beginPath();
            for (let i = 0; i <= GOAL_W; i += 15) { ctx.moveTo(x0 + i, top); ctx.lineTo(x0 + i, GROUND_Y); }
            for (let j = 0; j <= h; j += 15) { ctx.moveTo(x0, top + j); ctx.lineTo(x0 + GOAL_W, top + j); }
            ctx.stroke();
            // travesaño rayado con los colores del estadio
            ctx.save(); ctx.beginPath(); ctx.rect(x0, top - POST_RADIUS, GOAL_W, POST_RADIUS * 2); ctx.clip();
            ctx.fillStyle = th.c1; ctx.fillRect(x0, top - POST_RADIUS, GOAL_W, POST_RADIUS * 2); ctx.fillStyle = th.c2;
            for (let i = -20; i < GOAL_W + 20; i += 28) { ctx.beginPath(); ctx.moveTo(x0 + i, top - POST_RADIUS - 2); ctx.lineTo(x0 + i + 14, top - POST_RADIUS - 2); ctx.lineTo(x0 + i - 6, top + POST_RADIUS + 2); ctx.lineTo(x0 + i - 20, top + POST_RADIUS + 2); ctx.fill(); }
            ctx.restore();
            ctx.lineWidth = 3; ctx.strokeStyle = '#111'; ctx.strokeRect(x0, top - POST_RADIUS, GOAL_W, POST_RADIUS * 2);
            ctx.beginPath(); ctx.arc(mouth, top, POST_RADIUS, 0, 7); ctx.fillStyle = th.c1; ctx.fill(); ctx.stroke();
            ctx.fillStyle = th.c1; ctx.fillRect(s ? CW - 10 : 0, top, 10, h); ctx.fillStyle = th.c2; for (let j = 0; j < h; j += 24) ctx.fillRect(s ? CW - 10 : 0, top + j, 10, 12);
            ctx.save(); ctx.shadowColor = th.glow; ctx.shadowBlur = 18; ctx.fillStyle = th.c2; ctx.beginPath(); ctx.arc(mouth, top, 4, 0, 7); ctx.fill(); ctx.restore();
        }
    }
    function fit(txt, px, maxW, bold) {
        ctx.font = `${px}px "Press Start 2P"`;
        while (ctx.measureText(txt).width > maxW && px > 12) { px -= 2; ctx.font = `${px}px "Press Start 2P"`; }
    }
    function renderWorld(t) {
        drawField(t); drawGoals(); drawScoreboard();
        if (powerupBox.active) powerupBox.draw();
        player1.draw(); player2.draw(); ball.draw();
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        if (activePowerup) {
            const [col, ic] = PU_STYLE[activePowerup.type], w = 380, x = CW / 2 - w / 2, y = 140, k = Math.max(0, activePowerup.timer / activePowerup.max);
            ctx.fillStyle = 'rgba(0,0,0,0.7)'; rr(x, y, w, 36, 10); ctx.fill();
            ctx.fillStyle = col; rr(x + 4, y + 4, Math.max(6, (w - 8) * k), 28, 7); ctx.fill();
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '13px "Press Start 2P", monospace'; ctx.lineWidth = 4; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round';
            const txt = `${ic} ${PU_TYPES[activePowerup.type][0]} ${Math.ceil(activePowerup.timer / 60)}s`; ctx.strokeText(txt, CW / 2, y + 19);
            ctx.fillStyle = k < 0.25 && Math.floor(matchFrames / 6) % 2 ? '#ff4d4d' : '#fff'; ctx.fillText(txt, CW / 2, y + 19);
        }
        if (banner.timer > 0 && gameState === 'PLAYING') {
            ctx.save(); ctx.globalAlpha = Math.min(1, banner.timer / 30);
            fit(banner.text, 22, CW - 200); ctx.shadowColor = '#000'; ctx.shadowBlur = 8; ctx.fillStyle = banner.color;
            ctx.fillText(banner.text, CW / 2, 205); ctx.restore();
        }
        if (gameState === 'GOAL_PAUSE') drawGoalSign();
    }
    function drawGoalSign() {
        const e = 1 - pauseFrames / 170, a = Math.min(1, e * 6);
        const sc = a < 1 ? 0.3 + 1.1 * a - 0.15 * Math.sin(a * Math.PI) : 1 + Math.sin(e * 20) * 0.015;
        ctx.fillStyle = `rgba(0,0,0,${0.55 * a})`; ctx.fillRect(0, 0, CW, CH);
        confetti.forEach(p => { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180); ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); ctx.restore(); });
        const own = goalInfo[2], c1 = own ? '#ef233c' : '#ff006e', bw = Math.min(CW - 160, 1500);
        ctx.save(); ctx.translate(CW / 2, CH / 2); ctx.scale(sc, sc); ctx.rotate(Math.sin(e * 14) * 0.012); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
        const g = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0); g.addColorStop(0, c1 + '00'); g.addColorStop(0.12, c1); g.addColorStop(0.88, '#7209b7'); g.addColorStop(1, '#7209b700');
        ctx.fillStyle = g; ctx.fillRect(-bw / 2, -60, bw, 150);
        ctx.fillStyle = '#ffd166'; ctx.fillRect(-bw / 2 + 40, -60, bw - 80, 5); ctx.fillRect(-bw / 2 + 40, 85, bw - 80, 5);
        ctx.font = `${56 + Math.sin(e * 16) * 4}px "Press Start 2P"`; ctx.lineWidth = 10; ctx.strokeStyle = '#000'; ctx.lineJoin = 'round';
        const lab = own ? 'GOL EN CONTRA' : '¡GOOOL!'; ctx.strokeText(lab, 0, -85); ctx.fillStyle = own ? '#ffadad' : '#ffd166'; ctx.fillText(lab, 0, -85);
        const hi = goalInfo[3] && headImg(goalInfo[3]);
        if (hi) { const h = 190 * (goalInfo[3].headScale || 1), w = h * hi.naturalWidth / hi.naturalHeight; ctx.save(); ctx.translate(-bw / 2 + 120, 10); if (goalInfo[3].headFlip) ctx.scale(-1, 1); ctx.rotate(Math.sin(e * 12) * 0.12); ctx.imageSmoothingEnabled = false; ctx.drawImage(hi, -w / 2, -h / 2 - 10, w, h); ctx.restore(); }
        ctx.shadowColor = '#000'; ctx.shadowBlur = 10; ctx.fillStyle = '#fff';
        fit(goalInfo[0], 36, bw - 400); ctx.fillText(goalInfo[0], 40, 12 + Math.sin(e * 18) * 3);
        ctx.fillStyle = '#ffd166'; fit(goalInfo[1], 20, bw - 400); ctx.fillText(goalInfo[1], 40, 62);
        ctx.restore();
    }
    function render(t) {
        ctx.save(); if (shake > 0.5) ctx.translate(rnd(-shake, shake), rnd(-shake, shake));
        if (gameState === 'REPLAY') applyReplay();
        renderWorld(t);
        if (activePowerup && activePowerup.owner && gameState !== 'GOAL_PAUSE') {
            const o = activePowerup.owner, col = PU_STYLE[activePowerup.type][0];
            ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.globalAlpha = 0.55 + 0.3 * Math.sin(matchFrames * 0.3);
            ctx.beginPath(); ctx.arc(o.x, o.y + 6, o.radius + 14 + Math.sin(matchFrames * 0.25) * 4, 0, 7); ctx.stroke();
            ctx.globalAlpha = 1; ctx.fillStyle = col; for (let i = 0; i < 6; i++) { const a = matchFrames * 0.1 + i * 1.047; ctx.fillRect(o.x + Math.cos(a) * (o.radius + 22) - 3, o.y + 6 + Math.sin(a) * (o.radius + 22) - 3, 6, 6); }
            ctx.restore();
        }
        fx.forEach(p => {
            ctx.globalAlpha = Math.min(1, p.life / 14);
            if (p.ring) { ctx.strokeStyle = p.col; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(p.x, p.y, p.age * 9, 0, 7); ctx.stroke(); }
            else { ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, p.s, p.s); }
        }); ctx.globalAlpha = 1;
        if (flashT > 0) { ctx.globalAlpha = flashT / 16 * 0.35; ctx.fillStyle = flashCol; ctx.fillRect(0, 0, CW, CH); ctx.globalAlpha = 1; flashT--; }
        if (countdown > 0 && gameState === 'PLAYING') {
            const n = Math.ceil(countdown / 60), fr = (countdown % 60) / 60;
            ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.globalAlpha = Math.min(1, fr * 2 + 0.3);
            ctx.font = `${110 + (1 - fr) * 40}px "Press Start 2P"`; ctx.lineWidth = 12; ctx.strokeStyle = '#000'; ctx.strokeText(n, CW / 2, 330); ctx.fillStyle = '#ffd166'; ctx.fillText(n, CW / 2, 330); ctx.restore();
        }
        if (gameState === 'REPLAY') {
            ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, CW, 30); ctx.fillRect(0, CH - 30, CW, 30);
            ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.font = '20px "Press Start 2P", monospace';
            if (Math.floor(matchFrames / 20) % 2) { ctx.fillStyle = '#ef233c'; ctx.beginPath(); ctx.arc(40, CH - 15, 8, 0, 7); ctx.fill(); }
            ctx.fillStyle = '#fff'; ctx.fillText('REPETICIÓN', 60, CH - 15); ctx.textAlign = 'right'; ctx.font = '13px "Press Start 2P", monospace'; ctx.fillText('ESPACIO / TOCÁ PARA SALTEAR', CW - 30, CH - 15);
        }
        ctx.restore();
    }
    canvas.addEventListener('pointerdown', () => { if (gameState === 'REPLAY') endReplay(); });
    let lastT = 0, acc = 0;
    function frame(t) {
        requestAnimationFrame(frame);
        if (net.on) { const now = performance.now(); netWatch(now); updateNetStatus(now); }
        const dt = Math.min(t - lastT, 100); lastT = t;
        if (net.on && !net.host && net.active) { acc += dt; while (acc >= STEP) { acc -= STEP; guestTick(); } render(t); return; }
        if (gameState === 'PAUSED') { render(t); return; }
        if (gameState === 'MENU' || gameState === 'SELECT' || gameState === 'GAMEOVER') { menuScene(t); return; }
        acc += dt; while (acc >= STEP) { acc -= STEP; step(); }
        render(t);
    }

    function initRosterUI() {
        const grid = document.getElementById('char-grid');
        grid.innerHTML = '';
        ROSTER.forEach(char => {
            const div = document.createElement('div');
            div.className = 'char-card text-white font-bold';
            div.innerHTML = `
                <div class="char-color-preview" style="background-color: ${char.color}; border-color: ${char.hairColor};">
                   ${char.headSrc ? `<img src="${char.headSrc}" style="height: 130%; image-rendering: pixelated; margin-top: -6px;${char.headFlip ? ' transform: scaleX(-1);' : ''}">` : `<span style="font-size: 16px;">${char.badge}</span>`}
                </div>
                <div class="char-name">${char.name}</div>
            `;
            div.onclick = () => selectChar(char);
            grid.appendChild(div);
        });
    }

    const info = document.getElementById('ui-info');
    let flow = { mode: 'CPU', tour: false, size: 4 }, picks = [], tour = null, curMatch = null;
    const touchEl = document.getElementById('touch');
    let touchOn = !!(window.matchMedia && matchMedia('(pointer: coarse)').matches);
    function hideAll() { [uiMenu, uiSelect, uiGameover, uiPause, info, touchEl].forEach(e => e.classList.add('hidden')); uiHud.classList.add('hidden'); }
    function showInfo(html) { hideAll(); info.innerHTML = html; info.classList.remove('hidden'); }
    const BTN = 'arcade-btn mt-4 text-sm py-2 px-6';
    function goToMenu() { if (net.on || net.active || (window.CabezonesNet && window.CabezonesNet.isOpen())) netClose(); hideAll(); gameState = 'MENU'; tour = null; curMatch = null; uiMenu.classList.remove('hidden'); }
    const TOUR_SIZE = 8; // cuartos de final; para ampliar el torneo (16 = octavos) alcanza con cambiar este número
    function startSelection(mode, tourney) {
        flow = { mode, tour: !!tourney, size: TOUR_SIZE, humans: mode === 'CPU' ? 1 : 2 }; currentMode = mode; gameState = 'SELECT';
        if (tourney && mode === 'PVP') showHumans(); else showOptions();
        startMusic();
    }
    function showHumans() {
        showInfo(`<h2 class="text-2xl text-cyan-400 mb-4 text-center">TORNEO 1 VS 1</h2><p class="text-xs text-gray-300 mb-6 text-center leading-relaxed">Son ${TOUR_SIZE} participantes, desde cuartos de final.<br>Los demás lugares los completa la CPU.<br><br>¿CUÁNTOS JUGADORES HUMANOS?</p><div class="flex gap-6"><button class="arcade-btn blue" onclick="setHumans(2)">2</button><button class="arcade-btn" onclick="setHumans(4)">4</button><button class="arcade-btn blue" onclick="setHumans(8)">8</button></div><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
    }
    function setHumans(n) { flow.humans = n; showOptions(); }
    const settings = { time: 150, goals: 5, lvl: 1 };
    function showOptions() {
        const grp = (key, label, opts) => `<div class="opt"><p class="text-xs text-gray-300 mb-2">${label}</p><div class="flex gap-4">${opts.map(([v, t]) => `<button class="opt-btn ${settings[key] === v ? 'on' : ''}" onclick="setOpt('${key}', ${v})">${t}</button>`).join('')}</div></div>`;
        showInfo(`<h2 class="text-2xl text-yellow-300 mb-6 text-center">AJUSTES DEL PARTIDO</h2>${grp('time', 'DURACIÓN', [[60, '1:00'], [150, '2:30'], [180, '3:00']])}${grp('goals', 'GOLES PARA GANAR', [[3, '3'], [5, '5'], [7, '7']])}${flow.mode === 'CPU' ? grp('lvl', 'DIFICULTAD DE LA CPU', [[0, 'FÁCIL'], [1, 'NORMAL'], [2, 'DIFÍCIL']]) : ''}<button class="arcade-btn mt-4" onclick="beginPick()">CONTINUAR</button><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
    }
    function setOpt(k, v) { settings[k] = v; showOptions(); }
    function showCredits() {
        showInfo(`<h2 class="text-2xl text-yellow-300 mb-3 text-center title-anim">CABEZONES DE LA TEC</h2><p class="text-xs text-gray-300 mb-5 text-center">LOS JUGADORES</p><div class="cr">${ROSTER.map(c => `<div class="cr-c">${c.headSrc ? `<img src="${c.headSrc}" style="${c.headFlip ? 'transform: scaleX(-1);' : ''}">` : ''}<b>${c.nickname}</b><small>${c.name}</small></div>`).join('')}</div><p class="text-xs text-gray-400 mt-4 text-center">Hecho en la Tec con mucho cariño</p><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
    }
    function toggleTouch() { touchOn = !touchOn; }
    function showSettings() {
        const row = (label, on, fn) => `<div class="opt"><p class="text-xs text-gray-300 mb-2">${label}</p><button class="opt-btn ${on ? 'on' : ''}" onclick="${fn}; showSettings()">${on ? 'ACTIVADO' : 'DESACTIVADO'}</button></div>`;
        showInfo(`<h2 class="text-2xl text-yellow-300 mb-6 text-center">AJUSTES</h2>${row('MÚSICA', !musicOff, 'toggleMusic()')}${row('SONIDO (EFECTOS)', !sfxOff, 'toggleSfx()')}${row('CONTROLES TÁCTILES', touchOn, 'toggleTouch()')}<p class="text-xs text-gray-400 mb-4 text-center">También podés silenciar en cualquier momento<br>con los botones de arriba a la derecha.</p><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
    }
    const TB = (code, t, cls = '') => `<button class="tb ${cls}" data-k="${code}">${t}</button>`;
    touchEl.innerHTML = `<div class="tg l">${TB('KeyA', '◄')}${TB('KeyD', '►')}</div><div class="tg l2">${TB('KeyW', '▲')}${TB('KeyF', '⚽', 'big')}</div><div class="tg r p2">${TB('ArrowLeft', '◄')}${TB('ArrowRight', '►')}</div><div class="tg r2 p2">${TB('ArrowUp', '▲')}${TB('Enter', '⚽', 'big')}</div>`;
    touchEl.querySelectorAll('.tb').forEach(b => { const k = b.dataset.k, on = e => { e.preventDefault(); keys[k] = true; }, off = e => { e.preventDefault(); keys[k] = false; };
        b.addEventListener('pointerdown', on); ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => b.addEventListener(ev, off)); });
    touchEl.addEventListener('contextmenu', e => e.preventDefault());
    function statsHTML() {
        const rows = [['Goles', 'g'], ['Patadas', 'k'], ['Súper tiros', 's'], ['Travesaños', 'b'], ['Power-ups', 'p']];
        return `<table class="stats"><tr><th>${p1Choice.nickname}</th><th></th><th>${p2Choice.nickname}</th></tr>${rows.map(([t, k]) => `<tr><td>${stats[0][k]}</td><td>${t}</td><td>${stats[1][k]}</td></tr>`).join('')}</table>`;
    }
    const needed = () => flow.online ? 1 : flow.mode === 'CPU' ? 1 : (flow.tour ? flow.humans : 2);
    function beginPick() { picks = []; hideAll(); uiSelect.classList.remove('hidden'); initRosterUI(); pickTitle(); }
    function pickTitle() {
        const t = document.getElementById('select-title'), n = picks.length + 1;
        t.textContent = needed() === 1 ? 'ELIGE TU JUGADOR' : `ELIGE JUGADOR ${n} DE ${needed()}`;
        t.className = `text-3xl mb-6 text-center ${n % 2 ? 'text-cyan-400' : 'text-pink-400'}`;
        document.querySelectorAll('.char-card').forEach((el, i) => el.classList.toggle('taken', picks.some(p => p.id === ROSTER[i].id)));
    }
    function selectChar(ch) {
        if (picks.some(p => p.id === ch.id)) return;
        picks.push(ch);
        if (picks.length < needed()) pickTitle(); else if (flow.online) netPicked(); else chooseStadium();
    }
    function chooseStadium() {
        showInfo(`<h2 class="text-2xl text-yellow-300 mb-5 text-center">ELIGE EL ESTADIO</h2><div id="st-grid"></div><button class="${BTN}" onclick="goToMenu()">CANCELAR</button>`);
        STADIUMS.forEach((st, i) => {
            const d = document.createElement('div'), cv = document.createElement('canvas'); d.className = 'st-card'; cv.width = 380; cv.height = 140;
            cv.getContext('2d').drawImage(bgCache[i] || (bgCache[i] = buildBg(i)), 0, 0, 380, 140);
            d.appendChild(cv); d.insertAdjacentHTML('beforeend', `<b>${st.name}</b><small>${st.sub}</small>`);
            d.onclick = () => { stadiumId = i; applyStadiumCrowd(); startFlow(); };
            document.getElementById('st-grid').appendChild(d);
        });
    }
    function startFlow() {
        if (flow.online) { p1Choice = net.myChar; p2Choice = net.otherChar; currentMode = 'PVP'; initMatch(); return; }
        if (flow.tour) { buildTour(); return; }
        p1Choice = picks[0]; currentMode = flow.mode;
        p2Choice = flow.mode === 'CPU' ? pick(ROSTER.filter(c => c.id !== p1Choice.id)) : picks[1];
        initMatch();
    }
    // ---------- Torneo ----------
    const shuffle = a => a.sort(() => Math.random() - 0.5);
    function buildTour() {
        let slots = picks.map(c => ({ char: c, cpu: false }));
        slots = slots.concat(shuffle(ROSTER.filter(c => !picks.some(p => p.id === c.id))).slice(0, TOUR_SIZE - slots.length).map(c => ({ char: c, cpu: true })));
        tour = { rounds: [shuffle(slots)], r: 0, m: 0, res: [], champ: null }; showBracket();
    }
    function advance(win, res) {
        const t = tour; (t.rounds[t.r + 1] = t.rounds[t.r + 1] || []).push(win); (t.res[t.r] = t.res[t.r] || [])[t.m] = res; t.m++;
        if (t.m * 2 >= t.rounds[t.r].length) { if (t.rounds[t.r].length === 2) t.champ = win; else { t.r++; t.m = 0; } }
    }
    const nm = s => s ? s.char.nickname : '?';
    function showBracket() {
        const t = tour;
        if (t.champ) {
            const ch = t.champ.char;
            showInfo(`<h1 class="text-3xl text-yellow-300 mb-4 text-center title-anim glow">¡CAMPEÓN DEL TORNEO!</h1>${ch.headSrc ? `<img class="title-anim" src="${ch.headSrc}" style="height:170px;image-rendering:pixelated;${ch.headFlip ? 'transform:scaleX(-1);' : ''}">` : ''}<h2 class="text-3xl text-white my-4 text-center">${ch.name.toUpperCase()}</h2><button class="arcade-btn" onclick="goToMenu()">MENÚ PRINCIPAL</button>`);
            sfx('goal'); return;
        }
        while (true) { // los partidos CPU vs CPU se juegan solos
            const a = t.rounds[t.r][2 * t.m], b = t.rounds[t.r][2 * t.m + 1];
            if (!(a.cpu && b.cpu)) break;
            const aw = Math.random() < 0.5, W = pick([3, 4, 5]), L = Math.floor(rnd(0, W)); advance(aw ? a : b, aw ? `${W}-${L}` : `${L}-${W}`);
            if (t.champ) { showBracket(); return; }
        }
        const R = Math.log2(TOUR_SIZE), names = ['FINAL', 'SEMIFINAL', 'CUARTOS', 'OCTAVOS']; let cols = '';
        for (let r = 0; r < R; r++) {
            const p = t.rounds[r] || []; let rows = '';
            for (let m = 0; m < (TOUR_SIZE >> r) / 2; m++) rows += `<div class="br-m ${r === t.r && m === t.m ? 'cur' : ''}"><span>${nm(p[2 * m])}${p[2 * m] && p[2 * m].cpu ? ' (CPU)' : ''}</span><span>${nm(p[2 * m + 1])}${p[2 * m + 1] && p[2 * m + 1].cpu ? ' (CPU)' : ''}</span><i>${(t.res[r] || [])[m] || ''}</i></div>`;
            cols += `<div class="br-c"><h3>${names[R - 1 - r]}</h3>${rows}</div>`;
        }
        let L = t.rounds[t.r][2 * t.m], Rr = t.rounds[t.r][2 * t.m + 1]; if (L.cpu && !Rr.cpu) [L, Rr] = [Rr, L];
        showInfo(`<h2 class="text-xl text-yellow-300 text-center">TORNEO</h2><div class="br">${cols}</div><p class="text-xs text-white mb-2 text-center">PRÓXIMO: <b class="text-cyan-300">${L.char.name}</b> VS <b class="text-pink-400">${Rr.char.name}${Rr.cpu ? ' (CPU)' : ''}</b></p>${!L.cpu && !Rr.cpu ? `<p class="text-xs text-gray-300 text-center">${nm(L)}: A/D · W · F &nbsp;|&nbsp; ${nm(Rr)}: ◄/► · ▲ · ENTER</p>` : ''}<button class="arcade-btn mt-4" onclick="playTourMatch()">¡JUGAR!</button><button class="${BTN}" onclick="goToMenu()">ABANDONAR</button>`);
    }
    function playTourMatch() {
        const t = tour, a = t.rounds[t.r][2 * t.m], b = t.rounds[t.r][2 * t.m + 1]; let L = a, R = b; if (a.cpu && !b.cpu) { L = b; R = a; }
        curMatch = { a, L, R }; p1Choice = L.char; p2Choice = R.char; currentMode = R.cpu ? 'CPU' : 'PVP'; initMatch();
    }
    function initMatch() {
        hideAll(); uiHud.classList.remove('hidden');
        MAX_GOALS = settings.goals; MATCH_DURATION = settings.time;
        if (touchOn) { touchEl.classList.remove('hidden'); touchEl.classList.toggle('solo', currentMode === 'CPU' || net.on); }
        document.getElementById('p1-hud-name').textContent = p1Choice.name.toUpperCase();
        document.getElementById('p2-hud-name').textContent = p2Choice.name.toUpperCase() + (currentMode === 'CPU' ? ' (CPU)' : '');
        p1Score = p2Score = 0; timeRemaining = MATCH_DURATION; tickFrames = 0; suddenDeath = false; pendingEnd = false;
        goalH = [GOAL_H, GOAL_H]; goalTarget = [GOAL_H, GOAL_H]; gravityMul = 1; matchFrames = 0; barCooldown = 0;
        lastTouch = prevTouch = null; activePowerup = null; lastBoxType = ''; powerupBox.active = false; boxTimer = rnd(150, 300); banner.timer = 0;
        player1 = new Player(CW / 4, true, p1Choice, false);
        player2 = new Player(CW * 3 / 4, false, p2Choice, currentMode === 'CPU');
        ball = new Ball(); updateScoreUI(); stats = newStats(); rec = []; replayData = null; startMusic();
        if (currentMode === 'CPU') { player2.lvl = settings.lvl; player2.baseSpeed = player2.moveSpeed = MOVE_SPEED * [0.72, 0.9, 1.05][settings.lvl]; }
        countdown = 180; fx = []; shake = 0; announce(`¡BIENVENIDOS A ${STADIUMS[stadiumId].name}!`, '#ffffff'); sfx('whistle');
        if (net.on && net.host) {
            net.active = true; net.sq = 0; net.lastSnapAt = 0; net.stSel = false; net.correction = null;
            net.lastRemoteAt = performance.now(); net.statusAt = 0;
            netCtl({ t: 'start', p1: p1Choice.id, p2: p2Choice.id, st: stadiumId, g: settings.goals, tm: settings.time });
        }
        gameState = 'PLAYING'; acc = 0; lastT = performance.now();
    }
    function updateScoreUI() {
        document.getElementById('p1-score').textContent = p1Score;
        document.getElementById('p2-score').textContent = p2Score;
        document.getElementById('timer-box').textContent = suddenDeath ? 'GOL DE ORO' : `${String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:${String(timeRemaining % 60).padStart(2, '0')}`;
    }
    function showGameOver() {
        gameState = 'GAMEOVER'; uiHud.classList.add('hidden');
        if (net.on && net.host) { net.active = false; netCtl({ t: 'over', sc: [p1Score, p2Score], sx: stats }); }
        if (tour && curMatch) {
            const lw = p1Score > p2Score, win = lw ? curMatch.L : curMatch.R, ab = curMatch.L === curMatch.a ? [p1Score, p2Score] : [p2Score, p1Score];
            advance(win, ab.join('-')); curMatch = null;
            showInfo(`<h1 class="text-4xl text-yellow-300 mb-4 text-center">¡FINAL DEL PARTIDO!</h1><h2 class="text-2xl text-white mb-3 text-center">GANA ${win.char.name.toUpperCase()}</h2><p class="text-2xl text-cyan-300 mb-4">${p1Score} - ${p2Score}</p>${statsHTML()}<button class="arcade-btn" onclick="showBracket()">CONTINUAR</button>`);
            return;
        }
        uiGameover.classList.remove('hidden');
        document.querySelector('#ui-gameover .arcade-btn.blue').classList.toggle('hidden', net.on && !net.host);
        let wName = p1Score > p2Score ? p1Choice.name : p2Choice.name; if (p1Score === p2Score) wName = 'EMPATE';
        document.getElementById('winner-text').textContent = wName === 'EMPATE' ? '¡EMPATE!' : `¡CAMPEÓN: ${wName.toUpperCase()}!`;
        document.getElementById('final-score').textContent = `${p1Score} - ${p2Score}`;
        document.getElementById('stats-box').innerHTML = statsHTML();
    }

    // ===================== MODO LAN (WebSocket, servidor propio) =====================
    const Net = window.CabezonesNet;
    const NET_ERRORS = {
        ROOM_NOT_FOUND: 'No existe una sala con ese código. Revisalo.',
        ROOM_FULL: 'Esa sala ya está llena.',
        BAD_CODE: 'El código tiene que tener 4 caracteres.',
        ALREADY_IN_ROOM: 'Ya estás en una sala.',
        SERVER_FULL: 'El servidor está lleno. Probá de nuevo en unos segundos.',
        NOT_IN_ROOM: 'La sala se cerró.',
        BAD_MESSAGE: 'Hubo un problema de comunicación.',
        MESSAGE_TOO_LARGE: 'El mensaje era demasiado grande.'
    };
    const r1 = v => Math.round(v * 10) / 10, r2 = v => Math.round(v * 100) / 100;
    const netCtl = message => { if (net.on) Net.sendRelay(message); };

    // Al volver de otra pestaña no contamos el tiempo que el navegador estuvo
    // pausado como si la conexión se hubiera caído.
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) return;
        const now = performance.now();
        net.lastRemoteAt = now;
        net.lastSnapRecvAt = now;
        if (Net) Net.lastMessageAt = now;
    });

    function netLinkBad() {
        if (!Net || !Net.isOpen()) return true;
        return Net.quality() === 'bad' || (Net.ws && Net.ws.bufferedAmount > 64 * 1024);
    }

    function hideNetStatus() {
        const el = document.getElementById('net-status');
        if (el) el.classList.add('hidden');
    }

    function updateNetStatus(now) {
        const el = document.getElementById('net-status');
        if (!el) return;
        if (!net.on || !net.active) { el.classList.add('hidden'); return; }
        el.classList.remove('hidden');
        if (now - net.statusAt < 400) return;
        net.statusAt = now;
        const quality = Net && Net.quality ? Net.quality() : 'unknown';
        const label = { good: 'BUENA', ok: 'REGULAR', bad: 'MALA', unknown: 'CONECTANDO' }[quality] || 'CONECTANDO';
        const ping = Net && Net.latency != null ? `${Math.round(Net.latency)} ms` : '--';
        el.className = `net-status ${quality}`;
        el.textContent = `LAN ${label} · ${ping}`;
        el.title = Net ? `Latencia: ${ping} · Variación: ${Math.round(Net.jitter || 0)} ms · Envíos descartados: ${Net.dropped || 0}` : '';
    }

    // Si el rival deja de mandar datos (o el anfitrión deja de mandar instantáneas),
    // cortamos con un mensaje claro en vez de dejar la partida congelada.
    function netWatch(now) {
        if (!net.active || document.hidden) return;
        if (Net && Net.lastMessageAt && now - Net.lastMessageAt > 12000) {
            netLost('Se perdió la conexión con el servidor. Revisá la red y volvé a crear la sala.');
            return;
        }
        const lastPeerAt = net.host ? net.lastRemoteAt : net.lastSnapRecvAt;
        if (lastPeerAt && now - lastPeerAt > 6000) {
            netLost('La conexión con tu rival se quedó sin respuesta. Revisá la red y volvé a crear la sala.');
        }
    }

    function netClose() {
        net.on = false;
        net.active = false;
        net.host = false;
        net.code = '';
        net.role = '';
        Object.assign(net, {
            myChar: null, otherChar: null, stSel: false, rq: 0, iq: 0, lastN: 0, lastInputAt: 0, lastSnapAt: 0,
            lastSnapRecvAt: 0, lastRemoteAt: 0, statusAt: 0,
            sq: 0, since: 0, base: null, correction: null,
            remote: { left: false, right: false, jump: false, kickHold: false }
        });
        hideNetStatus();
        if (Net) Net.close();
    }

    function netLost(message) {
        const wasOnline = net.on || net.active;
        netClose();
        if (!wasOnline) return;
        hideAll();
        gameState = 'MENU';
        showInfo(`<h2 class="text-2xl text-pink-400 mb-4 text-center">SE CORTÓ LA PARTIDA</h2><p class="text-xs text-gray-300 mb-6 text-center leading-relaxed">${message || 'Tu rival se desconectó.'}</p><button class="arcade-btn" onclick="goToMenu()">MENÚ PRINCIPAL</button>`);
    }

    function copyRoomCode() {
        const code = net.code;
        if (!code) return;
        const done = () => {
            const status = document.getElementById('net-copy-st');
            if (status) status.textContent = '¡Código copiado!';
        };
        const fallback = () => {
            const area = document.createElement('textarea');
            area.value = code;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.select();
            try { document.execCommand('copy'); done(); } catch {}
            area.remove();
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).then(done).catch(fallback);
        } else {
            fallback();
        }
    }

    function showOnline() {
        netClose();
        showInfo(`<h2 class="text-2xl text-yellow-300 mb-4 text-center">JUGAR EN LAN</h2><p class="text-xs text-gray-300 mb-6 text-center leading-relaxed">1 vs 1 en la misma red.<br>Un jugador crea la sala y le pasa el código de 4 caracteres al otro.<br>Los dos tienen que tener este juego abierto.</p><div class="flex gap-6"><button class="arcade-btn blue" onclick="createRoom()">CREAR SALA</button><button class="arcade-btn" onclick="showJoin()">UNIRME</button></div><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
    }

    async function createRoom() {
        netClose();
        showInfo('<h2 class="text-xl text-yellow-300 text-center">Creando sala...</h2><p class="text-xs text-gray-300 mt-4 text-center">Conectando con el servidor.</p>');
        try {
            await Net.connect();
        } catch (error) {
            showInfo(`<h2 class="text-2xl text-pink-400 mb-4 text-center">NO SE PUDO CONECTAR</h2><p class="text-xs text-gray-300 mb-6 text-center">${error.message || 'Revisá que el servidor esté funcionando.'}</p><button class="arcade-btn" onclick="showOnline()">REINTENTAR</button><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
            return;
        }
        if (!Net.createRoom()) {
            showInfo(`<h2 class="text-2xl text-pink-400 mb-4 text-center">NO SE PUDO CREAR LA SALA</h2><p class="text-xs text-gray-300 mb-6 text-center">Probá de nuevo.</p><button class="arcade-btn" onclick="showOnline()">REINTENTAR</button><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
        }
    }

    function showJoin() {
        netClose();
        showInfo(`<h2 class="text-2xl text-yellow-300 mb-3 text-center">UNIRME A UNA SALA</h2><p class="text-xs text-gray-300 text-center">Escribí el código de 4 caracteres:</p><input id="net-code" class="net-code" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="ABCD"><p id="net-st" class="text-xs text-cyan-300 mt-3 text-center"></p><button class="arcade-btn mt-4" onclick="joinRoom()">UNIRME</button><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
        const input = document.getElementById('net-code');
        input.addEventListener('input', () => {
            input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
        });
        input.addEventListener('keydown', event => { if (event.key === 'Enter') joinRoom(); });
        input.focus();
    }

    async function joinRoom() {
        if (net.on) return;
        const input = document.getElementById('net-code');
        const status = document.getElementById('net-st');
        const code = (input && input.value || '').trim().toUpperCase();
        if (code.length !== 4) {
            if (status) { status.style.color = '#ff8fa3'; status.textContent = 'El código tiene 4 caracteres.'; }
            return;
        }
        if (status) { status.style.color = ''; status.textContent = 'Conectando...'; }
        try {
            await Net.connect();
        } catch (error) {
            if (status) { status.style.color = '#ff8fa3'; status.textContent = error.message || 'No se pudo conectar con el servidor.'; }
            return;
        }
        if (status) status.textContent = 'Buscando la sala...';
        if (!Net.joinRoom(code) && status) {
            status.style.color = '#ff8fa3';
            status.textContent = 'No se pudo enviar el código.';
        }
    }

    function netMsg(message) {
        if (!message || typeof message !== 'object') return;
        if (message.k === 'i') {
            if (message.q > net.rq) {
                net.rq = message.q;
                net.remote = { left: !!message.l, right: !!message.r, jump: !!message.j, kickHold: !!message.h };
                net.lastRemoteAt = performance.now();
            }
            return;
        }
        if (message.k === 's') { netApply(message); return; }
        if (message.t === 'pick') {
            net.otherChar = ROSTER.find(c => c.id === message.id);
            if (net.host && net.myChar && !net.stSel) { net.stSel = true; chooseStadium(); }
        } else if (message.t === 'start') {
            initMatchGuest(message);
        } else if (message.t === 'over') {
            p1Score = message.sc[0];
            p2Score = message.sc[1];
            stats = message.sx;
            net.active = false;
            showGameOver();
        }
    }

    function netPicked() {
        net.myChar = picks[0];
        netCtl({ t: 'pick', id: net.myChar.id });
        const wait = text => showInfo(`<h2 class="text-xl text-yellow-300 text-center mb-4">${net.myChar.nickname}</h2><p class="text-xs text-gray-300 text-center">${text}</p><button class="${BTN}" onclick="goToMenu()">SALIR</button>`);
        if (net.host) {
            if (net.otherChar) { net.stSel = true; chooseStadium(); }
            else wait('Esperando que tu rival elija su jugador...');
        } else {
            wait('Esperando que el anfitrión elija el estadio...');
        }
    }

    const localInput = () => { const any = a => a.some(c => keys[c]); return { left: any(['KeyA', 'ArrowLeft']), right: any(['KeyD', 'ArrowRight']), jump: any(['KeyW', 'ArrowUp']), kickHold: any(['KeyF', 'KeyG', 'Space', 'Enter', 'NumpadEnter', 'Numpad0', 'Period', 'Slash', 'ShiftRight']) }; };

    function netSendState() {
        if (!net.on) return;
        const P = q => [r1(q.x), r1(q.y), r2(q.vx), r2(q.vy), q.facing, q.kickAnimTimer, Math.round(q.chargeTimer), q.frozen ? 1 : 0];
        const m = { k: 's', n: ++net.sq, st: gameState, sc: [p1Score, p2Score], tr: timeRemaining, sd: suddenDeath ? 1 : 0, cd: countdown, pf: pauseFrames,
            b: [r1(ball.x), r1(ball.y), r2(ball.vx), r2(ball.vy), r2(ball.angle), ball.radius, ball.superType ? SUPERS.indexOf(ball.superType) : -1],
            p: [P(player1), P(player2)], gh: [r1(goalH[0]), r1(goalH[1])],
            pb: powerupBox.active ? [Math.round(powerupBox.x), Math.round(powerupBox.y), powerupBox.type, Math.round(powerupBox.life)] : 0,
            ap: activePowerup ? [activePowerup.type, activePowerup.timer, activePowerup.max, activePowerup.owner === player1 ? 0 : 1] : 0,
            sh: r1(shake), fl: flashT > 0 ? [flashT, flashCol] : 0, gs: goalSide, ev: netEv };
        if (gameState === 'GOAL_PAUSE') m.gi = [goalInfo[0], goalInfo[1], goalInfo[2] ? 1 : 0, goalInfo[3] ? goalInfo[3].id : 0];
        // Si el envío se descarta por congestión, los efectos quedan para la próxima.
        if (netCtl(m)) netEv = [];
        net.lastSnapAt = performance.now();
    }

    function netApply(m) {
        if (!net.active || m.n <= net.lastN) return; net.lastN = m.n;
        const prev = [[ball.x, ball.y], [player1.x, player1.y], [player2.x, player2.y]];
        gameState = m.st; p1Score = m.sc[0]; p2Score = m.sc[1]; timeRemaining = m.tr; suddenDeath = !!m.sd; countdown = m.cd; pauseFrames = m.pf;
        const b = m.b; ball.x = b[0]; ball.y = b[1]; ball.vx = b[2]; ball.vy = b[3]; ball.angle = b[4]; ball.radius = b[5]; ball.superType = b[6] >= 0 ? SUPERS[b[6]] : null;
        [player1, player2].forEach((q, i) => { const d = m.p[i]; q.x = d[0]; q.y = d[1]; q.vx = d[2]; q.vy = d[3]; q.facing = d[4]; q.kickAnimTimer = d[5]; q.chargeTimer = d[6]; q.frozen = !!d[7]; });
        goalH = m.gh;
        if (m.pb) Object.assign(powerupBox, { active: true, x: m.pb[0], y: m.pb[1], type: m.pb[2], life: m.pb[3] }); else powerupBox.active = false;
        activePowerup = m.ap ? { type: m.ap[0], timer: m.ap[1], max: m.ap[2], owner: m.ap[3] ? player2 : player1 } : null;
        shake = m.sh; flashT = m.fl ? m.fl[0] : 0; if (m.fl) flashCol = m.fl[1]; goalSide = m.gs;
        if (m.gi) goalInfo = [m.gi[0], m.gi[1], !!m.gi[2], ROSTER.find(c => c.id === m.gi[3])];
        (m.ev || []).forEach(e => { if (e[0] === 'b') burst(e[1], e[2], e[3], e[4], e[5]); else if (e[0] === 'f') sfx(e[1]); else if (e[0] === 'a') announce(e[1], e[2]); else if (e[0] === 'g') ring(e[1], e[2], e[3], e[4]); });
        const rp = m.st === 'REPLAY' ? 0 : 1; net.since = 0;
        net.base = [[ball.x, ball.y, ball.vx * rp, ball.vy * rp], [player1.x, player1.y, player1.vx * rp, player1.vy * rp], [player2.x, player2.y, player2.vx * rp, player2.vy * rp]];
        // Suaviza el salto entre la posición dibujada y la instantánea nueva.
        // Si el salto es enorme (gol, reinicio), se acepta el corte y no se interpola.
        const nowPos = [[ball.x, ball.y], [player1.x, player1.y], [player2.x, player2.y]];
        net.correction = prev.map((p, i) => {
            const dx = p[0] - nowPos[i][0], dy = p[1] - nowPos[i][1];
            return Math.hypot(dx, dy) > 90 ? null : [dx, dy];
        });
        if (net.correction.every(c => !c)) net.correction = null;
        net.lastSnapRecvAt = performance.now();
    }

    function guestTick() {
        matchFrames++; shake *= 0.9; if (banner.timer > 0) banner.timer--;
        fx = fx.filter(p => (p.x += p.vx, p.y += p.vy, p.vy += (p.ring ? 0 : 0.25), p.age = (p.age || 0) + 1, --p.life > 0));
        if (net.base) {
            net.since = Math.min(net.since + 1, netLinkBad() ? 4 : 3);
            [ball, player1, player2].forEach((o, i) => { const b = net.base[i]; o.x = b[0] + b[2] * net.since; o.y = b[1] + b[3] * net.since; });
        }
        if (net.correction) {
            [ball, player1, player2].forEach((o, i) => {
                const c = net.correction[i];
                if (!c) return;
                o.x += c[0]; o.y += c[1];
                c[0] *= 0.82; c[1] *= 0.82;
                if (Math.abs(c[0]) < 0.15 && Math.abs(c[1]) < 0.15) net.correction[i] = null;
            });
            if (net.correction.every(c => !c)) net.correction = null;
        }
        const i = localInput();
        // El input se manda con tasa fija aunque el bucle del navegador corra más rápido.
        const now = performance.now();
        if (now - net.lastInputAt >= (netLinkBad() ? 33 : 20)) {
            net.lastInputAt = now;
            netCtl({ k: 'i', q: ++net.iq, l: +i.left, r: +i.right, j: +i.jump, h: +i.kickHold });
        }
    }

    function initMatchGuest(m) {
        hideAll(); p1Choice = ROSTER.find(c => c.id === m.p1); p2Choice = ROSTER.find(c => c.id === m.p2); stadiumId = m.st; applyStadiumCrowd();
        MAX_GOALS = m.g; MATCH_DURATION = m.tm; currentMode = 'PVP';
        player1 = new Player(CW / 4, true, p1Choice, false); player2 = new Player(CW * 3 / 4, false, p2Choice, false); ball = new Ball();
        activePowerup = null; powerupBox.active = false; stats = newStats(); p1Score = p2Score = 0; timeRemaining = m.tm; suddenDeath = false; countdown = 0;
        fx = []; goalH = [GOAL_H, GOAL_H]; banner.timer = 0; net.lastN = 0; net.base = null; net.correction = null; net.since = 0; net.lastInputAt = 0; net.lastSnapRecvAt = performance.now(); net.statusAt = 0; net.active = true;
        uiHud.classList.remove('hidden'); if (touchOn) { touchEl.classList.remove('hidden'); touchEl.classList.add('solo'); }
        gameState = 'PLAYING'; acc = 0; lastT = performance.now(); startMusic();
    }

    if (Net) {
        Net.on('room', message => {
            net.on = true;
            net.code = message.code;
            net.role = message.role;
            net.host = message.role === 'host';
            flow = { mode: 'PVP', tour: false, online: true, size: TOUR_SIZE, humans: 2 };
            currentMode = 'PVP';
            gameState = 'SELECT';
            startMusic();
            if (net.host) {
                showInfo(`<h2 class="text-2xl text-yellow-300 mb-2 text-center">SALA</h2><div class="net-room-code">${message.code}</div><p class="text-xs text-gray-300 mb-4 text-center leading-relaxed">Pasale este código a tu amigo.<br>Los dos tienen que estar en la misma red.</p><button class="arcade-btn" onclick="copyRoomCode()">COPIAR CÓDIGO</button><p id="net-copy-st" class="text-xs text-cyan-300 mt-3 text-center"></p><p class="text-xs text-gray-400 mt-5 text-center">Esperando al otro jugador...</p><button class="${BTN}" onclick="goToMenu()">CANCELAR</button>`);
            } else {
                showInfo(`<h2 class="text-2xl text-green-400 mb-2 text-center" style="color:#9dff4a">SALA ${message.code}</h2><p class="text-xs text-gray-300 mb-6 text-center leading-relaxed">Ya estás dentro.<br>Elegí tu jugador mientras el anfitrión configura el partido.</p><button class="arcade-btn" onclick="beginPick()">ELEGIR MI JUGADOR</button><button class="${BTN}" onclick="goToMenu()">SALIR</button>`);
            }
        });

        Net.on('peer', message => {
            if (message.event === 'joined') {
                if (net.host) {
                    showInfo(`<h2 class="text-2xl text-green-400 mb-4 text-center" style="color:#9dff4a">¡RIVAL CONECTADO!</h2><p class="text-xs text-gray-300 mb-6 text-center leading-relaxed">Ya están los dos.<br>Elegí la duración y los goles; después cada uno elige su jugador.</p><button class="arcade-btn" onclick="showOptions()">CONTINUAR</button><button class="${BTN}" onclick="goToMenu()">CANCELAR</button>`);
                }
            } else if (message.event === 'left') {
                netLost('Tu rival salió de la sala.');
            }
        });

        Net.on('relay', message => netMsg(message));

        Net.on('server-error', message => {
            const text = NET_ERRORS[message.code] || message.message || 'Error de conexión.';
            const status = document.getElementById('net-st');
            if (status) {
                status.style.color = '#ff8fa3';
                status.textContent = text;
                return;
            }
            showInfo(`<h2 class="text-2xl text-pink-400 mb-4 text-center">NO SE PUDO CONECTAR</h2><p class="text-xs text-gray-300 mb-6 text-center">${text}</p><button class="arcade-btn" onclick="showOnline()">REINTENTAR</button><button class="${BTN}" onclick="goToMenu()">VOLVER</button>`);
        });

        Net.on('close', () => { if (net.on || net.active) netLost(); });
    }
    applyStadiumCrowd(); refreshAudioUI();
    goToMenu();
    requestAnimationFrame(frame);
