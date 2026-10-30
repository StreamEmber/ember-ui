# Araç ve binek
Hız kadranı, kompakt hız, yakıt/motor ölçerleri, gösterge lambaları, halka ölçer ve at (binek) paneli.

## vehicle.speedo — Hız kadranı
Dairesel kadran: hız yayı, son %15 kırmızı bölge, ince devir yayı, vites, lambalar. data-speed (zorunlu), data-max (240), data-rpm (0-1), data-gear ile MH.mount kurar.
JS: `MH.speedo(el, { speed: 148, max: 240, rpm: 0.62, gear: 4 })`

```html
<div class="mh-speedo" data-speed="148" data-max="240" data-rpm=".62" data-gear="4">
  <svg class="mh-speedo__dial" viewBox="0 0 240 240"></svg>
  <div class="mh-speedo__center"><span class="mh-speedo__value">0</span><span class="mh-speedo__unit">KM/S</span><span class="mh-speedo__gear">1</span></div>
  <div class="mh-speedo__lamps"><span class="mh-lamp on"><i data-i="user-shield"></i></span><span class="mh-lamp is-warn"><i data-i="engine"></i></span><span class="mh-lamp"><i data-i="gauge"></i></span></div>
</div>
```

## vehicle.speed-mini — Kompakt hız
Büyük sayı + vites + devir segmentleri; son üç segment kırmızıya döner. Motosiklet ve tekne için.
JS: `el.querySelector('.mh-speed-mini__value').textContent = 87; MH.pips(el.querySelector('.mh-pips'), 11, 14)`

```html
<div class="mh-speed-mini">
  <span class="mh-speed-mini__value">87</span>
  <div class="mh-speed-mini__side">
    <span class="mh-speedo__gear" style="margin:0;width:26px;height:26px;font-size:15px">3</span>
    <span class="mh-speed-mini__unit">KM/S</span>
    <div class="mh-pips mh-t-success" data-pips="11/14"></div>
  </div>
</div>
```

## vehicle.gauges — Yakıt ve motor ölçerleri
İkon + ince bar satırları (yakıt, motor, nitro). data-critical altında is-low ve kırmızı yanıp sönme.
JS: `MH.bar(el.querySelector('.mh-bar'), 64, { critical: 15 })`

```html
<div class="mh-gauges" style="width:200px">
  <div class="mh-gauge"><i data-i="gas"></i><div class="mh-bar mh-t-warn" data-v="64" data-critical="15"><i class="mh-bar__fill"></i></div></div>
  <div class="mh-gauge"><i data-i="engine"></i><div class="mh-bar mh-t-success" data-v="88" data-critical="25"><i class="mh-bar__fill"></i></div></div>
  <div class="mh-gauge"><i data-i="flame"></i><div class="mh-bar mh-t-info" data-v="40"><i class="mh-bar__fill"></i></div></div>
</div>
```

## vehicle.fuel-ring — Halka ölçer
Ortasında ikon olan halka: yakıt, pil, nitro. Dar yer için gauges yerine.
JS: `MH.ring(el, 0.64)`

```html
<div class="mh-flex mh-gap-3">
  <div class="mh-ringval mh-t-warn" data-mh-ring style="--v:.64"><i data-i="gas"></i></div>
  <div class="mh-ringval mh-t-success" data-mh-ring style="--v:.92"><i data-i="battery"></i></div>
  <div class="mh-ringval mh-t-info" data-mh-ring style="--v:.4"><i data-i="flame"></i></div>
</div>
```

## vehicle.lamps — Gösterge lambaları
Emniyet kemeri, far, kilit, arıza: on yanık, is-warn kırmızı yanıp söner; ton --tone-rgb ile.
JS: `el.classList.toggle('on')`

```html
<div class="mh-flex mh-gap-2">
  <span class="mh-lamp on"><i data-i="user-shield"></i></span>
  <span class="mh-lamp on" style="--tone-rgb:var(--mh-info-rgb)"><i data-i="sun"></i></span>
  <span class="mh-lamp"><i data-i="lock"></i></span>
  <span class="mh-lamp is-warn"><i data-i="engine"></i></span>
</div>
```
