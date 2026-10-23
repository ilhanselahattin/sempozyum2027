// Topografik kontur deseni üretir → assets/img/topo-light.svg ve topo-dark.svg
// Çalıştırma: node assets/src/topo.js   (tohum değiştirilerek farklı desen elde edilir)
const fs = require('fs');
const path = require('path');

const W = 1600, H = 1000, STEP = 10;            // çıktı boyutu ve ızgara aralığı
const COLS = W / STEP + 1, ROWS = H / STEP + 1;
let seed = 20270118;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

// Değer gürültüsü (value noise) + fBm
const G = 64, grid = Array.from({ length: G * G }, rand);
const smooth = (t) => t * t * (3 - 2 * t);
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const g = (i, j) => grid[((j & (G - 1)) * G) + (i & (G - 1))];
  const a = g(xi, yi), b = g(xi + 1, yi), c = g(xi, yi + 1), d = g(xi + 1, yi + 1);
  const u = smooth(xf), v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, y) => noise(x, y) * 0.6 + noise(x * 2.1, y * 2.1) * 0.28 + noise(x * 4.3, y * 4.3) * 0.12;

const field = [];
for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) field.push(fbm(i * 0.022, j * 0.022));
const val = (i, j) => field[j * COLS + i];

// Marching squares → segmentler
const LEVELS = 16, segs = [];
for (let l = 1; l < LEVELS; l++) {
  const t = 0.18 + (l / LEVELS) * 0.64;
  for (let j = 0; j < ROWS - 1; j++) for (let i = 0; i < COLS - 1; i++) {
    const v = [val(i, j), val(i + 1, j), val(i + 1, j + 1), val(i, j + 1)];
    const p = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]];
    const pts = [];
    for (let e = 0; e < 4; e++) {
      const a = v[e], b = v[(e + 1) % 4];
      if ((a < t) !== (b < t)) {
        const k = (t - a) / (b - a), A = p[e], B = p[(e + 1) % 4];
        pts.push([(A[0] + (B[0] - A[0]) * k) * STEP, (A[1] + (B[1] - A[1]) * k) * STEP]);
      }
    }
    if (pts.length === 2) segs.push(pts);
    if (pts.length === 4) { segs.push([pts[0], pts[1]]); segs.push([pts[2], pts[3]]); }
  }
}

// Segmentleri çoklu çizgilere birleştir
const key = (p) => p[0].toFixed(2) + ',' + p[1].toFixed(2);
const ends = new Map();
segs.forEach((s, idx) => s.forEach((p) => { const k = key(p); (ends.get(k) || ends.set(k, []).get(k)).push(idx); }));
const used = new Uint8Array(segs.length), lines = [];
function walk(start) {
  const line = [segs[start][0], segs[start][1]]; used[start] = 1;
  for (const dir of [1, 0]) {
    for (;;) {
      const tip = dir ? line[line.length - 1] : line[0];
      const next = (ends.get(key(tip)) || []).find((n) => !used[n]);
      if (next === undefined) break;
      used[next] = 1;
      const s = segs[next], other = key(s[0]) === key(tip) ? s[1] : s[0];
      dir ? line.push(other) : line.unshift(other);
    }
  }
  return line;
}
segs.forEach((_, i) => { if (!used[i]) lines.push(walk(i)); });

// Chaikin yumuşatma + seyreltme
function chaikin(pts) {
  const out = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [a, b] = [pts[i], pts[i + 1]];
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  out.push(pts[pts.length - 1]);
  return out;
}
const d = lines.filter((l) => l.length > 6).map((l) => {
  const s = chaikin(chaikin(l)).filter((_, i, arr) => i % 3 === 0 || i === arr.length - 1);
  return 'M' + s.map((p) => Math.round(p[0]) + ' ' + Math.round(p[1])).join('L');
}).join('');

// Temaya göre iki renkli sürüm (CSS'te background-image olarak kullanılır; maske yok → kaydırma ucuz)
const variants = { light: 'rgba(47,75,55,0.16)', dark: 'rgba(169,198,159,0.12)' };
for (const [name, color] of Object.entries(variants)) {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice"><path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  fs.writeFileSync(path.join(__dirname, '..', 'img', 'topo-' + name + '.svg'), svg);
  console.log('topo-' + name + '.svg', (svg.length / 1024).toFixed(1) + ' KB');
}
