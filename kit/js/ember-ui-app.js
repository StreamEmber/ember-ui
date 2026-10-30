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

  /* ======================================================================
     Hesap ekranları: giriş / kayıt / hesap bağlama / şifre sıfırlama
     EUI.auth(host?, o) → Promise(sonuç | null)
     o: {
       mode: 'login' | 'signup' | 'link' | 'reset' | 'streamer',
       methods: ['email', 'qr', 'guest', 'google', 'apple'],   // sıra = görünüm sırası; email ve qr sekme olur
       title, sub, logo (resim), name (oyun adı; logo yoksa yazılır),
       qr: { img, code, hint },                                  // qr yöntemi: resim ya da yalnız kod
       legal: { terms, privacy },                                // kayıt / misafir için onay satırı; url değil, id
       cancel: true,                                             // Geri düğmesi (link / reset ekranlarında)
       validate(values) → hata metni | null,                     // ek doğrulama (kullanıcı adı alınmış mı…)
       onAction(a)                                               // forgot · switch (mode) · open (legal id) · method
     }
     Sonuç: { method: 'email', email, password, remember } · { method: 'signup', email, password, name } ·
            { method: 'qr' } (kodu oyun doğrular; p.done() ile ekranı kapat) · { method: 'guest' | 'google' | 'apple' } · { method: 'reset', email }
     Promise üzerinde: .error(metin) (sunucu hatası göster, ekran açık kalır) · .done(sonuç?) (kapat) · .el
     ====================================================================== */
  var AUTH = {
    login: { title: 'Giriş yap', sub: 'İlerlemen hesabında saklanır', ok: 'Giriş yap', alt: { text: 'Hesabın yok mu?', link: 'Kayıt ol', mode: 'signup' } },
    signup: { title: 'Hesap oluştur', sub: 'Ücretsiz, bir dakika sürer', ok: 'Kayıt ol', alt: { text: 'Zaten hesabın var mı?', link: 'Giriş yap', mode: 'login' } },
    link: { title: 'Hesabı bağla', sub: 'Misafir ilerlemen bu hesaba taşınır', ok: 'Bağla', alt: null },
    reset: { title: 'Şifreni sıfırla', sub: 'E-postana bir bağlantı göndereceğiz', ok: 'Bağlantı gönder', alt: { text: 'Şifreni hatırladın mı?', link: 'Giriş yap', mode: 'login' } },
    streamer: { title: 'Yayıncı girişi', sub: 'StreamEmber hesabınla bağlan', ok: 'Giriş yap', alt: null }
  };
  var SOCIAL = { google: ['Google ile devam et', 'world'], apple: ['Apple ile devam et', 'apple'], guest: ['Misafir olarak oyna', 'user'] };
  EUI.auth = function (target, o) {
    if (target && typeof target === 'object' && !target.nodeType && !o) { o = target; target = null; }
    o = o || {};
    var mode = o.mode || 'login', d = AUTH[mode] || AUTH.login;
    var methods = o.methods || (mode === 'streamer' ? ['qr', 'email'] : mode === 'reset' || mode === 'link' ? ['email'] : ['email', 'guest']);
    var tabs = methods.filter(function (m) { return m === 'email' || m === 'qr'; });
    var extra = methods.filter(function (m) { return SOCIAL[m]; });
    var el = app(o.target || target, 'eui-app--auth');
    el.style.zIndex = 'var(--eui-z-top)';
    var tab = tabs[0] || 'email';

    function field(name, label, type, ph, icon, extraAttr) {
      return '<label class="eui-field"><span class="eui-kicker">' + E(label) + '</span><div class="eui-input-wrap">' + I(icon) + '<input class="eui-input" name="' + name + '" type="' + type + '" placeholder="' + E(ph) + '" autocomplete="off" ' + (extraAttr || '') + '></div></label>';
    }
    function form() {
      if (tab === 'qr') {
        var q = o.qr || {};
        return '<div class="eui-auth__qr">' + (q.img ? '<img src="' + E(q.img) + '" alt="QR">' : '<div class="eui-auth__qrbox">' + I('focus') + '</div>') +
          '<div class="eui-auth__qrtext"><b>' + E(q.hint || 'Launcher ya da telefonunla kodu tara') + '</b>' + (q.code ? '<span class="eui-sub">ya da kodu gir</span><div class="eui-auth__code">' + q.code.split('').map(function (c) { return '<i>' + E(c) + '</i>'; }).join('') + '</div>' : '') + '</div></div>';
      }
      var f = '';
      if (mode === 'signup') f += field('name', 'Oyuncu adı', 'text', 'Görünecek adın', 'user', 'maxlength="20"');
      f += field('email', 'E-posta', 'email', 'ornek@eposta.com', 'email');
      if (mode !== 'reset') f += field('password', mode === 'signup' || mode === 'link' ? 'Şifre (en az 8)' : 'Şifre', 'password', '••••••••', 'lock');
      if (mode === 'login' || mode === 'streamer') f += '<div class="eui-auth__row"><label class="eui-check"><input type="checkbox" name="remember" checked><span class="eui-check__box"></span>Beni hatırla</label><button type="button" class="eui-auth__link" data-auth="forgot">Şifremi unuttum</button></div>';
      if ((mode === 'signup' || mode === 'link') && o.legal) f += '<label class="eui-check eui-auth__legal"><input type="checkbox" name="legal"><span class="eui-check__box"></span><span><button type="button" class="eui-auth__link" data-auth="open" data-id="terms">Kullanım koşullarını</button> ve <button type="button" class="eui-auth__link" data-auth="open" data-id="privacy">gizlilik politikasını</button> kabul ediyorum</span></label>';
      return f;
    }
    function render() {
      el.innerHTML = bg(o.bg) + '<div class="eui-auth">' +
        (o.cancel ? '<button class="eui-iconbtn eui-auth__back" data-auth="cancel" aria-label="Geri">' + I('arrow-left') + '</button>' : '') +
        '<div class="eui-auth__brand">' + (o.logo ? '<img src="' + E(o.logo) + '" alt="">' : o.name ? '<div class="eui-auth__game">' + E(o.name) + '</div>' : '') + '</div>' +
        '<form class="eui-panel eui-auth__card" novalidate>' +
          '<div class="eui-auth__head"><div class="eui-title">' + E(o.title || d.title) + '</div><div class="eui-sub">' + E(o.sub || d.sub) + '</div></div>' +
          (tabs.length > 1 ? '<div class="eui-seg eui-auth__tabs">' + tabs.map(function (t) { return '<button type="button" data-auth="tab" data-id="' + t + '"' + (t === tab ? ' class="is-active"' : '') + '>' + I(t === 'qr' ? 'focus' : 'email') + (t === 'qr' ? 'QR ile' : 'E-posta ile') + '</button>'; }).join('') + '</div>' : '') +
          '<div class="eui-auth__form">' + form() + '</div>' +
          '<div class="eui-auth__error eui-hidden"></div>' +
          (tab === 'email' ? '<button type="submit" class="eui-btn eui-btn--primary eui-btn--block eui-auth__ok">' + E(o.ok || d.ok) + '</button>' : '') +
          (extra.length ? (tab === 'email' ? '<div class="eui-auth__or"><span>ya da</span></div>' : '') + '<div class="eui-auth__alts">' + extra.map(function (m) { return '<button type="button" class="eui-btn eui-btn--outline eui-btn--block" data-auth="method" data-id="' + m + '">' + I(SOCIAL[m][1]) + E(SOCIAL[m][0]) + '</button>'; }).join('') + '</div>' : '') +
          (d.alt && o.alt !== false ? '<div class="eui-auth__foot">' + E(d.alt.text) + ' <button type="button" class="eui-auth__link" data-auth="switch" data-id="' + d.alt.mode + '">' + E(d.alt.link) + '</button></div>' : '') +
        '</form>' +
        (o.footer ? '<div class="eui-auth__legalline">' + E(o.footer) + '</div>' : '') + '</div>';
      EUI.mount(el);
      var first = el.querySelector('input'); if (first) setTimeout(function () { first.focus(); }, 50);
    }
    function values() {
      var v = {}; el.querySelectorAll('[name]').forEach(function (f) { v[f.name] = f.type === 'checkbox' ? f.checked : f.value.trim(); }); return v;
    }
    function error(msg) {
      var e = el.querySelector('.eui-auth__error'), c = el.querySelector('.eui-auth__card');
      e.textContent = msg || ''; e.classList.toggle('eui-hidden', !msg);
      if (msg) { c.classList.remove('is-shake'); void c.offsetWidth; c.classList.add('is-shake'); log('auth hata:', msg); }
    }
    function busy(on) { var b = el.querySelector('.eui-auth__ok'); if (b) { b.disabled = on; b.classList.toggle('is-busy', on); } }
    function act(a) { log('auth', a); EUI.emit('auth:action', a); if (o.onAction) o.onAction(a, api); }

    var done, api;
    var p = new Promise(function (resolve) { done = function (v) { if (!el.isConnected) return; el.remove(); log('auth →', v); resolve(v); }; });
    api = p;
    p.el = el;
    p.error = function (msg) { busy(false); error(msg); return p; };
    p.done = function (v) { done(v === undefined ? { method: tab } : v); };
    p.busy = busy;

    el.addEventListener('click', function (e) {
      var t = e.target.closest('[data-auth]'); if (!t) return;
      var k = t.getAttribute('data-auth'), id = t.getAttribute('data-id');
      if (k === 'tab') { tab = id; render(); act({ action: 'method', id: id }); }
      else if (k === 'cancel') done(null);
      else if (k === 'method') { var r = { method: id }; act({ action: 'method', id: id }); if (o.resolveOn === false) return; done(r); }
      else if (k === 'switch') { if (o.onAction && o.onAction({ action: 'switch', id: id }, api) === false) return; mode = id; d = AUTH[mode]; tab = 'email'; render(); }
      else act({ action: k, id: id, email: values().email });
    });
    el.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = values(), err = null;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email || '')) err = 'Geçerli bir e-posta adresi gir';
      else if (mode !== 'reset' && (v.password || '').length < (mode === 'login' || mode === 'streamer' ? 1 : 8)) err = mode === 'login' || mode === 'streamer' ? 'Şifreni gir' : 'Şifre en az 8 karakter olmalı';
      else if (mode === 'signup' && (v.name || '').length < 3) err = 'Oyuncu adı en az 3 karakter';
      else if ((mode === 'signup' || mode === 'link') && o.legal && !v.legal) err = 'Devam etmek için koşulları kabul et';
      else if (o.validate) err = o.validate(v);
      if (err) return error(err);
      error(null); busy(true);
      var r = { method: mode === 'reset' ? 'reset' : mode === 'signup' ? 'signup' : 'email', email: v.email, password: v.password, name: v.name, remember: !!v.remember, mode: mode };
      if (o.resolveOn === false) { act({ action: 'submit', values: r }); return; }   // oyun doğrular, p.done / p.error çağırır
      done(r);
    });
    render();
    return p;
  };

  /* ======================================================================
     Koşullar / gizlilik onayı
     EUI.consent(host?, { title, text, items: [{ id, label, required }], age: 13, accept, decline, onAction('open', id) }) → Promise(true | false)
     ====================================================================== */
  EUI.consent = function (target, o) {
    if (target && typeof target === 'object' && !target.nodeType && !o) { o = target; target = null; }
    o = o || {};
    var items = o.items || [{ id: 'terms', label: 'Kullanım koşullarını okudum, kabul ediyorum', required: true }, { id: 'privacy', label: 'Gizlilik politikasını okudum, kabul ediyorum', required: true }, { id: 'marketing', label: 'Haber ve kampanyalardan haberdar olmak istiyorum', required: false }];
    if (o.age) items = [{ id: 'age', label: o.age + ' yaşından büyüğüm', required: true }].concat(items);
    var el = app(o.target || target, 'eui-app--consent'); el.style.zIndex = 'var(--eui-z-top)';
    el.innerHTML = bg(o.bg) + '<div class="eui-auth"><div class="eui-panel eui-auth__card eui-auth__card--wide">' +
      '<div class="eui-auth__head"><div class="eui-title">' + E(o.title || 'Başlamadan önce') + '</div><div class="eui-sub">' + E(o.text || 'Oynamaya devam etmek için aşağıdakileri onayla.') + '</div></div>' +
      '<div class="eui-consent">' + items.map(function (it) {
        return '<label class="eui-check eui-consent__item"><input type="checkbox" name="' + E(it.id) + '"' + (it.required ? ' data-required' : '') + '><span class="eui-check__box"></span><span>' + E(it.label) + (it.required ? ' <i class="eui-consent__req">*</i>' : '') + '</span>' +
          (it.id !== 'age' && it.id !== 'marketing' ? '<button type="button" class="eui-btn eui-btn--sm eui-btn--ghost eui-btn--icon" data-consent="open" data-id="' + E(it.id) + '" aria-label="Oku">' + I('eye') + '</button>' : '') + '</label>';
      }).join('') + '</div>' +
      '<div class="eui-auth__actions"><button class="eui-btn eui-btn--outline" data-consent="decline">' + E(o.decline || 'Reddet') + '</button><button class="eui-btn eui-btn--primary eui-auth__ok" data-consent="accept" disabled>' + E(o.accept || 'Kabul et ve devam') + '</button></div>' +
      '</div></div>';
    EUI.mount(el);
    function ok() { return [].every.call(el.querySelectorAll('[data-required]'), function (c) { return c.checked; }); }
    el.addEventListener('change', function () { el.querySelector('[data-consent="accept"]').disabled = !ok(); });
    return new Promise(function (resolve) {
      el.addEventListener('click', function (e) {
        var t = e.target.closest('[data-consent]'); if (!t) return;
        var k = t.getAttribute('data-consent');
        if (k === 'open') { e.preventDefault(); log('consent open', t.getAttribute('data-id')); if (o.onAction) o.onAction({ action: 'open', id: t.getAttribute('data-id') }); return; }
        var v = {}; el.querySelectorAll('input[name]').forEach(function (c) { v[c.name] = c.checked; });
        el.remove(); log('consent →', k, v); resolve(k === 'accept' ? v : false);
      });
    });
  };

  /* ======================================================================
     Dil seçimi
     EUI.language(host?, { languages: [{ code, label, native, flag }], value, title }) → Promise(code | null)
     ====================================================================== */
  var LANGS = [{ code: 'tr', native: 'Türkçe', flag: '🇹🇷' }, { code: 'en', native: 'English', flag: '🇬🇧' }, { code: 'vi', native: 'Tiếng Việt', flag: '🇻🇳' }, { code: 'zh-TW', native: '繁體中文', flag: '🇹🇼' }, { code: 'de', native: 'Deutsch', flag: '🇩🇪' }, { code: 'es', native: 'Español', flag: '🇪🇸' }, { code: 'pt-BR', native: 'Português', flag: '🇧🇷' }, { code: 'ru', native: 'Русский', flag: '🇷🇺' }, { code: 'ar', native: 'العربية', flag: '🇸🇦' }, { code: 'id', native: 'Bahasa Indonesia', flag: '🇮🇩' }];
  EUI.languages = LANGS;
  EUI.language = function (target, o) {
    if (target && typeof target === 'object' && !target.nodeType && !o) { o = target; target = null; }
    o = o || {};
    var langs = o.languages || LANGS, cur = o.value || (langs[0] && langs[0].code);
    var el = app(o.target || target, 'eui-app--language'); el.style.zIndex = 'var(--eui-z-top)';
    function render() {
      el.innerHTML = bg(o.bg) + '<div class="eui-auth"><div class="eui-panel eui-auth__card eui-auth__card--wide">' +
        '<div class="eui-auth__head"><div class="eui-title">' + E(o.title || 'Dil / Language') + '</div>' + (o.sub ? '<div class="eui-sub">' + E(o.sub) + '</div>' : '') + '</div>' +
        '<div class="eui-langs">' + langs.map(function (l) {
          return '<button type="button" class="eui-lang' + (l.code === cur ? ' is-active' : '') + '" data-lang="' + E(l.code) + '"><span class="eui-lang__flag">' + E(l.flag || '') + '</span><span class="eui-lang__name">' + E(l.native || l.label || l.code) + '</span>' + (l.label && l.label !== l.native ? '<small>' + E(l.label) + '</small>' : '') + '</button>';
        }).join('') + '</div>' +
        '<div class="eui-auth__actions">' + (o.cancel ? '<button class="eui-btn eui-btn--outline" data-lang-cancel>' + E(o.cancelText || 'Vazgeç') + '</button>' : '') + '<button class="eui-btn eui-btn--primary eui-auth__ok" data-lang-ok>' + E(o.ok || 'Devam') + '</button></div></div></div>';
      EUI.mount(el);
    }
    render();
    return new Promise(function (resolve) {
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-lang]'); if (b) { cur = b.getAttribute('data-lang'); el.querySelectorAll('.eui-lang').forEach(function (x) { x.classList.toggle('is-active', x.getAttribute('data-lang') === cur); }); return; }
        if (e.target.closest('[data-lang-ok]')) { el.remove(); log('language →', cur); resolve(cur); }
        if (e.target.closest('[data-lang-cancel]')) { el.remove(); resolve(null); }
      });
    });
  };

  /* ======================================================================
     Oyuncu adı
     EUI.nickname(host?, { value, min: 3, max: 16, title, suggest: [..] | fn → ad, check(ad) → Promise(hata | null) }) → Promise(ad | null)
     ====================================================================== */
  EUI.nickname = function (target, o) {
    if (target && typeof target === 'object' && !target.nodeType && !o) { o = target; target = null; }
    o = o || {};
    var min = o.min || 3, max = o.max || 16;
    var el = app(o.target || target, 'eui-app--nickname'); el.style.zIndex = 'var(--eui-z-top)';
    el.innerHTML = bg(o.bg) + '<div class="eui-auth"><form class="eui-panel eui-auth__card" novalidate>' +
      '<div class="eui-auth__head"><div class="eui-title">' + E(o.title || 'Adını seç') + '</div><div class="eui-sub">' + E(o.sub || 'Diğer oyuncular seni bu adla görecek. Sonradan değiştirebilirsin.') + '</div></div>' +
      '<div class="eui-field"><div class="eui-input-wrap eui-nick">' + I('user') + '<input class="eui-input" name="name" maxlength="' + max + '" placeholder="Oyuncu adı" autocomplete="off" value="' + E(o.value || '') + '">' +
        (o.suggest ? '<button type="button" class="eui-btn eui-btn--sm eui-btn--ghost eui-btn--icon eui-nick__dice" data-nick="suggest" aria-label="Rastgele">' + I('dice') + '</button>' : '') + '</div>' +
        '<div class="eui-nick__meta"><span class="eui-nick__hint">' + min + '–' + max + ' karakter, harf ve rakam</span><span class="eui-nick__count">0 / ' + max + '</span></div></div>' +
      '<div class="eui-auth__error eui-hidden"></div>' +
      '<div class="eui-auth__actions">' + (o.cancel ? '<button type="button" class="eui-btn eui-btn--outline" data-nick="cancel">Vazgeç</button>' : '') + '<button type="submit" class="eui-btn eui-btn--primary eui-auth__ok">' + E(o.ok || 'Devam') + '</button></div></form></div>';
    EUI.mount(el);
    var inp = el.querySelector('input'), cnt = el.querySelector('.eui-nick__count'), err = el.querySelector('.eui-auth__error');
    function count() { cnt.textContent = inp.value.length + ' / ' + max; }
    function error(m) { err.textContent = m || ''; err.classList.toggle('eui-hidden', !m); if (m) { var c = el.querySelector('.eui-auth__card'); c.classList.remove('is-shake'); void c.offsetWidth; c.classList.add('is-shake'); } }
    count(); inp.addEventListener('input', function () { count(); error(null); }); setTimeout(function () { inp.focus(); }, 50);
    return new Promise(function (resolve) {
      el.addEventListener('click', function (e) {
        var t = e.target.closest('[data-nick]'); if (!t) return;
        if (t.getAttribute('data-nick') === 'cancel') { el.remove(); resolve(null); }
        else { var sg = o.suggest; inp.value = typeof sg === 'function' ? sg() : sg[Math.floor(Math.random() * sg.length)]; count(); error(null); }
      });
      el.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = inp.value.trim();
        if (v.length < min) return error('En az ' + min + ' karakter');
        if (!/^[\p{L}\p{N} _.-]+$/u.test(v)) return error('Yalnız harf, rakam, boşluk ve _ . - kullan');
        var b = el.querySelector('.eui-auth__ok'); b.disabled = true;
        Promise.resolve(o.check ? o.check(v) : null).then(function (m) {
          b.disabled = false;
          if (m) return error(m);
          el.remove(); log('nickname →', v); resolve(v);
        });
      });
    });
  };

  /* ======================================================================
     PIN / yetkili kilidi
     EUI.pin(host?, { length: 4, title, sub, verify(kod) → Promise(bool) | bool, cancel, attempts }) → Promise(kod | null)
     ====================================================================== */
  EUI.pin = function (target, o) {
    if (target && typeof target === 'object' && !target.nodeType && !o) { o = target; target = null; }
    o = o || {};
    var len = o.length || 4, code = '', left = o.attempts || 0;
    var el = app(o.target || target, 'eui-app--pin'); el.style.zIndex = 'var(--eui-z-top)';
    el.innerHTML = bg(o.bg) + '<div class="eui-auth"><div class="eui-panel eui-auth__card eui-pin">' +
      '<div class="eui-auth__head"><div class="eui-state__icon eui-t-accent eui-pin__icon">' + I(o.icon || 'lock') + '</div><div class="eui-title">' + E(o.title || 'Yetkili girişi') + '</div><div class="eui-sub">' + E(o.sub || 'Devam etmek için PIN gir') + '</div></div>' +
      '<div class="eui-pin__dots">' + Array.apply(null, Array(len)).map(function () { return '<i></i>'; }).join('') + '</div>' +
      '<div class="eui-auth__error eui-hidden"></div>' +
      '<div class="eui-pin__pad">' + '1 2 3 4 5 6 7 8 9'.split(' ').map(function (n) { return '<button type="button" data-pin="' + n + '">' + n + '</button>'; }).join('') +
        '<button type="button" data-pin="cancel" class="eui-pin__soft">' + (o.cancel !== false ? E(o.cancelText || 'Vazgeç') : '') + '</button><button type="button" data-pin="0">0</button><button type="button" data-pin="del" class="eui-pin__soft" aria-label="Sil">' + I('arrow-left') + '</button></div>' +
      '</div></div>';
    EUI.mount(el);
    var dots = el.querySelectorAll('.eui-pin__dots i'), err = el.querySelector('.eui-auth__error'), card = el.querySelector('.eui-pin');
    function paint() { dots.forEach(function (d, i) { d.classList.toggle('is-on', i < code.length); }); }
    function fail(m) { err.textContent = m; err.classList.remove('eui-hidden'); card.classList.remove('is-shake'); void card.offsetWidth; card.classList.add('is-shake'); code = ''; paint(); }
    return new Promise(function (resolve) {
      function finish(v) { document.removeEventListener('keydown', key); el.remove(); log('pin →', v ? 'ok' : 'iptal'); resolve(v); }
      function push(n) {
        if (code.length >= len) return;
        code += n; paint(); err.classList.add('eui-hidden');
        if (code.length < len) return;
        Promise.resolve(o.verify ? o.verify(code) : true).then(function (ok) {
          if (ok) return finish(code);
          if (left && --left <= 0) return finish(null);
          fail(o.wrong || ('PIN yanlış' + (left ? ' · ' + left + ' deneme kaldı' : '')));
        });
      }
      function key(e) {
        if (/^[0-9]$/.test(e.key)) push(e.key);
        else if (e.key === 'Backspace') { code = code.slice(0, -1); paint(); }
        else if (e.key === 'Escape' && o.cancel !== false) finish(null);
      }
      document.addEventListener('keydown', key);
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-pin]'); if (!b) return;
        var k = b.getAttribute('data-pin');
        if (k === 'del') { code = code.slice(0, -1); paint(); }
        else if (k === 'cancel') { if (o.cancel !== false) finish(null); }
        else push(k);
      });
    });
  };
})(window);
