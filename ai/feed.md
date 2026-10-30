# Bildirim ve akış
Ekrana kısa süre düşen JS bileşenleri: toast, ölüm akışı, hediye, duyuru, görev şeridi, seviye atlama, başarım, eşya alma, geri sayım, altyazı, ilerleme. Hepsi tek çağrı; HTML yazılmaz. Kapsayıcıyı kendileri .mh-screen içinde açar.

## feed.toast — Toast
Köşe bildirimi: ton info|success|warn|danger|accent|legendary, süre ms (0 = kalıcı), en fazla 5 adet. text düz metindir; html: true ile HTML.

```js
MH.toast({ tone: 'success', title: 'Kaydedildi', text: 'Ayarların güncellendi.', meta: 'az önce', duration: 5000 });
```

## feed.toast-action — Toast + eylem
Düğmeli bildirim (davet, onay). actions: [{ label, key, primary, onClick }]; düğmeye basınca kapanır.

```js
MH.toast({ tone: 'accent', icon: 'user-plus', title: 'Ekip daveti', text: '<b>NabeMedia</b> seni ekibine davet ediyor.', html: true, duration: 9000, actions: [{ label: 'Kabul et', key: 'Y', primary: true }, { label: 'Reddet', key: 'N' }] });
```

## feed.kill — Ölüm akışı
Sağ üst akış satırı: öldüren, silah, ölen. self: true senin öldürmen (vurgulu), death: true senin ölümün (kırmızı), headshot: true. weapon: silah çizim adı.

```js
MH.kill({ actor: 'Amiral Router', victim: 'Haydut', weapon: 'carbine', headshot: true, self: true });
```

## feed.gift — Hediye kartı
Yayın hediyesi: gönderen, hediye adı, art (emoji | 'i:ikon' | resim adresi), adet, coins, tier. Aynı key canlıyken gelirse yeni kart açılmaz, kombo sayacı zıplar.

```js
MH.gift({ key: 'lion', from: 'NabeMedia', name: 'Aslan', art: '🦁', count: 1, coins: 29999, tier: 'legendary' });
```

## feed.announce — Duyuru
Ekran ortası büyük duyuru: kicker, title, sub. Yeni dalga, tur başı gibi anlar için.

```js
MH.announce({ kicker: 'Yeni dalga', title: 'Dalga 8', sub: 'Zırhlı düşmanlar yaklaşıyor', duration: 3500 });
```

## feed.banner — Görev şeridi
Görev sonu şeridi: ortadan genişler, ödüller sırayla düşer. fail: true başarısızlık.

```js
MH.banner({ title: 'Görev tamamlandı', sub: 'Konvoy baskını · 08:42', rewards: [{ value: '+$25.000', label: 'Ödeme', tone: 'success' }, { value: '+1.250', label: 'RP' }, { value: 'Altın', label: 'Derece', tone: 'gold' }] });
```

## feed.levelup — Seviye atlama
Seviye rozeti + açılan özellikler listesi.

```js
MH.levelUp({ level: 43, unlocks: ['Ağır zırh', '+1 envanter slotu'] });
```

## feed.achievement — Başarım
Alt kenardan kayan başarım bildirimi: ad, puan, ikon.

```js
MH.achievement({ name: 'Keskin nişancı', points: '+50', icon: 'trophy' });
```

## feed.pickup — Eşya alma
Sol alt köşe kısa liste: ikon, ad, miktar. Negatif miktar kırmızı (harcama).

```js
MH.pickup({ icon: 'bullets', name: 'Tüfek mermisi', amount: 30 });
```

## feed.countdown — Geri sayım
Ekran ortasında 3-2-1 + go yazısı. onTick(n) her adımda çağrılır.

```js
MH.countdown(3, { go: 'Başla' });
```

## feed.subtitle — Altyazı
Alt orta konuşma altyazısı: speaker, text, color; boxed: true kutulu (parlak sahnelerde okunur).

```js
MH.subtitle({ speaker: 'Lester', text: 'Kamyonu limana getir. Polis peşindeyse önce onlardan kurtul.', boxed: false });
```

## feed.progress — İlerleme çubuğu
İşlem çubuğu (arama, tamir, hack): label, icon, duration ms. Promise döner (bitince true, iptalde false); .cancel() iptal eder.

```js
MH.progress({ label: 'Kasa açılıyor', icon: 'lock', duration: 3000 }).then(function (ok) { console.log(ok ? 'bitti' : 'iptal'); });
```

## feed.chat — Sohbet
Oyun içi sohbet: mh-chat__log içinde mh-msg satırları (is-system sistem, __tag rozet, __name tonlu ad) + giriş. Yeni satırı log'a ekle; eskiyi sen sil (en fazla 50).
JS: `log.insertAdjacentHTML('beforeend', '&lt;div class=&quot;mh-msg&quot;&gt;…&lt;/div&gt;')`

```html
<div class="mh-chat">
  <div class="mh-chat__log">
    <div class="mh-msg is-system">Sunucuya hoş geldin.</div>
    <div class="mh-msg"><span class="mh-msg__tag mh-t-danger">YETKİLİ</span><span class="mh-msg__name mh-t-danger">Amiral:</span>Etkinlik 5 dakika içinde başlıyor.</div>
    <div class="mh-msg"><span class="mh-msg__name mh-t-team1">NabeMedia:</span>hazırız, B noktasındayız</div>
  </div>
  <div class="mh-input-wrap mh-catch"><i data-i="chat"></i><input class="mh-input" placeholder="Mesaj yaz…"><span class="mh-key mh-key--sm">ENTER</span></div>
</div>
```

## feed.ticker — Kayan şerit
Alt kenarda sürekli kayan haber şeridi: etiket + __track içinde span'ler. Kesintisiz kayma için içeriği iki kez yaz.
JS: `—`

```html
<div class="mh-ticker" style="--w:640px"><span class="mh-ticker__label"><i data-i="broadcast" class="mh-i--sm"></i>Canlı</span>
<div class="mh-ticker__track"><span><b>NabeMedia</b> 5× Aslan gönderdi</span><span>Etkinlik: <b>Konvoy baskını</b> 21:30</span><span><b>NabeMedia</b> 5× Aslan gönderdi</span><span>Etkinlik: <b>Konvoy baskını</b> 21:30</span></div></div>
```
