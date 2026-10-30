# MHud 3.0.0 — AI kılavuzu

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
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/dist/mhud.min.css">
</head>
<body class="mh" data-mh-accent="mint">
  <div class="mh-screen">
    <div class="mh-world"></div>                      <!-- isim etiketi, işaretçi, hasar sayısı katmanı (gerekirse) -->
    <div class="mh-anchor mh-bl"> … HUD parçaları … </div>
    <div class="mh-anchor mh-tr"><div class="mh-toasts" data-mh="toasts"></div></div>
  </div>
  <script src="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/dist/mhud.min.js"></script>
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

- Sürümü her zaman sabit yaz (`@v3.0.0`; `@latest`, `@main` yok).
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
Denetim: `curl -sO https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/tools/lint.mjs && node lint.mjs <web klasörü>` — hata kalmamalı.

## API dizini

Bileşen fabrikalarının ayrıntısı ilgili ailede; burada her public ad bir satır.

**Kurulum ve köprü** — `MH.mount(kök?)` bildirimsel parçaları kurar · `MH.autoScale({ base: 1080, scale })` ölçek + oyun yüksekliği; `{ set(ölçek) }` döner (HUD ölçeği ayarı için bunu çağır, yeniden kurma) · `MH.accent(ad, kapsam?)` vurgu · `MH.on(ad, fn)` / `MH.off(ad, fn)` / `MH.emit(ad, veri)` olaylar · `MH.post(cb, veri)` sayfa → oyun · `MH.route(mesaj)` bir mesajı elle yönlendir · `MH.rpcAllow` oyundan doğrudan çağrılabilen adlar · `MH.bridge` (`window.streamember` ya da null) · `MH.debug` (`?mhdebug=1`) · `MH.connect(wsUrl)` WebSocket köprüsü (OBS / HTML5; `MH.post`'u sokete çevirir) · `MH.Atlas(action)` isim etiketlerini oyunun yerel çerçevesinde çizdiren atlas köprüsü (oyun `{ reset, layout, set, clear }` yollar).

**Menü ve pencereler** — `MH.Menu(host?, spec)` → `ai/menu.md` · `MH.Social(host, opts)` · `MH.trade(o)` takas penceresi · `MH.modal(o)` genel pencere (Promise) · `MH.confirm(o)` → bool · `MH.input(o)` → metin · `MH.choose(o)` → id / [id] · `MH.amount(o)` → sayı · `MH.modalOpen()` · `MH.closeModals()` · `MH.context(x, y, items, o)` · `MH.closeContext()` · `MH.radial(el, items, o)`.

**Değerler** (bar ve halkalar yalnız çizimi günceller; yanındaki sayı metnini sen yaz ya da `MH.count` kullan) — `MH.bar(el, v, { critical })` · `MH.ring(el, 0..1)` · `MH.core(el, { value, core })` · `MH.pips(el, dolu, toplam)` · `MH.count(el, sayı)` · `MH.money(el, tutar)` · `MH.stat(kök, anahtar, değer)` (`[data-stat]`) · `MH.streak(el, sayı, o)` · `MH.history(el, ['W','L'])` · `MH.timer(el, saniye, { urgent, onEnd })` · `MH.zone(el, saniye)` · `MH.hold(el, { duration, onDone })` → `{ start, stop }` · `MH.enemies(el, { onScreen, queued, max })` (max = ekrandaki düşman sınırı; yaklaşınca `is-swarm`) · `MH.compass(el, derece, işaretler)` · `MH.cardinals({ 0: 'N', … })` pusula harfleri · `MH.speedo(el, { speed, rpm, gear })` · `MH.sparkline(el, değerler)` · `MH.bars(el, satırlar)` · `MH.columns(el, satırlar)`.

**Akış ve efekt** — `MH.toast(o)` · `MH.kill(o)` · `MH.gift(o)` · `MH.social(o)` (katıldı/takip etti satırı) · `MH.announce(o)` · `MH.banner(o)` · `MH.levelUp(o)` · `MH.achievement(o)` · `MH.pickup(o)` · `MH.countdown(n, o)` · `MH.subtitle(o)` · `MH.progress(o)` · `MH.loot(o)` · `MH.horde(o)` · `MH.infected(o)` · `MH.skillCheck(el, o)` · `MH.qte(el, tuşlar, o)` · `MH.hit(el?, tür)` · `MH.damageFrom(el?, açı)` · `MH.flash(el?, kırmızı)` · `MH.vignette(el, can)` · `MH.damageNumber(world, { x, y, value, kind })` · `MH.crop(mod, o)` · `MH.cropGuide(el?, açık, platform)`.

**Dünya katmanı** — `MH.Nametags(world, opts).update([{ id, x, y, name, … }])` · `MH.Markers(world).update([{ id, x, y, icon, label, dist }])` · `MH.Pool(world, yap, boya)` ikisinin ortak havuzu (doğrudan gerekmez). `world` = `.mh-world`.

**Yardımcılar** — `MH.icon(ad)` · `MH.weapon(ad)` · `MH.art(değer)` (emoji | `i:ikon` | `w:silah` | resim adresi) · `MH.avatar(ad, o)` · `MH.initials(ad)` · `MH.fmt(sayı)` · `MH.compact(sayı)` (12,4 B · 1,2 Mn) · `MH.time(saniye)` · `MH.esc(metin)` · `MH.el(etiket, sınıf, html)` · `MH.$(seçici)` / `MH.$$(seçici)` · `MH.clamp(v, a, b)` · `MH.bump(el)` küçük zıplama · `MH.ringSvg(r)` halka svg'si.

## İkonlar

`<i data-i="ad">` / `icon: 'ad'` için geçerli 344 ad (başka ad boş çıkar): heart heart-o heart-half heart-broken heart-plus heartbeat revive shield shield-o shield-half armor bolt stamina run walk lungs droplet blood brain meat food apple bread bottle water moon sleep thermometer cold hot eye eye-off deadeye skull skull-crossbones dead ghost poison radiation biohazard virus bandage pill pills first-aid medkit syringe iv medication injured hospital mood angry cool pistol revolver rifle carbine smg shotgun sniper repeater bullets bullet magazine magazine-pistol grenade molotov dynamite bomb mine nuke flame fire-circle knife knife-military machete axe battle-axe sword swords bow crowbar bat hammer pickaxe fist boxing karate fencing crosshair scope target bullseye handcuffs flashlight binoculars lasso user users group user-plus user-minus user-shield friend ally enemy hostile police cop soldier sheriff cowboy outlaw spy ninja zombie alien robot boss detective worker medic hostage streamer viewer waiting search-user human rider horse dog cat bird fish snake spider rabbit bat-animal hat horseshoe cactus campfire tent lantern oil-lamp train gold poker cards dice whiskey beer cigar newspaper telegram letter feather pen scroll map compass treasure safe grave coffin church cross barn castle bugle anchor candle hook car car-sport bike heli plane boat ferry truck tank ambulance police-car siren gas fuel engine steering gauge battery seatbelt key lights tire wrench tool parachute cash coins coin bank wallet cart store tag gift gift-open diamond crown trophy medal podium ticket sale percent package box backpack star star-o star-circle xp sparkles confetti level-up chest flag flag-3 checkpoint pin spawn route distance location radar world home door door-open logout lock unlock pick timer hourglass clock alarm calendar history wave zone storm rain sun cloud fog snow wind sunset streak win loss kill death queue stats chart chart-line trending-up trending-down gamepad dice-multi chess puzzle lightbulb layers tiktok broadcast live mic mic-off volume volume-off speaker chat message bell bell-ring like dislike share phone wifi signal heart-hand follow camera music email send inbox swap handshake crew transfer check x plus minus chev-l chev-r chev-u chev-d chevs-r arrow-up arrow-down arrow-left arrow-right menu grid list search settings sliders info alert alert-circle circle-check circle-x ban refresh repeat play pause stop keyboard mouse pointer hand grab focus eye-on

Silah çizimleri (`<i data-weapon="ad">` / `weapon: 'ad'`): carbine smg pistol revolver shotgun repeater sniper

## Bileşen aileleri

### Barlar → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/bars.md
- `bars.boss` Boss barı: Ekran üstü büyük bar: ad, aşama rozeti, iz (ghost), aşama çentikleri, ikinci kalkan barı
- `bars.wave` Dalga paneli: Hayatta kalma modu: dalga numarası, kalan düşman barı, sonraki dalga süresi
- `bars.goal` Hedef çubuğu: Bağış/beğeni hedefi: ikon, başlık, sayaç, bar ve ödül satırı
- `bars.challenge` Meydan okuma: Hedefli görev: başlık + sayaç, kilometre taşlı bar (mh-milestones içinde bar + konumlu i; on dolu), ödül sırası
- `bars.revive` Canlandırma: Düşen takım arkadaşını kaldırma ilerlemesi: başlık, bar, ipucu
- `bars.boss-slim` Boss barı (ince): Tek satırlık boss: ad solda, aşama sağda, altında çentikli ince bar
- `bars.boss-skew` Boss barı (eğik): Aksiyon oyunu boss'u: eğik kalın bar içinde ad ve yüzde (__text)
- `bars.boss-duo` Çift boss: İki boss karşılıklı: biri soldan, biri sağdan (mh-bar--rtl) dolar; ortada VS
- `bars.elite` Elit hedef barı: Küçük elit düşman için ad + ince kalkan barı; ekran kenarında çoklu sıralanır
- `bars.stagger` Sersemletme / denge: Boss'u sersemletmek için dolan bar: dolunca hasar penceresi
- `bars.xp-bar` Deneyim çubuğu: İki ucunda seviye numarası olan ince XP çubuğu; altta kalan XP
- `bars.cast` Kanal / yeniden doldurma: Etiket + süre + bar: büyü kanalı, yeniden doldurma, eşya kullanma
- `bars.capture` Ele geçirme ilerlemesi: Bölge ele geçirirken: bar ortadan iki yöne (mh-bar--center) takıma göre renk değiştirir
- `bars.tug` İpi çeken iki taraf: İki takım/oyuncunun payı tek barda: iki parça, orantı --a/--b (flex)
- `bars.threat` Tehdit / aranma ölçeri: Sızma ve kaçış modunda tespit edilme: yeşilden kırmızıya geçişli bar (mh-bar--heat), ucu parlak, üstte durum yazısı
- `bars.battery` Enerji / pil: Cihaz şarjı, jetpack, ekipman: cam hap bar + yüzde; düşünce is-critical yanıp söner
- `bars.steps` Adım ilerlemesi: Görev adımları ya da şarjör: mh-pips tall; dolu parçalar tonlu
- `bars.download` Yükleme / indirme: Dosya, harita, güncelleme yüklerken: çapraz çizgili bar + durum + yüzde

### Temel parçalar → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/base.md
- `base.panel` Panel: Temel kutu
- `base.button` Düğme: Varyantlar: --primary (ana), varsayılan, --ghost (hafif), --outline (çerçeveli), --tone + mh-t-* (renkli)
- `base.badge` Rozet: Küçük etiket: ton mh-t-*; --pill yuvarlak, --dot nokta, --live nabız
- `base.chip` Çip: Filtre/seçenek hapı; seçili is-active
- `base.keys` Tuş ve ipucu: mh-key tek tuş: boyut --sm/--lg, biçim --solid/--accent
- `base.field` Metin alanı: Etiketli giriş: label.mh-field içinde kicker + input.mh-input
- `base.toggle` Anahtar ve onay kutusu: mh-toggle (aç/kapa anahtarı), mh-check (kutu) ve mh-check--radio (tek seçim)
- `base.slider` Kaydırıcı: input.mh-slider; data-out='#id' ve data-unit ile değeri başka öğeye yazar (MH.mount bağlar)
- `base.stepper` Seçici (stepper): ◀ değer ▶ seçici: data-mh-stepper='A|B|C', başlangıç data-index
- `base.tabs` Sekmeler: data-mh-tabs butonları is-active ile çalıştırır
- `base.table` Tablo: mh-table: sağa hizalı sütun için th/td class='r'; sayı mh-num; satır durumu is-self (sen), is-dead; sıra mh-rank is-1/2/3
- `base.avatar` Avatar: Baş harfli yuvarlak/kare avatar: boyut --sm/--lg, --round, ton mh-t-*; is-live canlı yayın çerçevesi
- `base.spinner` Yükleniyor: Dönen gösterge; --lg büyük
- `base.scroll` Kaydırma çubuğu: .mh altındaki tüm kaydırma çubukları tema renginde ince çizilir; ek sınıf gerekmez
- `base.player` Oyuncu çipi: Avatar + ad + alt satır; menü başlığında ya da panel köşesinde kim olduğunu gösterir
- `base.utils` Yerleşim ve yazı yardımcıları: Satır içi stil yerine bunları kullan: mh-flex (satır), mh-col (sütun), mh-between, mh-wrap, mh-grow, mh-gap-1..5, mh-pad / mh-pad-s / mh-pad-l, mh-ellipsis, mh-mono, mh-num (tabular sayı), mh-dim / mh-mute (soluk), mh-accent-text, mh-hud-text (sahne üstü gölge), mh-rule (--accent, --fade) ayraç, ikon boyu mh-i--sm|md|lg|xl, başlık mh-title--sm|lg|xl

### Savaş ve dünya → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/combat.md
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
- `combat.objective` Görev takibi: Aktif görev paneli: başlık + süre rozeti, adım listesi (mh-step: is-done tamam, is-active şimdiki, is-optional isteğe bağlı), altta ilerleme barı
- `combat.damage-number` Yüzen hasar sayısı: Vuruşta dünyada yükselip sönen sayı
- `combat.vignette` Düşük can kenar kızarması: Can 40'ın altına inince ekran kenarı kızarır, 20'nin altında nabız atar

### Ekip → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/crew.md
- `crew.portrait` Portre: Kare portre alanı: harf, ikon (rol) ya da img
- `crew.card` Üye kartı: Ayrıntılı ekip üyesi: kare portre, ad, rol rozeti, can barı + sayı, elindeki silah ve mermi, binek (at/araç; yoksa .is-off), mesafe
- `crew.row` Kompakt ekip satırı: HUD kenar listesi (.mh-crewlist içinde): küçük kare portre, ad, ikonlar (silah, binek is-on, mesafe), ince can barı
- `crew.tiles` Ekip kutucukları: Alt şerit: kare portre + altında can barı + kısa ad
- `crew.states` Durum rozetleri: Üye durumunu tek bakışta: takip, saldırı, bekleme, yaralı, yerde (canlı nokta), atta / araçta, işaretli hedef
- `crew.orders` Emir çubuğu: Ekibe verilen emir: düğme başına tuş + ikon + ad; geçerli emir is-active, saldırı emri is-danger ile kırmızı vurgulanır
- `crew.mount` Binek durumu: At ya da araç: ikon, ad, durum (Binmiş/Yaya/Ahırda), can ve dayanıklılık barları
- `crew.detail` Üye ayrıntısı: Detay paneli (menü sağ sütunu): büyük kare portre (.mh-portrait--xl), ad + rol, can/doğruluk/cesaret satırları (mh-statline), teçhizat yuvaları (mh-gearslots), günlük ücret, eylemler
- `crew.roster` Ekip tablosu: Menüdeki 'Ekibim' listesi: mh-table satırında kare portre + ad, rol, can (ince bar + sayı), silah, binek, durum rozeti
- `crew.targets` İşaretli hedefler: Ekibin saldıracağı işaretli kişiler: kompakt satır (mh-crewrow) düşman tonuyla (mh-t-enemy), hedef ikonu, mesafe; başlıkta sayı ve tuş ipuçları
- `crew.party` Ekip kartları: Sol kenar ekip listesi: avatar, ad, mesafe, can/zırh ince barları
- `crew.squad-rings` Ekip halkaları: Yan yana avatarlar, çevresinde can halkası
- `crew.voice` Ses: Ses menzili çubukları (is-talking konuşurken yeşil) ve konuşanlar listesi; is-radio telsiz
- `crew.ping` Bağlantı kalitesi: 4 çubuklu ping göstergesi: iyi (varsayılan), is-mid orta, is-bad kötü
- `crew.teamhead` Takım başlığı: Skor tablosu takım başlığı: ad + büyük sayı; ton mh-t-team1..5

### Ekonomi ve durum → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/economy.md
- `economy.cash` Para ve banka: Sağ üst köşe para göstergesi; artış/azalış farkı kısa süre yüzer
- `economy.coin` Kompakt para: Tek satır ikon + tutar: puan, jeton, altın
- `economy.wanted` Aranma yıldızları: GTA tarzı 5 yıldız; dolu olanlara on sınıfı, is-flashing yanıp söner
- `economy.clock` Saat ve hava: Hava ikonu + saat + durum ve gün
- `economy.xp` Seviye ve XP: Elmas seviye rozeti + XP barı + kazanılan puan
- `economy.levelring` Seviye halkası: Halka içinde seviye numarası; small etiketi altta
- `economy.effects` Etki simgeleri: Aktif buff/debuff'lar: simge, kalan süre (--v kalan oran), yığın sayısı
- `economy.effect-line` Etki satırı: Simgesiz metin satırı: ad + süre
- `economy.streak` Seri / kombo: Sayı büyür, alttaki çubuk süre dolunca söner; 5 ve üstünde is-hot kırmızı

### Grafik ve ilerleme → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/extras.md
- `extras.donut` Halka grafik: Yüzde halkası: data-mh-ring + --v (0..1), ortada değer ve etiket
- `extras.spark` Mini çizgi grafik: Boş div'e data-spark=&quot;1,3,2,5&quot; ver (data-w, data-h boyut); MH.mount çizer
- `extras.hbars` Yatay çubuklar: Karşılaştırma: etiket + çubuk (scaleX 0..1) + değer; tone
- `extras.columns` Dikey sütunlar: Zaman serisi sütunları: yükseklik --h; her sütun scaleY 0..1 + alt etiket
- `extras.delta` Değişim oku: Yüzde değişim: is-up yeşil ▲, is-down kırmızı ▼
- `extras.achieve` Başarı satırı: Küçük başarı kartı: ikon, ad, ilerleme yazısı, ton'lu bar
- `extras.event` Etkinlik satırı: Takvim etkinliği: tarih kutusu, ad + canlı rozet, meta (saat, kişi, ödül), katıl düğmesi
- `extras.match` Maç geçmişi satırı: Maç özeti: sonuç rozeti (mh-match__res: is-win yeşil, is-loss kırmızı, sınıfsız berabere), mod + harita + saat, Ö/A, MVP rozeti
- `extras.giftmap` Hediye haritası: Hediye → etki ızgarası: --cols sütun; öğe: sanat (emoji veya ikon), ad + jeton, etki

### Bildirim ve akış → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/feed.md
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
- `feed.chat` Sohbet: Oyun içi sohbet: mh-chat__log içinde mh-msg satırları (is-system sistem, __tag rozet, __name tonlu ad) + giriş
- `feed.ticker` Kayan şerit: Alt kenarda sürekli kayan haber şeridi: etiket + __track içinde span'ler

### Ekipman → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/gear.md
- `gear.weapon` Silah paneli: Sağ alt köşe: silah adı, çizimi, şarjör/yedek, şarjör segmentleri, yan eşyalar
- `gear.ammo` Mermi sayacı: Silah çizimi olmadan yalnız şarjör / yedek
- `gear.hotbar` Yuva şeridi: Numaralı hızlı yuvalar: is-active seçili, is-cooldown (--cd oran) bekleme, is-empty boş; sayı ve dayanıklılık çubuğu isteğe bağlı
- `gear.inventory` Envanter ızgarası: Eşya hücreleri; --cols sütun sayısı
- `gear.loadout-slots` Teçhizat yuvaları: Kare görsel alanlı yuvalar: etiket (Birincil, İkincil…) + ad
- `gear.outfit` Kıyafet ve binek yuvaları: Kare yuvalar: şapka, ceket, çanta, eyer gibi giyilen/takılan parçalar
- `gear.condition` Silah bakımı: Silah durumu (kir/aşınma) barı: ikon, ad, yüzde; düşükse ton mh-t-warn / mh-t-danger
- `gear.ammo-types` Mermi türleri: Mermi türü seçici: satır başına ikon, ad, adet
- `gear.compare` Silah karşılaştırma: Satın almadan önce kuşanılı silahla fark: mh-statline; artış için .mh-bar__gain (--g yeni değer oranı) yeşil gösterilir

### Konum ve yön → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/location.md
- `location.compass` Pusula şeridi: Üst orta kayan yön şeridi; hedefler şerit üstünde simge olarak durur
- `location.street` Sokak ve bölge: Yön harfi + sokak adı + bölge
- `location.heading` Yön çipi: Sadece yön harfi ve derece; en az yer kaplayan yön göstergesi
- `location.coords` Koordinat: Geliştirici veya yayıncı için x / y / z satırı; sayılar tabular
- `location.minimap` Minimap çerçevesi: Dikdörtgen çerçeve, kuzey rozeti, alt bölge/saat şeridi
- `location.minimap-round` Yuvarlak minimap: Daire çerçeve; bölge şeridi yok, --w ve --h eşit olmalı
- `location.marker` Dünya işaretçisi: Hedef üstü pin + etiket + mesafe
- `location.marker-edge` Kenar işaretçisi: Ekran dışındaki hedef: pin kenarda, üstteki ok yönü gösterir (--a derece)
- `location.wayarrow` Hedef oku: Büyük yönlendirme oku + mesafe (görev, teslimat)

### Menü ve ekranlar → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/menu.md
- `menu.menu` Tam ekran menü (MH.Menu): Mod menüsü, envanter, mağaza, ayarlar, ekip: tek çağrı
- `menu.menu-settings` Ayarlar menüsü (2 sütun): Hiçbir bölümde detay yoksa menü kendiliğinden 2 sütundur
- `menu.context` Bağlam menüsü: Küçük açılır menü: başlık, satır (ikon, ad, kısayol tuşu), ayraç, is-active, is-danger
- `menu.modal` Onay penceresi: Onay/uyarı kutusu; bu HTML yalnız görünüm içindir, koddan MH.confirm({ title, text, danger, ok, icon }) çağır: Promise(true/false)
- `menu.choose` Seçim penceresi: Aranabilir liste penceresi: items [{ id, label, sub, icon, avatar, tone, badge, right, disabled }], multi çoklu seçim, max sınır
- `menu.amount` Tutar / adet penceresi: Sayı seçici: min, max, value, step, prefix ('$'), suffix, quick: [100, 1000, 'max']
- `menu.input` Metin penceresi: Tek alanlı giriş: label, placeholder, value, max, type ('text' | 'password' | 'number'), required
- `menu.radial` Radyal menü: Daire dilimli seçim: MH.radial(el, [{ icon, label, desc, disabled }], { title, hint, size, onPick })
- `menu.setting` Ayar satırı: MH.Menu içindeysen bunu yazma, view: 'settings' kullan
- `menu.standings` Sıralama listesi: Köşe sıralaması: mh-rank (is-1/2/3 madalya renkleri), ad, değer
- `menu.scoreboard` Skor tablosu: Takım skor tablosu: başlık + istatistikler, takım başlığı (mh-teamhead + mh-t-team1..5), mh-table, ping çubuğu, kendi satırın is-self
- `menu.podium` Podyum: İlk üç: slot sırası 2-1-3, her slotta oyuncu (avatar + ad + alt satır) ve numaralı blok
- `menu.dead` Ölüm ekranı: Büyük 'Öldün' başlığı, öldüren kartı (avatar, silah, mesafe, istatistikler) ve altta yeniden doğma halkası (data-mh-ring, --v 0..1) ile tuş ipuçları
- `menu.results` Maç sonucu: Maç bitişi: üstte başlık (Zafer/Yenilgi), alt satır ve mh-summary özet sayıları; podyum ayrı varyant
- `menu.loading` Yükleme ekranı: Tam ekran: arka plan (__art), başlık/alt metin/rozetler (__main), altta ipucu ve ilerleme (__foot)

### Mağaza ve satın alma → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/shop.md
- `shop.item` Ürün kutucuğu: Görsel alanı (.mh-item__art, oran --ratio, varsayılan 16/10) + ad + alt satır ve fiyat
- `shop.square` Kare görselli kutucuk: Görsel alanı 1:1: .mh-item--square
- `shop.grouped` Gruplu ızgara: Izgarayı başlıklarla böl: .mh-shopgroup (kicker + sayı) satırın tamamını kaplar, altına kutucuklar gelir
- `shop.list` Liste satırı: Alt alta liste: .mh-item--row (solda kare küçük görsel, ortada ad + ayrıntı, sağda .mh-item__side fiyat + stok)
- `shop.strip` Yatay şerit: Yan yana kaydırılan kutucuklar: .mh-shopstrip (--w kutucuk genişliği, kaydırma noktaları)
- `shop.mini` Mini ızgara: Çok sayıda küçük eşya: .mh-item--mini (kare görsel, kısa ad, küçük fiyat), --cols 5-8
- `shop.art` Görsel alanı: Oran sabit, içerik değişir: ikon, silah çizimi (data-weapon) ya da img (object-fit: cover; --fit:contain ile sığdır)
- `shop.cats` Kategoriler: Mağaza üstü kategori seçici: ikon + ad + adet; seçili is-active (vurgu dolgulu)
- `shop.price` Fiyat durumları: mh-price (+ --sm küçük, --tag etiketli)
- `shop.qty` Adet seçici: Eksi / sayı / artı
- `shop.buy` Satın alma paneli: Menünün sağ sütunu (mh-menu__aside) için: görsel (.mh-buy__art, --ratio), başlık, açıklama, özellik listesi (dl.mh-buy__specs), adet + toplam (.mh-buy__total), satın al düğmesi, not satırı (bakiye/sahiplik)
- `shop.cart` Sepet: Birden çok ürünü tek seferde almak için: satır (küçük kare görsel, ad, adet × fiyat, toplam), alt toplam / kese / kalan, onay düğmesi
- `shop.keylist` Tuş listesi: Tuş + açıklama satırları (.mh-keylist__row); birden çok tuş yan yana, ikinci satır small

### Yayın ve izleyici → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/stream.md
- `stream.statbar` Durum şeridi: Yatay istatistik çipleri: ikon + büyük sayı + etiket (seviye, can, öldürme…)
- `stream.statcard` İstatistik kartı: Oyuncu özeti: seviye halkası + ad, altında 2×2 hücre (ikon, sayı, etiket)
- `stream.winloss` Galibiyet / mağlubiyet: Skor (yeşil W, kırmızı L) ve son maç geçmişi: data-history=&quot;WWLWWLW&quot; harfleri noktaya çevrilir
- `stream.vote` İzleyici oylaması: Soru + süre rozeti + seçenekler
- `stream.queue` Olay kuyruğu: Sıradaki olaylar listesi; çalışan satır is-running, ton mh-t-*; sağda süre veya 'sırada'
- `stream.leader` Destekçi sıralaması: En çok destekleyenler: başlık, satırlar (mh-rank is-1/2/3, avatar, ad, değer)
- `stream.livestats` Canlı sayaçlar: Yayın göstergeleri: 'Canlı' rozeti + izleyici/beğeni/jeton hücreleri (ton + ikon + sayı)
- `stream.commands` Komut ve hediye listesi: İzleyici komutları: kod (code) veya hediye çipi (mh-gift-chip) + açıklama
- `stream.streamer` Yayıncı kartı: Avatar (is-live çerçeve), ad + doğrulama, meta satırı (izleyici, takipçi)
- `stream.likes` Beğeni yağmuru: Kalpleri yukarı süzdüren efekt alanı
- `stream.gift-hero` Büyük hediye: Pahalı hediye için ekran ortası kahraman gösterim: büyük sanat, gönderen, hediye adı, jeton rozeti
- `stream.crop` Kare / dikey yayın kırpması: Yayın 9:16 ya da 1:1 kırpılınca HUD orta sütuna toplanır

### Hayatta kalma ve mod → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/survival.md
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

### İsim etiketleri → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/tags.md
- `tags.default` Standart: Ad, oyuncu numarası, rozet, can ve zırh barı, alt satır
- `tags.relations` İlişki renkleri: Aynı etiket, renk ilişkiyi söyler: is-friend, is-enemy, nötr (sınıfsız), takım mh-t-team1..5; ayrıca mh-t-gold (VIP), mh-t-info (polis) gibi tonlar
- `tags.compact` Kompakt: mh-tag--compact: rozet ve alt satır gizli, ad 13px, bar 56px
- `tags.hp-number` Can sayısı: variant: hp
- `tags.shield-pips` Kalkan segmentleri: Can barının altına mh-pips (data-pips=&quot;dolu/toplam&quot;): zırh plakası ya da kalkan katmanı
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
- `tags.squad` Takım numarası: Bölük/ekip sırası: adın önünde numara kutusu (mh-tag__num)
- `tags.roles` Rol etiketli: role: üstte küçük rol yazısı (POLİS, SAĞLIK, ŞERİF…)
- `tags.wanted` Aranma seviyesi: Ad altında aranma yıldızları (mh-wanted, i.on dolu)
- `tags.race` Yarış sırası: variant: race
- `tags.vip` Korunacak hedef: variant: vip
- `tags.boss` Boss: variant: boss
- `tags.npc` NPC: variant: npc
- `tags.viewer` Canlı yayın izleyicisi: variant: viewer
- `tags.far` Uzaktaki: variant: far
- `tags.group` Kalabalık özeti: Üst üste binen grubu tek etikette say: ad + mh-tag__more (+3)
- `tags.states` Durumlar: Herhangi bir biçime eklenir: is-talking (yeşil + mikrofon), is-typing (…), is-leader (taç), is-afk (sönük), is-target (altı çizili), is-dead (üstü çizili)
- `tags.downed` Yere düştü: is-down: kırmızı, yanıp sönen ad; bar kalan kanama süresi, alt satır kaldırma ipucu
- `tags.bubble` Konuşma balonu: bubble: etiketin üstünde kısa sohbet metni (yayıncı/izleyici mesajı); 220px'e kadar kayar

### Araç ve binek → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/vehicle.md
- `vehicle.speedo` Hız kadranı: Dairesel kadran: hız yayı, son %15 kırmızı bölge, ince devir yayı, vites, lambalar
- `vehicle.speed-mini` Kompakt hız: Büyük sayı + vites + devir segmentleri; son üç segment kırmızıya döner
- `vehicle.gauges` Yakıt ve motor ölçerleri: İkon + ince bar satırları (yakıt, motor, nitro)
- `vehicle.fuel-ring` Halka ölçer: Ortasında ikon olan halka: yakıt, pil, nitro
- `vehicle.lamps` Gösterge lambaları: Emniyet kemeri, far, kilit, arıza: on yanık, is-warn kırmızı yanıp söner; ton --tone-rgb ile

### Yaşam göstergeleri → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v3.0.0/ai/vitals.md
- `vitals.bar` Bar: Tek değer: can, zırh, ilerleme
- `vitals.bar-ghost` Hasar izli bar: Değer düşünce beyaz iz yavaşça kapanır
- `vitals.bar-notch` Çentikli bar: Eşit bölmeli bar; --notch bölme sayısı
- `vitals.bar-vertical` Dikey bar: Ekran kenarına yaslı ince sütun
- `vitals.bar-line` Çizgi bar: 2px ince çizgi + uçta parlak çentik (mh-bar--tip)
- `vitals.bar-line-meter` Etiketli çizgi: mh-meter içinde çizgi bar: üstte küçük etiket solda, değer sağda
- `vitals.bar-tip` Uç ışıklı bar: Herhangi bir bara mh-bar--tip eklenince dolgu ucunda beyaz parlak çizgi akar
- `vitals.bar-skew` Eğik bar: Paralelkenar bar (mh-bar--skew); __text ile değer barın içinde
- `vitals.bar-chevron` Ok uçlu bar: mh-bar--chevron eğik kesik uçlar, mh-bar--arrow sivri ok
- `vitals.bar-glass` Cam hap bar: Yuvarlak (mh-bar--pill) + cam parlaması (mh-bar--glass)
- `vitals.bar-stripe` Dolan bar: Hareketli çapraz çizgiler (mh-bar--stripe): yenilenen can, şarj, yükleme
- `vitals.bar-heat` Renk geçişli bar: mh-bar--heat: dolgu kırmızı→sarı→ton geçişli; değer düştükçe yalnız kırmızı kısım kalır
- `vitals.bar-ticks` Ölçekli bar: İnce 1px bölme çizgileri (mh-bar--ticks, --ticks adet)
- `vitals.bar-frame` Çerçeveli bar: mh-bar--frame: ton renkli ince kenarlık, içte boşluklu dolgu
- `vitals.bar-center` Ortadan / sağdan dolan: mh-bar--center ortadan iki yana açılır (denge, gürültü, ısı)
- `vitals.bar-layers` Kalkan ve iyileşme katmanı: __over aşırı kalkanı çizgili katman olarak gösterir (--o 0..1); __gain iyileşme önizlemesi (transform: scaleX)
- `vitals.bar-duo` Can + ince zırh çizgisi: Kalın can barı, hemen üstünde 3px zırh çizgisi
- `vitals.strip` Şerit: Tek satır: ton kenarlı koyu şerit, ikon + bar + sayı
- `vitals.strip-skew` Eğik şerit: mh-strip--skew: şerit eğik, içerik düz kalır
- `vitals.plate` Büyük sayılı plaka: Büyük sayı + küçük etiket üstte, altta çizgi bar
- `vitals.plate-plates` Plaka + zırh parçaları: Battle royale tarzı: üstte zırh plakaları (mh-pips data-pips), altta can barı ve büyük sayı
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
