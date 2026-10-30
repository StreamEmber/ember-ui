#!/usr/bin/env node
// Ember UI kullanım denetleyicisi — bir mod / oyun sayfasının Ember UI kurallarına uyup uymadığını söyler.
// Tek dosya, bağımlılıksız (Node 18+). Kit sınıf listesini sayfanın yüklediği Ember UI sürümünden (jsDelivr) okur.
//
//   curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/tools/lint.mjs
//   node lint.mjs <web klasörü> [--css yol/ember-ui.css] [--json]
//
// Hata (çıkış kodu 1): sabit olmayan sürüm, tema kullanımı, kitte olmayan eui-* sınıfı, eui-* sınıfını ezen CSS,
//   x- öneki dışında özel sınıf, kitin hazır yapısını kopyalayan özel sınıf (menü, satır, katman, modal…), sabit renk.
// Uyarı: !important, satır içi renk.
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const dir = args.find(a => !a.startsWith('--')) || '.';
const cssArg = args.includes('--css') ? args[args.indexOf('--css') + 1] : null;
const asJson = args.includes('--json');

const files = [];
async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!/^(node_modules|\.git|dist|img|images|fonts)$/.test(e.name)) await walk(p); }
    else if (/\.(html|css|js)$/.test(e.name) && !/^ember-ui(\.min)?\.(css|js)$/.test(e.name)) files.push(p);
  }
}
if (!(await stat(dir).catch(() => null))) { console.error(`klasör yok: ${dir}`); process.exit(2); }
await walk(dir);
const src = Object.fromEntries(await Promise.all(files.map(async f => [f, await readFile(f, 'utf8')])));

const out = [];
const add = (level, file, text, idx, msg) => {
  const line = idx == null ? 0 : text.slice(0, idx).split('\n').length;
  out.push({ level, file: path.relative(dir, file) || file, line, msg });
};

// --- Ember UI sürümü ve kit sınıfları
let version = null;
for (const [f, t] of Object.entries(src)) {
  for (const m of t.matchAll(/ember-ui@([^/"'\s]+)\/dist\/ember-ui(\.min)?\.(css|js)/g)) {
    if (!/^v\d+\.\d+\.\d+$/.test(m[1])) add('error', f, t, m.index, `Ember UI sürümü sabit değil (@${m[1]}): tam sürüm yaz, ör. @v4.0.0`);
    else version = version || m[1];
  }
}
let kitCss = '';
if (cssArg) kitCss = await readFile(cssArg, 'utf8');
else if (version) {
  const url = `https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@${version}/dist/ember-ui.css`;
  try { const r = await fetch(url); if (!r.ok) throw new Error(r.status); kitCss = await r.text(); }
  catch (e) { console.error(`kit CSS okunamadı (${url}): ${e.message} — --css ile yerel dosya ver`); process.exit(2); }
} else if (Object.values(src).some(t => /StreamEmber\/mhud@/.test(t))) { console.error('sayfa eski MHud kitini yüklüyor: önce migrate.mjs çalıştır (mhud → ember-ui), sonra lint'); process.exit(1);
} else { console.error('sayfada ember-ui@vX.Y.Z/dist/ember-ui(.min).css|js bağlantısı bulunamadı — --css ile kit CSS dosyasını ver'); process.exit(2); }
const known = new Set((kitCss.match(/\.eui-[a-z0-9_-]+/g) || []).map(c => c.slice(1)));
if (version && !/^v([4-9]|\d{2,})\./.test(version)) add('error', dir, '', null, `Ember UI ${version} eski: 4.x kullan`);

// --- kurallar
const COPY = /^(x-)?[a-z0-9]+-(menu|menu-layer|menu-scrim|layer|scrim|nav|nav__item|row|list|modal|toast|toasts|dialog|popup|overlay-menu|tabs?)(__[a-z]+)?$/;
const HINT = { menu: 'EUI.Menu', layer: 'EUI.Menu (katman kendisinde)', scrim: 'EUI.Menu (perde kendisinde)', nav: 'EUI.Menu bölümleri', row: "EUI.Menu view: 'list'", list: "EUI.Menu view: 'list'", modal: 'EUI.confirm / EUI.modal', dialog: 'EUI.confirm / EUI.modal', popup: 'EUI.modal', toast: 'EUI.toast', toasts: 'EUI.toast', tab: 'EUI.Menu bölümleri', tabs: 'EUI.Menu bölümleri' };
const BW = /^rgba?\(\s*(0\s*,?\s*0\s*,?\s*0|255\s*,?\s*255\s*,?\s*255)\s*(\/|,)/; // siyah/beyaz gölge ve perde serbest

for (const [f, t] of Object.entries(src)) {
  const ext = path.extname(f);
  // Eski MHud adları (migrate.mjs dönüştürür)
  for (const m of t.matchAll(/mhud@v?[\w.]+\/dist|\bMH\.[A-Za-z]|(?<![\w-])mh-[a-z]|--mh-|data-mh-/g)) add('error', f, t, m.index, `eski MHud adı "${m[0]}": önce migrate.mjs çalıştır (mh- → eui-, MH → EUI, mhud → ember-ui)`);
  // Tema yok
  for (const m of t.matchAll(/data-eui-theme|EUI\.theme\s*\(/g)) add('error', f, t, m.index, 'Ember UI\'da tema yok: data-eui-theme / EUI.theme kaldır (renk için data-eui-accent / EUI.accent)');
  for (const m of t.matchAll(/EUI\.(listNav|escClose|isNui|resource|poster|posterHTML|telegram|headline|sign|stamp)\b/g)) add('error', f, t, m.index, `EUI.${m[1]} kaldırıldı (MHud 3.0)`);

  // Kullanılan sınıflar (HTML class="", JS dizgileri, CSS seçicileri)
  const classAttrs = [...t.matchAll(/class(Name)?\s*=\s*["'`]([^"'`]*)["'`]/g)];
  const jsStrings = ext === '.js' || ext === '.html' ? [...t.matchAll(/classList\.(?:add|remove|toggle|contains)\(\s*['"]([^'"]+)['"]/g)] : [];
  for (const m of [...classAttrs.map(m => ({ i: m.index, v: m[2] })), ...jsStrings.map(m => ({ i: m.index, v: m[1] }))]) {
    for (const c of m.v.split(/\s+/)) {
      if (!c || /[${}+]/.test(c)) continue;
      if (c.startsWith('eui-')) { if (!known.has(c) && !/^eui-t-/.test(c)) add('error', f, t, m.i, `kitte olmayan sınıf: ${c} (katalogdaki varyantı kullan ya da eksik olduğunu bildir)`); }
      else if (!/^(x-|is-|has-)/.test(c) && c !== 'eui') add('error', f, t, m.i, `özel sınıf x- öneki almalı: ${c}`);
    }
  }
  if (ext === '.css' || ext === '.html') {
    const css = ext === '.css' ? t : (t.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n');
    const base = ext === '.css' ? 0 : t.indexOf('<style');
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim(), body = m[2], at = base + m.index;
      if (!sel || sel.startsWith('@') || /^(from|to|\d+%)/.test(sel)) continue;
      // eui-* ezme: seçicinin SON parçası bir eui- sınıfını hedefliyorsa
      for (const part of sel.split(',')) {
        const last = part.trim().split(/[\s>+~]+/).pop() || '';
        if (/\.eui-[a-z0-9_-]+/.test(last) && !/\.x-/.test(last)) add('error', f, t, at, `kit sınıfını ezme: "${part.trim()}" — görünüm farklı olacaksa x- önekli kendi sınıfını ekle`);
        for (const c of part.match(/\.[a-z][a-z0-9_-]*/g) || []) {
          const n = c.slice(1);
          if (n.startsWith('eui-') || n.startsWith('is-') || n.startsWith('has-')) continue;
          if (!n.startsWith('x-')) add('error', f, t, at, `özel sınıf x- öneki almalı: .${n}`);
          if (COPY.test(n)) add('error', f, t, at, `.${n} kitin hazır yapısını kopyalıyor — ${HINT[(n.match(/-(menu|layer|scrim|nav|row|list|modal|dialog|popup|toasts?|tabs?)/) || [])[1]] || 'kitteki karşılığını'} kullan`);
        }
      }
      for (const c of body.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g)) {
        if (/var\(--eui-/.test(c[0]) || BW.test(c[0])) continue;
        add('error', f, t, at, `sabit renk ${c[0]} — ton sınıfı (eui-t-*) ya da rgb(var(--eui-…-rgb) / a) kullan`);
      }
      if (/!important/.test(body)) add('warn', f, t, at, `!important: "${sel}"`);
    }
  }
  if (ext === '.html') for (const m of t.matchAll(/style="([^"]*)"/g)) {
    if (/(^|;)\s*(color|background(-color)?|border-color)\s*:\s*(#|rgb|hsl)(?![^;]*var\(--eui-)/.test(m[1])) add('warn', f, t, m.index, `satır içi renk: ${m[1].slice(0, 60)}`);
  }
}

// aynı mesajı tekrarlama
const seen = new Set(), list = out.filter(o => { const k = o.file + o.line + o.msg; if (seen.has(k)) return false; seen.add(k); return true; });
const errors = list.filter(o => o.level === 'error').length, warns = list.length - errors;
if (asJson) console.log(JSON.stringify({ version, errors, warns, items: list }, null, 2));
else {
  for (const o of list) console.log(`${o.level === 'error' ? 'HATA ' : 'uyarı'} ${o.file}${o.line ? ':' + o.line : ''}  ${o.msg}`);
  console.log(`\nEmber UI lint (${version || 'yerel css'}): ${files.length} dosya, ${errors} hata, ${warns} uyarı`);
}
process.exit(errors ? 1 : 0);
