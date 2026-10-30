# Hayatta kalma ve mod
Dalga/sürü uyarısı, özel düşman, silah yuvaları, kurtarma sayacı, canlandırma, takım yaşam kartları, alan daralması, gün sayacı, izleyici modu.

## survival.horde — Sürü uyarısı
Ekran ortasında büyük başlık + alt satır + davul çubukları (__drums). Konumu absolute; .eui-screen içinde kullan.
JS: `—`

```html
<div style="position:relative;height:170px"><div class="eui-horde" style="top:0"><div class="eui-horde__drums"><i></i><i></i><i></i></div><b>Sürü geliyor</b><span>Barikatları hazırla</span></div></div>
```

## survival.infected — Özel düşman bildirimi
Özel düşman uyarısı: ikon, tür adı, ipucu.
JS: `—`

```html
<div class="eui-infected"><span class="eui-infected__icon"><i data-i="zombie"></i></span><div><span class="eui-kicker">Özel düşman</span><b>Hunter</b></div><small>Üstüne atlar</small></div>
```

## survival.loadout — Silah yuvaları
Hızlı yuva şeridi: tuş numarası, silah çizimi (data-weapon) veya ikon, alt sayaç. is-active seçili, is-empty boş.
JS: `slot.classList.toggle('is-active')`

```html
<div class="eui-loadout"> <div class="eui-loadout__slot is-active"><span class="eui-slot__key">1</span><i data-weapon="shotgun" class="eui-weapon-art"></i><small>8 / 56</small></div> <div class="eui-loadout__slot"><span class="eui-slot__key">2</span><i data-weapon="pistol" class="eui-weapon-art"></i><small>∞</small></div> <div class="eui-loadout__slot"><span class="eui-slot__key">3</span><i data-i="molotov"></i></div> <div class="eui-loadout__slot is-empty"><span class="eui-slot__key">4</span><i data-i="first-aid"></i></div> </div>
```

## survival.rescue — Kurtarma sayacı
Kurtarma/tahliye geri sayımı: ikon + etiket + süre.
JS: `el.querySelector('b').textContent = '01:30'`

```html
<div class="eui-panel eui-rescue"><span class="eui-rescue__icon"><i data-i="heli"></i></span><div><span class="eui-kicker">Kurtarma</span><b>01:30</b></div></div>
```

## survival.survivors — Takım yaşam kartları
Takım arkadaşları: avatar, ad, can sayısı, --hp (0..1) bar, --temp ikinci katman, eşya ikonları (is-empty kullanılmış). Kendi kartın is-self, düşük can is-low.
JS: `card.style.setProperty('--hp', .5)`

```html
<div class="eui-survivors"> <div class="eui-survivor is-self" style="--hp:.64;--temp:.12"><span class="eui-avatar">AR</span><div class="eui-survivor__top"><span class="eui-survivor__name">Amiral Router</span><span class="eui-survivor__hp">76</span></div><div class="eui-survivor__bar"><i class="hp"></i><i class="temp"></i></div><div class="eui-survivor__items"><i data-i="first-aid"></i><i data-i="pills" class="is-empty"></i><i data-i="molotov"></i></div></div>
<div class="eui-survivor is-low" style="--hp:.18"><span class="eui-avatar">RA</span><div class="eui-survivor__top"><span class="eui-survivor__name">RAPAFI</span><span class="eui-survivor__hp">18</span></div><div class="eui-survivor__bar"><i class="hp"></i><i class="temp"></i></div><div class="eui-survivor__items"><i data-i="first-aid" class="is-empty"></i><i data-i="pills"></i></div></div> </div>
```

## survival.zone — Daralan alan
Küçülen alan sayacı: halka + etiket + süre. Kod: EUI.zone(el, saniye).
JS: `EUI.zone(el, 60)`

```html
<div class="eui-panel eui-zone"><span class="eui-zone__ring" data-eui-ring style="--v:1"><i data-i="storm"></i></span><div><span class="eui-kicker">Alan daralıyor</span><div class="eui-zone__time">01:00</div></div></div>
```

## survival.daycount — Gün sayacı
Hayatta kalma gün sayacı: üst etiket + büyük sayı.
JS: `el.querySelector('b').textContent = 12`

```html
<div class="eui-daycount"><span>Gün</span><b>12</b></div>
```

## survival.spectate — İzleyici modu
Ölünce takım izleme çubuğu: Q/E tuşları, izlenen oyuncu, sıra.
JS: `—`

```html
<div class="eui-panel eui-spectate"><span class="eui-key">Q</span><div class="eui-spectate__who"><span class="eui-avatar eui-avatar--round">NM</span><div><span class="eui-kicker">İzleniyor · 2 / 5</span><b>NabeMedia</b></div></div><span class="eui-key">E</span></div>
```

## survival.loot — Ganimet düşmesi
Yere düşen eşya kartı: art alanı, nadirlik etiketi (__tier), ad, özellikler. Nadirlik is-rare/is-epic/is-legendary.
JS: `—`

```html
<div class="eui-loot is-rare"><div class="eui-loot__art"><i data-weapon="shotgun" class="eui-weapon-art"></i></div><div class="eui-loot__body"><span class="eui-loot__tier">Nadir</span><b>Pompalı tüfek</b><span>Hasar +12 · Atış hızı +8</span></div></div>
```

## survival.skillcheck — Beceri kontrolü
Dönen ibre başarı dilimine gelince SPACE. Promise: 'great' | 'good' | 'miss'.

```js
var host = document.createElement('div');
host.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:50';
(document.querySelector('.eui-screen') || document.body).appendChild(host);
EUI.skillCheck(host).then(function () { host.remove(); });
setTimeout(function () { host.remove(); }, 6000);
```

## survival.qte — Tuş dizisi (QTE)
Sıralı tuşlara bas; Promise true/false. Kod: EUI.qte(el, ['E','F','R']).

```js
var host = document.createElement('div');
host.style.cssText = 'position:fixed;left:50%;top:60%;transform:translate(-50%,-50%);z-index:50';
(document.querySelector('.eui-screen') || document.body).appendChild(host);
EUI.qte(host, ['E', 'F', 'R']).then(function () { host.remove(); });
setTimeout(function () { host.remove(); }, 6000);
```
