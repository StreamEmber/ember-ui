# İsim etiketleri
Oyuncu/NPC başında görünen etiketler. Hepsi aynı .mh-tag yapısı (satır, barlar, alt satır); biçim .mh-tag--<biçim>, ilişki is-friend / is-enemy / mh-t-team1..5, durum is-talking / is-down / is-dead. Çok sayıda etiket için MH.Nametags(world).update(liste); öğe alanları: name, sid, tone, health, armor, sub, badge, variant, role, avatar, level, clan, talking, typing, dead, down, afk, leader, bubble, compact.

## tags.default — Standart
Ad, oyuncu numarası, rozet, can ve zırh barı, alt satır. Her biçimin temeli; öğe alanları: name, sid, badge, health, armor, sub.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag is-friend"><div class="mh-tag__line"><span class="mh-tag__name">AmiralRouter</span><span class="mh-tag__id">12</span><span class="mh-badge mh-t-success">Dost</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">SVY 38 · 24 M</div></div>
<div class="mh-tag is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span><span class="mh-tag__id">8</span><span class="mh-badge mh-t-danger">Düşman</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="45"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="0"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">SVY 31 · 40 M</div></div>
</div>
```

## tags.relations — İlişki renkleri
Aynı etiket, renk ilişkiyi söyler: is-friend, is-enemy, nötr (sınıfsız), takım mh-t-team1..5; ayrıca mh-t-gold (VIP), mh-t-info (polis) gibi tonlar.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--compact is-friend"><div class="mh-tag__line"><span class="mh-tag__name">Amiral</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Router</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact"><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team1"><div class="mh-tag__line"><span class="mh-tag__name">Vinh</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team2"><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team3"><div class="mh-tag__line"><span class="mh-tag__name">StreamEmber</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team4"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
</div>
```

## tags.compact — Kompakt
mh-tag--compact: rozet ve alt satır gizli, ad 13px, bar 56px. Kalabalık sahneler, battle royale.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--compact is-friend"><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Vinh</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="30"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team2"><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="95"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
</div>
```

## tags.hp-number — Can sayısı
variant: hp. Bar yerine ad yanında büyük can sayısı; hızlı okunur, az yer kaplar.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--hp is-friend"><div class="mh-tag__line"><span class="mh-tag__name">Amiral</span><span class="mh-tag__hp">100</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--hp is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span><span class="mh-tag__hp">37</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
</div>
```

## tags.shield-pips — Kalkan segmentleri
Can barının altına mh-pips (data-pips=&quot;dolu/toplam&quot;): zırh plakası ya da kalkan katmanı.
JS: `MH.pips(el.querySelector('.mh-pips'), 2, 3)`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag is-friend"><div class="mh-tag__line"><span class="mh-tag__name">AmiralRouter</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="90"><i class="mh-bar__fill"></i></div></div><div class="mh-pips mh-t-armor" data-pips="2/3"></div></div>
<div class="mh-tag is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="60"><i class="mh-bar__fill"></i></div></div><div class="mh-pips mh-t-armor" data-pips="1/4"></div></div>
</div>
```

## tags.level-clan — Seviye ve klan
level: adın önünde tonlu seviye kutusu; clan: [KLAN] öneki. RPG ve sunucu klanları.
JS: `MH.Nametags(world).update([{ id, x, y, name, level: 42, clan: 'SE' }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag is-friend"><div class="mh-tag__line"><span class="mh-tag__lvl">42</span><span class="mh-tag__clan">[SE]</span><span class="mh-tag__name">Amiral</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">Stream Ember</div></div>
<div class="mh-tag is-enemy"><div class="mh-tag__line"><span class="mh-tag__lvl">17</span><span class="mh-tag__clan">[NV]</span><span class="mh-tag__name">Vinh</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="55"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">Night Viper</div></div>
</div>
```

## tags.plate — Plaka
variant: plate. Panel zemin, üstte ilişki rengi çizgisi; açık ve karışık arka planlarda en okunur biçim.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--plate is-friend"><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">SVY 38 · 24 M</div></div>
<div class="mh-tag mh-tag--plate is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="40"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="10"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">SVY 31 · 40 M</div></div>
</div>
```

## tags.flag — Bayrak
variant: flag. Solda tonlu şerit, sola yaslı degrade zemin. Takım HUD hissi.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--flag is-friend"><div class="mh-tag__line"><span class="mh-tag__name">Amiral</span><span class="mh-tag__id">1</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">24 M</div></div>
<div class="mh-tag mh-tag--flag is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Router</span><span class="mh-tag__id">7</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="50"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">40 M</div></div>
<div class="mh-tag mh-tag--flag mh-t-team3"><div class="mh-tag__line"><span class="mh-tag__name">StreamEmber</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">55 M</div></div>
</div>
```

## tags.pill — Hap
variant: pill. Tek satır kapsül: avatar, ad, kısa can çizgisi. Avatar için öğeye avatar:'AR'.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--pill is-friend"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">AR</span><span class="mh-tag__name">AmiralRouter</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--pill is-enemy"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">T</span><span class="mh-tag__name">Thi</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="40"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--pill mh-t-team2"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">NM</span><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
</div>
```

## tags.card — Kart
variant: card. Solda büyük avatar, sağda seviye + ad + bar. Yakın plan, lobi, konuşulan oyuncu.
JS: `MH.bar(el.querySelector('.mh-bar'), hp)`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--card is-friend"><span class="mh-avatar mh-avatar--round">AR</span><div class="mh-tag__body"><div class="mh-tag__line"><span class="mh-tag__lvl">42</span><span class="mh-tag__name">AmiralRouter</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="85"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="60"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">Stream Ember · 12 M</div></div></div>
<div class="mh-tag mh-tag--card is-enemy"><span class="mh-avatar mh-avatar--round">NV</span><div class="mh-tag__body"><div class="mh-tag__line"><span class="mh-tag__lvl">17</span><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="35"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="0"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">Night Viper · 30 M</div></div></div>
</div>
```

## tags.line — İnce çizgi
variant: line. Yalnız ad ve altında 2px can çizgisi, kutu yok. Minimal, sinematik.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--line is-friend"><div class="mh-tag__line"><span class="mh-tag__name">Amiral</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--line is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Vinh</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="30"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--line mh-t-team1"><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
</div>
```

## tags.glow — Parlak çerçeve
variant: glow. İnce tonlu çerçeve ve ışıma; arena ve e-spor modları.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--glow mh-t-team1"><div class="mh-tag__line"><span class="mh-tag__name">StreamEmber</span></div></div>
<div class="mh-tag mh-tag--glow is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Router</span></div></div>
<div class="mh-tag mh-tag--glow mh-t-team3"><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div></div>
</div>
```

## tags.banner — Takım afişi
variant: banner. Eğik, ilişki renginde dolu şerit, koyu ad. Dalga ve takım modlarında en okunur biçim.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--banner is-friend"><div class="mh-tag__line"><span class="mh-tag__name">Amiral</span></div></div>
<div class="mh-tag mh-tag--banner is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div></div>
<div class="mh-tag mh-tag--banner mh-t-team1"><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div></div>
<div class="mh-tag mh-tag--banner mh-t-team4"><div class="mh-tag__line"><span class="mh-tag__name">Vinh</span></div></div>
</div>
```

## tags.bracket — Köşeli
variant: bracket. Dört köşe işaretli yarı saydam kutu; hedef çerçevesi gibi. Kilitli düşman, keşif modu.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--bracket is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="60"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">40 M</div></div>
<div class="mh-tag mh-tag--bracket is-friend"><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">24 M</div></div>
</div>
```

## tags.bar-only — Yalnız bar
variant: bar. Ad gizli, sadece can/zırh barı. Düşman kalabalıkları, NPC sürüleri.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--bar is-enemy"><div class="mh-tag__line"></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="90"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--bar is-enemy"><div class="mh-tag__line"></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="45"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="0"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--bar is-friend"><div class="mh-tag__line"></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="70"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
</div>
```

## tags.pointer — İşaretçili
variant: pointer. Altında renkli elmas; etiketin hangi kişiyi gösterdiği belli olur. Diğer biçimlerle birleşir.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--pill mh-tag--pointer is-friend"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">AR</span><span class="mh-tag__name">AmiralRouter</span></div></div>
<div class="mh-tag mh-tag--line mh-tag--pointer is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Vinh</span></div></div>
<div class="mh-tag mh-tag--banner mh-tag--pointer mh-t-team2"><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div></div>
</div>
```

## tags.squad — Takım numarası
Bölük/ekip sırası: adın önünde numara kutusu (mh-tag__num). Battle royale, taktik ekipler; numara HUD ekip listesiyle eşleşir.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--compact mh-t-team1"><div class="mh-tag__line"><span class="mh-tag__num">1</span><span class="mh-tag__name">Amiral</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team2"><div class="mh-tag__line"><span class="mh-tag__num">2</span><span class="mh-tag__name">Router</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team3"><div class="mh-tag__line"><span class="mh-tag__num">3</span><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
<div class="mh-tag mh-tag--compact mh-t-team4"><div class="mh-tag__line"><span class="mh-tag__num">4</span><span class="mh-tag__name">Thi</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="80"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="50"><i class="mh-bar__fill"></i></div></div></div>
</div>
```

## tags.roles — Rol etiketli
role: üstte küçük rol yazısı (POLİS, SAĞLIK, ŞERİF…). Meslekli RP sunucuları, polis-hırsız modları.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--plate mh-t-info"><div class="mh-tag__role">Polis</div><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__sub">Memur · 24 M</div></div>
<div class="mh-tag mh-tag--plate mh-t-success"><div class="mh-tag__role">Sağlık</div><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div><div class="mh-tag__sub">Doktor · 18 M</div></div>
<div class="mh-tag mh-tag--plate is-enemy"><div class="mh-tag__role">Haydut</div><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__sub">Aranıyor · 40 M</div></div>
</div>
```

## tags.wanted — Aranma seviyesi
Ad altında aranma yıldızları (mh-wanted, i.on dolu). Polis kovalamaca ve RP modları.
JS: `star.classList.toggle('on', i < level)`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Router</span></div><div class="mh-wanted"><i class="mh-i on" data-i="star-f"></i><i class="mh-i on" data-i="star-f"></i><i class="mh-i on" data-i="star-f"></i><i class="mh-i" data-i="star-f"></i><i class="mh-i" data-i="star-f"></i></div></div>
</div>
```

## tags.race — Yarış sırası
variant: race. Solda sıra kutusu (mh-tag__pos), yanında ad. Yarış, sürüş ve sıralı modlar.
JS: `el.querySelector('.mh-tag__pos').textContent = 'P' + pos`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--race mh-t-gold"><span class="mh-tag__pos">P1</span><div class="mh-tag__line"><span class="mh-tag__name">AmiralRouter</span></div></div>
<div class="mh-tag mh-tag--race mh-t-silver"><span class="mh-tag__pos">P2</span><div class="mh-tag__line"><span class="mh-tag__name">Vinh</span></div></div>
<div class="mh-tag mh-tag--race is-enemy"><span class="mh-tag__pos">P7</span><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div></div>
</div>
```

## tags.vip — Korunacak hedef
variant: vip. Üstte KORU şeridi, altın ad. Eskort, kral koruma ve konvoy görevleri.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--vip"><div class="mh-tag__line"><span class="mh-tag__name">StreamEmber</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="70"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">Konvoy · 60 M</div></div>
</div>
```

## tags.boss — Boss
variant: boss. Büyük başlık fontu, 200px kalın bar. Öne çıkan tek hedef.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--boss is-enemy"><div class="mh-tag__role">Boss</div><div class="mh-tag__line"><span class="mh-tag__name">Vinh Komutan</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-health" data-v="72"><i class="mh-bar__fill"></i></div><div class="mh-bar mh-t-armor" data-v="30"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">SVY 60 · 3 faz</div></div>
</div>
```

## tags.npc — NPC
variant: npc. Sade, yumuşak; konuşulabilir karakter. İkon etkileşimi söyler (icon:'chat').
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--npc mh-tag--line"><div class="mh-tag__line"><i class="mh-i" data-i="chat"></i><span class="mh-tag__name">Satıcı Thi</span></div><div class="mh-tag__sub">Konuşmak için E</div></div>
<div class="mh-tag mh-tag--npc mh-tag--line"><div class="mh-tag__line"><i class="mh-i" data-i="cash"></i><span class="mh-tag__name">Bankacı Router</span></div><div class="mh-tag__sub">Konuşmak için E</div></div>
</div>
```

## tags.viewer — Canlı yayın izleyicisi
variant: viewer. Avatar halkalı kapsül, seviye, hediye/takipçi bilgisi. TikTok/Twitch izleyicisinin oyuna girdiği modlar.
JS: `MH.Nametags(world).update([{ id, x, y, name, avatar, level, variant: 'viewer', sub }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--viewer mh-t-accent"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">NM</span><span class="mh-tag__lvl">24</span><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__sub">🌹 ×12</div></div>
<div class="mh-tag mh-tag--viewer mh-t-legendary"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">T</span><span class="mh-tag__lvl">8</span><span class="mh-tag__name">Thi</span></div><div class="mh-tag__sub">Takipçi</div></div>
</div>
```

## tags.far — Uzaktaki
variant: far. Uzak mesafede sönük, yalnız ad + mesafe. alpha/scale zaten mesafeye göre verilir.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--far is-friend"><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div><div class="mh-tag__sub">180 M</div></div>
<div class="mh-tag mh-tag--far is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__sub">210 M</div></div>
</div>
```

## tags.group — Kalabalık özeti
Üst üste binen grubu tek etikette say: ad + mh-tag__more (+3). Pazar yeri, lobi, sıkışık savaş.
JS: `MH.Nametags(world).update([{ id, x, y, name, tone, health, armor, variant }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--pill is-friend"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">NM</span><span class="mh-tag__name">NabeMedia</span><span class="mh-tag__more">+3</span></div></div>
<div class="mh-tag mh-tag--pill is-enemy"><div class="mh-tag__line"><span class="mh-avatar mh-avatar--round">V</span><span class="mh-tag__name">Vinh</span><span class="mh-tag__more">+5</span></div></div>
</div>
```

## tags.states — Durumlar
Herhangi bir biçime eklenir: is-talking (yeşil + mikrofon), is-typing (…), is-leader (taç), is-afk (sönük), is-target (altı çizili), is-dead (üstü çizili).
JS: `MH.Nametags(world).update([{ id, x, y, name, talking, typing, leader, afk, dead }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag mh-tag--flag is-talking is-friend"><div class="mh-tag__line"><span class="mh-tag__voice"><i class="mh-i" data-i="mic"></i></span><span class="mh-tag__name">Amiral</span></div><div class="mh-tag__sub">Konuşuyor</div></div>
<div class="mh-tag mh-tag--flag is-typing is-friend"><div class="mh-tag__line"><span class="mh-tag__name">Router</span></div><div class="mh-tag__sub">Yazıyor</div></div>
<div class="mh-tag mh-tag--flag is-leader is-friend"><div class="mh-tag__line"><span class="mh-tag__name">StreamEmber</span></div><div class="mh-tag__sub">Ekip lideri</div></div>
<div class="mh-tag mh-tag--flag is-afk is-friend"><div class="mh-tag__line"><span class="mh-tag__name">Thi</span></div><div class="mh-tag__sub">Klavyeden uzak</div></div>
<div class="mh-tag mh-tag--flag is-target is-enemy"><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div><div class="mh-tag__sub">Hedef</div></div>
<div class="mh-tag mh-tag--flag is-dead mh-t-team1"><div class="mh-tag__line"><i class="mh-i" data-i="skull"></i><span class="mh-tag__name">Vinh</span></div><div class="mh-tag__sub">Öldü</div></div>
</div>
```

## tags.downed — Yere düştü
is-down: kırmızı, yanıp sönen ad; bar kalan kanama süresi, alt satır kaldırma ipucu. Ortak oynanışta canlandırma.
JS: `MH.Nametags(world).update([{ id, x, y, name, down: true, health: bleed }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag is-down is-friend"><div class="mh-tag__line"><i class="mh-i" data-i="revive"></i><span class="mh-tag__name">AmiralRouter</span></div><div class="mh-tag__bars"><div class="mh-bar mh-t-danger" data-v="40"><i class="mh-bar__fill"></i></div></div><div class="mh-tag__sub">Kaldır: E basılı tut</div></div>
</div>
```

## tags.bubble — Konuşma balonu
bubble: etiketin üstünde kısa sohbet metni (yayıncı/izleyici mesajı); 220px'e kadar kayar.
JS: `MH.Nametags(world).update([{ id, x, y, name, bubble: 'Merhaba' }])`

```html
<div class="mh-flex mh-gap-5 mh-items-end">
<div class="mh-tag is-friend"><div class="mh-tag__bubble">Merhaba! Yardıma geliyorum.</div><div class="mh-tag__line"><span class="mh-tag__name">NabeMedia</span></div></div>
<div class="mh-tag is-enemy"><div class="mh-tag__bubble">Köprüde buluşalım</div><div class="mh-tag__line"><span class="mh-tag__name">Nguyen</span></div></div>
</div>
```
