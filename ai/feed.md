# Bildirim ve akış
Ekrana kısa süre düşen JS bileşenleri: toast, ölüm akışı, hediye, duyuru, görev şeridi, seviye atlama, başarım, eşya alma, geri sayım, altyazı, ilerleme. Hepsi tek çağrı; HTML yazılmaz. Kapsayıcıyı kendileri .eui-screen içinde açar.

## feed.toast — Toast
Köşe bildirimi: ton info|success|warn|danger|accent|legendary, süre ms (0 = kalıcı), en fazla 5 adet. text düz metindir; html: true ile HTML.

```js
EUI.toast({ tone: 'success', title: 'Kaydedildi', text: 'Ayarların güncellendi.', meta: 'az önce', duration: 5000 });
```

## feed.toast-action — Toast + eylem
Düğmeli bildirim (davet, onay). actions: [{ label, key, primary, onClick }]; düğmeye basınca kapanır.

```js
EUI.toast({ tone: 'accent', icon: 'user-plus', title: 'Ekip daveti', text: '<b>NabeMedia</b> seni ekibine davet ediyor.', html: true, duration: 9000, actions: [{ label: 'Kabul et', key: 'Y', primary: true }, { label: 'Reddet', key: 'N' }] });
```

## feed.kill — Ölüm akışı
Sağ üst akış satırı: öldüren, silah, ölen. self: true senin öldürmen (vurgulu), death: true senin ölümün (kırmızı), headshot: true. weapon: silah çizim adı.

```js
EUI.kill({ actor: 'Amiral Router', victim: 'Haydut', weapon: 'carbine', headshot: true, self: true });
```

## feed.gift — Hediye kartı
Yayın hediyesi: gönderen, hediye adı, art (emoji | 'i:ikon' | resim adresi), adet, coins, tier. Aynı key canlıyken gelirse yeni kart açılmaz, kombo sayacı zıplar.

```js
EUI.gift({ key: 'lion', from: 'NabeMedia', name: 'Aslan', art: '🦁', count: 1, coins: 29999, tier: 'legendary' });
```

## feed.announce — Duyuru
Ekran ortası büyük duyuru: kicker, title, sub. Yeni dalga, tur başı gibi anlar için.

```js
EUI.announce({ kicker: 'Yeni dalga', title: 'Dalga 8', sub: 'Zırhlı düşmanlar yaklaşıyor', duration: 3500 });
```

## feed.banner — Görev şeridi
Görev sonu şeridi: ortadan genişler, ödüller sırayla düşer. fail: true başarısızlık.

```js
EUI.banner({ title: 'Görev tamamlandı', sub: 'Konvoy baskını · 08:42', rewards: [{ value: '+$25.000', label: 'Ödeme', tone: 'success' }, { value: '+1.250', label: 'RP' }, { value: 'Altın', label: 'Derece', tone: 'gold' }] });
```

## feed.levelup — Seviye atlama
Seviye rozeti + açılan özellikler listesi.

```js
EUI.levelUp({ level: 43, unlocks: ['Ağır zırh', '+1 envanter slotu'] });
```

## feed.achievement — Başarım
Alt kenardan kayan başarım bildirimi: ad, puan, ikon.

```js
EUI.achievement({ name: 'Keskin nişancı', points: '+50', icon: 'trophy' });
```

## feed.pickup — Eşya alma
Sol alt köşe kısa liste: ikon, ad, miktar. Negatif miktar kırmızı (harcama).

```js
EUI.pickup({ icon: 'bullets', name: 'Tüfek mermisi', amount: 30 });
```

## feed.countdown — Geri sayım
Ekran ortasında 3-2-1 + go yazısı. onTick(n) her adımda çağrılır.

```js
EUI.countdown(3, { go: 'Başla' });
```

## feed.subtitle — Altyazı
Alt orta konuşma altyazısı: speaker, text, color; boxed: true kutulu (parlak sahnelerde okunur).

```js
EUI.subtitle({ speaker: 'Lester', text: 'Kamyonu limana getir. Polis peşindeyse önce onlardan kurtul.', boxed: false });
```

## feed.progress — İlerleme çubuğu
İşlem çubuğu (arama, tamir, hack): label, icon, duration ms. Promise döner (bitince true, iptalde false); .cancel() iptal eder.

```js
EUI.progress({ label: 'Kasa açılıyor', icon: 'lock', duration: 3000 }).then(function (ok) { console.log(ok ? 'bitti' : 'iptal'); });
```

## feed.chat — Sohbet
Oyun içi sohbet: eui-chat__log içinde eui-msg satırları (is-system sistem, __tag rozet, __name tonlu ad) + giriş. Yeni satırı log'a ekle; eskiyi sen sil (en fazla 50).
JS: `log.insertAdjacentHTML('beforeend', '&lt;div class=&quot;eui-msg&quot;&gt;…&lt;/div&gt;')`

```html
<div class="eui-chat">
  <div class="eui-chat__log">
    <div class="eui-msg is-system">Sunucuya hoş geldin.</div>
    <div class="eui-msg"><span class="eui-msg__tag eui-t-danger">YETKİLİ</span><span class="eui-msg__name eui-t-danger">Amiral:</span>Etkinlik 5 dakika içinde başlıyor.</div>
    <div class="eui-msg"><span class="eui-msg__name eui-t-team1">NabeMedia:</span>hazırız, B noktasındayız</div>
  </div>
  <div class="eui-input-wrap eui-catch"><i data-i="chat"></i><input class="eui-input" placeholder="Mesaj yaz…"><span class="eui-key eui-key--sm">ENTER</span></div>
</div>
```

## feed.ticker — Kayan şerit
Alt kenarda sürekli kayan haber şeridi: etiket + __track içinde span'ler. Kesintisiz kayma için içeriği iki kez yaz.
JS: `—`

```html
<div class="eui-ticker" style="--w:640px"><span class="eui-ticker__label"><i data-i="broadcast" class="eui-i--sm"></i>Canlı</span>
<div class="eui-ticker__track"><span><b>NabeMedia</b> 5× Aslan gönderdi</span><span>Etkinlik: <b>Konvoy baskını</b> 21:30</span><span><b>NabeMedia</b> 5× Aslan gönderdi</span><span>Etkinlik: <b>Konvoy baskını</b> 21:30</span></div></div>
```
