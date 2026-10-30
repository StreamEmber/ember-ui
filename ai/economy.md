# Ekonomi ve durum
Para, aranma/ödül, saat ve hava, seviye ve XP, etki simgeleri, seri, sıralama. Sayılar EUI.count / EUI.money ile akıcı değişir.

## economy.cash — Para ve banka
Sağ üst köşe para göstergesi; artış/azalış farkı kısa süre yüzer. İkinci satır banka bakiyesi (kaldırılabilir).
JS: `EUI.money(el, 12480, { symbol: '$' })`

```html
<div class="eui-cash">
  <div class="eui-cash__value"><small>$</small><b data-cash>12.480</b></div>
  <div class="eui-cash__bank"><i data-i="bank"></i><span>1.204.900</span></div>
</div>
```

## economy.coin — Kompakt para
Tek satır ikon + tutar: puan, jeton, altın. Tonu eui-t-* ile değiştir; satır içi kullanılır.
JS: `EUI.money(el.querySelector('b'), 12400)`

```html
<div class="eui-flex eui-gap-4">
  <div class="eui-coin"><i data-i="coin-f"></i><b>12.400</b></div>
  <div class="eui-coin eui-t-info"><i data-i="bolt"></i><b>240</b></div>
</div>
```

## economy.wanted — Aranma yıldızları
GTA tarzı 5 yıldız; dolu olanlara on sınıfı, is-flashing yanıp söner.
JS: `el.querySelectorAll('.eui-i').forEach((s, i) => s.classList.toggle('on', i < 3))`

```html
<div class="eui-wanted is-flashing"><i data-i="star-f" class="on"></i><i data-i="star-f" class="on"></i><i data-i="star-f"></i><i data-i="star-f"></i><i data-i="star-f"></i></div>
```

## economy.clock — Saat ve hava
Hava ikonu + saat + durum ve gün. İkon ad değişince hava değişir (sun, rain, …).
JS: `el.querySelector('.eui-clock__time').textContent = '06:40'`

```html
<div class="eui-clock"><i data-i="sun"></i><span class="eui-clock__time">21:14</span><span class="eui-clock__meta"><span>Açık · 24°C</span><span>Cumartesi</span></span></div>
```

## economy.xp — Seviye ve XP
Elmas seviye rozeti + XP barı + kazanılan puan. Alt kenar HUD'u.
JS: `EUI.bar(el.querySelector('.eui-bar'), 77)`

```html
<div class="eui-xp" style="--w:340px">
  <div class="eui-xp__level"><span>42</span></div>
  <div class="eui-xp__body">
    <div class="eui-xp__meta"><span>Seviye 42 · <b>+250 RP</b></span><span class="eui-num">18.450 / 24.000</span></div>
    <div class="eui-bar" data-v="77"><i class="eui-bar__gain"></i><i class="eui-bar__fill"></i></div>
  </div>
</div>
```

## economy.levelring — Seviye halkası
Halka içinde seviye numarası; small etiketi altta. --size boyut, ton eui-t-*.
JS: `EUI.ring(el, 0.64)`

```html
<div class="eui-flex eui-gap-4">
  <div class="eui-levelring" data-eui-ring style="--v:.64"><b>24</b><small>SVY</small></div>
  <div class="eui-levelring eui-t-legendary" data-eui-ring style="--v:.85;--size:64px"><b>48</b></div>
</div>
```

## economy.effects — Etki simgeleri
Aktif buff/debuff'lar: simge, kalan süre (--v kalan oran), yığın sayısı. is-debuff kırmızı, is-expiring yanıp söner.
JS: `el.style.setProperty('--v', 0.4)`

```html
<div class="eui-effects">
  <div class="eui-effect" style="--v:.72"><i data-i="shield-f"></i><span class="eui-effect__time">0:43</span></div>
  <div class="eui-effect" style="--v:.4"><i data-i="run"></i><span class="eui-effect__time">0:18</span><span class="eui-effect__stack">2</span></div>
  <div class="eui-effect is-debuff" style="--v:.85"><i data-i="flame"></i><span class="eui-effect__time">0:06</span></div>
</div>
```

## economy.effect-line — Etki satırı
Simgesiz metin satırı: ad + süre. Ton çubuğu soldadır; simgeye yer olmayan dar alanlar için.
JS: `el.querySelector('b').textContent = '00:43'`

```html
<div class="eui-col eui-gap-2 eui-items-start">
  <div class="eui-effect-line eui-t-success"><span class="eui-kicker">Kalkan</span><b>00:43</b></div>
  <div class="eui-effect-line eui-t-accent"><span class="eui-kicker">Tonik etkisi</span><b>01:20</b></div>
</div>
```

## economy.streak — Seri / kombo
Sayı büyür, alttaki çubuk süre dolunca söner; 5 ve üstünde is-hot kırmızı. Sayıyı EUI.streak yönetir.
JS: `EUI.streak(el, 5, { hot: 5, decay: 6000 })`

```html
<div class="eui-panel eui-streak"><i data-i="streak"></i><span class="eui-streak__count">5</span><span class="eui-streak__label"><b>Öldürme serisi</b><span class="eui-sub">+%25 para</span></span><i class="eui-streak__decay"></i></div>
```
