# Ember UI {{version}} — AI kılavuzu

Oyun modları (StreamEmber overlay: GTA V, RDR2), OBS kaynakları, HTML5 oyunlar ve mobil / PC oyunların ekranları (lobi, açılış, ayarlar, mağaza) için **tek görünümlü** arayüz kiti (saf CSS + küçük JS). PC'de, yatay ve dikey telefonda aynı çağrı çalışır.
> **Ember.js ile ilgisi yoktur.** Ember UI, StreamEmber'in kendi kitidir (eski adı MHud). Sınıflar `eui-`, CSS değişkenleri `--eui-`, öznitelikler `data-eui-*`, JS global `EUI`. Eski `mh-` / `MH` adlarını görürsen ya da yazmak üzereysen dur: onlar kaldırıldı.
**Bu dosyayı baştan sona oku. Kitin kaynak kodunu açma.** Bir bileşen lazımsa aşağıdaki dizinden varyantı seç, yalnız o ailenin `ai/<aile>.md` dosyasını aç, HTML'i olduğu gibi kopyala ya da gösterilen `EUI.*` çağrısını kullan.

## Altın kurallar

1. **Kitte olanı yeniden yazma.** Menü, satır, kart, katman, perde, modal, bildirim, sayaç, hasar sayısı, kırmızı ekran, kırpma kılavuzu… hepsi kitte var. Önce "İhtiyaç → bileşen" tablosuna ve API dizinine bak.
2. **Ekranlar hazır çağrıdır.** Lobi `EUI.Lobby`, başlık `EUI.title`, yükleme `EUI.loading`, hata / bakım / bağlantı `EUI.state`, giriş / kayıt / yayıncı girişi `EUI.auth`, koşullar `EUI.consent`, dil `EUI.language`, oyuncu adı `EUI.nickname`, PIN / yetkili kilidi `EUI.pin`, tam ekran menü (mağaza, envanter, ayarlar…) `EUI.Menu`. HTML'leri elle yazılmaz; veri verilir. Ayrıntı: `ai/app.md` (Ekran kuralları), `ai/menu.md` (Menü kuralları).
3. **Tek görünüm.** Tema yok (`data-eui-theme`, `EUI.theme` 3.0'da kaldırıldı). Oyuna göre değişen tek şey vurgu rengi: `data-eui-accent` / `EUI.accent()`.
4. **`eui-*` sınıflarını ezme.** Kitin bir sınıfına CSS yazma, `!important` kullanma, kendi `eui-` sınıfını uydurma.
5. **Renk sabit yazma.** Ton sınıfı (`eui-t-*`) ya da `rgb(var(--eui-…-rgb) / a)`. Yalnız siyah/beyaz gölge ve perde serbest.
6. **Satır içi stil yalnız belgelenmiş değişkenler için:** `--w`, `--h`, `--v`, `--cols`, `--ratio`, `--core`, `--a`… Yerleşim için `eui-flex`, `eui-col`, `eui-gap-*`, `eui-pad*` (bkz. `base.utils`).
7. **Varyant yoksa uydurma.** Önce yakın varyantı ton/boy sınıflarıyla uyarla. Olmuyorsa (ve yalnız o zaman) genişletme kuralına uy ve kullanıcıya kitte neyin eksik olduğunu söyle.
8. **Davranışı kit yapar.** Değer güncellemede `EUI.bar/ring/pips/count/money` çağır; `left/top/width` yazma (titreşim yapar). Oyunla konuşmada `EUI.on` / `EUI.post` kullan; kendi köprünü, yönlendiricini, ölçekleyicini yazma.
9. **Dil `lang` ile verilir, yazı tipi verilmez.** Sayfada `<html lang="tr">` (oyunun dili; çalışırken `EUI.lang('vi')`). Bu tek değer büyük harfi (Türkçe i → İ), sayı biçimini (`EUI.fmt`, `EUI.compact`) ve Çince / Japonca / Korece / Arapça / Tayca / Hintçe yazı tipini seçer. Kendi `font-family`'ni, web fontunu, `text-transform` ya da `toUpperCase()` kodunu yazma; JS'te büyük / küçük harf için `EUI.upper` / `EUI.lower`. Metinler oyunun çeviri tablosundan gelir; kit yalnız görünümü taşır. Ayrıntı ve örnek: galeride "Diller ve yazı tipleri".

## Sayfa iskeleti (overlay modu)

```html
<!doctype html>
<html lang="tr" class="eui-overlay">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v{{version}}/dist/ember-ui.min.css">
</head>
<body class="eui" data-eui-accent="mint">
  <div class="eui-screen">
    <div class="eui-world"></div>                      <!-- isim etiketi, işaretçi, hasar sayısı katmanı (gerekirse) -->
    <div class="eui-anchor eui-bl"> … HUD parçaları … </div>
    <div class="eui-anchor eui-tr"><div class="eui-toasts" data-eui="toasts"></div></div>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v{{version}}/dist/ember-ui.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

```js
// app.js — tek dosya, yalnız veri bağlama
EUI.autoScale();                                        // 1080p referans + oyun yüksekliğine sığdırma (atlas boşluğu dahil)
var menu = EUI.Menu({ title: 'Mod adı', post: 'menu', sections: [ … ] });
EUI.on('hud', function (d) { EUI.bar('#hp', d.hp); EUI.money('#cash', d.cash); });
EUI.on('menu', function (d) { d.open ? menu.open(d.section) : menu.close(); });
EUI.on('toast', EUI.toast);
EUI.post('ready', { app: 'mod-adı' });                  // sayfa → oyun: streamember.post({ cb: 'ready', data })
```

- Sürümü her zaman sabit yaz (`@v{{version}}`; `@latest`, `@main` yok).
- `html.eui-overlay` overlay sayfasını saydam yapar ve CEF'te pahalı olan cam bulanıklığını kapatır. OBS / normal sayfada bu sınıfı koyma.
- Oyun → sayfa mesajı `{ action, data }` biçimindedir ve `EUI.on(action, fn)`'e gelir; `{ action: 'ember-ui', fn: 'toast', args: [{…}] }` doğrudan izinli bir `EUI.*` çağırır. Sayfa → oyun `EUI.post(cb, data)`. Köprü yoksa (normal tarayıcı) sayfa yine açılır; `?mhdebug=1` her mesajı konsola yazar.
- Sonradan eklenen HTML'e `EUI.mount(kapsayıcı)` çağır (ikon, halka, bar, segment, sekme kurulumu). `EUI.Menu` ve `EUI.*` fabrikaları bunu kendisi yapar.
- Yerleşim: `.eui-screen` içine `.eui-anchor` + köşe (`eui-tl eui-tc eui-tr eui-ml eui-mc eui-mr eui-bl eui-bc eui-br`). Tıklanacak parça `.eui-catch` içinde olmalı (`.eui-screen` tıklamaları oyuna geçirir; `EUI.Menu` ve pencereler bunu kendisi yapar).
- Kare/dikey yayın kırpması: `EUI.crop('vertical')`; ayrıntı `stream.crop`.

## Renk

- Vurgu: `data-eui-accent="crimson|mint|ice|violet|rose|cyan|lime|gold|tiktok"` (boş = amber). Koddan `EUI.accent('mint')`.
- Ton sınıfları rengi belirler: `eui-t-health eui-t-armor eui-t-stamina eui-t-special eui-t-oxygen eui-t-hunger eui-t-thirst eui-t-stress eui-t-accent eui-t-success eui-t-info eui-t-warn eui-t-danger eui-t-legendary eui-t-gold eui-t-silver eui-t-bronze eui-t-neutral eui-t-team1 eui-t-team2 eui-t-team3 eui-t-team4 eui-t-team5 eui-t-friend eui-t-enemy eui-t-xp`.
- Durumlar `is-*` (`is-active`, `is-low`, `is-locked`…), boyutlar `--sm/--lg`. Gizlemek için `eui-hidden` sınıfı.

## İhtiyaç → bileşen

| İhtiyaç | Kullan |
|---|---|
| Oyunun ana ekranı (lobi) | `EUI.Lobby` → `ai/app.md` |
| Başlık, yükleme, ağ hatası, çevrimdışı, bakım, güncelleme, oturum bitti, bağlanıyor | `EUI.title`, `EUI.loading`, `EUI.state` → `ai/app.md` |
| Giriş, kayıt, hesap bağlama, şifre sıfırlama, yayıncı girişi (QR), misafir / Google / Apple | `EUI.auth` → `ai/app.md` |
| Kullanım koşulları / yaş onayı, dil seçimi, oyuncu adı, PIN / ebeveyn / yetkili kilidi | `EUI.consent`, `EUI.language`, `EUI.nickname`, `EUI.pin` → `ai/app.md` |
| Tam ekran menü: envanter, mağaza, silahçı, garaj, ayarlar, ekip listesi, görevler | `EUI.Menu` → `ai/menu.md` |
| Ekip / davet / kasa / kanal / arkadaş / takas menüsü | `EUI.Social` (hazır, `EUI.Menu` üstünde) |
| Evet-hayır, metin, listeden seçim, sayı, nesne üstü eylemler, silah çarkı | `EUI.confirm`, `EUI.input`, `EUI.choose`, `EUI.amount`, `EUI.context`, `EUI.radial` |
| Can, zırh, stamina, açlık/susuzluk | `vitals` (+ `vitals.needs`) |
| İki taraf sayacı (müttefik / düşman, sahada / sırada) | `stream.statbar` çipleri `eui-t-friend` / `eui-t-enemy` + `EUI.stat`; takım skoru için `combat.versus`; ekrandaki düşman sınırı `combat.enemies` |
| Boss, dalga, hedef, XP, kanal, ele geçirme, yükleme çubukları | `bars` |
| Oyuncu / NPC başı etiketi | `tags` + `EUI.Nametags(world)` |
| Para, aranma, saat-hava, seviye-XP, etkiler, seri | `economy` |
| Silah, cephane, yuva şeridi, envanter ızgarası, teçhizat | `gear` |
| Ekip üyeleri (HUD kartı, satır, emir çubuğu, binek) | `crew` |
| Mağaza ürün kutucuğu, satın alma paneli, sepet (menü dışı) | `shop` |
| Pusula, minimap çerçevesi, işaretçi, hedef oku | `location` |
| Hız göstergesi, yakıt, lambalar | `vehicle` |
| Toast, ölüm akışı, duyuru, seviye atlama, altyazı, sohbet, kayan şerit | `feed` |
| Nişangâh, vuruş, hasar yönü, kırmızı kenar, yüzen hasar, istem, diyalog, görev takibi | `combat` |
| Skor tablosu, podyum, ölüm / sonuç / yükleme ekranı | `menu` |
| İzleyici oylaması, canlı sayaç, hediye, kırpma | `stream` |
| Sürü uyarısı, canlandırma, ganimet, beceri kontrolü | `survival` |
| Grafik, istatistik panosu, etkinlik, maç geçmişi | `extras` |
| Düğme, alan, rozet, tablo, sekme, yardımcı sınıflar | `base` |

## Genişletme (son çare)

Kitte gerçekten yoksa: özel stil **tek dosyada** (`x.css`), **yalnız `x-` önekli** sınıflarla, **yalnız token** renkleriyle yazılır; her bloğun üstüne `/* kitte yok: <ne, neden> */` yazılır. `eui-*` sınıfı ezilmez, kitin hazır yapısının (menü, satır, katman, modal, toast) kopyası yazılmaz.
Denetim: `curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v{{version}}/tools/lint.mjs && node lint.mjs <web klasörü>` — hata kalmamalı.

## API dizini

Bileşen fabrikalarının ayrıntısı ilgili ailede; burada her public ad bir satır.

**Kurulum ve köprü** — `EUI.mount(kök?)` bildirimsel parçaları kurar · `EUI.autoScale({ base: 1080, scale })` ölçek (kısa kenar = base; telefon / tablet için `base: 540`) + oyun yüksekliği; `{ set(ölçek) }` döner (HUD ölçeği ayarı için bunu çağır, yeniden kurma) · `EUI.accent(ad, kapsam?)` vurgu · `EUI.on(ad, fn)` / `EUI.off(ad, fn)` / `EUI.emit(ad, veri)` olaylar · `EUI.post(cb, veri)` sayfa → oyun · `EUI.route(mesaj)` bir mesajı elle yönlendir · `EUI.rpcAllow` oyundan doğrudan çağrılabilen adlar · `EUI.bridge` (`window.streamember` ya da null) · `EUI.debug` (`?mhdebug=1`) · `EUI.connect(wsUrl)` WebSocket köprüsü (OBS / HTML5; `EUI.post`'u sokete çevirir) · `EUI.Atlas(action)` isim etiketlerini oyunun yerel çerçevesinde çizdiren atlas köprüsü (oyun `{ reset, layout, set, clear }` yollar).

**Oyun ekranları** — `EUI.Lobby(host?, spec)` → `{ update, set, show, hide, destroy }` · `EUI.title(host?, o)` → Promise · `EUI.loading(host?, o)` → `{ progress, tip, close }` · `EUI.state(tür, o)` → Promise(düğme id) + `.close(v)` · `EUI.states` hazır durum metinleri (değiştirilebilir) · `EUI.auth(host?, o)` → Promise(sonuç | null) + `.error(msg)` `.done(v)` `.busy(on)` `.el` · `EUI.consent(host?, o)` → Promise(onaylar | false) · `EUI.language(host?, o)` → Promise(kod | null), `EUI.languages` hazır liste · `EUI.nickname(host?, o)` → Promise(ad | null) · `EUI.pin(host?, o)` → Promise(kod | null) → `ai/app.md`.

**Menü ve pencereler** — `EUI.Menu(host?, spec)` → `ai/menu.md` · `EUI.Social(host, opts)` · `EUI.trade(o)` takas penceresi · `EUI.modal(o)` genel pencere (Promise) · `EUI.confirm(o)` → bool · `EUI.input(o)` → metin · `EUI.choose(o)` → id / [id] · `EUI.amount(o)` → sayı · `EUI.modalOpen()` · `EUI.closeModals()` · `EUI.context(x, y, items, o)` · `EUI.closeContext()` · `EUI.radial(el, items, o)`.

**Değerler** (bar ve halkalar yalnız çizimi günceller; yanındaki sayı metnini sen yaz ya da `EUI.count` kullan) — `EUI.bar(el, v, { critical })` · `EUI.ring(el, 0..1)` · `EUI.core(el, { value, core })` · `EUI.pips(el, dolu, toplam)` · `EUI.count(el, sayı)` · `EUI.money(el, tutar)` · `EUI.stat(kök, anahtar, değer)` (`[data-stat]`) · `EUI.streak(el, sayı, o)` · `EUI.history(el, ['W','L'])` · `EUI.timer(el, saniye, { urgent, onEnd })` · `EUI.zone(el, saniye)` · `EUI.hold(el, { duration, onDone })` → `{ start, stop }` · `EUI.enemies(el, { onScreen, queued, max })` (max = ekrandaki düşman sınırı; yaklaşınca `is-swarm`) · `EUI.compass(el, derece, işaretler)` · `EUI.cardinals({ 0: 'N', … })` pusula harfleri · `EUI.speedo(el, { speed, rpm, gear })` · `EUI.sparkline(el, değerler)` · `EUI.bars(el, satırlar)` · `EUI.columns(el, satırlar)`.

**Akış ve efekt** — `EUI.toast(o)` · `EUI.kill(o)` · `EUI.gift(o)` · `EUI.social(o)` (katıldı/takip etti satırı) · `EUI.announce(o)` · `EUI.banner(o)` · `EUI.levelUp(o)` · `EUI.achievement(o)` · `EUI.pickup(o)` · `EUI.countdown(n, o)` · `EUI.subtitle(o)` · `EUI.progress(o)` · `EUI.loot(o)` · `EUI.horde(o)` · `EUI.infected(o)` · `EUI.skillCheck(el, o)` · `EUI.qte(el, tuşlar, o)` · `EUI.hit(el?, tür)` · `EUI.damageFrom(el?, açı)` · `EUI.flash(el?, kırmızı)` · `EUI.vignette(el, can)` · `EUI.damageNumber(world, { x, y, value, kind })` · `EUI.crop(mod, o)` · `EUI.cropGuide(el?, açık, platform)`.

**Dünya katmanı** — `EUI.Nametags(world, opts).update([{ id, x, y, name, … }])` · `EUI.Markers(world).update([{ id, x, y, icon, label, dist }])` · `EUI.Pool(world, yap, boya)` ikisinin ortak havuzu (doğrudan gerekmez). `world` = `.eui-world`.

**Yardımcılar** — `EUI.icon(ad)` · `EUI.weapon(ad)` · `EUI.art(değer)` (emoji | `i:ikon` | `w:silah` | resim adresi) · `EUI.avatar(ad, o)` · `EUI.initials(ad)` · `EUI.lang(kod?)` sayfa dili (okur / `<html lang>` yazar; `lang` olayı) · `EUI.upper(metin)` / `EUI.lower(metin)` dile göre büyük / küçük harf · `EUI.fmt(sayı, ondalık)` dile göre (rakamlar her dilde 0-9) · `EUI.compact(sayı)` (tr 12,5 B · en 12.5K · zh 1.2萬) · `EUI.time(saniye)` · `EUI.esc(metin)` · `EUI.el(etiket, sınıf, html)` · `EUI.$(seçici)` / `EUI.$$(seçici)` · `EUI.clamp(v, a, b)` · `EUI.bump(el)` küçük zıplama · `EUI.ringSvg(r)` halka svg'si.
