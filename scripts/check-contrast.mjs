/**
 * Offline contrast check for the CAST palette engine in client.js.
 * Run with `node scripts/check-contrast.mjs`.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const source = readFileSync(fileURLToPath(new URL('../client.js', import.meta.url)), 'utf8');
const START = '/* ==== CAST-PALETTE-START ==== */';
const END = '/* ==== CAST-PALETTE-END ==== */';
const start = source.indexOf(START);
const end = source.indexOf(END);
if (start < 0 || end < 0 || end <= start) throw new Error('palette section markers not found');
const section = source.slice(start + START.length, end);
const palette = new Function(section + '\nreturn { CAST, buildTokens };')();
console.log('characters: ' + palette.CAST.map((c) => c.id).join(', '));

function parseHex(hex) {
  const n = parseInt(hex.trim().slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function parse(value) {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  const rgba = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(value);
  if (rgba) return [Number(rgba[1]), Number(rgba[2]), Number(rgba[3]), rgba[4] === undefined ? 1 : Number(rgba[4])];
  return null;
}
function over(fg, bg) {
  const a = fg[3];
  return [fg[0] * a + bg[0] * (1 - a), fg[1] * a + bg[1] * (1 - a), fg[2] * a + bg[2] * (1 - a), 1];
}
function channel(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
function luminance(rgb) {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}
function ratio(fgValue, bgValue, baseValue) {
  const fg = parse(fgValue);
  const bg = parse(bgValue);
  if (!fg || !bg) return null;
  const base = baseValue === undefined ? [255, 255, 255, 1] : parse(baseValue);
  if (!base) return null;
  const bgFlat = bg[3] < 1 ? over(bg, base) : bg;
  const fgFlat = fg[3] < 1 ? over(fg, bgFlat) : fg;
  const a = luminance(fgFlat);
  const b = luminance(bgFlat);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

// [label, fg token, bg token, min, bg composite base token]
const SCENARIOS = [
  ['primary on base', '--dsw-alias-label-primary', '--dsw-alias-bg-base', 4.5],
  ['primary on layer-1', '--dsw-alias-label-primary', '--dsw-alias-bg-layer-1', 4.5],
  ['primary on layer-2', '--dsw-alias-label-primary', '--dsw-alias-bg-layer-2', 4.5],
  ['primary on card', '--dsw-alias-label-primary', '--dsw-alias-card-fill', 4.5],
  ['primary on sidebar', '--dsw-alias-label-primary', '--dsw-specific-sidebar-fill', 4.5],
  ['primary on bubble', '--dsw-alias-label-primary', '--dsw-specific-bubble', 4.5],
  ['primary on overlay', '--dsw-alias-label-primary', '--dsw-alias-bg-overlay', 4.5],
  ['primary on input', '--dsw-alias-label-primary', '--dsw-specific-input-major', 4.5],
  ['primary on module', '--dsw-alias-label-primary', '--dsw-alias-bg-module-platform', 4.5],
  ['secondary on layer-1', '--dsw-alias-label-secondary', '--dsw-alias-bg-layer-1', 4.5],
  ['secondary on card', '--dsw-alias-label-secondary', '--dsw-alias-card-fill', 4.5],
  ['tertiary on layer-1', '--dsw-alias-label-tertiary', '--dsw-alias-bg-layer-1', 4.5],
  ['caption on layer-1', '--dsw-alias-label-caption', '--dsw-alias-bg-layer-1', 3],
  ['button glyph', '--dsw-alias-label-primary-foreground', '--dsw-alias-button-primary-fill', 4.5],
  ['button glyph hover', '--dsw-alias-label-primary-foreground', '--dsw-alias-button-primary-hover', 4.5],
  ['brand text on base', '--dsw-alias-brand-primary', '--dsw-alias-bg-base', 3],
  ['link on layer-1', '--dsw-alias-link', '--dsw-alias-bg-layer-1', 4.5],
  ['error on base', '--dsw-alias-state-error-primary', '--dsw-alias-bg-base', 4.5],
  ['success on base', '--dsw-alias-state-success-primary', '--dsw-alias-bg-base', 4.5],
  ['warn label on base', '--dsw-alias-state-warn-label', '--dsw-alias-bg-base', 4.5],
  ['warn label on tertiary', '--dsw-alias-state-warn-label', '--dsw-alias-state-warn-tertiary', 4.5],
  ['deep diving on layer-1', '--dsw-alias-label-deep-diving', '--dsw-alias-bg-layer-1', 3],
  ['bluish on business', '--dsw-alias-label-primary-bluish', '--dsw-alias-state-business-tertiary', 4.5],
  ['toast label', '--dsw-alias-toast-label', '--dsw-alias-toast-bg', 4.5],
  ['toast action', '--dsw-alias-toast-action', '--dsw-alias-toast-bg', 4.5],
  ['tooltip label', '--dsw-alias-tooltip-label', '--dsw-alias-tooltip-bg', 4.5],
  ['tooltip key label', '--dsw-alias-tooltip-label', '--dsw-alias-tooltip-key-bg', 4.5],
  ['hovercard secondary', '--dsw-alias-hovercard-label-secondary', '--dsw-alias-hovercard-bg', 4.5],
  ['hovercard tertiary', '--dsw-alias-hovercard-label-tertiary', '--dsw-alias-hovercard-bg', 4.5],
  ['hovercard done dot', '--dsw-alias-hovercard-state-done', '--dsw-alias-hovercard-bg', 3],
  ['hovercard error dot', '--dsw-alias-hovercard-state-error', '--dsw-alias-hovercard-bg', 3],
  ['menu primary', '--dsw-alias-label-primary', '--dsw-menu-surface-fill', 4.5],
  ['menu secondary', '--dsw-alias-label-secondary', '--dsw-menu-surface-fill', 4.5],
  ['menu icon', '--dsw-alias-menu-icon', '--dsw-alias-bg-layer-1', 3],
  ['send glyph', '--dsw-alias-label-on-color', '--dsw-alias-button-info-fill', 3],
  ['send glyph hover', '--dsw-alias-label-on-color', '--dsw-alias-button-info-hover', 3],
  ['info badge', '--dsw-alias-button-info-fill', '--dsw-specific-sidebar-nav-item-active-accent', 4.5, '--dsw-specific-sidebar-fill'],
  ['info folder glyph', '--dsw-alias-button-info-fill', '--dsw-alias-interactive-bg-active', 3, '--dsw-alias-bg-layer-1'],
  ['info merge label', '--dsw-alias-button-info-fill', '--dsw-alias-bg-layer-2', 4.5],
  ['border selected vs base', '--dsw-alias-border-selected', '--dsw-alias-bg-base', 3],
  ['art strong on base', '--mewtype-ink-strong', '--dsw-alias-bg-base', 3],
  ['art accent on base', '--mewtype-ink-accent', '--dsw-alias-bg-base', 3],
  ['star 0 on base', '--mewtype-star-0', '--dsw-alias-bg-base', 3],
  ['star 1 on base', '--mewtype-star-1', '--dsw-alias-bg-base', 3],
  ['star 2 on base', '--mewtype-star-2', '--dsw-alias-bg-base', 3],
];

let totalFailures = 0;
for (const cast of palette.CAST) {
  const tokens = palette.buildTokens(cast);
  const names = Object.keys(tokens);
  const problems = [];
  for (const name of names) {
    const modes = tokens[name];
    if (typeof modes !== 'object' || modes === null
      || typeof modes.light !== 'string' || typeof modes.dark !== 'string' || modes.light === '' || modes.dark === '') {
      problems.push('malformed token ' + name);
    }
  }
  let tightest = Infinity;
  let tightestLabel = '';
  let low = 0;
  for (const scheme of ['light', 'dark']) {
    for (const [label, fgName, bgName, min, baseName] of SCENARIOS) {
      const fg = tokens[fgName] && tokens[fgName][scheme];
      const bg = tokens[bgName] && tokens[bgName][scheme];
      const base = baseName === undefined ? tokens['--dsw-alias-bg-base'][scheme] : tokens[baseName][scheme];
      const value = fg && bg ? ratio(fg, bg, base) : null;
      if (value === null) {
        problems.push(scheme + ': unparsed ' + label);
        continue;
      }
      if (value < min) {
        low += 1;
        problems.push(scheme + ': LOW ' + value.toFixed(2) + ' (min ' + min + ') ' + label);
      }
      const margin = value / min;
      if (margin < tightest) { tightest = margin; tightestLabel = scheme + ' ' + label + ' ' + value.toFixed(2); }
    }
  }
  totalFailures += problems.length;
  console.log('\n=== ' + cast.id + ' (' + cast.color + ') — ' + names.length + ' tokens ===');
  console.log('tightest ratio: ' + tightestLabel + ' (x' + tightest.toFixed(2) + ' of floor)');
  // Glow presence: the composited main aurora stop against each canvas. Printed,
  // not asserted; the personality order (Arale brightest) should now hold in
  // both palettes.
  for (const scheme of ['light', 'dark']) {
    const aurora = tokens['--mewtype-aurora-a'][scheme];
    const base = tokens['--dsw-alias-bg-base'][scheme];
    const value = ratio(aurora, base, base);
    console.log('  ' + scheme + ' main glow contrast: ' + (value === null ? '-' : value.toFixed(2)));
  }
  if (problems.length === 0) console.log('all scenarios pass');
  else for (const problem of problems) console.log('  ' + problem);
}
console.log('\ntotal problems: ' + totalFailures);
process.exitCode = totalFailures === 0 ? 0 : 1;
