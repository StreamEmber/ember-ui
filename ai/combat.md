# Savaş ve dünya
Nişangâh, vuruş geri bildirimi, hedef kilidi, tur skoru, nokta ele geçirme, etkileşim istemleri, diyalog. Dünya içi parçalar MH.Markers havuzuyla konumlanır; oyuncu etiketleri için "İsim etiketleri" ailesine bak.

## combat.crosshair — Nişangâh
Dört biçim: artı (varsayılan), --dot, --circle, --t. Durum: is-target düşman üstünde, is-friend dost üstünde. --gap açıklığı, --c rengi ayarlar.
JS: `el.classList.toggle('is-target')`

```html
<div class="mh-flex mh-gap-4">
  <div class="mh-crosshair"><i></i><i></i><i></i><i></i><b></b></div>
  <div class="mh-crosshair mh-crosshair--dot"><i></i><i></i><i></i><i></i><b></b></div>
  <div class="mh-crosshair mh-crosshair--circle is-target"><i></i><i></i><i></i><i></i><b></b></div>
  <div class="mh-crosshair mh-crosshair--t is-friend"><i></i><i></i><i></i><i></i><b></b></div>
</div>
```

## combat.hit — Vuruş işareti
İsabette nişangâhta kısa X: kind boş normal, 'head' kafa, 'kill' öldürme. Hedef verilmezse .mh-screen.

```js
MH.hit(null, 'head');
```

## combat.damage-from — Hasar yönü
Ekran kenarında hasarın geldiği yönü gösteren yay: 0 önden, 90 sağdan, 180 arkadan (derece). Kısa süre sonra kendiliğinden söner.

```js
MH.damageFrom(null, 120);
```

## combat.flash — Ekran parlaması
Tüm ekran flaş: ikinci argüman true ise kırmızı (hasar), değilse beyaz (patlama).

```js
MH.flash(null, true);
```

## combat.lockon — Hedef kilidi
Köşeli hedef çerçevesi; is-locking kilitlenirken daralır. Dünya konumuna yerleştirilir.
JS: `el.classList.add('is-locking')`

```html
<div class="mh-lockon is-locking"><i></i><i></i><i></i><i></i></div>
```

## combat.world-prompt — Dünya istemi
Nesne üstü etkileşim: nokta + tuş + eylem; uzaktayken is-far sadece nokta. Pozisyon world içinde absolute.
JS: `el.classList.toggle('is-far')`

```html
<div class="mh-wprompt"><span class="mh-wprompt__dot"></span><div class="mh-wprompt__card"><span class="mh-key">E</span>Sandığı aç</div></div>
```

## combat.prompt — Tuş istemleri
Sağ alt köşe eylem listesi: tuş + açıklama; is-disabled soluk. small durumu yazar.
JS: `el.querySelector('small').textContent = 'Takılı'`

```html
<div class="mh-prompt">
  <div class="mh-prompt__row"><span class="mh-key">F</span>Araçtan in</div>
  <div class="mh-prompt__row"><span class="mh-key">B</span>Emniyet kemeri<small>Takılı</small></div>
</div>
```

## combat.hold — Basılı tut halkası
Tuşa basılı tutunca dolan halka (kilit açma, kurtarma). MH.hold start()/stop() döner, onDone tamamlanınca çağrılır.
JS: `var h = MH.hold(el, { duration: 1500, onDone() {} }); h.start()`

```html
<div class="mh-hold" data-mh-ring><span class="mh-key mh-key--lg">E</span></div>
```

## combat.enemies — Düşman sayacı
Ekranda ve kuyrukta kaç düşman var + doluluk barı; sınıra yaklaşınca is-swarm kırmızı parlar.
JS: `MH.enemies(el, { onScreen: 14, queued: 37, max: 20 })`

```html
<div class="mh-panel mh-enemy">
  <div class="mh-enemy__part is-on"><i data-i="enemy"></i><div><b data-k="on">14</b><span>Ekranda</span></div></div>
  <div class="mh-enemy__part is-queue"><i data-i="hourglass"></i><div><b data-k="queued">37</b><span>Kuyrukta</span></div></div>
  <div class="mh-bar mh-t-danger" data-v="70"><i class="mh-bar__fill"></i></div>
</div>
```

## combat.versus — Takım skoru
İki takımın skoru, hayatta kalan noktaları (off = ölü) ve ortada tur/süre. MH.timer(el, saniye, { urgent, onEnd }) süreyi sürer.
JS: `MH.timer(el.querySelector('.mh-timer'), 84, { urgent: 10 })`

```html
<div class="mh-versus">
  <div class="mh-versus__team mh-t-team1"><div class="mh-versus__name"><b>Mavi takım</b><div class="mh-versus__alive"><i></i><i></i><i></i><i></i><i class="off"></i></div></div><span class="mh-versus__score">3</span></div>
  <div class="mh-versus__mid"><span class="mh-kicker">Tur 7 · İlk 5</span><div class="mh-timer"><span class="mh-timer__value">01:24</span></div></div>
  <div class="mh-versus__team mh-t-team2 is-right"><div class="mh-versus__name"><b>Kırmızı takım</b><div class="mh-versus__alive"><i></i><i></i><i></i><i class="off"></i><i class="off"></i></div></div><span class="mh-versus__score">2</span></div>
</div>
```

## combat.points — Ele geçirme noktaları
A/B/C kontrol noktaları: halka doluluğu (--v), takım rengi, is-contested çatışmalı.
JS: `MH.ring(el, 0.45)`

```html
<div class="mh-points">
  <div class="mh-point is-team1 mh-t-team1" data-mh-ring style="--v:1"><b>A</b></div>
  <div class="mh-point is-contested mh-t-team2" data-mh-ring style="--v:.45"><b>B</b></div>
  <div class="mh-point is-team2 mh-t-team2" data-mh-ring style="--v:1"><b>C</b></div>
</div>
```

## combat.dialog — Diyalog
Konuşan avatarı, söz satırı ve numaralı seçenekler. Seçenek is-active seçili, is-used kullanılmış; small ipucu etiketi.

```html
<div class="mh-dialog" style="max-width:460px">
  <div class="mh-dialog__speaker"><span class="mh-avatar mh-avatar--lg mh-avatar--round mh-t-warn">L</span><div class="mh-col mh-gap-1"><span class="mh-kicker mh-kicker--accent">Lester Crest</span><span class="mh-sub">Organizatör</span></div></div>
  <div class="mh-dialog__line">“Bankanın arka kapısı gece yarısı açılıyor. Sessiz mi gireriz, yoksa kapıyı mı uçururuz?”</div>
  <div class="mh-dialog__choices">
    <button class="mh-choice is-active"><span class="mh-key">1</span>Sessizce gireriz.<small>Gizlilik</small></button>
    <button class="mh-choice"><span class="mh-key">2</span>Kapıyı uçururuz.<small>Agresif</small></button>
    <button class="mh-choice is-used"><span class="mh-key">3</span>Planı tekrar anlat.</button>
  </div>
</div>
```

## combat.objective — Görev takibi
Aktif görev paneli: başlık + süre rozeti, adım listesi (mh-step: is-done tamam, is-active şimdiki, is-optional isteğe bağlı), altta ilerleme barı.
JS: `MH.bar(el.querySelector('.mh-bar'), 38)`

```html
<div class="mh-panel mh-objective">
  <div class="mh-objective__head"><div><span class="mh-kicker mh-kicker--accent">Aktif görev</span><div class="mh-title">Konvoy baskını</div></div><span class="mh-badge mh-t-accent mh-num">04:12</span></div>
  <div class="mh-objective__steps">
    <div class="mh-step is-done"><span class="mh-step__box"><i data-i="check"></i></span>Paleto Körfezi'ne ulaş</div>
    <div class="mh-step is-active"><span class="mh-step__box"><i data-i="check"></i></span><span>Muhafızları etkisiz hale getir <b>3/8</b></span></div>
    <div class="mh-step is-optional"><span class="mh-step__box"><i data-i="check"></i></span>Alarmı tetikleme</div>
  </div>
  <div class="mh-objective__foot"><div class="mh-flex mh-between"><span class="mh-kicker">İlerleme</span><span class="mh-num mh-dim">38%</span></div><div class="mh-bar mh-bar--sm" data-v="38"><i class="mh-bar__fill"></i></div></div>
</div>
```

## combat.damage-number — Yüzen hasar sayısı
Vuruşta dünyada yükselip sönen sayı. world: tam ekran .mh-world katmanı; x, y piksel ya da 0..1 oran; kind: '' (verilen hasar), 'crit', 'heal' (+), 'self' (alınan). Kendin yazma.

```js
var world = document.querySelector('.mh-world') || document.querySelector('.mh-screen').appendChild(Object.assign(document.createElement('div'), { className: 'mh-world' }));
MH.damageNumber(world, { x: .5, y: .45, value: 128, kind: 'crit' });
```

## combat.vignette — Düşük can kenar kızarması
Can 40'ın altına inince ekran kenarı kızarır, 20'nin altında nabız atar. Ekrana bir kez &lt;div class=&quot;mh-vignette&quot;&gt;&lt;/div&gt; koy (.mh-screen'in doğrudan çocuğu; kendisi tam ekranı kaplar, aşağıdaki boyut yalnız örnek kutusu içindir), her can değişiminde MH.vignette(el, can) çağır.
JS: `MH.vignette(el, 15)`

```html
<div class="mh-vignette" style="position:relative;width:320px;height:160px;--v:.7"></div>
```
