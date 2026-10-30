## Ekran kuralları (önce bunu oku)

1. **Oyunun ekranları hazır çağrıdır.** Lobi → `EUI.Lobby`, başlık → `EUI.title`, yükleme → `EUI.loading`, bağlantı / hata / bakım / güncelleme → `EUI.state(tür)`. Bu ekranların HTML'ini elle yazma, kendi `*-lobby`, `*-topbar`, `*-navbar` sınıfını uydurma.
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
| Mağaza, envanter, ayarlar, posta… | `EUI.Menu` → `ai/menu.md` |

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

### Açılış akışı

```js
EUI.autoScale({ base: 540 });                                    // telefon
await EUI.title({ name: 'Snowball', version: '1.4.2' });
var ld = EUI.loading({ title: 'Snowball', tips: [...] });
ld.progress(.3, 'Sunucuya bağlanılıyor');
while (!(await connect())) await EUI.state('network-error', { code: 'NET-503' });   // kullanıcı 'retry' der
ld.progress(1, 'Hazır'); ld.close();
var lobby = EUI.Lobby({ … });
```
