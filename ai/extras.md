# Grafik ve ilerleme
Küçük grafikler, ilerleme çizgisi, seri, meydan okuma, etkinlik/maç satırı, başarı, hediye haritası.

## extras.donut — Halka grafik
Yüzde halkası: data-mh-ring + --v (0..1), ortada değer ve etiket. Ton mh-t-*.
JS: `MH.ring(el, v)`

```html
<div class="mh-donut mh-t-success" data-mh-ring style="--v:.64"><div><b>%64</b><span>Galibiyet</span></div></div>
```

## extras.spark — Mini çizgi grafik
Boş div'e data-spark=&quot;1,3,2,5&quot; ver (data-w, data-h boyut); MH.mount çizer. Kod: MH.sparkline(el, [..]). Kutucuk içinde: mh-tile + mh-tile__spark; istatistik panosu mh-stats > mh-stats__tiles (kutucuklar) + mh-stats__grid içinde mh-box (+ mh-box__head başlık).
JS: `MH.sparkline(el, values)`

```html
<div data-spark="4,7,5,9,6,12,10,15" data-w="200" data-h="48"></div>
```

## extras.hbars — Yatay çubuklar
Karşılaştırma: etiket + çubuk (scaleX 0..1) + değer; tone. Kod: MH.bars(el, [{ label, value, icon, tone }]).
JS: `MH.bars(el, rows)`

```html
<div class="mh-hbars" style="--w:320px">
<div class="mh-hbar mh-t-danger"><span class="mh-hbar__label">Tüfek</span><span class="mh-hbar__track"><i style="transform:scaleX(1)"></i></span><b>420</b></div>
<div class="mh-hbar mh-t-info"><span class="mh-hbar__label">Tabanca</span><span class="mh-hbar__track"><i style="transform:scaleX(.55)"></i></span><b>230</b></div>
<div class="mh-hbar mh-t-warn"><span class="mh-hbar__label">Bıçak</span><span class="mh-hbar__track"><i style="transform:scaleX(.2)"></i></span><b>84</b></div>
</div>
```

## extras.columns — Dikey sütunlar
Zaman serisi sütunları: yükseklik --h; her sütun scaleY 0..1 + alt etiket. Kod: MH.columns(el, [{ label, value, tone }]).
JS: `MH.columns(el, rows)`

```html
<div class="mh-columns" style="--h:120px">
<div class="mh-col-bar"><i style="transform:scaleY(.4)"></i><span>Pzt</span></div>
<div class="mh-col-bar"><i style="transform:scaleY(.7)"></i><span>Sal</span></div>
<div class="mh-col-bar mh-t-success"><i style="transform:scaleY(1)"></i><span>Çar</span></div>
<div class="mh-col-bar"><i style="transform:scaleY(.55)"></i><span>Per</span></div>
</div>
```

## extras.delta — Değişim oku
Yüzde değişim: is-up yeşil ▲, is-down kırmızı ▼.
JS: `el.classList.toggle('is-down')`

```html
<div class="mh-flex mh-gap-2"><span class="mh-delta is-up">▲ %12</span><span class="mh-delta is-down">▼ %4</span></div>
```

## extras.achieve — Başarı satırı
Küçük başarı kartı: ikon, ad, ilerleme yazısı, ton'lu bar.
JS: `—`

```html
<div class="mh-achieve" style="--w:260px"><i data-i="trophy"></i><b>Keskin nişancı</b><small>500 / 500</small><div class="mh-bar mh-t-gold" data-v="100"><i class="mh-bar__fill"></i></div></div>
```

## extras.event — Etkinlik satırı
Takvim etkinliği: tarih kutusu, ad + canlı rozet, meta (saat, kişi, ödül), katıl düğmesi. Canlıysa is-live. Birden çok satır mh-events içinde alt alta durur.
JS: `—`

```html
<div class="mh-event is-live"><div class="mh-event__date"><b>08</b><span>Eki</span></div><div class="mh-event__body"><div class="mh-flex mh-gap-2"><b>Konvoy baskını</b><span class="mh-badge mh-badge--dot mh-badge--live mh-t-danger">Canlı</span></div><div class="mh-event__meta"><span><i data-i="clock"></i>21:30 – 22:30</span><span><i data-i="users"></i>24 / 32</span></div></div><button class="mh-btn mh-btn--primary mh-btn--sm">Katıl</button></div>
```

## extras.match — Maç geçmişi satırı
Maç özeti: sonuç rozeti (mh-match__res: is-win yeşil, is-loss kırmızı, sınıfsız berabere), mod + harita + saat, Ö/A, MVP rozeti. Birden çok satır mh-matches içinde alt alta durur.
JS: `—`

```html
<div class="mh-match"><span class="mh-match__res is-win">G</span><div><b>Takım ölüm maçı</b> <small>· Vinewood · 14:32</small></div><b>24 / 6</b><span class="mh-badge mh-t-gold">MVP</span></div>
```

## extras.giftmap — Hediye haritası
Hediye → etki ızgarası: --cols sütun; öğe: sanat (emoji veya ikon), ad + jeton, etki. Nadirlik is-common/is-rare/is-epic.
JS: `el.style.setProperty('--cols', 3)`

```html
<div class="mh-giftmap" style="--cols:3;width:100%">
<div class="mh-giftmap__item is-common"><span class="mh-giftmap__art">🌹</span><b>Gül <small>1</small></b><span>1 düşman doğar</span></div>
<div class="mh-giftmap__item is-rare"><span class="mh-giftmap__art">🍩</span><b>Donut <small>30</small></b><span>+20 can</span></div>
<div class="mh-giftmap__item is-epic"><span class="mh-giftmap__art">🚀</span><b>Roket <small>1.000</small></b><span>Hava saldırısı</span></div>
</div>
```
