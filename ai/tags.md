# İsim etiketleri
Oyuncu/NPC başında görünen etiketler. Hepsi aynı .eui-tag yapısı (satır, barlar, alt satır); biçim .eui-tag--<biçim>, ilişki is-friend / is-enemy / eui-t-team1..5, durum is-talking / is-down / is-dead. Çok sayıda etiket için EUI.Nametags(world).update(liste); öğe alanları: name, sid, tone, health, armor, sub, badge, variant, role, avatar, level, clan, talking, typing, dead, down, afk, leader, bubble, compact.

## tags.default — Standart
Ad, oyuncu numarası, rozet, can ve zırh barı, alt satır. Her biçimin temeli; öğe alanları: name, sid, badge, health, armor, sub.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag is-friend"><div class="eui-tag__line"><span class="eui-tag__name">AmiralRouter</span><span class="eui-tag__id">12</span><span class="eui-badge eui-t-success">Dost</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">SVY 38 · 24 M</div></div>
<div class="eui-tag is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span><span class="eui-tag__id">8</span><span class="eui-badge eui-t-danger">Düşman</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="45"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="0"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">SVY 31 · 40 M</div></div>
</div>
```

## tags.relations — İlişki renkleri
Aynı etiket, renk ilişkiyi söyler: is-friend, is-enemy, nötr (sınıfsız), takım eui-t-team1..5; ayrıca eui-t-gold (VIP), eui-t-info (polis) gibi tonlar.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--compact is-friend"><div class="eui-tag__line"><span class="eui-tag__name">Amiral</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Router</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact"><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team1"><div class="eui-tag__line"><span class="eui-tag__name">Vinh</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team2"><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team3"><div class="eui-tag__line"><span class="eui-tag__name">StreamEmber</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team4"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
</div>
```

## tags.compact — Kompakt
eui-tag--compact: rozet ve alt satır gizli, ad 13px, bar 56px. Kalabalık sahneler, battle royale.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--compact is-friend"><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Vinh</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="30"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team2"><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="95"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
</div>
```

## tags.hp-number — Can sayısı
variant: hp. Bar yerine ad yanında büyük can sayısı; hızlı okunur, az yer kaplar.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--hp is-friend"><div class="eui-tag__line"><span class="eui-tag__name">Amiral</span><span class="eui-tag__hp">100</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--hp is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span><span class="eui-tag__hp">37</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
</div>
```

## tags.shield-pips — Kalkan segmentleri
Can barının altına eui-pips (data-pips=&quot;dolu/toplam&quot;): zırh plakası ya da kalkan katmanı.
JS: `EUI.pips(el.querySelector('.eui-pips'), 2, 3)`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag is-friend"><div class="eui-tag__line"><span class="eui-tag__name">AmiralRouter</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="90"><i class="eui-bar__fill"></i></div></div><div class="eui-pips eui-t-armor" data-pips="2/3"></div></div>
<div class="eui-tag is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="60"><i class="eui-bar__fill"></i></div></div><div class="eui-pips eui-t-armor" data-pips="1/4"></div></div>
</div>
```

## tags.level-clan — Seviye ve klan
level: adın önünde tonlu seviye kutusu; clan: [KLAN] öneki. RPG ve sunucu klanları.
JS: `EUI.Nametags(world).update([{ id, x, y, name, level: 42, clan: 'SE' }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag is-friend"><div class="eui-tag__line"><span class="eui-tag__lvl">42</span><span class="eui-tag__clan">[SE]</span><span class="eui-tag__name">Amiral</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">Stream Ember</div></div>
<div class="eui-tag is-enemy"><div class="eui-tag__line"><span class="eui-tag__lvl">17</span><span class="eui-tag__clan">[NV]</span><span class="eui-tag__name">Vinh</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="55"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">Night Viper</div></div>
</div>
```

## tags.plate — Plaka
variant: plate. Panel zemin, üstte ilişki rengi çizgisi; açık ve karışık arka planlarda en okunur biçim.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--plate is-friend"><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">SVY 38 · 24 M</div></div>
<div class="eui-tag eui-tag--plate is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="40"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="10"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">SVY 31 · 40 M</div></div>
</div>
```

## tags.flag — Bayrak
variant: flag. Solda tonlu şerit, sola yaslı degrade zemin. Takım HUD hissi.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--flag is-friend"><div class="eui-tag__line"><span class="eui-tag__name">Amiral</span><span class="eui-tag__id">1</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">24 M</div></div>
<div class="eui-tag eui-tag--flag is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Router</span><span class="eui-tag__id">7</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="50"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">40 M</div></div>
<div class="eui-tag eui-tag--flag eui-t-team3"><div class="eui-tag__line"><span class="eui-tag__name">StreamEmber</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">55 M</div></div>
</div>
```

## tags.pill — Hap
variant: pill. Tek satır kapsül: avatar, ad, kısa can çizgisi. Avatar için öğeye avatar:'AR'.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--pill is-friend"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">AR</span><span class="eui-tag__name">AmiralRouter</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--pill is-enemy"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">T</span><span class="eui-tag__name">Thi</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="40"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--pill eui-t-team2"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">NM</span><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
</div>
```

## tags.card — Kart
variant: card. Solda büyük avatar, sağda seviye + ad + bar. Yakın plan, lobi, konuşulan oyuncu.
JS: `EUI.bar(el.querySelector('.eui-bar'), hp)`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--card is-friend"><span class="eui-avatar eui-avatar--round">AR</span><div class="eui-tag__body"><div class="eui-tag__line"><span class="eui-tag__lvl">42</span><span class="eui-tag__name">AmiralRouter</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="85"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="60"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">Stream Ember · 12 M</div></div></div>
<div class="eui-tag eui-tag--card is-enemy"><span class="eui-avatar eui-avatar--round">NV</span><div class="eui-tag__body"><div class="eui-tag__line"><span class="eui-tag__lvl">17</span><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="35"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="0"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">Night Viper · 30 M</div></div></div>
</div>
```

## tags.line — İnce çizgi
variant: line. Yalnız ad ve altında 2px can çizgisi, kutu yok. Minimal, sinematik.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--line is-friend"><div class="eui-tag__line"><span class="eui-tag__name">Amiral</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--line is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Vinh</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="30"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--line eui-t-team1"><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
</div>
```

## tags.glow — Parlak çerçeve
variant: glow. İnce tonlu çerçeve ve ışıma; arena ve e-spor modları.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--glow eui-t-team1"><div class="eui-tag__line"><span class="eui-tag__name">StreamEmber</span></div></div>
<div class="eui-tag eui-tag--glow is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Router</span></div></div>
<div class="eui-tag eui-tag--glow eui-t-team3"><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div></div>
</div>
```

## tags.banner — Takım afişi
variant: banner. Eğik, ilişki renginde dolu şerit, koyu ad. Dalga ve takım modlarında en okunur biçim.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--banner is-friend"><div class="eui-tag__line"><span class="eui-tag__name">Amiral</span></div></div>
<div class="eui-tag eui-tag--banner is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div></div>
<div class="eui-tag eui-tag--banner eui-t-team1"><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div></div>
<div class="eui-tag eui-tag--banner eui-t-team4"><div class="eui-tag__line"><span class="eui-tag__name">Vinh</span></div></div>
</div>
```

## tags.bracket — Köşeli
variant: bracket. Dört köşe işaretli yarı saydam kutu; hedef çerçevesi gibi. Kilitli düşman, keşif modu.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--bracket is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="60"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">40 M</div></div>
<div class="eui-tag eui-tag--bracket is-friend"><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">24 M</div></div>
</div>
```

## tags.bar-only — Yalnız bar
variant: bar. Ad gizli, sadece can/zırh barı. Düşman kalabalıkları, NPC sürüleri.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--bar is-enemy"><div class="eui-tag__line"></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="90"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--bar is-enemy"><div class="eui-tag__line"></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="45"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="0"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--bar is-friend"><div class="eui-tag__line"></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="70"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
</div>
```

## tags.pointer — İşaretçili
variant: pointer. Altında renkli elmas; etiketin hangi kişiyi gösterdiği belli olur. Diğer biçimlerle birleşir.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--pill eui-tag--pointer is-friend"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">AR</span><span class="eui-tag__name">AmiralRouter</span></div></div>
<div class="eui-tag eui-tag--line eui-tag--pointer is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Vinh</span></div></div>
<div class="eui-tag eui-tag--banner eui-tag--pointer eui-t-team2"><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div></div>
</div>
```

## tags.squad — Takım numarası
Bölük/ekip sırası: adın önünde numara kutusu (eui-tag__num). Battle royale, taktik ekipler; numara HUD ekip listesiyle eşleşir.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--compact eui-t-team1"><div class="eui-tag__line"><span class="eui-tag__num">1</span><span class="eui-tag__name">Amiral</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team2"><div class="eui-tag__line"><span class="eui-tag__num">2</span><span class="eui-tag__name">Router</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team3"><div class="eui-tag__line"><span class="eui-tag__num">3</span><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
<div class="eui-tag eui-tag--compact eui-t-team4"><div class="eui-tag__line"><span class="eui-tag__num">4</span><span class="eui-tag__name">Thi</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="80"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="50"><i class="eui-bar__fill"></i></div></div></div>
</div>
```

## tags.roles — Rol etiketli
role: üstte küçük rol yazısı (POLİS, SAĞLIK, ŞERİF…). Meslekli RP sunucuları, polis-hırsız modları.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--plate eui-t-info"><div class="eui-tag__role">Polis</div><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__sub">Memur · 24 M</div></div>
<div class="eui-tag eui-tag--plate eui-t-success"><div class="eui-tag__role">Sağlık</div><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div><div class="eui-tag__sub">Doktor · 18 M</div></div>
<div class="eui-tag eui-tag--plate is-enemy"><div class="eui-tag__role">Haydut</div><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__sub">Aranıyor · 40 M</div></div>
</div>
```

## tags.wanted — Aranma seviyesi
Ad altında aranma yıldızları (eui-wanted, i.on dolu). Polis kovalamaca ve RP modları.
JS: `star.classList.toggle('on', i < level)`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Router</span></div><div class="eui-wanted"><i class="eui-i on" data-i="star-f"></i><i class="eui-i on" data-i="star-f"></i><i class="eui-i on" data-i="star-f"></i><i class="eui-i" data-i="star-f"></i><i class="eui-i" data-i="star-f"></i></div></div>
</div>
```

## tags.race — Yarış sırası
variant: race. Solda sıra kutusu (eui-tag__pos), yanında ad. Yarış, sürüş ve sıralı modlar.
JS: `el.querySelector('.eui-tag__pos').textContent = 'P' + pos`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--race eui-t-gold"><span class="eui-tag__pos">P1</span><div class="eui-tag__line"><span class="eui-tag__name">AmiralRouter</span></div></div>
<div class="eui-tag eui-tag--race eui-t-silver"><span class="eui-tag__pos">P2</span><div class="eui-tag__line"><span class="eui-tag__name">Vinh</span></div></div>
<div class="eui-tag eui-tag--race is-enemy"><span class="eui-tag__pos">P7</span><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div></div>
</div>
```

## tags.vip — Korunacak hedef
variant: vip. Üstte KORU şeridi, altın ad. Eskort, kral koruma ve konvoy görevleri.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--vip"><div class="eui-tag__line"><span class="eui-tag__name">StreamEmber</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="70"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">Konvoy · 60 M</div></div>
</div>
```

## tags.boss — Boss
variant: boss. Büyük başlık fontu, 200px kalın bar. Öne çıkan tek hedef.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--boss is-enemy"><div class="eui-tag__role">Boss</div><div class="eui-tag__line"><span class="eui-tag__name">Vinh Komutan</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-health" data-v="72"><i class="eui-bar__fill"></i></div><div class="eui-bar eui-t-armor" data-v="30"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">SVY 60 · 3 faz</div></div>
</div>
```

## tags.npc — NPC
variant: npc. Sade, yumuşak; konuşulabilir karakter. İkon etkileşimi söyler (icon:'chat').
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--npc eui-tag--line"><div class="eui-tag__line"><i class="eui-i" data-i="chat"></i><span class="eui-tag__name">Satıcı Thi</span></div><div class="eui-tag__sub">Konuşmak için E</div></div>
<div class="eui-tag eui-tag--npc eui-tag--line"><div class="eui-tag__line"><i class="eui-i" data-i="cash"></i><span class="eui-tag__name">Bankacı Router</span></div><div class="eui-tag__sub">Konuşmak için E</div></div>
</div>
```

## tags.viewer — Canlı yayın izleyicisi
variant: viewer. Avatar halkalı kapsül, seviye, hediye/takipçi bilgisi. TikTok/Twitch izleyicisinin oyuna girdiği modlar.
JS: `EUI.Nametags(world).update([{ id, x, y, name, avatar, level, variant: 'viewer', sub }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--viewer eui-t-accent"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">NM</span><span class="eui-tag__lvl">24</span><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__sub">🌹 ×12</div></div>
<div class="eui-tag eui-tag--viewer eui-t-legendary"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">T</span><span class="eui-tag__lvl">8</span><span class="eui-tag__name">Thi</span></div><div class="eui-tag__sub">Takipçi</div></div>
</div>
```

## tags.far — Uzaktaki
variant: far. Uzak mesafede sönük, yalnız ad + mesafe. alpha/scale zaten mesafeye göre verilir.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--far is-friend"><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div><div class="eui-tag__sub">180 M</div></div>
<div class="eui-tag eui-tag--far is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__sub">210 M</div></div>
</div>
```

## tags.group — Kalabalık özeti
Üst üste binen grubu tek etikette say: ad + eui-tag__more (+3). Pazar yeri, lobi, sıkışık savaş.
JS: `EUI.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--pill is-friend"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">NM</span><span class="eui-tag__name">NabeMedia</span><span class="eui-tag__more">+3</span></div></div>
<div class="eui-tag eui-tag--pill is-enemy"><div class="eui-tag__line"><span class="eui-avatar eui-avatar--round">V</span><span class="eui-tag__name">Vinh</span><span class="eui-tag__more">+5</span></div></div>
</div>
```

## tags.states — Durumlar
Herhangi bir biçime eklenir: is-talking (yeşil + mikrofon), is-typing (…), is-leader (taç), is-afk (sönük), is-target (altı çizili), is-dead (üstü çizili).
JS: `EUI.Nametags(world).update([{ id, x, y, name, talking, typing, leader, afk, dead }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag eui-tag--flag is-talking is-friend"><div class="eui-tag__line"><span class="eui-tag__voice"><i class="eui-i" data-i="mic"></i></span><span class="eui-tag__name">Amiral</span></div><div class="eui-tag__sub">Konuşuyor</div></div>
<div class="eui-tag eui-tag--flag is-typing is-friend"><div class="eui-tag__line"><span class="eui-tag__name">Router</span></div><div class="eui-tag__sub">Yazıyor</div></div>
<div class="eui-tag eui-tag--flag is-leader is-friend"><div class="eui-tag__line"><span class="eui-tag__name">StreamEmber</span></div><div class="eui-tag__sub">Ekip lideri</div></div>
<div class="eui-tag eui-tag--flag is-afk is-friend"><div class="eui-tag__line"><span class="eui-tag__name">Thi</span></div><div class="eui-tag__sub">Klavyeden uzak</div></div>
<div class="eui-tag eui-tag--flag is-target is-enemy"><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div><div class="eui-tag__sub">Hedef</div></div>
<div class="eui-tag eui-tag--flag is-dead eui-t-team1"><div class="eui-tag__line"><i class="eui-i" data-i="skull"></i><span class="eui-tag__name">Vinh</span></div><div class="eui-tag__sub">Öldü</div></div>
</div>
```

## tags.downed — Yere düştü
is-down: kırmızı, yanıp sönen ad; bar kalan kanama süresi, alt satır kaldırma ipucu. Ortak oynanışta canlandırma.
JS: `EUI.Nametags(world).update([{ id, x, y, name, down: true, health: bleed }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag is-down is-friend"><div class="eui-tag__line"><i class="eui-i" data-i="revive"></i><span class="eui-tag__name">AmiralRouter</span></div><div class="eui-tag__bars"><div class="eui-bar eui-t-danger" data-v="40"><i class="eui-bar__fill"></i></div></div><div class="eui-tag__sub">Kaldır: E basılı tut</div></div>
</div>
```

## tags.bubble — Konuşma balonu
bubble: etiketin üstünde kısa sohbet metni (yayıncı/izleyici mesajı); 220px'e kadar kayar.
JS: `EUI.Nametags(world).update([{ id, x, y, name, bubble: 'Merhaba' }])`

```html
<div class="eui-flex eui-gap-5 eui-items-end">
<div class="eui-tag is-friend"><div class="eui-tag__bubble">Merhaba! Yardıma geliyorum.</div><div class="eui-tag__line"><span class="eui-tag__name">NabeMedia</span></div></div>
<div class="eui-tag is-enemy"><div class="eui-tag__bubble">Köprüde buluşalım</div><div class="eui-tag__line"><span class="eui-tag__name">Nguyen</span></div></div>
</div>
```
