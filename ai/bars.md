# Barlar
Can dışındaki bütün ilerleme/doluluk çubukları: boss ve elit, dalga, hedef, meydan okuma, XP, kanal/yeniden doldurma, ele geçirme, ipi çeken iki taraf, tehdit ölçeri, yükleme. Hepsi .mh-bar üzerine kurulur (stil sınıfları: --line --tip --skew --chevron --glass --stripe --shine --heat --ticks --frame); can çubukları için "Yaşam göstergeleri". Değer: MH.bar(el, v).

## bars.boss — Boss barı
Ekran üstü büyük bar: ad, aşama rozeti, iz (ghost), aşama çentikleri, ikinci kalkan barı. --w genişlik.
JS: `MH.bar(el.querySelector('.mh-bar'), 64)`

```html
<div class="mh-boss" style="--w:520px">
  <div class="mh-boss__head">
    <div class="mh-col mh-gap-1"><span class="mh-kicker mh-kicker--accent">Bölüm sonu</span><span class="mh-boss__name">Çete lideri — Vargas</span></div>
    <span class="mh-boss__phase"><span>Aşama 2 / 3</span><span class="mh-badge mh-t-danger mh-badge--dot mh-badge--live">Öfkeli</span></span>
  </div>
  <div class="mh-bar" data-v="64"><i class="mh-bar__ghost"></i><i class="mh-bar__fill"></i><span class="mh-boss__marks"><i style="left:33.3%"></i><i style="left:66.6%"></i></span></div>
  <div class="mh-bar mh-boss__shield" data-v="30"><i class="mh-bar__fill"></i></div>
</div>
```

## bars.wave — Dalga paneli
Hayatta kalma modu: dalga numarası, kalan düşman barı, sonraki dalga süresi.
JS: `MH.bar(el.querySelector('.mh-bar'), 62)`

```html
<div class="mh-wave">
  <div class="mh-wave__title"><span class="mh-kicker mh-kicker--accent">Hayatta kal</span><span class="mh-wave__num">Dalga 8</span></div>
  <div class="mh-bar mh-t-danger" data-v="62"><i class="mh-bar__fill"></i></div>
  <div class="mh-wave__meta"><span>Kalan düşman <b class="mh-num">14</b></span><span>Sonraki dalga 0:32</span></div>
</div>
```

## bars.goal — Hedef çubuğu
Bağış/beğeni hedefi: ikon, başlık, sayaç, bar ve ödül satırı. İlerleme için bar data-v. Barın altında eşik etiketleri için mh-goal__marks.
JS: `MH.bar(bar, 72)`

```html
<div class="mh-panel mh-goal" style="--w:420px"> <div class="mh-goal__head"><span class="mh-goal__icon"><i data-i="heart-f"></i></span><span class="mh-goal__title">Beğeni hedefi</span><span class="mh-goal__count"><span style="color:var(--mh-text)">72.400</span><span> / 100.000</span></span></div> <div class="mh-bar" data-v="72"><i class="mh-bar__fill"></i></div> <div class="mh-goal__reward"><i data-i="gift"></i>Ödül: <b style="color:var(--mh-text)">2× para</b> (5 dk)</div> </div>
```

## bars.challenge — Meydan okuma
Hedefli görev: başlık + sayaç, kilometre taşlı bar (mh-milestones içinde bar + konumlu i; on dolu), ödül sırası.
JS: `MH.bar(bar, v)`

```html
<div class="mh-panel mh-challenge" style="--w:420px"> <div class="mh-challenge__head"><i data-i="target"></i><b>100 öldürme</b><span class="mh-challenge__count">64<span> / 100</span></span></div>
<div class="mh-milestones"><div class="mh-bar mh-t-accent" data-v="64"><i class="mh-bar__fill"></i></div><i class="on" style="left:25%"></i><i class="on" style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></div>
<div class="mh-challenge__rewards"><span>25 · $500</span><span>50 · Zırh</span><span>75 · Boss</span><span>100 · 🏆</span></div> </div>
```

## bars.revive — Canlandırma
Düşen takım arkadaşını kaldırma ilerlemesi: başlık, bar, ipucu.
JS: `MH.bar(bar, v)`

```html
<div class="mh-revive"><b>MSK ayağa kaldırılıyor</b><div class="mh-bar mh-t-health" data-v="62"><i class="mh-bar__fill"></i></div><small>E basılı tut</small></div>
```

## bars.boss-slim — Boss barı (ince)
Tek satırlık boss: ad solda, aşama sağda, altında çentikli ince bar. Ekranın üstünde çok yer kaplamaz.
JS: `MH.bar(el.querySelector('.mh-bar'), 64)`

```html
<div class="mh-cast" style="--w:420px"><div class="mh-cast__head"><b>Vargas</b><small>Aşama 2 / 3</small></div><div class="mh-bar mh-bar--lg mh-bar--ticks mh-bar--tip mh-t-danger" data-v="64" style="--ticks:3"><i class="mh-bar__ghost"></i><i class="mh-bar__fill"></i></div></div>
```

## bars.boss-skew — Boss barı (eğik)
Aksiyon oyunu boss'u: eğik kalın bar içinde ad ve yüzde (__text). Hasar izi (__ghost) beyaz geri çekilir.
JS: `MH.bar(el, 64)`

```html
<div class="mh-bar mh-bar--xl mh-bar--skew mh-t-danger" data-v="64" style="width:480px"><i class="mh-bar__ghost"></i><i class="mh-bar__fill"></i><span class="mh-bar__text"><span>VARGAS</span><span>64%</span></span></div>
```

## bars.boss-duo — Çift boss
İki boss karşılıklı: biri soldan, biri sağdan (mh-bar--rtl) dolar; ortada VS. İki hedefli çatışma ve düello.
JS: `MH.bar(a, 70); MH.bar(b, 45)`

```html
<div class="mh-flex mh-gap-2" style="width:560px;align-items:center"><div class="mh-cast" style="flex:1;--w:auto"><div class="mh-cast__head"><b>Vargas</b></div><div class="mh-bar mh-bar--lg mh-bar--tip mh-t-danger" data-v="70"><i class="mh-bar__fill"></i></div></div><b class="mh-kicker">VS</b><div class="mh-cast" style="flex:1;--w:auto"><div class="mh-cast__head" style="flex-direction:row-reverse"><b>Dev Komutan</b></div><div class="mh-bar mh-bar--lg mh-bar--rtl mh-bar--tip mh-t-warn" data-v="45"><i class="mh-bar__fill"></i></div></div></div>
```

## bars.elite — Elit hedef barı
Küçük elit düşman için ad + ince kalkan barı; ekran kenarında çoklu sıralanır.
JS: `MH.bar(el, 55)`

```html
<div class="mh-col mh-gap-2" style="width:260px"><div class="mh-cast" style="--w:260px"><div class="mh-cast__head"><b>Keskin nişancı</b><small>Elit</small></div><div class="mh-bar mh-bar--md mh-bar--skew mh-t-warn" data-v="55"><i class="mh-bar__fill"></i></div></div><div class="mh-cast" style="--w:260px"><div class="mh-cast__head"><b>Ağır silahlı</b><small>Elit</small></div><div class="mh-bar mh-bar--md mh-bar--skew mh-t-warn" data-v="82"><i class="mh-bar__fill"></i></div></div></div>
```

## bars.stagger — Sersemletme / denge
Boss'u sersemletmek için dolan bar: dolunca hasar penceresi. Çerçeveli, vurgu renginde.
JS: `MH.bar(el, 70)`

```html
<div class="mh-cast" style="--w:300px"><div class="mh-cast__head"><b>Denge</b><small>70 / 100</small></div><div class="mh-bar mh-bar--frame mh-t-warn" data-v="70"><i class="mh-bar__fill"></i></div></div>
```

## bars.xp-bar — Deneyim çubuğu
İki ucunda seviye numarası olan ince XP çubuğu; altta kalan XP. Ekran altına yayılır.
JS: `MH.bar(el, 62)`

```html
<div style="width:520px" class="mh-col"><div class="mh-flex mh-gap-2" style="align-items:center"><span class="mh-badge mh-t-xp">24</span><div class="mh-bar mh-bar--md mh-bar--glass mh-bar--pill mh-t-xp" data-v="62" style="flex:1"><i class="mh-bar__fill"></i></div><span class="mh-badge">25</span></div><div class="mh-sub" style="text-align:center;font-size:11px">3.720 / 6.000 XP</div></div>
```

## bars.cast — Kanal / yeniden doldurma
Etiket + süre + bar: büyü kanalı, yeniden doldurma, eşya kullanma. İnce çizgi, ucu parlak.
JS: `MH.bar(el, 40)`

```html
<div class="mh-col mh-gap-3"><div class="mh-cast"><div class="mh-cast__head"><b>Silah dolduruluyor</b><small>0,8 sn</small></div><div class="mh-bar mh-bar--md mh-bar--tip mh-t-accent" data-v="40"><i class="mh-bar__fill"></i></div></div><div class="mh-cast"><div class="mh-cast__head"><b>İlk yardım</b><small>2,4 sn</small></div><div class="mh-bar mh-bar--md mh-bar--stripe mh-t-health" data-v="65"><i class="mh-bar__fill"></i></div></div></div>
```

## bars.capture — Ele geçirme ilerlemesi
Bölge ele geçirirken: bar ortadan iki yöne (mh-bar--center) takıma göre renk değiştirir. Etiketli, ortada nötr çizgi.
JS: `MH.bar(el, 70)`

```html
<div class="mh-cast" style="--w:320px"><div class="mh-cast__head"><b>Liman bölgesi</b><small>Mavi takım ele geçiriyor</small></div><div class="mh-bar mh-bar--lg mh-bar--center mh-t-team1" data-v="70"><i class="mh-bar__fill"></i></div></div>
```

## bars.tug — İpi çeken iki taraf
İki takım/oyuncunun payı tek barda: iki parça, orantı --a/--b (flex). Mavi–kırmızı kontrol, itibar, anket.
JS: `a.style.setProperty('--a', 60); b.style.setProperty('--a', 40)`

```html
<div class="mh-col mh-gap-1" style="width:300px"><div class="mh-flex" style="justify-content:space-between"><b class="mh-t-team1 mh-tone">Mavi 60%</b><b class="mh-t-team2 mh-tone">40% Kırmızı</b></div><div class="mh-tug"><i class="mh-t-team1" style="--a:60"></i><i class="mh-t-team2" style="--a:40"></i></div></div>
```

## bars.threat — Tehdit / aranma ölçeri
Sızma ve kaçış modunda tespit edilme: yeşilden kırmızıya geçişli bar (mh-bar--heat), ucu parlak, üstte durum yazısı.
JS: `MH.bar(el, 35)`

```html
<div class="mh-cast" style="--w:300px"><div class="mh-cast__head"><b>Şüphe</b><small>Fark edilmek üzere</small></div><div class="mh-bar mh-bar--md mh-bar--heat mh-bar--tip mh-t-success" data-v="35"><i class="mh-bar__fill"></i></div></div>
```

## bars.battery — Enerji / pil
Cihaz şarjı, jetpack, ekipman: cam hap bar + yüzde; düşünce is-critical yanıp söner.
JS: `MH.bar(el, 18, { critical: 25 })`

```html
<div class="mh-flex mh-gap-2" style="align-items:center;width:240px"><i class="mh-i" data-i="bolt"></i><div class="mh-bar mh-bar--lg mh-bar--pill mh-bar--glass mh-t-warn" data-v="18" data-critical="25" style="flex:1"><i class="mh-bar__fill"></i></div><b class="mh-num">18%</b></div>
```

## bars.steps — Adım ilerlemesi
Görev adımları ya da şarjör: mh-pips tall; dolu parçalar tonlu. data-pips=&quot;dolu/toplam&quot;.
JS: `MH.pips(el, 3, 5)`

```html
<div class="mh-col mh-gap-1" style="width:300px"><div class="mh-cast__head" style="display:flex;justify-content:space-between"><b>Soygun</b><small class="mh-sub">Adım 3 / 5</small></div><div class="mh-pips mh-pips--tall mh-t-accent" data-pips="3/5"></div></div>
```

## bars.download — Yükleme / indirme
Dosya, harita, güncelleme yüklerken: çapraz çizgili bar + durum + yüzde. is-critical yok; veri yükleyen ekranlar için.
JS: `MH.bar(el, 62)`

```html
<div class="mh-cast" style="--w:300px"><div class="mh-cast__head"><b>Haritalar yükleniyor</b><small>62%</small></div><div class="mh-bar mh-bar--md mh-bar--stripe mh-t-info" data-v="62"><i class="mh-bar__fill"></i></div></div>
```
