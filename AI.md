# Ember UI 4.2.1 — AI kılavuzu

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

## Sayfa iskeleti (overlay modu)

```html
<!doctype html>
<html lang="tr" class="eui-overlay">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/dist/ember-ui.min.css">
</head>
<body class="eui" data-eui-accent="mint">
  <div class="eui-screen">
    <div class="eui-world"></div>                      <!-- isim etiketi, işaretçi, hasar sayısı katmanı (gerekirse) -->
    <div class="eui-anchor eui-bl"> … HUD parçaları … </div>
    <div class="eui-anchor eui-tr"><div class="eui-toasts" data-eui="toasts"></div></div>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/dist/ember-ui.min.js"></script>
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

- Sürümü her zaman sabit yaz (`@v4.2.1`; `@latest`, `@main` yok).
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
Denetim: `curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/tools/lint.mjs && node lint.mjs <web klasörü>` — hata kalmamalı.

## API dizini

Bileşen fabrikalarının ayrıntısı ilgili ailede; burada her public ad bir satır.

**Kurulum ve köprü** — `EUI.mount(kök?)` bildirimsel parçaları kurar · `EUI.autoScale({ base: 1080, scale })` ölçek (kısa kenar = base; telefon / tablet için `base: 540`) + oyun yüksekliği; `{ set(ölçek) }` döner (HUD ölçeği ayarı için bunu çağır, yeniden kurma) · `EUI.accent(ad, kapsam?)` vurgu · `EUI.on(ad, fn)` / `EUI.off(ad, fn)` / `EUI.emit(ad, veri)` olaylar · `EUI.post(cb, veri)` sayfa → oyun · `EUI.route(mesaj)` bir mesajı elle yönlendir · `EUI.rpcAllow` oyundan doğrudan çağrılabilen adlar · `EUI.bridge` (`window.streamember` ya da null) · `EUI.debug` (`?mhdebug=1`) · `EUI.connect(wsUrl)` WebSocket köprüsü (OBS / HTML5; `EUI.post`'u sokete çevirir) · `EUI.Atlas(action)` isim etiketlerini oyunun yerel çerçevesinde çizdiren atlas köprüsü (oyun `{ reset, layout, set, clear }` yollar).

**Oyun ekranları** — `EUI.Lobby(host?, spec)` → `{ update, set, show, hide, destroy }` · `EUI.title(host?, o)` → Promise · `EUI.loading(host?, o)` → `{ progress, tip, close }` · `EUI.state(tür, o)` → Promise(düğme id) + `.close(v)` · `EUI.states` hazır durum metinleri (değiştirilebilir) · `EUI.auth(host?, o)` → Promise(sonuç | null) + `.error(msg)` `.done(v)` `.busy(on)` `.el` · `EUI.consent(host?, o)` → Promise(onaylar | false) · `EUI.language(host?, o)` → Promise(kod | null), `EUI.languages` hazır liste · `EUI.nickname(host?, o)` → Promise(ad | null) · `EUI.pin(host?, o)` → Promise(kod | null) → `ai/app.md`.

**Menü ve pencereler** — `EUI.Menu(host?, spec)` → `ai/menu.md` · `EUI.Social(host, opts)` · `EUI.trade(o)` takas penceresi · `EUI.modal(o)` genel pencere (Promise) · `EUI.confirm(o)` → bool · `EUI.input(o)` → metin · `EUI.choose(o)` → id / [id] · `EUI.amount(o)` → sayı · `EUI.modalOpen()` · `EUI.closeModals()` · `EUI.context(x, y, items, o)` · `EUI.closeContext()` · `EUI.radial(el, items, o)`.

**Değerler** (bar ve halkalar yalnız çizimi günceller; yanındaki sayı metnini sen yaz ya da `EUI.count` kullan) — `EUI.bar(el, v, { critical })` · `EUI.ring(el, 0..1)` · `EUI.core(el, { value, core })` · `EUI.pips(el, dolu, toplam)` · `EUI.count(el, sayı)` · `EUI.money(el, tutar)` · `EUI.stat(kök, anahtar, değer)` (`[data-stat]`) · `EUI.streak(el, sayı, o)` · `EUI.history(el, ['W','L'])` · `EUI.timer(el, saniye, { urgent, onEnd })` · `EUI.zone(el, saniye)` · `EUI.hold(el, { duration, onDone })` → `{ start, stop }` · `EUI.enemies(el, { onScreen, queued, max })` (max = ekrandaki düşman sınırı; yaklaşınca `is-swarm`) · `EUI.compass(el, derece, işaretler)` · `EUI.cardinals({ 0: 'N', … })` pusula harfleri · `EUI.speedo(el, { speed, rpm, gear })` · `EUI.sparkline(el, değerler)` · `EUI.bars(el, satırlar)` · `EUI.columns(el, satırlar)`.

**Akış ve efekt** — `EUI.toast(o)` · `EUI.kill(o)` · `EUI.gift(o)` · `EUI.social(o)` (katıldı/takip etti satırı) · `EUI.announce(o)` · `EUI.banner(o)` · `EUI.levelUp(o)` · `EUI.achievement(o)` · `EUI.pickup(o)` · `EUI.countdown(n, o)` · `EUI.subtitle(o)` · `EUI.progress(o)` · `EUI.loot(o)` · `EUI.horde(o)` · `EUI.infected(o)` · `EUI.skillCheck(el, o)` · `EUI.qte(el, tuşlar, o)` · `EUI.hit(el?, tür)` · `EUI.damageFrom(el?, açı)` · `EUI.flash(el?, kırmızı)` · `EUI.vignette(el, can)` · `EUI.damageNumber(world, { x, y, value, kind })` · `EUI.crop(mod, o)` · `EUI.cropGuide(el?, açık, platform)`.

**Dünya katmanı** — `EUI.Nametags(world, opts).update([{ id, x, y, name, … }])` · `EUI.Markers(world).update([{ id, x, y, icon, label, dist }])` · `EUI.Pool(world, yap, boya)` ikisinin ortak havuzu (doğrudan gerekmez). `world` = `.eui-world`.

**Yardımcılar** — `EUI.icon(ad)` · `EUI.weapon(ad)` · `EUI.art(değer)` (emoji | `i:ikon` | `w:silah` | resim adresi) · `EUI.avatar(ad, o)` · `EUI.initials(ad)` · `EUI.fmt(sayı)` · `EUI.compact(sayı)` (12,4 B · 1,2 Mn) · `EUI.time(saniye)` · `EUI.esc(metin)` · `EUI.el(etiket, sınıf, html)` · `EUI.$(seçici)` / `EUI.$$(seçici)` · `EUI.clamp(v, a, b)` · `EUI.bump(el)` küçük zıplama · `EUI.ringSvg(r)` halka svg'si.

## İkonlar

`<i data-i="ad">` / `icon: 'ad'` için geçerli 344 ad (başka ad boş çıkar): heart heart-o heart-half heart-broken heart-plus heartbeat revive shield shield-o shield-half armor bolt stamina run walk lungs droplet blood brain meat food apple bread bottle water moon sleep thermometer cold hot eye eye-off deadeye skull skull-crossbones dead ghost poison radiation biohazard virus bandage pill pills first-aid medkit syringe iv medication injured hospital mood angry cool pistol revolver rifle carbine smg shotgun sniper repeater bullets bullet magazine magazine-pistol grenade molotov dynamite bomb mine nuke flame fire-circle knife knife-military machete axe battle-axe sword swords bow crowbar bat hammer pickaxe fist boxing karate fencing crosshair scope target bullseye handcuffs flashlight binoculars lasso user users group user-plus user-minus user-shield friend ally enemy hostile police cop soldier sheriff cowboy outlaw spy ninja zombie alien robot boss detective worker medic hostage streamer viewer waiting search-user human rider horse dog cat bird fish snake spider rabbit bat-animal hat horseshoe cactus campfire tent lantern oil-lamp train gold poker cards dice whiskey beer cigar newspaper telegram letter feather pen scroll map compass treasure safe grave coffin church cross barn castle bugle anchor candle hook car car-sport bike heli plane boat ferry truck tank ambulance police-car siren gas fuel engine steering gauge battery seatbelt key lights tire wrench tool parachute cash coins coin bank wallet cart store tag gift gift-open diamond crown trophy medal podium ticket sale percent package box backpack star star-o star-circle xp sparkles confetti level-up chest flag flag-3 checkpoint pin spawn route distance location radar world home door door-open logout lock unlock pick timer hourglass clock alarm calendar history wave zone storm rain sun cloud fog snow wind sunset streak win loss kill death queue stats chart chart-line trending-up trending-down gamepad dice-multi chess puzzle lightbulb layers tiktok broadcast live mic mic-off volume volume-off speaker chat message bell bell-ring like dislike share phone wifi signal heart-hand follow camera music email send inbox swap handshake crew transfer check x plus minus chev-l chev-r chev-u chev-d chevs-r arrow-up arrow-down arrow-left arrow-right menu grid list search settings sliders info alert alert-circle circle-check circle-x ban refresh repeat play pause stop keyboard mouse pointer hand grab focus eye-on

Silah çizimleri (`<i data-weapon="ad">` / `weapon: 'ad'`): carbine smg pistol revolver shotgun repeater sniper

## Bileşen aileleri

### Oyun ekranları → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/app.md
- `app.lobby` Lobi (EUI.Lobby): Oyunun ana ekranı tek çağrı: profil, para birimleri, simge düğmeleri, kampanya kartları, ortada sahne, kısayollar, alt gezinme çubuğu, mod ve Oyna düğmesi
- `app.title` Başlık ekranı: Oyun adı ya da logo, 'Başlamak için dokun', sürüm ve sunucu
- `app.loading` Yükleme ekranı: Başlık, rozetler, dönen ipuçları ve ilerleme
- `app.state` Durum ekranları: EUI.state(tür, o) → Promise(düğme id)
- `app.auth` Giriş (EUI.auth): Oyun giriş ekranı veriyle: mode login | signup | link | reset | streamer; methods sırası görünümü verir (email ve qr sekme, guest / google / apple düğme)
- `app.auth-signup` Kayıt ve hesap bağlama: mode: 'signup' oyuncu adı + e-posta + şifre (en az 8) + koşul onayı (legal: true)
- `app.auth-streamer` Yayıncı girişi (QR): mode: 'streamer' StreamEmber hesabıyla bağlanma: qr sekmesi (qr.img resim ya da qr.code kod, qr.hint) + e-posta sekmesi
- `app.consent` Koşullar ve yaş onayı (EUI.consent): İlk açılışta kullanım koşulları, gizlilik, isteğe bağlı pazarlama onayı; age: 13 yaş satırı ekler
- `app.language` Dil seçimi (EUI.language): EUI.languages hazır liste (tr, en, vi, zh-TW, de, es, pt-BR, ru, ar, id; bayrak + yerel ad); languages ile daralt, value seçili kod
- `app.nickname` Oyuncu adı (EUI.nickname): İlk girişte ad seçimi: min / max uzunluk, sayaç, zar düğmesiyle öneri (suggest: dizi ya da fn), check(ad) → Promise(hata | null) ile sunucuda müsaitlik
- `app.pin` PIN / yetkili kilidi (EUI.pin): Ebeveyn kilidi, yetkili (admin) menüsü, satın alma onayı: length haneli tuş takımı, klavye de çalışır
- `app.currency` Para birimi çipi: İkon + miktar (+ üst sınır) + isteğe bağlı ekle düğmesi
- `app.profile` Profil çipi: Avatar + seviye rozeti + ad + XP barı
- `app.iconbtn` Simge düğmesi ve bildirim noktası: Kare dokunma düğmesi (52 px); sağ üstte eui-dot sayı ya da boş nokta
- `app.promo` Kampanya / sezon kartı: Sezon kartı, etkinlik, sınırlı teklif: ikon, başlık, alt satır, ilerleme, kalan süre
- `app.shortcuts` Kısayollar: Görevler, ödüller, sıralama gibi yan kısayollar: ikon + kısa ad + eui-dot
- `app.navbar` Alt gezinme çubuğu: Lobinin sekme çubuğu: ikon + ad + eui-dot; seçili is-active, kilitli is-locked (+ kilit ikonu eui-navbar__lock)
- `app.cta` Büyük eylem düğmesi: Oyna gibi ana eylem (eui-btn--primary ile aynı düz vurgu rengi) ve eui-cta--alt ikincil (mod / bölüm seç)

### Barlar → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/bars.md
- `bars.boss` Boss barı: Ekran üstü büyük bar: ad, aşama rozeti, iz (ghost), aşama çentikleri, ikinci kalkan barı
- `bars.wave` Dalga paneli: Hayatta kalma modu: dalga numarası, kalan düşman barı, sonraki dalga süresi
- `bars.goal` Hedef çubuğu: Bağış/beğeni hedefi: ikon, başlık, sayaç, bar ve ödül satırı
- `bars.challenge` Meydan okuma: Hedefli görev: başlık + sayaç, kilometre taşlı bar (eui-milestones içinde bar + konumlu i; on dolu), ödül sırası
- `bars.revive` Canlandırma: Düşen takım arkadaşını kaldırma ilerlemesi: başlık, bar, ipucu
- `bars.boss-slim` Boss barı (ince): Tek satırlık boss: ad solda, aşama sağda, altında çentikli ince bar
- `bars.boss-skew` Boss barı (eğik): Aksiyon oyunu boss'u: eğik kalın bar içinde ad ve yüzde (__text)
- `bars.boss-duo` Çift boss: İki boss karşılıklı: biri soldan, biri sağdan (eui-bar--rtl) dolar; ortada VS
- `bars.elite` Elit hedef barı: Küçük elit düşman için ad + ince kalkan barı; ekran kenarında çoklu sıralanır
- `bars.stagger` Sersemletme / denge: Boss'u sersemletmek için dolan bar: dolunca hasar penceresi
- `bars.xp-bar` Deneyim çubuğu: İki ucunda seviye numarası olan ince XP çubuğu; altta kalan XP
- `bars.cast` Kanal / yeniden doldurma: Etiket + süre + bar: büyü kanalı, yeniden doldurma, eşya kullanma
- `bars.capture` Ele geçirme ilerlemesi: Bölge ele geçirirken: bar ortadan iki yöne (eui-bar--center) takıma göre renk değiştirir
- `bars.tug` İpi çeken iki taraf: İki takım/oyuncunun payı tek barda: iki parça, orantı --a/--b (flex)
- `bars.threat` Tehdit / aranma ölçeri: Sızma ve kaçış modunda tespit edilme: yeşilden kırmızıya geçişli bar (eui-bar--heat), ucu parlak, üstte durum yazısı
- `bars.battery` Enerji / pil: Cihaz şarjı, jetpack, ekipman: cam hap bar + yüzde; düşünce is-critical yanıp söner
- `bars.steps` Adım ilerlemesi: Görev adımları ya da şarjör: eui-pips tall; dolu parçalar tonlu
- `bars.download` Yükleme / indirme: Dosya, harita, güncelleme yüklerken: çapraz çizgili bar + durum + yüzde

### Temel parçalar → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/base.md
- `base.panel` Panel: Temel kutu
- `base.button` Düğme: Varyantlar: --primary (ana), varsayılan, --ghost (hafif), --outline (çerçeveli), --tone + eui-t-* (renkli)
- `base.badge` Rozet: Küçük etiket: ton eui-t-*; --pill yuvarlak, --dot nokta, --live nabız
- `base.chip` Çip: Filtre/seçenek hapı; seçili is-active
- `base.keys` Tuş ve ipucu: eui-key tek tuş: boyut --sm/--lg, biçim --solid/--accent
- `base.field` Metin alanı: Etiketli giriş: label.eui-field içinde kicker + input.eui-input
- `base.toggle` Anahtar ve onay kutusu: eui-toggle (aç/kapa anahtarı), eui-check (kutu) ve eui-check--radio (tek seçim)
- `base.slider` Kaydırıcı: input.eui-slider; data-out='#id' ve data-unit ile değeri başka öğeye yazar (EUI.mount bağlar)
- `base.stepper` Seçici (stepper): ◀ değer ▶ seçici: data-eui-stepper='A|B|C', başlangıç data-index
- `base.tabs` Sekmeler: data-eui-tabs butonları is-active ile çalıştırır
- `base.table` Tablo: eui-table: sağa hizalı sütun için th/td class='r'; sayı eui-num; satır durumu is-self (sen), is-dead; sıra eui-rank is-1/2/3
- `base.avatar` Avatar: Baş harfli yuvarlak/kare avatar: boyut --sm/--lg, --round, ton eui-t-*; is-live canlı yayın çerçevesi
- `base.spinner` Yükleniyor: Dönen gösterge; --lg büyük
- `base.scroll` Kaydırma çubuğu: .eui altındaki tüm kaydırma çubukları tema renginde ince çizilir; ek sınıf gerekmez
- `base.player` Oyuncu çipi: Avatar + ad + alt satır; menü başlığında ya da panel köşesinde kim olduğunu gösterir
- `base.utils` Yerleşim ve yazı yardımcıları: Satır içi stil yerine bunları kullan: eui-flex (satır), eui-col (sütun), eui-between, eui-wrap, eui-grow, eui-gap-1..5, eui-pad / eui-pad-s / eui-pad-l, eui-ellipsis, eui-mono, eui-num (tabular sayı), eui-dim / eui-mute (soluk), eui-accent-text, eui-hud-text (sahne üstü gölge), eui-rule (--accent, --fade) ayraç, ikon boyu eui-i--sm|md|lg|xl, başlık eui-title--sm|lg|xl

### Savaş ve dünya → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/combat.md
- `combat.crosshair` Nişangâh: Dört biçim: artı (varsayılan), --dot, --circle, --t
- `combat.hit` Vuruş işareti: İsabette nişangâhta kısa X: kind boş normal, 'head' kafa, 'kill' öldürme
- `combat.damage-from` Hasar yönü: Ekran kenarında hasarın geldiği yönü gösteren yay: 0 önden, 90 sağdan, 180 arkadan (derece)
- `combat.flash` Ekran parlaması: Tüm ekran flaş: ikinci argüman true ise kırmızı (hasar), değilse beyaz (patlama)
- `combat.lockon` Hedef kilidi: Köşeli hedef çerçevesi; is-locking kilitlenirken daralır
- `combat.world-prompt` Dünya istemi: Nesne üstü etkileşim: nokta + tuş + eylem; uzaktayken is-far sadece nokta
- `combat.prompt` Tuş istemleri: Sağ alt köşe eylem listesi: tuş + açıklama; is-disabled soluk
- `combat.hold` Basılı tut halkası: Tuşa basılı tutunca dolan halka (kilit açma, kurtarma)
- `combat.enemies` Düşman sayacı: Ekranda ve kuyrukta kaç düşman var + doluluk barı; sınıra yaklaşınca is-swarm kırmızı parlar
- `combat.versus` Takım skoru: İki takımın skoru, hayatta kalan noktaları (off = ölü) ve ortada tur/süre
- `combat.points` Ele geçirme noktaları: A/B/C kontrol noktaları: halka doluluğu (--v), takım rengi, is-contested çatışmalı
- `combat.dialog` Diyalog: Konuşan avatarı, söz satırı ve numaralı seçenekler
- `combat.objective` Görev takibi: Aktif görev paneli: başlık + süre rozeti, adım listesi (eui-step: is-done tamam, is-active şimdiki, is-optional isteğe bağlı), altta ilerleme barı
- `combat.damage-number` Yüzen hasar sayısı: Vuruşta dünyada yükselip sönen sayı
- `combat.vignette` Düşük can kenar kızarması: Can 40'ın altına inince ekran kenarı kızarır, 20'nin altında nabız atar

### Ekip → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/crew.md
- `crew.portrait` Portre: Kare portre alanı: harf, ikon (rol) ya da img
- `crew.card` Üye kartı: Ayrıntılı ekip üyesi: kare portre, ad, rol rozeti, can barı + sayı, elindeki silah ve mermi, binek (at/araç; yoksa .is-off), mesafe
- `crew.row` Kompakt ekip satırı: HUD kenar listesi (.eui-crewlist içinde): küçük kare portre, ad, ikonlar (silah, binek is-on, mesafe), ince can barı
- `crew.tiles` Ekip kutucukları: Alt şerit: kare portre + altında can barı + kısa ad
- `crew.states` Durum rozetleri: Üye durumunu tek bakışta: takip, saldırı, bekleme, yaralı, yerde (canlı nokta), atta / araçta, işaretli hedef
- `crew.orders` Emir çubuğu: Ekibe verilen emir: düğme başına tuş + ikon + ad; geçerli emir is-active, saldırı emri is-danger ile kırmızı vurgulanır
- `crew.mount` Binek durumu: At ya da araç: ikon, ad, durum (Binmiş/Yaya/Ahırda), can ve dayanıklılık barları
- `crew.detail` Üye ayrıntısı: Detay paneli (menü sağ sütunu): büyük kare portre (.eui-portrait--xl), ad + rol, can/doğruluk/cesaret satırları (eui-statline), teçhizat yuvaları (eui-gearslots), günlük ücret, eylemler
- `crew.roster` Ekip tablosu: Menüdeki 'Ekibim' listesi: eui-table satırında kare portre + ad, rol, can (ince bar + sayı), silah, binek, durum rozeti
- `crew.targets` İşaretli hedefler: Ekibin saldıracağı işaretli kişiler: kompakt satır (eui-crewrow) düşman tonuyla (eui-t-enemy), hedef ikonu, mesafe; başlıkta sayı ve tuş ipuçları
- `crew.party` Ekip kartları: Sol kenar ekip listesi: avatar, ad, mesafe, can/zırh ince barları
- `crew.squad-rings` Ekip halkaları: Yan yana avatarlar, çevresinde can halkası
- `crew.voice` Ses: Ses menzili çubukları (is-talking konuşurken yeşil) ve konuşanlar listesi; is-radio telsiz
- `crew.ping` Bağlantı kalitesi: 4 çubuklu ping göstergesi: iyi (varsayılan), is-mid orta, is-bad kötü
- `crew.teamhead` Takım başlığı: Skor tablosu takım başlığı: ad + büyük sayı; ton eui-t-team1..5

### Ekonomi ve durum → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/economy.md
- `economy.cash` Para ve banka: Sağ üst köşe para göstergesi; artış/azalış farkı kısa süre yüzer
- `economy.coin` Kompakt para: Tek satır ikon + tutar: puan, jeton, altın
- `economy.wanted` Aranma yıldızları: GTA tarzı 5 yıldız; dolu olanlara on sınıfı, is-flashing yanıp söner
- `economy.clock` Saat ve hava: Hava ikonu + saat + durum ve gün
- `economy.xp` Seviye ve XP: Elmas seviye rozeti + XP barı + kazanılan puan
- `economy.levelring` Seviye halkası: Halka içinde seviye numarası; small etiketi altta
- `economy.effects` Etki simgeleri: Aktif buff/debuff'lar: simge, kalan süre (--v kalan oran), yığın sayısı
- `economy.effect-line` Etki satırı: Simgesiz metin satırı: ad + süre
- `economy.streak` Seri / kombo: Sayı büyür, alttaki çubuk süre dolunca söner; 5 ve üstünde is-hot kırmızı

### Grafik ve ilerleme → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/extras.md
- `extras.donut` Halka grafik: Yüzde halkası: data-eui-ring + --v (0..1), ortada değer ve etiket
- `extras.spark` Mini çizgi grafik: Boş div'e data-spark=&quot;1,3,2,5&quot; ver (data-w, data-h boyut); EUI.mount çizer
- `extras.hbars` Yatay çubuklar: Karşılaştırma: etiket + çubuk (scaleX 0..1) + değer; tone
- `extras.columns` Dikey sütunlar: Zaman serisi sütunları: yükseklik --h; her sütun scaleY 0..1 + alt etiket
- `extras.delta` Değişim oku: Yüzde değişim: is-up yeşil ▲, is-down kırmızı ▼
- `extras.achieve` Başarı satırı: Küçük başarı kartı: ikon, ad, ilerleme yazısı, ton'lu bar
- `extras.event` Etkinlik satırı: Takvim etkinliği: tarih kutusu, ad + canlı rozet, meta (saat, kişi, ödül), katıl düğmesi
- `extras.match` Maç geçmişi satırı: Maç özeti: sonuç rozeti (eui-match__res: is-win yeşil, is-loss kırmızı, sınıfsız berabere), mod + harita + saat, Ö/A, MVP rozeti
- `extras.giftmap` Hediye haritası: Hediye → etki ızgarası: --cols sütun; öğe: sanat (emoji veya ikon), ad + jeton, etki

### Bildirim ve akış → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/feed.md
- `feed.toast` Toast: Köşe bildirimi: ton info|success|warn|danger|accent|legendary, süre ms (0 = kalıcı), en fazla 5 adet
- `feed.toast-action` Toast + eylem: Düğmeli bildirim (davet, onay)
- `feed.kill` Ölüm akışı: Sağ üst akış satırı: öldüren, silah, ölen
- `feed.gift` Hediye kartı: Yayın hediyesi: gönderen, hediye adı, art (emoji | 'i:ikon' | resim adresi), adet, coins, tier
- `feed.announce` Duyuru: Ekran ortası büyük duyuru: kicker, title, sub
- `feed.banner` Görev şeridi: Görev sonu şeridi: ortadan genişler, ödüller sırayla düşer
- `feed.levelup` Seviye atlama: Seviye rozeti + açılan özellikler listesi
- `feed.achievement` Başarım: Alt kenardan kayan başarım bildirimi: ad, puan, ikon
- `feed.pickup` Eşya alma: Sol alt köşe kısa liste: ikon, ad, miktar
- `feed.countdown` Geri sayım: Ekran ortasında 3-2-1 + go yazısı
- `feed.subtitle` Altyazı: Alt orta konuşma altyazısı: speaker, text, color; boxed: true kutulu (parlak sahnelerde okunur)
- `feed.progress` İlerleme çubuğu: İşlem çubuğu (arama, tamir, hack): label, icon, duration ms
- `feed.chat` Sohbet: Oyun içi sohbet: eui-chat__log içinde eui-msg satırları (is-system sistem, __tag rozet, __name tonlu ad) + giriş
- `feed.ticker` Kayan şerit: Alt kenarda sürekli kayan haber şeridi: etiket + __track içinde span'ler

### Ekipman → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/gear.md
- `gear.weapon` Silah paneli: Sağ alt köşe: silah adı, çizimi, şarjör/yedek, şarjör segmentleri, yan eşyalar
- `gear.ammo` Mermi sayacı: Silah çizimi olmadan yalnız şarjör / yedek
- `gear.hotbar` Yuva şeridi: Numaralı hızlı yuvalar: is-active seçili, is-cooldown (--cd oran) bekleme, is-empty boş; sayı ve dayanıklılık çubuğu isteğe bağlı
- `gear.inventory` Envanter ızgarası: Eşya hücreleri; --cols sütun sayısı
- `gear.loadout-slots` Teçhizat yuvaları: Kare görsel alanlı yuvalar: etiket (Birincil, İkincil…) + ad
- `gear.outfit` Kıyafet ve binek yuvaları: Kare yuvalar: şapka, ceket, çanta, eyer gibi giyilen/takılan parçalar
- `gear.condition` Silah bakımı: Silah durumu (kir/aşınma) barı: ikon, ad, yüzde; düşükse ton eui-t-warn / eui-t-danger
- `gear.ammo-types` Mermi türleri: Mermi türü seçici: satır başına ikon, ad, adet
- `gear.compare` Silah karşılaştırma: Satın almadan önce kuşanılı silahla fark: eui-statline; artış için .eui-bar__gain (--g yeni değer oranı) yeşil gösterilir

### Konum ve yön → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/location.md
- `location.compass` Pusula şeridi: Üst orta kayan yön şeridi; hedefler şerit üstünde simge olarak durur
- `location.street` Sokak ve bölge: Yön harfi + sokak adı + bölge
- `location.heading` Yön çipi: Sadece yön harfi ve derece; en az yer kaplayan yön göstergesi
- `location.coords` Koordinat: Geliştirici veya yayıncı için x / y / z satırı; sayılar tabular
- `location.minimap` Minimap çerçevesi: Dikdörtgen çerçeve, kuzey rozeti, alt bölge/saat şeridi
- `location.minimap-round` Yuvarlak minimap: Daire çerçeve; bölge şeridi yok, --w ve --h eşit olmalı
- `location.marker` Dünya işaretçisi: Hedef üstü pin + etiket + mesafe
- `location.marker-edge` Kenar işaretçisi: Ekran dışındaki hedef: pin kenarda, üstteki ok yönü gösterir (--a derece)
- `location.wayarrow` Hedef oku: Büyük yönlendirme oku + mesafe (görev, teslimat)

### Menü ve ekranlar → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/menu.md
- `menu.menu` Tam ekran menü (EUI.Menu): Mod menüsü, envanter, mağaza, ayarlar, ekip: tek çağrı
- `menu.menu-settings` Ayarlar menüsü (2 sütun): Hiçbir bölümde detay yoksa menü kendiliğinden 2 sütundur
- `menu.context` Bağlam menüsü: Küçük açılır menü: başlık, satır (ikon, ad, kısayol tuşu), ayraç, is-active, is-danger
- `menu.modal` Onay penceresi: Onay/uyarı kutusu; bu HTML yalnız görünüm içindir, koddan EUI.confirm({ title, text, danger, ok, icon }) çağır: Promise(true/false)
- `menu.choose` Seçim penceresi: Aranabilir liste penceresi: items [{ id, label, sub, icon, avatar, tone, badge, right, disabled }], multi çoklu seçim, max sınır
- `menu.amount` Tutar / adet penceresi: Sayı seçici: min, max, value, step, prefix ('$'), suffix, quick: [100, 1000, 'max']
- `menu.input` Metin penceresi: Tek alanlı giriş: label, placeholder, value, max, type ('text' | 'password' | 'number'), required
- `menu.radial` Radyal menü: Daire dilimli seçim: EUI.radial(el, [{ icon, label, desc, disabled }], { title, hint, size, onPick })
- `menu.setting` Ayar satırı: EUI.Menu içindeysen bunu yazma, view: 'settings' kullan
- `menu.standings` Sıralama listesi: Köşe sıralaması: eui-rank (is-1/2/3 madalya renkleri), ad, değer
- `menu.scoreboard` Skor tablosu: Takım skor tablosu: başlık + istatistikler, takım başlığı (eui-teamhead + eui-t-team1..5), eui-table, ping çubuğu, kendi satırın is-self
- `menu.podium` Podyum: İlk üç: slot sırası 2-1-3, her slotta oyuncu (avatar + ad + alt satır) ve numaralı blok
- `menu.dead` Ölüm ekranı: Büyük 'Öldün' başlığı, öldüren kartı (avatar, silah, mesafe, istatistikler) ve altta yeniden doğma halkası (data-eui-ring, --v 0..1) ile tuş ipuçları
- `menu.results` Maç sonucu: Maç bitişi: üstte başlık (Zafer/Yenilgi), alt satır ve eui-summary özet sayıları; podyum ayrı varyant
- `menu.loading` Yükleme ekranı: Tam ekran: arka plan (__art), başlık/alt metin/rozetler (__main), altta ipucu ve ilerleme (__foot)

### Mağaza ve satın alma → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/shop.md
- `shop.item` Ürün kutucuğu: Görsel alanı (.eui-item__art, oran --ratio, varsayılan 16/10) + ad + alt satır ve fiyat
- `shop.square` Kare görselli kutucuk: Görsel alanı 1:1: .eui-item--square
- `shop.grouped` Gruplu ızgara: Izgarayı başlıklarla böl: .eui-shopgroup (kicker + sayı) satırın tamamını kaplar, altına kutucuklar gelir
- `shop.list` Liste satırı: Alt alta liste: .eui-item--row (solda kare küçük görsel, ortada ad + ayrıntı, sağda .eui-item__side fiyat + stok)
- `shop.strip` Yatay şerit: Yan yana kaydırılan kutucuklar: .eui-shopstrip (--w kutucuk genişliği, kaydırma noktaları)
- `shop.mini` Mini ızgara: Çok sayıda küçük eşya: .eui-item--mini (kare görsel, kısa ad, küçük fiyat), --cols 5-8
- `shop.art` Görsel alanı: Oran sabit, içerik değişir: ikon, silah çizimi (data-weapon) ya da img (object-fit: cover; --fit:contain ile sığdır)
- `shop.cats` Kategoriler: Mağaza üstü kategori seçici: ikon + ad + adet; seçili is-active (vurgu dolgulu)
- `shop.price` Fiyat durumları: eui-price (+ --sm küçük, --tag etiketli)
- `shop.qty` Adet seçici: Eksi / sayı / artı
- `shop.buy` Satın alma paneli: Menünün sağ sütunu (eui-menu__aside) için: görsel (.eui-buy__art, --ratio), başlık, açıklama, özellik listesi (dl.eui-buy__specs), adet + toplam (.eui-buy__total), satın al düğmesi, not satırı (bakiye/sahiplik)
- `shop.cart` Sepet: Birden çok ürünü tek seferde almak için: satır (küçük kare görsel, ad, adet × fiyat, toplam), alt toplam / kese / kalan, onay düğmesi
- `shop.keylist` Tuş listesi: Tuş + açıklama satırları (.eui-keylist__row); birden çok tuş yan yana, ikinci satır small

### Yayın ve izleyici → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/stream.md
- `stream.statbar` Durum şeridi: Yatay istatistik çipleri: ikon + büyük sayı + etiket (seviye, can, öldürme…)
- `stream.statcard` İstatistik kartı: Oyuncu özeti: seviye halkası + ad, altında 2×2 hücre (ikon, sayı, etiket)
- `stream.winloss` Galibiyet / mağlubiyet: Skor (yeşil W, kırmızı L) ve son maç geçmişi: data-history=&quot;WWLWWLW&quot; harfleri noktaya çevrilir
- `stream.vote` İzleyici oylaması: Soru + süre rozeti + seçenekler
- `stream.queue` Olay kuyruğu: Sıradaki olaylar listesi; çalışan satır is-running, ton eui-t-*; sağda süre veya 'sırada'
- `stream.leader` Destekçi sıralaması: En çok destekleyenler: başlık, satırlar (eui-rank is-1/2/3, avatar, ad, değer)
- `stream.livestats` Canlı sayaçlar: Yayın göstergeleri: 'Canlı' rozeti + izleyici/beğeni/jeton hücreleri (ton + ikon + sayı)
- `stream.commands` Komut ve hediye listesi: İzleyici komutları: kod (code) veya hediye çipi (eui-gift-chip) + açıklama
- `stream.streamer` Yayıncı kartı: Avatar (is-live çerçeve), ad + doğrulama, meta satırı (izleyici, takipçi)
- `stream.likes` Beğeni yağmuru: Kalpleri yukarı süzdüren efekt alanı
- `stream.gift-hero` Büyük hediye: Pahalı hediye için ekran ortası kahraman gösterim: büyük sanat, gönderen, hediye adı, jeton rozeti
- `stream.crop` Kare / dikey yayın kırpması: Yayın 9:16 ya da 1:1 kırpılınca HUD orta sütuna toplanır

### Hayatta kalma ve mod → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/survival.md
- `survival.horde` Sürü uyarısı: Ekran ortasında büyük başlık + alt satır + davul çubukları (__drums)
- `survival.infected` Özel düşman bildirimi: Özel düşman uyarısı: ikon, tür adı, ipucu
- `survival.loadout` Silah yuvaları: Hızlı yuva şeridi: tuş numarası, silah çizimi (data-weapon) veya ikon, alt sayaç
- `survival.rescue` Kurtarma sayacı: Kurtarma/tahliye geri sayımı: ikon + etiket + süre
- `survival.survivors` Takım yaşam kartları: Takım arkadaşları: avatar, ad, can sayısı, --hp (0..1) bar, --temp ikinci katman, eşya ikonları (is-empty kullanılmış)
- `survival.zone` Daralan alan: Küçülen alan sayacı: halka + etiket + süre
- `survival.daycount` Gün sayacı: Hayatta kalma gün sayacı: üst etiket + büyük sayı
- `survival.spectate` İzleyici modu: Ölünce takım izleme çubuğu: Q/E tuşları, izlenen oyuncu, sıra
- `survival.loot` Ganimet düşmesi: Yere düşen eşya kartı: art alanı, nadirlik etiketi (__tier), ad, özellikler
- `survival.skillcheck` Beceri kontrolü: Dönen ibre başarı dilimine gelince SPACE
- `survival.qte` Tuş dizisi (QTE): Sıralı tuşlara bas; Promise true/false

### İsim etiketleri → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/tags.md
- `tags.default` Standart: Ad, oyuncu numarası, rozet, can ve zırh barı, alt satır
- `tags.relations` İlişki renkleri: Aynı etiket, renk ilişkiyi söyler: is-friend, is-enemy, nötr (sınıfsız), takım eui-t-team1..5; ayrıca eui-t-gold (VIP), eui-t-info (polis) gibi tonlar
- `tags.compact` Kompakt: eui-tag--compact: rozet ve alt satır gizli, ad 13px, bar 56px
- `tags.hp-number` Can sayısı: variant: hp
- `tags.shield-pips` Kalkan segmentleri: Can barının altına eui-pips (data-pips=&quot;dolu/toplam&quot;): zırh plakası ya da kalkan katmanı
- `tags.level-clan` Seviye ve klan: level: adın önünde tonlu seviye kutusu; clan: [KLAN] öneki
- `tags.plate` Plaka: variant: plate
- `tags.flag` Bayrak: variant: flag
- `tags.pill` Hap: variant: pill
- `tags.card` Kart: variant: card
- `tags.line` İnce çizgi: variant: line
- `tags.glow` Parlak çerçeve: variant: glow
- `tags.banner` Takım afişi: variant: banner
- `tags.bracket` Köşeli: variant: bracket
- `tags.bar-only` Yalnız bar: variant: bar
- `tags.pointer` İşaretçili: variant: pointer
- `tags.squad` Takım numarası: Bölük/ekip sırası: adın önünde numara kutusu (eui-tag__num)
- `tags.roles` Rol etiketli: role: üstte küçük rol yazısı (POLİS, SAĞLIK, ŞERİF…)
- `tags.wanted` Aranma seviyesi: Ad altında aranma yıldızları (eui-wanted, i.on dolu)
- `tags.race` Yarış sırası: variant: race
- `tags.vip` Korunacak hedef: variant: vip
- `tags.boss` Boss: variant: boss
- `tags.npc` NPC: variant: npc
- `tags.viewer` Canlı yayın izleyicisi: variant: viewer
- `tags.far` Uzaktaki: variant: far
- `tags.group` Kalabalık özeti: Üst üste binen grubu tek etikette say: ad + eui-tag__more (+3)
- `tags.states` Durumlar: Herhangi bir biçime eklenir: is-talking (yeşil + mikrofon), is-typing (…), is-leader (taç), is-afk (sönük), is-target (altı çizili), is-dead (üstü çizili)
- `tags.downed` Yere düştü: is-down: kırmızı, yanıp sönen ad; bar kalan kanama süresi, alt satır kaldırma ipucu
- `tags.bubble` Konuşma balonu: bubble: etiketin üstünde kısa sohbet metni (yayıncı/izleyici mesajı); 220px'e kadar kayar

### Araç ve binek → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/vehicle.md
- `vehicle.speedo` Hız kadranı: Dairesel kadran: hız yayı, son %15 kırmızı bölge, ince devir yayı, vites, lambalar
- `vehicle.speed-mini` Kompakt hız: Büyük sayı + vites + devir segmentleri; son üç segment kırmızıya döner
- `vehicle.gauges` Yakıt ve motor ölçerleri: İkon + ince bar satırları (yakıt, motor, nitro)
- `vehicle.fuel-ring` Halka ölçer: Ortasında ikon olan halka: yakıt, pil, nitro
- `vehicle.lamps` Gösterge lambaları: Emniyet kemeri, far, kilit, arıza: on yanık, is-warn kırmızı yanıp söner; ton --tone-rgb ile

### Yaşam göstergeleri → https://cdn.jsdelivr.net/gh/StreamEmber/ember-ui@v4.2.1/ai/vitals.md
- `vitals.bar` Bar: Tek değer: can, zırh, ilerleme
- `vitals.bar-ghost` Hasar izli bar: Değer düşünce beyaz iz yavaşça kapanır
- `vitals.bar-notch` Çentikli bar: Eşit bölmeli bar; --notch bölme sayısı
- `vitals.bar-vertical` Dikey bar: Ekran kenarına yaslı ince sütun
- `vitals.bar-line` Çizgi bar: 2px ince çizgi + uçta parlak çentik (eui-bar--tip)
- `vitals.bar-line-meter` Etiketli çizgi: eui-meter içinde çizgi bar: üstte küçük etiket solda, değer sağda
- `vitals.bar-tip` Uç ışıklı bar: Herhangi bir bara eui-bar--tip eklenince dolgu ucunda beyaz parlak çizgi akar
- `vitals.bar-skew` Eğik bar: Paralelkenar bar (eui-bar--skew); __text ile değer barın içinde
- `vitals.bar-chevron` Ok uçlu bar: eui-bar--chevron eğik kesik uçlar, eui-bar--arrow sivri ok
- `vitals.bar-glass` Cam hap bar: Yuvarlak (eui-bar--pill) + cam parlaması (eui-bar--glass)
- `vitals.bar-stripe` Dolan bar: Hareketli çapraz çizgiler (eui-bar--stripe): yenilenen can, şarj, yükleme
- `vitals.bar-heat` Renk geçişli bar: eui-bar--heat: dolgu kırmızı→sarı→ton geçişli; değer düştükçe yalnız kırmızı kısım kalır
- `vitals.bar-ticks` Ölçekli bar: İnce 1px bölme çizgileri (eui-bar--ticks, --ticks adet)
- `vitals.bar-frame` Çerçeveli bar: eui-bar--frame: ton renkli ince kenarlık, içte boşluklu dolgu
- `vitals.bar-center` Ortadan / sağdan dolan: eui-bar--center ortadan iki yana açılır (denge, gürültü, ısı)
- `vitals.bar-layers` Kalkan ve iyileşme katmanı: __over aşırı kalkanı çizgili katman olarak gösterir (--o 0..1); __gain iyileşme önizlemesi (transform: scaleX)
- `vitals.bar-duo` Can + ince zırh çizgisi: Kalın can barı, hemen üstünde 3px zırh çizgisi
- `vitals.strip` Şerit: Tek satır: ton kenarlı koyu şerit, ikon + bar + sayı
- `vitals.strip-skew` Eğik şerit: eui-strip--skew: şerit eğik, içerik düz kalır
- `vitals.plate` Büyük sayılı plaka: Büyük sayı + küçük etiket üstte, altta çizgi bar
- `vitals.plate-plates` Plaka + zırh parçaları: Battle royale tarzı: üstte zırh plakaları (eui-pips data-pips), altta can barı ve büyük sayı
- `vitals.vital-row` İkonlu satır: İkon + bar + sayı tek satırda
- `vitals.vital-stack` Can / zırh / stamina yığını: Üç ikonlu satır alt alta
- `vitals.vital-slim` Kompakt yığın: İkon ve sayı gizli, yalnız ince barlar
- `vitals.hpbig` Büyük can: Yayında öne çıkan sayılı büyük can barı; --w genişlik
- `vitals.meter` Etiketli ölçer: Sol etiket, sağ değer, altında bar
- `vitals.ring` Değerli halka: Halkanın ortasında sayı
- `vitals.core` Çekirdek: RDR2 tarzı: dış halka anlık değer, iç dolgu çekirdek
- `vitals.pips` Segmentler: Sayılabilir parçalar: şarjör, can dilimi, kombo
- `vitals.hearts` Kalpler: Az sayıda can hakkı (3-10)
- `vitals.needs` İhtiyaç halkaları: Açlık, susuzluk, stres gibi yavaş değişen ihtiyaçlar: ikonlu küçük halkalar (--v 0..1)
