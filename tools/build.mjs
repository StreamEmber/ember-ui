// Ember UI derleme: kit/ kaynaklarından jsDelivr (gh) için tek dosyalar üretir.
//   dist/ember-ui.css        tüm CSS (içe aktarmalar birleştirilmiş, yazı tipleri dist/fonts/)
//   dist/ember-ui.min.css    küçültülmüş
//   dist/ember-ui.js         ikonlar + çekirdek + menü + sosyal menü + atlas (tek <script>)
//   dist/ember-ui.min.js     küçültülmüş
// Kullanım: npm run build
import { build, transform } from 'esbuild';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const dist = path.join(root, 'dist');
const banner = `/*! Ember UI v${pkg.version} | ${pkg.license} | ${pkg.homepage} | icons: Material Design Icons (Apache-2.0) | fonts: SIL OFL 1.1 */`;

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

async function css(entry, out) {
  for (const minify of [false, true]) {
    await build({
      entryPoints: [path.join(root, entry)],
      outfile: path.join(dist, minify ? out.replace('.css', '.min.css') : out),
      bundle: true, minify, logLevel: 'warning', charset: 'utf8',
      loader: { '.woff2': 'file', '.woff': 'file', '.svg': 'file' },
      assetNames: 'fonts/[name]',
      banner: { css: banner },
      target: ['chrome88']
    });
  }
}

async function js(files, out) {
  const parts = await Promise.all(files.map(f => readFile(path.join(root, f), 'utf8')));
  const code = parts.map((c, i) => `/* ${files[i]} */\n${c.trim()}\n`).join('\n');
  await writeFile(path.join(dist, out), `${banner}\n${code}`);
  const min = await transform(code, { minify: true, target: 'chrome88', charset: 'utf8', legalComments: 'none' });
  await writeFile(path.join(dist, out.replace('.js', '.min.js')), `${banner}\n${min.code}`);
}

await css('kit/css/ember-ui.css', 'ember-ui.css');
await js(['kit/js/ember-ui-icons.js', 'kit/js/ember-ui.js', 'kit/js/ember-ui-menu.js', 'kit/js/ember-ui-social.js', 'kit/js/ember-ui-app.js', 'kit/js/ember-ui-atlas.js'], 'ember-ui.js');

const { readdir, stat } = await import('node:fs/promises');
for (const f of (await readdir(dist)).filter(f => /\.(css|js)$/.test(f))) {
  const s = await stat(path.join(dist, f));
  console.log(`  dist/${f.padEnd(20)} ${(s.size / 1024).toFixed(1)} KB`);
}
console.log(`Ember UI v${pkg.version} derlendi.`);
