#!/usr/bin/env node
// MHud kullanım denetleyicisi — bir mod / oyun sayfasının MHud kurallarına uyup uymadığını söyler.
// Tek dosya, bağımlılıksız (Node 18+). Kit sınıf listesini sayfanın yüklediği MHud sürümünden (jsDelivr) okur.
//
//   curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/tools/lint.mjs
//   node lint.mjs <web klasörü> [--css yol/mhud.css] [--json]
//
// Hata (çıkış kodu 1): sabit olmayan sürüm, tema kullanımı, kitte olmayan mh-* sınıfı, mh-* sınıfını ezen CSS,
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
    else if (/\.(html|css|js)$/.test(e.name) && !/^mhud(\.min)?\.(css|js)$/.test(e.name)) files.push(p);
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

// --- MHud sürümü ve kit sınıfları
let version = null;
for (const [f, t] of Object.entries(src)) {
  for (const m of t.matchAll(/mhud@([^/"'\s]+)\/dist\/mhud(\.min)?\.(css|js)/g)) {
    if (!/^v\d+\.\d+\.\d+$/.test(m[1])) add('error', f, t, m.index, `MHud sürümü sabit değil (@${m[1]}): tam sürüm yaz, ör. @v3.0.0`);
    else version = version || m[1];
  }
}
let kitCss = '';
if (cssArg) kitCss = await readFile(cssArg, 'utf8');
else if (version) {
  const url = `https://cdn.jsdelivr.net/gh/StreamEmber/mhud@${version}/dist/mhud.css`;
  try { const r = await fetch(url); if (!r.ok) throw new Error(r.status); kitCss = await r.text(); }
  catch (e) { console.error(`kit CSS okunamadı (${url}): ${e.message} — --css ile yerel dosya ver`); process.exit(2); }
} else { console.error('sayfada mhud@vX.Y.Z/dist/mhud(.min).css|js bağlantısı bulunamadı — --css ile kit CSS dosyasını ver'); process.exit(2); }
const known = new Set((kitCss.match(/\.mh-[a-z0-9_-]+/g) || []).map(c => c.slice(1)));
if (version && !/^v[3-9]|^v\d{2,}/.test(version)) add('error', dir, '', null, `MHud ${version} eski: 3.x kullan`);

// --- kurallar
const COPY = /^(x-)?[a-z0-9]+-(menu|menu-layer|menu-scrim|layer|scrim|nav|nav__item|row|list|modal|toast|toasts|dialog|popup|overlay-menu|tabs?)(__[a-z]+)?$/;
const HINT = { menu: 'MH.Menu', layer: 'MH.Menu (katman kendisinde)', scrim: 'MH.Menu (perde kendisinde)', nav: 'MH.Menu bölümleri', row: "MH.Menu view: 'list'", list: "MH.Menu view: 'list'", modal: 'MH.confirm / MH.modal', dialog: 'MH.confirm / MH.modal', popup: 'MH.modal', toast: 'MH.toast', toasts: 'MH.toast', tab: 'MH.Menu bölümleri', tabs: 'MH.Menu bölümleri' };
const BW = /^rgba?\(\s*(0\s*,?\s*0\s*,?\s*0|255\s*,?\s*255\s*,?\s*255)\s*(\/|,)/; // siyah/beyaz gölge ve perde serbest

for (const [f, t] of Object.entries(src)) {
  const ext = path.extname(f);
  // Tema 3.0'da yok
  for (const m of t.matchAll(/data-mh-theme|MH\.theme\s*\(/g)) add('error', f, t, m.index, 'MHud 3.0\'da tema yok: data-mh-theme / MH.theme kaldır (renk için data-mh-accent / MH.accent)');
  for (const m of t.matchAll(/MH\.(listNav|escClose|isNui|resource|poster|posterHTML|telegram|headline|sign|stamp)\b/g)) add('error', f, t, m.index, `MH.${m[1]} 3.0'da kaldırıldı`);

  // Kullanılan sınıflar (HTML class="", JS dizgileri, CSS seçicileri)
  const classAttrs = [...t.matchAll(/class(Name)?\s*=\s*["'`]([^"'`]*)["'`]/g)];
  const jsStrings = ext === '.js' || ext === '.html' ? [...t.matchAll(/classList\.(?:add|remove|toggle|contains)\(\s*['"]([^'"]+)['"]/g)] : [];
  for (const m of [...classAttrs.map(m => ({ i: m.index, v: m[2] })), ...jsStrings.map(m => ({ i: m.index, v: m[1] }))]) {
    for (const c of m.v.split(/\s+/)) {
      if (!c || /[${}+]/.test(c)) continue;
      if (c.startsWith('mh-')) { if (!known.has(c) && !/^mh-t-/.test(c)) add('error', f, t, m.i, `kitte olmayan sınıf: ${c} (katalogdaki varyantı kullan ya da eksik olduğunu bildir)`); }
      else if (!/^(x-|is-|has-)/.test(c) && c !== 'mh') add('error', f, t, m.i, `özel sınıf x- öneki almalı: ${c}`);
    }
  }
  if (ext === '.css' || ext === '.html') {
    const css = ext === '.css' ? t : (t.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n');
    const base = ext === '.css' ? 0 : t.indexOf('<style');
    for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim(), body = m[2], at = base + m.index;
      if (!sel || sel.startsWith('@') || /^(from|to|\d+%)/.test(sel)) continue;
      // mh-* ezme: seçicinin SON parçası bir mh- sınıfını hedefliyorsa
      for (const part of sel.split(',')) {
        const last = part.trim().split(/[\s>+~]+/).pop() || '';
        if (/\.mh-[a-z0-9_-]+/.test(last) && !/\.x-/.test(last)) add('error', f, t, at, `kit sınıfını ezme: "${part.trim()}" — görünüm farklı olacaksa x- önekli kendi sınıfını ekle`);
        for (const c of part.match(/\.[a-z][a-z0-9_-]*/g) || []) {
          const n = c.slice(1);
          if (n.startsWith('mh-') || n.startsWith('is-') || n.startsWith('has-')) continue;
          if (!n.startsWith('x-')) add('error', f, t, at, `özel sınıf x- öneki almalı: .${n}`);
          if (COPY.test(n)) add('error', f, t, at, `.${n} kitin hazır yapısını kopyalıyor — ${HINT[(n.match(/-(menu|layer|scrim|nav|row|list|modal|dialog|popup|toasts?|tabs?)/) || [])[1]] || 'kitteki karşılığını'} kullan`);
        }
      }
      for (const c of body.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)/g)) {
        if (/var\(--mh-/.test(c[0]) || BW.test(c[0])) continue;
        add('error', f, t, at, `sabit renk ${c[0]} — ton sınıfı (mh-t-*) ya da rgb(var(--mh-…-rgb) / a) kullan`);
      }
      if (/!important/.test(body)) add('warn', f, t, at, `!important: "${sel}"`);
    }
  }
  if (ext === '.html') for (const m of t.matchAll(/style="([^"]*)"/g)) {
    if (/(^|;)\s*(color|background(-color)?|border-color)\s*:\s*(#|rgb|hsl)(?![^;]*var\(--mh-)/.test(m[1])) add('warn', f, t, m.index, `satır içi renk: ${m[1].slice(0, 60)}`);
  }
}

// aynı mesajı tekrarlama
const seen = new Set(), list = out.filter(o => { const k = o.file + o.line + o.msg; if (seen.has(k)) return false; seen.add(k); return true; });
const errors = list.filter(o => o.level === 'error').length, warns = list.length - errors;
if (asJson) console.log(JSON.stringify({ version, errors, warns, items: list }, null, 2));
else {
  for (const o of list) console.log(`${o.level === 'error' ? 'HATA ' : 'uyarı'} ${o.file}${o.line ? ':' + o.line : ''}  ${o.msg}`);
  console.log(`\nMHud lint (${version || 'yerel css'}): ${files.length} dosya, ${errors} hata, ${warns} uyarı`);
}
process.exit(errors ? 1 : 0);
