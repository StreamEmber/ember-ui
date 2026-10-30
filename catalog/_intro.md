# MHud {{version}} — AI kılavuzu

Oyun modları (StreamEmber overlay: GTA V, RDR2), OBS kaynakları ve HTML5 oyunlar için **tek görünümlü** HUD ve arayüz kiti (saf CSS + küçük JS).
**Bu dosyayı baştan sona oku. Kitin kaynak kodunu açma.** Bir bileşen lazımsa aşağıdaki dizinden varyantı seç, yalnız o ailenin `ai/<aile>.md` dosyasını aç, HTML'i olduğu gibi kopyala ya da gösterilen `MH.*` çağrısını kullan.

## Altın kurallar

1. **Kitte olanı yeniden yazma.** Menü, satır, kart, katman, perde, modal, bildirim, sayaç, hasar sayısı, kırmızı ekran, kırpma kılavuzu… hepsi kitte var. Önce "İhtiyaç → bileşen" tablosuna ve API dizinine bak.
2. **Tam ekran menü = `MH.Menu`.** Menü HTML'i elle yazılmaz; bölümler ve veri verilir. Ayrıntı: `ai/menu.md` (Menü kuralları).
3. **Tek görünüm.** Tema yok (`data-mh-theme`, `MH.theme` 3.0'da kaldırıldı). Oyuna göre değişen tek şey vurgu rengi: `data-mh-accent` / `MH.accent()`.
4. **`mh-*` sınıflarını ezme.** Kitin bir sınıfına CSS yazma, `!important` kullanma, kendi `mh-` sınıfını uydurma.
5. **Renk sabit yazma.** Ton sınıfı (`mh-t-*`) ya da `rgb(var(--mh-…-rgb) / a)`. Yalnız siyah/beyaz gölge ve perde serbest.
6. **Satır içi stil yalnız belgelenmiş değişkenler için:** `--w`, `--h`, `--v`, `--cols`, `--ratio`, `--core`, `--a`… Yerleşim için `mh-flex`, `mh-col`, `mh-gap-*`, `mh-pad*` (bkz. `base.utils`).
7. **Varyant yoksa uydurma.** Önce yakın varyantı ton/boy sınıflarıyla uyarla. Olmuyorsa (ve yalnız o zaman) genişletme kuralına uy ve kullanıcıya kitte neyin eksik olduğunu söyle.
8. **Davranışı kit yapar.** Değer güncellemede `MH.bar/ring/pips/count/money` çağır; `left/top/width` yazma (titreşim yapar). Oyunla konuşmada `MH.on` / `MH.post` kullan; kendi köprünü, yönlendiricini, ölçekleyicini yazma.

## Sayfa iskeleti (overlay modu)

```html
<!doctype html>
<html lang="tr" class="mh-overlay">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v{{version}}/dist/mhud.min.css">
</head>
<body class="mh" data-mh-accent="mint">
  <div class="mh-screen">
    <div class="mh-world"></div>                      <!-- isim etiketi, işaretçi, hasar sayısı katmanı (gerekirse) -->
    <div class="mh-anchor mh-bl"> … HUD parçaları … </div>
    <div class="mh-anchor mh-tr"><div class="mh-toasts" data-mh="toasts"></div></div>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v{{version}}/dist/mhud.min.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

```js
// app.js — tek dosya, yalnız veri bağlama
MH.autoScale();                                        // 1080p referans + oyun yüksekliğine sığdırma (atlas boşluğu dahil)
var menu = MH.Menu({ title: 'Mod adı', post: 'menu', sections: [ … ] });
MH.on('hud', function (d) { MH.bar('#hp', d.hp); MH.money('#cash', d.cash); });
MH.on('menu', function (d) { d.open ? menu.open(d.section) : menu.close(); });
MH.on('toast', MH.toast);
MH.post('ready', { app: 'mod-adı' });                  // sayfa → oyun: streamember.post({ cb: 'ready', data })
```

- Sürümü her zaman sabit yaz (`@v{{version}}`; `@latest`, `@main` yok).
- `html.mh-overlay` overlay sayfasını saydam yapar ve CEF'te pahalı olan cam bulanıklığını kapatır. OBS / normal sayfada bu sınıfı koyma.
- Oyun → sayfa mesajı `{ action, data }` biçimindedir ve `MH.on(action, fn)`'e gelir; `{ action: 'mhud', fn: 'toast', args: [{…}] }` doğrudan izinli bir `MH.*` çağırır. Sayfa → oyun `MH.post(cb, data)`. Köprü yoksa (normal tarayıcı) sayfa yine açılır; `?mhdebug=1` her mesajı konsola yazar.
- Sonradan eklenen HTML'e `MH.mount(kapsayıcı)` çağır (ikon, halka, bar, segment, sekme kurulumu). `MH.Menu` ve `MH.*` fabrikaları bunu kendisi yapar.
- Yerleşim: `.mh-screen` içine `.mh-anchor` + köşe (`mh-tl mh-tc mh-tr mh-ml mh-mc mh-mr mh-bl mh-bc mh-br`). Tıklanacak parça `.mh-catch` içinde olmalı (`.mh-screen` tıklamaları oyuna geçirir; `MH.Menu` ve pencereler bunu kendisi yapar).
- Kare/dikey yayın kırpması: `MH.crop('vertical')`; ayrıntı `stream.crop`.

## Renk

- Vurgu: `data-mh-accent="crimson|mint|ice|violet|rose|cyan|lime|gold|tiktok"` (boş = amber). Koddan `MH.accent('mint')`.
- Ton sınıfları rengi belirler: `mh-t-health mh-t-armor mh-t-stamina mh-t-special mh-t-oxygen mh-t-hunger mh-t-thirst mh-t-stress mh-t-accent mh-t-success mh-t-info mh-t-warn mh-t-danger mh-t-legendary mh-t-gold mh-t-silver mh-t-bronze mh-t-neutral mh-t-team1 mh-t-team2 mh-t-team3 mh-t-team4 mh-t-team5 mh-t-friend mh-t-enemy mh-t-xp`.
- Durumlar `is-*` (`is-active`, `is-low`, `is-locked`…), boyutlar `--sm/--lg`. Gizlemek için `mh-hidden` sınıfı.

## İhtiyaç → bileşen

| İhtiyaç | Kullan |
|---|---|
| Tam ekran menü: envanter, mağaza, silahçı, garaj, ayarlar, ekip listesi, görevler | `MH.Menu` → `ai/menu.md` |
| Ekip / davet / kasa / kanal / arkadaş / takas menüsü | `MH.Social` (hazır, `MH.Menu` üstünde) |
| Evet-hayır, metin, listeden seçim, sayı, nesne üstü eylemler, silah çarkı | `MH.confirm`, `MH.input`, `MH.choose`, `MH.amount`, `MH.context`, `MH.radial` |
| Can, zırh, stamina, açlık/susuzluk | `vitals` (+ `vitals.needs`) |
| İki taraf sayacı (müttefik / düşman, sahada / sırada) | `stream.statbar` çipleri `mh-t-friend` / `mh-t-enemy` + `MH.stat`; takım skoru için `combat.versus`; ekrandaki düşman sınırı `combat.enemies` |
| Boss, dalga, hedef, XP, kanal, ele geçirme, yükleme çubukları | `bars` |
| Oyuncu / NPC başı etiketi | `tags` + `MH.Nametags(world)` |
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

Kitte gerçekten yoksa: özel stil **tek dosyada** (`x.css`), **yalnız `x-` önekli** sınıflarla, **yalnız token** renkleriyle yazılır; her bloğun üstüne `/* kitte yok: <ne, neden> */` yazılır. `mh-*` sınıfı ezilmez, kitin hazır yapısının (menü, satır, katman, modal, toast) kopyası yazılmaz.
Denetim: `curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v{{version}}/tools/lint.mjs && node lint.mjs <web klasörü>` — hata kalmamalı.

## API dizini

Bileşen fabrikalarının ayrıntısı ilgili ailede; burada her public ad bir satır.

**Kurulum ve köprü** — `MH.mount(kök?)` bildirimsel parçaları kurar · `MH.autoScale({ base: 1080, scale })` ölçek + oyun yüksekliği; `{ set(ölçek) }` döner (HUD ölçeği ayarı için bunu çağır, yeniden kurma) · `MH.accent(ad, kapsam?)` vurgu · `MH.on(ad, fn)` / `MH.off(ad, fn)` / `MH.emit(ad, veri)` olaylar · `MH.post(cb, veri)` sayfa → oyun · `MH.route(mesaj)` bir mesajı elle yönlendir · `MH.rpcAllow` oyundan doğrudan çağrılabilen adlar · `MH.bridge` (`window.streamember` ya da null) · `MH.debug` (`?mhdebug=1`) · `MH.connect(wsUrl)` WebSocket köprüsü (OBS / HTML5; `MH.post`'u sokete çevirir) · `MH.Atlas(action)` isim etiketlerini oyunun yerel çerçevesinde çizdiren atlas köprüsü (oyun `{ reset, layout, set, clear }` yollar).

**Menü ve pencereler** — `MH.Menu(host?, spec)` → `ai/menu.md` · `MH.Social(host, opts)` · `MH.trade(o)` takas penceresi · `MH.modal(o)` genel pencere (Promise) · `MH.confirm(o)` → bool · `MH.input(o)` → metin · `MH.choose(o)` → id / [id] · `MH.amount(o)` → sayı · `MH.modalOpen()` · `MH.closeModals()` · `MH.context(x, y, items, o)` · `MH.closeContext()` · `MH.radial(el, items, o)`.

**Değerler** (bar ve halkalar yalnız çizimi günceller; yanındaki sayı metnini sen yaz ya da `MH.count` kullan) — `MH.bar(el, v, { critical })` · `MH.ring(el, 0..1)` · `MH.core(el, { value, core })` · `MH.pips(el, dolu, toplam)` · `MH.count(el, sayı)` · `MH.money(el, tutar)` · `MH.stat(kök, anahtar, değer)` (`[data-stat]`) · `MH.streak(el, sayı, o)` · `MH.history(el, ['W','L'])` · `MH.timer(el, saniye, { urgent, onEnd })` · `MH.zone(el, saniye)` · `MH.hold(el, { duration, onDone })` → `{ start, stop }` · `MH.enemies(el, { onScreen, queued, max })` (max = ekrandaki düşman sınırı; yaklaşınca `is-swarm`) · `MH.compass(el, derece, işaretler)` · `MH.cardinals({ 0: 'N', … })` pusula harfleri · `MH.speedo(el, { speed, rpm, gear })` · `MH.sparkline(el, değerler)` · `MH.bars(el, satırlar)` · `MH.columns(el, satırlar)`.

**Akış ve efekt** — `MH.toast(o)` · `MH.kill(o)` · `MH.gift(o)` · `MH.social(o)` (katıldı/takip etti satırı) · `MH.announce(o)` · `MH.banner(o)` · `MH.levelUp(o)` · `MH.achievement(o)` · `MH.pickup(o)` · `MH.countdown(n, o)` · `MH.subtitle(o)` · `MH.progress(o)` · `MH.loot(o)` · `MH.horde(o)` · `MH.infected(o)` · `MH.skillCheck(el, o)` · `MH.qte(el, tuşlar, o)` · `MH.hit(el?, tür)` · `MH.damageFrom(el?, açı)` · `MH.flash(el?, kırmızı)` · `MH.vignette(el, can)` · `MH.damageNumber(world, { x, y, value, kind })` · `MH.crop(mod, o)` · `MH.cropGuide(el?, açık, platform)`.

**Dünya katmanı** — `MH.Nametags(world, opts).update([{ id, x, y, name, … }])` · `MH.Markers(world).update([{ id, x, y, icon, label, dist }])` · `MH.Pool(world, yap, boya)` ikisinin ortak havuzu (doğrudan gerekmez). `world` = `.mh-world`.

**Yardımcılar** — `MH.icon(ad)` · `MH.weapon(ad)` · `MH.art(değer)` (emoji | `i:ikon` | `w:silah` | resim adresi) · `MH.avatar(ad, o)` · `MH.initials(ad)` · `MH.fmt(sayı)` · `MH.compact(sayı)` (12,4 B · 1,2 Mn) · `MH.time(saniye)` · `MH.esc(metin)` · `MH.el(etiket, sınıf, html)` · `MH.$(seçici)` / `MH.$$(seçici)` · `MH.clamp(v, a, b)` · `MH.bump(el)` küçük zıplama · `MH.ringSvg(r)` halka svg'si.
