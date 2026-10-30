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
| Dil seçimi | `EUI.language({ value })` → kod |
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
  lang = await EUI.language({ value: lang });
}
var user = await EUI.auth({ mode: 'login', name: 'Snowball', methods: ['email', 'guest', 'google'] });
if (user.method === 'guest' && !user.name) user.name = await EUI.nickname({ suggest: names });
var lobby = EUI.Lobby({ … });
// yetkili menüsü: if (await EUI.pin({ verify: isAdminPin })) adminMenu.open();
```
