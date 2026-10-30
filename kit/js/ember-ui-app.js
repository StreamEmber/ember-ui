/* ==========================================================================
   Ember UI App — oyunun kendi ekranları: lobi, açılış, yükleme, durum ekranları
   --------------------------------------------------------------------------
   Hepsi veriyle kurulur ve aynı çağrı yatayda ve dikeyde çalışır (.eui-app
   kapsayıcı sorgusu yerleşimi değiştirir). HTML'i elle yazma.

     var lobby = EUI.Lobby('#screen', { player, currencies, hero, nav, play, … , onAction });
     lobby.update({ currencies: [...] });                         // kısmi güncelleme
     EUI.title('#screen', { name: 'Snowball' }).then(…)           // dokununca devam
     var ld = EUI.loading('#screen', { title, tips }); ld.progress(.4, 'Haritalar'); ld.close();
     EUI.state('network-error').then(function (r) { … })          // 'retry' | 'offline' | …

   Eylemler { action, id, value } → onAction; false dönmezse EUI.post(spec.post || 'lobby', …).
   Ayrıntı: ai/app.md.
   ========================================================================== */
(function (root) {
  'use strict';
  var EUI = root.EUI; if (!EUI) return;
  var I = EUI.icon, E = EUI.esc;

  function log() { if (EUI.debug) console.log.apply(console, ['[Ember UI app]'].concat([].slice.call(arguments))); }
  function host(target) { return EUI.$(target) || document.querySelector('.eui-screen') || document.body; }
  function app(target, cls) {
    var el = EUI.el('div', 'eui-app eui-catch' + (cls ? ' ' + cls : ''));
    host(target).appendChild(el);
    return el;
  }
  function bg(b) { return '<div class="eui-app__bg">' + (b && b.img ? '<img src="' + E(b.img) + '" alt="">' : '') + '</div>'; }
  function dot(n) { return n == null || n === false || n === 0 ? '' : '<span class="eui-dot">' + (n === true ? '' : E(n > 99 ? '99+' : n)) + '</span>'; }
  function art(a) { a = a || {}; return a.img ? '<img src="' + E(a.img) + '" alt="">' : a.weapon ? EUI.weapon(a.weapon) : I(a.icon || 'user'); }
  function num(v) { return typeof v === 'number' ? EUI.fmt(v) : E(v == null ? '' : v); }

  /* ======================================================================
     Lobi
     spec: {
       player:     { name, level, xp (0..1), avatar (resim), tone },
       currencies: [{ id, icon, tone, value, max, add }],          // add: + düğmesi
       buttons:    [{ id, icon, badge }],                           // sağ üst simge düğmeleri (ayarlar, posta…)
       promos:     [{ id, icon, tone, title, sub, progress (0..1), progressText, time, badge }],
       hero:       { art: { icon | img | weapon }, name, level, progress (0..1), progressText, trophies },
       shortcuts:  [{ id, icon, label, tone, badge }],
       nav:        [{ id, icon, label, badge, locked, active }],
       play:       { label, sub, icon, busy },  mode: { label, sub, icon },
       bg:         { img },  post: 'lobby',  onAction(a, lobby)
     }
     Eylemler: profile · currency (id) · button (id) · promo (id) · shortcut (id) · nav (id) · play · mode
     ====================================================================== */
  EUI.Lobby = function (target, spec) {
    if (target && typeof target === 'object' && !target.nodeType && !spec) { spec = target; target = null; }
    spec = spec || {};
    var el = app(target, 'eui-app--lobby');
    var S = spec;

    function render() {
      var p = S.player || {}, h = S.hero, play = S.play || { label: 'Oyna' };
      el.innerHTML = bg(S.bg) + '<div class="eui-lobby">' +
        '<div class="eui-lobby__top eui-topbar">' +
          '<div class="eui-profile" data-lobby="profile">' + EUI.avatar(p.name || '?', { src: p.avatar, tone: p.tone || 'accent' }) +
            (p.level != null ? '<span class="eui-profile__lvl">' + E(p.level) + '</span>' : '') +
            '<div class="eui-profile__main"><span class="eui-profile__name">' + E(p.name || '') + '</span>' +
            (p.xp != null ? '<div class="eui-bar eui-t-xp" data-v="' + Math.round((+p.xp || 0) * 100) + '"><i class="eui-bar__fill"></i></div>' : '') + '</div></div>' +
          '<div class="eui-topbar__cur">' +
            (S.currencies || []).map(function (c) {
              return '<div class="eui-currency' + (c.tone ? ' eui-t-' + E(c.tone) : '') + '" data-lobby="currency" data-id="' + E(c.id) + '">' + I(c.icon || 'coin') +
                '<b>' + num(c.value) + '</b>' + (c.max != null ? '<small>/ ' + num(c.max) + '</small>' : '') +
                (c.add ? '<button class="eui-currency__add" aria-label="Ekle">' + I('plus') + '</button>' : '') + '</div>';
            }).join('') + '</div>' +
          '<div class="eui-topbar__btns">' + (S.buttons || []).map(function (b) { return '<button class="eui-iconbtn" data-lobby="button" data-id="' + E(b.id) + '" aria-label="' + E(b.label || b.id) + '">' + I(b.icon) + dot(b.badge) + '</button>'; }).join('') + '</div>' +
          '</div>' +
        '<div class="eui-lobby__side">' + (S.promos || []).map(function (m) {
          return '<div class="eui-promo' + (m.tone ? ' eui-t-' + E(m.tone) : '') + '" data-lobby="promo" data-id="' + E(m.id) + '">' + dot(m.badge) +
            '<div class="eui-promo__head"><span class="eui-promo__icon">' + I(m.icon || 'star') + '</span><div class="eui-promo__text"><div class="eui-promo__title">' + E(m.title) + '</div>' + (m.sub ? '<div class="eui-promo__sub">' + E(m.sub) + '</div>' : '') + '</div></div>' +
            (m.progress != null || m.time ? '<div class="eui-promo__foot">' + (m.progress != null ? '<div class="eui-bar" data-v="' + Math.round((+m.progress || 0) * 100) + '"><i class="eui-bar__fill"></i></div>' : '') +
              (m.progressText ? '<span>' + E(m.progressText) + '</span>' : '') + (m.time ? '<span class="eui-promo__time">' + I('clock') + E(m.time) + '</span>' : '') + '</div>' : '') + '</div>';
        }).join('') + '</div>' +
        '<div class="eui-lobby__hero">' + (h ? '<div class="eui-hero"><div class="eui-hero__art">' + art(h.art) + '</div>' +
          (h.name ? '<div class="eui-hero__name">' + E(h.name) + '</div>' : '') +
          (h.level != null || h.progress != null || h.trophies != null ? '<div class="eui-hero__info">' + (h.level != null ? '<span class="eui-hero__lvl">' + E(h.level) + '</span>' : '') +
            (h.progress != null ? '<div class="eui-bar" data-v="' + Math.round((+h.progress || 0) * 100) + '"><i class="eui-bar__fill"></i></div>' : '') + (h.progressText ? '<b>' + E(h.progressText) + '</b>' : '') +
            (h.trophies != null ? '<span class="eui-hero__trophy">' + I('trophy') + '<b>' + num(h.trophies) + '</b></span>' : '') + '</div>' : '') + '</div>' : '') + '</div>' +
        '<div class="eui-lobby__short"><div class="eui-shortcuts">' + (S.shortcuts || []).map(function (s) {
          return '<button class="eui-shortcut' + (s.tone ? ' eui-t-' + E(s.tone) : '') + '" data-lobby="shortcut" data-id="' + E(s.id) + '">' + I(s.icon) + '<span>' + E(s.label) + '</span>' + dot(s.badge) + '</button>';
        }).join('') + '</div></div>' +
        '<nav class="eui-lobby__nav eui-navbar">' + (S.nav || []).map(function (n) {
          return '<button class="eui-navbar__item' + (n.active ? ' is-active' : '') + (n.locked ? ' is-locked' : '') + '" data-lobby="nav" data-id="' + E(n.id) + '">' + I(n.icon) + '<span>' + E(n.label) + '</span>' + (n.locked ? I('lock', 'eui-navbar__lock') : '') + dot(n.badge) + '</button>';
        }).join('') + '</nav>' +
        '<div class="eui-lobby__cta">' +
          (S.mode ? '<button class="eui-cta eui-cta--alt" data-lobby="mode">' + I(S.mode.icon || 'map') + '<span class="eui-cta__main"><b>' + E(S.mode.label) + '</b>' + (S.mode.sub ? '<small>' + E(S.mode.sub) + '</small>' : '') + '</span></button>' : '') +
          '<button class="eui-cta' + (play.busy ? ' is-busy' : '') + '" data-lobby="play">' + I(play.busy ? 'refresh' : (play.icon || 'play')) + '<span class="eui-cta__main"><b>' + E(play.label || 'Oyna') + '</b>' + (play.sub ? '<small>' + E(play.sub) + '</small>' : '') + '</span></button>' +
        '</div></div>';
      EUI.mount(el);
    }

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lobby]'); if (!t || !el.contains(t)) return;
      var kind = t.getAttribute('data-lobby'), id = t.getAttribute('data-id');
      if (kind === 'currency' && !e.target.closest('.eui-currency__add')) return;   // yalnız + düğmesi eylem
      if (kind === 'nav') {
        var n = (S.nav || []).filter(function (x) { return String(x.id) === id; })[0];
        if (n && n.locked) { EUI.toast({ tone: 'warn', icon: 'lock', title: n.lockedText || 'Henüz kilitli', duration: 1800 }); return; }
      }
      var a = { action: kind, id: id };
      log(a);
      EUI.emit('lobby:action', a);
      if (spec.onAction && spec.onAction(a, api) === false) return;
      if (spec.post !== false) EUI.post(spec.post || 'lobby', a);
    });

    var api = {
      el: el,
      get state() { return S; },
      update: function (patch) { Object.keys(patch || {}).forEach(function (k) { S[k] = patch[k]; }); render(); return api; },
      set: function (s) { S = s || {}; render(); return api; },
      show: function () { el.classList.remove('eui-hidden'); return api; },
      hide: function () { el.classList.add('eui-hidden'); return api; },
      destroy: function () { el.remove(); }
    };
    render();
    return api;
  };

  /* ======================================================================
     Başlık ekranı: dokun / tuşa bas → Promise çözülür, ekran kalkar
     o: { name, sub, logo (resim), tap ('Başlamak için dokun'), version, server, bg: { img }, keep }
     ====================================================================== */
  EUI.title = function (target, o) {
    if (target && typeof target === 'object' && !target.nodeType && !o) { o = target; target = null; }
    o = o || {};
    var el = app(target, 'eui-app--title');
    el.innerHTML = bg(o.bg) + '<div class="eui-titlescreen">' + (o.logo ? '<img class="eui-titlescreen__logo" src="' + E(o.logo) + '" alt="">' : '<div class="eui-titlescreen__name">' + E(o.name || '') + (o.sub ? '<small>' + E(o.sub) + '</small>' : '') + '</div>') +
      '<div class="eui-titlescreen__tap">' + E(o.tap || 'Başlamak için dokun') + '</div>' +
      '<div class="eui-titlescreen__foot"><span>' + E(o.version ? 'v' + o.version : '') + '</span><span>' + E(o.server || '') + '</span></div></div>';
    return new Promise(function (resolve) {
      function go(e) {
        if (e && e.type === 'keydown' && /Shift|Control|Alt|Meta|Tab/.test(e.key)) return;
        document.removeEventListener('keydown', go); el.removeEventListener('pointerup', go);
        if (!o.keep) el.remove();
        log('title: devam'); resolve(true);
      }
      el.addEventListener('pointerup', go); document.addEventListener('keydown', go);
    });
  };

  /* ======================================================================
     Yükleme ekranı
     o: { kicker, title, badges: ['32 / 64 oyuncu'], tips: [...], tipEvery (ms, 5000), bg: { img } }
     Dönüş: { progress(0..1, metin), tip(metin), close(), el }
     ====================================================================== */
  EUI.loading = function (target, o) {
    if (target && typeof target === 'object' && !target.nodeType && !o) { o = target; target = null; }
    o = o || {};
    var el = app(target, 'eui-app--loading');
    el.innerHTML = '<div class="eui-loading"><div class="eui-loading__art"' + (o.bg && o.bg.img ? ' style="background-image:url(\'' + E(o.bg.img) + '\')"' : '') + '></div>' +
      '<div class="eui-loading__main">' + (o.kicker ? '<span class="eui-kicker eui-kicker--accent">' + E(o.kicker) + '</span>' : '') + '<div class="eui-title">' + E(o.title || '') + '</div>' +
      (o.badges && o.badges.length ? '<div class="eui-flex eui-gap-2">' + o.badges.map(function (b) { return '<span class="eui-badge eui-badge--pill">' + E(b) + '</span>'; }).join('') + '</div>' : '') + '</div>' +
      '<div class="eui-loading__foot"><div class="eui-loading__tip"><span class="eui-kicker">İpucu</span><p></p></div>' +
      '<div class="eui-loading__progress"><div class="eui-loading__status"><span></span><b>0%</b></div><div class="eui-bar eui-bar--stripe eui-t-accent" data-v="0"><i class="eui-bar__fill"></i></div></div></div></div>';
    EUI.mount(el);
    var tipEl = el.querySelector('.eui-loading__tip'), tips = o.tips || [], ti = 0, timer = 0;
    function tip(t) { tipEl.classList.toggle('eui-hidden', !t); tipEl.querySelector('p').textContent = t || ''; }
    tip(tips[0]);
    if (tips.length > 1) timer = setInterval(function () { ti = (ti + 1) % tips.length; tip(tips[ti]); }, o.tipEvery || 5000);
    var api = {
      el: el,
      progress: function (v, text) {
        v = Math.max(0, Math.min(1, +v || 0));
        EUI.bar(el.querySelector('.eui-bar'), v * 100);
        el.querySelector('.eui-loading__status b').textContent = Math.round(v * 100) + '%';
        if (text != null) el.querySelector('.eui-loading__status span').textContent = text;
        log('loading', Math.round(v * 100) + '%', text || '');
        return api;
      },
      tip: function (t) { tip(t); return api; },
      close: function () { clearInterval(timer); el.remove(); }
    };
    return api;
  };

  /* ======================================================================
     Durum ekranları: bağlantı, hata, bakım, güncelleme…
     EUI.state(tür, o) → Promise(eylem id). Tür hazır metin ve düğmeleri getirir; o ile ezilir.
     o: { title, text, code, icon, tone, actions: [{ id, label, primary, icon }], target, bg }
     'checking' ve 'reconnecting' düğmesizdir: dönen Promise'in .close() ile kapat.
     ====================================================================== */
  var STATES = {
    'network-error': { icon: 'wifi', tone: 'danger', title: 'Bağlantı kurulamadı', text: 'İnternet bağlantını kontrol edip yeniden dene.', actions: [{ id: 'retry', label: 'Yeniden dene', primary: true, icon: 'refresh' }] },
    'offline': { icon: 'signal', tone: 'warn', title: 'Çevrimdışısın', text: 'Bazı özellikler bağlantı gelene kadar kapalı. Çevrimdışı oynamaya devam edebilirsin.', actions: [{ id: 'offline', label: 'Çevrimdışı oyna' }, { id: 'retry', label: 'Yeniden dene', primary: true, icon: 'refresh' }] },
    'maintenance': { icon: 'wrench', tone: 'warn', title: 'Bakımdayız', text: 'Sunucular kısa bir süre bakımda. Lütfen birazdan tekrar dene.', actions: [{ id: 'retry', label: 'Yeniden dene', primary: true, icon: 'refresh' }] },
    'update-required': { icon: 'arrow-down', tone: 'info', title: 'Güncelleme gerekli', text: 'Oynamaya devam etmek için oyunun yeni sürümünü indir.', actions: [{ id: 'update', label: 'Güncelle', primary: true, icon: 'arrow-down' }] },
    'update-available': { icon: 'arrow-down', tone: 'info', title: 'Yeni sürüm hazır', text: 'Yeni özellikler ve düzeltmeler içeriyor.', actions: [{ id: 'later', label: 'Sonra' }, { id: 'update', label: 'Güncelle', primary: true, icon: 'arrow-down' }] },
    'session-expired': { icon: 'logout', tone: 'warn', title: 'Oturum sona erdi', text: 'Hesabına başka bir cihazdan giriş yapıldı ya da oturum süresi doldu.', actions: [{ id: 'login', label: 'Yeniden giriş yap', primary: true }] },
    'error': { icon: 'alert', tone: 'danger', title: 'Bir şeyler ters gitti', text: 'Beklenmeyen bir hata oldu. Sorun sürerse destekle iletişime geç.', actions: [{ id: 'support', label: 'Destek' }, { id: 'retry', label: 'Yeniden dene', primary: true, icon: 'refresh' }] },
    'checking': { spinner: true, tone: 'accent', title: 'Sunucuya bağlanılıyor', text: 'Bu birkaç saniye sürebilir.', actions: [] },
    'reconnecting': { spinner: true, tone: 'warn', title: 'Yeniden bağlanılıyor', text: 'Bağlantı koptu, oyunun kaldığı yerden devam edecek.', actions: [{ id: 'quit', label: 'Lobiye dön' }] }
  };
  EUI.states = STATES;
  EUI.state = function (kind, o) {
    o = o || {};
    var d = STATES[kind] || STATES.error, c = {};
    Object.keys(d).forEach(function (k) { c[k] = d[k]; }); Object.keys(o).forEach(function (k) { c[k] = o[k]; });
    var el = app(c.target, 'eui-app--state');
    el.style.zIndex = 'var(--eui-z-top)';
    el.innerHTML = bg(c.bg) + '<div class="eui-state eui-t-' + E(c.tone || 'danger') + '">' +
      '<div class="eui-state__icon">' + (c.spinner ? '<span class="eui-spinner"></span>' : I(c.icon || 'alert')) + '</div>' +
      '<div class="eui-state__title">' + E(c.title) + '</div>' + (c.text ? '<div class="eui-state__text">' + E(c.text) + '</div>' : '') +
      (c.code ? '<div class="eui-state__code">Kod: ' + E(c.code) + '</div>' : '') +
      (c.actions && c.actions.length ? '<div class="eui-state__actions">' + c.actions.map(function (a) {
        return '<button class="eui-btn ' + (a.primary ? 'eui-btn--primary' : 'eui-btn--outline') + '" data-state="' + E(a.id) + '">' + (a.icon ? I(a.icon) : '') + E(a.label) + '</button>';
      }).join('') + '</div>' : '') + '</div>';
    EUI.mount(el);
    log('state', kind, c.code || '');
    var done;
    var p = new Promise(function (resolve) {
      done = function (v) { if (!el.isConnected) return; el.remove(); document.removeEventListener('keydown', key); log('state', kind, '→', v); resolve(v); };
    });
    function key(e) {
      if (e.key !== 'Enter') return;
      var pr = (c.actions || []).filter(function (a) { return a.primary; })[0];
      if (pr) { e.preventDefault(); done(pr.id); }
    }
    document.addEventListener('keydown', key);
    el.addEventListener('click', function (e) { var b = e.target.closest('[data-state]'); if (b) done(b.getAttribute('data-state')); });
    p.close = function (v) { done(v == null ? null : v); };
    p.el = el;
    return p;
  };
})(window);
