// catalog/*.html -> ai/<aile>.md + AI.md (npm paketine girer) ve _site/ galerisi.
// Her <section data-id data-title data-use [data-js]> bir varyanttır; HTML parçası hem galeride çizilir hem AI belgesine girer.
// Kullanım: npm run build && npm run catalog   (--local: sayfalar jsDelivr yerine yerel dist/'i kullanır)
import { readdir, readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { version } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const THEMES = ['modern', 'tactical', 'frontier', 'oldwest'];
const CDN = `https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v${version}/dist/`;
const LOCAL = process.argv.includes('--local');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// kit'teki sınıflar (doğrulama için)
const cssFiles = [];
for (const d of ['kit/css', 'kit/css/themes']) for (const f of await readdir(path.join(root, d))) if (f.endsWith('.css')) cssFiles.push(path.join(root, d, f));
const css = (await Promise.all(cssFiles.map(f => readFile(f, 'utf8')))).join('\n');
const known = new Set(css.match(/\.mh-[a-z0-9_-]+/g).map(c => c.slice(1)));

// katalog oku
const families = [];
const ids = new Set();
for (const file of (await readdir(path.join(root, 'catalog'))).filter(f => f.endsWith('.html')).sort()) {
  const src = await readFile(path.join(root, 'catalog', file), 'utf8');
  const head = src.match(/<!--\s*family:\s*([^|]+)\|([\s\S]*?)-->/);
  if (!head) throw new Error(`${file}: "<!-- family: Ad | açıklama -->" satırı yok`);
  const fam = { id: file.replace('.html', ''), title: head[1].trim(), desc: head[2].trim(), items: [] };
  const re = /<section ((?:"[^"]*"|[^>"])*)>\n?([\s\S]*?)<\/section>/g;
  for (const m of src.matchAll(re)) {
    const a = Object.fromEntries([...m[1].matchAll(/([a-z-]+)="([^"]*)"/g)].map(x => [x[1], x[2]]));
    if (!a['data-id'] || !a['data-title'] || !a['data-use']) throw new Error(`${file}: data-id/title/use eksik: ${m[1].slice(0, 60)}`);
    // data-run: parça HTML değil, galeride "Çalıştır" düğmesiyle koşan JS çağrısıdır
    const it = { id: `${fam.id}.${a['data-id']}`, title: a['data-title'], use: a['data-use'], js: a['data-js'] || '', run: 'data-run' in a, wide: 'data-wide' in a, box: a['data-box'], html: m[2].trim() };
    if (ids.has(it.id)) throw new Error(`yinelenen kimlik: ${it.id}`);
    ids.add(it.id);
    if (!it.run) for (const c of it.html.matchAll(/class="([^"]*)"/g)) for (const k of c[1].split(/\s+/)) {
      if (k.startsWith('mh-') && !known.has(k)) throw new Error(`${it.id}: CSS'te olmayan sınıf ${k}`);
    }
    fam.items.push(it);
  }
  if (fam.items.length !== (src.match(/<section /g) || []).length) throw new Error(`${file}: biçimi bozuk bir <section> var`);
  families.push(fam);
}

// ---- AI belgeleri
await mkdir(path.join(root, 'ai'), { recursive: true });
const itemMd = it => `## ${it.id} — ${it.title}\n${it.use}\n${it.js ? `JS: \`${it.js}\`\n` : ''}\n\`\`\`${it.run ? 'js' : 'html'}\n${it.html}\n\`\`\`\n`;
for (const f of families) await writeFile(path.join(root, 'ai', `${f.id}.md`), `# ${f.title}\n${f.desc}\n\n${f.items.map(itemMd).join('\n')}`);
const intro = (await readFile(path.join(root, 'catalog', '_intro.md'), 'utf8')).replaceAll('{{version}}', version);
const base = `https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v${version}/ai/`;
const index = families.map(f => `### ${f.title} → ${base}${f.id}.md\n${f.items.map(i => `- \`${i.id}\` ${i.title}: ${i.use.split('. ')[0].replace(/\.$/, '')}`).join('\n')}\n`).join('\n');
await writeFile(path.join(root, 'AI.md'), `${intro}\n## Bileşen aileleri\n\n${index}`);

// ---- galeri
const site = path.join(root, '_site');
await rm(site, { recursive: true, force: true });
await mkdir(site, { recursive: true });
await cp(path.join(root, 'dist'), path.join(site, 'dist'), { recursive: true });
await writeFile(path.join(site, '.nojekyll'), '');
// Sunum sayfaları (pages/ + demo/ kabuğu) kiti jsDelivr'den yükler
for (const d of ['demo', 'pages']) await cp(path.join(root, d), path.join(site, d), { recursive: true });
const shows = [];
for (const f of (await readdir(path.join(root, 'pages'))).filter(f => f.endsWith('.html')).sort()) {
  const src = await readFile(path.join(root, 'pages', f), 'utf8');
  if (!src.includes(CDN + 'mhud.min.css') || !src.includes(CDN + 'mhud.min.js')) throw new Error(`pages/${f}: kit ${CDN} adresinden yüklenmiyor (node tools/set-version.mjs)`);
  if (LOCAL) await writeFile(path.join(site, 'pages', f), src.replaceAll(CDN, '../dist/'));
  const t = src.match(/<title>([^<—]+)/);
  shows.push({ href: 'pages/' + f, label: (t ? t[1] : f).trim() });
}
const demoJs = path.join(site, 'demo', 'demo.js');
await writeFile(demoJs, (await readFile(demoJs, 'utf8')).replace('var CATALOG = [];', 'var CATALOG = ' + JSON.stringify(families.map(f => ({ href: f.id + '.html', label: f.title, icon: 'layers' }))) + ';'));

const nav = cur => `<nav class="g-nav"><a class="g-brand" href="index.html">MHud <small>${version}</small></a><b>Bileşen kataloğu</b><a href="index.html"${cur === '' ? ' class="on"' : ''}>Tüm aileler</a>${families.map(f => `<a href="${f.id}.html"${f.id === cur ? ' class="on"' : ''}>${f.title}</a>`).join('')}<b>Sunumlar</b>${shows.map(p => `<a href="${p.href}">${esc(p.label)}</a>`).join('')}</nav>`;
const page = (title, cur, body) => `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — MHud</title>
<link rel="stylesheet" href="${LOCAL ? 'dist/' : CDN}mhud.min.css">
<style>
body{margin:0;background:#12151b;color:#e8eaf0;font:14px/1.5 system-ui,sans-serif}
.g-nav{position:fixed;left:0;top:0;bottom:0;width:230px;overflow:auto;display:flex;flex-direction:column;gap:1px;padding:14px 10px;background:#0b0d11;z-index:5;box-sizing:border-box}
.g-nav b{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6b7383;margin:14px 8px 4px}
.g-nav a{color:#aab2c0;text-decoration:none;padding:6px 10px;border-radius:6px;font-size:13px}.g-nav a.on,.g-nav a:hover{background:#222833;color:#fff}
.g-nav .g-brand{color:#fff;font-weight:800;font-size:16px}.g-brand small{color:#f5b83d;font-weight:600;font-size:11px}
body{padding-left:230px}.g-bar{position:sticky;top:0;z-index:4;background:#12151b}
@media(max-width:800px){body{padding-left:0}.g-nav{position:static;width:auto}}
.g-bar{display:flex;gap:6px;flex-wrap:wrap;padding:12px 16px}.g-bar button{background:#222833;color:#cfd5e0;border:0;border-radius:6px;padding:6px 12px;cursor:pointer}.g-bar button.on{background:#f5b83d;color:#111}
main{padding:0 16px 40px;max-width:1200px;margin:auto}h1{margin:16px 0 4px}p.d{color:#9aa3b2;margin:0 0 12px}
.g-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:14px}
.g-card{background:#1a1f28;border-radius:10px;overflow:hidden}.g-card h3{margin:0;padding:10px 12px 0;font-size:14px}.g-card h3 code{color:#f5b83d;font-size:12px;margin-left:6px}
.g-card p{margin:2px 12px 8px;color:#9aa3b2;font-size:12px}
.g-stage .mh-flex{flex-wrap:wrap}.g-wide{grid-column:1/-1}
.g-stage{overflow:auto;padding:22px 16px;background:linear-gradient(135deg,#2a3140,#1a1f28);min-height:70px}
[data-mh-theme=frontier] .g-stage{background:linear-gradient(135deg,#3a3326,#1c1812)}[data-mh-theme=oldwest] .g-stage{background:linear-gradient(135deg,#8a7350,#5c4a2e)}
.g-stage .mh-minimap__map{background:linear-gradient(135deg,#3b4a3a,#27332a)}
.g-run{background:#f5b83d;color:#111;border:0;border-radius:6px;padding:6px 14px;cursor:pointer;font-weight:600}
.g-card details{padding:0 12px 10px}.g-card summary{cursor:pointer;color:#9aa3b2;font-size:12px;padding:8px 0}.g-card pre{margin:0;overflow:auto;font-size:11px;background:#0b0d11;padding:10px;border-radius:6px;color:#cfd5e0}
.g-fam a{display:block;background:#1a1f28;border-radius:10px;padding:14px 16px;color:inherit;text-decoration:none;margin-bottom:10px}.g-fam b{color:#fff}.g-fam span{color:#9aa3b2}
</style></head>
<body class="mh" data-mh-theme="modern">${nav(cur)}${body}<div class="mh-screen" style="position:fixed"></div>
<script src="${LOCAL ? 'dist/' : CDN}mhud.min.js"></script>
<script>
MH.mount(document.body);
var btns=document.querySelectorAll('[data-theme]');
function setTheme(t){MH.theme(t);btns.forEach(function(b){b.classList.toggle('on',b.dataset.theme===t)});try{localStorage.setItem('mhud-demo:theme',t)}catch(e){}}
btns.forEach(function(b){b.onclick=function(){setTheme(b.dataset.theme)}});
document.querySelectorAll('.g-run').forEach(function(b){b.onclick=function(){try{new Function(b.closest('.g-card').querySelector('pre').textContent)()}catch(e){console.error(e)}}});
var rnd=Math.random;
var go=document.getElementById('go');
if(go)go.onclick=function(){
  document.querySelectorAll('.mh-bar[data-v]').forEach(function(b){MH.bar(b,rnd()*100)});
  document.querySelectorAll('.mh-ringval').forEach(function(n){var v=rnd();MH.ring(n,v);var t=n.querySelector('b');if(t)t.textContent=Math.round(v*100)});
  document.querySelectorAll('.mh-core').forEach(function(n){MH.core(n,{value:rnd()*100,core:rnd()*100})});
  document.querySelectorAll('.mh-compass').forEach(function(n){MH.compass(n,rnd()*360)});
  document.querySelectorAll('.mh-wayarrow').forEach(function(n){n.style.setProperty('--a',Math.round(rnd()*360)+'deg')});
  document.querySelectorAll('.mh-speedo').forEach(function(n){MH.speedo(n,{speed:rnd()*240,rpm:rnd(),gear:1+Math.floor(rnd()*6)})});
  document.querySelectorAll('[data-pips]').forEach(function(n){var t=n.children.length;MH.pips(n,Math.round(rnd()*t),t)});
};
var s;try{s=localStorage.getItem('mhud-demo:theme')}catch(e){} setTheme(['modern','tactical','frontier','oldwest'].indexOf(s)>=0?s:'modern');
</script></body></html>`;

const box = i => { if (!i.box) return i.html; const [w, h, k, iw, ih] = i.box.split(',').map(Number); return `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden"><div style="position:absolute;left:0;top:0;width:${iw}px;height:${ih}px;transform:scale(${k});transform-origin:0 0">${i.html}</div></div>`; };
const bar = `<div class="g-bar">${THEMES.map(t => `<button data-theme="${t}">${t}</button>`).join('')}<button id="go">Değerleri değiştir</button></div>`;
for (const f of families) {
  const cards = f.items.map(i => `<div class="g-card${i.wide ? ' g-wide' : ''}"><h3>${i.title}<code>${i.id}</code></h3><p>${esc(i.use)}</p><div class="g-stage">${i.run ? '<button class="g-run">Çalıştır</button>' : box(i)}</div><details${i.run ? ' open' : ''}><summary>${i.run ? 'JS' : 'HTML'}${i.js ? ' · ' + esc(i.js) : ''}</summary><pre>${esc(i.html)}</pre></details></div>`).join('');
  await writeFile(path.join(site, `${f.id}.html`), page(f.title, f.id, `${bar}<main><h1>${f.title}</h1><p class="d">${esc(f.desc)}</p><div class="g-grid">${cards}</div></main>`));
}
await writeFile(path.join(site, 'index.html'), page('Galeri', '', `<main><h1>MHud ${version}</h1><p class="d">Bileşen aileleri. Yapay zeka için kılavuz: <a href="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v${version}/AI.md" style="color:#f5b83d">AI.md</a></p><div class="g-fam">${families.map(f => `<a href="${f.id}.html"><b>${f.title}</b> <span>· ${f.items.length} varyant — ${esc(f.desc)}</span></a>`).join('')}</div></main>`));

const used = new Set(families.flatMap(f => f.items.flatMap(i => [...i.html.matchAll(/class="([^"]*)"/g)].flatMap(c => c[1].split(/\s+/)))));
const aiChars = (await readFile(path.join(root, 'AI.md'), 'utf8')).length;
console.log(`${families.length} aile, ${ids.size} varyant; AI.md ${aiChars} karakter; sınıf kapsamı ${[...known].filter(k => used.has(k)).length}/${known.size}`);
