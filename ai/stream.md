# Yayın ve izleyici
Yayıncı ekranı parçaları: durum şeridi, istatistik kartı, galibiyet/mağlubiyet, izleyici oylaması, olay kuyruğu, liderlik, canlı sayaçlar, komut listesi, yayıncı kartı.

## stream.statbar — Durum şeridi
Yatay istatistik çipleri: ikon + büyük sayı + etiket (seviye, can, öldürme…). Ton eui-t-*; sayının yanına <small> ile /100 gibi ek; eui-statbar--lg büyütür. Sayıya (b) data-stat=&quot;kills&quot; verirsen EUI.stat günceller.
JS: `EUI.stat(root, 'kills', 12)`

```html
<div class="eui-statbar"> <div class="eui-chip-stat eui-t-accent"><i data-i="xp"></i><b>24</b><span>Seviye</span></div> <div class="eui-chip-stat eui-t-health"><i data-i="heart"></i><b>82<small>/100</small></b><span>Can</span></div> <div class="eui-chip-stat eui-t-danger"><i data-i="enemy"></i><b>14</b><span>Ekranda</span></div> <div class="eui-chip-stat eui-t-warn"><i data-i="queue"></i><b>37</b><span>Kuyrukta</span></div> <div class="eui-chip-stat"><i data-i="skull"></i><b>3</b><span>Ölüm</span></div> </div>
```

## stream.statcard — İstatistik kartı
Oyuncu özeti: seviye halkası + ad, altında 2×2 hücre (ikon, sayı, etiket). Hücreye ton ver.
JS: `EUI.mount(root)`

```html
<div class="eui-panel eui-statcard"> <div class="eui-statcard__head"><div class="eui-levelring" data-eui-ring style="--v:.64"><b>24</b><small>SVY</small></div><div class="eui-statcard__name"><b>Amiral Router</b><span class="eui-sub">Hayatta kal · Dalga 8</span></div></div>
<div class="eui-statcard__grid"> <div class="eui-statcard__cell eui-t-danger"><i data-i="enemy"></i><div><b>14</b><span>Ekranda</span></div></div> <div class="eui-statcard__cell eui-t-warn"><i data-i="queue"></i><div><b>37</b><span>Kuyrukta</span></div></div> <div class="eui-statcard__cell eui-t-success"><i data-i="trophy"></i><div><b>5–2</b><span>G / M</span></div></div> <div class="eui-statcard__cell"><i data-i="skull"></i><div><b>3</b><span>Ölüm</span></div></div> </div> </div>
```

## stream.winloss — Galibiyet / mağlubiyet
Skor (yeşil W, kırmızı L) ve son maç geçmişi: data-history=&quot;WWLWWLW&quot; harfleri noktaya çevrilir.
JS: `EUI.mount(root)`

```html
<div class="eui-panel eui-wl"><div class="eui-wl__score"><b class="w">5</b><i>–</i><b class="l">2</b></div><div class="eui-wl__meta"><span class="eui-kicker">Son maçlar</span><div class="eui-history" data-history="WWLWWLW"></div></div></div>
```

## stream.vote — İzleyici oylaması
Soru + süre rozeti + seçenekler. Seçenek: eui-opt, __fill'e --v (0..1) yüzde, __cmd sohbet komutu, __label, __pct. is-leading öndeki, is-winner kazanan. Üstte azalan süre çizgisi eui-vote__timer (transform: scaleX).
JS: `opt.style.setProperty('--v', .4)`

```html
<div class="eui-panel eui-vote" style="--w:420px"> <div class="eui-vote__head"><div><span class="eui-kicker eui-kicker--accent">İzleyici oylaması</span><div class="eui-vote__q">Sonraki olay ne olsun?</div></div><span class="eui-badge eui-t-danger eui-badge--dot eui-badge--live eui-num">0:18</span></div>
<div class="eui-vote__opts">
<div class="eui-opt is-leading eui-t-danger"><i class="eui-opt__fill" style="--v:.52"></i><span class="eui-opt__cmd">!1</span><span class="eui-opt__label">Boss geliyor</span><span class="eui-opt__pct">52%</span></div>
<div class="eui-opt eui-t-info"><i class="eui-opt__fill" style="--v:.30"></i><span class="eui-opt__cmd">!2</span><span class="eui-opt__label">Yağmur başlasın</span><span class="eui-opt__pct">30%</span></div>
<div class="eui-opt eui-t-success"><i class="eui-opt__fill" style="--v:.18"></i><span class="eui-opt__cmd">!3</span><span class="eui-opt__label">Herkes iyileşsin</span><span class="eui-opt__pct">18%</span></div> </div>
<div class="eui-vote__foot"><span>Toplam <b>1.284</b> oy</span><span>Sohbete <b>!1</b> – <b>!3</b> yaz</span></div> </div>
```

## stream.queue — Olay kuyruğu
Sıradaki olaylar listesi; çalışan satır is-running, ton eui-t-*; sağda süre veya 'sırada'.
JS: `—`

```html
<div class="eui-panel eui-queue" style="--w:340px"> <div class="eui-panel__head"><span class="eui-kicker">Olay kuyruğu</span><span class="eui-count eui-push">3</span></div>
<div class="eui-queue__item is-running eui-t-danger"><i data-i="skull"></i><span>Boss geliyor · NabeMedia</span><small>0:08</small></div>
<div class="eui-queue__item eui-t-info"><i data-i="users"></i><span>5 düşman · RAPAFI</span><small>sırada</small></div>
<div class="eui-queue__item eui-t-success"><i data-i="heart-plus"></i><span>İyileştirme · anonim</span><small>sırada</small></div> </div>
```

## stream.leader — Destekçi sıralaması
En çok destekleyenler: başlık, satırlar (eui-rank is-1/2/3, avatar, ad, değer).
JS: `—`

```html
<div class="eui-panel eui-leader" style="--w:300px"> <div class="eui-panel__head"><i data-i="crown-f" class="eui-tone eui-t-gold"></i><span class="eui-kicker">En çok destekleyenler</span></div>
<div class="eui-leader__row"><span class="eui-rank is-1">1</span><span class="eui-avatar eui-avatar--sm eui-avatar--round">NM</span><span class="eui-leader__name">NabeMedia</span><span class="eui-leader__val"><i data-i="coin-f"></i>12.400</span></div>
<div class="eui-leader__row"><span class="eui-rank is-2">2</span><span class="eui-avatar eui-avatar--sm eui-avatar--round">MS</span><span class="eui-leader__name">MSK</span><span class="eui-leader__val"><i data-i="coin-f"></i>8.150</span></div> </div>
```

## stream.livestats — Canlı sayaçlar
Yayın göstergeleri: 'Canlı' rozeti + izleyici/beğeni/jeton hücreleri (ton + ikon + sayı).
JS: `EUI.count(el, 4218)`

```html
<div class="eui-panel eui-livestats"> <div class="eui-livestat"><span class="eui-onair">Canlı</span></div> <div class="eui-livestat eui-t-info"><i data-i="eye"></i><div><b>4.218</b><span class="eui-kicker">İzleyici</span></div></div> <div class="eui-livestat eui-t-danger"><i data-i="heart-f"></i><div><b>182 B</b><span class="eui-kicker">Beğeni</span></div></div> <div class="eui-livestat eui-t-gold"><i data-i="coins"></i><div><b>36.540</b><span class="eui-kicker">Jeton</span></div></div> </div>
```

## stream.commands — Komut ve hediye listesi
İzleyici komutları: kod (code) veya hediye çipi (eui-gift-chip) + açıklama.
JS: `—`

```html
<div class="eui-commands"> <div class="eui-command"><code>!saldırı</code> Düşman dalgası çağır</div> <div class="eui-command"><code>!can</code> Yayıncıyı iyileştir</div> <div class="eui-command"><span class="eui-gift-chip"><span style="font-size:15px">🌹</span>Gül</span> 1 düşman doğar</div> </div>
```

## stream.streamer — Yayıncı kartı
Avatar (is-live çerçeve), ad + doğrulama, meta satırı (izleyici, takipçi).
JS: `—`

```html
<div class="eui-panel eui-streamer"><span class="eui-avatar eui-avatar--lg eui-avatar--round is-live">S</span><div class="eui-col eui-gap-1"><span class="eui-streamer__name">Serkan_TV <i data-i="circle-check"></i></span><div class="eui-streamer__meta"><span><i data-i="eye"></i>4,2 B</span><span><i data-i="users"></i>128 B takipçi</span></div></div></div>
```

## stream.likes — Beğeni yağmuru
Kalpleri yukarı süzdüren efekt alanı. Kod: bir .eui-likes kutusuna .eui-like (içinde ikon) ekle; kendiliğinden yükselip söner.

```js
var box = document.createElement('div');
box.className = 'eui-likes';
box.style.cssText = 'position:fixed;right:60px;bottom:40px;width:120px;height:240px;z-index:40';
document.body.appendChild(box);
for (var i = 0; i < 8; i++) setTimeout(function () {
  var l = document.createElement('div'); l.className = 'eui-like';
  l.style.setProperty('--d', (2 + Math.random()).toFixed(2) + 's');
  l.innerHTML = '<i class="eui-i" data-i="heart-f"></i>'; box.appendChild(l); EUI.mount(l);
  setTimeout(function () { l.remove(); }, 3500);
}, i * 180);
setTimeout(function () { box.remove(); }, 4500);
```

## stream.gift-hero — Büyük hediye
Pahalı hediye için ekran ortası kahraman gösterim: büyük sanat, gönderen, hediye adı, jeton rozeti. Kısa süre sonra kaldır.
JS: `—`

```html
<div class="eui-gift-hero"><div class="eui-gift-hero__art"><span>🪐</span></div><div class="eui-gift-hero__from"><b>NabeMedia</b> gönderdi</div><div class="eui-gift-hero__name">Evren</div><span class="eui-badge eui-t-gold eui-badge--pill">44.999 jeton</span></div>
```

## stream.crop — Kare / dikey yayın kırpması
Yayın 9:16 ya da 1:1 kırpılınca HUD orta sütuna toplanır. EUI.crop('vertical' | 'square' | 'wide', { platform: 'tiktok' }); EUI.cropGuide(null, true, 'tiktok') kırpılan alanı ve platform arayüzünü gösterir. Kırpmada gizlenecek öğeye eui-hide-crop / eui-hide-vertical, yalnız kırpmada görünecek öğeye eui-only-crop / eui-only-vertical; dikeyde aşağı itilecek köşeye eui-v-offset (--eui-v-offset).

```js
EUI.crop('vertical', { platform: 'tiktok' });
EUI.cropGuide(null, true, 'tiktok');
setTimeout(function () { EUI.cropGuide(null, false); EUI.crop('wide'); }, 4000);
```
