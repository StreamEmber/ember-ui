// Ember UI ikon seti üreticisi — Material Design Icons (Pictogrammers, Apache 2.0) + Ember UI'a özel ikonlar
const fs = require('fs'), path = require('path');
// Kullanım:  npm i @mdi/svg@7.4.47  &&  node tools/build-icons.cjs
//   (MDI klasörü farklıysa: MDI_SVG=yol/svg node tools/build-icons.cjs)
const ROOT = path.resolve(__dirname, '..');
const MDI = process.env.MDI_SVG || path.join(ROOT, 'node_modules/@mdi/svg/svg');
const CUSTOM = require('./icons/custom-icons.cjs');
const WEAPONS = require('./icons/weapons.cjs');

// [ad, kaynak]  kaynak: MDI dosya adı  |  '@' = Ember UI özel
const GROUPS = {
  'Yaşam & durum': [
    ['heart','heart'],['heart-o','heart-outline'],['heart-half','heart-half-full'],['heart-broken','heart-broken'],['heart-plus','heart-plus'],
    ['heartbeat','heart-pulse'],['revive','heart-flash'],['shield','shield'],['shield-o','shield-outline'],['shield-half','shield-half-full'],
    ['armor','shield-sword'],['bolt','lightning-bolt'],['stamina','run-fast'],['run','run'],['walk','walk'],['lungs','lungs'],
    ['droplet','water'],['blood','blood-bag'],['brain','brain'],['meat','food-steak'],['food','food-drumstick'],['apple','food-apple'],
    ['bread','bread-slice'],['bottle','bottle-soda-classic'],['water','cup-water'],['moon','weather-night'],['sleep','sleep'],
    ['thermometer','thermometer'],['cold','snowflake'],['hot','fire'],['eye','eye'],['eye-off','eye-off'],['deadeye','eye-circle'],
    ['skull','skull'],['skull-crossbones','skull-crossbones'],['dead','emoticon-dead'],['ghost','ghost'],['poison','bottle-tonic-skull'],
    ['radiation','radioactive'],['biohazard','biohazard'],['virus','virus'],['bandage','bandage'],['pill','pill'],['pills','pill-multiple'],
    ['first-aid','medical-bag'],['medkit','medical-bag'],['syringe','needle'],['iv','iv-bag'],['medication','medication'],
    ['injured','account-injury'],['hospital','hospital-box'],['mood','emoticon-happy'],['angry','emoticon-angry'],['cool','emoticon-cool']
  ],
  'Silah & dövüş': [
    ['pistol','pistol'],['revolver','@'],['rifle','@'],['carbine','@'],['smg','@'],['shotgun','@'],['sniper','@'],['repeater','@'],
    ['bullets','ammunition'],['bullet','bullet'],['magazine','magazine-rifle'],['magazine-pistol','magazine-pistol'],
    ['grenade','@'],['molotov','@'],['dynamite','@'],['bomb','bomb'],['mine','mine'],['nuke','nuke'],['flame','fire'],['fire-circle','fire-circle'],
    ['knife','knife'],['knife-military','knife-military'],['machete','@'],['axe','axe'],['battle-axe','axe-battle'],['sword','sword'],
    ['swords','sword-cross'],['bow','bow-arrow'],['crowbar','@'],['bat','baseball-bat'],['hammer','hammer'],['pickaxe','pickaxe'],
    ['fist','@'],['boxing','boxing-glove'],['karate','karate'],['fencing','fencing'],['crosshair','crosshairs'],['scope','crosshairs-gps'],
    ['target','target'],['bullseye','bullseye'],['handcuffs','handcuffs'],['flashlight','flashlight'],['binoculars','binoculars'],['lasso','lasso']
  ],
  'Karakter & rol': [
    ['user','account'],['users','account-multiple'],['group','account-group'],['user-plus','account-plus'],['user-minus','account-minus'],
    ['user-shield','shield-account'],['friend','shield-account'],['ally','handshake'],['enemy','target-account'],['hostile','account-alert'],
    ['police','police-badge'],['cop','@'],['soldier','@'],['sheriff','@'],['cowboy','account-cowboy-hat'],['outlaw','incognito'],
    ['spy','incognito'],['ninja','ninja'],['zombie','@'],['alien','alien'],['robot','robot'],['boss','account-tie'],['detective','account-tie-hat'],
    ['worker','account-hard-hat'],['medic','doctor'],['hostage','human-handsup'],['streamer','account-star'],['viewer','account-eye'],
    ['waiting','account-clock'],['search-user','account-search'],['human','human-male'],['rider','horse-human'],['horse','horse'],
    ['dog','dog'],['cat','cat'],['bird','bird'],['fish','fish'],['snake','snake'],['spider','spider'],['rabbit','rabbit'],['bat-animal','bat']
  ],
  'Eski Batı': [
    ['hat','hat-fedora'],['horseshoe','horseshoe'],['cactus','cactus'],['campfire','campfire'],['tent','tent'],['lantern','coach-lamp'],
    ['oil-lamp','oil-lamp'],['train','train'],['gold','gold'],['poker','poker-chip'],['cards','cards-playing'],['dice','dice-5'],
    ['whiskey','liquor'],['beer','glass-mug-variant'],['cigar','cigar'],['newspaper','newspaper'],['telegram','email-seal'],['letter','email'],
    ['feather','feather'],['pen','fountain-pen'],['scroll','script-text'],['map','map'],['compass','compass-rose'],['treasure','treasure-chest'],
    ['safe','safe'],['grave','grave-stone'],['coffin','coffin'],['church','church'],['cross','cross'],['barn','barn'],['castle','castle'],
    ['bugle','bugle'],['anchor','anchor'],['candle','candle'],['hook','hook']
  ],
  'Araç': [
    ['car','car-side'],['car-sport','car-sports'],['bike','motorbike'],['heli','helicopter'],['plane','airplane'],['boat','sail-boat'],
    ['ferry','ferry'],['truck','truck'],['tank','tank'],['ambulance','ambulance'],['police-car','car-emergency'],['siren','alarm-light'],
    ['gas','gas-station'],['fuel','fuel'],['engine','engine'],['steering','steering'],['gauge','speedometer'],['battery','car-battery'],
    ['seatbelt','seatbelt'],['key','key'],['lights','car-light-high'],['tire','tire'],['wrench','wrench'],['tool','wrench'],['parachute','parachute']
  ],
  'Ekonomi & ödül': [
    ['cash','cash'],['coins','cash-multiple'],['coin','currency-usd'],['bank','bank'],['wallet','wallet'],['cart','cart'],['store','store'],
    ['tag','tag'],['gift','gift'],['gift-open','gift-open'],['diamond','diamond-stone'],['crown','crown'],['trophy','trophy'],['medal','medal'],
    ['podium','podium'],['ticket','ticket'],['sale','sale'],['percent','percent'],['package','package-variant-closed'],['box','package-variant'],
    ['backpack','bag-personal'],['star','star'],['star-o','star-outline'],['star-circle','star-circle'],['xp','star-four-points'],
    ['sparkles','creation'],['confetti','party-popper'],['level-up','arrow-up-bold-circle'],['chest','treasure-chest']
  ],
  'Oyun & mod': [
    ['flag','flag'],['flag-3','flag-checkered'],['checkpoint','flag-checkered'],['pin','map-marker'],['spawn','map-marker-plus'],
    ['route','map-marker-path'],['distance','map-marker-distance'],['location','crosshairs-gps'],['radar','radar'],['world','earth'],
    ['home','home'],['door','exit-run'],['door-open','door-open'],['logout','logout'],['lock','lock'],['unlock','lock-open'],['pick','key-variant'],
    ['timer','timer'],['hourglass','timer-sand'],['clock','clock-outline'],['alarm','alarm'],['calendar','calendar'],['history','history'],
    ['wave','waves'],['zone','circle-slice-8'],['storm','weather-lightning'],['rain','weather-pouring'],['sun','weather-sunny'],
    ['cloud','weather-cloudy'],['fog','weather-fog'],['snow','weather-snowy'],['wind','weather-windy'],['sunset','weather-sunset'],
    ['streak','fire'],['win','trophy'],['loss','close-octagon'],['kill','skull-crossbones'],['death','skull'],['queue','tray-full'],
    ['stats','chart-box'],['chart','chart-bar'],['chart-line','chart-line'],['trending-up','trending-up'],['trending-down','trending-down'],
    ['gamepad','controller'],['dice-multi','dice-multiple'],['chess','chess-knight'],['puzzle','puzzle'],['lightbulb','lightbulb'],['layers','layers']
  ],
  'Yayın & sosyal': [
    ['tiktok','@'],['broadcast','broadcast'],['live','access-point'],['mic','microphone'],['mic-off','microphone-off'],['volume','volume-high'],
    ['volume-off','volume-off'],['speaker','bullhorn'],['chat','chat'],['message','message-text'],['bell','bell'],['bell-ring','bell-ring'],
    ['like','thumb-up'],['dislike','thumb-down'],['share','share-variant'],['phone','cellphone'],['wifi','wifi'],['signal','signal-cellular-3'],
    ['heart-hand','hand-heart'],['follow','account-heart'],['camera','video'],['music','music'],
    ['email','email'],['send','send'],['inbox','inbox'],['swap','swap-horizontal'],['handshake','handshake'],['crew','account-group'],['transfer','bank-transfer']
  ],
  'Arayüz': [
    ['check','check'],['x','close'],['plus','plus'],['minus','minus'],['chev-l','chevron-left'],['chev-r','chevron-right'],['chev-u','chevron-up'],
    ['chev-d','chevron-down'],['chevs-r','chevron-double-right'],['arrow-up','arrow-up'],['arrow-down','arrow-down'],['arrow-left','arrow-left'],
    ['arrow-right','arrow-right'],['menu','menu'],['grid','view-grid'],['list','format-list-bulleted'],['search','magnify'],['settings','cog'],
    ['sliders','tune'],['info','information'],['alert','alert'],['alert-circle','alert-circle'],['circle-check','check-circle'],
    ['circle-x','close-circle'],['ban','cancel'],['refresh','refresh'],['repeat','repeat'],['play','play'],['pause','pause'],['stop','stop'],
    ['keyboard','keyboard'],['mouse','mouse'],['pointer','cursor-default-click'],['hand','hand-back-right'],['grab','hand-back-left'],
    ['focus','fullscreen'],['eye-on','eye']
  ]
};
// Eski adlar (geriye uyum)
const ALIAS = { 'heart-f':'heart','shield-f':'shield','bolt-f':'bolt','droplet-f':'droplet','crown-f':'crown','flame-f':'flame','pin-f':'pin',
  'gift-f':'gift','trophy-f':'trophy','mic-f':'mic','play-f':'play','bell-f':'bell','user-f':'user','diamond-f':'diamond','coin-f':'coin',
  'location-f':'location','check-f':'circle-check','alert-f':'alert','info-f':'info','star-f':'star','flag-3':'flag-3','zzz':'sleep',
  'lungs':'lungs','engine':'engine','first-aid':'first-aid' };

const strip = s => s.replace(/<svg[^>]*>/, '').replace('</svg>', '').replace(/\s+/g, ' ').trim();
const ICONS = {}, groups = {}, miss = [];
for (const [g, list] of Object.entries(GROUPS)) {
  groups[g] = [];
  for (const [name, src] of list) {
    let body;
    if (src === '@') body = CUSTOM[name];
    else { const f = path.join(MDI, src + '.svg'); if (fs.existsSync(f)) body = strip(fs.readFileSync(f, 'utf8')); }
    if (!body) { miss.push(name + '<' + src); continue; }
    if (!ICONS[name]) groups[g].push(name);
    ICONS[name] = body;
  }
}
const aliases = {};
for (const [a, t] of Object.entries(ALIAS)) if (!ICONS[a] && ICONS[t]) aliases[a] = t;
if (miss.length) console.error('EKSİK:', miss.join(', '));
const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const out = `/*!
 * Ember UI — ikon seti (${Object.keys(ICONS).length} ikon)
 * Kaynak: Material Design Icons — Pictogrammers (Apache 2.0). Silah, yakın dövüş ve karakter ikonlarının bir kısmı
 * (revolver, rifle, shotgun, sniper, smg, repeater, machete, crowbar, fist, grenade, molotov, dynamite, cop, soldier,
 * sheriff, zombie) Ember UI'a özeldir. Tüm ikonlar dolgulu, 24×24, currentColor.
 * Kullanım:  <i data-i="axe"></i>   ·   EUI.icon('axe')   ·   <svg class="eui-i"><use href="#mi-axe"/></svg>
 */
(function (root) {
  'use strict';
  var ICONS = {
${Object.entries(ICONS).map(([k, v]) => `    '${k}': '${esc(v)}'`).join(',\n')}
  };
  var ALIASES = ${JSON.stringify(aliases)};
  for (var a in ALIASES) ICONS[a] = ICONS[ALIASES[a]];
  var GROUPS = ${JSON.stringify(groups)};
  /* Silah silüetleri (160x48, namlu sağa bakar) — büyük silah görseli için */
  var WEAPONS = ${JSON.stringify(WEAPONS)};
  function inject() {
    if (document.getElementById('eui-sprite')) return;
    var html = '<svg id="eui-sprite" xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">';
    for (var k in ICONS) html += '<symbol id="mi-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    html += '</svg>';
    (document.body || document.documentElement).insertAdjacentHTML('afterbegin', html);
  }
  root.EUI_ICONS = ICONS;
  root.MH_ICON_GROUPS = GROUPS;
  root.MH_ICON_ALIASES = ALIASES;
  root.EUI_WEAPONS = WEAPONS;
  root.MH_ICON_SPRITE = inject;
  if (document.body) inject(); else document.addEventListener('DOMContentLoaded', inject);
})(window);
`;
fs.writeFileSync(path.join(ROOT, 'kit/js/ember-ui-icons.js'), out);
console.log('ikon', Object.keys(ICONS).length, 'takma ad', Object.keys(aliases).length, (out.length / 1024).toFixed(1) + 'KB');
