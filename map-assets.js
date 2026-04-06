#!/usr/bin/env node
/**
 * map-assets.js — BEN OS asset catalog utility
 * Run from project root: node map-assets.js
 *
 * What it does:
 * - Walks the assets/ folder and lists every file
 * - Groups files by category (portfolio, memes, memebot, generated)
 * - Flags files referenced in chat.js MEDIA catalog that don't exist on disk
 * - Flags files on disk that aren't referenced in chat.js MEDIA catalog
 * - Prints a ready-to-paste MEDIA entry skeleton for any unregistered thumbs
 */

const fs   = require('fs');
const path = require('path');

/* ── CONFIG ──────────────────────────────────────── */
const ASSETS_DIR  = path.join(__dirname, 'assets');
const CHAT_JS     = path.join(__dirname, 'chat.js');
const THUMB_NAMES = ['thumb.jpg', 'thumb.jpeg', 'thumb.gif', 'thumb.png', 'thumb.webp'];

/* ── HELPERS ─────────────────────────────────────── */
function walk(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else results.push(full.replace(__dirname + path.sep, '').replace(/\\/g, '/'));
  }
  return results;
}

function group(files) {
  const groups = {};
  for (const f of files) {
    const parts = f.split('/');
    const top = parts.slice(0, 3).join('/'); // e.g. assets/portfolio/graphic-design
    if (!groups[top]) groups[top] = [];
    groups[top].push(f);
  }
  return groups;
}

function extractMediaPaths(chatJs) {
  const paths = new Set();
  const re = /['"`](assets\/[^'"`\s]+)['"`]/g;
  let m;
  while ((m = re.exec(chatJs)) !== null) paths.add(m[1]);
  return paths;
}

function isThumb(filename) {
  return THUMB_NAMES.includes(path.basename(filename).toLowerCase());
}

function guessCollection(filePath) {
  if (filePath.includes('/graphic-design/')) return 'design';
  if (filePath.includes('/video/'))          return 'video';
  if (filePath.includes('/posters/'))        return 'posters';
  if (filePath.includes('/memes/'))          return 'memes';
  if (filePath.includes('/memebot/'))        return 'memebot';
  if (filePath.includes('/generated/'))      return 'generated';
  return 'other';
}

function mediaEntry(filePath) {
  const label = path.dirname(filePath).split('/').pop().replace(/-/g, ' ');
  const labelTitled = label.replace(/\b\w/g, c => c.toUpperCase());
  return `    { src: '${filePath}', fullSrc: '${filePath}', label: '${labelTitled}', type: 'lightbox', caseStudyUrl: null }`;
}

/* ── MAIN ────────────────────────────────────────── */
const hr = '─'.repeat(60);

console.log('\n' + hr);
console.log('  BEN OS — Asset Map');
console.log(hr);

if (!fs.existsSync(ASSETS_DIR)) {
  console.log('\n⚠️  No assets/ folder found. Run from project root.\n');
  process.exit(1);
}

const allFiles    = walk(ASSETS_DIR);
const chatContent = fs.existsSync(CHAT_JS) ? fs.readFileSync(CHAT_JS, 'utf8') : '';
const referencedPaths = extractMediaPaths(chatContent);
const grouped     = group(allFiles);

/* ── FULL FILE LIST ──────────────────────────────── */
console.log(`\n📁 ALL ASSETS (${allFiles.length} files)\n`);
for (const [bucket, files] of Object.entries(grouped).sort()) {
  console.log(`  ${bucket}/`);
  for (const f of files.sort()) {
    const name = path.basename(f);
    const referenced = referencedPaths.has(f);
    const marker = referenced ? '  ✅' : '  ⬜';
    console.log(`  ${marker}  ${name}`);
  }
  console.log('');
}

/* ── MISSING FILES (referenced in chat.js but not on disk) ── */
const missing = [...referencedPaths].filter(p =>
  p.startsWith('assets/') &&
  !fs.existsSync(path.join(__dirname, p))
).sort();

console.log(hr);
console.log(`\n⚠️  REFERENCED IN chat.js BUT MISSING ON DISK (${missing.length})\n`);
if (missing.length === 0) {
  console.log('  All referenced assets exist. ✅\n');
} else {
  for (const f of missing) console.log(`  ✗  ${f}`);
  console.log('');
}

/* ── UNREGISTERED THUMBS (on disk but not in chat.js MEDIA) ── */
const unregistered = allFiles.filter(f =>
  isThumb(f) && !referencedPaths.has(f)
).sort();

console.log(hr);
console.log(`\n🆕  THUMBS ON DISK NOT IN chat.js MEDIA (${unregistered.length})\n`);
if (unregistered.length === 0) {
  console.log('  All thumbs are registered. ✅\n');
} else {
  for (const f of unregistered) {
    const col = guessCollection(f);
    console.log(`  ${f}  →  suggested collection: "${col}"`);
    console.log(`  Paste into MEDIA['${col}']:`);
    console.log(mediaEntry(f));
    console.log('');
  }
}

/* ── SUMMARY ─────────────────────────────────────── */
console.log(hr);
console.log(`\n📊 SUMMARY`);
console.log(`  Total files:          ${allFiles.length}`);
console.log(`  Referenced in script: ${[...referencedPaths].filter(p => p.startsWith('assets/')).length}`);
console.log(`  Missing on disk:      ${missing.length}`);
console.log(`  Unregistered thumbs:  ${unregistered.length}`);
console.log('\n' + hr + '\n');
