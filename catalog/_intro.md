# MHud {{version}} — AI kılavuzu

Oyun HUD'u ve yayın overlay'i için hazır arayüz kiti (saf CSS + küçük JS). **Bu dosyayı oku, kaynak kodu açma.**
Bir bileşen lazımsa aşağıdaki aileler dizininden varyantı seç, yalnız o ailenin `ai/<aile>.md` dosyasını aç, HTML parçasını olduğu gibi kopyala.

## İhtiyaç → aile (hızlı seçim)

can/zırh/stamina → `vitals` · boss, dalga, hedef, XP, kanal, ele geçirme, yükleme çubukları → `bars` · oyuncu/NPC başı etiketi → `tags` · para, saat, seviye, aranma → `economy` · silah, envanter, ekip → `gear` · pusula, minimap, işaretçi → `location` · hız, yakıt, binek → `vehicle` · toast, kill feed, duyuru → `feed` · nişangâh, hasar yönü, istem, diyalog → `combat` · menü, modal, skor tablosu, ölüm/yükleme ekranı → `menu` · izleyici oylaması, canlı sayaç → `stream` · sürü, canlandırma, ganimet → `survival` · grafik, seri, etkinlik → `extras` · kâğıt/afiş/telgraf → `print` · düğme, alan, tablo, kaydırma çubuğu → `base`. Her ailenin dosyasını yukarıdaki dizindeki tam adresten aç.

## Kurulum

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v{{version}}/dist/mhud.min.css">
<script src="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v{{version}}/dist/mhud.min.js"></script>
<body class="mh" data-mh-theme="modern"> … <script>MH.mount(document.body);</script>
```

Sürümü her zaman sabit yaz (`@latest` yok). Oyun içi NUI'de CDN kullanma: `dist/` klasörünü (fontlarla) resource'a kopyala.
Yeni eklenen içeriğe `MH.mount(kapsayıcı)` çağır (ikon, halka, bar, segment kurulumu bunda).

## Tema ve renk

- Tema tek öznitelik: `data-mh-theme` (kapsayıcıda ya da `MH.theme('frontier')`). **Bileşen HTML'i temadan bağımsızdır; tema değişince kodu değiştirme.**
- Temalar: `modern` (varsayılan, GTA tarzı), `tactical` (sert, askeri), `frontier` (western HUD, RDR2), `oldwest` (kâğıt-mürekkep, baskı nesneleri).
- Vurgu: `data-mh-accent="amber|crimson|mint|ice|violet|rose|cyan|lime|gold|tiktok"`.
- Ton sınıfları (`mh-t-*`) rengi belirler: `health armor stamina special oxygen hunger thirst stress accent success info warn danger legendary gold silver bronze neutral team1..team5 friend enemy xp`.

## Kurallar

- Önekler: sınıf `mh-`, değişken `--mh-`, veri özniteliği `data-mh-*`; durumlar `is-*` (ör. `is-low`).
- Renk sabit yazma; ton sınıfı ya da `rgb(var(--mh-…-rgb) / a)`.
- İkon: `<i data-i="heart"></i>` (`MH.mount` svg'ye çevirir).
- Değer güncelle: `MH.bar(el, v)`, `MH.ring`, `MH.core`, `MH.pips` (her varyantın `JS:` satırı). `left/top/width` yazma.
- Yerleşim: `.mh-screen` içine `.mh-anchor` + köşe sınıfı (`mh-tl mh-tc mh-tr mh-ml mh-mc mh-mr mh-bl mh-bc mh-br`).
- 1080p referans; ölçek için `MH.autoScale()`.
- **İstediğin varyant listede yoksa kendin çizme.** Önce yakın varyantı ton/boy sınıflarıyla uyarla; olmuyorsa eksik olduğunu kullanıcıya söyle.

## Sosyal menü (isteğe bağlı, API)

Ekip, davet, kasa, cephanelik, rütbe, kanal, arkadaş, gelen kutusu ve takas menüsü HTML kopyalanarak değil **veriyle** kullanılır. `mhud.min.js` içinde `MH.Social` ve `MH.trade` vardır:

```js
var menu = MH.Social('#host', { section: 'crew', onAction: function (a) { /* a.action, a.data */ } });
menu.set(state); menu.patch({ crew: … }); menu.open('channels');
```

Menü durumu kendi değiştirmez; oyuncunun eylemi `{ action, data }` olarak `onAction`'a (NUI'de `MH.post('social', …)`) gider, sunucu yeni durumu `set/patch` ile yollar. NUI mesajları: `social:state`, `social:patch`, `social:open`, `social:close`. Durum şeması için `kit/js/mhud-social.js` dosyasının başlığına bak (yalnızca gerekirse).
