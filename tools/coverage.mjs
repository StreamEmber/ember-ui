// Her katalog varyantı (data-run olmayan) en az bir sunum sayfasında görünmeli:
// varyanttaki her mh-* sınıfı pages/*.html içinde geçmeli. Eksik varsa listeler ve 1 ile çıkar.
// Kullanım: node tools/coverage.mjs [--json]
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (...p) => readFileSync(path.join(root, ...p), 'utf8');
const pages = readdirSync(path.join(root, 'pages')).filter(f => f.endsWith('.html')).map(f => read('pages', f)).join('\n');
const inPages = new Set(pages.match(/mh-[a-z0-9_-]+/g));
const missing = [];
let total = 0;
for (const f of readdirSync(path.join(root, 'catalog')).filter(f => f.endsWith('.html')).sort()) {
  for (const m of read('catalog', f).matchAll(/<section ((?:"[^"]*"|[^>"])*)>\n?([\s\S]*?)<\/section>/g)) {
    if (/\bdata-run=/.test(m[1])) continue;
    total++;
    const cls = [...new Set(m[2].match(/mh-[a-z0-9_-]+/g) || [])].filter(c => !inPages.has(c));
    if (cls.length) missing.push({ id: `${f.replace('.html', '')}.${m[1].match(/data-id="([^"]*)"/)[1]}`, cls });
  }
}
if (process.argv.includes('--json')) { console.log(JSON.stringify(missing.map(x => x.id))); process.exit(0); }
for (const x of missing) console.log(`  ${x.id}: ${x.cls.join(' ')}`);
console.log(`sunum kapsamı: ${total - missing.length}/${total} varyant`);
process.exit(missing.length ? 1 : 0);
