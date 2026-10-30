# Ekip
Yapay zekâ ekibi ya da oyuncu takımı: üye kartı, kompakt satır, alt şerit kutucukları, durum rozetleri, emir çubuğu, binek durumu, üye ayrıntısı, ekip tablosu, işaretli hedefler, ekip halkaları, ses ve bağlantı. Portreler karedir (.eui-portrait); halka içinde avatar yuvarlaklaşır.

## crew.portrait — Portre
Kare portre alanı: harf, ikon (rol) ya da img. --s boyut; ton eui-t-team1..5 ya da eui-t-*. Köşe rozeti .eui-portrait__badge (binek, lider…). Halka içine konmaz; can için yanına bar koy. Boy: eui-portrait--lg, eui-portrait--xl.
JS: `—`

```html
<div class="eui-flex eui-gap-2">
  <span class="eui-portrait eui-t-team1">AR</span>
  <span class="eui-portrait eui-t-team2"><i data-i="medic"></i><span class="eui-portrait__badge"><i data-i="horse"></i></span></span>
  <span class="eui-portrait eui-t-team3" style="--s:56px"><i data-i="cowboy"></i><span class="eui-portrait__badge"><i data-i="crown-f"></i></span></span>
  <span class="eui-portrait eui-t-danger" style="--s:32px"><i data-i="outlaw"></i></span>
</div>
```

## crew.card — Üye kartı
Ayrıntılı ekip üyesi: kare portre, ad, rol rozeti, can barı + sayı, elindeki silah ve mermi, binek (at/araç; yoksa .is-off), mesafe. Durumlar: is-selected, is-attacking, is-down (portre nabız atar), is-dead.
JS: `EUI.bar(el.querySelector('.eui-bar'), 72)`

```html
<div class="eui-col eui-gap-2">
  <div class="eui-crewcard eui-t-team1 is-selected">
    <span class="eui-portrait"><i data-i="sniper"></i><span class="eui-portrait__badge"><i data-i="horse"></i></span></span>
    <div class="eui-crewcard__main">
      <div class="eui-crewcard__head"><b>Javier Escuella</b><span class="eui-badge eui-t-info">Keskin nişancı</span></div>
      <div class="eui-crewcard__hp"><div class="eui-bar eui-t-health" data-v="72"><i class="eui-bar__fill"></i></div><span>360 / 500</span></div>
      <div class="eui-crewcard__gear"><span><i data-weapon="sniper"></i>24</span><span><i data-i="horse"></i>Boaz · atta</span><span><i data-i="distance"></i>18 m</span></div>
    </div>
  </div>
  <div class="eui-crewcard eui-t-team1 is-down">
    <span class="eui-portrait"><i data-i="fist"></i></span>
    <div class="eui-crewcard__main">
      <div class="eui-crewcard__head"><b>Bill Williamson</b><span class="eui-badge eui-badge--dot eui-badge--live eui-t-danger">Yerde</span></div>
      <div class="eui-crewcard__hp"><div class="eui-bar eui-t-danger" data-v="8"><i class="eui-bar__fill"></i></div><span>40 / 500</span></div>
      <div class="eui-crewcard__gear"><span><i data-i="fist"></i>Yumruk</span><span class="is-off"><i data-i="horse"></i>Yaya</span><span><i data-i="distance"></i>42 m</span></div>
    </div>
  </div>
</div>
```

## crew.row — Kompakt ekip satırı
HUD kenar listesi (.eui-crewlist içinde): küçük kare portre, ad, ikonlar (silah, binek is-on, mesafe), ince can barı. Durumlar is-attacking (kırmızı kenar), is-down, is-dead.
JS: `EUI.bar(el.querySelector('.eui-bar'), 54)`

```html
<div class="eui-crewlist">
  <div class="eui-crewrow eui-t-team1"><span class="eui-portrait"><i data-i="medic"></i></span><span class="eui-crewrow__name">Sadie Adler</span><span class="eui-crewrow__icons"><i data-i="revolver"></i><i data-i="horse" class="is-on"></i>12m</span><div class="eui-bar eui-t-health" data-v="92"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-crewrow eui-t-team1 is-attacking"><span class="eui-portrait"><i data-i="rifle"></i></span><span class="eui-crewrow__name">Charles Smith</span><span class="eui-crewrow__icons"><i data-i="crosshair" class="is-on"></i><i data-i="horse"></i>30m</span><div class="eui-bar eui-t-health" data-v="54"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-crewrow eui-t-team1 is-down"><span class="eui-portrait"><i data-i="knife"></i></span><span class="eui-crewrow__name">Micah Bell · yerde</span><span class="eui-crewrow__icons"><i data-i="heartbeat" class="is-on"></i>8m</span><div class="eui-bar eui-t-danger" data-v="10"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-crewrow eui-t-team1 is-dead"><span class="eui-portrait"><i data-i="skull"></i></span><span class="eui-crewrow__name">Kieran Duffy</span><span class="eui-crewrow__icons">—</span><div class="eui-bar" data-v="0"><i class="eui-bar__fill"></i></div></div>
</div>
```

## crew.tiles — Ekip kutucukları
Alt şerit: kare portre + altında can barı + kısa ad. --s kutucuk genişliği. Yerde/ölü için portre içine .eui-crewtile__state (ikon) konur; binek için .eui-portrait__badge.
JS: `EUI.bar(el.querySelector('.eui-bar'), 40)`

```html
<div class="eui-crewtiles">
  <div class="eui-crewtile eui-t-team1"><span class="eui-portrait"><i data-i="medic"></i><span class="eui-portrait__badge"><i data-i="horse"></i></span></span><div class="eui-bar eui-t-health" data-v="88"><i class="eui-bar__fill"></i></div><small>Sadie</small></div>
  <div class="eui-crewtile eui-t-team1"><span class="eui-portrait"><i data-i="sniper"></i></span><div class="eui-bar eui-t-health" data-v="61"><i class="eui-bar__fill"></i></div><small>Javier</small></div>
  <div class="eui-crewtile eui-t-team1 is-down"><span class="eui-portrait"><i data-i="fist"></i><span class="eui-crewtile__state"><i data-i="heartbeat"></i></span></span><div class="eui-bar eui-t-danger" data-v="9"><i class="eui-bar__fill"></i></div><small>Bill</small></div>
  <div class="eui-crewtile eui-t-team1 is-dead"><span class="eui-portrait"><i data-i="knife"></i><span class="eui-crewtile__state"><i data-i="skull"></i></span></span><div class="eui-bar" data-v="0"><i class="eui-bar__fill"></i></div><small>Kieran</small></div>
</div>
```

## crew.states — Durum rozetleri
Üye durumunu tek bakışta: takip, saldırı, bekleme, yaralı, yerde (canlı nokta), atta / araçta, işaretli hedef. .eui-badge + ton + isteğe bağlı ikon.
JS: `—`

```html
<div class="eui-flex eui-gap-1" style="flex-wrap:wrap;max-width:420px">
  <span class="eui-badge eui-t-info"><i data-i="route"></i>Takip ediyor</span>
  <span class="eui-badge eui-t-danger"><i data-i="crosshair"></i>Saldırıyor</span>
  <span class="eui-badge eui-t-warn"><i data-i="hourglass"></i>Bekliyor</span>
  <span class="eui-badge eui-t-warn"><i data-i="bandage"></i>Yaralı</span>
  <span class="eui-badge eui-badge--dot eui-badge--live eui-t-danger">Yerde</span>
  <span class="eui-badge eui-t-success"><i data-i="horse"></i>Atta</span>
  <span class="eui-badge eui-t-success"><i data-i="car"></i>Araçta</span>
  <span class="eui-badge eui-t-enemy"><i data-i="target"></i>Hedef işaretli</span>
</div>
```

## crew.orders — Emir çubuğu
Ekibe verilen emir: düğme başına tuş + ikon + ad; geçerli emir is-active, saldırı emri is-danger ile kırmızı vurgulanır.
JS: `el.querySelector('.eui-order').classList.add('is-active')`

```html
<div class="eui-orders">
  <button class="eui-order is-active"><span class="eui-key eui-key--sm">1</span><i data-i="route"></i>Takip et</button>
  <button class="eui-order"><span class="eui-key eui-key--sm">2</span><i data-i="hand"></i>Bekle</button>
  <button class="eui-order is-danger"><span class="eui-key eui-key--sm">H</span><i data-i="crosshair"></i>Saldır</button>
  <button class="eui-order"><span class="eui-key eui-key--sm">4</span><i data-i="horse"></i>Atlara bin</button>
</div>
```

## crew.mount — Binek durumu
At ya da araç: ikon, ad, durum (Binmiş/Yaya/Ahırda), can ve dayanıklılık barları. Binek yoksa is-off.
JS: `EUI.bar(el.querySelector('.eui-bar'), 66)`

```html
<div class="eui-col eui-gap-2">
  <div class="eui-mount"><i data-i="horse"></i><b>Boaz · Mustang</b><small>Binmiş</small><div class="eui-bar eui-t-health" data-v="82"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-stamina" data-v="46"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-mount"><i data-i="car-sport"></i><b>Elegy RH8</b><small>Hasarlı</small><div class="eui-bar eui-t-warn" data-v="38"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-info" data-v="70"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-mount is-off"><i data-i="horse"></i><b>Binek yok</b><small>Yaya</small></div>
</div>
```

## crew.detail — Üye ayrıntısı
Detay paneli (menü sağ sütunu): büyük kare portre (.eui-portrait--xl), ad + rol, can/doğruluk/cesaret satırları (eui-statline), teçhizat yuvaları (eui-gearslots), günlük ücret, eylemler.
JS: `EUI.mount(root)`

```html
<div class="eui-col eui-gap-3" style="width:300px">
  <span class="eui-portrait eui-portrait--xl eui-t-team1" style="max-height:170px;aspect-ratio:16/10"><i data-i="sniper"></i></span>
  <div><div class="eui-title eui-title--lg">Javier Escuella</div><div class="eui-sub">Keskin nişancı · ekipte 3 gün</div></div>
  <div class="eui-statlines">
    <div class="eui-statline"><span class="eui-kicker">Can</span><div class="eui-bar eui-t-health" data-v="72"><i class="eui-bar__fill"></i></div><b>360</b></div>
    <div class="eui-statline"><span class="eui-kicker">Doğruluk</span><div class="eui-bar" data-v="88"><i class="eui-bar__fill"></i></div><b>88</b></div>
    <div class="eui-statline"><span class="eui-kicker">Cesaret</span><div class="eui-bar" data-v="64"><i class="eui-bar__fill"></i></div><b>64</b></div>
  </div>
  <div class="eui-gearslots" style="--cols:3"><div class="eui-gearslot"><div class="eui-gearslot__art"><i data-weapon="sniper"></i></div><span>Silah</span><b>Rolling Block</b></div><div class="eui-gearslot"><div class="eui-gearslot__art"><i data-weapon="revolver"></i></div><span>Yan</span><b>Schofield</b></div><div class="eui-gearslot"><div class="eui-gearslot__art"><i data-i="horse"></i></div><span>Binek</span><b>Boaz</b></div></div>
  <div class="eui-flex eui-gap-2"><button class="eui-btn eui-btn--primary eui-grow"><i data-i="horse"></i>Ata bindir</button><button class="eui-btn eui-btn--tone eui-t-danger"><i data-i="user-minus"></i>Kov</button></div>
</div>
```

## crew.roster — Ekip tablosu
Menüdeki 'Ekibim' listesi: eui-table satırında kare portre + ad, rol, can (ince bar + sayı), silah, binek, durum rozeti. Seçili satır is-self.
JS: `EUI.mount(root)`

```html
<table class="eui-table" style="width:620px">
  <thead><tr><th>Üye</th><th>Rol</th><th>Can</th><th>Silah</th><th>Binek</th><th class="r">Durum</th></tr></thead>
  <tbody>
    <tr class="is-self"><td><div class="eui-flex eui-gap-2"><span class="eui-portrait eui-t-team1" style="--s:28px"><i data-i="medic"></i></span>Sadie Adler</div></td><td>Sağlıkçı</td><td><div class="eui-flex eui-gap-2"><div class="eui-bar eui-t-health" data-v="92" style="width:70px"><i class="eui-bar__fill"></i></div><span class="eui-num">460</span></div></td><td><i data-i="revolver"></i></td><td><i data-i="horse"></i></td><td class="r"><span class="eui-badge eui-t-info">Takipte</span></td></tr>
    <tr><td><div class="eui-flex eui-gap-2"><span class="eui-portrait eui-t-team1" style="--s:28px"><i data-i="rifle"></i></span>Charles Smith</div></td><td>Atlı tüfekçi</td><td><div class="eui-flex eui-gap-2"><div class="eui-bar eui-t-health" data-v="54" style="width:70px"><i class="eui-bar__fill"></i></div><span class="eui-num">270</span></div></td><td><i data-i="rifle"></i></td><td><i data-i="horse"></i></td><td class="r"><span class="eui-badge eui-t-danger">Saldırıyor</span></td></tr>
    <tr><td><div class="eui-flex eui-gap-2"><span class="eui-portrait eui-t-team1" style="--s:28px"><i data-i="fist"></i></span>Bill Williamson</div></td><td>Yumrukçu</td><td><div class="eui-flex eui-gap-2"><div class="eui-bar eui-t-danger" data-v="8" style="width:70px"><i class="eui-bar__fill"></i></div><span class="eui-num">40</span></div></td><td><i data-i="fist"></i></td><td>—</td><td class="r"><span class="eui-badge eui-badge--dot eui-badge--live eui-t-danger">Yerde</span></td></tr>
  </tbody>
</table>
```

## crew.targets — İşaretli hedefler
Ekibin saldıracağı işaretli kişiler: kompakt satır (eui-crewrow) düşman tonuyla (eui-t-enemy), hedef ikonu, mesafe; başlıkta sayı ve tuş ipuçları.
JS: `—`

```html
<div class="eui-crewlist" style="--w:240px">
  <div class="eui-flex eui-between" style="padding:0 2px 2px"><span class="eui-kicker">İşaretli · 2</span><span class="eui-hint"><span class="eui-key eui-key--sm">H</span>Saldır</span></div>
  <div class="eui-crewrow eui-t-enemy"><span class="eui-portrait"><i data-i="target"></i></span><span class="eui-crewrow__name">O'Driscoll haydut</span><span class="eui-crewrow__icons"><i data-i="revolver"></i>46m</span><div class="eui-bar eui-t-enemy" data-v="100"><i class="eui-bar__fill"></i></div></div>
  <div class="eui-crewrow eui-t-enemy"><span class="eui-portrait"><i data-i="target"></i></span><span class="eui-crewrow__name">Lemoyne akıncısı</span><span class="eui-crewrow__icons"><i data-i="horse" class="is-on"></i>71m</span><div class="eui-bar eui-t-enemy" data-v="64"><i class="eui-bar__fill"></i></div></div>
</div>
```

## crew.party — Ekip kartları
Sol kenar ekip listesi: avatar, ad, mesafe, can/zırh ince barları. is-talking konuşuyor, is-down yerde, is-dead ölü.
JS: `EUI.bar(el.querySelector('.eui-bar'), 54)`

```html
<div class="eui-party">
  <div class="eui-member is-talking">
    <span class="eui-avatar eui-avatar--sm eui-t-team1">N</span>
    <div class="eui-member__name"><i data-i="crown-f" class="eui-tone eui-t-warn"></i><span>NabeMedia</span></div>
    <span class="eui-member__dist">24 m</span>
    <div class="eui-member__bars"><div class="eui-bar eui-t-health" data-v="86"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="40"><i class="eui-bar__fill"></i></div></div>
  </div>
  <div class="eui-member is-down">
    <span class="eui-avatar eui-avatar--sm eui-t-team2">S</span>
    <div class="eui-member__name"><i data-i="heartbeat"></i><span>Serkan_TV · yerde</span></div>
    <span class="eui-member__dist">12 m</span>
    <div class="eui-member__bars"><div class="eui-bar eui-t-danger" data-v="12"><i class="eui-bar__fill"></i></div></div>
  </div>
</div>
```

## crew.squad-rings — Ekip halkaları
Yan yana avatarlar, çevresinde can halkası. Çok oyunculu ekipte en az yer tutan gösterim.
JS: `EUI.ring(el, 0.8)`

```html
<div class="eui-flex eui-gap-2">
  <div class="eui-ringval eui-t-health" data-eui-ring style="--v:.86;width:40px;height:40px"><span class="eui-avatar eui-avatar--sm eui-t-team1">N</span></div>
  <div class="eui-ringval eui-t-health" data-eui-ring style="--v:.54;width:40px;height:40px"><span class="eui-avatar eui-avatar--sm eui-t-team2">M</span></div>
  <div class="eui-ringval eui-t-danger" data-eui-ring style="--v:.12;width:40px;height:40px"><span class="eui-avatar eui-avatar--sm eui-t-team3">S</span></div>
</div>
```

## crew.voice — Ses
Ses menzili çubukları (is-talking konuşurken yeşil) ve konuşanlar listesi; is-radio telsiz.
JS: `el.classList.toggle('is-talking')`

```html
<div class="eui-col eui-gap-2 eui-items-start">
  <div class="eui-voice-range is-talking"><span class="eui-voice-range__bars"><i class="on"></i><i class="on"></i><i></i></span><span>Normal</span><span class="eui-eq"><i></i><i></i><i></i><i></i></span></div>
  <div class="eui-voice">
    <div class="eui-speaker"><i data-i="mic-f"></i>NabeMedia<span class="eui-eq"><i></i><i></i><i></i><i></i></span></div>
    <div class="eui-speaker is-radio"><i data-i="broadcast"></i>MSK · Telsiz 1</div>
  </div>
</div>
```

## crew.ping — Bağlantı kalitesi
4 çubuklu ping göstergesi: iyi (varsayılan), is-mid orta, is-bad kötü.
JS: `el.classList.add('is-bad')`

```html
<div class="eui-flex eui-gap-4"><span class="eui-ping"><i></i><i></i><i></i><i></i></span><span class="eui-ping is-mid"><i></i><i></i><i></i><i></i></span><span class="eui-ping is-bad"><i></i><i></i><i></i><i></i></span></div>
```

## crew.teamhead — Takım başlığı
Skor tablosu takım başlığı: ad + büyük sayı; ton eui-t-team1..5.
JS: `el.querySelector('strong').textContent = 3`

```html
<div class="eui-teamhead eui-t-team1" style="width:240px"><b>Mavi takım</b><strong>3</strong></div>
```
