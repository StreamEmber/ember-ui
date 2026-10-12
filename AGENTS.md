# MHud — yönergeler

- `kit/` tek doğru kaynaktır. `dist/` derleme çıktısıdır (`npm run build`), elle düzenleme. `dist/` git'e yalnız sürüm commit'inde girer (`npm version` ekler), çünkü dağıtım jsDelivr `gh` yoluyla doğrudan etiketten yapılır: `https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v<sürüm>/dist/…`. npm'e yayın yok.
- `catalog/<aile>.html` bileşen kataloğudur: her `<section data-id data-title data-use [data-js]>` bir varyant (okuyucu: `tools/catalog.mjs`). `npm run ai` → `AI.md` + `ai/*.md` (git'e girer, jsDelivr'den okunur, CI güncelliğini denetler). `npm run site` → build + ai + statik site `_site/` (`tools/build-site.mjs`; git'e girmez). Bu çıktıları elle düzenleme.
- Yeni bileşen veya varyant = `kit/css`'e stil + gerekiyorsa `mhud.js`'e API + ilgili `catalog/<aile>.html`'e bölüm. Katalogda olmayan bileşen yapay zekanın göremeyeceği bileşendir. Katalog derlemesi, parçadaki her `mh-*` sınıfının CSS'te var olduğunu doğrular.
- Sürüm: `CHANGELOG.md` güncelle → `npm version <x.y.z>` → `git push --follow-tags` (etiket jsDelivr'de hemen kullanılabilir; CI GitHub Release açar).
- Saf HTML/CSS + küçük vanilla JS. Framework, derleme adımı, CDN yok. Yazı tipleri ve ikonlar yerel kalır.
- Önekler: sınıf `mh-`, CSS değişkeni `--mh-`, veri özniteliği `data-mh-*`. Durumlar `is-*`, tonlar `.mh-t-*`.
- Renkler token üzerinden (`rgb(var(--mh-…-rgb) / a)`); bileşende sabit renk yazma. Temaya özgü süsleme yalnızca `themes/*.css` içinde.
- Temalar: modern, tactical, frontier, oldwest. Bileşen HTML'i temadan bağımsızdır; tema yalnız `data-mh-theme` ile seçilir.
- `.mh-panel::before/::after` temalara ayrılmıştır; bileşenler kullanmaz.
- Değer güncellemeleri `transform`/`opacity` ile yapılır; `left/top/width` yazma (layout tetikler).
- Arayüz metinleri Türkçe (UTF-8, diakritikli); sınıf/değişken adları ve yorumlar İngilizce ya da Türkçe olabilir.
- Her değişiklikten sonra galeriyi dört temada kontrol et (`npm run site`, `npm run serve`).
- `oldwest` kâğıt yüzeyleri koyu mürekkep tokenlarını yeniden tanımlar; yeni bir panel bileşeni eklersen `themes/oldwest.css` içindeki kâğıt kapsam listesine ekle. Temalar segment (`.mh-pips > i`) gibi temel parçaların geometrisini ezer; yeni varyant bunu aşmalıdır (bkz. `.mh-pips--hearts`).
- İkonlar `tools/build-icons.cjs` (`npm run icons`) ile üretilir; `kit/js/mhud-icons.js` dosyasını elle düzenleme.
- `pages/` sunum sayfalarıdır (bileşenlerin bir arada kullanımı); kaynakta yalnız `<main class="demo-main">` içeriği ve sayfa betiği bulunur. Site statik HTML'dir: `tools/build-site.mjs` her sayfaya sol menüyü (önce sunumlar, sonra bileşen aileleri), üst çubuğu, sağ görünüm panelini (tema/vurgu/sahne/seçenekler + "Bu sayfada") ve önceki/sonraki bağlantılarını yazar; ayrıca kökte genel bakışı ve `components/<aile>.html` sayfalarını üretir. Menü haritası `demo/site.mjs`'tedir: yeni sunum sayfası = `pages/<ad>.html` + `PAGES`'e satır (listede olmayan sayfa derlemeyi durdurur). `demo/demo.js` yalnız davranıştır (tema durumu, arama, çekmeceler, sahne ölçekleme). Kiti `cdn.jsdelivr.net/gh/StreamEmber/mhud@v<sürüm>/dist/` adresinden yükler (sürümü `npm version` yazar); `npm run dev` yerel `dist/`'e çevirir. Her katalog varyantı en az bir sunum sayfasında görünmelidir (`node tools/coverage.mjs`). Bileşenin tek kaynağı yine `catalog/`; büyük bileşen bölümüne `data-wide="1"` ver (galeride tam satır).
