# Barlar
Can dışındaki bütün ilerleme/doluluk çubukları: boss ve elit, dalga, hedef, meydan okuma, XP, kanal/yeniden doldurma, ele geçirme, ipi çeken iki taraf, tehdit ölçeri, yükleme. Hepsi .eui-bar üzerine kurulur (stil sınıfları: --line --tip --skew --chevron --glass --stripe --shine --heat --ticks --frame); can çubukları için "Yaşam göstergeleri". Değer: EUI.bar(el, v).

## bars.boss — Boss barı
Ekran üstü büyük bar: ad, aşama rozeti, iz (ghost), aşama çentikleri, ikinci kalkan barı. --w genişlik.
JS: `EUI.bar(el.querySelector('.eui-bar'), 64)`

```html
<div class="eui-boss" style="--w:520px">
  <div class="eui-boss__head">
    <div class="eui-col eui-gap-1"><span class="eui-kicker eui-kicker--accent">Bölüm sonu</span><span class="eui-boss__name">Çete lideri — Vargas</span></div>
    <span class="eui-boss__phase"><span>Aşama 2 / 3</span><span class="eui-badge eui-t-danger eui-badge--dot eui-badge--live">Öfkeli</span></span>
  </div>
  <div class="eui-bar" data-v="64"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i><span class="eui-boss__marks"><i style="left:33.3%"></i><i style="left:66.6%"></i></span></div>
  <div class="eui-bar eui-boss__shield" data-v="30"><i class="eui-bar__fill"></i></div>
</div>
```

## bars.wave — Dalga paneli
Hayatta kalma modu: dalga numarası, kalan düşman barı, sonraki dalga süresi.
JS: `EUI.bar(el.querySelector('.eui-bar'), 62)`

```html
<div class="eui-wave">
  <div class="eui-wave__title"><span class="eui-kicker eui-kicker--accent">Hayatta kal</span><span class="eui-wave__num">Dalga 8</span></div>
  <div class="eui-bar eui-t-danger" data-v="62"><i class="eui-bar__fill"></i></div>
  <div class="eui-wave__meta"><span>Kalan düşman <b class="eui-num">14</b></span><span>Sonraki dalga 0:32</span></div>
</div>
```

## bars.goal — Hedef çubuğu
Bağış/beğeni hedefi: ikon, başlık, sayaç, bar ve ödül satırı. İlerleme için bar data-v. Barın altında eşik etiketleri için eui-goal__marks.
JS: `EUI.bar(bar, 72)`

```html
<div class="eui-panel eui-goal" style="--w:420px"> <div class="eui-goal__head"><span class="eui-goal__icon"><i data-i="heart-f"></i></span><span class="eui-goal__title">Beğeni hedefi</span><span class="eui-goal__count"><span style="color:var(--eui-text)">72.400</span><span> / 100.000</span></span></div> <div class="eui-bar" data-v="72"><i class="eui-bar__fill"></i></div> <div class="eui-goal__reward"><i data-i="gift"></i>Ödül: <b style="color:var(--eui-text)">2× para</b> (5 dk)</div> </div>
```

## bars.challenge — Meydan okuma
Hedefli görev: başlık + sayaç, kilometre taşlı bar (eui-milestones içinde bar + konumlu i; on dolu), ödül sırası.
JS: `EUI.bar(bar, v)`

```html
<div class="eui-panel eui-challenge" style="--w:420px"> <div class="eui-challenge__head"><i data-i="target"></i><b>100 öldürme</b><span class="eui-challenge__count">64<span> / 100</span></span></div>
<div class="eui-milestones"><div class="eui-bar eui-t-accent" data-v="64"><i class="eui-bar__fill"></i></div><i class="on" style="left:25%"></i><i class="on" style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></div>
<div class="eui-challenge__rewards"><span>25 · $500</span><span>50 · Zırh</span><span>75 · Boss</span><span>100 · 🏆</span></div> </div>
```

## bars.revive — Canlandırma
Düşen takım arkadaşını kaldırma ilerlemesi: başlık, bar, ipucu.
JS: `EUI.bar(bar, v)`

```html
<div class="eui-revive"><b>MSK ayağa kaldırılıyor</b><div class="eui-bar eui-t-health" data-v="62"><i class="eui-bar__fill"></i></div><small>E basılı tut</small></div>
```

## bars.boss-slim — Boss barı (ince)
Tek satırlık boss: ad solda, aşama sağda, altında çentikli ince bar. Ekranın üstünde çok yer kaplamaz.
JS: `EUI.bar(el.querySelector('.eui-bar'), 64)`

```html
<div class="eui-cast" style="--w:420px"><div class="eui-cast__head"><b>Vargas</b><small>Aşama 2 / 3</small></div><div class="eui-bar eui-bar--lg eui-bar--ticks eui-bar--tip eui-t-danger" data-v="64" style="--ticks:3"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i></div></div>
```

## bars.boss-skew — Boss barı (eğik)
Aksiyon oyunu boss'u: eğik kalın bar içinde ad ve yüzde (__text). Hasar izi (__ghost) beyaz geri çekilir.
JS: `EUI.bar(el, 64)`

```html
<div class="eui-bar eui-bar--xl eui-bar--skew eui-t-danger" data-v="64" style="width:480px"><i class="eui-bar__ghost"></i><i class="eui-bar__fill"></i><span class="eui-bar__text"><span>VARGAS</span><span>64%</span></span></div>
```

## bars.boss-duo — Çift boss
İki boss karşılıklı: biri soldan, biri sağdan (eui-bar--rtl) dolar; ortada VS. İki hedefli çatışma ve düello.
JS: `EUI.bar(a, 70); EUI.bar(b, 45)`

```html
<div class="eui-flex eui-gap-2" style="width:560px;align-items:center"><div class="eui-cast" style="flex:1;--w:auto"><div class="eui-cast__head"><b>Vargas</b></div><div class="eui-bar eui-bar--lg eui-bar--tip eui-t-danger" data-v="70"><i class="eui-bar__fill"></i></div></div><b class="eui-kicker">VS</b><div class="eui-cast" style="flex:1;--w:auto"><div class="eui-cast__head" style="flex-direction:row-reverse"><b>Dev Komutan</b></div><div class="eui-bar eui-bar--lg eui-bar--rtl eui-bar--tip eui-t-warn" data-v="45"><i class="eui-bar__fill"></i></div></div></div>
```

## bars.elite — Elit hedef barı
Küçük elit düşman için ad + ince kalkan barı; ekran kenarında çoklu sıralanır.
JS: `EUI.bar(el, 55)`

```html
<div class="eui-col eui-gap-2" style="width:260px"><div class="eui-cast" style="--w:260px"><div class="eui-cast__head"><b>Keskin nişancı</b><small>Elit</small></div><div class="eui-bar eui-bar--md eui-bar--skew eui-t-warn" data-v="55"><i class="eui-bar__fill"></i></div></div><div class="eui-cast" style="--w:260px"><div class="eui-cast__head"><b>Ağır silahlı</b><small>Elit</small></div><div class="eui-bar eui-bar--md eui-bar--skew eui-t-warn" data-v="82"><i class="eui-bar__fill"></i></div></div></div>
```

## bars.stagger — Sersemletme / denge
Boss'u sersemletmek için dolan bar: dolunca hasar penceresi. Çerçeveli, vurgu renginde.
JS: `EUI.bar(el, 70)`

```html
<div class="eui-cast" style="--w:300px"><div class="eui-cast__head"><b>Denge</b><small>70 / 100</small></div><div class="eui-bar eui-bar--frame eui-t-warn" data-v="70"><i class="eui-bar__fill"></i></div></div>
```

## bars.xp-bar — Deneyim çubuğu
İki ucunda seviye numarası olan ince XP çubuğu; altta kalan XP. Ekran altına yayılır.
JS: `EUI.bar(el, 62)`

```html
<div style="width:520px" class="eui-col"><div class="eui-flex eui-gap-2" style="align-items:center"><span class="eui-badge eui-t-xp">24</span><div class="eui-bar eui-bar--md eui-bar--glass eui-bar--pill eui-t-xp" data-v="62" style="flex:1"><i class="eui-bar__fill"></i></div><span class="eui-badge">25</span></div><div class="eui-sub" style="text-align:center;font-size:11px">3.720 / 6.000 XP</div></div>
```

## bars.cast — Kanal / yeniden doldurma
Etiket + süre + bar: büyü kanalı, yeniden doldurma, eşya kullanma. İnce çizgi, ucu parlak.
JS: `EUI.bar(el, 40)`

```html
<div class="eui-col eui-gap-3"><div class="eui-cast"><div class="eui-cast__head"><b>Silah dolduruluyor</b><small>0,8 sn</small></div><div class="eui-bar eui-bar--md eui-bar--tip eui-t-accent" data-v="40"><i class="eui-bar__fill"></i></div></div><div class="eui-cast"><div class="eui-cast__head"><b>İlk yardım</b><small>2,4 sn</small></div><div class="eui-bar eui-bar--md eui-bar--stripe eui-t-health" data-v="65"><i class="eui-bar__fill"></i></div></div></div>
```

## bars.capture — Ele geçirme ilerlemesi
Bölge ele geçirirken: bar ortadan iki yöne (eui-bar--center) takıma göre renk değiştirir. Etiketli, ortada nötr çizgi.
JS: `EUI.bar(el, 70)`

```html
<div class="eui-cast" style="--w:320px"><div class="eui-cast__head"><b>Liman bölgesi</b><small>Mavi takım ele geçiriyor</small></div><div class="eui-bar eui-bar--lg eui-bar--center eui-t-team1" data-v="70"><i class="eui-bar__fill"></i></div></div>
```

## bars.tug — İpi çeken iki taraf
İki takım/oyuncunun payı tek barda: iki parça, orantı --a/--b (flex). Mavi–kırmızı kontrol, itibar, anket.
JS: `a.style.setProperty('--a', 60); b.style.setProperty('--a', 40)`

```html
<div class="eui-col eui-gap-1" style="width:300px"><div class="eui-flex" style="justify-content:space-between"><b class="eui-t-team1 eui-tone">Mavi 60%</b><b class="eui-t-team2 eui-tone">40% Kırmızı</b></div><div class="eui-tug"><i class="eui-t-team1" style="--a:60"></i><i class="eui-t-team2" style="--a:40"></i></div></div>
```

## bars.threat — Tehdit / aranma ölçeri
Sızma ve kaçış modunda tespit edilme: yeşilden kırmızıya geçişli bar (eui-bar--heat), ucu parlak, üstte durum yazısı.
JS: `EUI.bar(el, 35)`

```html
<div class="eui-cast" style="--w:300px"><div class="eui-cast__head"><b>Şüphe</b><small>Fark edilmek üzere</small></div><div class="eui-bar eui-bar--md eui-bar--heat eui-bar--tip eui-t-success" data-v="35"><i class="eui-bar__fill"></i></div></div>
```

## bars.battery — Enerji / pil
Cihaz şarjı, jetpack, ekipman: cam hap bar + yüzde; düşünce is-critical yanıp söner.
JS: `EUI.bar(el, 18, { critical: 25 })`

```html
<div class="eui-flex eui-gap-2" style="align-items:center;width:240px"><i class="eui-i" data-i="bolt"></i><div class="eui-bar eui-bar--lg eui-bar--pill eui-bar--glass eui-t-warn" data-v="18" data-critical="25" style="flex:1"><i class="eui-bar__fill"></i></div><b class="eui-num">18%</b></div>
```

## bars.steps — Adım ilerlemesi
Görev adımları ya da şarjör: eui-pips tall; dolu parçalar tonlu. data-pips=&quot;dolu/toplam&quot;.
JS: `EUI.pips(el, 3, 5)`

```html
<div class="eui-col eui-gap-1" style="width:300px"><div class="eui-cast__head" style="display:flex;justify-content:space-between"><b>Soygun</b><small class="eui-sub">Adım 3 / 5</small></div><div class="eui-pips eui-pips--tall eui-t-accent" data-pips="3/5"></div></div>
```

## bars.download — Yükleme / indirme
Dosya, harita, güncelleme yüklerken: çapraz çizgili bar + durum + yüzde. is-critical yok; veri yükleyen ekranlar için.
JS: `EUI.bar(el, 62)`

```html
<div class="eui-cast" style="--w:300px"><div class="eui-cast__head"><b>Haritalar yükleniyor</b><small>62%</small></div><div class="eui-bar eui-bar--md eui-bar--stripe eui-t-info" data-v="62"><i class="eui-bar__fill"></i></div></div>
```
