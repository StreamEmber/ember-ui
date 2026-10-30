# Ember UI — yönergeler (kiti geliştirenler için)

Eski adı MHud (3.x). Önekler: sınıf `eui-`, değişken `--eui-`, öznitelik `data-eui-*`, global `EUI`. Eski adlara dönüşü `tools/lint.mjs` hata sayar; göç aracı `tools/migrate.mjs`.

Kiti **kullanan** yapay zekâ için tek belge `AI.md`'dir (katalogdan üretilir). Bu dosya kitin kendisini değiştirenler içindir.

## Kaynak ve çıktılar
- `kit/` tek doğru kaynaktır. `dist/` derleme çıktısıdır (`npm run build`), elle düzenleme. `dist/` git'e yalnız sürüm commit'inde girer (`npm version` ekler); dağıtım jsDelivr `gh` yoluyla doğrudan etiketten: `https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v<sürüm>/dist/…`. npm'e yayın yok.
- `catalog/<aile>.html` bileşen kataloğudur: her `<section data-id data-title data-use [data-js] [data-run] [data-wide]>` bir varyant (okuyucu: `tools/catalog.mjs`). `catalog/<aile>.md` varsa (kurallar, şema, karar tablosu) `ai/<aile>.md`'nin başına girer. `catalog/_intro.md` `AI.md`'nin başıdır (altın kurallar, sayfa iskeleti, ihtiyaç → bileşen, API dizini).
- `npm run ai` → `AI.md` + `ai/*.md` (git'e girer, CI güncelliğini denetler). `npm run site` → build + ai + statik site `_site/`. Bu çıktıları elle düzenleme.

## Bileşen ekleme / değiştirme
- Yeni bileşen = `kit/css`'e stil + gerekiyorsa `kit/js`'e API + ilgili `catalog/<aile>.html`'e bölüm + en az bir `pages/` sunumunda kullanım. Katalogda olmayan bileşen yapay zekânın göremeyeceği bileşendir.
- Yeni public `EUI.*` adı = `catalog/_intro.md` API dizinine bir satır. İç yardımcı gerekiyorsa public yapma.
- `npm run audit` geçmeli: her `eui-*` sınıfı katalogda / rehberde / kit JS'inin ürettiği HTML'de görünür olmalı, her `EUI.*` adı `AI.md`'de olmalı, her katalog varyantı bir sunum sayfasında kullanılmalı. Kullanılmayan sınıfı silmek kataloğa eklemekten iyidir.
- Aynı işi gören ikinci bir varyant ekleme; var olanı genişlet. Bir kök sınıf tek ailede durur.
- Katalog örneklerinde satır içi stil yalnız belgelenmiş özel değişkenler (`--w`, `--v`, `--cols`…) ve örnek kutusu genişliği içindir; yerleşim `eui-flex/eui-col/eui-gap-*/eui-pad*/eui-push` ile. Galeriye özgü düzeltme (`position`, `animation`) `demo/demo.css` içindeki `.demo-cat` kurallarına gider, örneğe değil.

## Görünüm kuralları
- Tek görünüm (eski "modern"). Tema sistemi yok; oyuna göre değişen tek şey vurgu rengi (`data-eui-accent`, `kit/css/ember-ui.accents.css`).
- Önekler: sınıf `eui-`, CSS değişkeni `--eui-`, veri özniteliği `data-eui-*`. Durumlar `is-*`, tonlar `.eui-t-*`.
- Renkler token üzerinden (`rgb(var(--eui-…-rgb) / a)`); bileşende sabit renk yazma (siyah/beyaz gölge serbest).
- Değer güncellemeleri `transform`/`opacity` ile; `left/top/width` yazma (layout tetikler).
- `.eui-panel::before` üst kenar ışığıdır; bileşenler panelin `::before/::after`'ını kullanmaz.
- `html.eui-overlay` oyun overlay'idir (saydam, bulanıklık kapalı). Kit hem overlay'de hem OBS / tarayıcıda çalışmalı.

## Menü
- Tam ekran menünün tek yolu `EUI.Menu` (`kit/js/ember-ui-menu.js`). Yeni bir menü ihtiyacı = yeni bölüm görünümü ya da öğe alanı, ayrı bir menü bileşeni değil. `EUI.Social` bunun üstünde çalışır.
- `pages/menus.html` menü davranışı yazmaz; yalnız `EUI.Menu` çağırır. Sayfa betiklerinde kitin işini yapan kod görürsen kite taşı.

## Oyun ekranları
- Lobi, başlık, yükleme ve durum ekranları `kit/js/ember-ui-app.js` + `kit/css/ember-ui.app.css`. Yatay / dikey farkı yalnız `@container app (...)` sorgularıyla çözülür; medya sorgusu ve ayrı HTML yok. Yeni ekran = veriyle kurulan bir `EUI.*` çağrısı + `catalog/app.html` varyantı + `catalog/app.md` tablosunda satır + `pages/lobby.html` ya da `pages/boot.html`'de kullanım.
- Her yeni ekran üç boyutta kontrol edilir: 1920×1080, 1170×540 (telefon yatay), 540×960 (telefon dikey).

## Diller ve yazı tipleri
- Gömülü yazı tipleri (`kit/fonts/fonts.css`, Fontsource): Latin, Latin-ext, Vietnamca, Kiril, Yunan. Barlow'da Kiril / Yunan yok: aynı aile adı altında Roboto Condensed'den gelir. CJK, Arapça, Tayca, Hintçe gömülmez; `--eui-font-script` `:lang()` ile sistem yazı tipini seçer (`kit/css/ember-ui.tokens.css`).
- Yazı tipi yığınları `:root, [lang]` üzerinde kurulur (var() tanımlandığı öğede çözülür); yeni bir yazı tipi değişkeni de oraya eklenir.
- JS'te büyük / küçük harf ve sayı biçimi `EUI.upper/lower/fmt/compact` ile (sayfa diline bakar); `toUpperCase()` ve sabit `'tr-TR'` yazma. Yeni metin içeren bileşen `pages/i18n.html`'de denenir.
- Sağdan sola (Arapça, İbranice) yerleşim aynalanmaz: metin doğru yazılır, bileşenler soldan sağa kalır.

## Köprü
- Oyun ↔ sayfa: StreamEmber overlay köprüsü `window.streamember` (`EUI.bridge`). Oyun → sayfa `{ action, data }` → `EUI.on`; sayfa → oyun `EUI.post(cb, data)` → `{ cb, data }`. WebSocket için `EUI.connect`.

## Sürüm ve diğerleri
- Sürüm: `CHANGELOG.md` güncelle → `npm version <x.y.z>` → `git push --follow-tags` (etiket jsDelivr'de hemen kullanılabilir; CI GitHub Release açar).
- Saf HTML/CSS + küçük vanilla JS. Framework yok. Yazı tipleri ve ikonlar yerel kalır.
- Arayüz metinleri Türkçe (UTF-8, diakritikli).
- İkonlar `npm run icons` ile üretilir; `kit/js/ember-ui-icons.js` elle düzenlenmez.
- `pages/` sunum sayfalarıdır; kaynakta yalnız `<main class="demo-main">` ve sayfa betiği bulunur. Site kabuğu `tools/build-site.mjs`, menü haritası `demo/site.mjs` (yeni sayfa = `pages/<ad>.html` + `PAGES` satırı). `npm run dev` yerel `dist/` ile, `npm run serve` http://localhost:5173.
- `tools/lint.mjs` mod sayfaları içindir (tek dosya, CDN'den indirilip çalıştırılır); kuralları `AI.md` "Altın kurallar" ile aynı kalmalı.
