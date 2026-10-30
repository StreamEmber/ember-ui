# Ember UI

[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr%20gh-f5b83d)](https://www.jsdelivr.com/package/gh/StreamEmber/ember-ui)
[![license](https://img.shields.io/badge/license-MIT-f5b83d)](LICENSE)

StreamEmber oyun modları (overlay: GTA V, RDR2), OBS tarayıcı kaynakları, HTML5 oyunlar ve mobil / PC oyun ekranları (lobi, açılış, menüler) için **tek görünümlü**, bağımlılıksız arayüz kiti. Eski adı **MHud** (3.x); Ember.js ile ilgisi yoktur.
Tam ekran menüler HTML yazılarak değil **veriyle** kurulur (`EUI.Menu`). Oyuna göre değişen tek şey vurgu rengidir.

**Galeri:** https://streamember.github.io/ember-ui/  ·  **Yapay zeka için kılavuz:** [`AI.md`](AI.md)

## Kurulum

```html
<html class="eui-overlay">  <!-- yalnız oyun overlay'inde -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.0/dist/ember-ui.min.css">
<body class="eui" data-eui-accent="mint">
  <div class="eui-screen"> … </div>
  <script src="https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.0/dist/ember-ui.min.js"></script>
</body>
```

Her zaman tam sürüm yazın (`@latest` / `@main` görünümü habersizce değiştirir). Tam sayfa iskeleti ve oyun köprüsü: [`AI.md`](AI.md#sayfa-iskeleti-overlay-modu).

## Kullanım

Bir bileşen = katalogdaki HTML + isteğe bağlı `EUI.*` çağrısı. Menü:

```js
var menu = EUI.Menu({
  title: 'Mod menüsü', post: 'menu',
  sections: [
    { id: 'inv', label: 'Envanter', icon: 'backpack', view: 'list', items: [{ id: 'medkit', title: 'İlk yardım', icon: 'first-aid' }] },
    { id: 'set', label: 'Ayarlar', icon: 'settings', view: 'settings', fields: [{ id: 'scale', label: 'HUD ölçeği', type: 'slider', value: 100, unit: '%' }] }
  ]
});
EUI.on('menu', function (d) { d.open ? menu.open() : menu.close(); });   // oyun → sayfa
// her eylem EUI.post('menu', { action, section, id, value }) ile oyuna gider
```

| Aile | İçerik |
|---|---|
| [Oyun ekranları](ai/app.md) | `EUI.Lobby` (lobi), `EUI.title`, `EUI.loading`, `EUI.state` (ağ hatası, çevrimdışı, bakım, güncelleme…); yatay ve dikey |
| [Menü ve ekranlar](ai/menu.md) | `EUI.Menu` (veriyle tam ekran menü), onay / seçim / tutar / metin pencereleri, bağlam ve radyal menü, skor tablosu, podyum, ölüm / sonuç / yükleme ekranı |
| [Yaşam göstergeleri](ai/vitals.md) | Can, zırh, stamina, ihtiyaç halkaları |
| [Barlar](ai/bars.md) | Boss, dalga, hedef, XP, kanal, ele geçirme, tehdit, yükleme |
| [İsim etiketleri](ai/tags.md) | Oyuncu / NPC başı etiketleri (`EUI.Nametags`) |
| [Ekonomi ve durum](ai/economy.md) | Para, aranma, saat-hava, seviye, etkiler, seri |
| [Ekipman](ai/gear.md) | Silah, cephane, yuva şeridi, envanter ızgarası, teçhizat |
| [Ekip](ai/crew.md) | Portre, üye kartı, kompakt satır, emir çubuğu, binek |
| [Mağaza](ai/shop.md) | Ürün kutucuğu, gruplu ızgara, satın alma paneli, sepet |
| [Konum ve yön](ai/location.md) | Pusula, minimap çerçevesi, işaretçi, hedef oku |
| [Araç](ai/vehicle.md) | Hız göstergesi, yakıt, lambalar |
| [Bildirim ve akış](ai/feed.md) | Toast, ölüm akışı, duyuru, altyazı, sohbet, kayan şerit |
| [Savaş ve dünya](ai/combat.md) | Nişangâh, vuruş, hasar yönü, kırmızı kenar, yüzen hasar, görev takibi, diyalog |
| [Yayın ve izleyici](ai/stream.md) | Oylama, canlı sayaç, hediye, kare / dikey kırpma |
| [Hayatta kalma](ai/survival.md) | Sürü, canlandırma, ganimet, beceri kontrolü |
| [Grafik ve ilerleme](ai/extras.md) | Grafikler, istatistik panosu, etkinlik, maç geçmişi |
| [Temel parçalar](ai/base.md) | Panel, düğme, rozet, alan, tablo, sekme, yardımcı sınıflar |

### Yapay zeka ile kullanım

Yapay zekaya yalnız `AI.md` adresini verin: `https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.0/AI.md`. Altın kuralları, sayfa iskeletini, ihtiyaç → bileşen tablosunu ve tam API dizinini içerir; yapay zeka ilgili ailenin dosyasını açar, kaynak kodu okumaz.
Yapılan sayfayı denetlemek için: `curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.0/tools/lint.mjs && node lint.mjs web/`.

## Geliştirme

```bash
npm install      # yalnız geliştirme araçları (esbuild)
npm run ai       # catalog/ -> AI.md + ai/*.md
npm run audit    # görünmeyen sınıf, belgesiz API, sunumda olmayan varyant
npm run site     # build + ai + statik site (_site/); kit jsDelivr'den
npm run dev      # aynısı, ama sayfalar yerel dist/'i kullanır
npm run serve    # site: http://localhost:5173
npm run icons    # kit/js/ember-ui-icons.js'i yeniden üret
```

**MHud 3.x'ten geçiş:** `curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.0/tools/migrate.mjs && node migrate.mjs web/` adları çevirir (`mh-` → `eui-`, `MH` → `EUI`, `mhud` → `ember-ui`); ardından `lint.mjs`.

**Sürüm yayınlamak:** `CHANGELOG.md`'yi güncelle, `npm version <x.y.z> -m "release: v%s"`, `git push --follow-tags`. Geliştirme kuralları: [`AGENTS.md`](AGENTS.md).
