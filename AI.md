# MHud 2.0.1 — AI kılavuzu

Oyun HUD'u ve yayın overlay'i için hazır arayüz kiti (saf CSS + küçük JS). **Bu dosyayı oku, kaynak kodu açma.**
Bir bileşen lazımsa aşağıdaki aileler dizininden varyantı seç, yalnız o ailenin `ai/<aile>.md` dosyasını aç, HTML parçasını olduğu gibi kopyala.

## İhtiyaç → aile (hızlı seçim)

can/zırh/stamina → `vitals` · boss, dalga, hedef, XP, kanal, ele geçirme, yükleme çubukları → `bars` · oyuncu/NPC başı etiketi → `tags` · para, saat, seviye, aranma → `economy` · silah, envanter, ekip → `gear` · pusula, minimap, işaretçi → `location` · hız, yakıt, binek → `vehicle` · toast, kill feed, duyuru → `feed` · nişangâh, hasar yönü, istem, diyalog → `combat` · menü, modal, skor tablosu, ölüm/yükleme ekranı → `menu` · izleyici oylaması, canlı sayaç → `stream` · sürü, canlandırma, ganimet → `survival` · grafik, seri, etkinlik → `extras` · kâğıt/afiş/telgraf → `print` · düğme, alan, tablo, kaydırma çubuğu → `base`. Her ailenin dosyasını yukarıdaki dizindeki tam adresten aç.

## Kurulum

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/dist/mhud.min.css">
<script src="https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/dist/mhud.min.js"></script>
<body class="mh" data-mh-theme="modern"> … <script>MH.mount(document.body);</script>
```

Sürümü her zaman sabit yaz (`@latest` yok). Oyun içi NUI'de CDN kullanma: `dist/` klasörünü (fontlarla) resource'a kopyala.
Yeni eklenen içeriğe `MH.mount(kapsayıcı)` çağır (ikon, halka, bar, segment kurulumu bunda).

## Tema ve renk

- Tema tek öznitelik: `data-mh-theme` (kapsayıcıda ya da `MH.theme('frontier')`). **Bileşen HTML'i temadan bağımsızdır; tema değişince kodu değiştirme.**
- Temalar: `modern` (varsayılan, GTA tarzı), `tactical` (sert, askeri), `frontier` (western HUD, RDR2), `oldwest` (kâğıt-mürekkep, baskı nesneleri).
- Vurgu: `data-mh-accent="amber|crimson|mint|ice|violet|rose|cyan|lime|gold|tiktok"`.
- Ton sınıfları (`mh-t-*`) rengi belirler: `health armor stamina special oxygen hunger thirst stress accent success info warn danger legendary gold silver bronze neutral team1..team5 friend enemy xp`.

## Kurallar

- Önekler: sınıf `mh-`, değişken `--mh-`, veri özniteliği `data-mh-*`; durumlar `is-*` (ör. `is-low`).
- Renk sabit yazma; ton sınıfı ya da `rgb(var(--mh-…-rgb) / a)`.
- İkon: `<i data-i="heart"></i>` (`MH.mount` svg'ye çevirir).
- Değer güncelle: `MH.bar(el, v)`, `MH.ring`, `MH.core`, `MH.pips` (her varyantın `JS:` satırı). `left/top/width` yazma.
- Yerleşim: `.mh-screen` içine `.mh-anchor` + köşe sınıfı (`mh-tl mh-tc mh-tr mh-ml mh-mc mh-mr mh-bl mh-bc mh-br`).
- 1080p referans; ölçek için `MH.autoScale()`.
- **İstediğin varyant listede yoksa kendin çizme.** Önce yakın varyantı ton/boy sınıflarıyla uyarla; olmuyorsa eksik olduğunu kullanıcıya söyle.

## Sosyal menü (isteğe bağlı, API)

Ekip, davet, kasa, cephanelik, rütbe, kanal, arkadaş, gelen kutusu ve takas menüsü HTML kopyalanarak değil **veriyle** kullanılır. `mhud.min.js` içinde `MH.Social` ve `MH.trade` vardır:

```js
var menu = MH.Social('#host', { section: 'crew', onAction: function (a) { /* a.action, a.data */ } });
menu.set(state); menu.patch({ crew: … }); menu.open('channels');
```

Menü durumu kendi değiştirmez; oyuncunun eylemi `{ action, data }` olarak `onAction`'a (NUI'de `MH.post('social', …)`) gider, sunucu yeni durumu `set/patch` ile yollar. NUI mesajları: `social:state`, `social:patch`, `social:open`, `social:close`. Durum şeması için `kit/js/mhud-social.js` dosyasının başlığına bak (yalnızca gerekirse).

## Bileşen aileleri

### Barlar → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/bars.md
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

### Temel parçalar → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/base.md
- `base.panel` Panel: Temel kutu
- `base.button` Düğme: Varyantlar: --primary (ana), varsayılan, --ghost (hafif), --tone + mh-t-* (renkli)
- `base.badge` Rozet: Küçük etiket: ton mh-t-*; --pill yuvarlak, --dot nokta, --live nabız
- `base.chip` Çip: Filtre/seçenek hapı; seçili is-active
- `base.keys` Tuş ve ipucu: mh-key tek tuş (--sm/--lg); mh-hints içinde mh-hint = tuş(lar) + açıklama
- `base.field` Metin alanı: Etiketli giriş: label.mh-field içinde kicker + input.mh-input
- `base.toggle` Anahtar ve onay kutusu: mh-toggle (aç/kapa anahtarı) ve mh-check (kutu)
- `base.slider` Kaydırıcı: input.mh-slider; data-out='#id' ve data-unit ile değeri başka öğeye yazar (MH.mount bağlar)
- `base.stepper` Seçici (stepper): ◀ değer ▶ seçici: data-mh-stepper='A|B|C', başlangıç data-index
- `base.tabs` Sekmeler: data-mh-tabs butonları is-active ile çalıştırır
- `base.table` Tablo: mh-table: sağa hizalı sütun için th/td class='r'; sayı mh-num; satır durumu is-self (sen), is-dead; sıra mh-rank is-1/2/3
- `base.avatar` Avatar: Baş harfli yuvarlak/kare avatar: boyut --sm/--lg, --round, ton mh-t-*; is-live canlı yayın çerçevesi
- `base.spinner` Yükleniyor: Dönen gösterge
- `base.scroll` Kaydırma çubuğu: .mh altındaki tüm kaydırma çubukları tema renginde ince çizilir; ek sınıf gerekmez

### Savaş ve dünya → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/combat.md
- `combat.crosshair` Nişangâh: Dört biçim: artı (varsayılan), --dot, --circle, --t
- `combat.hit` Vuruş işareti: İsabette nişangâhta kısa X: kind boş normal, 'head' kafa, 'kill' öldürme
- `combat.damage-from` Hasar yönü: Ekran kenarında hasarın geldiği yönü gösteren yay: 0 önden, 90 sağdan, 180 arkadan (derece)
- `combat.flash` Ekran parlaması: Tüm ekran flaş: ikinci argüman true ise kırmızı (hasar), değilse beyaz (patlama)
- `combat.lockon` Hedef kilidi: Köşeli hedef çerçevesi; is-locking kilitlenirken daralır
- `combat.world-prompt` Dünya istemi: Nesne üstü etkileşim: nokta + tuş + eylem; uzaktayken is-far sadece nokta
- `combat.prompt` Tuş istemleri: Sağ alt köşe eylem listesi: tuş + açıklama; is-disabled soluk
- `combat.key` Tuş kapağı: Klavye tuşu simgesi: boyut mh-key--sm|--lg, biçim --solid|--accent
- `combat.hold` Basılı tut halkası: Tuşa basılı tutunca dolan halka (kilit açma, kurtarma)
- `combat.enemies` Düşman sayacı: Ekranda ve kuyrukta kaç düşman var + doluluk barı; sınıra yaklaşınca is-swarm kırmızı parlar
- `combat.versus` Takım skoru: İki takımın skoru, hayatta kalan noktaları (off = ölü) ve ortada tur/süre
- `combat.points` Ele geçirme noktaları: A/B/C kontrol noktaları: halka doluluğu (--v), takım rengi, is-contested çatışmalı
- `combat.dialog` Diyalog: Konuşan avatarı, söz satırı ve numaralı seçenekler

### Ekonomi ve durum → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/economy.md
- `economy.cash` Para ve banka: Sağ üst köşe para göstergesi; artış/azalış farkı kısa süre yüzer
- `economy.coin` Kompakt para: Tek satır ikon + tutar: puan, jeton, altın
- `economy.wanted` Aranma yıldızları: GTA tarzı 5 yıldız; dolu olanlara on sınıfı, is-flashing yanıp söner
- `economy.bounty` Ödül mührü: RDR2 tarzı: kafatası mührü + başındaki ödül tutarı
- `economy.clock` Saat ve hava: Hava ikonu + saat + durum ve gün
- `economy.xp` Seviye ve XP: Elmas seviye rozeti + XP barı + kazanılan puan
- `economy.levelring` Seviye halkası: Halka içinde seviye numarası; small etiketi altta
- `economy.effects` Etki simgeleri: Aktif buff/debuff'lar: simge, kalan süre (--v kalan oran), yığın sayısı
- `economy.effect-line` Etki satırı: Simgesiz metin satırı: ad + süre
- `economy.streak` Seri / kombo: Sayı büyür, alttaki çubuk süre dolunca söner; 5 ve üstünde is-hot kırmızı
- `economy.chip-stat` İstatistik çipleri: Yayın overlay'inde yan yana duran büyük sayı kartları (seviye, can, öldürme)
- `economy.standings` Sıralama: Skor tablosu satırları: sıra rozeti (is-1/2/3 madalya), ad, skor

### Grafik ve ilerleme → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/extras.md
- `extras.donut` Halka grafik: Yüzde halkası: data-mh-ring + --v (0..1), ortada değer ve etiket
- `extras.spark` Mini çizgi grafik: Boş div'e data-spark=&quot;1,3,2,5&quot; ver (data-w, data-h boyut); MH.mount çizer
- `extras.hbars` Yatay çubuklar: Karşılaştırma: etiket + çubuk (scaleX 0..1) + değer; tone
- `extras.columns` Dikey sütunlar: Zaman serisi sütunları: yükseklik --h; her sütun scaleY 0..1 + alt etiket
- `extras.delta` Değişim oku: Yüzde değişim: is-up yeşil ▲, is-down kırmızı ▼
- `extras.streak` Seri sayacı: Seri paneli: ikon, sayı, etiket, azalan süre çizgisi (__decay)
- `extras.achieve` Başarı satırı: Küçük başarı kartı: ikon, ad, ilerleme yazısı, ton'lu bar
- `extras.event` Etkinlik satırı: Takvim etkinliği: tarih kutusu, ad + canlı rozet, meta (saat, kişi, ödül), katıl düğmesi
- `extras.match` Maç geçmişi satırı: Maç özeti: sonuç rozeti (G yeşil / M kırmızı mh-rank), mod + harita + saat, Ö/A, MVP rozeti
- `extras.giftmap` Hediye haritası: Hediye → etki ızgarası: --cols sütun; öğe: sanat (emoji veya ikon), ad + jeton, etki

### Bildirim ve akış → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/feed.md
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

### Ekipman ve ekip → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/gear.md
- `gear.weapon` Silah paneli: Sağ alt köşe: silah adı, çizimi, şarjör/yedek, şarjör segmentleri, yan eşyalar
- `gear.ammo` Mermi sayacı: Silah çizimi olmadan yalnız şarjör / yedek
- `gear.hotbar` Yuva şeridi: Numaralı hızlı yuvalar: is-active seçili, is-cooldown (--cd oran) bekleme, is-empty boş; sayı ve dayanıklılık çubuğu isteğe bağlı
- `gear.inventory` Envanter ızgarası: Eşya hücreleri; --cols sütun sayısı
- `gear.party` Ekip kartları: Sol kenar ekip listesi: avatar, ad, mesafe, can/zırh ince barları
- `gear.squad-rings` Ekip halkaları: Yan yana avatarlar, çevresinde can halkası
- `gear.voice` Ses: Ses menzili çubukları (is-talking konuşurken yeşil) ve konuşanlar listesi; is-radio telsiz
- `gear.ping` Bağlantı kalitesi: 4 çubuklu ping göstergesi: iyi (varsayılan), is-mid orta, is-bad kötü
- `gear.teamhead` Takım başlığı: Skor tablosu takım başlığı: ad + büyük sayı; ton mh-t-team1..5

### Konum ve yön → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/location.md
- `location.compass` Pusula şeridi: Üst orta kayan yön şeridi; hedefler şerit üstünde simge olarak durur
- `location.street` Sokak ve bölge: Yön harfi + sokak adı + bölge
- `location.heading` Yön çipi: Sadece yön harfi ve derece; en az yer kaplayan yön göstergesi
- `location.coords` Koordinat: Geliştirici veya yayıncı için x / y / z satırı; sayılar tabular
- `location.minimap` Minimap çerçevesi: Dikdörtgen çerçeve, kuzey rozeti, alt bölge/saat şeridi
- `location.minimap-round` Yuvarlak minimap: Daire çerçeve; bölge şeridi yok, --w ve --h eşit olmalı
- `location.marker` Dünya işaretçisi: Hedef üstü pin + etiket + mesafe
- `location.marker-edge` Kenar işaretçisi: Ekran dışındaki hedef: pin kenarda, üstteki ok yönü gösterir (--a derece)
- `location.wayarrow` Hedef oku: Büyük yönlendirme oku + mesafe (görev, teslimat)
- `location.zone` Daralan bölge: Alan kapanma sayacı (battle royale, arena)

### Menü ve ekranlar → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/menu.md
- `menu.card` Eşya kartı: Mağaza/envanter kartı: art alanı (rozet + data-weapon veya ikon), ad, alt satır, fiyat
- `menu.classic` Klasik menü: Dikey liste menü (GTA Online tarzı): banner, sayaç, satırlar (is-active, is-disabled), sağda ok/onay kutusu/değer, altta açıklama kutusu
- `menu.context` Bağlam menüsü: Küçük açılır menü: başlık, satır (ikon, ad, kısayol tuşu), ayraç, is-active, is-danger
- `menu.modal` Onay penceresi: Onay/uyarı kutusu
- `menu.radial` Radyal menü: Daire dilimli seçim: MH.radial(el, [{ icon, label, desc, disabled }], { title, hint, size, onPick })
- `menu.setting` Ayar satırı: Sol metin (başlık + açıklama), sağda kontrol: mh-slider (data-out, data-unit ile değer yazılır), mh-toggle, mh-select
- `menu.standings` Sıralama listesi: Köşe sıralaması: mh-rank (is-1/2/3 madalya renkleri), ad, değer
- `menu.scoreboard` Skor tablosu: Takım skor tablosu: başlık + istatistikler, takım başlığı (mh-teamhead + mh-t-team1..5), mh-table, ping çubuğu, kendi satırın is-self
- `menu.podium` Podyum: İlk üç: slot sırası 2-1-3, her slotta oyuncu (avatar + ad + alt satır) ve numaralı blok
- `menu.dead` Ölüm ekranı: Büyük 'Öldün' başlığı, öldüren kartı (avatar, silah, mesafe, istatistikler) ve altta yeniden doğma halkası (data-mh-ring, --v 0..1) ile tuş ipuçları
- `menu.results` Maç sonucu: Maç bitişi: üstte başlık (Zafer/Yenilgi) ve alt satır; podyum ayrı varyant
- `menu.loading` Yükleme ekranı: Tam ekran: arka plan (__art), başlık/alt metin/rozetler (__main), altta ipucu ve ilerleme (__foot)

### Basılı nesneler → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/print.md
- `print.poster` Arananlar afişi: mh-paper mh-poster: başlık, kural satırı, fotoğraf alanı (ikon), ad, suç, ödül, alt not
- `print.telegram` Telgraf: Telgraf kâğıdı: marka + numara, gönderen/alıcı, gövde (span.stop = STOP), has-stamp ile damga alanı
- `print.headline` Gazete: Gazete sayfası: başlık bandı, tarih satırı, manşet, alt manşet, iki sütun (görsel kesiti .mh-headline__cut + paragraf)
- `print.ledger` Defter: Gelir/gider defteri: satırlar (gider için is-neg), altta toplam
- `print.ticket` Bilet: Kupon/bilet: ana bölüm (üst yazı, büyük ad, alt yazı) ve kopuk uç (adet/numara)
- `print.sign` Tabela: Yer tabelası: üst yazı, büyük ad, alt not
- `print.stamp` Damga: Eğik mühür yazısı; is-in ile vurulma animasyonu

### Yayın ve izleyici → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/stream.md
- `stream.statbar` Durum şeridi: Yatay istatistik çipleri: ikon + büyük sayı + etiket
- `stream.statcard` İstatistik kartı: Oyuncu özeti: seviye halkası + ad, altında 2×2 hücre (ikon, sayı, etiket)
- `stream.winloss` Galibiyet / mağlubiyet: Skor (yeşil W, kırmızı L) ve son maç geçmişi: data-history=&quot;WWLWWLW&quot; harfleri noktaya çevrilir
- `stream.vote` İzleyici oylaması: Soru + süre rozeti + seçenekler
- `stream.queue` Olay kuyruğu: Sıradaki olaylar listesi; çalışan satır is-running, ton mh-t-*; sağda süre veya 'sırada'
- `stream.leader` Destekçi sıralaması: En çok destekleyenler: başlık, satırlar (mh-rank is-1/2/3, avatar, ad, değer)
- `stream.livestats` Canlı sayaçlar: Yayın göstergeleri: 'Canlı' rozeti + izleyici/beğeni/jeton hücreleri (ton + ikon + sayı)
- `stream.commands` Komut ve hediye listesi: İzleyici komutları: kod (code) veya hediye çipi (mh-gift-chip) + açıklama
- `stream.streamer` Yayıncı kartı: Avatar (is-live çerçeve), ad + doğrulama, meta satırı (izleyici, takipçi)
- `stream.likes` Beğeni yağmuru: Kalpleri yukarı süzdüren efekt alanı

### Hayatta kalma ve mod → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/survival.md
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

### İsim etiketleri → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/tags.md
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
- `tags.frontier-sign` Western levha: variant: frontier
- `tags.bounty` Ödül etiketi: variant: bounty
- `tags.far` Uzaktaki: variant: far
- `tags.group` Kalabalık özeti: Üst üste binen grubu tek etikette say: ad + mh-tag__more (+3)
- `tags.states` Durumlar: Herhangi bir biçime eklenir: is-talking (yeşil + mikrofon), is-typing (…), is-leader (taç), is-afk (sönük), is-target (altı çizili), is-dead (üstü çizili)
- `tags.downed` Yere düştü: is-down: kırmızı, yanıp sönen ad; bar kalan kanama süresi, alt satır kaldırma ipucu
- `tags.bubble` Konuşma balonu: bubble: etiketin üstünde kısa sohbet metni (yayıncı/izleyici mesajı); 220px'e kadar kayar

### Araç ve binek → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/vehicle.md
- `vehicle.speedo` Hız kadranı: Dairesel kadran: hız yayı, son %15 kırmızı bölge, ince devir yayı, vites, lambalar
- `vehicle.speed-mini` Kompakt hız: Büyük sayı + vites + devir segmentleri; son üç segment kırmızıya döner
- `vehicle.gauges` Yakıt ve motor ölçerleri: İkon + ince bar satırları (yakıt, motor, nitro)
- `vehicle.fuel-ring` Halka ölçer: Ortasında ikon olan halka: yakıt, pil, nitro
- `vehicle.lamps` Gösterge lambaları: Emniyet kemeri, far, kilit, arıza: on yanık, is-warn kırmızı yanıp söner; ton --tone-rgb ile
- `vehicle.mount` Binek paneli: At için: ad, bağ seviyesi elmasları, can ve dayanıklılık çekirdekleri

### Yaşam göstergeleri → https://cdn.jsdelivr.net/gh/StreamEmber/mhud@v2.0.1/ai/vitals.md
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
