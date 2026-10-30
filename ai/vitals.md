# Yaşam göstergeleri
Can, zırh, stamina, dayanıklılık gibi 0-100 arası değerler. data-v / data-pips / data-eui-ring ile EUI.mount() kurar; sonra EUI.bar / EUI.ring / EUI.core / EUI.pips ile güncellenir.

## vitals.bar — Bar
Tek değer: can, zırh, ilerleme. Boy eui-bar--xs|sm|md|lg|xl, renk eui-t-* tonu. data-critical eşiğin altında yanıp söner. Dolgu geçişi için eui-bar--grad.
JS: `EUI.bar(el, 82, { max: 100, critical: 25 })`

```html
<div class="eui-bar eui-bar--md eui-t-health" data-v="82" data-critical="25"><i class="eui-bar__fill"></i></div>
```

## vitals.bar-ghost — Hasar izli bar
Değer düşünce beyaz iz yavaşça kapanır. Oyuncu ve düşman can barı için.
JS: `EUI.bar(el, 40)`

```html
<div class="eui-bar eui-bar--lg eui-t-health" data-v="64"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div>
```

## vitals.bar-notch — Çentikli bar
Eşit bölmeli bar; --notch bölme sayısı. Boss ve sağlık dilimleri için.
JS: `EUI.bar(el, 60)`

```html
<div class="eui-bar eui-bar--lg eui-bar--notch eui-t-health" data-v="84" style="--notch:10"><i class="eui-bar__fill"></i></div>
```

## vitals.bar-vertical — Dikey bar
Ekran kenarına yaslı ince sütun. Yükseklik --len, kalınlık boy sınıfından.
JS: `EUI.bar(el, 70)`

```html
<div class="eui-flex eui-gap-2 eui-items-end">
  <div class="eui-bar eui-bar--v eui-bar--md eui-t-health" data-v="82" style="--len:90px"><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--v eui-bar--md eui-t-armor" data-v="55" style="--len:90px"><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--v eui-bar--md eui-t-stamina" data-v="70" style="--len:90px"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-line — Çizgi bar
2px ince çizgi + uçta parlak çentik (eui-bar--tip). Minimal, profesyonel HUD; yazı altına ya da üstüne konur.
JS: `EUI.bar(el, 72)`

```html
<div class="eui-col eui-gap-3" style="--w:300px;width:300px">
  <div class="eui-bar eui-bar--line eui-bar--tip eui-t-health" data-v="72"><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--line eui-bar--tip eui-t-armor" data-v="45"><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--line eui-bar--tip eui-t-stamina" data-v="90"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-line-meter — Etiketli çizgi
eui-meter içinde çizgi bar: üstte küçük etiket solda, değer sağda. Espor yayını sadeliği.
JS: `EUI.bar(el, 64); valueEl.textContent = 64`

```html
<div class="eui-col eui-gap-3" style="width:280px">
  <div class="eui-meter eui-t-health"><span class="eui-meter__label">CAN</span><span></span><span class="eui-meter__value">82</span><div class="eui-bar eui-bar--line eui-bar--tip" data-v="82"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-meter eui-t-armor"><span class="eui-meter__label">ZIRH</span><span></span><span class="eui-meter__value">40</span><div class="eui-bar eui-bar--line eui-bar--tip" data-v="40"><i class="eui-bar__fill"></i></div></div>
</div>
```

## vitals.bar-tip — Uç ışıklı bar
Herhangi bir bara eui-bar--tip eklenince dolgu ucunda beyaz parlak çizgi akar. Hasar izi (__ghost) ile iyi gider.
JS: `EUI.bar(el, 55)`

```html
<div class="eui-bar eui-bar--lg eui-bar--tip eui-t-health" data-v="68" style="width:300px"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div>
```

## vitals.bar-skew — Eğik bar
Paralelkenar bar (eui-bar--skew); __text ile değer barın içinde. Aksiyon/yarış HUD'u.
JS: `EUI.bar(el, 76); textEl.textContent = 76`

```html
<div class="eui-col eui-gap-2" style="width:300px">
  <div class="eui-bar eui-bar--xl eui-bar--skew eui-t-health" data-v="76"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i><span class="eui-bar__text"><span>CAN</span><span>76 / 100</span></span></div>
  <div class="eui-bar eui-bar--md eui-bar--skew eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-chevron — Ok uçlu bar
eui-bar--chevron eğik kesik uçlar, eui-bar--arrow sivri ok. Sci-fi / taktik görünüm.
JS: `EUI.bar(el, 60)`

```html
<div class="eui-col eui-gap-2" style="width:300px">
  <div class="eui-bar eui-bar--lg eui-bar--chevron eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--lg eui-bar--arrow eui-t-legendary" data-v="58"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-glass — Cam hap bar
Yuvarlak (eui-bar--pill) + cam parlaması (eui-bar--glass). Yumuşak, konsol oyunu havası.
JS: `EUI.bar(el, 70)`

```html
<div class="eui-col eui-gap-2" style="width:300px">
  <div class="eui-bar eui-bar--lg eui-bar--pill eui-bar--glass eui-t-health" data-v="74"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--md eui-bar--pill eui-bar--glass eui-t-oxygen" data-v="46"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-stripe — Dolan bar
Hareketli çapraz çizgiler (eui-bar--stripe): yenilenen can, şarj, yükleme. eui-bar--shine ise dolguda dönen ışık süpürmesi.
JS: `EUI.bar(el, 40)`

```html
<div class="eui-col eui-gap-2" style="width:300px">
  <div class="eui-bar eui-bar--lg eui-bar--stripe eui-t-health" data-v="42"><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--lg eui-bar--shine eui-t-gold" data-v="88"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-heat — Renk geçişli bar
eui-bar--heat: dolgu kırmızı→sarı→ton geçişli; değer düştükçe yalnız kırmızı kısım kalır.
JS: `EUI.bar(el, 30)`

```html
<div class="eui-bar eui-bar--lg eui-bar--heat eui-bar--tip eui-t-health" data-v="64" style="width:300px"><i class="eui-bar__fill"></i></div>
```

## vitals.bar-ticks — Ölçekli bar
İnce 1px bölme çizgileri (eui-bar--ticks, --ticks adet). Çentikli bardan daha zarif; 25'lik dilimler için --ticks:4.
JS: `EUI.bar(el, 70)`

```html
<div class="eui-col eui-gap-2" style="width:300px">
  <div class="eui-bar eui-bar--lg eui-bar--ticks eui-t-health" data-v="70" style="--ticks:20"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--md eui-bar--ticks eui-t-armor" data-v="75" style="--ticks:4"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-frame — Çerçeveli bar
eui-bar--frame: ton renkli ince kenarlık, içte boşluklu dolgu. eui-bar--bracket: iki uçta köşeli ayraç.
JS: `EUI.bar(el, 66)`

```html
<div class="eui-col eui-gap-3" style="width:300px">
  <div class="eui-bar eui-bar--frame eui-t-health" data-v="66"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--md eui-bar--bracket eui-t-accent" data-v="52"><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-center — Ortadan / sağdan dolan
eui-bar--center ortadan iki yana açılır (denge, gürültü, ısı). eui-bar--rtl sağdan dolar: karşı taraftaki rakip barı.
JS: `EUI.bar(el, 50)`

```html
<div class="eui-col eui-gap-2" style="width:300px">
  <div class="eui-bar eui-bar--md eui-bar--center eui-t-warn" data-v="46"><i class="eui-bar__fill"></i></div>
  <div class="eui-flex eui-gap-2"><div class="eui-bar eui-bar--lg eui-bar--tip eui-t-team1" data-v="70"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-bar--lg eui-bar--rtl eui-bar--tip eui-t-team2" data-v="55"><i class="eui-bar__fill"></i></div></div>
</div>
```

## vitals.bar-layers — Kalkan ve iyileşme katmanı
__over aşırı kalkanı çizgili katman olarak gösterir (--o 0..1); __gain iyileşme önizlemesi (transform: scaleX). Tek barda can + ek koruma.
JS: `EUI.bar(el, 60); over.style.setProperty('--o', .3); gain.style.transform = 'scaleX(.85)'`

```html
<div class="eui-col eui-gap-2" style="width:300px">
  <div class="eui-bar eui-bar--lg eui-t-health" data-v="90"><i class="eui-bar__fill"></i><i class="eui-bar__over" style="--o:.3"></i></div>
  <div class="eui-bar eui-bar--lg eui-t-health" data-v="55"><i class="eui-bar__gain" style="transform:scaleX(.85)"></i><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.bar-duo — Can + ince zırh çizgisi
Kalın can barı, hemen üstünde 3px zırh çizgisi. İki değeri tek blokta gösterir.
JS: `EUI.bar(hp, 80); EUI.bar(armor, 35)`

```html
<div class="eui-col eui-gap-1" style="width:300px">
  <div class="eui-bar eui-bar--xs eui-t-armor" data-v="35"><i class="eui-bar__fill"></i></div>
  <div class="eui-bar eui-bar--lg eui-bar--tip eui-t-health" data-v="80"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.strip — Şerit
Tek satır: ton kenarlı koyu şerit, ikon + bar + sayı. Alt alta dizilir. is-low kritik uyarı. İçine her bar stilini koyabilirsin.
JS: `EUI.bar(bar, 82); el.querySelector('b').textContent = 82`

```html
<div class="eui-col eui-gap-1">
  <div class="eui-strip eui-t-health"><i data-i="heart"></i><div class="eui-bar eui-bar--md eui-bar--tip" data-v="82"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div><b>82</b></div>
  <div class="eui-strip eui-t-armor"><i data-i="shield"></i><div class="eui-bar eui-bar--md eui-bar--ticks" data-v="50" style="--ticks:4"><i class="eui-bar__fill"></i></div><b>50</b></div>
  <div class="eui-strip eui-t-stamina is-low"><i data-i="run"></i><div class="eui-bar eui-bar--md" data-v="18"><i class="eui-bar__fill"></i></div><b>18</b></div>
</div>
```

## vitals.strip-skew — Eğik şerit
eui-strip--skew: şerit eğik, içerik düz kalır. Etiket için small. Yarış ve aksiyon modları.
JS: `EUI.bar(bar, v)`

```html
<div class="eui-col eui-gap-1" style="padding-left:8px">
  <div class="eui-strip eui-strip--skew eui-t-health" style="--w:300px"><small>HP</small><div class="eui-bar eui-bar--lg eui-bar--glass" data-v="76"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div><b>76</b></div>
  <div class="eui-strip eui-strip--skew eui-t-special" style="--w:300px"><small>NOS</small><div class="eui-bar eui-bar--lg eui-bar--stripe" data-v="40"><i class="eui-bar__fill"></i></div><b>40</b></div>
</div>
```

## vitals.plate — Büyük sayılı plaka
Büyük sayı + küçük etiket üstte, altta çizgi bar. Profesyonel/espor görünümü. Sayı yanına small ile /max.
JS: `EUI.bar(bar, 87); valEl.firstChild.textContent = 87`

```html
<div class="eui-flex eui-gap-5">
  <div class="eui-plate eui-t-health" style="--w:200px"><i data-i="heart"></i><span class="eui-plate__label">Can</span><b class="eui-plate__val">87<small>/100</small></b><div class="eui-bar eui-bar--line eui-bar--tip" data-v="87"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-plate eui-t-armor" style="--w:200px"><i data-i="shield"></i><span class="eui-plate__label">Zırh</span><b class="eui-plate__val">45</b><div class="eui-bar eui-bar--sm eui-bar--ticks" data-v="45" style="--ticks:4"><i class="eui-bar__fill"></i></div></div>
</div>
```

## vitals.plate-plates — Plaka + zırh parçaları
Battle royale tarzı: üstte zırh plakaları (eui-pips data-pips), altta can barı ve büyük sayı.
JS: `EUI.pips(pips, 2); EUI.bar(bar, 100)`

```html
<div class="eui-plate eui-t-health" style="--w:280px"><span class="eui-plate__label">Wraith</span><span></span><b class="eui-plate__val">100</b>
  <div class="eui-pips eui-pips--tall eui-t-armor" data-pips="2/3"></div>
  <div class="eui-bar eui-bar--md eui-bar--skew eui-bar--tip" data-v="100"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div>
</div>
```

## vitals.vital-row — İkonlu satır
İkon + bar + sayı tek satırda. is-low sınıfı satırı kırmızıya çevirir.
JS: `EUI.bar(el, 82, { critical: 25 })`

```html
<div class="eui-vitals" style="--w:280px">
  <div class="eui-vital eui-t-health"><i data-i="heart"></i><div class="eui-bar" data-v="82" data-critical="25"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div><b class="eui-vital__val">82</b></div>
</div>
```

## vitals.vital-stack — Can / zırh / stamina yığını
Üç ikonlu satır alt alta. eui-vitals__pair iki sütunlu satır verir. İki değeri yan yana koymak için iki eui-vital eui-vitals__pair içinde.
JS: `EUI.bar(el, value)`

```html
<div class="eui-vitals" style="--w:280px">
  <div class="eui-vital eui-t-health"><i data-i="heart"></i><div class="eui-bar" data-v="82"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div><b class="eui-vital__val">82</b></div>
  <div class="eui-vital eui-t-armor"><i data-i="shield"></i><div class="eui-bar" data-v="40"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div><b class="eui-vital__val">40</b></div>
  <div class="eui-vital eui-t-stamina"><i data-i="run"></i><div class="eui-bar" data-v="68"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div><b class="eui-vital__val">68</b></div>
</div>
```

## vitals.vital-slim — Kompakt yığın
İkon ve sayı gizli, yalnız ince barlar. Az yer kaplayan GTA tarzı HUD.
JS: `EUI.bar(el, value)`

```html
<div class="eui-vitals eui-vitals--slim" style="--w:220px">
  <div class="eui-vital eui-t-health"><div class="eui-bar" data-v="82"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-vital eui-t-armor"><div class="eui-bar" data-v="40"><i class="eui-bar__fill"></i></div></div>
</div>
```

## vitals.hpbig — Büyük can
Yayında öne çıkan sayılı büyük can barı; --w genişlik.
JS: `EUI.bar(el, 82)`

```html
<div class="eui-hpbig" style="--w:280px"><div class="eui-hpbig__head"><i data-i="heart"></i><b>82</b><span>/ 100</span></div><div class="eui-bar eui-t-health" data-v="82"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div></div>
```

## vitals.meter — Etiketli ölçer
Sol etiket, sağ değer, altında bar. Menü ve karakter ekranlarında.
JS: `EUI.bar(el, 64)`

```html
<div class="eui-meter eui-t-warn" style="width:260px"><span class="eui-meter__label">Dayanıklılık</span><span></span><span class="eui-meter__value">64 / 100</span><div class="eui-bar" data-v="64"><i class="eui-bar__fill"></i></div></div>
```

## vitals.ring — Değerli halka
Halkanın ortasında sayı. Dar yerde tek değer (stamina, oksijen). Boyut CSS width/height ile.
JS: `EUI.ring(el, 0.82)`

```html
<div class="eui-flex eui-gap-3">
  <div class="eui-ringval eui-t-health" data-eui-ring style="--v:.82"><b>82</b></div>
  <div class="eui-ringval eui-t-stamina" data-eui-ring style="--v:.55"><b>55</b></div>
  <div class="eui-ringval eui-t-oxygen" data-eui-ring style="--v:.3"><b>30</b></div>
</div>
```

## vitals.core — Çekirdek
RDR2 tarzı: dış halka anlık değer, iç dolgu çekirdek. is-low kalp atışı, is-boosted altın. Büyük boy eui-core--lg.
JS: `EUI.core(el, { value: 82, core: 70, low: 25, boosted: false })`

```html
<div class="eui-cores">
  <div class="eui-core eui-t-health" data-eui-ring style="--v:.82;--core:.7"><span class="eui-core__fill"></span><i data-i="heart"></i></div>
  <div class="eui-core eui-t-stamina" data-eui-ring style="--v:.55;--core:1"><span class="eui-core__fill"></span><i data-i="run"></i></div>
  <div class="eui-core eui-t-special is-boosted" data-eui-ring style="--v:1;--core:.4"><span class="eui-core__fill"></span><i data-i="eye"></i></div>
  <div class="eui-core eui-core--sm eui-t-health is-low" data-eui-ring style="--v:.14;--core:.2"><span class="eui-core__fill"></span><i data-i="heart"></i></div>
</div>
```

## vitals.pips — Segmentler
Sayılabilir parçalar: şarjör, can dilimi, kombo. data-pips=açık/toplam; eui-pips--tall yüksek.
JS: `EUI.pips(el, 7, 10)`

```html
<div class="eui-pips eui-pips--tall eui-t-danger" data-pips="7/10" style="width:200px"></div>
```

## vitals.hearts — Kalpler
Az sayıda can hakkı (3-10). Aynı data-pips API'si, kalp şeklinde.
JS: `EUI.pips(el, 3, 5)`

```html
<div class="eui-pips eui-pips--hearts" data-pips="3/5"></div>
```

## vitals.needs — İhtiyaç halkaları
Açlık, susuzluk, stres gibi yavaş değişen ihtiyaçlar: ikonlu küçük halkalar (--v 0..1). Tonlar eui-t-hunger, eui-t-thirst, eui-t-stress, eui-t-oxygen; düşükse is-low. eui-needs--vertical alt alta dizer.
JS: `EUI.ring(el.querySelector('.eui-need'), .62)`

```html
<div class="eui-flex eui-gap-4">
  <div class="eui-needs">
    <div class="eui-need eui-t-hunger" data-eui-ring style="--v:.62"><i data-i="meat"></i></div>
    <div class="eui-need eui-t-thirst" data-eui-ring style="--v:.35"><i data-i="droplet"></i></div>
    <div class="eui-need eui-t-stress is-low" data-eui-ring style="--v:.18"><i data-i="brain"></i></div>
  </div>
  <div class="eui-needs eui-needs--vertical">
    <div class="eui-need eui-t-hunger" data-eui-ring style="--v:.8"><i data-i="meat"></i></div>
    <div class="eui-need eui-t-thirst" data-eui-ring style="--v:.5"><i data-i="droplet"></i></div>
  </div>
</div>
```
