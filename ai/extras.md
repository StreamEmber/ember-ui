# Grafik ve ilerleme
Küçük grafikler, ilerleme çizgisi, seri, meydan okuma, etkinlik/maç satırı, başarı, hediye haritası.

## extras.donut — Halka grafik
Yüzde halkası: data-eui-ring + --v (0..1), ortada değer ve etiket. Ton eui-t-*.
JS: `EUI.ring(el, v)`

```html
<div class="eui-donut eui-t-success" data-eui-ring style="--v:.64"><div><b>%64</b><span>Galibiyet</span></div></div>
```

## extras.spark — Mini çizgi grafik
Boş div'e data-spark=&quot;1,3,2,5&quot; ver (data-w, data-h boyut); EUI.mount çizer. Kod: EUI.sparkline(el, [..]). Kutucuk içinde: eui-tile + eui-tile__spark; istatistik panosu eui-stats > eui-stats__tiles (kutucuklar) + eui-stats__grid içinde eui-box (+ eui-box__head başlık).
JS: `EUI.sparkline(el, values)`

```html
<div data-spark="4,7,5,9,6,12,10,15" data-w="200" data-h="48"></div>
```

## extras.hbars — Yatay çubuklar
Karşılaştırma: etiket + çubuk (scaleX 0..1) + değer; tone. Kod: EUI.bars(el, [{ label, value, icon, tone }]).
JS: `EUI.bars(el, rows)`

```html
<div class="eui-hbars" style="--w:320px">
<div class="eui-hbar eui-t-danger"><span class="eui-hbar__label">Tüfek</span><span class="eui-hbar__track"><i style="transform:scaleX(1)"></i></span><b>420</b></div>
<div class="eui-hbar eui-t-info"><span class="eui-hbar__label">Tabanca</span><span class="eui-hbar__track"><i style="transform:scaleX(.55)"></i></span><b>230</b></div>
<div class="eui-hbar eui-t-warn"><span class="eui-hbar__label">Bıçak</span><span class="eui-hbar__track"><i style="transform:scaleX(.2)"></i></span><b>84</b></div>
</div>
```

## extras.columns — Dikey sütunlar
Zaman serisi sütunları: yükseklik --h; her sütun scaleY 0..1 + alt etiket. Kod: EUI.columns(el, [{ label, value, tone }]).
JS: `EUI.columns(el, rows)`

```html
<div class="eui-columns" style="--h:120px">
<div class="eui-col-bar"><i style="transform:scaleY(.4)"></i><span>Pzt</span></div>
<div class="eui-col-bar"><i style="transform:scaleY(.7)"></i><span>Sal</span></div>
<div class="eui-col-bar eui-t-success"><i style="transform:scaleY(1)"></i><span>Çar</span></div>
<div class="eui-col-bar"><i style="transform:scaleY(.55)"></i><span>Per</span></div>
</div>
```

## extras.delta — Değişim oku
Yüzde değişim: is-up yeşil ▲, is-down kırmızı ▼.
JS: `el.classList.toggle('is-down')`

```html
<div class="eui-flex eui-gap-2"><span class="eui-delta is-up">▲ %12</span><span class="eui-delta is-down">▼ %4</span></div>
```

## extras.achieve — Başarı satırı
Küçük başarı kartı: ikon, ad, ilerleme yazısı, ton'lu bar.
JS: `—`

```html
<div class="eui-achieve" style="--w:260px"><i data-i="trophy"></i><b>Keskin nişancı</b><small>500 / 500</small><div class="eui-bar eui-t-gold" data-v="100"><i class="eui-bar__fill"></i></div></div>
```

## extras.event — Etkinlik satırı
Takvim etkinliği: tarih kutusu, ad + canlı rozet, meta (saat, kişi, ödül), katıl düğmesi. Canlıysa is-live. Birden çok satır eui-events içinde alt alta durur.
JS: `—`

```html
<div class="eui-event is-live"><div class="eui-event__date"><b>08</b><span>Eki</span></div><div class="eui-event__body"><div class="eui-flex eui-gap-2"><b>Konvoy baskını</b><span class="eui-badge eui-badge--dot eui-badge--live eui-t-danger">Canlı</span></div><div class="eui-event__meta"><span><i data-i="clock"></i>21:30 – 22:30</span><span><i data-i="users"></i>24 / 32</span></div></div><button class="eui-btn eui-btn--primary eui-btn--sm">Katıl</button></div>
```

## extras.match — Maç geçmişi satırı
Maç özeti: sonuç rozeti (eui-match__res: is-win yeşil, is-loss kırmızı, sınıfsız berabere), mod + harita + saat, Ö/A, MVP rozeti. Birden çok satır eui-matches içinde alt alta durur.
JS: `—`

```html
<div class="eui-match"><span class="eui-match__res is-win">G</span><div><b>Takım ölüm maçı</b> <small>· Vinewood · 14:32</small></div><b>24 / 6</b><span class="eui-badge eui-t-gold">MVP</span></div>
```

## extras.giftmap — Hediye haritası
Hediye → etki ızgarası: --cols sütun; öğe: sanat (emoji veya ikon), ad + jeton, etki. Nadirlik is-common/is-rare/is-epic.
JS: `el.style.setProperty('--cols', 3)`

```html
<div class="eui-giftmap" style="--cols:3;width:100%">
<div class="eui-giftmap__item is-common"><span class="eui-giftmap__art">🌹</span><b>Gül <small>1</small></b><span>1 düşman doğar</span></div>
<div class="eui-giftmap__item is-rare"><span class="eui-giftmap__art">🍩</span><b>Donut <small>30</small></b><span>+20 can</span></div>
<div class="eui-giftmap__item is-epic"><span class="eui-giftmap__art">🚀</span><b>Roket <small>1.000</small></b><span>Hava saldırısı</span></div>
</div>
```
