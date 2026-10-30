// Katalog okuyucu: catalog/<aile>.html -> aileler ve varyantlar (build-ai ve build-site ortak kullanır).
// Her <section data-id data-title data-use [data-js] [data-run] [data-wide] [data-box]> bir varyanttır.
// Varyanttaki her eui-* sınıfının kit CSS'inde olduğunu doğrular.
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
export const CDN = `https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v${version}/`;

const cssFiles = [];
for (const d of ['kit/css']) for (const f of await readdir(path.join(root, d))) if (f.endsWith('.css')) cssFiles.push(path.join(root, d, f));
const css = (await Promise.all(cssFiles.map(f => readFile(f, 'utf8')))).join('\n');
export const known = new Set(css.match(/\.eui-[a-z0-9_-]+/g).map(c => c.slice(1)));

export const families = [];
const ids = new Set();
for (const file of (await readdir(path.join(root, 'catalog'))).filter(f => f.endsWith('.html')).sort()) {
  const src = await readFile(path.join(root, 'catalog', file), 'utf8');
  const head = src.match(/<!--\s*family:\s*([^|]+)\|([\s\S]*?)-->/);
  if (!head) throw new Error(`${file}: "<!-- family: Ad | açıklama -->" satırı yok`);
  const fam = { id: file.replace('.html', ''), title: head[1].trim(), desc: head[2].trim(), items: [] };
  for (const m of src.matchAll(/<section ((?:"[^"]*"|[^>"])*)>\n?([\s\S]*?)<\/section>/g)) {
    const a = Object.fromEntries([...m[1].matchAll(/([a-z-]+)="([^"]*)"/g)].map(x => [x[1], x[2]]));
    if (!a['data-id'] || !a['data-title'] || !a['data-use']) throw new Error(`${file}: data-id/title/use eksik: ${m[1].slice(0, 60)}`);
    // data-run: parça HTML değil, sitede "Çalıştır" düğmesiyle koşan JS çağrısıdır
    const it = { id: `${fam.id}.${a['data-id']}`, title: a['data-title'], use: a['data-use'], js: a['data-js'] || '', run: 'data-run' in a, wide: 'data-wide' in a, box: a['data-box'], html: m[2].trim() };
    if (ids.has(it.id)) throw new Error(`yinelenen kimlik: ${it.id}`);
    ids.add(it.id);
    if (!it.run) for (const c of it.html.matchAll(/class="([^"]*)"/g)) for (const k of c[1].split(/\s+/)) {
      if (k.startsWith('eui-') && !known.has(k)) throw new Error(`${it.id}: CSS'te olmayan sınıf ${k}`);
    }
    fam.items.push(it);
  }
  if (fam.items.length !== (src.match(/<section /g) || []).length) throw new Error(`${file}: biçimi bozuk bir <section> var`);
  families.push(fam);
}
export const variantCount = ids.size;
