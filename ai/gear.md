# Ekipman
Silah ve cephane, yuva şeridi, envanter ızgarası, teçhizat ve kıyafet yuvaları, silah bakımı, mermi türleri, karşılaştırma. Ekip üyeleri için "Ekip" ailesine, satın alma için "Mağaza" ailesine bak.

## gear.weapon — Silah paneli
Sağ alt köşe: silah adı, çizimi, şarjör/yedek, şarjör segmentleri, yan eşyalar. is-low şarjör kırmızı, is-reloading soluk.
JS: `EUI.pips(el.querySelector('.eui-pips'), 24, 30); el.querySelector('.eui-weapon__clip').textContent = 24`

```html
<div class="eui-weapon">
  <div class="eui-weapon__name"><span class="eui-weapon__reload eui-hidden">Şarjör değişiyor</span><span class="eui-badge">Otomatik</span><span class="eui-kicker">Karabina tüfeği</span></div>
  <div class="eui-weapon__main">
    <i data-weapon="carbine" class="eui-weapon__art"></i>
    <div class="eui-weapon__ammo"><span class="eui-weapon__clip">24</span><span class="eui-weapon__reserve">/ 180</span></div>
  </div>
  <div class="eui-pips" data-pips="24/30" style="gap:2px"></div>
  <div class="eui-weapon__extra"><span><i data-i="grenade"></i>3</span><span><i data-i="first-aid"></i>2</span><span><i data-i="bullets"></i>Zırh delici</span></div>
</div>
```

## gear.ammo — Mermi sayacı
Silah çizimi olmadan yalnız şarjör / yedek. is-low şarjörü kırmızıya çevirir.
JS: `el.querySelector('b').textContent = 24`

```html
<div class="eui-flex eui-gap-5">
  <div class="eui-ammo"><b>24</b><span>/ 180</span></div>
  <div class="eui-ammo is-low"><b>3</b><span>/ 12</span></div>
</div>
```

## gear.hotbar — Yuva şeridi
Numaralı hızlı yuvalar: is-active seçili, is-cooldown (--cd oran) bekleme, is-empty boş; sayı ve dayanıklılık çubuğu isteğe bağlı. Dayanıklılık: yuvanın içine eui-slot__durability > i (--v yüzde).
JS: `el.children[0].classList.add('is-active')`

```html
<div class="eui-hotbar">
  <div class="eui-slot is-active"><span class="eui-slot__key">1</span><i data-i="rifle"></i><span class="eui-slot__count">24</span></div>
  <div class="eui-slot"><span class="eui-slot__key">2</span><i data-i="pistol"></i><span class="eui-slot__count">12</span></div>
  <div class="eui-slot"><span class="eui-slot__key">3</span><i data-i="knife"></i></div>
  <div class="eui-slot is-cooldown" style="--cd:.6"><span class="eui-slot__key">4</span><i data-i="grenade"></i><span class="eui-slot__count">3</span></div>
  <div class="eui-slot is-empty"><span class="eui-slot__key">5</span><i data-i="box"></i></div>
</div>
```

## gear.inventory — Envanter ızgarası
Eşya hücreleri; --cols sütun sayısı. Nadirlik is-rare|is-epic|is-legendary, seçili is-active.

```html
<div class="eui-inv" style="--cols:6;width:300px">
  <div class="eui-cell is-active"><span class="eui-cell__key">1</span><i data-i="rifle"></i><span class="eui-cell__count">1</span></div>
  <div class="eui-cell is-rare"><span class="eui-cell__key">2</span><i data-i="pistol"></i><span class="eui-cell__count">1</span></div>
  <div class="eui-cell"><span class="eui-cell__key">3</span><i data-i="knife"></i></div>
  <div class="eui-cell is-epic"><span class="eui-cell__key">4</span><i data-i="grenade"></i><span class="eui-cell__count">4</span></div>
  <div class="eui-cell"><i data-i="bullets"></i><span class="eui-cell__count">180</span></div>
  <div class="eui-cell is-legendary"><i data-i="diamond"></i><span class="eui-cell__count">2</span></div>
</div>
```

## gear.loadout-slots — Teçhizat yuvaları
Kare görsel alanlı yuvalar: etiket (Birincil, İkincil…) + ad. --cols sütun, --ratio görsel oranı (silah için 16/9 iyi). is-active seçili, is-empty boş (kesik çerçeve). Görsel alanına ikon, data-weapon ya da img konur.
JS: `el.querySelectorAll('.eui-gearslot')[1].classList.add('is-active')`

```html
<div class="eui-gearslots" style="--cols:4;width:440px">
  <div class="eui-gearslot is-active"><div class="eui-gearslot__art" style="--ratio:16/10"><i data-weapon="repeater"></i></div><span>Birincil</span><b>Lancaster tüfek</b></div>
  <div class="eui-gearslot"><div class="eui-gearslot__art" style="--ratio:16/10"><i data-weapon="revolver"></i></div><span>İkincil</span><b>Cattleman</b></div>
  <div class="eui-gearslot"><div class="eui-gearslot__art" style="--ratio:16/10"><i data-i="knife"></i></div><span>Yakın</span><b>Av bıçağı</b></div>
  <div class="eui-gearslot is-empty"><div class="eui-gearslot__art" style="--ratio:16/10"><i data-i="dynamite"></i></div><span>Atılabilir</span><b>Boş</b></div>
</div>
```

## gear.outfit — Kıyafet ve binek yuvaları
Kare yuvalar: şapka, ceket, çanta, eyer gibi giyilen/takılan parçalar. Aynı .eui-gearslot; --cols ile 2x2 ya da tek sıra.
JS: `—`

```html
<div class="eui-gearslots" style="--cols:4;width:360px">
  <div class="eui-gearslot"><div class="eui-gearslot__art"><i data-i="hat"></i></div><span>Şapka</span><b>Kovboy</b></div>
  <div class="eui-gearslot"><div class="eui-gearslot__art"><i data-i="shield"></i></div><span>Yelek</span><b>Deri yelek</b></div>
  <div class="eui-gearslot"><div class="eui-gearslot__art"><i data-i="backpack"></i></div><span>Çanta</span><b>Heybe</b></div>
  <div class="eui-gearslot is-empty"><div class="eui-gearslot__art"><i data-i="horseshoe"></i></div><span>Eyer</span><b>Yok</b></div>
</div>
```

## gear.condition — Silah bakımı
Silah durumu (kir/aşınma) barı: ikon, ad, yüzde; düşükse ton eui-t-warn / eui-t-danger. RDR2 tarzı temizlik hatırlatması için.
JS: `EUI.bar(el.querySelector('.eui-bar'), 42)`

```html
<div class="eui-col eui-gap-3">
  <div class="eui-condition"><i data-i="wrench"></i><b>Lancaster tüfek</b><small>%86</small><div class="eui-bar eui-t-success" data-v="86"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-condition"><i data-i="wrench"></i><b>Cattleman · kirli</b><small>%34</small><div class="eui-bar eui-t-warn" data-v="34"><i class="eui-bar__fill"></i></div></div>
</div>
```

## gear.ammo-types — Mermi türleri
Mermi türü seçici: satır başına ikon, ad, adet. is-active seçili, is-empty tükenmiş.
JS: `el.children[1].classList.add('is-active')`

```html
<div class="eui-ammotypes">
  <div class="eui-ammotype is-active"><i data-i="bullets"></i><span>Normal</span><small>142</small></div>
  <div class="eui-ammotype"><i data-i="bolt"></i><span>Hızlı</span><small>36</small></div>
  <div class="eui-ammotype"><i data-i="flame"></i><span>Ateşli</span><small>12</small></div>
  <div class="eui-ammotype is-empty"><i data-i="poison"></i><span>Zehirli</span><small>0</small></div>
</div>
```

## gear.compare — Silah karşılaştırma
Satın almadan önce kuşanılı silahla fark: eui-statline; artış için .eui-bar__gain (--g yeni değer oranı) yeşil gösterilir.
JS: `—`

```html
<div class="eui-statlines" style="width:300px">
  <div class="eui-statline"><span class="eui-kicker">Hasar</span><div class="eui-bar" data-v="58"><i class="eui-bar__gain" style="--g:.74"></i><i class="eui-bar__fill"></i></div><b>74</b></div>
  <div class="eui-statline"><span class="eui-kicker">Menzil</span><div class="eui-bar" data-v="62"><i class="eui-bar__gain" style="--g:.81"></i><i class="eui-bar__fill"></i></div><b>81</b></div>
  <div class="eui-statline"><span class="eui-kicker">Atış hızı</span><div class="eui-bar" data-v="44"><i class="eui-bar__fill"></i></div><b>44</b></div>
  <div class="eui-statline"><span class="eui-kicker">Doldurma</span><div class="eui-bar" data-v="38"><i class="eui-bar__fill"></i></div><b>38</b></div>
</div>
```
