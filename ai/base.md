# Temel parçalar
Her yerde kullanılan yapı taşları: panel, düğme, rozet, çip, tuş ipucu, form alanları, sekme, tablo, avatar. Önce bunları kullan; yeni stil yazma.

## base.panel — Panel
Temel kutu. Başlık için .eui-panel__head (kicker + sağda eui-count). Dar kutu için style=&quot;--w:300px&quot;. Alt şerit eui-panel__foot.
JS: `—`

```html
<div class="eui-panel" style="--w:280px"><div class="eui-panel__head"><span class="eui-kicker">Başlık</span><span class="eui-count eui-push">3</span></div><div style="padding:0 14px 14px" class="eui-sub">İçerik buraya.</div></div>
```

## base.button — Düğme
Varyantlar: --primary (ana), varsayılan, --ghost (hafif), --outline (çerçeveli), --tone + eui-t-* (renkli). Boyut --sm / --lg, --block tam genişlik, --icon yalnız ikon. --hold basılı tutunca dolar (--v 0..1). Tuş ipucu için içine eui-key koy.
JS: `el.disabled = true`

```html
<div class="eui-flex eui-gap-2"><button class="eui-btn eui-btn--primary">Onayla</button><button class="eui-btn">Normal</button><button class="eui-btn eui-btn--ghost">Vazgeç</button><button class="eui-btn eui-btn--tone eui-t-danger">Sil</button><button class="eui-btn eui-btn--primary eui-btn--sm"><span class="eui-key eui-key--sm">E</span>Küçük</button><button class="eui-btn eui-btn--lg">Büyük</button><button class="eui-btn eui-btn--outline">Çerçeveli</button><button class="eui-btn eui-btn--icon" title="Ayarlar"><i data-i="settings"></i></button><button class="eui-btn eui-btn--hold eui-btn--primary" style="--v:.4">Basılı tut</button></div>
```

## base.badge — Rozet
Küçük etiket: ton eui-t-*; --pill yuvarlak, --dot nokta, --live nabız. Hem metin hem durum için.
JS: `—`

```html
<div class="eui-flex eui-gap-2"><span class="eui-badge">Varsayılan</span><span class="eui-badge eui-t-success">Hazır</span><span class="eui-badge eui-t-gold">MVP</span><span class="eui-badge eui-badge--pill eui-badge--dot eui-t-info">32 / 64</span><span class="eui-badge eui-badge--dot eui-badge--live eui-t-danger">Canlı</span></div>
```

## base.chip — Çip
Filtre/seçenek hapı; seçili is-active.
JS: `el.classList.toggle('is-active')`

```html
<div class="eui-flex eui-gap-2"><button class="eui-chip is-active">Tümü</button><button class="eui-chip">Silah</button><button class="eui-chip">Araç</button></div>
```

## base.keys — Tuş ve ipucu
eui-key tek tuş: boyut --sm/--lg, biçim --solid/--accent. eui-hints içinde eui-hint = tuş(lar) + açıklama; tuşlar yan yana kombinasyon olur.
JS: `—`

```html
<div class="eui-col eui-gap-3"><div class="eui-flex eui-gap-2"><span class="eui-key eui-key--sm">E</span><span class="eui-key">F</span><span class="eui-key eui-key--lg">SPACE</span><span class="eui-key eui-key--accent">Y</span><span class="eui-key eui-key--solid">N</span><span class="eui-key eui-key--round">A</span></div><div class="eui-hints"><span class="eui-hint"><span class="eui-key">E</span>Kapıyı aç</span><span class="eui-hint"><span class="eui-key">SHIFT</span><span class="eui-key">E</span>Zorla</span></div></div>
```

## base.field — Metin alanı
Etiketli giriş: label.eui-field içinde kicker + input.eui-input. Çok satır için textarea.eui-input.eui-textarea, seçim için select.eui-input.eui-select.
JS: `input.value`

```html
<div class="eui-col eui-gap-2" style="--w:280px"><label class="eui-field"><span class="eui-kicker">Oyuncu adı</span><input class="eui-input" value="Amiral Router"></label><label class="eui-field"><span class="eui-kicker">Not</span><textarea class="eui-input eui-textarea" rows="2">Merhaba</textarea></label><label class="eui-field"><span class="eui-kicker">Sunucu</span><select class="eui-input eui-select"><option>İstanbul</option><option>Frankfurt</option></select></label></div>
```

## base.toggle — Anahtar ve onay kutusu
eui-toggle (aç/kapa anahtarı), eui-check (kutu) ve eui-check--radio (tek seçim). İkisi de label içinde input[type=checkbox] + gösterge span.
JS: `input.checked`

```html
<div class="eui-col eui-gap-2"><label class="eui-toggle"><input type="checkbox" checked><span class="eui-toggle__track"></span>Kırpma kılavuzu</label><label class="eui-check"><input type="checkbox" checked><span class="eui-check__box"></span>Sesli sohbet</label><label class="eui-check eui-check--radio"><input type="radio" name="r1" checked><span class="eui-check__box"></span>Seçenek (radyo)</label></div>
```

## base.slider — Kaydırıcı
input.eui-slider; data-out='#id' ve data-unit ile değeri başka öğeye yazar (EUI.mount bağlar).
JS: `EUI.mount(root)`

```html
<div class="eui-flex eui-gap-2" style="--w:300px"><input type="range" class="eui-slider" min="0" max="100" value="64" data-out="#sv" data-unit="%"><b class="eui-num" id="sv" style="min-width:40px;text-align:right">64%</b></div>
```

## base.stepper — Seçici (stepper)
◀ değer ▶ seçici: data-eui-stepper='A|B|C', başlangıç data-index. EUI.mount oluşturur.
JS: `EUI.mount(root)`

```html
<div class="eui-stepper" data-eui-stepper="Kolay|Normal|Zor|Kabus" data-index="1"></div>
```

## base.tabs — Sekmeler
data-eui-tabs butonları is-active ile çalıştırır. Butona eui-count rozeti eklenebilir.
JS: `EUI.mount(root)`

```html
<div class="eui-tabs" data-eui-tabs="" style="width:100%"><button class="is-active">Silahlar</button><button>Askerler <span class="eui-count">3</span></button><button>Atlar</button></div>
```

## base.table — Tablo
eui-table: sağa hizalı sütun için th/td class='r'; sayı eui-num; satır durumu is-self (sen), is-dead; sıra eui-rank is-1/2/3.
JS: `—`

```html
<table class="eui-table" style="--w:340px"><thead><tr><th>#</th><th>Oyuncu</th><th class="r">Puan</th></tr></thead><tbody>
<tr><td><span class="eui-rank is-1">1</span></td><td>NabeMedia</td><td class="r eui-num">2.410</td></tr>
<tr class="is-self"><td><span class="eui-rank is-2">2</span></td><td>Amiral Router</td><td class="r eui-num">2.180</td></tr>
<tr class="is-dead"><td><span class="eui-rank is-3">3</span></td><td>MSK</td><td class="r eui-num">1.320</td></tr></tbody></table>
```

## base.avatar — Avatar
Baş harfli yuvarlak/kare avatar: boyut --sm/--lg, --round, ton eui-t-*; is-live canlı yayın çerçevesi.
JS: `—`

```html
<div class="eui-flex eui-gap-2"><span class="eui-avatar eui-avatar--sm">A</span><span class="eui-avatar eui-t-team1">NM</span><span class="eui-avatar eui-avatar--lg eui-avatar--round is-live">S</span></div>
```

## base.spinner — Yükleniyor
Dönen gösterge; --lg büyük.
JS: `—`

```html
<div class="eui-flex eui-gap-4"><span class="eui-spinner"></span><span class="eui-spinner eui-spinner--lg"></span></div>
```

## base.scroll — Kaydırma çubuğu
.eui altındaki tüm kaydırma çubukları tema renginde ince çizilir; ek sınıf gerekmez. Biçim: eui-scroll--rail (görünür ray), --accent (vurgu rengi), --hidden (gizli), --x (yatay). Yükseklik ver, taşan içerik kaydırılır. Gizli çubuk: eui-scroll--hidden.
JS: `el.classList.add('eui-scroll')`

```html
<div class="eui-flex eui-gap-3 eui-items-start">
<div class="eui-panel eui-scroll" style="width:150px;height:120px;padding:8px"><p class="eui-sub">Satır 1<br>Satır 2<br>Satır 3<br>Satır 4<br>Satır 5<br>Satır 6<br>Satır 7<br>Satır 8</p></div>
<div class="eui-panel eui-scroll eui-scroll--rail" style="width:150px;height:120px;padding:8px"><p class="eui-sub">Ray görünür<br>Satır 2<br>Satır 3<br>Satır 4<br>Satır 5<br>Satır 6<br>Satır 7<br>Satır 8</p></div>
<div class="eui-panel eui-scroll eui-scroll--accent" style="width:150px;height:120px;padding:8px"><p class="eui-sub">Vurgu rengi<br>Satır 2<br>Satır 3<br>Satır 4<br>Satır 5<br>Satır 6<br>Satır 7<br>Satır 8</p></div>
<div class="eui-panel eui-scroll eui-scroll--x" style="width:150px;padding:8px"><div class="eui-sub" style="white-space:nowrap;width:420px">Yatay kaydırma: uzun bir satır soldan sağa uzanır.</div></div>
</div>
```

## base.player — Oyuncu çipi
Avatar + ad + alt satır; menü başlığında ya da panel köşesinde kim olduğunu gösterir.
JS: `—`

```html
<div class="eui-player"><span class="eui-avatar eui-t-accent">AR</span><div><div class="eui-player__name">Amiral Router</div><div class="eui-player__sub">Mavi takım · Seviye 42</div></div></div>
```

## base.utils — Yerleşim ve yazı yardımcıları
Satır içi stil yerine bunları kullan: eui-flex (satır), eui-col (sütun), eui-between, eui-wrap, eui-grow, eui-gap-1..5, eui-pad / eui-pad-s / eui-pad-l, eui-ellipsis, eui-mono, eui-num (tabular sayı), eui-dim / eui-mute (soluk), eui-accent-text, eui-hud-text (sahne üstü gölge), eui-rule (--accent, --fade) ayraç, ikon boyu eui-i--sm|md|lg|xl, başlık eui-title--sm|lg|xl. Panel biçimleri: eui-panel--solid, --flat, --ghost, eui-panel__head / __foot.
JS: `—`

```html
<div class="eui-panel eui-panel--solid eui-pad eui-col eui-gap-3" style="--w:520px">
  <div class="eui-flex eui-between"><span class="eui-title eui-title--xl">Başlık</span><i data-i="star-f" class="eui-i--lg eui-accent-text"></i></div>
  <div class="eui-rule eui-rule--accent"></div>
  <div class="eui-flex eui-wrap eui-gap-1"><span class="eui-badge eui-badge--solid eui-t-accent">Dolu rozet</span><span class="eui-badge">Rozet</span></div>
  <span class="eui-ellipsis eui-mono eui-dim">Çok uzun bir satır taşarsa üç noktayla kısalır ve mono yazı tipiyle yazılır</span>
  <div class="eui-rule eui-rule--fade"></div>
  <div class="eui-flex eui-gap-5"><span class="eui-hud-text">HUD metni</span><i data-i="heart" class="eui-i--sm"></i><i data-i="heart" class="eui-i--md"></i><i data-i="heart" class="eui-i--xl"></i></div>
  <div class="eui-panel eui-panel--flat eui-pad-s">Düz panel</div><div class="eui-panel eui-panel--ghost eui-pad-l">Hayalet panel</div>
</div>
```
