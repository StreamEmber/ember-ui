# Oyun ekranları
Oyunun kendi ekranları (HUD değil): lobi, başlık, yükleme, durum ekranları (ağ hatası, çevrimdışı, bakım, güncelleme, oturum, hata, bağlanıyor) ve bunların parçaları (profil, para birimi, kampanya kartı, kısayol, alt gezinme çubuğu, büyük eylem düğmesi, bildirim noktası). Aynı çağrı PC'de, yatay ve dikey telefonda çalışır. Önce aşağıdaki "Ekran kuralları" bölümünü oku.

## Ekran kuralları (önce bunu oku)

1. **Oyunun ekranları hazır çağrıdır.** Lobi → `EUI.Lobby`, başlık → `EUI.title`, yükleme → `EUI.loading`, bağlantı / hata / bakım / güncelleme → `EUI.state(tür)`, giriş / kayıt / hesap bağlama / şifre / yayıncı girişi → `EUI.auth(o)`, koşullar → `EUI.consent`, dil → `EUI.language`, oyuncu adı → `EUI.nickname`, PIN / yetkili kilidi → `EUI.pin`. Bu ekranların HTML'ini elle yazma, kendi `*-lobby`, `*-login`, `*-navbar` sınıfını uydurma; giriş formu, QR kutusu, tuş takımı kitte hazırdır.
2. **Lobiden açılan her tam ekran sayfa `EUI.Menu`'dür:** mağaza, envanter, karakterler, görevler, ayarlar, gelen kutusu, sıralama. Menü dikey ekranda kendiliğinden tam ekrana ve üstte yatay sekmelere geçer.
3. **Küçük sorular pencere:** onay `EUI.confirm`, sayı `EUI.amount`, seçim `EUI.choose`, metin `EUI.input`. Ödül / bildirim `EUI.toast`.
4. **Yön ve ölçek:** tek HTML yatay ve dikeyde çalışır (`.eui-app` kapsayıcı sorgusu). PC / TV / overlay `EUI.autoScale()` (kısa kenar 1080); telefon ve tablet `EUI.autoScale({ base: 540 })` (dokunma hedefleri parmak boyu). Kendi medya sorgunu yazma.
5. **Parçaları (`currency`, `profile`, `promo`, `shortcuts`, `navbar`, `cta`, `iconbtn`) yalnız kendi özel ekranında kullan.** Lobide `EUI.Lobby` bunları kendisi çizer.

| İhtiyaç | Kullan |
|---|---|
| Oyunun ana ekranı | `EUI.Lobby(host, spec)` |
| Açılışta "dokun" ekranı | `EUI.title(host, o)` → Promise |
| Yükleme / sunucuya bağlanma | `EUI.loading(host, o)` → `{ progress, tip, close }` |
| İnternet yok, sunucu yok | `EUI.state('network-error')` → `'retry'` |
| Çevrimdışı devam edilebilir | `EUI.state('offline')` → `'offline'` \| `'retry'` |
| Bakım | `EUI.state('maintenance')` |
| Zorunlu / isteğe bağlı güncelleme | `EUI.state('update-required')` / `EUI.state('update-available')` |
| Başka cihazdan giriş | `EUI.state('session-expired')` → `'login'` |
| Beklenmeyen hata | `EUI.state('error', { code })` |
| Bağlanıyor / rakip aranıyor | `EUI.state('checking', { title, text, actions })` → `.close(v)` |
| Oyun içinde bağlantı koptu | `EUI.state('reconnecting')` → `.close()` ya da `'quit'` |
| Giriş (e-posta / misafir / Google / Apple) | `EUI.auth({ mode: 'login', methods })` → `{ method, email, password, remember }` |
| Kayıt | `EUI.auth({ mode: 'signup', legal: true })` → `{ method: 'signup', email, password, name }` |
| Misafir ilerlemesini hesaba taşı | `EUI.auth({ mode: 'link', cancel: true })` |
| Şifremi unuttum | `EUI.auth({ mode: 'reset' })` → `{ method: 'reset', email }` |
| Yayıncı / StreamEmber hesabıyla bağlan (QR) | `EUI.auth({ mode: 'streamer', qr: { code } })`; oyun doğrular, `p.done()` |
| Sunucu "şifre yanlış" dedi | `p.error('Şifre yanlış')` (ekran açık kalır, kart sallanır) |
| Kullanım koşulları, gizlilik, yaş | `EUI.consent({ age: 13 })` → `{ terms, privacy, … }` \| `false` |
| Dil seçimi | `EUI.language({ value: EUI.lang() })` → kod; kit seçilen dili `EUI.lang(kod)` ile sayfaya uygular (`apply: false` uygulamaz) |
| İlk girişte ad seç | `EUI.nickname({ check })` → ad |
| Ebeveyn kilidi, yetkili (admin) menüsü, satın alma PIN'i | `EUI.pin({ verify, attempts })` → kod \| `null` |
| Ayarlar ekranı | `EUI.Menu({ sections: [{ view: 'settings', fields }] })` → `ai/menu.md` (tam ekran, dikeyde de) |
| Mağaza, envanter, posta… | `EUI.Menu` → `ai/menu.md` |

### EUI.Lobby şeması

```js
var lobby = EUI.Lobby(host?, {
  player:     { name, level, xp (0..1), avatar (resim adresi), tone },
  currencies: [{ id, icon, tone, value, max, add }],      // add: true → + düğmesi (eylem: currency)
  buttons:    [{ id, icon, label, badge }],               // sağ üst kare düğmeler (ayarlar, posta…)
  promos:     [{ id, icon, tone, title, sub, progress, progressText, time, badge }],
  hero:       { art: { icon | img | weapon }, name, level, progress, progressText, trophies },
  shortcuts:  [{ id, icon, label, tone, badge }],
  nav:        [{ id, icon, label, badge, locked, lockedText, active }],
  mode:       { label, sub, icon },                       // ikincil büyük düğme (eylem: mode)
  play:       { label, sub, icon, busy },                 // busy: true → bekliyor
  bg:         { img },
  post: 'lobby',                                          // false: oyuna gönderme
  onAction: function (a, lobby) {}                        // a = { action, id }; false dönerse oyuna gitmez
});
lobby.update({ currencies: [...] });  lobby.hide();  lobby.show();  lobby.destroy();
```

`badge`: sayı (99'dan büyükse 99+), `true` boş nokta, `0` / boş yok. Kilitli gezinme öğesine basınca kit `lockedText`'i bildirim olarak gösterir; eylem gelmez.
Eylemler (`a.action`): `profile` · `currency` (id) · `button` (id) · `promo` (id) · `shortcut` (id) · `nav` (id) · `mode` · `play`.

### EUI.auth şeması

```js
var p = EUI.auth(host?, {
  mode: 'login',                        // login | signup | link | reset | streamer
  methods: ['email', 'guest', 'google', 'apple', 'qr'],   // sıra görünüm sırası; email ve qr sekme, diğerleri düğme
  name: 'Snowball' | logo: 'logo.png',  // kartın üstü
  qr: { img, code, hint },              // qr yöntemi
  legal: true,                          // signup / link: koşul onayı zorunlu
  cancel: true,                         // sol üstte geri (→ null)
  footer: '© …',
  resolveOn: false,                     // sonuç onAction({ action: 'submit', values }) olur; oyun p.done(v) / p.error(msg) der
  validate: function (v) { return hata | null; },
  onAction: function (a, p) {}          // forgot · switch (id: mode; false dönerse geçmez) · open (id: terms | privacy) · method (id) · submit
});
p.then(function (r) { /* r null = iptal */ });
p.error('Şifre yanlış');  p.done({ method: 'qr' });  p.busy(true);  p.el
```

Kit doğrular: e-posta biçimi, şifre (giriş: boş olmasın; kayıt / bağlama: en az 8), ad (en az 3), koşul onayı. Sunucu doğrulaması oyunda: `resolveOn: false` + `p.done` / `p.error`.

### Açılış akışı

```js
EUI.autoScale({ base: 540 });                                    // telefon
await EUI.title({ name: 'Snowball', version: '1.4.2' });
var ld = EUI.loading({ title: 'Snowball', tips: [...] });
ld.progress(.3, 'Sunucuya bağlanılıyor');
while (!(await connect())) await EUI.state('network-error', { code: 'NET-503' });   // kullanıcı 'retry' der
ld.progress(1, 'Hazır'); ld.close();
if (firstRun) {                                                   // ilk açılış
  if (!(await EUI.consent({ age: 13 }))) return quit();
  await EUI.language({ value: EUI.lang() });                      // seçilen dil <html lang>'a yazılır; metinleri oyun çevirir
}
var user = await EUI.auth({ mode: 'login', name: 'Snowball', methods: ['email', 'guest', 'google'] });
if (user.method === 'guest' && !user.name) user.name = await EUI.nickname({ suggest: names });
var lobby = EUI.Lobby({ … });
// yetkili menüsü: if (await EUI.pin({ verify: isAdminPin })) adminMenu.open();
```

## app.lobby — Lobi (EUI.Lobby)
Oyunun ana ekranı tek çağrı: profil, para birimleri, simge düğmeleri, kampanya kartları, ortada sahne, kısayollar, alt gezinme çubuğu, mod ve Oyna düğmesi. Yatay ve dikey yerleşimi kit seçer. lobby.update({ … }) ile değişen alanı ver; eylemler onAction'a ve EUI.post('lobby', …) ile oyuna gider.

```js
var lobby = EUI.Lobby({
  player: { name: 'Amiral', level: 12, xp: .46 },
  currencies: [{ id: 'energy', icon: 'bolt', tone: 'success', value: 54, max: 60, add: true },
               { id: 'coin', icon: 'coin', tone: 'gold', value: 12480, add: true },
               { id: 'gem', icon: 'diamond', tone: 'legendary', value: 320, add: true }],
  buttons: [{ id: 'mail', icon: 'email', badge: 3 }, { id: 'settings', icon: 'settings' }],
  promos: [{ id: 'pass', icon: 'crown', tone: 'gold', title: 'Sezon 3', sub: 'Altın kart', progress: .4, progressText: '4 / 10', time: '6g 4s' }],
  hero: { art: { icon: 'robot' }, name: 'Kartopu', level: 8, progress: .06, progressText: '3 / 50', trophies: 420 },
  shortcuts: [{ id: 'quests', icon: 'scroll', label: 'Görevler', badge: 2 }, { id: 'rank', icon: 'trophy', label: 'Sıralama' }],
  nav: [{ id: 'shop', icon: 'store', label: 'Mağaza' }, { id: 'inv', icon: 'backpack', label: 'Envanter', badge: 3 }, { id: 'clan', icon: 'crew', label: 'Klan', locked: true }],
  mode: { label: 'Bölüm', sub: 'Buz Vadisi 3-2', icon: 'map' },
  play: { label: 'Oyna', sub: 'Dereceli · 2v2' },
  post: false,
  onAction: function (a) { EUI.toast({ title: a.action + (a.id ? ' · ' + a.id : ''), duration: 1500 }); }
});
setTimeout(function () { lobby.destroy(); }, 8000);   // yalnız galeri için
```

## app.title — Başlık ekranı
Oyun adı ya da logo, 'Başlamak için dokun', sürüm ve sunucu. Dokununca ya da tuşa basınca Promise çözülür ve ekran kalkar (keep: true ile kalır).

```js
EUI.title({ name: 'Snowball', sub: 'Ember', version: '1.4.2', server: 'tr1 · 18 ms' })
  .then(function () { EUI.toast({ tone: 'success', title: 'Devam' }); });
```

## app.loading — Yükleme ekranı
Başlık, rozetler, dönen ipuçları ve ilerleme. Döner: { progress(0..1, metin), tip(metin), close() }. Uzun yükleme ve sunucuya bağlanma adımları için.

```js
var ld = EUI.loading({ kicker: 'StreamEmber sunar', title: 'Snowball', badges: ['Sezon 3'], tips: ['Kartopu basılı tutunca güçlenir.', 'Günlük görevler her gece yenilenir.'] });
var p = 0, t = setInterval(function () { p += .1; ld.progress(p, p < 1 ? 'Varlıklar yükleniyor' : 'Hazır'); if (p >= 1) { clearInterval(t); setTimeout(ld.close, 500); } }, 300);
```

## app.state — Durum ekranları
EUI.state(tür, o) → Promise(düğme id). Türler: network-error (retry), offline (offline | retry), maintenance (retry), update-required (update), update-available (later | update), session-expired (login), error (support | retry), checking (düğmesiz; .close()), reconnecting (quit). title, text, code, icon, tone, actions ile ezilir. Enter ana düğmeye basar.

```js
EUI.state('network-error', { code: 'NET-503' }).then(function (r) { EUI.toast({ title: 'Seçilen: ' + r }); });
```

## app.auth — Giriş (EUI.auth)
Oyun giriş ekranı veriyle: mode login | signup | link | reset | streamer; methods sırası görünümü verir (email ve qr sekme, guest / google / apple düğme). Doğrulama kitte (e-posta, şifre uzunluğu, ad, koşul onayı); sonuç { method, email, password, name, remember }. Sunucu hatası: p.error('…') ekranı açık tutar; resolveOn: false ile sonuç onAction({ action: 'submit', values }) olur, oyun p.done() / p.error() çağırır. Kayıt ↔ giriş geçişi kitte (switch); forgot ve open (koşul id) onAction'a gelir.

```js
EUI.auth({ mode: 'login', name: 'Snowball', methods: ['email', 'guest', 'google'], footer: '© 2026 StreamEmber',
  onAction: function (a) { if (a.action === 'forgot') EUI.toast({ title: 'Şifre sıfırlama' }); } })
  .then(function (r) { EUI.toast({ tone: 'success', title: r ? r.method + ' · ' + (r.email || '') : 'İptal' }); });
```

## app.auth-signup — Kayıt ve hesap bağlama
mode: 'signup' oyuncu adı + e-posta + şifre (en az 8) + koşul onayı (legal: true). mode: 'link' misafir ilerlemesini hesaba taşır (cancel: true geri oku). mode: 'reset' yalnız e-posta ister.

```js
var p = EUI.auth({ mode: 'signup', name: 'Snowball', legal: true, methods: ['email'], resolveOn: false,
  onAction: function (a) {
    if (a.action === 'open') EUI.toast({ title: a.id === 'terms' ? 'Kullanım koşulları' : 'Gizlilik politikası' });
    if (a.action === 'submit') setTimeout(function () { a.values.name === 'Amiral' ? p.error('Bu ad alınmış') : p.done(a.values); }, 600);   // sunucu yanıtı
  } });
p.then(function (r) { if (r) EUI.toast({ tone: 'success', title: 'Hoş geldin ' + r.name }); });
```

## app.auth-streamer — Yayıncı girişi (QR)
mode: 'streamer' StreamEmber hesabıyla bağlanma: qr sekmesi (qr.img resim ya da qr.code kod, qr.hint) + e-posta sekmesi. QR'ı oyun doğrular; bağlanınca p.done({ method: 'qr' }) ekranı kapatır.

```js
var p = EUI.auth({ mode: 'streamer', name: 'Ember', methods: ['qr', 'email'], cancel: true, qr: { code: 'K7X2P9', hint: 'StreamEmber Launcher ile kodu tara' } });
setTimeout(function () { p.done({ method: 'qr', user: 'amiral' }); }, 6000);   // oyun: QR onaylandı
p.then(function (r) { EUI.toast({ tone: 'success', title: r ? 'Bağlandı: ' + (r.user || r.method) : 'İptal' }); });
```

## app.consent — Koşullar ve yaş onayı (EUI.consent)
İlk açılışta kullanım koşulları, gizlilik, isteğe bağlı pazarlama onayı; age: 13 yaş satırı ekler. Zorunlular işaretlenmeden Kabul et kapalı. Sonuç { terms, privacy, marketing, age } ya da false (Reddet). open eylemi metni oyunda açmak için.

```js
EUI.consent({ age: 13, onAction: function (a) { EUI.toast({ title: a.id + ' metni' }); } })
  .then(function (v) { EUI.toast({ tone: v ? 'success' : 'danger', title: v ? 'Kabul edildi' : 'Reddedildi' }); });
```

## app.language — Dil seçimi (EUI.language)
Seçilen kod EUI.lang(kod) ile sayfaya uygulanır (yazı tipi, büyük harf, sayı biçimi; apply: false uygulamaz). EUI.languages hazır liste (tr, en, vi, zh-TW, de, es, pt-BR, ru, ar, id; bayrak + yerel ad); languages ile daralt, value seçili kod. Sonuç kod ya da null (cancel: true).

```js
EUI.language({ value: 'tr', languages: EUI.languages.slice(0, 6), cancel: true })
  .then(function (c) { EUI.toast({ title: 'Dil: ' + c }); });
```

## app.nickname — Oyuncu adı (EUI.nickname)
İlk girişte ad seçimi: min / max uzunluk, sayaç, zar düğmesiyle öneri (suggest: dizi ya da fn), check(ad) → Promise(hata | null) ile sunucuda müsaitlik. Harf, rakam, boşluk ve _ . - dışını reddeder.

```js
EUI.nickname({ suggest: ['KarTopu', 'BuzKıran', 'KutupTilkisi'], check: function (n) { return new Promise(function (r) { setTimeout(function () { r(n.toLowerCase() === 'amiral' ? 'Bu ad alınmış' : null); }, 500); }); } })
  .then(function (n) { EUI.toast({ tone: 'success', title: n ? 'Merhaba ' + n : 'İptal' }); });
```

## app.pin — PIN / yetkili kilidi (EUI.pin)
Ebeveyn kilidi, yetkili (admin) menüsü, satın alma onayı: length haneli tuş takımı, klavye de çalışır. verify(kod) → bool | Promise(bool) oyun doğrular; attempts yanlış hakkı (bitince null). Sonuç kod ya da null.

```js
EUI.pin({ title: 'Yetkili menüsü', sub: 'Yönetici PIN kodunu gir', attempts: 3, verify: function (c) { return c === '1234'; } })
  .then(function (c) { EUI.toast({ tone: c ? 'success' : 'danger', title: c ? 'Açıldı' : 'Kilitli kaldı' }); });
```

## app.currency — Para birimi çipi
İkon + miktar (+ üst sınır) + isteğe bağlı ekle düğmesi. Ton eui-t-* para rengini verir (gold altın, legendary elmas, success enerji). Lobide EUI.Lobby kendi çizer; bunu yalnız kendi ekranında kullan.
JS: `el.querySelector('b').textContent = EUI.fmt(12480)`

```html
<div class="eui-flex eui-gap-2 eui-wrap">
  <div class="eui-currency eui-t-success"><i data-i="bolt"></i><b>54</b><small>/ 60</small><button class="eui-currency__add"><i data-i="plus"></i></button></div>
  <div class="eui-currency eui-t-gold"><i data-i="coin"></i><b>12.480</b><button class="eui-currency__add"><i data-i="plus"></i></button></div>
  <div class="eui-currency eui-t-legendary"><i data-i="diamond"></i><b>320</b></div>
</div>
```

## app.profile — Profil çipi
Avatar + seviye rozeti + ad + XP barı. Dokununca profil açılır.
JS: `EUI.bar(el.querySelector('.eui-bar'), 46)`

```html
<div class="eui-profile"><span class="eui-avatar eui-t-accent">AR</span><span class="eui-profile__lvl">12</span><div class="eui-profile__main"><span class="eui-profile__name">Amiral Router</span><div class="eui-bar eui-t-xp" data-v="46"><i class="eui-bar__fill"></i></div></div></div>
```

## app.iconbtn — Simge düğmesi ve bildirim noktası
Kare dokunma düğmesi (52 px); sağ üstte eui-dot sayı ya da boş nokta. eui-dot her dokunmatik öğeye eklenebilir (shortcut, navbar__item, promo).
JS: `el.querySelector('.eui-dot').textContent = 4`

```html
<div class="eui-flex eui-gap-3"><button class="eui-iconbtn"><i data-i="email"></i><span class="eui-dot">3</span></button><button class="eui-iconbtn"><i data-i="bell"></i><span class="eui-dot"></span></button><button class="eui-iconbtn"><i data-i="settings"></i></button></div>
```

## app.promo — Kampanya / sezon kartı
Sezon kartı, etkinlik, sınırlı teklif: ikon, başlık, alt satır, ilerleme, kalan süre. Ton kartın rengi.
JS: `EUI.bar(el.querySelector('.eui-bar'), 40)`

```html
<div class="eui-col eui-gap-2" style="width:320px">
  <div class="eui-promo eui-t-gold"><div class="eui-promo__head"><span class="eui-promo__icon"><i data-i="crown"></i></span><div class="eui-promo__text"><div class="eui-promo__title">Sezon 3</div><div class="eui-promo__sub">Altın kart · 10 kademe</div></div></div><div class="eui-promo__foot"><div class="eui-bar" data-v="40"><i class="eui-bar__fill"></i></div><span>4 / 10</span><span class="eui-promo__time"><i data-i="clock"></i>6g 4s</span></div></div>
  <div class="eui-promo eui-t-info"><span class="eui-dot"></span><div class="eui-promo__head"><span class="eui-promo__icon"><i data-i="snow"></i></span><div class="eui-promo__text"><div class="eui-promo__title">Kar fırtınası</div><div class="eui-promo__sub">Etkinlik · 2× ödül</div></div></div></div>
</div>
```

## app.shortcuts — Kısayollar
Görevler, ödüller, sıralama gibi yan kısayollar: ikon + kısa ad + eui-dot. --cols sütun sayısı.
JS: `—`

```html
<div class="eui-shortcuts"><button class="eui-shortcut"><i data-i="scroll"></i><span>Görevler</span><span class="eui-dot">2</span></button><button class="eui-shortcut eui-t-gold"><i data-i="gift"></i><span>Ödüller</span><span class="eui-dot">1</span></button><button class="eui-shortcut"><i data-i="trophy"></i><span>Sıralama</span></button><button class="eui-shortcut"><i data-i="friend"></i><span>Arkadaşlar</span></button></div>
```

## app.navbar — Alt gezinme çubuğu
Lobinin sekme çubuğu: ikon + ad + eui-dot; seçili is-active, kilitli is-locked (+ kilit ikonu eui-navbar__lock). Dikeyde ekran genişliğine yayılır.
JS: `—`

```html
<nav class="eui-navbar"><button class="eui-navbar__item is-active"><i data-i="home"></i><span>Lobi</span></button><button class="eui-navbar__item"><i data-i="store"></i><span>Mağaza</span></button><button class="eui-navbar__item"><i data-i="backpack"></i><span>Envanter</span><span class="eui-dot">3</span></button><button class="eui-navbar__item is-locked"><i data-i="crew"></i><span>Klan</span><i data-i="lock" class="eui-navbar__lock"></i></button></nav>
```

## app.cta — Büyük eylem düğmesi
Oyna gibi ana eylem (eui-btn--primary ile aynı düz vurgu rengi) ve eui-cta--alt ikincil (mod / bölüm seç). is-busy beklerken (ikon döner, basılamaz).
JS: `el.classList.add('is-busy')`

```html
<div class="eui-flex eui-gap-3"><button class="eui-cta eui-cta--alt"><i data-i="map"></i><span class="eui-cta__main"><b>Bölüm</b><small>Buz Vadisi 3-2</small></span></button><button class="eui-cta"><i data-i="play"></i><span class="eui-cta__main"><b>Oyna</b><small>Dereceli · 2v2</small></span></button></div>
```
