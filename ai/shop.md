# Mağaza ve satın alma
Ürün kutucuğu (sabit oranlı görsel alanı: ikon, silah çizimi ya da img), gruplu ızgara, liste, yatay şerit, mini ızgara, kategoriler, fiyat durumları, adet, satın alma paneli, sepet, tuş listesi. Menü kabuğuyla birlikte kullanılır (menu.shell3: solda bölümler, ortada ürünler, sağda satın alma paneli).

## shop.item — Ürün kutucuğu
Görsel alanı (.eui-item__art, oran --ratio, varsayılan 16/10) + ad + alt satır ve fiyat. Görsele ikon, data-weapon ya da img konur. Durumlar: is-active seçili, is-owned sahip (rozet), is-locked kilitli, nadirlik is-rare|is-epic|is-legendary.
JS: `el.classList.toggle('is-active')`

```html
<div class="eui-panel eui-pad">
<div class="eui-shopgrid" style="--cols:3;width:450px">
  <div class="eui-item is-owned"><div class="eui-item__art"><i data-i="horse"></i></div><div class="eui-item__body"><span class="eui-item__name">Kentucky Saddler</span><div class="eui-item__meta"><span>Siyah</span><span class="eui-badge eui-t-success">Seçili</span></div></div></div>
  <div class="eui-item is-active"><div class="eui-item__art"><i data-i="horse"></i></div><div class="eui-item__body"><span class="eui-item__name">Morgan</span><div class="eui-item__meta"><span>Doru</span><span class="eui-price eui-price--sm">$55.00</span></div></div></div>
  <div class="eui-item is-locked"><div class="eui-item__art"><span class="eui-badge"><i data-i="lock"></i>Bölüm 3</span><i data-i="horse"></i></div><div class="eui-item__body"><span class="eui-item__name">Arabian</span><div class="eui-item__meta"><span>Beyaz</span><span class="eui-price eui-price--sm is-locked">$1.250</span></div></div></div>
</div>
</div>
```

## shop.square — Kare görselli kutucuk
Görsel alanı 1:1: .eui-item--square. Rol, portre, eşya ikonları için. Altında ikonlu bilgi (can) ve fiyat.
JS: `el.classList.toggle('is-active')`

```html
<div class="eui-panel eui-pad">
<div class="eui-shopgrid" style="--cols:3;width:420px">
  <div class="eui-item eui-item--square"><div class="eui-item__art"><i data-i="fist"></i></div><div class="eui-item__body"><span class="eui-item__name">Yumrukçu</span><div class="eui-item__meta"><span><i data-i="heart-o"></i>500</span><span class="eui-price eui-price--sm">$50.00</span></div></div></div>
  <div class="eui-item eui-item--square"><div class="eui-item__art"><i data-i="rider"></i></div><div class="eui-item__body"><span class="eui-item__name">Atlı tüfekçi</span><div class="eui-item__meta"><span><i data-i="heart-o"></i>500</span><span class="eui-price eui-price--sm">$150.00</span></div></div></div>
  <div class="eui-item eui-item--square is-active"><div class="eui-item__art"><i data-i="medic"></i></div><div class="eui-item__body"><span class="eui-item__name">Sağlıkçı</span><div class="eui-item__meta"><span><i data-i="heart-o"></i>500</span><span class="eui-price eui-price--sm">$250.00</span></div></div></div>
</div>
</div>
```

## shop.grouped — Gruplu ızgara
Izgarayı başlıklarla böl: .eui-shopgroup (kicker + sayı) satırın tamamını kaplar, altına kutucuklar gelir. Silahçı, ahır, terzi gibi kategorili mağazalar için.
JS: `—`

```html
<div class="eui-panel eui-pad">
<div class="eui-shopgrid" style="--cols:4;width:720px">
  <div class="eui-shopgroup"><span class="eui-kicker">Tabanca</span><small>3</small></div>
  <div class="eui-item"><div class="eui-item__art"><i data-weapon="revolver"></i></div><div class="eui-item__body"><span class="eui-item__name">Cattleman tabanca</span><div class="eui-item__meta"><span>30 mermi</span><span class="eui-price eui-price--sm">$50.00</span></div></div></div>
  <div class="eui-item"><div class="eui-item__art"><i data-weapon="revolver"></i></div><div class="eui-item__body"><span class="eui-item__name">Schofield tabanca</span><div class="eui-item__meta"><span>30 mermi</span><span class="eui-price eui-price--sm">$110.00</span></div></div></div>
  <div class="eui-item is-owned"><div class="eui-item__art"><i data-weapon="pistol"></i></div><div class="eui-item__body"><span class="eui-item__name">Volcanic tabanca</span><div class="eui-item__meta"><span>Sahipsin · mermi</span><span class="eui-price eui-price--sm">$12.00</span></div></div></div>
  <div class="eui-shopgroup"><span class="eui-kicker">Tüfek</span><small>2</small></div>
  <div class="eui-item is-rare"><div class="eui-item__art"><i data-weapon="carbine"></i></div><div class="eui-item__body"><span class="eui-item__name">Karabina</span><div class="eui-item__meta"><span>40 mermi</span><span class="eui-price eui-price--sm">$90.00</span></div></div></div>
  <div class="eui-item is-epic"><div class="eui-item__art"><span class="eui-badge eui-t-danger">−20%</span><i data-weapon="repeater"></i></div><div class="eui-item__body"><span class="eui-item__name">Lancaster tüfek</span><div class="eui-item__meta"><span>40 mermi</span><span class="eui-price eui-price--sm"><s>$160</s>$128.00</span></div></div></div>
</div>
</div>
```

## shop.list — Liste satırı
Alt alta liste: .eui-item--row (solda kare küçük görsel, ortada ad + ayrıntı, sağda .eui-item__side fiyat + stok). .eui-shoplist içinde. Çok ürünlü ve uzun adlı mağazalar için.
JS: `el.querySelector('.eui-item').classList.add('is-active')`

```html
<div class="eui-panel eui-pad">
<div class="eui-shoplist" style="width:420px">
  <div class="eui-item eui-item--row is-active"><div class="eui-item__art"><i data-weapon="shotgun"></i></div><div class="eui-item__body"><span class="eui-item__name">Çift namlulu av tüfeği</span><div class="eui-item__meta"><span>Yakın mesafe · 12 fişek</span></div></div><div class="eui-item__side"><span class="eui-price eui-price--sm">$185.00</span><small>Stokta 2</small></div></div>
  <div class="eui-item eui-item--row"><div class="eui-item__art"><i data-i="bullets"></i></div><div class="eui-item__body"><span class="eui-item__name">Tüfek mermisi ×50</span><div class="eui-item__meta"><span>Normal</span></div></div><div class="eui-item__side"><span class="eui-price eui-price--sm">$6.00</span><small>Stokta ∞</small></div></div>
  <div class="eui-item eui-item--row is-locked"><div class="eui-item__art"><i data-i="dynamite"></i></div><div class="eui-item__body"><span class="eui-item__name">Dinamit</span><div class="eui-item__meta"><span><i data-i="lock"></i>Saygınlık 4</span></div></div><div class="eui-item__side"><span class="eui-price eui-price--sm is-locked">$24.00</span></div></div>
</div>
</div>
```

## shop.strip — Yatay şerit
Yan yana kaydırılan kutucuklar: .eui-shopstrip (--w kutucuk genişliği, kaydırma noktaları). Öne çıkanlar, günün fırsatları, son görülenler için.
JS: `—`

```html
<div class="eui-panel eui-pad">
<div class="eui-shopstrip" style="--w:180px;width:680px">
  <div class="eui-item"><div class="eui-item__art"><span class="eui-badge eui-t-accent">Yeni</span><i data-i="hat"></i></div><div class="eui-item__body"><span class="eui-item__name">Gambler şapka</span><div class="eui-item__meta"><span>Siyah keçe</span><span class="eui-price eui-price--sm">$18.00</span></div></div></div>
  <div class="eui-item"><div class="eui-item__art"><i data-i="whiskey"></i></div><div class="eui-item__body"><span class="eui-item__name">Viski</span><div class="eui-item__meta"><span>Dayanıklılık +</span><span class="eui-price eui-price--sm">$3.50</span></div></div></div>
  <div class="eui-item"><div class="eui-item__art"><span class="eui-badge eui-t-danger">−30%</span><i data-i="lantern"></i></div><div class="eui-item__body"><span class="eui-item__name">Gaz lambası</span><div class="eui-item__meta"><span>Kamp</span><span class="eui-price eui-price--sm"><s>$10</s>$7.00</span></div></div></div>
  <div class="eui-item"><div class="eui-item__art"><i data-i="tent"></i></div><div class="eui-item__body"><span class="eui-item__name">Çadır</span><div class="eui-item__meta"><span>Kamp</span><span class="eui-price eui-price--sm">$45.00</span></div></div></div>
  <div class="eui-item"><div class="eui-item__art"><i data-i="lasso"></i></div><div class="eui-item__body"><span class="eui-item__name">Kement</span><div class="eui-item__meta"><span>Araç</span><span class="eui-price eui-price--sm">$9.00</span></div></div></div>
</div>
</div>
```

## shop.mini — Mini ızgara
Çok sayıda küçük eşya: .eui-item--mini (kare görsel, kısa ad, küçük fiyat), --cols 5-8. Erzak, mermi, sarf malzemesi.
JS: `—`

```html
<div class="eui-panel eui-pad">
<div class="eui-shopgrid" style="--cols:5;--gap:6px;width:460px">
  <div class="eui-item eui-item--mini"><div class="eui-item__art"><i data-i="bread"></i></div><span class="eui-item__name">Ekmek</span><span class="eui-price">$1</span></div>
  <div class="eui-item eui-item--mini"><div class="eui-item__art"><i data-i="meat"></i></div><span class="eui-item__name">Et</span><span class="eui-price">$3</span></div>
  <div class="eui-item eui-item--mini is-active"><div class="eui-item__art"><i data-i="apple"></i></div><span class="eui-item__name">Elma</span><span class="eui-price">$0.5</span></div>
  <div class="eui-item eui-item--mini"><div class="eui-item__art"><i data-i="bottle"></i></div><span class="eui-item__name">Tonik</span><span class="eui-price">$4</span></div>
  <div class="eui-item eui-item--mini"><div class="eui-item__art"><i data-i="cigar"></i></div><span class="eui-item__name">Puro</span><span class="eui-price">$2</span></div>
</div>
</div>
```

## shop.art — Görsel alanı
Oran sabit, içerik değişir: ikon, silah çizimi (data-weapon) ya da img (object-fit: cover; --fit:contain ile sığdır). --ratio: 1 (kare), 16/10 (varsayılan), 4/3, 21/9.
JS: `—`

```html
<div class="eui-panel eui-pad">
<div class="eui-flex eui-gap-2 eui-items-start">
  <div class="eui-item" style="width:110px"><div class="eui-item__art" style="--ratio:1"><i data-i="horse"></i></div><span class="eui-sub">1 : 1 · ikon</span></div>
  <div class="eui-item" style="width:160px"><div class="eui-item__art"><i data-weapon="sniper"></i></div><span class="eui-sub">16 : 10 · silah</span></div>
  <div class="eui-item" style="width:200px"><div class="eui-item__art" style="--ratio:21/9"><i data-i="car-sport"></i></div><span class="eui-sub">21 : 9 · araç</span></div>
</div>
</div>
```

## shop.cats — Kategoriler
Mağaza üstü kategori seçici: ikon + ad + adet; seçili is-active (vurgu dolgulu).
JS: `el.children[1].classList.add('is-active')`

```html
<div class="eui-panel eui-pad">
<div class="eui-shopcats">
  <button class="eui-shopcat is-active"><i data-i="grid"></i>Tümü<small>42</small></button>
  <button class="eui-shopcat"><i data-i="revolver"></i>Tabanca<small>6</small></button>
  <button class="eui-shopcat"><i data-i="rifle"></i>Tüfek<small>9</small></button>
  <button class="eui-shopcat"><i data-i="bullets"></i>Mermi<small>14</small></button>
  <button class="eui-shopcat"><i data-i="horse"></i>Binek<small>8</small></button>
</div>
</div>
```

## shop.price — Fiyat durumları
eui-price (+ --sm küçük, --tag etiketli). Durumlar: indirim (s içinde eski fiyat), is-short yetersiz bakiye (kırmızı), is-locked kilitli, is-free ücretsiz.
JS: `el.querySelector('.eui-price').classList.add('is-short')`

```html
<div class="eui-panel eui-pad">
<div class="eui-flex eui-gap-3" style="flex-wrap:wrap">
  <span class="eui-price">$250.00</span>
  <span class="eui-price"><s>$160</s>$128.00</span>
  <span class="eui-price is-short">$1.250</span>
  <span class="eui-price is-locked">$900</span>
  <span class="eui-price is-free">Ücretsiz</span>
  <span class="eui-price eui-price--tag">$55.00</span>
  <span class="eui-price eui-price--tag is-short">$4.800</span>
</div>
</div>
```

## shop.qty — Adet seçici
Eksi / sayı / artı. Mermi ve sarf alımında; toplamı ayrıca yaz.
JS: `el.querySelector('b').textContent = 3`

```html
<div class="eui-panel eui-pad">
<div class="eui-qty"><button>−</button><b>2</b><button>+</button></div>
</div>
```

## shop.buy — Satın alma paneli
Menünün sağ sütunu (eui-menu__aside) için: görsel (.eui-buy__art, --ratio), başlık, açıklama, özellik listesi (dl.eui-buy__specs), adet + toplam (.eui-buy__total), satın al düğmesi, not satırı (bakiye/sahiplik).
JS: `EUI.mount(root)`

```html
<div class="eui-panel eui-pad">
<div class="eui-buy">
  <div class="eui-buy__art"><span class="eui-badge eui-t-info">Rol</span><i data-i="medic"></i></div>
  <div class="eui-buy__title"><span class="eui-kicker eui-kicker--accent">Üye al</span><span class="eui-title eui-title--lg">Sağlıkçı</span></div>
  <p class="eui-buy__desc">Yaralanan ekip arkadaşının yanına koşar, yarasını sarıp canını doldurur. Kendi atı ve kıyafetiyle katılır.</p>
  <dl class="eui-buy__specs"><dt>Can</dt><dd>500</dd><dt>Silah</dt><dd>Schofield</dd><dt>Günlük ücret</dt><dd>$12.00</dd></dl>
  <div class="eui-buy__total"><div class="eui-qty"><button>−</button><b>1</b><button>+</button></div><span class="eui-price">$250.00</span></div>
  <button class="eui-btn eui-btn--primary eui-btn--block"><i data-i="user-plus"></i>Ekibe al</button>
  <span class="eui-buy__note"><i data-i="wallet"></i>Kese: $28.365,59 · Ekip 5 / 8</span>
</div>
</div>
```

## shop.cart — Sepet
Birden çok ürünü tek seferde almak için: satır (küçük kare görsel, ad, adet × fiyat, toplam), alt toplam / kese / kalan, onay düğmesi. Yetersiz bakiyede kalan satırı eui-tone eui-t-danger.
JS: `EUI.mount(root)`

```html
<div class="eui-panel eui-pad">
<div class="eui-cart">
  <div class="eui-cart__line"><div class="eui-item__art"><i data-weapon="repeater"></i></div><div><b>Lancaster tüfek</b><small>1 × $128.00</small></div><span class="eui-price eui-price--sm">$128.00</span></div>
  <div class="eui-cart__line"><div class="eui-item__art"><i data-i="bullets"></i></div><div><b>Tüfek mermisi ×50</b><small>3 × $6.00</small></div><span class="eui-price eui-price--sm">$18.00</span></div>
  <div class="eui-cart__sum"><span>Ara toplam</span><b>$146.00</b><span>Kese</span><b>$28.365,59</b><span class="is-total">Kalan</span><b class="is-total">$28.219,59</b></div>
  <button class="eui-btn eui-btn--primary eui-btn--block"><span class="eui-key eui-key--sm">ENTER</span>Satın al</button>
</div>
</div>
```

## shop.keylist — Tuş listesi
Tuş + açıklama satırları (.eui-keylist__row); birden çok tuş yan yana, ikinci satır small. Menünün 'Tuşlar' bölümü; --key-w tuş sütunu genişliği.
JS: `—`

```html
<div class="eui-panel eui-pad">
<div class="eui-keylist" style="width:440px">
  <div class="eui-keylist__row"><span><span class="eui-key">F9</span></span>Menüyü aç / kapat</div>
  <div class="eui-keylist__row"><span><span class="eui-key">G</span></span><div>Kişiyi işaretle / işareti kaldır<small>Nişan aldığın ya da ekran ortasındaki kişi</small></div></div>
  <div class="eui-keylist__row"><span><span class="eui-key">Ctrl</span><span class="eui-key">G</span></span>Bütün işaretleri sil</div>
  <div class="eui-keylist__row"><span><span class="eui-key">H</span></span>Ekip işaretlilere saldırır</div>
  <div class="eui-keylist__row"><span><span class="eui-key">Shift</span><span class="eui-key">H</span></span>Saldırıyı durdur, ekip yanına döner</div>
</div>
</div>
```
