# Değişiklik günlüğü

Sürümler [SemVer](https://semver.org/lang/tr/) izler. CDN'de her zaman tam sürüm kullanın (`@2.1.0`).

## 2.1.0 — 2026-10-12
- Sunum sitesi yeniden tasarlandı (tek kabuk, `demo/`): solda önce **Sunumlar**, sonra **Bileşenler** (aile başına bir sayfa, varyant sayılarıyla, aranabilir, katlanabilir); sağda **Görünüm** paneli (tema, vurgu, sahne, ızgara sütunu, kodları açık göster, değerleri karıştır, bağlantı kopyala, sıfırla) ve **Bu sayfada** içindekiler; üst çubukta konum + önceki/sonraki.
- Site artık derlemede üretilen statik HTML: `npm run site` (yerelde `npm run dev`) → `_site/`. Menü, üst çubuk, görünüm paneli, içindekiler, genel bakış ve bileşen sayfaları `tools/build-site.mjs` ile yazılır; menü haritası `demo/site.mjs`. `demo/demo.js` yalnız davranış.
- Site kökü genel bakış sayfası: temalar, sunum sayfaları ve bileşen aileleri bir arada. Bileşen aileleri `components/<aile>.html` altında sunum kabuğuyla (canlı önizleme, HTML parçası, kopyala, AI kimliği).
- Kaldırıldı: eski katalog galerisi ve kökteki `<aile>.html` adresleri (yerine `components/<aile>.html`), `tools/build-catalog.mjs` (yerine `tools/catalog.mjs` + `build-ai.mjs` + `build-site.mjs`; `npm run catalog` yerine `npm run ai`), `package.json`'daki npm yayın alanları (`exports`, `main`, `style`, `publishConfig`, `sideEffects`).
- Menü kabuğunun 2 sütunlu (detay panelsiz) düzeni: `menus.html`'de düzen anahtarı ve ayrı ayarlar menüsü; katalogda `menu.shell3` ve `menu.shell2`.
- Sahne seçici düğmelerinde önizleme görselleri artık görünüyor.
- Sol menüde Sunumlar / Bileşenler bölümleri yumuşak açılıp kapanır.
- Yeni aile **Ekip** (`ai/crew.md`, 15 varyant): kare portre (`mh-portrait`), üye kartı (`mh-crewcard`: can, elindeki silah, binek, mesafe, durum), kompakt satır (`mh-crewrow`), kutucuklar (`mh-crewtile`), durum rozetleri, emir çubuğu (`mh-orders`), binek durumu (`mh-mount`), üye ayrıntısı, ekip tablosu, işaretli hedefler. **Kırıcı (AI kimlikleri):** `gear.party`, `gear.squad-rings`, `gear.voice`, `gear.ping`, `gear.teamhead` → `crew.*`.
- **Ekipman** ailesi ayrıldı ve genişledi: teçhizat/kıyafet yuvaları (`mh-gearslots`), silah bakımı (`mh-condition`), mermi türleri (`mh-ammotypes`), silah karşılaştırma.
- Yeni aile **Mağaza ve satın alma** (`ai/shop.md`, 13 varyant): ürün kutucuğu `mh-item` (sabit oranlı görsel alanı `--ratio`, `--square`, `--row`, `--mini`), gruplu ızgara (`mh-shopgrid` + `mh-shopgroup`), liste, yatay şerit, kategoriler, fiyat durumları, adet (`mh-qty`), satın alma paneli (`mh-buy`), sepet (`mh-cart`), tuş listesi (`mh-keylist`).
- Halka içindeki avatar artık yuvarlak (kare alan halkayla sarılmaz).
- Yeni sunum sayfaları: **Mağaza & satın alma** (Posse tarzı ekip menüsü: Ekibim, Üye al, Ahır, Silahçı, Bakkal, Tuşlar, Ayarlar) ve **Ekip & ekipman**. Menüler sayfasındaki etkileşim menüsüne Silahçı, Görevler, Garaj, Tuşlar bölümleri eklendi.

## 2.0.2 — 2026-10-12
- Dağıtım npm yerine doğrudan GitHub: `https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.2/dist/mhud.min.css` (ve `.js`). `dist/` artık sürüm etiketlerinde depoda; npm paketi yayınlanmıyor.
- Depo `StreamEmber/mhud` adresine taşındı; galeri https://streamember.github.io/mhud/.
- Sunum sayfaları (`pages/`) kiti jsDelivr'den yükler; tüm katalog varyantları en az bir sunum sayfasında (yeni: Barlar, İsim etiketleri, Bar stilleri). `tools/coverage.mjs` kapsamı denetler.

## 2.0.1 — 2026-10-09
(2.0.0 etiketi itildi ama npm yayını tamamlanmadı; bu sürüm onun yerine geçer.)

**Kırıcı sürüm; eski sürümle uyumluluk hedeflenmedi.**
- Kaldırıldı: FiveM/RedM resource'u (`integration/`), hazır oyun düzenleri ve `dist/mhud-game.*` (`games/`), `npm run sync`.
- Kaldırıldı: `minimal` ve `neon` temaları. Yerine `modern` ya da `tactical` kullanın. Kalan temalar: modern, tactical, frontier, oldwest.
- Yeni: bileşen kataloğu (`catalog/`), aile bazlı galeri ve yapay zeka kılavuzu (`AI.md`, `ai/<aile>.md`; katalogdan üretilir).
- Yeni — katalog aileleri: yaşam göstergeleri (30), konum & yön (10), ekonomi & durum (12), ekipman & ekip (9), araç & binek (6), bildirimler (12), savaş & dünya (16), menü & ekranlar (14), yayın & izleyici (12), basılı nesneler (7), hayatta kalma & mod (12), grafik & ilerleme (11), temel parçalar (13) — isim etiketleri (31, savaş ailesinden ayrıldı), barlar (18: boss, dalga, hedef, XP, kanal, ele geçirme, ipi çeken, tehdit, yükleme…; boss/dalga/hedef/meydan okuma/canlandırma diğer ailelerden taşındı), toplam 15 aile, 205 varyant; sosyal menü API olarak `AI.md`'de. Yeni bar stilleri (birleştirilebilir): `mh-bar--line`, `--tip` (uç ışığı), `--skew`, `--chevron`, `--arrow`, `--pill`, `--glass`, `--stripe`, `--shine`, `--heat`, `--ticks`, `--frame`, `--bracket`, `--center`, `--rtl`, `__text`, `__over` (aşırı kalkan); `MH.bar` artık barda `--v` yazar. İsim etiketi biçimleri (`mh-tag--plate|flag|pill|card|line|bar|hp|glow|banner|bracket|pointer|race|vip|boss|npc|viewer|frontier|far|bounty`, ekler `__lvl __clan __num __hp __more`, durumlar `is-down is-afk is-leader is-target`; `MH.Nametags` öğelerine `variant`, `role`, `avatar`, `level`, `clan`, `down`, `afk`, `leader`). Kaydırma çubukları `.mh` altında temaya göre ince çizilir (`mh-scroll--rail|accent|hidden|x`). Yeni yerleşimler: şerit (`mh-strip`, `--skew`), plaka (`mh-plate`). Yeni parçalar: dikey bar (`mh-bar--v`), değerli halka (`mh-ringval`), kalp segmentleri (`mh-pips--hearts`), yön çipi (`mh-heading`), hedef oku (`mh-wayarrow`), koordinat (`mh-coords`), kompakt para (`mh-coin`), mermi sayacı (`mh-ammo`), ikonlu halka (`mh-ringval > .mh-i`); hız kadranı `data-speed` ile kurulur; pusula `data-heading` ile kurulur.
- Galeri: sol menü (katalog aileleri + sunumlar); sunum sayfaları (`pages/`, oyun ön ayarları hariç) v2 temalarıyla geri geldi.
- Ortak MH.Atlas adaptörü; overlay oyun yüksekliğine göre ölçekleme, düşman can barında kırmızı ton ve yalnız maksimum can değiştiğinde bar/halkaların yenilenmesi.

## 1.3.0 — 2026-10-08
- İlk npm sürümü: `@streamemberplatform/mhud` (dist/ tek dosya CSS ve JS, jsDelivr/unpkg).
  (1.2.0 etiketi GitHub'da var ama npm'e yayınlanmadı.)
- Yayın: GitHub Actions + npm Trusted Publishing (OIDC) desteği, GitHub Pages demo sitesi, resource zip'i Releases'ta.
- `npm version` sürümü kendiliğinden her yere yazar (kit, resource, README, demo).
- Ekip & kanallar menüsü (`kit/js/mhud-social.js`): ekip, davetler, kasa, cephanelik, rütbe izinleri,
  kanallar (routing bucket), arkadaşlar, gelen kutusu, takas.
- Genel modal sistemi: `MH.modal`, `MH.choose`, `MH.amount`; `MH.confirm` / `MH.input` bunun üstüne taşındı.
- FiveM/RedM resource: sosyal menü exportları, `server/channels.lua` kanal yöneticisi, F5 / `/mhud_social`.
- Görsel düzeltmeler: basılı tut halkası, Old West anahtar ve radyal menü, düğmelerde optik ortalama.

## 1.1.0
- Old West teması ve baskı nesneleri (afiş, damga, telgraf, gazete, tabela).
- Kare/dikey yayın kırpması (`MH.crop`), yayıncı istatistikleri.
- Oyun düzenleri: GTA V, Red Dead, Left 4 Dead 2, HTML5 (`games/`), WebSocket köprüsü (`MH.connect`).
- Material Design Icons tabanlı ikon seti.

## 1.0.0
- Beş temalı HUD kiti ve FiveM/RedM resource'u.
