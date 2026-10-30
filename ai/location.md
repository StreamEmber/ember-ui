# Konum ve yön
Pusula, minimap çerçevesi, sokak/bölge, yön çipi, koordinat, hedef işaretleri. Oyunun kendi haritası overlay'in altında çizilir; çerçeveler içi saydam bırakır.

## location.compass — Pusula şeridi
Üst orta kayan yön şeridi; hedefler şerit üstünde simge olarak durur. Yön harfleri Türkçe (K D G B), EUI.cardinals() ile değişir.
JS: `EUI.compass(el, 75, [{ bearing: 120, icon: 'pin-f', tone: 'accent' }])`

```html
<div class="eui-compass" data-heading="75" data-marks='[{"bearing":120,"icon":"pin-f","tone":"accent"},{"bearing":40,"icon":"flag-3","tone":"success"}]' style="--w:420px"></div>
```

## location.street — Sokak ve bölge
Yön harfi + sokak adı + bölge. Sol alt veya sağ alt köşe için; eui-location__dir yönü gösterir.
JS: `el.querySelector('.eui-location__dir').textContent = 'KB'`

```html
<div class="eui-location">
  <span class="eui-location__dir">KB</span><span class="eui-vrule"></span>
  <div><div class="eui-location__street">Mirror Park Bulvarı</div><div class="eui-location__zone">East Vinewood · Los Santos</div></div>
</div>
```

## location.heading — Yön çipi
Sadece yön harfi ve derece; en az yer kaplayan yön göstergesi.
JS: `el.querySelector('b').textContent = 'KB'`

```html
<div class="eui-heading"><b>KB</b><span>315°</span></div>
```

## location.coords — Koordinat
Geliştirici veya yayıncı için x / y / z satırı; sayılar tabular.
JS: `el.innerHTML = '<span>X<b>…</b></span>…'`

```html
<div class="eui-coords"><span>X<b>-1204.3</b></span><span>Y<b>3180.7</b></span><span>Z<b>41.2</b></span></div>
```

## location.minimap — Minimap çerçevesi
Dikdörtgen çerçeve, kuzey rozeti, alt bölge/saat şeridi. İçerik oyunun haritasıdır; --w ve --h boyut.
JS: `el.querySelector('.eui-minimap__zone span').textContent = 'Sandy Shores'`

```html
<div class="eui-minimap" style="--w:260px;--h:160px">
  <div class="eui-minimap__map"></div>
  <div class="eui-minimap__frame"></div><span class="eui-minimap__north">K</span>
  <div class="eui-minimap__zone"><span>Vinewood Tepeleri</span><span class="eui-num">21:14</span></div>
</div>
```

## location.minimap-round — Yuvarlak minimap
Daire çerçeve; bölge şeridi yok, --w ve --h eşit olmalı.

```html
<div class="eui-minimap eui-minimap--round" style="--w:170px;--h:170px">
  <div class="eui-minimap__map"></div>
  <div class="eui-minimap__frame"></div><span class="eui-minimap__north">K</span>
</div>
```

## location.marker — Dünya işaretçisi
Hedef üstü pin + etiket + mesafe. Ton eui-t-*; is-pulse dikkat çeker. Sürekli konumlandırma için EUI.Markers(world).update(liste).
JS: `EUI.Markers(world).update([{ x, y, icon: 'package', label: 'Teslimat', dist: 320, tone: 'danger', pulse: true }])`

```html
<div class="eui-flex eui-gap-5 eui-items-start">
  <div class="eui-marker is-pulse"><span class="eui-marker__label">Teslimat</span><span class="eui-marker__pin"><i data-i="package"></i></span><span class="eui-marker__dist">320 m</span></div>
  <div class="eui-marker eui-t-danger"><span class="eui-marker__label">Hedef</span><span class="eui-marker__pin"><i data-i="crosshair"></i></span><span class="eui-marker__dist">1,4 km</span></div>
  <div class="eui-marker eui-t-team1"><span class="eui-marker__pin"><i data-i="user"></i></span><span class="eui-marker__dist">48 m</span></div>
</div>
```

## location.marker-edge — Kenar işaretçisi
Ekran dışındaki hedef: pin kenarda, üstteki ok yönü gösterir (--a derece).
JS: `el.style.setProperty('--a', '50deg')`

```html
<div class="eui-marker eui-marker--edge eui-t-danger" style="--a:50deg;margin-top:18px"><span class="eui-marker__arrow"></span><span class="eui-marker__pin"><i data-i="crosshair"></i></span><span class="eui-marker__dist">1,4 km</span></div>
```

## location.wayarrow — Hedef oku
Büyük yönlendirme oku + mesafe (görev, teslimat). Ok --a derece döner (0 = yukarı), ton eui-t-*.
JS: `el.style.setProperty('--a', '40deg'); el.querySelector('b').textContent = '320 m'`

```html
<div class="eui-flex eui-gap-5 eui-items-start">
  <div class="eui-wayarrow" style="--a:40deg"><i></i><b>320 m</b></div>
  <div class="eui-wayarrow eui-t-danger" style="--a:-130deg"><i></i><b>1,4 km</b></div>
</div>
```
