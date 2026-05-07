#!/usr/bin/env node
// Reads imageUrl entries from lib/questions.ts and emits a placeholder SVG
// at every public/<imageUrl> path that does not already exist.
//
// Idempotent. Run after editing questions.ts. Real assets (.svg or .webp at
// the same path) won't be overwritten because we skip existing files.
//
// Usage: node scripts/generate-placeholders.mjs [--force]

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const SRC = resolve(root, 'lib/questions.ts');
const PUBLIC = resolve(root, 'public');

const force = process.argv.includes('--force');

function collectPaths() {
  const text = readFileSync(SRC, 'utf8');
  const paths = new Set();
  // Literal string form: imageUrl: '/images/quiz/foo/bar.svg'
  const literal = /imageUrl:\s*['"](\/images\/quiz\/[^'"]+)['"]/g;
  let m;
  while ((m = literal.exec(text)) !== null) paths.add(m[1]);
  // Helper-call form: imageUrl: img('step', 'option')
  const helper = /imageUrl:\s*img\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g;
  while ((m = helper.exec(text)) !== null) paths.add(`/images/quiz/${m[1]}/${m[2]}.svg`);
  // Sandbox demo asset, used by app/_design/option-card/page.tsx
  paths.add('/images/quiz/_demo/sample.svg');
  return paths;
}

function placeholderSvg(optionId) {
  // 480x480 square. CSS object-fit on the OptionCard handles aspect-cropping.
  // - paper-warm bg (#F8F4EE) with dashed border in #DEDEDF
  // - center: Lucide-style image glyph in muted ink
  // - option id in mono below
  // - TODO chip top-left in brand red
  const safeId = String(optionId).replace(/[<>&]/g, '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="480" height="480" role="img" aria-label="Placeholder for ${safeId}">
  <rect width="480" height="480" fill="#F8F4EE"/>
  <rect x="6" y="6" width="468" height="468" rx="20" ry="20" fill="none" stroke="#DEDEDF" stroke-width="1.5" stroke-dasharray="6 6"/>
  <g transform="translate(208 188)" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <rect x="0" y="0" width="64" height="64" rx="6" ry="6"/>
    <circle cx="20" cy="22" r="5"/>
    <path d="M64 48 L48 32 a4 4 0 0 0 -6 0 L8 64"/>
  </g>
  <text x="240" y="296" font-family="ui-monospace, 'Geist Mono', 'JetBrains Mono', monospace" font-size="20" fill="#475569" text-anchor="middle" font-weight="500" letter-spacing="0.04em">${safeId}</text>
  <g transform="translate(20 20)">
    <rect width="62" height="22" rx="4" ry="4" fill="#A50015"/>
    <text x="31" y="15" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="0.12em">TODO</text>
  </g>
</svg>
`;
}

function main() {
  const paths = collectPaths();
  let created = 0, skipped = 0;
  for (const p of paths) {
    const fileAbs = resolve(PUBLIC, '.' + p);
    if (!force && existsSync(fileAbs)) { skipped++; continue; }
    mkdirSync(dirname(fileAbs), { recursive: true });
    const optionId = p.split('/').pop().replace(/\.svg$/, '');
    writeFileSync(fileAbs, placeholderSvg(optionId));
    created++;
  }
  console.log(`generated ${created} placeholder(s); skipped ${skipped} existing`);
}

main();
