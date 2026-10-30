# Menü ve ekranlar
Tam ekran menü (EUI.Menu, veriyle), bağlam menüsü, onay/seçim/tutar pencereleri, radyal menü, ayar satırı, sıralama, skor tablosu, podyum, ölüm/sonuç/yükleme ekranları. Menü kabuğunun HTML'i elle yazılmaz: önce aşağıdaki "Menü kuralları" bölümünü oku.

## Menü kuralları (önce bunu oku)

1. **Tam ekran menü = `EUI.Menu`.** Mod menüsü, envanter, mağaza, silahçı, garaj, ayarlar, ekip, görev günlüğü… hepsi tek `EUI.Menu` çağrısının bölümleridir. `eui-menu`, `eui-menu__*`, `eui-nav__*` HTML'ini elle yazma; kendi `*-menu`, `*-nav`, `*-row`, `*-layer`, `*-scrim` sınıflarını yazma.
2. **Menü başına tek çağrı, bölüm başına tek görünüm.** Bir bölüm `view: 'list' | 'grid' | 'settings' | 'table'` ya da `render` (custom) olur. İçerik değişince `menu.update(id, { items })`; menüyü yeniden kurma.
3. **Davranışı yazma.** Aç/kapa, ESC, ↑↓ / ←→ / Enter / Q E, fareyle seçim, 2–3 sütun geçişi, detay paneli, alt ipuçları, ekrana sığma ve atlas boşluğu menünün işidir. Sen yalnız `onAction`'da gelen eylemi işlersin.
4. **Küçük seçimler menü değildir:** evet/hayır → `EUI.confirm`, metin → `EUI.input`, listeden seçim → `EUI.choose`, sayı/adet → `EUI.amount`, nesne üstü eylemler → `EUI.context`, anlık çark → `EUI.radial`. Bunlar için de kendi pencereni yazma.
5. **Custom bölüm son çaredir.** `render` yalnız `list/grid/settings/table` yetmediğinde (istatistik panosu, etkinlik takvimi) ve yalnız katalog parçalarıyla (`eui-box`, `eui-tile`, `eui-columns`, `eui-event`…) doldurulur. Kaydırma için içeriği `<div class="eui-scroll eui-menu__scroll eui-menu__pad">` içine koy.

| İhtiyaç | Kullan | Kullanma |
|---|---|---|
| Tam ekran mod menüsü (envanter, mağaza, ayarlar, ekip) | `EUI.Menu` | elle `eui-menu` HTML'i, kendi menü sınıfın |
| Ekip, davet, kasa, kanal, arkadaş, takas | `EUI.Social` (EUI.Menu üstünde hazır) | kendi ekip menün |
| Evet / hayır | `EUI.confirm` | kendi modalın |
| Listeden bir ya da çok seçim | `EUI.choose` | kendi listen |
| Sayı / adet / para | `EUI.amount` | kendi alanın |
| Bir nesne / oyuncu üstünde eylemler | `EUI.context` | modal |
| Tek tuşla anlık seçim (silah çarkı, emir) | `EUI.radial` | liste |

### EUI.Menu şeması

```js
var menu = EUI.Menu(host?, {           // host: varsayılan ilk .eui-screen
  kicker, title,                      // başlık (metin ya da function(state, menu))
  stats: [{ label, value, tone }],    // sağ üst, en fazla 3
  sections: [ … ],                    // aşağıda
  section: 'inv',                     // ilk bölüm (varsayılan: ilk açık bölüm)
  open: false,                        // true: hemen açık başlar
  w: 1180, h: 720,                    // üst sınır (px); ekrandan büyükse küçülür
  foot: 'F1 ile aç',                  // alt satır sağ metin
  closable: true,                     // ESC kapatır
  layer: true,                        // false: katmansız, host'a gömülü ve hep açık
  post: 'menu',                       // eylemler EUI.post(post, { action, section, id, value }) ile oyuna; false: gönderme
  onAction: function (a, menu) {},    // a = { action, section, id, value, item }; false dönerse oyuna gitmez
  onOpen, onClose, onRender           // function (menu)
});
```

**Bölüm** (`sections[]` öğesi):

| Alan | Anlam |
|---|---|
| `{ group: 'Ad' }` | Gezinmede ara başlık |
| `id`, `label`, `icon` | Bölüm kimliği, adı, ikonu (zorunlu) |
| `count` / `small` | Sağda sayı rozeti / soluk küçük metin (değer ya da function) |
| `disabled` | `true` ya da `function (state)`: soluk ve seçilemez |
| `danger` | Kırmızı yazı (Çıkış gibi) |
| `view` | `list` · `grid` · `settings` · `table` |
| `items` | `list` / `grid` öğeleri (aşağıda) |
| `cols` | `grid` sütun sayısı (varsayılan 4) |
| `detail` | Sağ panel: `'item'` (öğede desc/stats/specs/actions/note varsa kendiliğinden) · `'buy'` (satın alma paneli) · `'none'` · `function (item, menu) → html` |
| `search` | `true`: araç çubuğunda arama kutusu |
| `fields` | `settings` alanları (aşağıda) |
| `columns`, `rows` | `table`: `columns: [{ key, label, align: 'r'|'c', num }]`, `rows: [{ id, …, self, dead }]` |
| `render` | Custom: `function (state, menu) → { main, aside? }` |
| `confirm` | Gezinme öğesi düğme olur: `{ title, text, danger, ok, icon }` → onaylanınca `{ action: <bölüm id> }` |
| `action` | Gezinme öğesi düğme olur: `'close'` menüyü kapatır (oyuna `close` eylemi gider); başka bir değer `{ action: <değer> }` olarak gelir |
| `hints` | Ek ipuçları: `[['F', 'Favori']]` |

**Öğe** (`list` / `grid`): `{ id, title, sub, icon | weapon | img | art, meta, price, badge: 'metin' | { text, tone, icon }, tone: 'rare'|'epic'|'legendary', owned, locked, disabled, active, group, desc, stats: [{ label, value (0-100), text, tone }], specs: [['Anahtar', 'değer']], actions: [{ id, label, icon, key, primary, danger, disabled }], note, qty, max, kicker }`.
`grid` öğesinde `group` verirsen aynı gruplar ızgarada başlıkla ayrılır.
`detail: 'buy'` panelinde öğede `actions` yoksa kit **Satın al** düğmesini kendisi çizer: eylemi `buy`, `value` = adet (öğede `qty` verilmişse − / + seçici çıkar, üst sınır `max`, varsayılan 99). `owned` ya da `locked` öğede düğme kapalıdır.
Eylem düğmesine onay gerekiyorsa: `actions: [{ id: 'clear', label: 'Temizle', danger: true, confirm: { title, text } }]` — kit önce `EUI.confirm` sorar, onaylanırsa eylem gelir (`confirm: true` başlığı etiketten üretir). Kendi onay kodunu yazma.

**Ayar alanı** (`settings`): `{ id, label, desc, type, value, … }` — `type`: `toggle` · `slider` (`min`, `max`, `step`, `unit`) · `seg` / `stepper` / `select` (`options: ['A', 'B']` ya da `[{ value, label }]`) · `button` (`text`, `icon`, `danger`, `confirm: true | { title, text, danger, ok }` → önce onay sorar; Hesabı sil, Çıkış yap). Ara başlık: `{ heading: 'Ses' }`.

**Eylemler** (`a.action`): `open` · `close` · `section` (id = bölüm) · `select` (id = öğe) · `activate` (Enter / çift tık; öğede `actions` varsa ilk eylemin id'si gelir) · öğe eylem düğmesinin `id`'si (ör. `equip`, `buy`; `value` = adet) · `change` (ayar; id, value) · `press` (ayar düğmesi) · `confirm` bölümünün id'si.

**API:** `menu.open(bölüm?)` · `menu.close()` · `menu.toggle()` · `menu.isOpen()` · `menu.go(bölüm)` · `menu.select(öğeId)` · `menu.selected()` · `menu.update(bölüm, { items | fields | rows | … })` · `menu.setSections(liste)` · `menu.set(state)` / `menu.patch(p)` (custom render ve function alanları için durum) · `menu.render()` · `menu.destroy()`. Olaylar: `EUI.on('menu:open' | 'menu:close' | 'menu:action', fn)`.

### Oyunla bağlama (StreamEmber overlay)

Ad önerisi: oyun → sayfa `<mod>:menu` (`{ open, section }`), sayfa → oyun `post: '<mod>:menu'` (`{ action, section, id, value }`). Aynı adı iki yönde kullanmak sorun değildir; kanallar ayrıdır. Menü zaten kapalıyken `close()` bir şey yapmaz, bu yüzden oyunun `{ open: false }` cevabı döngü yaratmaz.

```js
var menu = EUI.Menu({ title: 'Rumble', post: 'rumble:menu', sections: [ … ] });
EUI.on('rumble:menu', function (d) { d.open ? menu.open(d.section) : menu.close(); });   // oyun → sayfa
EUI.on('rumble:inventory', function (d) { menu.update('inv', { items: d.items }); });
// sayfa → oyun: her eylem EUI.post('rumble:menu', { action, section, id, value }) olarak gider;
// 'open' / 'close' eylemlerinde oyun tarafı OverlayInputMode'u açıp kapatır.
```

## menu.menu — Tam ekran menü (EUI.Menu)
Mod menüsü, envanter, mağaza, ayarlar, ekip: tek çağrı. Bölümler (list | grid | settings | table | custom) ve öğeler verilir; katman, ekrana sığma, aç/kapa, ESC, ↑↓ / ←→ / Enter / Q E, 2-3 sütun, detay paneli ve ipuçları kitin işidir. Eylemler onAction'a ve EUI.post('menu', …) ile oyuna gider.

```js
var menu = EUI.Menu({
  open: true, kicker: 'Rumble', title: 'Mod menüsü',
  stats: [{ label: 'Nakit', value: '$12.480', tone: 'success' }],
  sections: [
    { group: 'Oyuncu' },
    { id: 'inv', label: 'Envanter', icon: 'backpack', view: 'list', items: [
      { id: 'carbine', title: 'Karabina tüfeği', sub: 'Otomatik tüfek · 180 mermi', weapon: 'carbine', meta: '×1',
        stats: [{ label: 'Hasar', value: 64 }, { label: 'Menzil', value: 82 }], actions: [{ id: 'equip', label: 'Kuşan', key: 'E' }] },
      { id: 'medkit', title: 'İlk yardım çantası', sub: 'Canı doldurur', icon: 'first-aid', meta: '×3', actions: [{ id: 'use', label: 'Kullan', key: 'E' }] }
    ] },
    { id: 'shop', label: 'Mağaza', icon: 'store', view: 'grid', cols: 3, detail: 'buy', items: [
      { id: 'vest', title: 'Ağır yelek', sub: 'Zırh +100', icon: 'shield', price: 2500, tone: 'epic', qty: 1, note: 'Kese: $12.480' },
      { id: 'ammo', title: 'Tüfek mermisi', sub: '×60', icon: 'bullets', price: 120, qty: 1 },
      { id: 'para', title: 'Paraşüt', sub: 'Tek kullanım', icon: 'parachute', price: 900, locked: true, badge: { text: 'Svy 20', icon: 'lock' } }
    ] },
    { group: 'Sistem' },
    { id: 'set', label: 'Ayarlar', icon: 'settings', view: 'settings', fields: [
      { id: 'scale', label: 'HUD ölçeği', desc: 'Tüm arayüz', type: 'slider', min: 70, max: 130, step: 5, value: 100, unit: '%' },
      { id: 'names', label: 'İsim etiketleri', type: 'seg', value: 'team', options: [{ value: 'all', label: 'Hepsi' }, { value: 'team', label: 'Ekip' }, { value: 'off', label: 'Kapalı' }] },
      { id: 'voice', label: 'Bas-konuş', type: 'toggle', value: true }
    ] },
    { id: 'quit', label: 'Çıkış', icon: 'door', danger: true, confirm: { title: 'Oyundan çıkılsın mı?', danger: true } }
  ],
  onAction: function (a) { EUI.toast({ title: a.action, text: [a.section, a.id, a.value].filter(function (x) { return x != null; }).join(' · '), duration: 1800 }); },
  onClose: function (m) { m.destroy(); }   // yalnız galeri için; modda menü saklanır, menu.open() ile yeniden açılır
});
```

## menu.menu-settings — Ayarlar menüsü (2 sütun)
Hiçbir bölümde detay yoksa menü kendiliğinden 2 sütundur. view: 'settings' alan türleri: toggle, slider, seg, stepper, select, button; heading ile ara başlık. ←→ değeri değiştirir, her değişiklik { action: 'change', id, value } olur.

```js
EUI.Menu({
  open: true, w: 1000, h: 620, kicker: 'Sistem', title: 'Ayarlar',
  sections: [
    { id: 'video', label: 'Görüntü', icon: 'eye', view: 'settings', fields: [
      { heading: 'Kalite' },
      { id: 'q', label: 'Kalite ön ayarı', type: 'seg', value: 'high', options: [{ value: 'mid', label: 'Orta' }, { value: 'high', label: 'Yüksek' }] },
      { id: 'fov', label: 'Görüş alanı', type: 'slider', min: 60, max: 110, value: 85, unit: '°' },
      { id: 'res', label: 'Çözünürlük', type: 'select', value: '1920x1080', options: ['1280x720', '1920x1080'] }
    ] },
    { id: 'audio', label: 'Ses', icon: 'volume', view: 'settings', fields: [
      { id: 'master', label: 'Ana ses', type: 'slider', value: 80, unit: '%' },
      { id: 'mode', label: 'Kanal', type: 'stepper', value: 'stereo', options: [{ value: 'stereo', label: 'Stereo' }, { value: 'mono', label: 'Mono' }] },
      { id: 'reset', label: 'Varsayılanlar', type: 'button', text: 'Sıfırla', icon: 'refresh' }
    ] }
  ],
  onClose: function (m) { m.destroy(); }
});
```

## menu.context — Bağlam menüsü
Küçük açılır menü: başlık, satır (ikon, ad, kısayol tuşu), ayraç, is-active, is-danger. Koddan: EUI.context(x, y, [{ icon, label, key, danger, onPick }]).
JS: `EUI.context(x, y, items)`

```html
<div class="eui-panel eui-context"> <div class="eui-context__head"><span class="eui-kicker">NabeMedia üzerinde</span></div>
<button class="eui-context__item"><i data-i="user"></i><span>Profili gör</span><span class="eui-key eui-key--sm">P</span></button>
<button class="eui-context__item is-active"><i data-i="user-plus"></i><span>Ekibe davet et</span></button>
<button class="eui-context__item"><i data-i="cash"></i><span>Para gönder</span><small>$</small></button>
<div class="eui-context__sep"></div>
<button class="eui-context__item is-danger"><i data-i="ban"></i><span>Oyundan at</span></button> </div>
```

## menu.modal — Onay penceresi
Onay/uyarı kutusu; bu HTML yalnız görünüm içindir, koddan EUI.confirm({ title, text, danger, ok, icon }) çağır: Promise(true/false). Genel pencere EUI.modal({ title, body, actions, validate }); metin EUI.input, liste EUI.choose, sayı EUI.amount (ayrı varyantlar).
JS: `EUI.confirm({ title: 'Sil?', text: 'Geri alınamaz', danger: true }).then(function (ok) { … })`

```html
<div class="eui-panel eui-modal eui-t-danger"> <div class="eui-modal__head"><div class="eui-modal__icon"><i data-i="alert"></i></div><div class="eui-modal__titles"><div class="eui-title">Eşyayı yok et?</div><div class="eui-sub">Bu işlem geri alınamaz.</div></div></div>
<div class="eui-modal__actions"><button class="eui-btn eui-btn--ghost"><span class="eui-key eui-key--sm">ESC</span>Vazgeç</button><button class="eui-btn eui-btn--tone eui-t-danger"><span class="eui-key eui-key--sm">ENTER</span>Yok et</button></div> </div>
```

## menu.choose — Seçim penceresi
Aranabilir liste penceresi: items [{ id, label, sub, icon, avatar, tone, badge, right, disabled }], multi çoklu seçim, max sınır. Promise: id (multi: [id]) ya da vazgeçince null.

```js
EUI.choose({ title: 'Ekibe davet et', icon: 'user-plus', multi: true, ok: 'Davet gönder',
  items: [{ id: 'nm', label: 'NabeMedia', sub: '24 m' }, { id: 'msk', label: 'MSK', sub: '140 m' }, { id: 'b8', label: 'Bandit #8', sub: '300 m', disabled: true }] })
  .then(function (ids) { if (ids) EUI.toast({ tone: 'success', title: ids.length + ' davet gönderildi' }); });
```

## menu.amount — Tutar / adet penceresi
Sayı seçici: min, max, value, step, prefix ('$'), suffix, quick: [100, 1000, 'max']. Promise: sayı ya da null.

```js
EUI.amount({ title: 'Kasaya yatır', max: 12480, value: 1000, quick: [100, 1000, 'max'] })
  .then(function (n) { if (n) EUI.toast({ tone: 'success', title: '$' + EUI.fmt(n) + ' yatırıldı' }); });
```

## menu.input — Metin penceresi
Tek alanlı giriş: label, placeholder, value, max, type ('text' | 'password' | 'number'), required. Promise: metin ya da null.

```js
EUI.input({ title: 'Ekip adı', label: 'Yeni ad', placeholder: 'Gece Kuşları', max: 24, required: true })
  .then(function (v) { if (v) EUI.toast({ title: 'Ad: ' + v }); });
```

## menu.radial — Radyal menü
Daire dilimli seçim: EUI.radial(el, [{ icon, label, desc, disabled }], { title, hint, size, onPick }). Fare dilime gelince merkezde ad/açıklama görünür.

```js
var host = document.createElement('div');
host.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:50';
(document.querySelector('.eui-screen') || document.body).appendChild(host);
EUI.radial(host, [
  { icon: 'user', label: 'Profil', desc: 'Karakter bilgisi' },
  { icon: 'bag', label: 'Envanter', desc: 'Eşyaları aç' },
  { icon: 'pin', label: 'Konum', desc: 'Konum paylaş' },
  { icon: 'lock', label: 'Kilitli', desc: 'Seviye 50', disabled: true },
  { icon: 'car', label: 'Araç', desc: 'Aracı çağır' }
], { title: 'Hızlı menü', size: 360, onPick: function () { host.remove(); } });
```

## menu.setting — Ayar satırı
EUI.Menu içindeysen bunu yazma, view: 'settings' kullan. Menü dışı bir panelde tek ayar satırı: sol metin (başlık + açıklama), sağda kontrol: eui-slider (data-out, data-unit ile değer yazılır), eui-toggle, eui-select.
JS: `EUI.mount(root)`

```html
<div class="eui-setting"><div class="eui-setting__text"><b>HUD ölçeği</b><span>Tüm arayüzü büyütür veya küçültür</span></div><div class="eui-setting__control"><input type="range" class="eui-slider" min="70" max="130" value="100" data-out="#o1" data-unit="%"><b id="o1">100%</b></div></div>
```

## menu.standings — Sıralama listesi
Köşe sıralaması: eui-rank (is-1/2/3 madalya renkleri), ad, değer. Kendi satırın is-self.
JS: `el.querySelector('.is-self')`

```html
<div class="eui-panel eui-standings" style="--w:240px"> <div class="eui-panel__head"><span class="eui-kicker">Sıralama</span><span class="eui-kicker eui-push">Ö / A</span></div>
<div class="eui-standing"><span class="eui-rank is-1">1</span><span>NabeMedia</span><b>14 / 3</b></div>
<div class="eui-standing is-self"><span class="eui-rank is-2">2</span><span>Amiral Router</span><b>11 / 4</b></div>
<div class="eui-standing"><span class="eui-rank is-3">3</span><span>Bandit #8</span><b>9 / 6</b></div>
<div class="eui-standing"><span class="eui-rank">4</span><span>MSK</span><b>7 / 7</b></div> </div>
```

## menu.scoreboard — Skor tablosu
Takım skor tablosu: başlık + istatistikler, takım başlığı (eui-teamhead + eui-t-team1..5), eui-table, ping çubuğu, kendi satırın is-self.
JS: `EUI.mount(root)`

```html
<div class="eui-panel eui-scoreboard" style="--w:620px"> <div class="eui-scoreboard__head"><div class="eui-col eui-gap-1 eui-grow"><span class="eui-kicker eui-kicker--accent">Takım ölüm maçı</span><span class="eui-title">Skor tablosu</span></div>
<div class="eui-menu__stats"><div class="eui-stat"><span class="eui-kicker">Tur</span><b>7 / 9</b></div><div class="eui-stat"><span class="eui-kicker">Süre</span><b>01:24</b></div></div></div>
<div class="eui-scoreboard__teams"><div><div class="eui-teamhead eui-t-team1"><b>Mavi takım</b><strong>3</strong></div>
<table class="eui-table"><thead><tr><th>Oyuncu</th><th class="r">Ö</th><th class="r">A</th><th class="r">Skor</th><th class="r">Ping</th></tr></thead><tbody>
<tr><td>NabeMedia</td><td class="r eui-num">14</td><td class="r eui-num">3</td><td class="r eui-num">2.410</td><td class="r"><span class="eui-ping"><i></i><i></i><i></i><i></i></span></td></tr>
<tr class="is-self"><td>Amiral Router</td><td class="r eui-num">11</td><td class="r eui-num">4</td><td class="r eui-num">2.180</td><td class="r"><span class="eui-ping"><i></i><i></i><i></i><i></i></span></td></tr>
</tbody></table></div></div> </div>
```

## menu.podium — Podyum
İlk üç: slot sırası 2-1-3, her slotta oyuncu (avatar + ad + alt satır) ve numaralı blok. Madalya tonu eui-t-gold/silver/bronze.
JS: `—`

```html
<div class="eui-podium">
<div class="eui-podium__slot is-2"><div class="eui-podium__who"><span class="eui-avatar eui-t-silver">AR</span><b>Amiral Router</b><span class="eui-sub">11 öldürme</span></div><div class="eui-podium__block"><strong>2</strong><span>2.180 puan</span></div></div>
<div class="eui-podium__slot is-1"><div class="eui-podium__who"><i data-i="crown-f" class="eui-i--lg eui-tone eui-t-gold"></i><span class="eui-avatar eui-t-gold">NM</span><b>NabeMedia</b><span class="eui-badge eui-t-gold">MVP</span></div><div class="eui-podium__block"><strong>1</strong><span>2.410 puan</span></div></div>
<div class="eui-podium__slot is-3"><div class="eui-podium__who"><span class="eui-avatar eui-t-bronze">B</span><b>Bandit #8</b><span class="eui-sub">9 öldürme</span></div><div class="eui-podium__block"><strong>3</strong><span>1.760 puan</span></div></div>
</div>
```

## menu.dead — Ölüm ekranı
Büyük 'Öldün' başlığı, öldüren kartı (avatar, silah, mesafe, istatistikler) ve altta yeniden doğma halkası (data-eui-ring, --v 0..1) ile tuş ipuçları.
JS: `EUI.ring(el, v)`

```html
<div class="eui-dead"> <span class="eui-kicker">Etkisiz hale getirildin</span> <div class="eui-dead__title">Öldün</div>
<div class="eui-panel eui-killer"> <span class="eui-avatar eui-avatar--lg eui-t-team2">B</span> <div class="eui-col eui-gap-1"><span class="eui-kicker">Öldüren</span><b>Bandit #8</b><span class="eui-sub">Pompalı tüfek · 14 m</span></div>
<div class="eui-killer__stats"><div><span class="eui-kicker">Can</span><b class="eui-tone eui-t-danger">38</b></div><div><span class="eui-kicker">Zırh</span><b>0</b></div></div> </div>
<div class="eui-respawn"> <div class="eui-respawn__ring" data-eui-ring style="--v:.6"><b>8</b></div> <div class="eui-col eui-gap-1"><span class="eui-kicker">Yeniden doğma</span><div class="eui-hints"><span class="eui-hint"><span class="eui-key">E</span>Hastanede doğ</span><span class="eui-hint"><span class="eui-key">G</span>Ekibi izle</span></div></div> </div> </div>
```

## menu.results — Maç sonucu
Maç bitişi: üstte başlık (Zafer/Yenilgi), alt satır ve eui-summary özet sayıları; podyum ayrı varyant.
JS: `—`

```html
<div class="eui-results"> <div class="eui-results__title"><span class="eui-kicker eui-kicker--accent">Maç bitti · 5 – 3</span><b>Zafer</b><span class="eui-sub">Mavi takım Vinewood'u ele geçirdi</span></div> <div class="eui-summary"><div><span class="eui-kicker">Kazanç</span><b class="eui-tone eui-t-success">+$8.400</b></div><div><span class="eui-kicker">Deneyim</span><b>+1.250 RP</b></div><div><span class="eui-kicker">Öldürme</span><b>11</b></div></div> </div>
```

## menu.loading — Yükleme ekranı
Tam ekran: arka plan (__art), başlık/alt metin/rozetler (__main), altta ipucu ve ilerleme (__foot).
JS: `el.querySelector('.eui-bar').dataset.v = 50; EUI.mount(root)`

```html
<div class="eui-loading"> <div class="eui-loading__art"></div> <div class="eui-loading__main"><span class="eui-kicker eui-kicker--accent">Stream Ember sunar</span><div class="eui-title">Event Fabric</div><div class="eui-flex eui-gap-2"><span class="eui-badge eui-badge--pill eui-badge--dot eui-t-success">32 / 64 oyuncu</span><span class="eui-badge eui-badge--pill">Ping 18 ms</span></div></div>
<div class="eui-loading__foot"><div class="eui-loading__tip"><span class="eui-kicker">İpucu</span><p>F1 ile etkileşim menüsünü açabilirsin.</p></div> <div class="eui-loading__progress"><div class="eui-loading__status"><span>Haritalar yükleniyor</span><b>62%</b></div><div class="eui-bar eui-bar--stripe eui-t-accent" data-v="62"><i class="eui-bar__fill"></i></div></div></div> </div></div>
```
