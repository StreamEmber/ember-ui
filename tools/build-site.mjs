// Sunum sitesini statik HTML olarak üretir: _site/
//   index.html                 genel bakış (temalar, sunum sayfaları, bileşen aileleri)
//   pages/<ad>.html            pages/ kaynakları + kabuk (sol menü, üst çubuk, sağ görünüm paneli, sayfa sonu)
//   components/index.html      tüm bileşen aileleri
//   components/<aile>.html     catalog/<aile>.html varyantları: önizleme + HTML parçası + AI kimliği
// Menü, içindekiler, önceki/sonraki ve ana sayfa derlemede yazılır; demo/demo.js yalnız davranış ekler.
// Kullanım: npm run site (jsDelivr'deki kit) · npm run dev (yerel dist/)
import { readdir, readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { root, version, CDN, families, variantCount } from './catalog.mjs';
import { PAGES, FAMILY_ICON, ACCENTS, SCENES, REPO } from '../demo/site.mjs';

const LOCAL = process.argv.includes('--local');
const KIT = CDN + 'dist/';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const I = n => `<svg class="mh-i" aria-hidden="true"><use href="#mi-${n}"></use></svg>`;
const slug = s => s.toLocaleLowerCase('tr').replace(/[^a-z0-9çğıöşü]+/g, '-').replace(/^-|-$/g, '');
const kit = rel => (LOCAL ? rel + 'dist/' : KIT);
const sceneUrl = (rel, id) => (id === 'none' ? 'none' : `url('${rel}demo/scenes/${id}.svg')`);

// ---- çıktı klasörü
const site = path.join(root, '_site');
await rm(site, { recursive: true, force: true });
await mkdir(path.join(site, 'demo'), { recursive: true });
await cp(path.join(root, 'dist'), path.join(site, 'dist'), { recursive: true });
for (const f of ['demo.css', 'demo.js', 'scenes']) await cp(path.join(root, 'demo', f), path.join(site, 'demo', f), { recursive: true });
await writeFile(path.join(site, '.nojekyll'), '');

// ---- site haritası
const COMPONENTS = families.map(f => ({ href: `components/${f.id}.html`, label: f.title, icon: FAMILY_ICON[f.id] || 'layers', count: f.items.length, desc: f.desc, id: f.id }));
const FLAT = [{ href: 'index.html', label: 'Genel bakış', sec: 'MHud' }];
for (const g of PAGES) for (const it of g.items) FLAT.push({ ...it, sec: 'Sunumlar', group: g.group });
FLAT.push({ href: 'components/index.html', label: 'Tüm bileşenler', sec: 'Bileşenler' });
for (const c of COMPONENTS) FLAT.push({ ...c, sec: 'Bileşenler' });

const listed = new Set(PAGES.flatMap(g => g.items.map(i => i.href)));
const sources = (await readdir(path.join(root, 'pages'))).filter(f => f.endsWith('.html')).sort();
for (const f of sources) if (!listed.has('pages/' + f)) throw new Error(`pages/${f}: demo/site.mjs PAGES listesinde yok`);
for (const h of listed) if (!existsSync(path.join(root, h))) throw new Error(`demo/site.mjs: ${h} dosyası yok`);

// ---- kabuk parçaları
const navLink = (it, cur, rel, extra = '') =>
  `<a href="${rel}${it.href}"${it.href === cur ? ' class="is-active" aria-current="page"' : ''} data-q="${esc((it.label + ' ' + (it.desc || '')).toLocaleLowerCase('tr'))}">${I(it.icon)}<span>${esc(it.label)}</span>${extra}</a>`;
const section = (id, icon, title, count, body) =>
  `<section class="demo-sec" data-sec="${id}"><button class="demo-sec__head" type="button" aria-expanded="true"><span class="demo-sec__icon">${I(icon)}</span>${title}<span class="demo-sec__count">${count}</span><span class="demo-sec__chev">${I('chev-d')}</span></button><div class="demo-sec__body"><div class="demo-sec__inner">${body}</div></div></section>`;

function side(cur, rel) {
  const shows = PAGES.map(g => `<div class="demo-group"><div class="demo-group__label">${g.group}</div><nav class="demo-nav">${g.items.map(it => navLink(it, cur, rel)).join('')}</nav></div>`).join('');
  const comps = `<nav class="demo-nav">${navLink({ href: 'components/index.html', label: 'Tüm bileşenler', icon: 'grid' }, cur, rel, `<small>${variantCount}</small>`)}${COMPONENTS.map(c => navLink(c, cur, rel, `<small>${c.count}</small>`)).join('')}</nav>`;
  return `<aside class="demo-side">
<a class="demo-brand" href="${rel}index.html"><span class="demo-brand__mark">M</span><span class="demo-brand__text"><span class="demo-brand__name">MHud</span><span class="demo-brand__sub">HUD &amp; UI kiti</span></span><span class="demo-brand__ver">v${version}</span></a>
<label class="demo-search">${I('search')}<input type="search" placeholder="Sayfa veya bileşen ara" aria-label="Ara"><kbd>/</kbd></label>
<nav class="demo-nav">${navLink({ href: 'index.html', label: 'Genel bakış', icon: 'grid' }, cur, rel)}</nav>
${section('shows', 'focus', 'Sunumlar', listed.size, shows)}
${section('comps', 'layers', 'Bileşenler', COMPONENTS.length, comps)}
<div class="demo-side__foot"><a href="${CDN}AI.md" target="_blank" rel="noopener">${I('robot')}AI.md</a><a href="${REPO}" target="_blank" rel="noopener">${I('share')}GitHub</a></div>
</aside>`;
}

function top(cur, rel) {
  const i = FLAT.findIndex(x => x.href === cur), it = FLAT[i], prev = FLAT[i - 1], next = FLAT[i + 1];
  const crumbs = cur === 'index.html' ? '<b>Genel bakış</b>' : `${it.sec}${it.group ? ` <i>/</i> ${it.group}` : ''} <i>/</i> <b>${esc(it.label)}</b>`;
  const arrow = (x, icon, word) => `<a class="demo-iconbtn" title="${word}${x ? ': ' + esc(x.label) : ''}"${x ? ` href="${rel}${x.href}"` : ' aria-disabled="true"'}>${I(icon)}</a>`;
  return `<header class="demo-top"><button class="demo-iconbtn demo-top__menu" data-demo-toggle="side" title="Menü">${I('menu')}</button><div class="demo-crumbs">${crumbs}</div><span class="demo-top__spacer"></span>${arrow(prev, 'chev-l', 'Önceki')}${arrow(next, 'chev-r', 'Sonraki')}<button class="demo-iconbtn" data-demo-aside title="Görünüm paneli">${I('sliders')}</button></header>`;
}

function pager(cur, rel) {
  const i = FLAT.findIndex(x => x.href === cur), prev = FLAT[i - 1], next = FLAT[i + 1];
  return `<nav class="demo-pager">${prev ? `<a href="${rel}${prev.href}"><small>${I('arrow-left')}Önceki · ${prev.sec}</small><b>${esc(prev.label)}</b></a>` : ''}${next ? `<a class="is-next" href="${rel}${next.href}"><small>${next.sec} · Sonraki${I('arrow-right')}</small><b>${esc(next.label)}</b></a>` : ''}</nav>`;
}

function aside(rel, toc) {
  return `<aside class="demo-aside">
<div class="demo-aside__head"><b>Görünüm</b><button class="demo-iconbtn" data-demo-close title="Kapat">${I('x')}</button></div>
<div class="demo-field"><div class="demo-field__label">Vurgu rengi</div><div class="demo-accents">${ACCENTS.map(a => `<button class="demo-accent${a.c ? '' : ' demo-accent--none'}" data-accent="${a.id}" title="${a.id || 'Varsayılan (amber)'}"${a.c ? ` style="background:${a.c}"` : ''}></button>`).join('')}</div></div>
<div class="demo-field"><div class="demo-field__label">Sahne <em id="demo-scene-now"></em></div><div class="demo-scenes">${Object.entries(SCENES).map(([id, label]) => `<button class="demo-scene-btn" data-scene="${id}" title="${label}" style="${id === 'none' ? 'background:#1a1d24' : `background-image:${sceneUrl(rel, id)}`}"><span>${label}</span></button>`).join('')}</div></div>
<div class="demo-field"><div class="demo-field__label">Seçenekler</div>
<div class="demo-opt">Izgara<div class="demo-seg">${['auto', '1', '2', '3'].map(c => `<button data-demo-cols-btn="${c}">${c === 'auto' ? 'Oto' : c}</button>`).join('')}</div></div>
<div class="demo-opt">Kodları açık göster<button class="demo-switch" data-demo-opt="code" aria-label="Kodları göster"></button></div>
<div class="demo-aside__actions"><button class="demo-btn" data-demo-do="shuffle">${I('refresh')}Değerleri karıştır</button><button class="demo-btn" data-demo-do="link">${I('share')}<span>Bağlantı</span></button><button class="demo-btn" data-demo-do="reset">${I('repeat')}Sıfırla</button></div>
</div>
${toc.length > 1 ? `<nav class="demo-toc"><div class="demo-field__label">Bu sayfada</div>${toc.map(t => `<a href="#${t.id}">${esc(t.label)}</a>`).join('')}</nav>` : ''}
</aside>
<div class="demo-veil"></div>`;
}

const chrome = (cur, rel, toc) => ({ before: side(cur, rel) + '\n' + top(cur, rel), after: pager(cur, rel) + '\n' + aside(rel, toc) });

// Tam belge (genel bakış ve bileşen sayfaları)
const doc = (cur, rel, title, main, toc) => {
  const c = chrome(cur, rel, toc);
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — MHud</title>
<link rel="stylesheet" href="${kit(rel)}mhud.min.css">
<link rel="stylesheet" href="${rel}demo/demo.css">
</head>
<body class="mh demo">
${c.before}
${main}
${c.after}
<div class="mh-screen" style="position:fixed;z-index:70"></div>
<script src="${kit(rel)}mhud.min.js"></script>
<script src="${rel}demo/demo.js"></script>
</body>
</html>
`;
};

// ---- sunum sayfaları: kaynak + kabuk
const descs = {};
await mkdir(path.join(site, 'pages'), { recursive: true });
for (const f of sources) {
  const href = 'pages/' + f;
  let src = await readFile(path.join(root, href), 'utf8');
  if (!src.includes(KIT + 'mhud.min.css') || !src.includes(KIT + 'mhud.min.js')) throw new Error(`${href}: kit ${KIT} adresinden yüklenmiyor (node tools/set-version.mjs)`);
  const d = src.match(/<header class="demo-head">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  descs[href] = d ? d[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  // içindekiler: bölüm başlıkları, yoksa kimlikli örnek kartları; canlı sahne varsa en üstte
  const toc = [];
  src = src.replace(/<div class="demo-h2"([^>]*)><h2>([^<]*)<\/h2>/g, (m, attrs, text) => {
    const id = (attrs.match(/id="([^"]+)"/) || [])[1] || slug(text);
    toc.push({ id, label: text });
    return attrs.includes('id="') ? m : `<div class="demo-h2" id="${id}"${attrs}><h2>${text}</h2>`;
  });
  if (!toc.length) for (const m of src.matchAll(/<div class="demo-spec[^"]*" id="([^"]+)">[\s\S]*?<div class="demo-spec__meta"><b>([^<]+)/g)) toc.push({ id: m[1], label: m[2].trim() });
  if (toc.length && src.includes('<div class="demo-stage-wrap">')) {
    src = src.replace('<div class="demo-stage-wrap">', '<div class="demo-stage-wrap" id="sahne">');
    toc.unshift({ id: 'sahne', label: 'Canlı sahne' });
  }
  const c = chrome(href, '../', toc);
  if (!src.includes('<body class="mh">') || !src.includes('</main>')) throw new Error(`${href}: <body class="mh"> ve </main> bekleniyor`);
  src = src.replace('<body class="mh">', `<body class="mh demo">\n${c.before}`).replace('</main>', `</main>\n${c.after}`);
  if (LOCAL) src = src.replaceAll(KIT, '../dist/');
  await writeFile(path.join(site, href), src);
}

// ---- bileşen aileleri
await mkdir(path.join(site, 'components'), { recursive: true });
const box = i => {
  if (!i.box) return i.html;
  const [w, h, k, iw, ih] = i.box.split(',').map(Number);
  return `<div style="position:relative;width:${w}px;height:${h}px;overflow:hidden"><div style="position:absolute;left:0;top:0;width:${iw}px;height:${ih}px;transform:scale(${k});transform-origin:0 0">${i.html}</div></div>`;
};
const card = i => `<article class="demo-spec${i.wide ? ' demo-spec--full' : ''}" id="${i.id}">
<div class="demo-spec__view demo-spec__view--scroll demo-cat" style="--h:${i.wide ? 240 : 190}px;--dim:.35">${i.run ? `<button class="demo-btn demo-btn--accent" data-demo-run>${I('play')}Çalıştır</button>` : box(i)}</div>
<div class="demo-spec__meta"><div class="demo-spec__top"><b>${esc(i.title)}</b><code class="demo-spec__id">${i.id}</code></div><span>${esc(i.use)}</span>${i.js ? `<span>JS: <code>${esc(i.js)}</code></span>` : ''}
<details class="demo-src"><summary>${i.run ? 'JS kodu' : 'HTML parçası'}</summary><div class="demo-src__box"><pre class="demo-code">${esc(i.html)}</pre><button class="demo-btn demo-btn--sm" data-demo-copy><span>Kopyala</span></button></div></details></div>
</article>`;
const familyCards = rel => `<div class="demo-cards">${COMPONENTS.map(f => `<a class="demo-card" href="${rel}${f.href}"><div class="demo-card__top"><span class="demo-card__icon demo-card__icon--alt">${I(f.icon)}</span><b>${esc(f.label)}</b></div><span>${esc(f.desc)}</span><small>${f.count} varyant · ai/${f.id}.md</small></a>`).join('')}</div>`;

for (const f of families) {
  const main = `<main class="demo-main">
<header class="demo-head"><span class="demo-head__kicker">Bileşenler</span><h1>${f.title}</h1><p>${esc(f.desc)}</p>
<div class="demo-chips"><span class="demo-chip"><b>${f.items.length}</b> varyant</span><a class="demo-chip" href="${CDN}ai/${f.id}.md" target="_blank" rel="noopener">${I('robot')}ai/${f.id}.md</a></div></header>
<div class="demo-specs" style="--cols:2">
${f.items.map(card).join('\n')}
</div>
</main>`;
  await writeFile(path.join(site, 'components', `${f.id}.html`), doc(`components/${f.id}.html`, '../', f.title, main, f.items.map(i => ({ id: i.id, label: i.title }))));
}
await writeFile(path.join(site, 'components', 'index.html'), doc('components/index.html', '../', 'Tüm bileşenler', `<main class="demo-main">
<header class="demo-head"><span class="demo-head__kicker">Bileşenler</span><h1>Tüm bileşenler</h1><p>${families.length} aile, ${variantCount} varyant. Her aile sayfasında varyantlar canlı önizleme, HTML parçası ve AI kimliğiyle (<code>aile.varyant</code>) tek tek gösterilir. Bileşenlerin bir arada kullanımı için soldaki sunum sayfalarına bak.</p>
<div class="demo-chips"><a class="demo-chip" href="${CDN}AI.md" target="_blank" rel="noopener">${I('robot')}AI.md</a></div></header>
${familyCards('../')}
${families.map(f => `<div class="demo-h2" id="${f.id}"><h2>${f.title}</h2><p>${f.items.length} varyant</p></div>
<div class="demo-chips">${f.items.map(i => `<a class="demo-chip" href="${f.id}.html#${i.id}">${esc(i.title)}</a>`).join('')}</div>`).join('\n')}
</main>`, families.map(f => ({ id: f.id, label: f.title }))));

// ---- genel bakış (site kökü)
const first = PAGES[0].items[0];
const home = `<main class="demo-main">
<section class="demo-home__hero">
<span class="demo-head__kicker">Stream Ember · HUD &amp; UI kiti · v${version}</span>
<h1>Oyun modları ve canlı yayın katmanları için<br>tek görünümlü arayüz kiti</h1>
<p>Bağımlılıksız HTML/CSS + küçük bir JS. StreamEmber overlay'i (GTA V, RDR2), OBS kaynağı ve HTML5 oyunlarında aynı bileşenler; tek tema, on vurgu rengi, veriyle kurulan menü (<code>MH.Menu</code>). Bu site iki katmandan oluşur: bileşenlerin gerçek sahnede bir arada kullanıldığı <b>sunum sayfaları</b> ve her varyantın kodu ve AI kimliğiyle tek tek gösterildiği <b>bileşen aileleri</b>.</p>
<div class="demo-home__cta"><a class="demo-btn demo-btn--accent" href="${first.href}">${I('play')}Sunumlara başla</a><a class="demo-btn" href="components/index.html">${I('layers')}Bileşenlere göz at</a><a class="demo-btn" href="${CDN}AI.md" target="_blank" rel="noopener">${I('robot')}AI.md</a><a class="demo-btn" href="${REPO}" target="_blank" rel="noopener">${I('share')}GitHub</a></div>
<div class="demo-stats"><div><b>${listed.size}</b><span>sunum sayfası</span></div><div><b>${families.length}</b><span>bileşen ailesi</span></div><div><b>${variantCount}</b><span>varyant</span></div><div><b>${ACCENTS.length - 1}</b><span>vurgu rengi</span></div></div>
</section>
<div class="demo-h2" id="sunumlar"><span class="demo-sys"><h2>Sunum sayfaları</h2><span class="demo-sys__tag">Sahne</span></span><p>Bileşenler 1920×1080 tuvalde, gerçek HUD düzeninde ve etkileşimli olarak.</p></div>
${PAGES.map(g => `<div class="demo-home__grouplabel">${g.group}</div><div class="demo-cards">${g.items.map(it => `<a class="demo-card" href="${it.href}"><div class="demo-card__top"><span class="demo-card__icon">${I(it.icon)}</span><b>${esc(it.label)}</b></div>${descs[it.href] ? `<span>${esc(descs[it.href])}</span>` : ''}<small>${it.href}</small></a>`).join('')}</div>`).join('\n')}
<div class="demo-h2" id="bilesenler"><span class="demo-sys"><h2>Bileşen aileleri</h2><span class="demo-sys__tag demo-sys__tag--alt">Katalog</span></span><p>Her varyant ayrı kartta: canlı önizleme, HTML parçası, AI kimliği (<code>aile.varyant</code>).</p></div>
${familyCards('')}
</main>`;
await writeFile(path.join(site, 'index.html'), doc('index.html', '', 'Genel bakış', home, [{ id: 'sunumlar', label: 'Sunum sayfaları' }, { id: 'bilesenler', label: 'Bileşen aileleri' }]));

console.log(`Site: _site/ — ${sources.length} sunum, ${families.length} aile sayfası, genel bakış${LOCAL ? ' (yerel dist/)' : ''}`);
