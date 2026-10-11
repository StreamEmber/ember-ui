# MHud

[![jsDelivr](https://img.shields.io/badge/CDN-jsDelivr%20gh-f5b83d)](https://www.jsdelivr.com/package/gh/StreamEmber/mhud)
[![license](https://img.shields.io/badge/license-MIT-f5b83d)](LICENSE)

Oyun modları ve canlı yayın overlay'leri için temalı, bağımlılıksız HUD ve arayüz kiti (NUI, OBS tarayıcı kaynağı, HTML5).
Aynı HTML dört temaya bürünür: `modern`, `tactical` (GTA V dili), `frontier` (RDR2 western HUD), `oldwest` (kâğıt-mürekkep).

**Galeri:** https://streamember.github.io/mhud/  ·  **Yapay zeka için kılavuz:** [`AI.md`](AI.md)

## Kurulum

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.2/dist/mhud.min.css">
<script src="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.2/dist/mhud.min.js"></script>
<body class="mh" data-mh-theme="modern"> … <script>MH.mount(document.body);</script>
```

Her zaman tam sürüm yazın (`@latest` güncellemede görünümü habersizce değiştirir). Oyun içi NUI'de CDN yerine `dist/` klasörünü (fontlarla) resource'a kopyalayın.

Dosyalar doğrudan GitHub deposundan, jsDelivr'in `gh` yolu ile gelir (npm kullanılmaz): `https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v<sürüm>/<yol>`. `dist/` her sürüm etiketinde depoya girer; `dist/mhud.css` (açık), `dist/mhud.min.css`, `dist/mhud.js`, `dist/mhud.min.js` (`window.MH`), `dist/fonts/`. Etiketsiz `@main` önbelleğe alınır ve sürüm dışı değişir, üretimde kullanmayın.

## Kullanım

Bir bileşen = sınıflar + isteğe bağlı `MH.*` çağrısı. Tema tek öznitelik (`data-mh-theme`), bileşen kodu değişmez.
Bileşenler ailelere ayrılır; her varyantın HTML'i ve güncelleme çağrısı galeride görünür ve `ai/<aile>.md` dosyalarındadır:

| Aile | Varyant | İçerik |
|---|---|---|
| [Barlar](ai/bars.md) | 18 | Can dışındaki bütün ilerleme/doluluk çubukları: boss ve elit, dalga, hedef, meydan okuma, XP, kanal/yeniden doldurma, ele geçirme, ipi çeken iki taraf, tehdit ölçeri, yükleme |
| [Temel parçalar](ai/base.md) | 14 | Her yerde kullanılan yapı taşları: panel, düğme, rozet, çip, tuş ipucu, form alanları, sekme, tablo, avatar |
| [Savaş ve dünya](ai/combat.md) | 13 | Nişangâh, vuruş geri bildirimi, hedef kilidi, tur skoru, nokta ele geçirme, etkileşim istemleri, diyalog |
| [Ekonomi ve durum](ai/economy.md) | 12 | Para, aranma/ödül, saat ve hava, seviye ve XP, etki simgeleri, seri, sıralama |
| [Grafik ve ilerleme](ai/extras.md) | 10 | Küçük grafikler, ilerleme çizgisi, seri, meydan okuma, etkinlik/maç satırı, başarı, hediye haritası |
| [Bildirim ve akış](ai/feed.md) | 12 | Ekrana kısa süre düşen JS bileşenleri: toast, ölüm akışı, hediye, duyuru, görev şeridi, seviye atlama, başarım, eşya alma, geri sayım, altyazı, ilerleme |
| [Ekipman ve ekip](ai/gear.md) | 9 | Silah ve cephane, yuva şeridi, envanter ızgarası, ekip kartları, ses ve bağlantı göstergeleri |
| [Konum ve yön](ai/location.md) | 10 | Pusula, minimap çerçevesi, sokak/bölge, yön çipi, koordinat, hedef işaretleri |
| [Menü ve ekranlar](ai/menu.md) | 13 | Kart, klasik menü, bağlam menüsü, modal, ayar satırı, envanter ızgarası, skor tablosu, podyum, ölüm/yeniden doğma ekranı, yükleme |
| [Basılı nesneler](ai/print.md) | 7 | Kağıt/tabela hissi veren dünya nesneleri (frontier ve oldwest temalarında en iyi görünür): arananlar afişi, telgraf, gazete, defter, bilet, tabela, damga |
| [Yayın ve izleyici](ai/stream.md) | 11 | Yayıncı ekranı parçaları: durum şeridi, istatistik kartı, seviye halkası, galibiyet/mağlubiyet, izleyici oylaması, olay kuyruğu, liderlik, canlı sayaçlar, komut listesi, yayıncı kartı |
| [Hayatta kalma ve mod](ai/survival.md) | 11 | Dalga/sürü uyarısı, özel düşman, silah yuvaları, kurtarma sayacı, canlandırma, takım yaşam kartları, alan daralması, gün sayacı, izleyici modu |
| [İsim etiketleri](ai/tags.md) | 31 | Oyuncu/NPC başında görünen etiketler |
| [Araç ve binek](ai/vehicle.md) | 6 | Hız kadranı, kompakt hız, yakıt/motor ölçerleri, gösterge lambaları, halka ölçer ve at (binek) paneli |
| [Yaşam göstergeleri](ai/vitals.md) | 30 | Can, zırh, stamina, dayanıklılık gibi 0-100 arası değerler |

Bunlara ek olarak `MH.*` ile kullanılan API'ler (bildirim akışı, `MH.Nametags`, `MH.Markers`, `MH.Social`, radyal menü, onay/seçim pencereleri) `AI.md`'de ve ilgili ailede anlatılır. Galerideki **Sunumlar** bölümü (`pages/`) her bileşeni bir arada, gerçek sahne üstünde gösterir; sayfalar da kiti jsDelivr'den yükler.

### Yapay zeka ile kullanım

Yapay zekaya yalnız `AI.md` adresini verin (`https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.2/AI.md`): kurulum, tema kuralları ve varyant dizinini içerir; yapay zeka dizinden varyantı seçer, yalnız o ailenin dosyasını açar, kaynak kodu okumaz.

### Hızlı örnek

```html
<body class="mh" data-mh-theme="frontier">
  <div class="mh-screen"><div class="mh-anchor mh-bl">
    <div class="mh-strip mh-t-health"><i data-i="heart"></i><div class="mh-bar mh-bar--md mh-bar--tip" data-v="82"><i class="mh-bar__fill"></i></div><b>82</b></div>
  </div></div>
  <script>MH.mount(document.body); MH.toast({ title: 'Hoş geldin' });</script>
</body>
```

Temayı değiştirmek için yalnız `data-mh-theme` değişir (`MH.theme('tactical')`); vurgu rengi `data-mh-accent`.

## Geliştirme

```bash
npm install      # yalnız geliştirme araçları (esbuild)
npm run site     # build + galeri (_site/) + AI.md / ai/*.md; sayfalar jsDelivr'den yükler
npm run dev      # aynısı, ama sayfalar yerel dist/'i kullanır (yayınlanmamış değişiklikleri görmek için)
npm run serve    # galeri: http://localhost:5173
npm run icons    # kit/js/mhud-icons.js'i yeniden üret
```

**Sürüm yayınlamak:** `CHANGELOG.md`'yi güncelle, `npm version <x.y.z> -m "v%s"` (sürümü her yere yazar, `dist/`'i derleyip commit'e ekler), `git push --follow-tags`.
`v*` etiketi jsDelivr adresini (`@v<x.y.z>`) hemen kullanılabilir yapar; GitHub Actions bir GitHub Release açar. `main`'e her itme galeriyi GitHub Pages'e yayınlar (https://streamember.github.io/mhud/).
Geliştirme kuralları: [`AGENTS.md`](AGENTS.md).
