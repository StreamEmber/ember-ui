/* ==========================================================================
   MHud Social — ekip, davet, kasa, cephanelik, rütbe, kanal, arkadaş,
   gelen kutusu ve takas menüsü (isteğe bağlı modül; mhud.js'ten sonra yüklenir)
   --------------------------------------------------------------------------
   Veri güdümlüdür: oyun tarafı durumu gönderir, menü çizer; oyuncunun her
   eylemi { action, data } olarak geri gider. Menü kendi başına hiçbir şeyi
   değiştirmez — sunucu yeni durumu gönderince yeniden çizilir.

   MH.Menu üstünde çalışır (kabuk, gezinme, Q/E, ESC, ipuçları ondan gelir);
   bölümlerin içeriği bu dosyadaki render işlevleridir.

     var menu = MH.Social('#host', { section: 'crew', onAction: fn });
     menu.set(state)          tüm durum
     menu.patch({ crew: … })  kısmi güncelleme (üst düzey anahtarlar)
     menu.open('channels')    bölüm aç

   Oyundan gelen mesajlar: social:state (tam) · social:patch · social:open { section, state } · social:close
   Oyuna giden:            MH.post('social', { action: 'crew:invite', data: { ids: [..] } }) · kapanınca MH.post('socialClose')

   "Kanal" = aynı oyun oturumunda ayrı dünya. Aynı kanaldaki oyuncular birbirini görür;
   başka kanaldakiler görünmez ve etkileşemez.
   ========================================================================== */
(function (root) {
  'use strict';
  var MH = root.MH; if (!MH) return;
  var I = MH.icon, E = MH.esc;
  function F(n) { return MH.fmt(n || 0); }
  function money(n) { return '$' + F(n); }
  function $$(sel, r) { return Array.prototype.slice.call(r.querySelectorAll(sel)); }

  var MODES = {
    free: ['Serbest', 'world'], deathmatch: ['Ölüm maçı', 'crosshair'], race: ['Yarış', 'flag-3'], survival: ['Hayatta kal', 'zombie'],
    heist: ['Soygun', 'safe'], event: ['Etkinlik', 'star'], private: ['Özel', 'lock'], duel: ['Düello', 'revolver']
  };
  var STATUS = { online: ['Çevrimiçi', 'success'], afk: ['AFK', 'warn'], busy: ['Görevde', 'info'], down: ['Yerde', 'danger'], dead: ['Öldü', 'danger'], offline: ['Çevrimdışı', ''] };
  var PERMS = [['invite', 'Davet', 'user-plus'], ['kick', 'Ekipten at', 'user-minus'], ['withdraw', 'Kasadan çek', 'bank'], ['armory', 'Cephanelik', 'pistol'],
    ['promote', 'Rütbe ver', 'crown'], ['channel', 'Kanal kur', 'layers'], ['announce', 'Duyuru', 'bell']];
  var KINDS = { crew: ['users', 'Ekip daveti', 'accent'], channel: ['layers', 'Kanal daveti', 'info'], friend: ['friend', 'Arkadaşlık isteği', 'success'],
    trade: ['swap', 'Takas isteği', 'gold'], duel: ['swords', 'Düello daveti', 'danger'], event: ['flag', 'Etkinlik daveti', 'legendary'] };
  var HELP = [
    { id: 'revive', label: 'Ayağa kaldır', sub: 'Yerdeyse yanına git ve kaldır', icon: 'revive', when: function (m) { return m.status === 'down'; } },
    { id: 'heal', label: 'İlk yardım ver', sub: 'Envanterden 1 ilk yardım çantası', icon: 'first-aid' },
    { id: 'armor', label: 'Zırh ver', sub: 'Envanterden 1 yelek', icon: 'shield' },
    { id: 'ammo', label: 'Cephane ver', sub: 'Kuşandığı silaha 2 şarjör', icon: 'bullets' },
    { id: 'waypoint', label: 'Konumunu işaretle', sub: 'Haritada rota çiz', icon: 'route' },
    { id: 'teleport', label: 'Yanına ışınlan', sub: 'Yalnız aynı kanalda · 60 sn bekleme', icon: 'spawn', perm: 'teleport' },
    { id: 'spectate', label: 'İzle', sub: 'Kamerayla takip et', icon: 'eye' }
  ];
  var SECTIONS = [
    { group: 'Ekip' },
    { id: 'crew', label: 'Genel bakış', icon: 'users' },
    { id: 'invites', label: 'Davetler', icon: 'email', count: function (s) { return (s.invites && s.invites.incoming || []).length; } },
    { id: 'vault', label: 'Ekip kasası', icon: 'bank', crew: true },
    { id: 'armory', label: 'Cephanelik', icon: 'safe', crew: true },
    { id: 'ranks', label: 'Rütbeler & izinler', icon: 'crown', crew: true },
    { group: 'Topluluk' },
    { id: 'channels', label: 'Kanallar', icon: 'layers', small: function (s) { var c = chan(s); return c ? c.players + '/' + c.max : ''; } },
    { id: 'friends', label: 'Arkadaşlar', icon: 'friend', small: function (s) { return (s.friends || []).filter(function (f) { return f.online; }).length || ''; } },
    { id: 'inbox', label: 'Gelen kutusu', icon: 'bell', count: function (s) { return (s.inbox || []).filter(function (m) { return m.unread; }).length; } }
  ];

  function cname(c) { return c ? (c.name || (c.system || c.id === 'main' ? 'Ana dünya' : String(c.id))) : 'Ana dünya'; }
  function chan(s) { var ch = s.channels || {}; return (ch.list || []).filter(function (c) { return c.id === ch.current; })[0]; }
  function crewTone(c) { return c && c.tone ? ' mh-t-' + c.tone : ' mh-t-accent'; }
  function rankOf(s, id) { var r = ((s.crew && s.crew.ranks) || []).filter(function (x) { return x.id === id; })[0]; return r || { id: id, label: id || 'Üye', perms: {} }; }
  function meMember(s) { return ((s.crew && s.crew.members) || []).filter(function (m) { return m.self || (s.me && m.id === s.me.id); })[0]; }
  function can(s, perm) { var m = meMember(s); if (!m) return false; var r = rankOf(s, m.rank); return !!(r.perms && (r.perms[perm] || r.perms.all)); }
  function rankIdx(s, id) { var rs = (s.crew && s.crew.ranks) || []; for (var i = 0; i < rs.length; i++) if (rs[i].id === id) return i; return 99; }
  function badge(text, tone, ic, extra) { return '<span class="mh-badge' + (tone ? ' mh-t-' + tone : '') + (extra ? ' ' + extra : '') + '">' + (ic ? I(ic) : '') + E(text) + '</span>'; }
  function statusBadge(st) { var x = STATUS[st] || STATUS.offline; return badge(x[0], x[1], null, 'mh-badge--dot'); }
  function btn(sa, label, o) {
    o = o || {};
    return '<button class="mh-btn mh-btn--sm ' + (o.cls || 'mh-btn--outline') + (o.icon && !label ? ' mh-btn--icon' : '') + '" data-sa="' + sa + '"' + (o.id != null ? ' data-id="' + E(o.id) + '"' : '') +
      (o.title ? ' title="' + E(o.title) + '"' : '') + (o.disabled ? ' disabled' : '') + '>' + (o.icon ? I(o.icon) : '') + (label ? E(label) : '') + '</button>';
  }
  function empty(ic, title, text, action) { return '<div class="mh-empty mh-social__empty">' + I(ic) + '<b>' + E(title) + '</b>' + (text ? '<span>' + E(text) + '</span>' : '') + (action || '') + '</div>'; }
  function section(title, kicker, right) { return '<div class="mh-social__head"><div><span class="mh-kicker mh-kicker--accent">' + E(kicker || '') + '</span><div class="mh-title" style="margin-top:4px">' + E(title) + '</div></div><div class="mh-flex mh-gap-2">' + (right || '') + '</div></div>'; }
  function timeLeft(sec) { sec = Math.max(0, Math.round(sec)); return sec >= 60 ? Math.floor(sec / 60) + ' dk' : sec + ' sn'; }

  MH.Social = function (target, opts) {
    opts = opts || {};
    var host = MH.$(target); if (!host) return null;
    var S = {}, ui = { section: opts.section || 'crew', member: null, invTab: 'in', chFilter: 'all', logFilter: 'all', armSel: null };
    var menu = null, el = null;

    function act(action, data) {
      data = data || {};
      MH.emit && MH.emit('social:action', { action: action, data: data });
      if (opts.onAction && opts.onAction(action, data, api) === false) return;
      MH.post('social', { action: action, data: data });
    }

    /* ---------------- Başlık ---------------- */
    function mark() {
      var c = S.crew;
      return c ? '<div class="mh-crewmark' + crewTone(c) + '"><b>' + E(c.tag || '?') + '</b><small>Svy ' + E(c.level || 1) + '</small></div>' : '<div class="mh-crewmark is-none">' + I('users') + '</div>';
    }
    function chanChip() {
      var ch = chan(S), mode = ch ? (MODES[ch.mode] || MODES.free) : MODES.free;
      return '<button class="mh-chanchip" data-mh-sec="channels"><span class="mh-chanchip__icon">' + I(mode[1]) + '</span><div><span class="mh-kicker">Kanal</span><b>' + E(ch ? ch.name : 'Ana dünya') + '</b></div>' +
        (ch ? '<small class="mh-num">' + ch.players + ' / ' + ch.max + '</small>' : '') + '</button>';
    }
    function stats() {
      var c = S.crew, me = S.me || {}, out = [{ label: 'Nakit', value: money(me.cash), tone: 'success' }];
      if (c) out.push({ label: 'Ekip kasası', value: money(c.bank) });
      return out;
    }

    /* ---------------- Ekip: genel bakış ---------------- */
    function crewNone() {
      var inv = ((S.invites && S.invites.incoming) || []).filter(function (x) { return x.kind === 'crew'; });
      return { main: '<div class="mh-social__pad mh-scroll">' + section('Bir ekibe katıl ya da kur', 'Ekip') +
        '<div class="mh-social__hero"><div class="mh-social__heroart">' + I('users') + '</div><div><b>Ekibin yok</b><span>Ekip; ortak kasa, cephanelik, rütbeler ve birlikte kanala geçme demek. Kendi ekibini kur ya da bir davet bekle.</span></div>' +
        btn('crew-create', 'Ekip kur', { cls: 'mh-btn--primary', icon: 'plus' }) + '</div>' +
        (inv.length ? '<span class="mh-kicker" style="margin-top:8px">Bekleyen ekip davetleri</span><div class="mh-invites">' + inv.map(inviteCard).join('') + '</div>' : '') + '</div>' };
    }
    function memberRow(m) {
      var r = rankOf(S, m.rank), other = m.channel && S.channels && m.channel !== S.channels.current;
      var hp = m.status === 'offline' ? '' : '<div class="mh-bar mh-bar--sm ' + (m.hp <= 25 ? 'mh-t-danger' : 'mh-t-health') + '" style="width:90px;--v:' + ((m.hp || 0) / 100) + '"><i class="mh-bar__fill" style="transform:scaleX(' + ((m.hp || 0) / 100) + ')"></i></div>';
      return '<div class="mh-member-row' + (ui.member === m.id ? ' is-active' : '') + (m.self ? ' is-self' : '') + ' is-' + (m.status || 'offline') + '" data-sa="member" data-id="' + E(m.id) + '">' +
        MH.avatar(m.name, { src: m.avatar, tone: m.status === 'offline' ? null : 'team1', cls: 'mh-avatar--round' }) +
        '<div class="mh-member-row__main"><div class="mh-flex mh-gap-2"><b>' + E(m.name) + '</b>' + badge(r.label, r.tone, r.icon) + (m.self ? badge('Sen', 'accent') : '') + '</div>' +
        '<span class="mh-sub">' + E(m.status === 'offline' ? (m.seen || 'Çevrimdışı') : (m.zone || '') + (m.dist != null && !m.self ? ' · ' + m.dist + ' m' : '')) + (other ? ' · ' + I('layers') + ' başka kanalda' : '') + '</span></div>' +
        hp + statusBadge(m.status) +
        '<div class="mh-member-row__acts">' + (!m.self && m.status !== 'offline' ? btn('help', '', { id: m.id, icon: 'heart-plus', title: 'Yardım et', cls: 'mh-btn--ghost' }) + btn('give', '', { id: m.id, icon: 'cash', title: 'Para gönder', cls: 'mh-btn--ghost' }) : '') +
        (!m.self ? btn('member-more', '', { id: m.id, icon: 'menu', title: 'Diğer', cls: 'mh-btn--ghost' }) : '') + '</div></div>';
    }
    function crewMain() {
      var c = S.crew; if (!c) return crewNone();
      var ms = (c.members || []).slice().sort(function (a, b) { return (a.status === 'offline') - (b.status === 'offline') || rankIdx(S, a.rank) - rankIdx(S, b.rank); });
      var online = ms.filter(function (m) { return m.status !== 'offline'; }).length;
      if (!ui.member || !ms.some(function (m) { return m.id === ui.member; })) ui.member = (ms.filter(function (m) { return !m.self; })[0] || ms[0] || {}).id;
      var tiles = '<div class="mh-social__tiles">' +
        tile('users', 'Üyeler', online + ' / ' + (c.members || []).length, 'çevrimiçi · en fazla ' + (c.max || '—')) +
        tile('bank', 'Kasa', money(c.bank), c.bankDelta ? (c.bankDelta > 0 ? '▲ ' : '▼ ') + money(Math.abs(c.bankDelta)) + ' bugün' : '') +
        tile('trophy', 'Ekip sırası', '#' + (c.rank || '—'), (c.kills != null ? F(c.kills) + ' leş' : '')) +
        '<div class="mh-tile mh-social__xp"><span class="mh-kicker">Ekip seviyesi ' + E(c.level || 1) + '</span><b>' + Math.round((c.xp || 0) * 100) + '%</b><div class="mh-bar mh-bar--sm"><i class="mh-bar__fill" style="transform:scaleX(' + (c.xp || 0) + ')"></i></div><small>' + E(c.nextReward || '') + '</small></div></div>';
      var main = '<div class="mh-menu__toolbar"><span class="mh-title mh-title--sm">' + E(c.name) + '</span>' + badge(c.tag, (c.tone || 'accent')) +
        (c.motto ? '<span class="mh-sub mh-social__motto">“' + E(c.motto) + '”</span>' : '<span style="margin-left:auto"></span>') + (can(S, 'invite') ? btn('crew-invite', 'Davet et', { icon: 'user-plus', cls: 'mh-btn--primary' }) : '') +
        btn('crew-channel', 'Ekiple kanala geç', { icon: 'layers' }) + btn('crew-leave', 'Ayrıl', { icon: 'logout', cls: 'mh-btn--tone mh-t-danger' }) + '</div>' +
        '<div class="mh-social__pad mh-scroll">' + tiles + (c.announcement ? '<div class="mh-social__notice">' + I('bell') + '<div><b>Ekip duyurusu</b><span>' + E(c.announcement) + '</span></div></div>' : '') +
        '<div class="mh-members">' + ms.map(memberRow).join('') + '</div></div>';
      return { main: main, aside: memberAside(ms.filter(function (m) { return m.id === ui.member; })[0]) };
    }
    function tile(ic, label, value, sub) { return '<div class="mh-tile">' + I(ic) + '<span class="mh-kicker">' + E(label) + '</span><b>' + E(value) + '</b>' + (sub ? '<small>' + E(sub) + '</small>' : '') + '</div>'; }
    function memberAside(m) {
      if (!m) return '';
      var r = rankOf(S, m.rank), off = m.status === 'offline';
      return '<div class="mh-membercard">' + MH.avatar(m.name, { src: m.avatar, tone: off ? null : 'team1', cls: 'mh-avatar--lg mh-avatar--round' }) +
        '<div><div class="mh-title mh-title--lg" lang="en">' + E(m.name) + '</div><div class="mh-flex mh-gap-2" style="margin-top:6px">' + badge(r.label, r.tone, r.icon) + statusBadge(m.status) + '</div></div></div>' +
        (!off ? '<div class="mh-statlines"><div class="mh-statline mh-t-health"><span class="mh-kicker">Can</span><div class="mh-bar"><i class="mh-bar__fill" style="transform:scaleX(' + ((m.hp || 0) / 100) + ')"></i></div><b>' + (m.hp || 0) + '</b></div>' +
          '<div class="mh-statline mh-t-armor"><span class="mh-kicker">Zırh</span><div class="mh-bar"><i class="mh-bar__fill" style="transform:scaleX(' + ((m.armor || 0) / 100) + ')"></i></div><b>' + (m.armor || 0) + '</b></div></div>' : '') +
        '<div class="mh-kv">' + kv('Konum', m.zone || '—') + kv('Kanal', chName(m.channel)) + kv('Katkı', money(m.contrib)) + kv('Leş', F(m.kills)) + kv('Katıldı', m.joined || '—') + '</div>' +
        (m.self ? '<div class="mh-col mh-gap-2" style="margin-top:auto">' + btn('crew-leave', 'Ekipten ayrıl', { icon: 'logout', cls: 'mh-btn--tone mh-t-danger mh-btn--block' }) + '</div>' :
        '<div class="mh-col mh-gap-2" style="margin-top:auto">' +
          (!off ? btn('help', 'Yardım et', { id: m.id, icon: 'heart-plus', cls: 'mh-btn--primary mh-btn--block' }) : '') +
          '<div class="mh-flex mh-gap-2">' + (!off ? btn('give', 'Para', { id: m.id, icon: 'cash', cls: 'mh-btn--outline mh-grow' }) : '') + btn('msg', 'Mesaj', { id: m.id, icon: 'chat', cls: 'mh-btn--outline mh-grow' }) + '</div>' +
          '<div class="mh-flex mh-gap-2">' + (can(S, 'promote') ? btn('promote', 'Rütbe', { id: m.id, icon: 'crown', cls: 'mh-btn--outline mh-grow' }) : '') +
          (can(S, 'kick') ? btn('kick', 'At', { id: m.id, icon: 'user-minus', cls: 'mh-btn--tone mh-t-danger mh-grow' }) : '') + '</div></div>');
    }
    function kv(k, v) { return '<div><span>' + E(k) + '</span><b>' + E(v) + '</b></div>'; }
    function chName(id) { var c = ((S.channels && S.channels.list) || []).filter(function (x) { return x.id === id; })[0]; return c ? cname(c) : (id === 'main' ? 'Ana dünya' : id || '—'); }

    /* ---------------- Davetler ---------------- */
    function inviteCard(x) {
      var k = KINDS[x.kind] || KINDS.crew, pct = x.total ? Math.max(0, Math.min(1, (x.expires || 0) / x.total)) : 1;
      return '<div class="mh-invite mh-t-' + k[2] + '"><span class="mh-invite__icon">' + I(x.icon || k[0]) + '</span>' +
        '<div class="mh-invite__main"><span class="mh-kicker">' + E(x.label || k[1]) + (x.expires != null ? ' · ' + timeLeft(x.expires) + ' kaldı' : '') + '</span>' +
        '<div class="mh-invite__text">' + MH.avatar(x.from, { cls: 'mh-avatar--sm mh-avatar--round', src: x.avatar }) + '<span><b>' + E(x.from) + '</b> ' + E(x.text || ('seni ' + (x.target || '') + ' için davet ediyor')) + '</span></div>' +
        (x.note || x.mode ? '<span class="mh-sub">' + E(x.note || ((MODES[x.mode] || MODES.free)[0] + (x.max ? ' · ' + (x.players || 0) + ' / ' + x.max + ' oyuncu' : ''))) + '</span>' : '') +
        (x.expires != null ? '<div class="mh-invite__timer"><i style="transform:scaleX(' + pct + ')"></i></div>' : '') + '</div>' +
        '<div class="mh-invite__acts">' + btn('inv-decline', 'Reddet', { id: x.id, icon: 'x', cls: 'mh-btn--ghost' }) + btn('inv-accept', 'Kabul et', { id: x.id, icon: 'check', cls: 'mh-btn--primary' }) + '</div></div>';
    }
    function invitesMain() {
      var inv = S.invites || {}, inc = inv.incoming || [], out = inv.outgoing || [];
      var tabs = '<div class="mh-seg" data-seg="invTab"><button class="' + (ui.invTab === 'in' ? 'is-active' : '') + '" data-sa="inv-tab" data-id="in">Gelen <span class="mh-count">' + inc.length + '</span></button>' +
        '<button class="' + (ui.invTab === 'out' ? 'is-active' : '') + '" data-sa="inv-tab" data-id="out">Gönderilen <small>' + out.length + '</small></button></div>';
      var body = ui.invTab === 'in'
        ? (inc.length ? '<div class="mh-invites">' + inc.map(inviteCard).join('') + '</div>' + (inc.length > 1 ? '<div class="mh-flex" style="justify-content:flex-end">' + btn('inv-decline-all', 'Hepsini reddet', { icon: 'x', cls: 'mh-btn--ghost' }) + '</div>' : '') : empty('email', 'Gelen davet yok', 'Ekip, kanal, takas ve düello davetleri burada görünür.'))
        : (out.length ? '<div class="mh-list">' + out.map(function (x) {
          var k = KINDS[x.kind] || KINDS.crew;
          return '<div class="mh-row"><span class="mh-row__icon">' + I(k[0]) + '</span><div class="mh-row__main"><span class="mh-row__title">' + E(x.to) + '</span><span class="mh-row__sub">' + E(k[1] + (x.target ? ' · ' + x.target : '') + (x.time ? ' · ' + x.time : '')) + '</span></div>' +
            '<div class="mh-row__meta">' + badge(x.status === 'seen' ? 'Görüldü' : 'Bekliyor', x.status === 'seen' ? 'info' : 'warn') + btn('inv-cancel', 'Geri al', { id: x.id, icon: 'x', cls: 'mh-btn--ghost' }) + '</div></div>';
        }).join('') + '</div>' : empty('email', 'Gönderilen davet yok', 'Ekibe ya da kanala davet ettiklerin burada bekler.'));
      var pref = S.prefs || {};
      return { main: '<div class="mh-social__pad mh-scroll">' + section('Davetler', 'Ekip · kanal · takas', tabs) + body +
        '<div class="mh-setting" style="margin-top:auto"><div class="mh-setting__text"><b>Yalnız arkadaşlarımdan davet al</b><span>Diğer oyuncuların davetleri otomatik reddedilir</span></div><div class="mh-setting__control"><label class="mh-toggle"><input type="checkbox" data-pref="friendsOnly"' + (pref.friendsOnly ? ' checked' : '') + '><span class="mh-toggle__track"></span></label></div></div>' +
        '<div class="mh-setting"><div class="mh-setting__text"><b>Davetleri ekranda göster</b><span>Oyun sırasında köşede kısa bildirim</span></div><div class="mh-setting__control"><label class="mh-toggle"><input type="checkbox" data-pref="toastInvites"' + (pref.toastInvites !== false ? ' checked' : '') + '><span class="mh-toggle__track"></span></label></div></div></div>' };
    }

    /* ---------------- Kasa ---------------- */
    var LOGT = { deposit: ['Yatırdı', 'arrow-down', 'success'], withdraw: ['Çekti', 'arrow-up', 'danger'], split: ['Dağıttı', 'users', 'info'], reward: ['Ödül', 'trophy', 'gold'], take: ['Aldı', 'pistol', 'warn'], put: ['Bıraktı', 'box', 'info'], join: ['Katıldı', 'user-plus', 'success'], leave: ['Ayrıldı', 'logout', ''] };
    function vaultMain() {
      var c = S.crew, me = S.me || {}, lim = c.withdrawLimit || 0, used = c.withdrawnToday || 0;
      var log = (c.log || []).filter(function (l) { return ui.logFilter === 'all' || (ui.logFilter === 'money' ? l.amount != null : l.amount == null); });
      var main = '<div class="mh-social__pad mh-scroll">' + section('Ekip kasası', 'Ortak para', '') +
        '<div class="mh-vault"><div class="mh-vault__balance">' + I('bank') + '<div><span class="mh-kicker">Bakiye</span><b>' + money(c.bank) + '</b>' +
        (c.bankDelta ? '<span class="mh-delta ' + (c.bankDelta > 0 ? 'is-up' : 'is-down') + '">' + (c.bankDelta > 0 ? '▲ ' : '▼ ') + money(Math.abs(c.bankDelta)) + ' bugün</span>' : '') + '</div></div>' +
        '<div class="mh-vault__acts">' + btn('deposit', 'Yatır', { icon: 'arrow-down', cls: 'mh-btn--primary' }) +
        btn('withdraw', 'Çek', { icon: 'arrow-up', disabled: !can(S, 'withdraw') }) + btn('split', 'Üyelere dağıt', { icon: 'users', disabled: !can(S, 'withdraw') }) + '</div>' +
        (lim ? '<div class="mh-vault__limit"><div class="mh-flex mh-between"><span class="mh-kicker">Günlük çekme sınırı</span><span class="mh-num">' + money(used) + ' / ' + money(lim) + '</span></div><div class="mh-bar mh-bar--sm mh-t-warn"><i class="mh-bar__fill" style="transform:scaleX(' + Math.min(1, used / lim) + ')"></i></div></div>' : '') +
        '<div class="mh-sub">Cebindeki: <b style="color:var(--mh-text)">' + money(me.cash) + '</b>' + (!can(S, 'withdraw') ? ' · Çekmek için rütben yetmiyor' : '') + '</div></div>' +
        '<div class="mh-flex mh-between" style="margin-top:6px"><span class="mh-kicker">Hareketler</span><div class="mh-seg">' +
        [['all', 'Hepsi'], ['money', 'Para'], ['items', 'Eşya & üye']].map(function (f) { return '<button class="' + (ui.logFilter === f[0] ? 'is-active' : '') + '" data-sa="log-filter" data-id="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div></div>' +
        (log.length ? '<table class="mh-table mh-social__log"><tbody>' + log.map(function (l) {
          var t = LOGT[l.type] || LOGT.deposit;
          return '<tr><td class="mh-dim mh-num" style="width:56px">' + E(l.time || '') + '</td><td><div class="mh-flex mh-gap-2">' + MH.avatar(l.who, { cls: 'mh-avatar--sm mh-avatar--round' }) + '<b>' + E(l.who) + '</b></div></td>' +
            '<td>' + badge(t[0], t[2], t[1]) + (l.item ? ' <span class="mh-sub">' + E(l.item) + '</span>' : '') + (l.note ? ' <span class="mh-sub">· ' + E(l.note) + '</span>' : '') + '</td>' +
            '<td class="r mh-num" style="color:' + (l.amount == null ? 'var(--mh-text-3)' : l.type === 'withdraw' || l.type === 'split' ? 'var(--mh-danger)' : 'var(--mh-success)') + '">' + (l.amount == null ? '—' : (l.type === 'withdraw' || l.type === 'split' ? '−' : '+') + money(l.amount)) + '</td></tr>';
        }).join('') + '</tbody></table>' : empty('history', 'Hareket yok')) + '</div>';
      return { main: main };
    }

    /* ---------------- Cephanelik ---------------- */
    function armoryMain() {
      var c = S.crew, items = c.armory || [], myRank = rankIdx(S, (meMember(S) || {}).rank), mayUse = can(S, 'armory');
      var main = '<div class="mh-menu__toolbar"><span class="mh-title mh-title--sm">Cephanelik</span><span class="mh-badge">' + items.reduce(function (a, b) { return a + (b.count || 0); }, 0) + ' parça</span>' +
        '<span style="margin-left:auto"></span>' + btn('arm-put', 'Silah bırak', { icon: 'arrow-down', cls: 'mh-btn--primary' }) + '</div>' +
        '<div class="mh-shopgrid mh-scroll mh-menu__scroll mh-armory">' + (items.length ? items.map(function (it) {
          var need = it.minRank ? rankIdx(S, it.minRank) : 99, locked = !mayUse || myRank > need, a = String(it.art || 'i:pistol');
          return '<div class="mh-item is-' + (it.tier || 'common') + (locked ? ' is-locked' : '') + (ui.armSel === it.id ? ' is-active' : '') + '" data-sa="arm-select" data-id="' + E(it.id) + '">' +
            '<div class="mh-item__art">' + (it.minRank ? badge(rankOf(S, it.minRank).label + '+', locked ? '' : 'accent', locked ? 'lock' : null) : '') + MH.art(a, a.indexOf('w:') === 0 ? '' : 'mh-armory__icon') + '<span class="mh-item__corner mh-num">×' + E(it.count || 0) + '</span></div>' +
            '<div class="mh-item__body"><span class="mh-item__name">' + E(it.name) + '</span><div class="mh-item__meta"><span>' + (locked ? I('lock') + ' Rütben yetmiyor' : E(it.sub || '')) + '</span>' +
            (locked ? '' : btn('arm-take', 'Al', { id: it.id, icon: 'arrow-up', cls: 'mh-btn--outline', disabled: !it.count })) + '</div></div></div>';
        }).join('') : empty('safe', 'Cephanelik boş', 'Silahını ekibe bırakmak için “Silah bırak”.')) + '</div>';
      return { main: main };
    }

    /* ---------------- Rütbeler ---------------- */
    function ranksMain() {
      var c = S.crew, rs = c.ranks || [], edit = can(S, 'promote');
      var count = function (id) { return (c.members || []).filter(function (m) { return m.rank === id; }).length; };
      var main = '<div class="mh-social__pad mh-scroll">' + section('Rütbeler & izinler', 'Kim ne yapabilir', edit ? btn('rank-add', 'Rütbe ekle', { icon: 'plus' }) : '') +
        '<div class="mh-permtable"><table class="mh-table"><thead><tr><th>Rütbe</th>' + PERMS.map(function (p) { return '<th class="c" title="' + E(p[1]) + '">' + I(p[2]) + '<span>' + E(p[1]) + '</span></th>'; }).join('') + '</tr></thead><tbody>' +
        rs.map(function (r, i) {
          return '<tr><td><div class="mh-flex mh-gap-2">' + badge(r.label, r.tone, r.icon) + '<span class="mh-sub">' + count(r.id) + ' üye</span></div></td>' + PERMS.map(function (p) {
            var on = r.perms && (r.perms[p[0]] || r.perms.all), lock = !edit || i === 0;
            return '<td class="c"><label class="mh-check' + (lock ? ' is-disabled' : '') + '"><input type="checkbox" data-perm="' + p[0] + '" data-rank="' + E(r.id) + '"' + (on ? ' checked' : '') + (lock ? ' disabled' : '') + '><span class="mh-check__box"></span></label></td>';
          }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="mh-sub">' + I('info') + ' Lider her zaman tüm izinlere sahiptir. ' + (edit ? 'Değişiklik anında kaydedilir.' : 'İzinleri yalnız “Rütbe ver” yetkisi olanlar değiştirebilir.') + '</div></div>';
      return { main: main };
    }

    /* ---------------- Kanallar ---------------- */
    function channelCard(c) {
      var cur = S.channels.current === c.id, mode = MODES[c.mode] || MODES.free, full = c.players >= c.max;
      return '<div class="mh-channel' + (cur ? ' is-current' : '') + (full ? ' is-full' : '') + '">' +
        '<div class="mh-channel__icon">' + I(c.icon || mode[1]) + '</div>' +
        '<div class="mh-channel__main"><div class="mh-flex mh-gap-2"><b>' + E(cname(c)) + '</b>' + (c.locked ? I('lock', 'mh-channel__lock') : '') +
        (cur ? badge('Buradasın', 'accent', null, 'mh-badge--dot') : '') + (c.crew ? badge('Ekip', 'team1') : '') + (c.system ? badge('Herkese açık', 'success') : '') + '</div>' +
        '<span class="mh-sub">' + E(mode[0]) + (c.owner ? ' · kuran ' + c.owner : '') + (c.desc ? ' · ' + c.desc : c.system ? ' · Herkese açık sunucu dünyası' : '') + '</span>' +
        (c.friends && c.friends.length ? '<span class="mh-channel__friends">' + c.friends.slice(0, 4).map(function (n) { return MH.avatar(n, { cls: 'mh-avatar--sm mh-avatar--round' }); }).join('') + '<small>' + E(c.friends.length + ' arkadaşın burada') + '</small></span>' : '') + '</div>' +
        '<div class="mh-channel__cap"><span class="mh-num"><b>' + c.players + '</b> / ' + c.max + '</span><div class="mh-bar mh-bar--sm ' + (full ? 'mh-t-danger' : c.players / c.max > .75 ? 'mh-t-warn' : 'mh-t-success') + '"><i class="mh-bar__fill" style="transform:scaleX(' + Math.min(1, c.players / c.max) + ')"></i></div></div>' +
        (cur ? (c.system ? '' : btn('ch-leave', 'Ayrıl', { icon: 'logout', cls: 'mh-btn--tone mh-t-danger' })) : btn('ch-join', full ? 'Dolu' : 'Katıl', { id: c.id, icon: c.locked ? 'lock' : 'arrow-right', cls: 'mh-btn--primary', disabled: full })) + '</div>';
    }
    function channelsMain() {
      var ch = S.channels || {}, list = ch.list || [], cur = chan(S);
      var flt = list.filter(function (c) { return ui.chFilter === 'all' || (ui.chFilter === 'open' ? !c.locked : ui.chFilter === 'crew' ? c.crew : ui.chFilter === 'friends' ? c.friends && c.friends.length : true); });
      var main = '<div class="mh-menu__toolbar"><div class="mh-seg">' + [['all', 'Hepsi'], ['open', 'Açık'], ['friends', 'Arkadaşlar'], ['crew', 'Ekip']].map(function (f) {
        return '<button class="' + (ui.chFilter === f[0] ? 'is-active' : '') + '" data-sa="ch-filter" data-id="' + f[0] + '">' + f[1] + '</button>'; }).join('') + '</div>' +
        '<span style="margin-left:auto"></span>' + btn('ch-create', 'Kanal kur', { icon: 'plus', cls: 'mh-btn--primary', disabled: S.crew && !can(S, 'channel') && !ch.anyoneCanCreate }) + '</div>' +
        '<div class="mh-social__pad mh-scroll">' +
        '<div class="mh-social__notice is-info">' + I('layers') + '<div><b>Kanal nedir?</b><span>Aynı sunucuda ayrı bir dünya. Aynı kanaldakiler birbirini görür; diğer kanallardaki oyuncular, araçlar ve olaylar görünmez. Ekibinle ya da arkadaşlarınla kendi kanalını kurabilirsin.</span></div></div>' +
        '<div class="mh-channels">' + flt.map(channelCard).join('') + '</div></div>';
      var aside = cur ? '<div class="mh-chanhead"><div class="mh-channel__icon is-lg">' + I((MODES[cur.mode] || MODES.free)[1]) + '</div><div><span class="mh-kicker mh-kicker--accent">Şu anki kanal</span><div class="mh-title mh-title--lg">' + E(cname(cur)) + '</div><span class="mh-sub">' + E((MODES[cur.mode] || MODES.free)[0]) + ' · ' + cur.players + ' / ' + cur.max + ' oyuncu</span></div></div>' +
        (cur.rules && cur.rules.length ? '<div class="mh-chanrules">' + cur.rules.map(function (r) { return '<span>' + I(r.icon || 'check') + E(r.text || r) + '</span>'; }).join('') + '</div>' : '') +
        '<span class="mh-kicker">Bu kanaldakiler</span><div class="mh-chanmembers mh-scroll">' + (cur.members || []).map(function (m) {
          var n = typeof m === 'string' ? { name: m } : m;
          return '<div class="mh-chanmember">' + MH.avatar(n.name, { cls: 'mh-avatar--sm mh-avatar--round', tone: n.crew ? 'team1' : null }) + '<span>' + E(n.name) + '</span>' + (n.host ? badge('Kurucu', 'gold', 'crown') : n.crew ? badge('Ekip', 'team1') : '') + '</div>';
        }).join('') + (cur.system ? '<span class="mh-sub">Herkese açık dünyada ' + cur.players + ' oyuncu var.</span>' : '') + '</div>' +
        '<div class="mh-col mh-gap-2" style="margin-top:auto">' + (cur.system ? '' : btn('ch-invite', 'Kanala davet et', { icon: 'user-plus', cls: 'mh-btn--primary mh-btn--block' })) +
        (cur.system ? '' : btn('ch-leave', 'Ana dünyaya dön', { icon: 'world', cls: 'mh-btn--outline mh-btn--block' })) +
        (cur.owner && S.me && cur.owner === S.me.name ? btn('ch-settings', 'Kanal ayarları', { icon: 'settings', cls: 'mh-btn--ghost mh-btn--block' }) : '') + '</div>' : '';
      return { main: main, aside: aside };
    }

    /* ---------------- Arkadaşlar ---------------- */
    function friendsMain() {
      var fr = (S.friends || []).slice().sort(function (a, b) { return (b.online ? 1 : 0) - (a.online ? 1 : 0); });
      var req = ((S.invites && S.invites.incoming) || []).filter(function (x) { return x.kind === 'friend'; });
      var main = '<div class="mh-menu__toolbar"><div class="mh-input-wrap" style="width:280px">' + I('search') + '<input class="mh-input" placeholder="Arkadaş ara…" data-filter="friends" style="padding-left:36px"></div>' +
        '<span class="mh-sub" style="margin-left:8px">' + fr.filter(function (f) { return f.online; }).length + ' çevrimiçi · ' + fr.length + ' arkadaş</span>' +
        '<span style="margin-left:auto"></span>' + btn('fr-add', 'Arkadaş ekle', { icon: 'user-plus', cls: 'mh-btn--primary' }) + '</div>' +
        '<div class="mh-social__pad mh-scroll">' + (req.length ? '<span class="mh-kicker">İstekler</span><div class="mh-invites">' + req.map(inviteCard).join('') + '</div><span class="mh-kicker" style="margin-top:6px">Arkadaşlar</span>' : '') +
        '<div class="mh-members" data-list="friends">' + fr.map(function (f) {
          var here = S.channels && f.channel === S.channels.current, st = f.online ? (f.status || 'online') : 'offline';
          return '<div class="mh-member-row is-' + st + '" data-name="' + E(String(f.name).toLowerCase()) + '">' + MH.avatar(f.name, { src: f.avatar, cls: 'mh-avatar--round', tone: f.online ? 'success' : null }) +
            '<div class="mh-member-row__main"><div class="mh-flex mh-gap-2"><b>' + E(f.name) + '</b>' + (f.crew ? badge(f.crew, '') : '') + '</div><span class="mh-sub">' +
            (f.online ? (f.activity ? E(f.activity) + ' · ' : '') + I('layers') + ' ' + E(chName(f.channel)) + (here ? ' (seninle)' : '') : E(f.seen || 'Çevrimdışı')) + '</span></div>' + statusBadge(st) +
            '<div class="mh-member-row__acts">' + (f.online && !here ? btn('fr-join', 'Kanalına git', { id: f.id, icon: 'arrow-right', cls: 'mh-btn--outline' }) : '') +
            (f.online ? btn('fr-channel', '', { id: f.id, icon: 'layers', title: 'Kanalıma davet et', cls: 'mh-btn--ghost' }) + btn('fr-crew', '', { id: f.id, icon: 'user-plus', title: 'Ekibe davet et', cls: 'mh-btn--ghost', disabled: !S.crew || !can(S, 'invite') }) +
              btn('fr-trade', '', { id: f.id, icon: 'swap', title: 'Takas iste', cls: 'mh-btn--ghost' }) : '') +
            btn('fr-more', '', { id: f.id, icon: 'menu', title: 'Diğer', cls: 'mh-btn--ghost' }) + '</div></div>';
        }).join('') + '</div></div>';
      return { main: main };
    }

    /* ---------------- Gelen kutusu ---------------- */
    var INK = { crew: ['users', 'accent'], system: ['info', 'info'], event: ['flag', 'legendary'], invite: ['email', 'success'], warn: ['alert', 'danger'], money: ['cash', 'success'] };
    function inboxMain() {
      var box = S.inbox || [];
      var main = '<div class="mh-social__pad mh-scroll">' + section('Gelen kutusu', 'Duyurular & bildirimler',
        (S.crew && can(S, 'announce') ? btn('announce', 'Ekibe duyuru', { icon: 'bell', cls: 'mh-btn--primary' }) : '') + (box.some(function (m) { return m.unread; }) ? btn('in-readall', 'Tümünü okundu say', { icon: 'check', cls: 'mh-btn--ghost' }) : '')) +
        (box.length ? '<div class="mh-inbox">' + box.map(function (m) {
          var k = INK[m.kind] || INK.system;
          return '<div class="mh-mail' + (m.unread ? ' is-unread' : '') + ' mh-t-' + k[1] + '" data-sa="in-read" data-id="' + E(m.id) + '"><span class="mh-mail__icon">' + I(m.icon || k[0]) + '</span>' +
            '<div class="mh-mail__main"><div class="mh-flex mh-between"><b>' + E(m.title) + '</b><span class="mh-sub">' + E(m.time || '') + '</span></div><span class="mh-mail__from">' + E(m.from || '') + '</span><p>' + E(m.text || '') + '</p>' +
            (m.actions ? '<div class="mh-flex mh-gap-2">' + m.actions.map(function (a) { return btn('in-action', a.label, { id: m.id + '|' + a.id, icon: a.icon, cls: a.primary ? 'mh-btn--primary' : 'mh-btn--outline' }); }).join('') + '</div>' : '') + '</div></div>';
        }).join('') + '</div>' : empty('bell', 'Gelen kutun boş')) + '</div>';
      return { main: main };
    }

    var RENDER = { crew: crewMain, invites: invitesMain, vault: vaultMain, armory: armoryMain, ranks: ranksMain, channels: channelsMain, friends: friendsMain, inbox: inboxMain };

    function render() { if (menu) menu.render(); }

    /* ---------------- Etkileşim ---------------- */
    function findMember(id) { return ((S.crew && S.crew.members) || []).filter(function (m) { return String(m.id) === String(id); })[0]; }
    function findFriend(id) { return (S.friends || []).filter(function (m) { return String(m.id) === String(id); })[0]; }
    function players(filter) {
      return (S.players || []).filter(filter || function () { return true; }).map(function (p) {
        return { id: p.id, label: p.name, sub: [p.dist != null ? p.dist + ' m' : null, p.crew ? 'Ekip: ' + p.crew : null, p.channel && S.channels && p.channel !== S.channels.current ? 'başka kanalda' : null].filter(Boolean).join(' · '),
          badge: p.friend ? 'Arkadaş' : null, badgeTone: 'success', disabled: p.disabled };
      });
    }
    function crewForm() {
      var tones = [['accent', 'Vurgu'], ['team1', 'Mavi'], ['team2', 'Kırmızı'], ['success', 'Yeşil'], ['gold', 'Altın'], ['legendary', 'Mor']];
      return '<div class="mh-form" style="--cols:3"><label class="mh-field is-wide" style="grid-column:span 2"><span class="mh-kicker">Ekip adı</span><input class="mh-input" name="name" maxlength="24" placeholder="Gece Kuşları"></label>' +
        '<label class="mh-field"><span class="mh-kicker">Kısaltma</span><input class="mh-input" name="tag" maxlength="4" placeholder="GK" style="text-transform:uppercase"></label>' +
        '<label class="mh-field is-wide"><span class="mh-kicker">Slogan</span><input class="mh-input" name="motto" maxlength="48" placeholder="Gece bizimdir"></label>' +
        '<div class="mh-field is-wide"><span class="mh-kicker">Renk</span><div class="mh-swatchpick">' + tones.map(function (t, i) {
          return '<label class="mh-optcard mh-t-' + t[0] + '"><input type="radio" name="tone" value="' + t[0] + '"' + (i === 0 ? ' checked' : '') + '><i class="mh-swatch"></i><span>' + t[1] + '</span></label>'; }).join('') + '</div></div>' +
        '<label class="mh-field is-wide"><span class="mh-kicker">Katılım</span><select class="mh-input mh-select" name="join"><option value="invite">Yalnız davetle</option><option value="request">İstek gönderilebilir</option><option value="open">Herkese açık</option></select></label></div>';
    }
    function channelForm(c) {
      c = c || {};
      var modes = ['free', 'deathmatch', 'race', 'survival', 'heist', 'private'];
      return '<div class="mh-form" style="--cols:2"><label class="mh-field is-wide"><span class="mh-kicker">Kanal adı</span><input class="mh-input" name="name" maxlength="28" value="' + E(c.name || '') + '" placeholder="Gece baskını"></label>' +
        '<div class="mh-field is-wide"><span class="mh-kicker">Mod</span><div class="mh-optcards" style="--cols:3">' + modes.map(function (m, i) {
          return '<label class="mh-optcard"><input type="radio" name="mode" value="' + m + '"' + ((c.mode || 'free') === m ? ' checked' : '') + '>' + I(MODES[m][1]) + '<b>' + MODES[m][0] + '</b></label>'; }).join('') + '</div></div>' +
        '<label class="mh-field is-wide"><span class="mh-kicker">En fazla oyuncu · <b data-maxout>' + (c.max || 8) + '</b></span><input type="range" class="mh-slider" name="max" min="2" max="32" value="' + (c.max || 8) + '" data-out="[data-maxout]"></label>' +
        '<label class="mh-field"><span class="mh-kicker">Şifre (isteğe bağlı)</span><input class="mh-input" name="password" type="password" maxlength="16" placeholder="Boş = açık kanal"></label>' +
        '<div class="mh-field"><span class="mh-kicker">Seçenekler</span><label class="mh-check"><input type="checkbox" name="crew"' + (S.crew ? ' checked' : ' disabled') + '><span class="mh-check__box"></span>Ekibimi de taşı</label>' +
        '<label class="mh-check"><input type="checkbox" name="hidden"><span class="mh-check__box"></span>Listede gizle</label></div></div>';
    }
    var H = {
      member: function (id) { ui.member = id; render(); },
      'crew-create': function () {
        MH.modal({ kicker: 'Yeni ekip', title: 'Ekip kur', icon: 'users', size: 'lg', body: crewForm(), validate: function (v) { return !String(v.name || '').trim() ? 'Ekip adı gerekli' : String(v.tag || '').trim().length < 2 ? 'Kısaltma en az 2 harf' : null; },
          actions: [{ label: 'Vazgeç', value: null }, { label: 'Kur', primary: true, submit: true, icon: 'check' }] })
          .then(function (v) { if (v) { v.tag = String(v.tag).toUpperCase(); act('crew:create', v); } });
      },
      'crew-invite': function () {
        MH.choose({ kicker: S.crew.name, title: 'Ekibe davet et', text: 'Yakındaki ve çevrimiçi oyuncular', icon: 'user-plus', multi: true, ok: 'Davet gönder', okIcon: 'send',
          items: players(function (p) { return !p.crew || p.crew !== S.crew.name; }), empty: 'Davet edilecek oyuncu yok', max: (S.crew.max || 99) - (S.crew.members || []).length })
          .then(function (ids) { if (ids) act('crew:invite', { ids: ids }); });
      },
      'crew-leave': function () {
        var me = meMember(S) || {}, leader = me.rank === ((S.crew.ranks || [])[0] || {}).id;
        MH.confirm({ title: 'Ekipten ayrıl?', text: leader ? 'Liderlik en kıdemli üyeye geçecek. Kasadaki payın ekipte kalır.' : 'Kasadaki payın ekipte kalır; tekrar katılmak için davet gerekir.', danger: true, ok: 'Ayrıl', icon: 'logout' })
          .then(function (ok) { if (ok) act('crew:leave'); });
      },
      'crew-channel': function () {
        var list = ((S.channels && S.channels.list) || []).filter(function (c) { return !c.system; });
        MH.choose({ title: 'Ekiple kanala geç', text: 'Çevrimiçi tüm üyeler seçtiğin kanala taşınır', icon: 'layers',
          items: [{ id: '__new', label: 'Yeni ekip kanalı kur', sub: 'Yalnız ekip üyeleri', icon: 'plus' }].concat(list.map(function (c) { return { id: c.id, label: c.name, sub: (MODES[c.mode] || MODES.free)[0] + ' · ' + c.players + '/' + c.max, icon: (MODES[c.mode] || MODES.free)[1], disabled: c.players >= c.max }; })) })
          .then(function (id) { if (!id) return; if (id === '__new') act('channel:create', { name: S.crew.name + ' kanalı', mode: 'private', max: S.crew.max || 8, crew: true }); else act('channel:join', { id: id, crew: true }); });
      },
      help: function (id) {
        var m = findMember(id); if (!m) return;
        MH.choose({ who: m.name, title: 'Yardım et', icon: 'heart-plus', search: false, items: HELP.filter(function (h) { return !h.when || h.when(m); }).map(function (h) {
          return { id: h.id, label: h.label, sub: h.sub, icon: h.icon, disabled: (h.id === 'teleport' && m.channel && S.channels && m.channel !== S.channels.current) }; }) })
          .then(function (kind) { if (kind) act('crew:help', { id: m.id, kind: kind }); });
      },
      give: function (id) {
        var m = findMember(id) || findFriend(id); if (!m) return;
        MH.amount({ who: m.name, title: 'Para gönder', icon: 'cash', max: Math.max(1, (S.me || {}).cash || 0), maxLabel: 'Cebindeki', quick: [100, 500, 1000, 'max'], ok: 'Gönder', okIcon: 'send' })
          .then(function (n) { if (n) act('player:give', { id: m.id, amount: n }); });
      },
      msg: function (id) {
        var m = findMember(id) || findFriend(id); if (!m) return;
        MH.modal({ who: m.name, title: 'Mesaj gönder', icon: 'chat', body: '<textarea class="mh-input mh-textarea" name="text" maxlength="200" placeholder="Mesajın…"></textarea><span class="mh-help">Enter gönderir · Shift+Enter yeni satır</span>',
          validate: function (v) { return String(v.text || '').trim() ? null : 'Boş mesaj gönderilemez'; }, actions: [{ label: 'Vazgeç', value: null }, { label: 'Gönder', primary: true, submit: true, icon: 'send' }],
          onOpen: function (mm) { var t = mm.querySelector('textarea'); t.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); mm.querySelector('[data-primary]').click(); } }); } })
          .then(function (v) { if (v) act('player:message', { id: m.id, text: v.text }); });
      },
      'member-more': function (id) {
        var m = findMember(id); if (!m) return;
        var items = [{ id: 'msg', label: 'Mesaj gönder', icon: 'chat' }, { id: 'trade', label: 'Takas iste', icon: 'swap', disabled: m.status === 'offline' }, { id: 'profile', label: 'Profili gör', icon: 'user' }];
        if (can(S, 'promote')) items.push({ id: 'promote', label: 'Rütbesini değiştir', icon: 'crown' });
        if (can(S, 'kick')) items.push({ id: 'kick', label: 'Ekipten at', icon: 'user-minus' });
        MH.choose({ who: m.name, title: 'Üye işlemleri', search: false, items: items, size: 'sm' }).then(function (k) {
          if (!k) return; if (H[k]) H[k](id); else if (k === 'trade') act('trade:request', { id: id }); else act('player:' + k, { id: id });
        });
      },
      promote: function (id) {
        var m = findMember(id); if (!m) return;
        MH.choose({ who: m.name, title: 'Rütbe ver', icon: 'crown', search: false, items: (S.crew.ranks || []).map(function (r, i) {
          return { id: r.id, label: r.label, sub: PERMS.filter(function (p) { return r.perms && (r.perms[p[0]] || r.perms.all); }).map(function (p) { return p[1]; }).join(', ') || 'Özel yetki yok', icon: r.icon || 'user', badge: r.id === m.rank ? 'Şu an' : null, badgeTone: 'accent', disabled: r.id === m.rank }; }) })
          .then(function (rank) {
            if (!rank) return;
            if (rankIdx(S, rank) === 0) MH.confirm({ who: m.name, title: 'Liderliği devret?', text: 'Ekibin yeni lideri olacak; sen bir alt rütbeye geçeceksin.', danger: true, ok: 'Devret', icon: 'crown' }).then(function (ok) { if (ok) act('crew:promote', { id: id, rank: rank }); });
            else act('crew:promote', { id: id, rank: rank });
          });
      },
      kick: function (id) {
        var m = findMember(id); if (!m) return;
        MH.modal({ kicker: S.crew.name, who: m.name, title: 'Ekipten atılsın mı?', icon: 'user-minus', danger: true, body: '<label class="mh-field"><span class="mh-kicker">Sebep (üyeye gösterilir)</span><input class="mh-input" name="reason" maxlength="80" placeholder="İsteğe bağlı"></label><label class="mh-check"><input type="checkbox" name="ban"><span class="mh-check__box"></span>Tekrar davet edilemesin</label>',
          actions: [{ label: 'Vazgeç', value: null }, { label: 'Ekipten at', primary: true, danger: true, submit: true }] })
          .then(function (v) { if (v) act('crew:kick', { id: id, reason: v.reason, ban: v.ban }); });
      },
      'inv-tab': function (id) { ui.invTab = id; render(); },
      'inv-accept': function (id) {
        var x = ((S.invites && S.invites.incoming) || []).filter(function (i) { return String(i.id) === String(id); })[0];
        if (x && x.kind === 'crew' && S.crew) return MH.confirm({ title: 'Ekip değiştirilsin mi?', text: 'Şu an ' + S.crew.name + ' ekibindesin. Kabul edersen mevcut ekipten ayrılırsın.', ok: 'Ayrıl ve katıl', icon: 'users' }).then(function (ok) { if (ok) act('invite:accept', { id: id }); });
        if (x && x.kind === 'channel' && x.password) return MH.input({ title: 'Kanal şifresi', label: x.target, type: 'password', ok: 'Katıl', required: true }).then(function (p) { if (p != null) act('invite:accept', { id: id, password: p }); });
        act('invite:accept', { id: id });
      },
      'inv-decline': function (id) { act('invite:decline', { id: id }); },
      'inv-decline-all': function () { MH.confirm({ title: 'Tüm davetler reddedilsin mi?', ok: 'Hepsini reddet', danger: true }).then(function (ok) { if (ok) act('invite:declineAll'); }); },
      'inv-cancel': function (id) { act('invite:cancel', { id: id }); },
      deposit: function () {
        MH.amount({ kicker: S.crew.name, title: 'Kasaya yatır', icon: 'arrow-down', max: Math.max(1, (S.me || {}).cash || 0), maxLabel: 'Cebindeki', quick: [1000, 5000, 'half', 'max'], ok: 'Yatır' })
          .then(function (n) { if (n) act('vault:deposit', { amount: n }); });
      },
      withdraw: function () {
        var c = S.crew, room = c.withdrawLimit ? Math.max(0, c.withdrawLimit - (c.withdrawnToday || 0)) : c.bank, max = Math.min(c.bank, room);
        if (max <= 0) return MH.toast({ tone: 'warn', icon: 'alert', title: 'Günlük çekme sınırına ulaşıldı' });
        MH.amount({ kicker: c.name, title: 'Kasadan çek', icon: 'arrow-up', max: max, maxLabel: 'Bugün çekilebilir', quick: [1000, 5000, 'max'], ok: 'Çek', text: 'Her çekim ekip kaydına geçer.' })
          .then(function (n) { if (n) act('vault:withdraw', { amount: n }); });
      },
      split: function () {
        var c = S.crew, on = (c.members || []).filter(function (m) { return m.status !== 'offline'; });
        MH.amount({ kicker: c.name, title: 'Üyelere dağıt', icon: 'users', text: on.length + ' çevrimiçi üyeye eşit bölünür', max: c.bank, step: on.length || 1, quick: [on.length * 1000, on.length * 5000], ok: 'Dağıt' })
          .then(function (n) { if (n) act('vault:split', { amount: n, ids: on.map(function (m) { return m.id; }) }); });
      },
      'log-filter': function (id) { ui.logFilter = id; render(); },
      'arm-select': function (id) { ui.armSel = id; render(); },
      'arm-take': function (id) {
        var it = (S.crew.armory || []).filter(function (x) { return String(x.id) === String(id); })[0]; if (!it) return;
        if ((it.count || 0) > 1 && it.stack) MH.amount({ title: it.name + ' al', prefix: '', suffix: 'adet', max: it.count, value: 1, ok: 'Al' }).then(function (n) { if (n) act('armory:take', { id: id, count: n }); });
        else act('armory:take', { id: id, count: 1 });
      },
      'arm-put': function () {
        MH.choose({ title: 'Cephaneliğe bırak', text: 'Envanterindeki silah ve teçhizat', icon: 'arrow-down', items: (S.inventory || []).map(function (i) { return { id: i.id, label: i.name, sub: i.sub, icon: i.icon || 'pistol', right: i.count > 1 ? '×' + i.count : '' }; }), empty: 'Bırakılacak eşya yok' })
          .then(function (iid) {
            if (!iid) return; var it = (S.inventory || []).filter(function (x) { return String(x.id) === String(iid); })[0];
            if (it && it.count > 1) MH.amount({ title: it.name, prefix: '', suffix: 'adet', max: it.count, ok: 'Bırak' }).then(function (n) { if (n) act('armory:put', { id: iid, count: n }); });
            else act('armory:put', { id: iid, count: 1 });
          });
      },
      'rank-add': function () {
        MH.input({ title: 'Yeni rütbe', label: 'Rütbe adı', placeholder: 'Ör. Keskin nişancı', max: 20, required: true, ok: 'Ekle' }).then(function (v) { if (v) act('crew:rankAdd', { label: v }); });
      },
      'ch-filter': function (id) { ui.chFilter = id; render(); },
      'ch-join': function (id) {
        var c = ((S.channels && S.channels.list) || []).filter(function (x) { return String(x.id) === String(id); })[0]; if (!c) return;
        var go = function (pw) {
          var crewHere = S.crew && (S.crew.members || []).some(function (m) { return !m.self && m.status !== 'offline' && m.channel === S.channels.current; });
          if (crewHere) MH.modal({ title: c.name + ' kanalına geç', icon: 'layers', text: 'Bulunduğun kanaldan ayrılacaksın.', body: '<label class="mh-check"><input type="checkbox" name="crew"><span class="mh-check__box"></span>Ekibimi de götür (çevrimiçi üyelere davet gider)</label>',
            actions: [{ label: 'Vazgeç', value: null }, { label: 'Geç', primary: true, submit: true, icon: 'arrow-right' }] }).then(function (v) { if (v) act('channel:join', { id: id, password: pw, crew: !!v.crew }); });
          else act('channel:join', { id: id, password: pw });
        };
        if (c.locked) MH.input({ kicker: c.name, title: 'Şifreli kanal', label: 'Şifre', type: 'password', icon: 'lock', ok: 'Katıl', required: true }).then(function (p) { if (p != null) go(p); });
        else go();
      },
      'ch-leave': function () {
        MH.confirm({ title: 'Ana dünyaya dön?', text: 'Bu kanaldan ayrılıp herkese açık dünyaya geçeceksin.', ok: 'Ayrıl', icon: 'world' }).then(function (ok) { if (ok) act('channel:leave'); });
      },
      'ch-create': function () {
        MH.modal({ kicker: 'Yeni kanal', title: 'Kanal kur', icon: 'layers', size: 'lg', body: channelForm(), text: 'Kanalda yalnız davet ettiklerin ve katılanlar olur.',
          validate: function (v) { return String(v.name || '').trim().length < 3 ? 'Kanal adı en az 3 harf' : null; },
          actions: [{ label: 'Vazgeç', value: null }, { label: 'Kur ve geç', primary: true, submit: true, icon: 'check' }] })
          .then(function (v) { if (v) { v.locked = !!v.password; act('channel:create', v); } });
      },
      'ch-settings': function () {
        var c = chan(S);
        MH.modal({ kicker: c.name, title: 'Kanal ayarları', icon: 'settings', size: 'lg', body: channelForm(c), actions: [{ label: 'Kanalı kapat', danger: true, value: '__close', left: true }, { label: 'Vazgeç', value: null }, { label: 'Kaydet', primary: true, submit: true }] })
          .then(function (v) { if (v === '__close') MH.confirm({ title: 'Kanal kapatılsın mı?', text: 'İçerideki herkes ana dünyaya dönecek.', danger: true, ok: 'Kapat' }).then(function (ok) { if (ok) act('channel:close', { id: c.id }); }); else if (v) act('channel:update', Object.assign({ id: c.id }, v)); });
      },
      'ch-invite': function () {
        var c = chan(S);
        MH.choose({ kicker: c.name, title: 'Kanala davet et', icon: 'user-plus', multi: true, ok: 'Davet gönder', okIcon: 'send', items: players(function (p) { return p.channel !== c.id; }), empty: 'Davet edilecek oyuncu yok', max: c.max - c.players })
          .then(function (ids) { if (ids) act('channel:invite', { id: c.id, ids: ids }); });
      },
      'fr-add': function () { MH.input({ title: 'Arkadaş ekle', label: 'Oyuncu adı ya da ID', placeholder: 'Ör. NabeMedia veya 1042', ok: 'İstek gönder', required: true, icon: 'user-plus' }).then(function (v) { if (v) act('friend:add', { query: v }); }); },
      'fr-join': function (id) { var f = findFriend(id); if (f) H['ch-join'](f.channel); },
      'fr-channel': function (id) { act('channel:invite', { id: S.channels && S.channels.current, ids: [id] }); },
      'fr-crew': function (id) { act('crew:invite', { ids: [id] }); },
      'fr-trade': function (id) { act('trade:request', { id: id }); },
      'fr-more': function (id) {
        var f = findFriend(id); if (!f) return;
        MH.choose({ who: f.name, title: 'Arkadaş işlemleri', search: false, size: 'sm', items: [{ id: 'msg', label: 'Mesaj gönder', icon: 'chat' }, { id: 'give', label: 'Para gönder', icon: 'cash', disabled: !f.online }, { id: 'remove', label: 'Arkadaşlıktan çıkar', icon: 'user-minus' }, { id: 'block', label: 'Engelle', icon: 'ban' }] })
          .then(function (k) {
            if (!k) return; if (k === 'msg' || k === 'give') return H[k](id);
            MH.confirm({ who: f.name, title: k === 'block' ? 'Engellensin mi?' : 'Arkadaşlıktan çıkarılsın mı?', text: k === 'block' ? 'Senden davet ve mesaj alamaz, kanalında seni göremez.' : null, danger: true, ok: k === 'block' ? 'Engelle' : 'Çıkar' })
              .then(function (ok) { if (ok) act('friend:' + k, { id: id }); });
          });
      },
      'in-read': function (id) { var m = (S.inbox || []).filter(function (x) { return String(x.id) === String(id); })[0]; if (m && m.unread) act('inbox:read', { id: id }); },
      'in-readall': function () { act('inbox:readAll'); },
      'in-action': function (id) { var p = String(id).split('|'); act('inbox:action', { id: p[0], action: p[1] }); },
      announce: function () {
        MH.modal({ kicker: S.crew.name, title: 'Ekibe duyuru', icon: 'bell', body: '<textarea class="mh-input mh-textarea" name="text" maxlength="240" placeholder="Bu akşam 21:30 konvoy baskını, herkes Paleto\'da!"></textarea><label class="mh-check"><input type="checkbox" name="pin" checked><span class="mh-check__box"></span>Genel bakışa sabitle</label><label class="mh-check"><input type="checkbox" name="toast" checked><span class="mh-check__box"></span>Çevrimiçi üyelere ekranda göster</label>',
          validate: function (v) { return String(v.text || '').trim() ? null : 'Duyuru boş olamaz'; }, actions: [{ label: 'Vazgeç', value: null }, { label: 'Yayınla', primary: true, submit: true, icon: 'send' }] })
          .then(function (v) { if (v) act('crew:announce', v); });
      }
    };
    H.profile = function (id) { act('player:profile', { id: id }); };

    /* ---------------- Kabuk: MH.Menu ---------------- */
    menu = MH.Menu(host, {
      layer: !!opts.layer, cls: 'mh-socialmenu', w: opts.w || 1280, h: opts.h || 780, post: false,
      closable: !!opts.layer,
      head: mark, headRight: chanChip, stats: stats,
      kicker: opts.kicker || 'Ekip & kanallar', title: function () { return S.crew ? S.crew.name : 'Ekipsiz'; },
      foot: function () { return opts.foot || S.server || ''; },
      section: ui.section,
      sections: SECTIONS.map(function (x) {
        if (x.group) return x;
        return { id: x.id, label: x.label, icon: x.icon, count: x.count, small: x.small,
          disabled: x.crew ? function () { return !S.crew; } : null,
          render: function () { return (RENDER[x.id] || crewMain)(); } };
      }),
      onAction: function (a) {
        if (a.action === 'section') { ui.section = a.id; act('ui:section', { section: a.id }); }
        if (a.action === 'close' && opts.onClose) opts.onClose(api);
        return false;
      },
      onRender: function (m) { ui.section = m.section; }
    });
    el = menu.el;

    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-sa]'); if (!b || b.disabled) return;
      var inner = e.target.closest('button[data-sa]');
      if (inner && inner !== b) b = inner;
      var fn = H[b.getAttribute('data-sa')]; if (fn) { e.stopPropagation(); fn(b.getAttribute('data-id')); }
    });
    el.addEventListener('change', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-perm')) act('crew:perm', { rank: t.getAttribute('data-rank'), perm: t.getAttribute('data-perm'), value: t.checked });
      if (t.hasAttribute('data-pref')) act('prefs:set', { key: t.getAttribute('data-pref'), value: t.checked });
    });
    el.addEventListener('input', function (e) {
      var t = e.target; if (!t.hasAttribute('data-filter')) return;
      var q = t.value.toLowerCase().trim();
      $$('[data-list="' + t.getAttribute('data-filter') + '"] > [data-name]', el).forEach(function (r) { r.classList.toggle('mh-hidden', q && r.getAttribute('data-name').indexOf(q) < 0); });
    });
    var api = {
      ui: ui,
      get el() { return el; },
      get menu() { return menu; },
      get state() { return S; },
      set: function (st) { S = st || {}; render(); return api; },
      patch: function (p) { Object.keys(p || {}).forEach(function (k) { S[k] = p[k]; }); render(); return api; },
      open: function (sec) { if (sec) ui.section = sec; menu.open(sec); return api; },
      close: function () { menu.close(); return api; },
      render: render,
      destroy: function () { menu.destroy(); }
    };
    render();
    return api;
  };

  /* ==========================================================================
     MH.trade — iki taraflı takas penceresi
     o: { partner: { name }, mine: { items: [{ id, name, art, count }], money, ready },
          theirs: { … }, inventory: [{ id, name, art, count }], cash, onAction(action, data) }
     Eylemler: trade:add { id, count } · trade:remove { id } · trade:money { amount } · trade:ready { ready } · trade:cancel
     Döndürür: { update(state), close() } — her iki taraf hazır olunca sunucu takası tamamlar.
     ========================================================================== */
  MH.trade = function (o) {
    o = o || {};
    var st = o, body = MH.el('div', 'mh-trade');
    function send(a, d) { if (o.onAction && o.onAction(a, d || {}) === false) return; MH.post('social', { action: a, data: d || {} }); }
    function side(s, mine, name) {
      s = s || {}; var items = s.items || [];
      var slots = items.map(function (it) {
        var a = String(it.art || 'i:box');
        return '<div class="mh-trade__item">' + MH.art(a, a.indexOf('w:') === 0 ? '' : '') + '<span>' + E(it.name) + '</span>' + (it.count > 1 ? '<b>×' + it.count + '</b>' : '') +
          (mine && !s.ready ? '<button class="mh-btn mh-btn--ghost mh-btn--sm mh-btn--icon" data-t="remove" data-id="' + E(it.id) + '">' + I('x') + '</button>' : '') + '</div>';
      });
      for (var i = items.length; i < 6; i++) slots.push(mine && !s.ready && i === items.length ? '<button class="mh-trade__item is-add" data-t="add">' + I('plus') + '<span>Eşya ekle</span></button>' : '<div class="mh-trade__item is-empty"></div>');
      return '<div class="mh-trade__side' + (s.ready ? ' is-ready' : '') + '"><div class="mh-trade__who">' + MH.avatar(name, { cls: 'mh-avatar--round' }) + '<b>' + E(name) + '</b>' +
        (s.ready ? '<span class="mh-badge mh-t-success">' + I('check') + 'Hazır</span>' : '<span class="mh-badge">Düzenliyor…</span>') + '</div>' +
        '<div class="mh-trade__grid">' + slots.join('') + '</div>' +
        '<div class="mh-trade__money">' + I('cash') + '<span class="mh-kicker">Para</span><b>$' + F(s.money || 0) + '</b>' + (mine && !s.ready ? '<button class="mh-btn mh-btn--outline mh-btn--sm" data-t="money">Değiştir</button>' : '') + '</div></div>';
    }
    function draw() {
      var both = st.mine && st.theirs && st.mine.ready && st.theirs.ready;
      body.innerHTML = '<div class="mh-trade__cols">' + side(st.mine, true, 'Sen') + '<div class="mh-trade__mid">' + I('swap') + '</div>' + side(st.theirs, false, (st.partner || {}).name || 'Oyuncu') + '</div>' +
        '<div class="mh-trade__status' + (both ? ' is-done' : '') + '">' + (both ? I('hourglass') + 'İki taraf da hazır · takas tamamlanıyor…' : st.mine && st.mine.ready ? I('hourglass') + 'Karşı tarafın onayı bekleniyor' : I('info') + 'Teklifini hazırla ve “Hazırım” de. Değişiklik olursa iki tarafın onayı sıfırlanır.') + '</div>';
      var rb = p && p.el && p.el.querySelector('[data-primary]');
      if (rb) { rb.lastChild.textContent = st.mine && st.mine.ready ? 'Hazır değilim' : 'Hazırım'; rb.classList.toggle('mh-btn--primary', !(st.mine && st.mine.ready)); rb.classList.toggle('mh-btn--outline', !!(st.mine && st.mine.ready)); }
    }
    body.addEventListener('click', function (e) {
      var b = e.target.closest('[data-t]'); if (!b) return;
      var t = b.getAttribute('data-t');
      if (t === 'remove') send('trade:remove', { id: b.getAttribute('data-id') });
      if (t === 'money') MH.amount({ title: 'Teklif edilen para', max: Math.max(1, st.cash || 0), min: 0, value: (st.mine || {}).money || 0, quick: [100, 1000, 'max'], ok: 'Ayarla' }).then(function (n) { if (n != null) send('trade:money', { amount: n }); });
      if (t === 'add') MH.choose({ title: 'Takasa eşya ekle', items: (st.inventory || []).map(function (i) { return { id: i.id, label: i.name, sub: i.sub, icon: i.icon || (String(i.art || '').indexOf('i:') === 0 ? String(i.art).slice(2) : 'box'), right: i.count > 1 ? '×' + i.count : '' }; }), empty: 'Envanter boş' })
        .then(function (id) {
          if (!id) return; var it = (st.inventory || []).filter(function (x) { return String(x.id) === String(id); })[0];
          if (it && it.count > 1) MH.amount({ title: it.name, prefix: '', suffix: 'adet', max: it.count, ok: 'Ekle' }).then(function (n) { if (n) send('trade:add', { id: id, count: n }); });
          else send('trade:add', { id: id, count: 1 });
        });
    });
    var p = MH.modal({ title: 'Takas', who: (o.partner || {}).name || 'Oyuncu', icon: 'swap', size: 'xl', body: body, dismiss: false, cls: 'mh-modal--trade',
      actions: [{ label: 'İptal et', value: 'cancel', icon: 'x' }, { label: 'Hazırım', primary: true, icon: 'check', onClick: function () { send('trade:ready', { ready: !(st.mine && st.mine.ready) }); return false; } }] });
    p.then(function (v) { if (v === 'cancel' || v === null) send('trade:cancel'); });
    draw();
    return { update: function (s) { st = Object.assign({}, st, s); draw(); }, close: function () { p.close('done'); }, el: p.el };
  };

  /* ---------------- Oyun köprüsü (MH.on) ---------------- */
  var inst = null, trade = null;
  function ensure(d) {
    if (inst) return inst;
    var o = (d && d.options) || {};
    o.layer = true;
    o.onClose = function () { MH.post('socialClose', {}); };
    inst = MH.Social(document.querySelector('.mh-screen') || document.body, o);
    return inst;
  }
  MH.on('social:open', function (d) { d = d || {}; var m = ensure(d); if (d.state) m.set(d.state); m.open(d.section); });
  MH.on('social:state', function (s) { ensure().set(s); });
  MH.on('social:patch', function (s) { ensure().patch(s); });
  MH.on('social:close', function () { if (inst) inst.close(); });
  /* Yeni davet: listeye ekle + (tercih açıksa) ekranda bildir */
  MH.on('social:invite', function (x) {
    if (!x) return; var m = ensure(), s = m.state;
    s.invites = s.invites || {}; s.invites.incoming = (s.invites.incoming || []).filter(function (i) { return String(i.id) !== String(x.id); });
    s.invites.incoming.unshift(x); m.set(s);
    if (!s.prefs || s.prefs.toastInvites !== false) { var k = KINDS[x.kind] || KINDS.crew; MH.toast({ tone: k[2], icon: k[0], title: x.from + ' · ' + k[1], text: x.text || x.target, duration: 4500 }); }
  });
  /* Sunucu hata anahtarları → Türkçe bildirim */
  var ERR = { kanal_yok: ['Kanal bulunamadı', 'Kapanmış ya da davetin süresi dolmuş olabilir'], kanal_dolu: ['Kanal dolu', 'Bir yer açılınca tekrar dene'],
    sifre_yanlis: ['Şifre yanlış', 'Kanal sahibinden şifreyi iste ya da davet bekle'], kanal_limiti: ['Kanal kurulamadı', 'Sunucudaki kanal sınırına ulaşıldı'],
    yetki_yok: ['Yetkin yok', 'Bu işlem için izin gerekiyor'] };
  MH.on('social:error', function (d) { var e = ERR[(d && d.key) || ''] || ['İşlem yapılamadı', d && d.key]; MH.toast({ tone: 'danger', icon: 'alert', title: e[0], text: e[1], duration: 3500 }); });
  MH.on('social:channelChanged', function (d) {
    var s = inst ? inst.state : {}, c = ((s.channels && s.channels.list) || []).filter(function (x) { return x.id === d.id; })[0];
    MH.toast({ tone: 'info', icon: d.id === 'main' ? 'world' : 'layers', title: d.id === 'main' ? 'Ana dünyaya döndün' : cname(c || { id: d.id }) + ' kanalına geçtin', text: d.id === 'main' ? 'Herkese açık dünyadasın' : 'Diğer kanallardaki oyuncular artık görünmüyor', duration: 3200 });
  });
  /* Süreli davetler sayfada geri sayar (sunucu ayrıca süresi dolanı siler) */
  setInterval(function () {
    if (!inst) return; var inv = inst.state.invites; if (!inv || !inv.incoming || !inv.incoming.length) return;
    var ch = false;
    inv.incoming.forEach(function (x) { if (x.expires != null && x.autoTick !== false) { x.expires--; ch = true; } });
    inv.incoming = inv.incoming.filter(function (x) { return x.expires == null || x.expires > 0; });
    if (ch && inst.ui.section === 'invites' && !MH.modalOpen() && inst.menu.isOpen()) inst.render();
  }, 1000);
  MH.on('social:trade', function (d) { if (!d || d.close) { if (trade) trade.close(); trade = null; return; } if (trade) trade.update(d); else trade = MH.trade(d); });
})(window);
