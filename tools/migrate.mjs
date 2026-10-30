#!/usr/bin/env node
// MHud 3.x → Ember UI 4 adlandırma göçü. Bir klasördeki .html/.css/.js/.mjs/.md/.cs/.json dosyalarında
// sınıf, değişken, öznitelik, global ve CDN adlarını değiştirir. Yalnız ad değiştirir; 3.0'da kaldırılan
// API'leri (tema, klasik menü…) düzeltmez — onlar için ardından lint.mjs çalıştır.
//
//   curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.0.0/tools/migrate.mjs
//   node migrate.mjs <klasör> [--dry]
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const VERSION = '4.0.0';
// Sıra önemli: önce uzun / özel kalıplar.
export const RULES = [
  [/cdn\.jsdelivr\.net\/gh\/StreamEmber\/mhud@v?[\w.]+\//g, `cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v${VERSION}/`],
  [/github\.com\/StreamEmber\/mhud\b/g, 'github.com/StreamEmber/ember-ui'],
  [/streamember\.github\.io\/mhud\b/g, 'streamember.github.io/ember-ui'],
  [/\bmhud((?:-[a-z]+)*)(\.min)?\.(css|js)\b/g, 'ember-ui$1$2.$3'],     // dosya adları
  [/--mh-/g, '--eui-'],
  [/\bdata-mh\b/g, 'data-eui'],
  [/(?<![\w-])mh-(?=[a-z0-9*[`'"])/g, 'eui-'],                             // sınıf öneki
  [/(?<![\w.-])\.mh(?![\w-])/g, '.eui'],                                // kök sınıf (CSS seçici)
  [/(class(?:Name)?\s*=\s*["'`])((?:[^"'`]*\s)?)mh(?=[\s"'`])/g, '$1$2eui'], // kök sınıf (HTML)
  [/(['"])mh(['" ])/g, '$1eui$2'],                                    // kök sınıf (JS dizgisi)
  [/\bMH_(ICONS|WEAPONS)\b/g, 'EUI_$1'],
  [/'MH (Inter|Barlow Condensed|Barlow Semi|Mono)'/g, "'EUI $1'"],
  [/\bMH(?=[.\s,;)\]=(\[\\])/g, 'EUI'],                                    // JS global
  [/\bMHud\b/g, 'Ember UI'],
  [/\bmhud\b/g, 'ember-ui']
];
export const migrate = src => RULES.reduce((s, [re, to]) => s.replace(re, to), src);

// Kendini sınama: `node migrate.mjs --test`
if (process.argv.includes('--test')) {
  const cases = [
    ['<body class="mh" data-mh-accent="mint">', '<body class="eui" data-eui-accent="mint">'],
    ['<div class="mh-panel mh-t-danger">', '<div class="eui-panel eui-t-danger">'],
    ['.mh .mh-bar { color: rgb(var(--mh-accent-rgb)); }', '.eui .eui-bar { color: rgb(var(--eui-accent-rgb)); }'],
    ['MH.bar(el, 5); MH.post("x"); var m = MH;', 'EUI.bar(el, 5); EUI.post("x"); var m = EUI;'],
    ['https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/dist/mhud.min.css', `https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v${VERSION}/dist/ember-ui.min.css`],
    ['<html class="mh-overlay">', '<html class="eui-overlay">'],
    ['el("div", "mh mh-screen")', 'el("div", "eui eui-screen")'],
    ['[data-mh="toasts"]', '[data-eui="toasts"]'],
    ['MHud kiti, mhud-menu.js', 'Ember UI kiti, ember-ui-menu.js'],
    ['`mh-*` ve /\\.mh-[a-z]+/ ile MH[fn] ve MH\\.theme', '`eui-*` ve /\\.eui-[a-z]+/ ile EUI[fn] ve EUI\\.theme'],
    ['ohm-ring rhythm-x amh-foo', 'ohm-ring rhythm-x amh-foo']
  ];
  let bad = 0;
  for (const [a, b] of cases) { const r = migrate(a); if (r !== b) { bad++; console.log(`HATA\n  girdi : ${a}\n  çıktı : ${r}\n  beklen: ${b}`); } }
  console.log(bad ? `${bad} hata` : `migrate: ${cases.length} örnek doğru`);
  process.exit(bad ? 1 : 0);
}

const dir = process.argv.slice(2).find(a => !a.startsWith('--'));
if (dir) {
  const dry = process.argv.includes('--dry');
  const files = [];
  async function walk(d) {
    for (const e of await readdir(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!/^(node_modules|\.git|_site|bin|obj)$/.test(e.name)) await walk(p); }
      else if (/\.(html|css|js|mjs|cjs|md|cs|json|yml|lua)$/.test(e.name) && !(/^(mhud|ember-ui)(\.min)?\.(css|js)$/.test(e.name) && /(^|[\/])dist$/.test(d))) files.push(p);
    }
  }
  await walk(dir);
  let changed = 0;
  for (const f of files) {
    const src = await readFile(f, 'utf8'), out = migrate(src);
    if (out === src) continue;
    changed++; console.log(`${dry ? '(deneme) ' : ''}${path.relative(dir, f)}`);
    if (!dry) await writeFile(f, out);
  }
  console.log(`\n${changed} dosya ${dry ? 'değişecek' : 'değişti'}. Kopyalanmış mhud dist dosyaları varsa sil ve CDN'den yükle; sonra lint.mjs çalıştır.`);
}
