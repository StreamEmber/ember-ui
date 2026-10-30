# Konum ve yön
Pusula, minimap çerçevesi, sokak/bölge, yön çipi, koordinat, hedef işaretleri. Oyunun kendi haritası overlay'in altında çizilir; çerçeveler içi saydam bırakır.

## location.compass — Pusula şeridi
Üst orta kayan yön şeridi; hedefler şerit üstünde simge olarak durur. Yön harfleri Türkçe (K D G B), MH.cardinals() ile değişir.
JS: `MH.compass(el, 75, [{ bearing: 120, icon: 'pin-f', tone: 'accent' }])`

```html
<div class="mh-compass" data-heading="75" data-marks='[{"bearing":120,"icon":"pin-f","tone":"accent"},{"bearing":40,"icon":"flag-3","tone":"success"}]' style="--w:420px"></div>
```

## location.street — Sokak ve bölge
Yön harfi + sokak adı + bölge. Sol alt veya sağ alt köşe için; mh-location__dir yönü gösterir.
JS: `el.querySelector('.mh-location__dir').textContent = 'KB'`

```html
<div class="mh-location">
  <span class="mh-location__dir">KB</span><span class="mh-vrule"></span>
  <div><div class="mh-location__street">Mirror Park Bulvarı</div><div class="mh-location__zone">East Vinewood · Los Santos</div></div>
</div>
```

## location.heading — Yön çipi
Sadece yön harfi ve derece; en az yer kaplayan yön göstergesi.
JS: `el.querySelector('b').textContent = 'KB'`

```html
<div class="mh-heading"><b>KB</b><span>315°</span></div>
```

## location.coords — Koordinat
Geliştirici veya yayıncı için x / y / z satırı; sayılar tabular.
JS: `el.innerHTML = '<span>X<b>…</b></span>…'`

```html
<div class="mh-coords"><span>X<b>-1204.3</b></span><span>Y<b>3180.7</b></span><span>Z<b>41.2</b></span></div>
```

## location.minimap — Minimap çerçevesi
Dikdörtgen çerçeve, kuzey rozeti, alt bölge/saat şeridi. İçerik oyunun haritasıdır; --w ve --h boyut.
JS: `el.querySelector('.mh-minimap__zone span').textContent = 'Sandy Shores'`

```html
<div class="mh-minimap" style="--w:260px;--h:160px">
  <div class="mh-minimap__map"></div>
  <div class="mh-minimap__frame"></div><span class="mh-minimap__north">K</span>
  <div class="mh-minimap__zone"><span>Vinewood Tepeleri</span><span class="mh-num">21:14</span></div>
</div>
```

## location.minimap-round — Yuvarlak minimap
Daire çerçeve; bölge şeridi yok, --w ve --h eşit olmalı.

```html
<div class="mh-minimap mh-minimap--round" style="--w:170px;--h:170px">
  <div class="mh-minimap__map"></div>
  <div class="mh-minimap__frame"></div><span class="mh-minimap__north">K</span>
</div>
```

## location.marker — Dünya işaretçisi
Hedef üstü pin + etiket + mesafe. Ton mh-t-*; is-pulse dikkat çeker. Sürekli konumlandırma için MH.Markers(world).update(liste).
JS: `MH.Markers(world).update([{ x, y, icon: 'package', label: 'Teslimat', dist: 320, tone: 'danger', pulse: true }])`

```html
<div class="mh-flex mh-gap-5 mh-items-start">
  <div class="mh-marker is-pulse"><span class="mh-marker__label">Teslimat</span><span class="mh-marker__pin"><i data-i="package"></i></span><span class="mh-marker__dist">320 m</span></div>
  <div class="mh-marker mh-t-danger"><span class="mh-marker__label">Hedef</span><span class="mh-marker__pin"><i data-i="crosshair"></i></span><span class="mh-marker__dist">1,4 km</span></div>
  <div class="mh-marker mh-t-team1"><span class="mh-marker__pin"><i data-i="user"></i></span><span class="mh-marker__dist">48 m</span></div>
</div>
```

## location.marker-edge — Kenar işaretçisi
Ekran dışındaki hedef: pin kenarda, üstteki ok yönü gösterir (--a derece).
JS: `el.style.setProperty('--a', '50deg')`

```html
<div class="mh-marker mh-marker--edge mh-t-danger" style="--a:50deg;margin-top:18px"><span class="mh-marker__arrow"></span><span class="mh-marker__pin"><i data-i="crosshair"></i></span><span class="mh-marker__dist">1,4 km</span></div>
```

## location.wayarrow — Hedef oku
Büyük yönlendirme oku + mesafe (görev, teslimat). Ok --a derece döner (0 = yukarı), ton mh-t-*.
JS: `el.style.setProperty('--a', '40deg'); el.querySelector('b').textContent = '320 m'`

```html
<div class="mh-flex mh-gap-5 mh-items-start">
  <div class="mh-wayarrow" style="--a:40deg"><i></i><b>320 m</b></div>
  <div class="mh-wayarrow mh-t-danger" style="--a:-130deg"><i></i><b>1,4 km</b></div>
</div>
```
