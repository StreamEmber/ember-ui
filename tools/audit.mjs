// Görünürlük denetimi: yapay zekânın göremeyeceği bir şey kalmasın.
//  1) Her eui-* sınıfı ya bir katalog varyantında, ya ai/ rehberinde (catalog/<aile>.md), ya da kit JS'inin ürettiği HTML'de geçmeli.
//  2) EUI üzerindeki her public ad (EUI.x = …) AI.md'de geçmeli. İç yardımcılar EUI._ önekiyle başlar ve sayılmaz.
// Kullanım: node tools/audit.mjs   (eksik varsa listeler ve 1 ile çıkar; CI çalıştırır)
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { root, known, families } from './catalog.mjs';

const read = f => readFile(path.join(root, f), 'utf8');
const js = (await Promise.all((await readdir(path.join(root, 'kit/js'))).filter(f => f.endsWith('.js') && f !== 'ember-ui-icons.js').map(f => read('kit/js/' + f)))).join('\n');
const guides = (await Promise.all((await readdir(path.join(root, 'catalog'))).filter(f => f.endsWith('.md')).map(f => read('catalog/' + f)))).join('\n');
const catalogHtml = families.flatMap(f => [f.desc, ...f.items.flatMap(i => [i.html, i.use, i.js])]).join('\n');
const seen = new Set((catalogHtml + '\n' + guides + '\n' + js).match(/eui-[a-z0-9_-]+/g));
// Durum/biçim ekleri ana sınıfla birlikte görünür: eui-x--y ve eui-x__y için kök eui-x görünüyorsa yeter mi? Hayır: her biri tek tek görünmeli.
const hidden = [...known].filter(c => !seen.has(c)).sort();

const ai = await read('AI.md');
const api = [...new Set([...js.matchAll(/\bEUI\.([A-Za-z][A-Za-z0-9]*)\s*=(?!=)/g)].map(m => m[1]))].sort();
const undocumented = api.filter(n => !new RegExp(`EUI\\.${n}\\b`).test(ai));

if (hidden.length) console.log(`Görünmeyen sınıf (${hidden.length}) — kataloğa ekle, kullanılmıyorsa sil:\n  ${hidden.join(' ')}`);
if (undocumented.length) console.log(`AI.md'de olmayan API (${undocumented.length}) — API dizinine ekle ya da EUI._ yap:\n  ${undocumented.map(n => 'EUI.' + n).join(' ')}`);
console.log(`denetim: ${known.size - hidden.length}/${known.size} sınıf görünür, ${api.length - undocumented.length}/${api.length} API belgeli`);
process.exit(hidden.length || undocumented.length ? 1 : 0);
