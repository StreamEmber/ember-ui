# Savaş ve dünya
Nişangâh, vuruş geri bildirimi, hedef kilidi, tur skoru, nokta ele geçirme, etkileşim istemleri, diyalog. Dünya içi parçalar EUI.Markers havuzuyla konumlanır; oyuncu etiketleri için "İsim etiketleri" ailesine bak.

## combat.crosshair — Nişangâh
Dört biçim: artı (varsayılan), --dot, --circle, --t. Durum: is-target düşman üstünde, is-friend dost üstünde. --gap açıklığı, --c rengi ayarlar.
JS: `el.classList.toggle('is-target')`

```html
<div class="eui-flex eui-gap-4">
  <div class="eui-crosshair"><i></i><i></i><i></i><i></i><b></b></div>
  <div class="eui-crosshair eui-crosshair--dot"><i></i><i></i><i></i><i></i><b></b></div>
  <div class="eui-crosshair eui-crosshair--circle is-target"><i></i><i></i><i></i><i></i><b></b></div>
  <div class="eui-crosshair eui-crosshair--t is-friend"><i></i><i></i><i></i><i></i><b></b></div>
</div>
```

## combat.hit — Vuruş işareti
İsabette nişangâhta kısa X: kind boş normal, 'head' kafa, 'kill' öldürme. Hedef verilmezse .eui-screen.

```js
EUI.hit(null, 'head');
```

## combat.damage-from — Hasar yönü
Ekran kenarında hasarın geldiği yönü gösteren yay: 0 önden, 90 sağdan, 180 arkadan (derece). Kısa süre sonra kendiliğinden söner.

```js
EUI.damageFrom(null, 120);
```

## combat.flash — Ekran parlaması
Tüm ekran flaş: ikinci argüman true ise kırmızı (hasar), değilse beyaz (patlama).

```js
EUI.flash(null, true);
```

## combat.lockon — Hedef kilidi
Köşeli hedef çerçevesi; is-locking kilitlenirken daralır. Dünya konumuna yerleştirilir.
JS: `el.classList.add('is-locking')`

```html
<div class="eui-lockon is-locking"><i></i><i></i><i></i><i></i></div>
```

## combat.world-prompt — Dünya istemi
Nesne üstü etkileşim: nokta + tuş + eylem; uzaktayken is-far sadece nokta. Pozisyon world içinde absolute.
JS: `el.classList.toggle('is-far')`

```html
<div class="eui-wprompt"><span class="eui-wprompt__dot"></span><div class="eui-wprompt__card"><span class="eui-key">E</span>Sandığı aç</div></div>
```

## combat.prompt — Tuş istemleri
Sağ alt köşe eylem listesi: tuş + açıklama; is-disabled soluk. small durumu yazar.
JS: `el.querySelector('small').textContent = 'Takılı'`

```html
<div class="eui-prompt">
  <div class="eui-prompt__row"><span class="eui-key">F</span>Araçtan in</div>
  <div class="eui-prompt__row"><span class="eui-key">B</span>Emniyet kemeri<small>Takılı</small></div>
</div>
```

## combat.hold — Basılı tut halkası
Tuşa basılı tutunca dolan halka (kilit açma, kurtarma). EUI.hold start()/stop() döner, onDone tamamlanınca çağrılır.
JS: `var h = EUI.hold(el, { duration: 1500, onDone() {} }); h.start()`

```html
<div class="eui-hold" data-eui-ring><span class="eui-key eui-key--lg">E</span></div>
```

## combat.enemies — Düşman sayacı
Ekranda ve kuyrukta kaç düşman var + doluluk barı; sınıra yaklaşınca is-swarm kırmızı parlar.
JS: `EUI.enemies(el, { onScreen: 14, queued: 37, max: 20 })`

```html
<div class="eui-panel eui-enemy">
  <div class="eui-enemy__part is-on"><i data-i="enemy"></i><div><b data-k="on">14</b><span>Ekranda</span></div></div>
  <div class="eui-enemy__part is-queue"><i data-i="hourglass"></i><div><b data-k="queued">37</b><span>Kuyrukta</span></div></div>
  <div class="eui-bar eui-t-danger" data-v="70"><i class="eui-bar__fill"></i></div>
</div>
```

## combat.versus — Takım skoru
İki takımın skoru, hayatta kalan noktaları (off = ölü) ve ortada tur/süre. EUI.timer(el, saniye, { urgent, onEnd }) süreyi sürer.
JS: `EUI.timer(el.querySelector('.eui-timer'), 84, { urgent: 10 })`

```html
<div class="eui-versus">
  <div class="eui-versus__team eui-t-team1"><div class="eui-versus__name"><b>Mavi takım</b><div class="eui-versus__alive"><i></i><i></i><i></i><i></i><i class="off"></i></div></div><span class="eui-versus__score">3</span></div>
  <div class="eui-versus__mid"><span class="eui-kicker">Tur 7 · İlk 5</span><div class="eui-timer"><span class="eui-timer__value">01:24</span></div></div>
  <div class="eui-versus__team eui-t-team2 is-right"><div class="eui-versus__name"><b>Kırmızı takım</b><div class="eui-versus__alive"><i></i><i></i><i></i><i class="off"></i><i class="off"></i></div></div><span class="eui-versus__score">2</span></div>
</div>
```

## combat.points — Ele geçirme noktaları
A/B/C kontrol noktaları: halka doluluğu (--v), takım rengi, is-contested çatışmalı.
JS: `EUI.ring(el, 0.45)`

```html
<div class="eui-points">
  <div class="eui-point is-team1 eui-t-team1" data-eui-ring style="--v:1"><b>A</b></div>
  <div class="eui-point is-contested eui-t-team2" data-eui-ring style="--v:.45"><b>B</b></div>
  <div class="eui-point is-team2 eui-t-team2" data-eui-ring style="--v:1"><b>C</b></div>
</div>
```

## combat.dialog — Diyalog
Konuşan avatarı, söz satırı ve numaralı seçenekler. Seçenek is-active seçili, is-used kullanılmış; small ipucu etiketi.

```html
<div class="eui-dialog" style="max-width:460px">
  <div class="eui-dialog__speaker"><span class="eui-avatar eui-avatar--lg eui-avatar--round eui-t-warn">L</span><div class="eui-col eui-gap-1"><span class="eui-kicker eui-kicker--accent">Lester Crest</span><span class="eui-sub">Organizatör</span></div></div>
  <div class="eui-dialog__line">“Bankanın arka kapısı gece yarısı açılıyor. Sessiz mi gireriz, yoksa kapıyı mı uçururuz?”</div>
  <div class="eui-dialog__choices">
    <button class="eui-choice is-active"><span class="eui-key">1</span>Sessizce gireriz.<small>Gizlilik</small></button>
    <button class="eui-choice"><span class="eui-key">2</span>Kapıyı uçururuz.<small>Agresif</small></button>
    <button class="eui-choice is-used"><span class="eui-key">3</span>Planı tekrar anlat.</button>
  </div>
</div>
```

## combat.objective — Görev takibi
Aktif görev paneli: başlık + süre rozeti, adım listesi (eui-step: is-done tamam, is-active şimdiki, is-optional isteğe bağlı), altta ilerleme barı.
JS: `EUI.bar(el.querySelector('.eui-bar'), 38)`

```html
<div class="eui-panel eui-objective">
  <div class="eui-objective__head"><div><span class="eui-kicker eui-kicker--accent">Aktif görev</span><div class="eui-title">Konvoy baskını</div></div><span class="eui-badge eui-t-accent eui-num">04:12</span></div>
  <div class="eui-objective__steps">
    <div class="eui-step is-done"><span class="eui-step__box"><i data-i="check"></i></span>Paleto Körfezi'ne ulaş</div>
    <div class="eui-step is-active"><span class="eui-step__box"><i data-i="check"></i></span><span>Muhafızları etkisiz hale getir <b>3/8</b></span></div>
    <div class="eui-step is-optional"><span class="eui-step__box"><i data-i="check"></i></span>Alarmı tetikleme</div>
  </div>
  <div class="eui-objective__foot"><div class="eui-flex eui-between"><span class="eui-kicker">İlerleme</span><span class="eui-num eui-dim">38%</span></div><div class="eui-bar eui-bar--sm" data-v="38"><i class="eui-bar__fill"></i></div></div>
</div>
```

## combat.damage-number — Yüzen hasar sayısı
Vuruşta dünyada yükselip sönen sayı. world: tam ekran .eui-world katmanı; x, y piksel ya da 0..1 oran; kind: '' (verilen hasar), 'crit', 'heal' (+), 'self' (alınan). Kendin yazma.

```js
var world = document.querySelector('.eui-world') || document.querySelector('.eui-screen').appendChild(Object.assign(document.createElement('div'), { className: 'eui-world' }));
EUI.damageNumber(world, { x: .5, y: .45, value: 128, kind: 'crit' });
```

## combat.vignette — Düşük can kenar kızarması
Can 40'ın altına inince ekran kenarı kızarır, 20'nin altında nabız atar. Ekrana bir kez &lt;div class=&quot;eui-vignette&quot;&gt;&lt;/div&gt; koy (.eui-screen'in doğrudan çocuğu; kendisi tam ekranı kaplar, aşağıdaki boyut yalnız örnek kutusu içindir), her can değişiminde EUI.vignette(el, can) çağır.
JS: `EUI.vignette(el, 15)`

```html
<div class="eui-vignette" style="position:relative;width:320px;height:160px;--v:.7"></div>
```
