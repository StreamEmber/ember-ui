# MHud — yönergeler (kiti geliştirenler için)

Kiti **kullanan** yapay zekâ için tek belge `AI.md`'dir (katalogdan üretilir). Bu dosya kitin kendisini değiştirenler içindir.

## Kaynak ve çıktılar
- `kit/` tek doğru kaynaktır. `dist/` derleme çıktısıdır (`npm run build`), elle düzenleme. `dist/` git'e yalnız sürüm commit'inde girer (`npm version` ekler); dağıtım jsDelivr `gh` yoluyla doğrudan etiketten: `https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v<sürüm>/dist/…`. npm'e yayın yok.
- `catalog/<aile>.html` bileşen kataloğudur: her `<section data-id data-title data-use [data-js] [data-run] [data-wide]>` bir varyant (okuyucu: `tools/catalog.mjs`). `catalog/<aile>.md` varsa (kurallar, şema, karar tablosu) `ai/<aile>.md`'nin başına girer. `catalog/_intro.md` `AI.md`'nin başıdır (altın kurallar, sayfa iskeleti, ihtiyaç → bileşen, API dizini).
- `npm run ai` → `AI.md` + `ai/*.md` (git'e girer, CI güncelliğini denetler). `npm run site` → build + ai + statik site `_site/`. Bu çıktıları elle düzenleme.

## Bileşen ekleme / değiştirme
- Yeni bileşen = `kit/css`'e stil + gerekiyorsa `kit/js`'e API + ilgili `catalog/<aile>.html`'e bölüm + en az bir `pages/` sunumunda kullanım. Katalogda olmayan bileşen yapay zekânın göremeyeceği bileşendir.
- Yeni public `MH.*` adı = `catalog/_intro.md` API dizinine bir satır. İç yardımcı gerekiyorsa public yapma.
- `npm run audit` geçmeli: her `mh-*` sınıfı katalogda / rehberde / kit JS'inin ürettiği HTML'de görünür olmalı, her `MH.*` adı `AI.md`'de olmalı, her katalog varyantı bir sunum sayfasında kullanılmalı. Kullanılmayan sınıfı silmek kataloğa eklemekten iyidir.
- Aynı işi gören ikinci bir varyant ekleme; var olanı genişlet. Bir kök sınıf tek ailede durur.
- Katalog örneklerinde satır içi stil yalnız belgelenmiş özel değişkenler (`--w`, `--v`, `--cols`…) ve örnek kutusu genişliği içindir; yerleşim `mh-flex/mh-col/mh-gap-*/mh-pad*/mh-push` ile. Galeriye özgü düzeltme (`position`, `animation`) `demo/demo.css` içindeki `.demo-cat` kurallarına gider, örneğe değil.

## Görünüm kuralları
- Tek görünüm (eski "modern"). Tema sistemi yok; oyuna göre değişen tek şey vurgu rengi (`data-mh-accent`, `kit/css/mhud.accents.css`).
- Önekler: sınıf `mh-`, CSS değişkeni `--mh-`, veri özniteliği `data-mh-*`. Durumlar `is-*`, tonlar `.mh-t-*`.
- Renkler token üzerinden (`rgb(var(--mh-…-rgb) / a)`); bileşende sabit renk yazma (siyah/beyaz gölge serbest).
- Değer güncellemeleri `transform`/`opacity` ile; `left/top/width` yazma (layout tetikler).
- `.mh-panel::before` üst kenar ışığıdır; bileşenler panelin `::before/::after`'ını kullanmaz.
- `html.mh-overlay` oyun overlay'idir (saydam, bulanıklık kapalı). Kit hem overlay'de hem OBS / tarayıcıda çalışmalı.

## Menü
- Tam ekran menünün tek yolu `MH.Menu` (`kit/js/mhud-menu.js`). Yeni bir menü ihtiyacı = yeni bölüm görünümü ya da öğe alanı, ayrı bir menü bileşeni değil. `MH.Social` bunun üstünde çalışır.
- `pages/menus.html` menü davranışı yazmaz; yalnız `MH.Menu` çağırır. Sayfa betiklerinde kitin işini yapan kod görürsen kite taşı.

## Köprü
- Oyun ↔ sayfa: StreamEmber overlay köprüsü `window.streamember` (`MH.bridge`). Oyun → sayfa `{ action, data }` → `MH.on`; sayfa → oyun `MH.post(cb, data)` → `{ cb, data }`. WebSocket için `MH.connect`.

## Sürüm ve diğerleri
- Sürüm: `CHANGELOG.md` güncelle → `npm version <x.y.z>` → `git push --follow-tags` (etiket jsDelivr'de hemen kullanılabilir; CI GitHub Release açar).
- Saf HTML/CSS + küçük vanilla JS. Framework yok. Yazı tipleri ve ikonlar yerel kalır.
- Arayüz metinleri Türkçe (UTF-8, diakritikli).
- İkonlar `npm run icons` ile üretilir; `kit/js/mhud-icons.js` elle düzenlenmez.
- `pages/` sunum sayfalarıdır; kaynakta yalnız `<main class="demo-main">` ve sayfa betiği bulunur. Site kabuğu `tools/build-site.mjs`, menü haritası `demo/site.mjs` (yeni sayfa = `pages/<ad>.html` + `PAGES` satırı). `npm run dev` yerel `dist/` ile, `npm run serve` http://localhost:5173.
- `tools/lint.mjs` mod sayfaları içindir (tek dosya, CDN'den indirilip çalıştırılır); kuralları `AI.md` "Altın kurallar" ile aynı kalmalı.
