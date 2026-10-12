// catalog/ -> AI.md + ai/<aile>.md (git'e girer, jsDelivr'den okunur; CI güncelliğini denetler).
// Kullanım: npm run ai
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { root, version, CDN, families, known, variantCount } from './catalog.mjs';

await mkdir(path.join(root, 'ai'), { recursive: true });
const itemMd = it => `## ${it.id} — ${it.title}\n${it.use}\n${it.js ? `JS: \`${it.js}\`\n` : ''}\n\`\`\`${it.run ? 'js' : 'html'}\n${it.html}\n\`\`\`\n`;
for (const f of families) await writeFile(path.join(root, 'ai', `${f.id}.md`), `# ${f.title}\n${f.desc}\n\n${f.items.map(itemMd).join('\n')}`);
const intro = (await readFile(path.join(root, 'catalog', '_intro.md'), 'utf8')).replaceAll('{{version}}', version);
const index = families.map(f => `### ${f.title} → ${CDN}ai/${f.id}.md\n${f.items.map(i => `- \`${i.id}\` ${i.title}: ${i.use.split('. ')[0].replace(/\.$/, '')}`).join('\n')}\n`).join('\n');
await writeFile(path.join(root, 'AI.md'), `${intro}\n## Bileşen aileleri\n\n${index}`);

const used = new Set(families.flatMap(f => f.items.flatMap(i => [...i.html.matchAll(/class="([^"]*)"/g)].flatMap(c => c[1].split(/\s+/)))));
const aiChars = (await readFile(path.join(root, 'AI.md'), 'utf8')).length;
console.log(`AI: ${families.length} aile, ${variantCount} varyant; AI.md ${aiChars} karakter; sınıf kapsamı ${[...known].filter(k => used.has(k)).length}/${known.size}`);
