/**
 * Generates local SVG "photo" placeholders for accident damage records.
 * No network calls, no external assets — pure vector illustrations that
 * echo the report's palette so they never look like stock filler.
 */
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "public", "damage-photos");
fs.mkdirSync(outDir, { recursive: true });

const INK = "#0F172A";
const INK_SOFT = "#334155";
const LINE = "#94A3B8";
const DANGER = "#DC2626";
const DANGER_SOFT = "#FEE2E2";
const BG = "#EEF2F7";

function wrap(label, body) {
  return `<svg viewBox="0 0 400 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="400" height="280" fill="${BG}"/>
  <rect width="400" height="280" fill="url(#grid)"/>
  ${body}
  <g transform="translate(14,250)">
    <rect width="150" height="20" rx="10" fill="${INK}" opacity="0.85"/>
    <text x="75" y="14" font-family="monospace" font-size="10" fill="white" text-anchor="middle" letter-spacing="1">CARPROOF.UZ</text>
  </g>
</svg>`;
}

function damageBadge(cx, cy, r = 34) {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${DANGER_SOFT}" stroke="${DANGER}" stroke-width="2.5" stroke-dasharray="6 5"/>
  <path d="M${cx - 8} ${cy - 10} L${cx + 8} ${cy + 10} M${cx + 8} ${cy - 10} L${cx - 8} ${cy + 10}" stroke="${DANGER}" stroke-width="3" stroke-linecap="round"/>`;
}

const carTopView = `
  <g transform="translate(60,40)">
    <rect x="40" y="0" width="200" height="190" rx="46" fill="none" stroke="${INK_SOFT}" stroke-width="3"/>
    <rect x="60" y="18" width="160" height="60" rx="18" fill="none" stroke="${LINE}" stroke-width="2"/>
    <rect x="60" y="112" width="160" height="58" rx="18" fill="none" stroke="${LINE}" stroke-width="2"/>
    <line x1="140" y1="18" x2="140" y2="170" stroke="${LINE}" stroke-width="2"/>
  </g>`;

const carSideView = `
  <g transform="translate(30,90)">
    <path d="M10 90 C10 60 40 40 80 38 L120 10 L260 10 L300 40 C320 42 330 55 330 70 L330 90 Z" fill="none" stroke="${INK_SOFT}" stroke-width="3"/>
    <line x1="10" y1="90" x2="330" y2="90" stroke="${INK_SOFT}" stroke-width="3"/>
    <circle cx="90" cy="94" r="20" fill="none" stroke="${LINE}" stroke-width="3"/>
    <circle cx="270" cy="94" r="20" fill="none" stroke="${LINE}" stroke-width="3"/>
    <line x1="150" y1="12" x2="150" y2="40" stroke="${LINE}" stroke-width="2"/>
  </g>`;

const files = {
  "front-bumper.svg": wrap(
    "Повреждение переднего бампера",
    carSideView + damageBadge(65, 168, 30)
  ),
  "rear-bumper.svg": wrap(
    "Повреждение заднего бампера",
    carSideView + damageBadge(335, 168, 30)
  ),
  "hood-dent.svg": wrap("Вмятина на капоте", carSideView + damageBadge(130, 105, 32)),
  "roof-dent.svg": wrap("Повреждение крыши", carTopView + damageBadge(200, 110, 30)),
  "door-dent.svg": wrap("Повреждение двери", carTopView + damageBadge(140, 145, 34)),
  "fender-scratch.svg": wrap("Царапина на крыле", carTopView + damageBadge(90, 90, 28)),
  "windshield-crack.svg": wrap("Трещина лобового стекла", carSideView + damageBadge(175, 40, 26)),
  "general-damage.svg": wrap("Зафиксированные повреждения", carTopView + damageBadge(150, 108, 40)),
};

for (const [name, svg] of Object.entries(files)) {
  fs.writeFileSync(path.join(outDir, name), svg);
}

console.log(`Создано ${Object.keys(files).length} SVG-изображений в ${outDir}`);
