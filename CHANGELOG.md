# Değişiklik günlüğü

Ember UI (4.0'dan önce: MHud).

Sürümler [SemVer](https://semver.org/lang/tr/) izler. CDN'de her zaman tam sürüm kullanın (`@4.2.0`).

## 4.2.0 — 2026-10-30
- Hesap ekranları: `EUI.auth` (giriş, kayıt, hesap bağlama, şifre sıfırlama, yayıncı girişi — e-posta, misafir, Google, Apple ve QR sekmesi; doğrulama kitte, sunucu hatası `p.error`, `resolveOn: false` ile oyun doğrular), `EUI.consent` (koşullar, gizlilik, yaş), `EUI.language` (+ `EUI.languages`), `EUI.nickname` (sayaç, öneri, müsaitlik), `EUI.pin` (yetkili / ebeveyn kilidi, tuş takımı + klavye). Üç ekran boyutunda.
- Oyna düğmesi (`eui-cta`) oyun düğmesi oldu: kalın 3B kenar, parlama, basınca çöker; metin ortada ve büyük. `eui-cta--alt` koyu gövde.
- Menü: ayar düğmelerinde `confirm` (Hesabı sil, Çıkış yap önce onay sorar).
- Sunum: `pages/boot.html` hesap ekranları, ilk açılış akışı ve tam ekran Ayarlar menüsü.

## 4.1.1 — 2026-10-30
- Lobi yeniden düzenlendi: boyutlar tek yerden (`--app-*` değişkenleri), üç ekran sınıfı (PC 1080p, telefon yatay, telefon dikey) için ayrı yerleşim. Dikeyde sol kısayollar · orta sahne · sağ kampanya kartları, altta Oyna + gezinme; üst çubuk iki satır (profil + düğmeler, para birimleri). Kampanya kartına ikon kutusu, sahneye zemin ışığı ve seviye/kupa rozeti.
- Başlık, yükleme ve durum ekranları ekranla ölçeklenir (`cqmin` / `cqw`); dikeyde düğmeler alt alta ve ana düğme üstte.
- Düzeltme: container sorguları kapsayıcının kendisini biçimlendiremediği için ölçek değişkenleri `.eui-app > *` üzerinde tanımlanır.

## 4.1.0 — 2026-10-30

**Oyun ekranları** (yeni aile `app`, `ai/app.md`): kit artık yalnız HUD değil, oyunun kendi ekranlarını da kuruyor. Hepsi veriyle kurulur ve aynı çağrı PC'de, yatay ve dikey telefonda çalışır (`.eui-app` kapsayıcı sorgusu).
- `EUI.Lobby(host, spec)`: profil, para birimleri, simge düğmeleri, kampanya kartları, sahne, kısayollar, alt gezinme çubuğu, mod ve Oyna düğmesi; `update / show / hide / destroy`; eylemler `onAction` ve `EUI.post('lobby', …)`.
- `EUI.title` (dokununca devam), `EUI.loading` (ilerleme + dönen ipuçları), `EUI.state(tür)`: `network-error`, `offline`, `maintenance`, `update-required`, `update-available`, `session-expired`, `error`, `checking`, `reconnecting` (Promise ile düğme sonucu).
- Parçalar: `eui-currency`, `eui-profile`, `eui-iconbtn`, `eui-dot`, `eui-promo`, `eui-shortcuts`, `eui-navbar`, `eui-cta`.
- `EUI.Menu` dikey ekranda tam ekrana geçer: gezinme üstte yatay sekmeler, detay paneli altta kompakt şerit.
- `EUI.autoScale` kısa kenarı ölçer (yatayda yükseklik, dikeyde genişlik); telefon / tablet için `EUI.autoScale({ base: 540 })`.
- Yeni sunum sayfaları: **Lobi** (PC 1920×1080, telefon yatay 1170×540, telefon dikey 540×960 yan yana; Mağaza, Envanter, Karakter, Posta, Ayarlar menüleri) ve **Açılış ve durum ekranları** (başlık → yükleme → ağ hatası → lobi akışı).

## 4.0.0 — 2026-10-30

**Yeni ad: Ember UI** (eski adı MHud). Yalnız adlandırma değişti; bileşenler, API ve davranış 3.0 ile aynı. Kit HUD'un ötesine (lobi, ekranlar, Godot) büyüyeceği için ad içeriğe göre seçildi. Ember.js ile ilgisi yoktur.

| Ne | MHud 3.x | Ember UI 4 |
|---|---|---|
| Repo / site | `StreamEmber/mhud`, `streamember.github.io/mhud` | `StreamEmber/ember-ui`, `streamember.github.io/ember-ui` |
| CDN | `…/gh/StreamEmber/mhud@v3.0.0/dist/mhud.min.css` | `…/gh/StreamEmber/ember-ui@v4.0.0/dist/ember-ui.min.css` |
| Sınıf / değişken / öznitelik | `mh-*` / `--mh-*` / `data-mh-*` | `eui-*` / `--eui-*` / `data-eui-*` |
| Kök sınıflar | `.mh`, `html.mh-overlay` | `.eui`, `html.eui-overlay` |
| JS global | `MH` (`MH_ICONS`, `MH_WEAPONS`) | `EUI` (`EUI_ICONS`, `EUI_WEAPONS`) |
| Yazı tipi aileleri | `'MH Inter'` … | `'EUI Inter'` … |
| Kaynak dosyalar | `kit/css/mhud.*.css`, `kit/js/mhud*.js` | `kit/css/ember-ui.*.css`, `kit/js/ember-ui*.js` |

- Yeni `tools/migrate.mjs`: bir klasördeki adları tek komutla çevirir (`node migrate.mjs web/`, `--dry` ile önizleme, `--test` kendini sınar).
- `tools/lint.mjs` eski MHud adlarını (`mh-`, `MH.`, `mhud@`) hata sayar ve 4.x'ten eski sürümü reddeder.
- `AI.md` başında "Ember.js ile ilgisi yoktur" uyarısı ve eski adlara karşı not.

## 3.0.0 — 2026-10-30

**Kırıcı sürüm; 2.x ile uyumluluk hedeflenmedi.** Amaç: yapay zekânın kiti kurallar içinde, kendi yapısını uydurmadan kullanması.

**Tek görünüm**
- Tema sistemi kaldırıldı: `tactical`, `frontier`, `oldwest` ve `themes/` klasörü, `data-mh-theme`, `MH.theme()`. Eski `modern` görünüm tek görünümdür; oyuna göre değişen yalnız vurgu rengi (`data-mh-accent`, `MH.accent`).
- Eski Batı / kâğıt parçaları kaldırıldı: `print` ailesi (afiş, telgraf, gazete, defter, bilet, tabela, damga), `MH.poster/posterHTML/telegram/headline/sign/stamp`, `tags.frontier-sign`, `tags.bounty`, `economy.bounty`, `pages/western.html`.
- Yalnız temaların kullandığı yazı tipleri kaldırıldı (Cinzel, Crimson Pro, Source Serif 4, Rajdhani, Chakra Petch, Rye, Old Standard TT, Special Elite).

**Menü: `MH.Menu`**
- Yeni `MH.Menu(host, spec)` (`kit/js/mhud-menu.js`): menü veriyle kurulur. Bölüm görünümleri `list`, `grid`, `settings`, `table`, `custom`; detay paneli `item` / `buy`. Katman + perde, ekrana sığma, aç/kapa, ESC, ↑↓ ←→ Enter Q E, 2/3 sütun, alt ipuçları ve `onAction` → `MH.post('menu', …)` kitte.
- `MH.Social` artık `MH.Menu` üstünde çalışır; cephanelik `mh-item` kullanır.
- Kaldırıldı: `menu.classic` (`mh-classic`, `MH.listNav`), `menu.card` (`mh-card`, `mh-cards`; yerine `mh-item`), `menu.shell3` / `menu.shell2` (yerine `MH.Menu`).
- Yeni katalog varyantları: `menu.menu`, `menu.menu-settings`, `menu.choose`, `menu.amount`, `menu.input`; `ai/menu.md` başında "Menü kuralları", karar tablosu ve tam şema.

**Oyun köprüsü**
- FiveM NUI katmanı kaldırıldı (`GetParentResourceName`, `MH.isNui`, `MH.resource`, `MH.escClose`). `MH.post(cb, data)` artık StreamEmber overlay köprüsüne (`window.streamember.post({ cb, data })`) gider; oyun mesajları köprüden `MH.on`'a gelir. `MH.bridge`, `MH.debug` (`?mhdebug=1`).
- `MH.autoScale()` `.mh-screen`'i oyun yüksekliğinde tutar (görünümün altındaki isim etiketi atlası için `--mh-atlas-gap`); `MH.Atlas` köprüyü `MH.bridge` üzerinden okur.
- `html.mh-nui` → `html.mh-overlay`; overlay'de pahalı cam bulanıklığı kapalı.

**Katalog ve belgeler**
- Yinelenenler birleştirildi: `extras.streak` → `economy.streak`, `economy.chip-stat` → `stream.statbar`, `economy.standings` → `menu.standings`, `location.zone` → `survival.zone`, `combat.key` → `base.keys`, `vehicle.mount` → `crew.mount` (aynı `mh-mount` sınıfı iki farklı yapıdaydı).
- Görünmeyen parçalar kataloğa girdi: `vitals.needs`, `combat.objective`, `combat.damage-number`, `combat.vignette`, `feed.chat`, `feed.ticker`, `stream.gift-hero`, `stream.crop`, `base.player`, `base.utils`; kullanılmayan sınıflar silindi. Yeni yardımcılar `mh-push`, `mh-items-start`, `mh-items-end`; maç sonucu rozeti `mh-match__res`.
- `AI.md`: altın kurallar, overlay sayfa iskeleti, ihtiyaç → bileşen tablosu, genişletme kuralı ve **tam API dizini** (her public `MH.*`).
- Katalog örneklerinden demo yamaları ve satır içi renkler temizlendi.
- Yeni araçlar: `tools/audit.mjs` (her sınıf ve API yapay zekâya görünür mü; CI'da), `tools/lint.mjs` (mod sayfası denetleyicisi: sabit olmayan sürüm, tema, kitte olmayan / ezilen `mh-*`, `x-` dışı özel sınıf, kitin menü/satır/katman/modal kopyası, sabit renk).

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
