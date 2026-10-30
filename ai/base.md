# Temel parçalar
Her yerde kullanılan yapı taşları: panel, düğme, rozet, çip, tuş ipucu, form alanları, sekme, tablo, avatar. Önce bunları kullan; yeni stil yazma.

## base.panel — Panel
Temel kutu. Başlık için .mh-panel__head (kicker + sağda mh-count). Dar kutu için style=&quot;--w:300px&quot;. Alt şerit mh-panel__foot.
JS: `—`

```html
<div class="mh-panel" style="--w:280px"><div class="mh-panel__head"><span class="mh-kicker">Başlık</span><span class="mh-count mh-push">3</span></div><div style="padding:0 14px 14px" class="mh-sub">İçerik buraya.</div></div>
```

## base.button — Düğme
Varyantlar: --primary (ana), varsayılan, --ghost (hafif), --outline (çerçeveli), --tone + mh-t-* (renkli). Boyut --sm / --lg, --block tam genişlik, --icon yalnız ikon. --hold basılı tutunca dolar (--v 0..1). Tuş ipucu için içine mh-key koy.
JS: `el.disabled = true`

```html
<div class="mh-flex mh-gap-2"><button class="mh-btn mh-btn--primary">Onayla</button><button class="mh-btn">Normal</button><button class="mh-btn mh-btn--ghost">Vazgeç</button><button class="mh-btn mh-btn--tone mh-t-danger">Sil</button><button class="mh-btn mh-btn--primary mh-btn--sm"><span class="mh-key mh-key--sm">E</span>Küçük</button><button class="mh-btn mh-btn--lg">Büyük</button><button class="mh-btn mh-btn--outline">Çerçeveli</button><button class="mh-btn mh-btn--icon" title="Ayarlar"><i data-i="settings"></i></button><button class="mh-btn mh-btn--hold mh-btn--primary" style="--v:.4">Basılı tut</button></div>
```

## base.badge — Rozet
Küçük etiket: ton mh-t-*; --pill yuvarlak, --dot nokta, --live nabız. Hem metin hem durum için.
JS: `—`

```html
<div class="mh-flex mh-gap-2"><span class="mh-badge">Varsayılan</span><span class="mh-badge mh-t-success">Hazır</span><span class="mh-badge mh-t-gold">MVP</span><span class="mh-badge mh-badge--pill mh-badge--dot mh-t-info">32 / 64</span><span class="mh-badge mh-badge--dot mh-badge--live mh-t-danger">Canlı</span></div>
```

## base.chip — Çip
Filtre/seçenek hapı; seçili is-active.
JS: `el.classList.toggle('is-active')`

```html
<div class="mh-flex mh-gap-2"><button class="mh-chip is-active">Tümü</button><button class="mh-chip">Silah</button><button class="mh-chip">Araç</button></div>
```

## base.keys — Tuş ve ipucu
mh-key tek tuş: boyut --sm/--lg, biçim --solid/--accent. mh-hints içinde mh-hint = tuş(lar) + açıklama; tuşlar yan yana kombinasyon olur.
JS: `—`

```html
<div class="mh-col mh-gap-3"><div class="mh-flex mh-gap-2"><span class="mh-key mh-key--sm">E</span><span class="mh-key">F</span><span class="mh-key mh-key--lg">SPACE</span><span class="mh-key mh-key--accent">Y</span><span class="mh-key mh-key--solid">N</span><span class="mh-key mh-key--round">A</span></div><div class="mh-hints"><span class="mh-hint"><span class="mh-key">E</span>Kapıyı aç</span><span class="mh-hint"><span class="mh-key">SHIFT</span><span class="mh-key">E</span>Zorla</span></div></div>
```

## base.field — Metin alanı
Etiketli giriş: label.mh-field içinde kicker + input.mh-input. Çok satır için textarea.mh-input.mh-textarea, seçim için select.mh-input.mh-select.
JS: `input.value`

```html
<div class="mh-col mh-gap-2" style="--w:280px"><label class="mh-field"><span class="mh-kicker">Oyuncu adı</span><input class="mh-input" value="Amiral Router"></label><label class="mh-field"><span class="mh-kicker">Not</span><textarea class="mh-input mh-textarea" rows="2">Merhaba</textarea></label><label class="mh-field"><span class="mh-kicker">Sunucu</span><select class="mh-input mh-select"><option>İstanbul</option><option>Frankfurt</option></select></label></div>
```

## base.toggle — Anahtar ve onay kutusu
mh-toggle (aç/kapa anahtarı), mh-check (kutu) ve mh-check--radio (tek seçim). İkisi de label içinde input[type=checkbox] + gösterge span.
JS: `input.checked`

```html
<div class="mh-col mh-gap-2"><label class="mh-toggle"><input type="checkbox" checked><span class="mh-toggle__track"></span>Kırpma kılavuzu</label><label class="mh-check"><input type="checkbox" checked><span class="mh-check__box"></span>Sesli sohbet</label><label class="mh-check mh-check--radio"><input type="radio" name="r1" checked><span class="mh-check__box"></span>Seçenek (radyo)</label></div>
```

## base.slider — Kaydırıcı
input.mh-slider; data-out='#id' ve data-unit ile değeri başka öğeye yazar (MH.mount bağlar).
JS: `MH.mount(root)`

```html
<div class="mh-flex mh-gap-2" style="--w:300px"><input type="range" class="mh-slider" min="0" max="100" value="64" data-out="#sv" data-unit="%"><b class="mh-num" id="sv" style="min-width:40px;text-align:right">64%</b></div>
```

## base.stepper — Seçici (stepper)
◀ değer ▶ seçici: data-mh-stepper='A|B|C', başlangıç data-index. MH.mount oluşturur.
JS: `MH.mount(root)`

```html
<div class="mh-stepper" data-mh-stepper="Kolay|Normal|Zor|Kabus" data-index="1"></div>
```

## base.tabs — Sekmeler
data-mh-tabs butonları is-active ile çalıştırır. Butona mh-count rozeti eklenebilir.
JS: `MH.mount(root)`

```html
<div class="mh-tabs" data-mh-tabs="" style="width:100%"><button class="is-active">Silahlar</button><button>Askerler <span class="mh-count">3</span></button><button>Atlar</button></div>
```

## base.table — Tablo
mh-table: sağa hizalı sütun için th/td class='r'; sayı mh-num; satır durumu is-self (sen), is-dead; sıra mh-rank is-1/2/3.
JS: `—`

```html
<table class="mh-table" style="--w:340px"><thead><tr><th>#</th><th>Oyuncu</th><th class="r">Puan</th></tr></thead><tbody>
<tr><td><span class="mh-rank is-1">1</span></td><td>NabeMedia</td><td class="r mh-num">2.410</td></tr>
<tr class="is-self"><td><span class="mh-rank is-2">2</span></td><td>Amiral Router</td><td class="r mh-num">2.180</td></tr>
<tr class="is-dead"><td><span class="mh-rank is-3">3</span></td><td>MSK</td><td class="r mh-num">1.320</td></tr></tbody></table>
```

## base.avatar — Avatar
Baş harfli yuvarlak/kare avatar: boyut --sm/--lg, --round, ton mh-t-*; is-live canlı yayın çerçevesi.
JS: `—`

```html
<div class="mh-flex mh-gap-2"><span class="mh-avatar mh-avatar--sm">A</span><span class="mh-avatar mh-t-team1">NM</span><span class="mh-avatar mh-avatar--lg mh-avatar--round is-live">S</span></div>
```

## base.spinner — Yükleniyor
Dönen gösterge; --lg büyük.
JS: `—`

```html
<div class="mh-flex mh-gap-4"><span class="mh-spinner"></span><span class="mh-spinner mh-spinner--lg"></span></div>
```

## base.scroll — Kaydırma çubuğu
.mh altındaki tüm kaydırma çubukları tema renginde ince çizilir; ek sınıf gerekmez. Biçim: mh-scroll--rail (görünür ray), --accent (vurgu rengi), --hidden (gizli), --x (yatay). Yükseklik ver, taşan içerik kaydırılır. Gizli çubuk: mh-scroll--hidden.
JS: `el.classList.add('mh-scroll')`

```html
<div class="mh-flex mh-gap-3 mh-items-start">
<div class="mh-panel mh-scroll" style="width:150px;height:120px;padding:8px"><p class="mh-sub">Satır 1<br>Satır 2<br>Satır 3<br>Satır 4<br>Satır 5<br>Satır 6<br>Satır 7<br>Satır 8</p></div>
<div class="mh-panel mh-scroll mh-scroll--rail" style="width:150px;height:120px;padding:8px"><p class="mh-sub">Ray görünür<br>Satır 2<br>Satır 3<br>Satır 4<br>Satır 5<br>Satır 6<br>Satır 7<br>Satır 8</p></div>
<div class="mh-panel mh-scroll mh-scroll--accent" style="width:150px;height:120px;padding:8px"><p class="mh-sub">Vurgu rengi<br>Satır 2<br>Satır 3<br>Satır 4<br>Satır 5<br>Satır 6<br>Satır 7<br>Satır 8</p></div>
<div class="mh-panel mh-scroll mh-scroll--x" style="width:150px;padding:8px"><div class="mh-sub" style="white-space:nowrap;width:420px">Yatay kaydırma: uzun bir satır soldan sağa uzanır.</div></div>
</div>
```

## base.player — Oyuncu çipi
Avatar + ad + alt satır; menü başlığında ya da panel köşesinde kim olduğunu gösterir.
JS: `—`

```html
<div class="mh-player"><span class="mh-avatar mh-t-accent">AR</span><div><div class="mh-player__name">Amiral Router</div><div class="mh-player__sub">Mavi takım · Seviye 42</div></div></div>
```

## base.utils — Yerleşim ve yazı yardımcıları
Satır içi stil yerine bunları kullan: mh-flex (satır), mh-col (sütun), mh-between, mh-wrap, mh-grow, mh-gap-1..5, mh-pad / mh-pad-s / mh-pad-l, mh-ellipsis, mh-mono, mh-num (tabular sayı), mh-dim / mh-mute (soluk), mh-accent-text, mh-hud-text (sahne üstü gölge), mh-rule (--accent, --fade) ayraç, ikon boyu mh-i--sm|md|lg|xl, başlık mh-title--sm|lg|xl. Panel biçimleri: mh-panel--solid, --flat, --ghost, mh-panel__head / __foot.
JS: `—`

```html
<div class="mh-panel mh-panel--solid mh-pad mh-col mh-gap-3" style="--w:520px">
  <div class="mh-flex mh-between"><span class="mh-title mh-title--xl">Başlık</span><i data-i="star-f" class="mh-i--lg mh-accent-text"></i></div>
  <div class="mh-rule mh-rule--accent"></div>
  <div class="mh-flex mh-wrap mh-gap-1"><span class="mh-badge mh-badge--solid mh-t-accent">Dolu rozet</span><span class="mh-badge">Rozet</span></div>
  <span class="mh-ellipsis mh-mono mh-dim">Çok uzun bir satır taşarsa üç noktayla kısalır ve mono yazı tipiyle yazılır</span>
  <div class="mh-rule mh-rule--fade"></div>
  <div class="mh-flex mh-gap-5"><span class="mh-hud-text">HUD metni</span><i data-i="heart" class="mh-i--sm"></i><i data-i="heart" class="mh-i--md"></i><i data-i="heart" class="mh-i--xl"></i></div>
  <div class="mh-panel mh-panel--flat mh-pad-s">Düz panel</div><div class="mh-panel mh-panel--ghost mh-pad-l">Hayalet panel</div>
</div>
```
