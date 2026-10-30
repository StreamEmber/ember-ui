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

**Ayar alanı** (`settings`): `{ id, label, desc, type, value, … }` — `type`: `toggle` · `slider` (`min`, `max`, `step`, `unit`) · `seg` / `stepper` / `select` (`options: ['A', 'B']` ya da `[{ value, label }]`) · `button` (`text`, `icon`, `danger`). Ara başlık: `{ heading: 'Ses' }`.

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
