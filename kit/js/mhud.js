/*!
 * MHud — davranış katmanı ve NUI köprüsü
 * Bağımlılıksız. FiveM ve RedM NUI'de (CEF) ve normal tarayıcıda çalışır.
 * Önce mhud-icons.js yüklenmelidir.
 *
 * Kısa özet:
 *   MH.theme('frontier'); MH.accent('gold')
 *   MH.bar('#hp', 64)  MH.ring(el, .8)  MH.core(el, { value: 80, core: 60 })
 *   MH.money('#cash', 15200)  MH.count(el, 1500)
 *   MH.toast({...})  MH.kill({...})  MH.gift({...})  MH.announce({...})  MH.banner({...})
 *   MH.progress({...})  MH.confirm({...})  MH.radial(el, items)  MH.context(x, y, items)
 *   MH.Nametags('#world')  MH.Markers('#world')  MH.damageNumber(...)
 *   MH.on('action', fn)  MH.post('callback', data)
 */
(function (root) {
  'use strict';

  var MH = { version: '2.0.2' };
  var doc = root.document;

  /* ======================================================================
     Yardımcılar
     ====================================================================== */
  function $(sel, ctx) { return typeof sel === 'string' ? (ctx || doc).querySelector(sel) : sel; }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }
  function el(tag, cls, html) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function nf(n, d) {
    return Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  }
  function time(sec, withHours) {
    sec = Math.max(0, Math.ceil(sec));
    var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60;
    var mm = (m < 10 ? '0' : '') + m, ss = (s < 10 ? '0' : '') + s;
    return (h || withHours) ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  }
  function compact(n) {
    n = Number(n || 0);
    if (n >= 1e6) return nf(n / 1e6, n < 1e7 ? 1 : 0) + ' Mn';
    if (n >= 1e4) return nf(n / 1e3, n < 1e5 ? 1 : 0) + ' B';
    return nf(n);
  }
  function icon(name, cls) {
    return '<svg class="mh-i' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#mi-' + name + '"></use></svg>';
  }
  function weapon(name, cls) {
    var d = (root.MH_WEAPONS || {})[name];
    if (!d) return icon('crosshair', cls);
    var paths = d.split(/(?=M)/).map(function (p) { return '<path d="' + p.trim() + '"/>'; }).join('');
    return '<svg class="mh-weapon-art' + (cls ? ' ' + cls : '') + '" viewBox="0 0 160 48" fill="currentColor" stroke="currentColor" stroke-width=".6" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }
  /* Görsel: emoji, ikon adı (i:gift), silah (w:carbine) ya da resim yolu */
  function art(v, cls) {
    if (!v) return '';
    v = String(v);
    if (v.indexOf('i:') === 0) return icon(v.slice(2), cls);
    if (v.indexOf('w:') === 0) return weapon(v.slice(2), cls);
    if (/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(v) || v.indexOf('http') === 0 || v.indexOf('nui://') === 0) return '<img src="' + esc(v) + '" alt="">';
    return '<span>' + esc(v) + '</span>';
  }
  function initials(name) {
    var s = String(name || '?').replace(/[_\-.]+/g, ' ').replace(/([a-zçğıöşü])([A-ZÇĞİÖŞÜ])/g, '$1 $2').trim();
    var p = s.split(/\s+/);
    if (p.length > 1) return (p[0][0] + p[1][0]).toUpperCase();
    return (/^[A-ZÇĞİÖŞÜ0-9]{2,}$/.test(p[0]) ? p[0].slice(0, 2) : p[0][0]).toUpperCase();   // "MSK" → MS, "NabeMedia" → NM
  }
  function avatar(name, opts) {
    opts = opts || {};
    var tone = opts.tone ? ' mh-t-' + opts.tone : '';
    var inner = opts.src ? '<img src="' + esc(opts.src) + '" alt="">' : esc(initials(name));
    return '<span class="mh-avatar' + (opts.cls ? ' ' + opts.cls : '') + tone + '">' + inner + '</span>';
  }
  function remove(node, cls) {
    if (!node || node.__leaving) return;
    node.__leaving = true;
    node.classList.add(cls || 'mh-leave');
    setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 300);
  }
  function raf(fn) { return (root.requestAnimationFrame || setTimeout)(fn); }

  MH.$ = $; MH.$$ = $$; MH.el = el; MH.esc = esc; MH.clamp = clamp;
  MH.fmt = nf; MH.time = time; MH.compact = compact;
  MH.icon = icon; MH.weapon = weapon; MH.art = art; MH.avatar = avatar; MH.initials = initials;

  /* ======================================================================
     Tema & ölçek
     ====================================================================== */
  MH.theme = function (name, scope) {
    scope = $(scope) || doc.body;
    if (name) scope.setAttribute('data-mh-theme', name); else scope.removeAttribute('data-mh-theme');
    emit('theme', name);
  };
  MH.accent = function (name, scope) {
    scope = $(scope) || doc.body;
    if (name) scope.setAttribute('data-mh-accent', name); else scope.removeAttribute('data-mh-accent');
    emit('accent', name);
  };
  /* NUI'de 1080p referansına göre ölçekler. userScale: oyuncu ayarı (ör. 0.9) */
  MH.autoScale = function (opts) {
    opts = opts || {};
    var base = opts.base || 1080, user = opts.scale || 1, target = $(opts.target) || doc.documentElement;
    function apply() { target.style.zoom = ((root.streamember && root.streamember.screenHeight || root.innerHeight) / base) * user; }
    apply();
    root.addEventListener('resize', apply);
    return { set: function (s) { user = s; apply(); } };
  };

  /* ======================================================================
     Bar, halka, çekirdek, segment
     ====================================================================== */
  MH.bar = function (target, value, opts) {
    var b = $(target); if (!b) return;
    opts = opts || {};
    var max = opts.max || 100;
    var v = clamp((value || 0) / max, 0, 1);
    var ax = b.classList.contains('mh-bar--v') ? 'scaleY(' : 'scaleX(';
    var fill = b.querySelector('.mh-bar__fill');
    var ghost = b.querySelector('.mh-bar__ghost');
    var prev = b.__v == null ? v : b.__v;
    b.__v = v;
    b.style.setProperty('--v', v);
    if (fill) fill.style.transform = ax + v + ')';
    if (ghost) {
      if (v >= prev) { ghost.style.transition = 'none'; ghost.style.transform = ax + v + ')'; ghost.offsetWidth; ghost.style.transition = ''; }
      else ghost.style.transform = ax + v + ')';
    }
    var crit = opts.critical == null ? b.getAttribute('data-critical') : opts.critical;
    if (crit != null) b.classList.toggle('is-critical', value <= Number(crit));
    var row = b.closest('.mh-vital, .mh-gauge');
    if (row && crit != null) row.classList.toggle('is-low', value <= Number(crit));
    return v;
  };
  function ringSvg(r, vb) {
    vb = vb || 48; r = r || (vb / 2 - 3);
    var c = vb / 2;
    return '<svg class="mh-ring" viewBox="0 0 ' + vb + ' ' + vb + '" aria-hidden="true">' +
      '<circle class="mh-ring__track" cx="' + c + '" cy="' + c + '" r="' + r + '" pathLength="100"></circle>' +
      '<circle class="mh-ring__fill" cx="' + c + '" cy="' + c + '" r="' + r + '" pathLength="100"></circle></svg>';
  }
  MH.ringSvg = ringSvg;
  /* value 0..1 */
  MH.ring = function (target, value) {
    var n = $(target); if (!n) return;
    n.style.setProperty('--v', clamp(value, 0, 1));
  };
  /* RDR2 çekirdeği: value = dış halka (0-100), core = iç dolgu (0-100) */
  MH.core = function (target, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    if (o.value != null) n.style.setProperty('--v', clamp(o.value / 100, 0, 1));
    if (o.core != null) n.style.setProperty('--core', clamp(o.core / 100, 0, 1));
    var low = o.low == null ? 25 : o.low;
    if (o.value != null) n.classList.toggle('is-low', o.value <= low);
    if (o.core != null) n.classList.toggle('is-empty', o.core <= 0);
    if (o.boosted != null) n.classList.toggle('is-boosted', !!o.boosted);
  };
  MH.pips = function (target, on, total) {
    var n = $(target); if (!n) return;
    total = total || n.children.length || 10;
    if (n.children.length !== total) n.innerHTML = new Array(total + 1).join('<i></i>');
    for (var i = 0; i < total; i++) n.children[i].classList.toggle('on', i < on);
  };

  /* ======================================================================
     Sayı animasyonu & para
     ====================================================================== */
  MH.count = function (target, to, opts) {
    var n = $(target); if (!n) return;
    opts = opts || {};
    var from = n.__val == null ? Number(String(n.textContent).replace(/[^\d-]/g, '')) || 0 : n.__val;
    var dur = opts.duration == null ? 650 : opts.duration;
    var format = opts.format || nf;
    n.__val = to;
    if (n.__raf) cancelAnimationFrame(n.__raf);
    if (!dur || from === to) { n.textContent = format(to); return; }
    var t0 = performance.now();
    (function step(t) {
      var k = clamp((t - t0) / dur, 0, 1);
      k = 1 - Math.pow(1 - k, 3);
      var v = from + (to - from) * k;
      n.textContent = format(k >= 1 ? to : (to % 1 || from % 1 ? v : Math.round(v)));   // kuruşlu değerler yuvarlanmaz
      if (k < 1) n.__raf = raf(step);
    })(t0);
  };
  /* .mh-cash kapsayıcısı ya da içindeki değer düğümü */
  MH.money = function (target, value, opts) {
    var box = $(target); if (!box) return;
    opts = opts || {};
    var cash = box.classList.contains('mh-cash') ? box : box.closest('.mh-cash') || box;
    var num = cash.querySelector('[data-cash]') || cash.querySelector('.mh-cash__value b') || box;
    var prev = num.__val == null ? value : num.__val;
    MH.count(num, value, opts);
    var diff = value - prev;
    if (diff && opts.delta !== false && cash.classList.contains('mh-cash')) {
      var d = el('div', 'mh-cash__delta' + (diff < 0 ? ' is-neg' : ''), (diff > 0 ? '+' : '−') + (opts.symbol || '$') + nf(Math.abs(diff)));
      var old = cash.querySelector('.mh-cash__delta'); if (old) old.remove();
      cash.appendChild(d);
      setTimeout(function () { d.remove(); }, 2300);
      if (diff > 0) { cash.classList.remove('is-gain'); void cash.offsetWidth; cash.classList.add('is-gain'); }
    }
  };

  /* ======================================================================
     Toast
     ====================================================================== */
  var TONE_ICON = { info: 'info', success: 'circle-check', warn: 'alert', danger: 'alert-circle', accent: 'bell', legendary: 'sparkles' };
  function host(sel, cls, anchor) {
    var h = $(sel);
    if (!h) {
      h = el('div', cls);
      var a = $(anchor) || $('.mh-screen') || doc.body;
      a.appendChild(h);
    }
    return h;
  }
  MH.toast = function (o) {
    o = o || {};
    var tone = o.tone || 'info';
    var stack = $(o.target) || host('[data-mh="toasts"]', 'mh-toasts');
    var t = el('div', 'mh-toast mh-t-' + tone + ' mh-enter-' + (o.from || 'right'));
    var html = '<div class="mh-toast__icon">' + icon(o.icon || TONE_ICON[tone] || 'bell') + '</div>' +
      '<div class="mh-toast__title">' + esc(o.title || '') + '</div>';
    if (o.closable !== false) html += '<button class="mh-toast__close mh-catch" aria-label="Kapat">' + icon('x') + '</button>';
    if (o.text) html += '<div class="mh-toast__text">' + (o.html ? o.text : esc(o.text)) + '</div>';
    if (o.meta) html += '<div class="mh-toast__meta">' + esc(o.meta) + '</div>';
    if (o.actions) {
      html += '<div class="mh-toast__actions mh-catch">' + o.actions.map(function (a, i) {
        return '<button class="mh-btn mh-btn--sm ' + (a.primary ? 'mh-btn--primary' : 'mh-btn--outline') + '" data-i="' + i + '">' + (a.key ? '<span class="mh-key">' + esc(a.key) + '</span>' : '') + esc(a.label) + '</button>';
      }).join('') + '</div>';
    }
    var dur = o.duration == null ? 5000 : o.duration;
    if (dur > 0) html += '<i class="mh-toast__timer is-run" style="animation-duration:' + dur + 'ms"></i>';
    t.innerHTML = html;
    if (o.newestOnTop === false) stack.appendChild(t); else stack.insertBefore(t, stack.firstChild);
    var max = o.max || 5;
    while (stack.children.length > max) stack.removeChild(o.newestOnTop === false ? stack.firstChild : stack.lastChild);
    var timer = dur > 0 ? setTimeout(close, dur) : null;
    function close() { clearTimeout(timer); remove(t, 'mh-leave-right'); if (o.onClose) o.onClose(); }
    var cb = t.querySelector('.mh-toast__close'); if (cb) cb.onclick = close;
    $$('.mh-toast__actions button', t).forEach(function (b) {
      b.onclick = function () { var a = o.actions[+b.getAttribute('data-i')]; if (a.onClick) a.onClick(); close(); };
    });
    return { el: t, close: close };
  };

  /* ======================================================================
     Ölüm akışı
     ====================================================================== */
  MH.kill = function (o) {
    o = o || {};
    var feed = $(o.target) || host('[data-mh="feed"]', 'mh-feed');
    var row = el('div', 'mh-kill mh-enter-right' + (o.self ? ' is-self' : '') + (o.death ? ' is-death' : ''));
    var aTone = o.actorTeam ? ' mh-t-' + o.actorTeam : '';
    var vTone = o.victimTeam ? ' mh-t-' + o.victimTeam : '';
    var w = o.weapon ? (root.MH_WEAPONS && root.MH_WEAPONS[o.weapon] ? weapon(o.weapon, 'mh-kill__weapon') : icon(o.weapon)) : icon('skull');
    row.innerHTML = (o.actor ? '<span class="mh-kill__actor' + aTone + '" style="' + (o.actorTeam ? '' : '') + '">' + esc(o.actor) + '</span>' : '') +
      w + (o.headshot ? icon('crosshair', 'is-head') : '') + (o.extra ? icon(o.extra) : '') +
      '<span class="mh-kill__victim' + vTone + '">' + esc(o.victim || '') + '</span>';
    feed.insertBefore(row, feed.firstChild);
    while (feed.children.length > (o.max || 6)) feed.removeChild(feed.lastChild);
    setTimeout(function () { remove(row, 'mh-leave-right'); }, o.duration || 6000);
    return row;
  };

  /* ======================================================================
     Hediye kartı (aynı anahtar gelirse kombo sayacı artar)
     ====================================================================== */
  var giftLive = {};
  MH.gift = function (o) {
    o = o || {};
    var list = $(o.target) || host('[data-mh="gifts"]', 'mh-gifts');
    var key = o.key || (o.from + '|' + o.name);
    var dur = o.duration || 5200;
    var count = o.count || 1;
    var live = giftLive[key];
    if (live && live.el.parentNode) {
      live.total += count;
      live.el.querySelector('.mh-gift__combo b').innerHTML = '<small>x</small>' + nf(live.total);
      if (o.coins) live.el.querySelector('.mh-gift__combo span').textContent = nf(o.coins * live.total) + ' jeton';
      live.el.classList.remove('is-bump'); void live.el.offsetWidth; live.el.classList.add('is-bump');
      clearTimeout(live.timer);
      live.restart();
      return live.el;
    }
    var g = el('div', 'mh-gift is-' + (o.tier || 'rare') + ' mh-enter-left');
    g.innerHTML = '<div class="mh-gift__art">' + art(o.art || 'i:gift') + (o.from ? avatar(o.from, { src: o.avatar }) : '') + '</div>' +
      '<div class="mh-gift__body"><div class="mh-gift__from"><b>' + esc(o.from || 'Anonim') + '</b> gönderdi</div>' +
      '<div class="mh-gift__name">' + esc(o.name || 'Hediye') + '</div>' +
      (o.effect ? '<div class="mh-gift__effect">' + icon(o.effectIcon || 'bolt') + esc(o.effect) + '</div>' : '') + '</div>' +
      '<div class="mh-gift__combo"><b><small>x</small>' + nf(count) + '</b><span>' + (o.coins ? nf(o.coins * count) + ' jeton' : '') + '</span></div>' +
      '<i class="mh-gift__progress"></i>';
    list.insertBefore(g, list.firstChild);
    while (list.children.length > (o.max || 4)) list.removeChild(list.lastChild);
    var rec = { el: g, total: count, timer: 0, restart: function () {
      var bar = g.querySelector('.mh-gift__progress');
      bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; void bar.offsetWidth;
      bar.style.transition = 'transform ' + dur + 'ms linear'; bar.style.transform = 'scaleX(0)';
      rec.timer = setTimeout(function () { remove(g, 'mh-leave-left'); delete giftLive[key]; }, dur);
    } };
    giftLive[key] = rec;
    rec.restart();
    return g;
  };

  /* ======================================================================
     Duyuru, büyük şerit, seviye, başarım, eşya, geri sayım, altyazı
     ====================================================================== */
  function center(sel, cls) { return host(sel, cls); }
  MH.announce = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="announce"]', 'mh-anchor mh-tc');
    if (!o.target && !box.style.top) box.style.top = '22%';
    box.innerHTML = '';
    var a = el('div', 'mh-announce is-in' + (o.tone ? ' mh-t-' + o.tone : ''));
    a.innerHTML = (o.kicker ? '<div class="mh-announce__kicker">' + esc(o.kicker) + '</div>' : '') +
      '<div class="mh-announce__title">' + esc(o.title || '') + '</div>' +
      (o.sub ? '<div class="mh-announce__sub">' + esc(o.sub) + '</div>' : '');
    box.appendChild(a);
    clearTimeout(box.__t);
    box.__t = setTimeout(function () { remove(a); }, o.duration || 3200);
    return a;
  };
  MH.banner = function (o) {
    o = o || {};
    var scr = $(o.target) || $('.mh-screen') || doc.body;
    var old = scr.querySelector(':scope > .mh-banner'); if (old) old.remove();
    var b = el('div', 'mh-banner is-in' + (o.fail ? ' is-fail' : '') + (o.tone ? ' mh-t-' + o.tone : ''));
    b.innerHTML = '<div class="mh-banner__title">' + esc(o.title || 'GÖREV TAMAMLANDI') + '</div>' +
      (o.sub ? '<div class="mh-banner__sub">' + esc(o.sub) + '</div>' : '') +
      (o.rewards ? '<div class="mh-banner__rewards">' + o.rewards.map(function (r) {
        return '<div class="mh-reward"><b' + (r.tone ? ' class="mh-tone mh-t-' + r.tone + '"' : '') + '>' + esc(r.value) + '</b><span>' + esc(r.label) + '</span></div>';
      }).join('') + '</div>' : '');
    scr.appendChild(b);
    if (o.duration !== 0) setTimeout(function () { remove(b); }, o.duration || 5000);
    return b;
  };
  MH.levelUp = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="levelup"]', 'mh-anchor mh-tc');
    if (!o.target && !box.style.top) box.style.top = '14%';
    box.innerHTML = '';
    var n = el('div', 'mh-panel mh-levelup mh-enter-pop');
    n.innerHTML = '<div class="mh-levelup__badge"><span>' + esc(o.level) + '</span></div><div>' +
      '<span class="mh-kicker mh-kicker--accent">' + esc(o.kicker || 'Seviye atladın') + '</span>' +
      '<div class="mh-title mh-title--lg">' + esc(o.title || ('Seviye ' + o.level)) + '</div>' +
      (o.unlocks ? '<div class="mh-levelup__unlocks">' + o.unlocks.map(function (u) { return '<span class="mh-badge mh-t-accent">' + esc(u) + '</span>'; }).join('') + '</div>' : '') + '</div>';
    box.appendChild(n);
    setTimeout(function () { remove(n); }, o.duration || 4200);
    return n;
  };
  MH.achievement = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="achv"]', 'mh-anchor mh-bc');
    if (!o.target && !box.style.bottom) box.style.bottom = '160px';
    var n = el('div', 'mh-panel mh-achv mh-enter-up');
    n.innerHTML = '<div class="mh-achv__icon">' + icon(o.icon || 'trophy') + '</div><div class="mh-achv__body">' +
      '<span class="mh-kicker">' + esc(o.kicker || 'Başarım açıldı') + '</span><span class="mh-achv__name">' + esc(o.name || '') + '</span></div>' +
      (o.points ? '<div class="mh-achv__pts">' + esc(o.points) + '</div>' : '');
    box.appendChild(n);
    setTimeout(function () { remove(n); }, o.duration || 4500);
    return n;
  };
  MH.pickup = function (o) {
    o = o || {};
    var list = $(o.target) || host('[data-mh="pickups"]', 'mh-pickups');
    var amt = o.amount == null ? 1 : o.amount;
    var n = el('div', 'mh-pickup mh-enter-right' + (amt < 0 ? ' is-neg' : ''));
    n.innerHTML = '<b>' + (amt < 0 ? '−' : '+') + nf(Math.abs(amt)) + '</b><span>' + esc(o.name || '') + '</span><span class="mh-pickup__icon">' + art(o.icon ? 'i:' + o.icon : 'i:package') + '</span>';
    list.appendChild(n);
    while (list.children.length > (o.max || 5)) list.removeChild(list.firstChild);
    setTimeout(function () { remove(n, 'mh-leave-right'); }, o.duration || 3200);
    return n;
  };
  MH.countdown = function (from, o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="countdown"]', 'mh-anchor mh-mc');
    var n = from == null ? 3 : from;
    return new Promise(function (resolve) {
      (function tick() {
        box.innerHTML = '';
        var go = n <= 0;
        var c = el('div', 'mh-countdown' + (go ? ' is-go' : ''), go ? esc(o.go || 'BAŞLA') : String(n));
        box.appendChild(c);
        if (o.onTick) o.onTick(n);
        if (go) { setTimeout(function () { box.innerHTML = ''; resolve(); }, 1000); return; }
        n--; setTimeout(tick, 1000);
      })();
    });
  };
  MH.subtitle = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="subtitle"]', 'mh-anchor mh-bc');
    if (!o.target && !box.style.bottom) box.style.bottom = '120px';
    box.innerHTML = '';
    var s = el('div', 'mh-subtitle mh-enter-fade' + (o.boxed ? ' mh-subtitle--boxed' : ''));
    s.innerHTML = (o.speaker ? '<b' + (o.color ? ' style="--speaker:' + esc(o.color) + '"' : '') + '>' + esc(o.speaker) + ':</b>' : '') + esc(o.text || '');
    box.appendChild(s);
    clearTimeout(box.__t);
    box.__t = setTimeout(function () { remove(s); }, o.duration || 4000);
    return s;
  };

  /* ======================================================================
     İlerleme (iptal edilebilir)
     ====================================================================== */
  MH.progress = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="progress"]', 'mh-anchor mh-bc');
    if (!o.target && !box.style.bottom) box.style.bottom = '150px';
    box.innerHTML = '';
    var p = el('div', 'mh-panel mh-progress mh-enter-up');
    p.innerHTML = '<div class="mh-progress__head">' + icon(o.icon || 'hourglass') + '<span class="mh-progress__label">' + esc(o.label || 'İşleniyor') + '</span><span class="mh-progress__pct">0%</span></div>' +
      '<div class="mh-bar"><i class="mh-bar__fill"></i></div>' +
      '<div class="mh-progress__foot"><span class="mh-progress__time"></span>' + (o.cancelKey !== false ? '<span class="mh-hint"><span class="mh-key mh-key--sm">' + esc(o.cancelKey || 'X') + '</span>İptal</span>' : '') + '</div>';
    box.appendChild(p);
    var fill = p.querySelector('.mh-bar__fill'), pct = p.querySelector('.mh-progress__pct'), tm = p.querySelector('.mh-progress__time');
    var dur = o.duration || 3000, t0 = performance.now(), done = false, rafId, resolveFn;
    var promise = new Promise(function (r) { resolveFn = r; });
    function finish(ok) {
      if (done) return; done = true; cancelAnimationFrame(rafId);
      if (!ok) p.querySelector('.mh-bar').classList.add('mh-t-danger');
      setTimeout(function () { remove(p); }, ok ? 150 : 400);
      resolveFn(ok);
    }
    (function step(t) {
      var k = clamp((t - t0) / dur, 0, 1);
      fill.style.transform = 'scaleX(' + k + ')';
      pct.textContent = Math.round(k * 100) + '%';
      tm.textContent = ((dur - (t - t0)) / 1000 > 0 ? ((dur - (t - t0)) / 1000).toFixed(1) : '0.0') + ' sn';
      if (k >= 1) return finish(true);
      rafId = raf(step);
    })(t0);
    promise.cancel = function () { finish(false); };
    return promise;
  };

  /* Basılı tutma halkası: el = .mh-hold; döner { start, stop } */
  MH.hold = function (target, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    var dur = o.duration || 1200, t0 = 0, id = 0, v = 0;
    function step(t) {
      v = clamp((t - t0) / dur, 0, 1);
      n.style.setProperty('--v', v);
      if (v >= 1) { id = 0; n.classList.add('is-done'); if (o.onDone) o.onDone(); return; }
      id = raf(step);
    }
    return {
      start: function () { if (id) return; t0 = performance.now() - v * dur; id = raf(step); },
      stop: function () { cancelAnimationFrame(id); id = 0; v = 0; n.classList.remove('is-done'); n.style.setProperty('--v', 0); }
    };
  };

  /* ======================================================================
     Modal: onay & metin girişi
     ====================================================================== */
  /* ----------------------------------------------------------------------
     MH.modal — genel modal (yığınlanır: üstteki ESC/Enter'ı alır)
     o: { kicker, title, text, icon, tone, danger, w | size: 'sm'|'md'|'lg'|'xl',
          body: html | Node, actions: [{ label, value, primary, danger, icon, key, submit }],
          dismiss (true), close (sağ üst ×, true), target, onOpen(m, api), validate(values) }
     Dönüş: Promise(value) — submit:true eylemi formdaki [name] alanlarını nesne olarak döndürür.
     ESC / dış alan → null. Promise üzerinde .close(v) ve .el vardır.
     ---------------------------------------------------------------------- */
  var modalStack = [], modalEscAt = 0;
  MH.modalOpen = function () { return modalStack.length > 0; };
  doc.addEventListener('keydown', function (e) {
    var top = modalStack[modalStack.length - 1]; if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); modalEscAt = Date.now(); if (top.dismiss) top.close(null); }
    else if (e.key === 'Enter' && !(e.target && e.target.tagName === 'TEXTAREA') && !e.shiftKey) {
      var p = top.el.querySelector('[data-primary]:not([disabled])');
      if (p) { e.preventDefault(); p.click(); }
    }
  }, true);
  function formValues(m) {
    var v = {};
    $$('[name]', m).forEach(function (f) {
      var k = f.getAttribute('name');
      if (f.type === 'checkbox') v[k] = f.checked;
      else if (f.type === 'radio') { if (f.checked) v[k] = f.value; }
      else if (f.type === 'number' || f.type === 'range') v[k] = f.value === '' ? null : Number(f.value);
      else v[k] = f.value;
    });
    return v;
  }
  var MSIZE = { sm: 380, md: 460, lg: 620, xl: 820 };
  MH.modal = function (o) {
    o = o || {};
    var api = {}, resolveFn;
    var p = new Promise(function (res) { resolveFn = res; });
    var l = el('div', 'mh-layer mh-layer--modal mh-catch');
    l.innerHTML = '<div class="mh-scrim mh-enter-fade"></div>';
    var tone = o.danger ? ' mh-t-danger' : o.tone ? ' mh-t-' + o.tone : '';
    var m = el('div', 'mh-panel mh-modal' + tone + (o.cls ? ' ' + o.cls : ''));
    m.style.setProperty('--w', (o.w || MSIZE[o.size || 'md'] || 460) + 'px');
    var head = (o.title || o.kicker || o.who) ? '<div class="mh-modal__head">' + (o.icon ? '<div class="mh-modal__icon">' + icon(o.icon) + '</div>' : '') +
      '<div class="mh-modal__titles">' + (o.kicker ? '<span class="mh-kicker mh-kicker--accent">' + esc(o.kicker) + '</span>' : '') + '<div class="mh-title">' + esc(o.title || '') + '</div>' +
      (o.who ? '<span class="mh-modal__who">' + avatar(o.who, { cls: 'mh-avatar--sm mh-avatar--round', src: o.whoAvatar }) + '<b>' + esc(o.who) + '</b></span>' : '') +
      (o.text ? '<div class="mh-sub">' + esc(o.text) + '</div>' : '') + '</div>' +
      (o.close !== false ? '<button class="mh-btn mh-btn--ghost mh-btn--sm mh-btn--icon mh-modal__x" data-x>' + icon('x') + '</button>' : '') + '</div>' : '';
    var acts = o.actions || [{ label: 'Kapat', value: null }];
    m.innerHTML = head + '<div class="mh-modal__content"></div><div class="mh-modal__error mh-hidden"></div>' +
      (acts.length ? '<div class="mh-modal__actions">' + acts.map(function (a, i) {
        var cls = a.primary ? (a.danger ? 'mh-btn--tone mh-t-danger' : 'mh-btn--primary') : a.danger ? 'mh-btn--tone mh-t-danger' : 'mh-btn--ghost';
        return '<button class="mh-btn ' + cls + '" data-act="' + i + '"' + (a.primary ? ' data-primary' : '') + (a.disabled ? ' disabled' : '') + (a.left ? ' style="margin-right:auto"' : '') + '>' +
          (a.key ? '<span class="mh-key mh-key--sm">' + esc(a.key) + '</span>' : a.icon ? icon(a.icon) : '') + esc(a.label) + '</button>';
      }).join('') + '</div>' : '');
    var content = m.querySelector('.mh-modal__content');
    if (o.body && o.body.nodeType) content.appendChild(o.body); else content.innerHTML = o.body || '';
    if (!o.body) content.classList.add('mh-hidden');
    l.appendChild(m);
    ($(o.target) || $('.mh-screen') || doc.body).appendChild(l);
    var entry = { el: m, dismiss: o.dismiss !== false, close: close };
    modalStack.push(entry);
    function close(v) {
      var i = modalStack.indexOf(entry); if (i < 0) return;
      modalStack.splice(i, 1);
      remove(l); resolveFn(v);
    }
    function error(msg) { var e = m.querySelector('.mh-modal__error'); e.textContent = msg || ''; e.classList.toggle('mh-hidden', !msg); if (msg) { m.classList.remove('is-shake'); void m.offsetWidth; m.classList.add('is-shake'); } }
    $$('[data-act]', m).forEach(function (b) {
      b.onclick = function () {
        var a = acts[+b.getAttribute('data-act')];
        if (a.submit) {
          var vals = formValues(content);
          if (o.collect) vals = o.collect(vals, m);
          var err = o.validate && o.validate(vals);
          if (err) return error(err);
          return close(vals);
        }
        if (a.onClick && a.onClick(api) === false) return;
        close(a.value !== undefined ? a.value : (a.primary ? true : null));
      };
    });
    var x = m.querySelector('[data-x]'); if (x) x.onclick = function () { close(null); };
    l.querySelector('.mh-scrim').onclick = function () { if (entry.dismiss) close(null); };
    api.el = m; api.close = close; api.error = error; api.content = content;
    p.el = m; p.close = close; p.error = error;
    MH.mount(m);
    var f = m.querySelector('[autofocus], input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea');
    if (f) setTimeout(function () { f.focus(); if (f.select) f.select(); }, 60);
    if (o.onOpen) o.onOpen(m, api);
    return p;
  };
  MH.closeModals = function () { modalStack.slice().reverse().forEach(function (e) { e.close(null); }); };

  MH.confirm = function (o) {
    o = o || {};
    return MH.modal({ kicker: o.kicker, who: o.who, title: o.title || 'Emin misin?', text: o.text, icon: o.icon !== false ? (o.icon || (o.danger ? 'alert' : 'info')) : null, danger: o.danger, tone: o.tone, size: o.size || 'md', close: false, target: o.target,
      body: o.body, actions: [{ label: o.cancel || 'Vazgeç', value: false, key: 'ESC' }, { label: o.ok || 'Onayla', value: true, primary: true, danger: o.danger, key: 'ENTER' }] })
      .then(function (v) { return !!v; });
  };
  MH.input = function (o) {
    o = o || {};
    var body = '<label class="mh-field">' + (o.label ? '<span class="mh-kicker">' + esc(o.label) + '</span>' : '') +
      '<input class="mh-input" name="value" type="' + (o.type || 'text') + '" placeholder="' + esc(o.placeholder || '') + '" value="' + esc(o.value || '') + '" maxlength="' + (o.max || 64) + '"></label>';
    return MH.modal({ kicker: o.kicker, who: o.who, title: o.title || 'Değer gir', text: o.text, icon: o.icon, size: o.size || 'md', body: body, target: o.target,
      validate: o.validate ? function (v) { return o.validate(v.value); } : (o.required ? function (v) { return String(v.value || '').trim() ? null : (o.requiredText || 'Bu alan boş bırakılamaz'); } : null),
      actions: [{ label: o.cancel || 'Vazgeç', value: null }, { label: o.ok || 'Kaydet', primary: true, submit: true }] })
      .then(function (v) { return v ? v.value : null; });
  };

  /* MH.choose — aranabilir seçim listesi (oyuncu davet etme vb.)
     o: { title, text, items: [{ id, label, sub, icon, avatar, tone, badge, right, disabled }], multi, search (true), ok, empty, max }
     Dönüş: multi ? [id] : id  — vazgeçilirse null */
  MH.choose = function (o) {
    o = o || {};
    var items = o.items || [], picked = {};
    (o.selected || []).forEach(function (id) { picked[id] = 1; });
    var body = el('div', 'mh-choose');
    body.innerHTML = (o.search !== false ? '<div class="mh-input-wrap">' + icon('search') + '<input class="mh-input" placeholder="' + esc(o.placeholder || 'Ara…') + '"></div>' : '') +
      '<div class="mh-choose__list mh-scroll"></div>' + (o.multi ? '<div class="mh-choose__foot"><span class="mh-sub"><b data-n>0</b> seçildi</span><button class="mh-btn mh-btn--ghost mh-btn--sm" data-all>Tümünü seç</button></div>' : '');
    var list = body.querySelector('.mh-choose__list'), cur = 0;
    function vis() { return $$('.mh-choose__row:not(.is-disabled)', list); }
    function draw(q) {
      q = (q || '').toLowerCase().trim();
      var rows = items.filter(function (it) { return !q || String(it.label).toLowerCase().indexOf(q) >= 0 || String(it.sub || '').toLowerCase().indexOf(q) >= 0; });
      list.innerHTML = rows.length ? rows.map(function (it) {
        var art = it.avatar !== undefined || !it.icon ? avatar(it.label, { src: it.avatar, tone: it.tone, cls: 'mh-avatar--sm mh-avatar--round' }) : '<span class="mh-row__icon">' + icon(it.icon) + '</span>';
        return '<div class="mh-choose__row' + (picked[it.id] ? ' is-picked' : '') + (it.disabled ? ' is-disabled' : '') + '" data-id="' + esc(it.id) + '">' +
          (o.multi ? '<span class="mh-check"><input type="checkbox"' + (picked[it.id] ? ' checked' : '') + (it.disabled ? ' disabled' : '') + '><span class="mh-check__box"></span></span>' : '') + art +
          '<div class="mh-row__main"><span class="mh-row__title">' + esc(it.label) + '</span>' + (it.sub ? '<span class="mh-row__sub">' + esc(it.sub) + '</span>' : '') + '</div>' +
          (it.badge ? '<span class="mh-badge' + (it.badgeTone ? ' mh-t-' + it.badgeTone : '') + '">' + esc(it.badge) + '</span>' : '') + (it.right ? '<span class="mh-num mh-dim">' + esc(it.right) + '</span>' : '') + '</div>';
      }).join('') : '<div class="mh-empty">' + icon('search') + '<span>' + esc(o.empty || 'Sonuç yok') + '</span></div>';
      cur = 0; hl();
    }
    function hl() { vis().forEach(function (r, i) { r.classList.toggle('is-active', i === cur); }); }
    function count() { var n = body.querySelector('[data-n]'); if (n) n.textContent = Object.keys(picked).filter(function (k) { return picked[k]; }).length; }
    var api;
    function toggle(r) {
      var id = r.getAttribute('data-id');
      if (!o.multi) { api.close(id); return; }
      var on = !picked[id];
      if (on && o.max && Object.keys(picked).filter(function (k) { return picked[k]; }).length >= o.max) return api.error('En fazla ' + o.max + ' seçebilirsin');
      picked[id] = on ? 1 : 0; r.classList.toggle('is-picked', on); r.querySelector('input').checked = on; count(); api.error('');
    }
    list.addEventListener('click', function (e) { var r = e.target.closest('.mh-choose__row'); if (!r || r.classList.contains('is-disabled')) return; e.preventDefault(); toggle(r); });
    draw('');
    var inp = body.querySelector('input.mh-input');
    if (inp) {
      inp.addEventListener('input', function () { draw(inp.value); });
      inp.addEventListener('keydown', function (e) {
        var v = vis();
        if (e.key === 'ArrowDown') { e.preventDefault(); cur = Math.min(v.length - 1, cur + 1); hl(); v[cur] && v[cur].scrollIntoView({ block: 'nearest' }); }
        if (e.key === 'ArrowUp') { e.preventDefault(); cur = Math.max(0, cur - 1); hl(); v[cur] && v[cur].scrollIntoView({ block: 'nearest' }); }
        if (e.key === ' ' && o.multi && v[cur]) { e.preventDefault(); toggle(v[cur]); }
        if (e.key === 'Enter' && !o.multi && v[cur]) { e.preventDefault(); e.stopPropagation(); toggle(v[cur]); }
      });
    }
    var all = body.querySelector('[data-all]');
    if (all) all.onclick = function () { items.forEach(function (it) { if (!it.disabled) picked[it.id] = 1; }); draw(inp ? inp.value : ''); count(); };
    count();
    var acts = o.multi ? [{ label: 'Vazgeç', value: null }, { label: o.ok || 'Gönder', primary: true, icon: o.okIcon || 'check', onClick: function (a) {
      var ids = Object.keys(picked).filter(function (k) { return picked[k]; });
      if (!ids.length) { a.error(o.needText || 'En az bir kişi seç'); return false; }
      a.close(ids); return false;
    } }] : [{ label: 'Vazgeç', value: null }];
    var pr = MH.modal({ kicker: o.kicker, who: o.who, title: o.title || 'Seç', text: o.text, icon: o.icon, size: o.size || 'md', body: body, actions: acts, target: o.target, cls: 'mh-modal--choose' });
    api = { close: pr.close, error: pr.error };
    return pr;
  };

  /* MH.amount — tutar/adet seçici
     o: { title, text, label, min (1), max, value, step (1), prefix ('$'), suffix, quick: [100, 1000, 'max'], decimals, ok } → Promise(sayı | null) */
  MH.amount = function (o) {
    o = o || {};
    var min = o.min == null ? 1 : o.min, max = o.max == null ? 1e9 : o.max, step = o.step || 1, val = clamp(o.value == null ? min : o.value, min, max);
    var quick = o.quick || [];
    var body = el('div', 'mh-amount');
    body.innerHTML = (o.label ? '<span class="mh-kicker">' + esc(o.label) + '</span>' : '') +
      '<div class="mh-amount__field">' + (o.prefix !== '' ? '<span class="mh-amount__fix">' + esc(o.prefix == null ? '$' : o.prefix) + '</span>' : '') +
      '<button class="mh-btn mh-btn--ghost mh-btn--icon" data-d="-1">' + icon('minus') + '</button>' +
      '<input class="mh-amount__input" type="number" name="amount" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">' +
      '<button class="mh-btn mh-btn--ghost mh-btn--icon" data-d="1">' + icon('plus') + '</button>' + (o.suffix ? '<span class="mh-amount__fix">' + esc(o.suffix) + '</span>' : '') + '</div>' +
      (max < 1e9 ? '<input type="range" class="mh-slider" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '">' +
        '<div class="mh-amount__range"><span>' + esc(nf(min)) + '</span><span>' + esc((o.maxLabel ? o.maxLabel + ' · ' : '') + nf(max)) + '</span></div>' : '') +
      (quick.length ? '<div class="mh-amount__quick">' + quick.map(function (q) { return '<button class="mh-chip" data-q="' + q + '">' + (q === 'max' ? 'Tümü' : q === 'half' ? 'Yarısı' : (o.prefix == null ? '$' : o.prefix) + nf(q)) + '</button>'; }).join('') + '</div>' : '');
    var inp = body.querySelector('.mh-amount__input'), rng = body.querySelector('input[type=range]');
    function set(v) { v = clamp(Math.round(Number(v) / step) * step, min, max); if (isNaN(v)) v = min; inp.value = v; if (rng) { rng.value = v; rng.dispatchEvent(new Event('input')); } }
    if (rng) rng.addEventListener('input', function () { inp.value = rng.value; });
    inp.addEventListener('change', function () { set(inp.value); });
    $$('[data-d]', body).forEach(function (b) { b.onclick = function () { set(Number(inp.value) + step * +b.getAttribute('data-d') * (o.bigStep || 1)); }; });
    $$('[data-q]', body).forEach(function (b) { b.onclick = function () { var q = b.getAttribute('data-q'); set(q === 'max' ? max : q === 'half' ? Math.floor(max / 2) : q); }; });
    return MH.modal({ kicker: o.kicker, who: o.who, title: o.title || 'Tutar', text: o.text, icon: o.icon, tone: o.tone, size: o.size || 'md', body: body, target: o.target,
      validate: function (v) { var n = Number(v.amount); return isNaN(n) || n < min ? 'En az ' + nf(min) : n > max ? 'En fazla ' + nf(max) : (o.validate ? o.validate(n) : null); },
      actions: [{ label: 'Vazgeç', value: null }, { label: o.ok || 'Onayla', primary: true, submit: true, icon: o.okIcon }] })
      .then(function (v) { return v ? Number(v.amount) : null; });
  };

  /* ======================================================================
     Radial menü — SVG dilimleri
     items: [{ id, icon, label, sub, disabled }]
     ====================================================================== */
  MH.radial = function (target, items, o) {
    var box = $(target); if (!box) return;
    o = o || {};
    var size = o.size || 440, R = size / 2, ro = R - 4, ri = R * (o.inner || .36), gap = (o.gap == null ? 1.2 : o.gap) * Math.PI / 180;
    var n = items.length, step = Math.PI * 2 / n, start = -Math.PI / 2 - step / 2;
    box.classList.add('mh-radial');
    box.style.setProperty('--size', size + 'px');
    function pt(r, a) { return (R + r * Math.cos(a)).toFixed(2) + ' ' + (R + r * Math.sin(a)).toFixed(2); }
    function wedge(a0, a1, r0, r1) {
      var large = a1 - a0 > Math.PI ? 1 : 0;
      return 'M' + pt(r1, a0) + ' A' + r1 + ' ' + r1 + ' 0 ' + large + ' 1 ' + pt(r1, a1) + ' L' + pt(r0, a1) + ' A' + r0 + ' ' + r0 + ' 0 ' + large + ' 0 ' + pt(r0, a0) + ' Z';
    }
    function arc(a0, a1, r) { return 'M' + pt(r, a0) + ' A' + r + ' ' + r + ' 0 0 1 ' + pt(r, a1); }
    var svg = '<svg viewBox="0 0 ' + size + ' ' + size + '">';
    items.forEach(function (it, i) {
      var a0 = start + i * step + gap / 2, a1 = start + (i + 1) * step - gap / 2;
      var d = wedge(a0, a1, ri, ro);
      // alt katman dilimin zeminidir; üstteki dilim seçilince yalnız renk tonu ekler (arka plan sızmaz)
      svg += '<path class="mh-radial__base' + (it.disabled ? ' is-disabled' : '') + '" d="' + d + '"/><path class="mh-radial__seg' + (it.disabled ? ' is-disabled' : '') + '" data-i="' + i + '" d="' + d + '"/>';
    });
    svg += '<path class="mh-radial__ring" d=""/></svg>';
    var html = svg;
    items.forEach(function (it, i) {
      var a = start + (i + .5) * step, rm = (ri + ro) / 2;
      var x = R + rm * Math.cos(a), y = R + rm * Math.sin(a);
      html += '<div class="mh-radial__item" data-i="' + i + '" style="left:' + x.toFixed(1) + 'px;top:' + y.toFixed(1) + 'px">' + icon(it.icon || 'grid') +
        '<span>' + esc(it.label || '') + '</span>' + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</div>';
    });
    html += '<div class="mh-radial__center"><b>' + esc(o.title || 'Menü') + '</b><span>' + esc(o.hint || 'Bir seçenek seç') + '</span></div>';
    box.innerHTML = html;
    var ring = box.querySelector('.mh-radial__ring');
    var cTitle = box.querySelector('.mh-radial__center b'), cSub = box.querySelector('.mh-radial__center span');
    var active = -1;
    function set(i) {
      if (i === active) return;
      active = i;
      $$('.is-active', box).forEach(function (x) { x.classList.remove('is-active'); });
      if (i < 0) { ring.setAttribute('d', ''); cTitle.textContent = o.title || 'Menü'; cSub.textContent = o.hint || 'Bir seçenek seç'; return; }
      var it = items[i];
      box.querySelector('.mh-radial__seg[data-i="' + i + '"]').classList.add('is-active');
      box.querySelector('.mh-radial__item[data-i="' + i + '"]').classList.add('is-active');
      ring.setAttribute('d', arc(start + i * step + gap / 2, start + (i + 1) * step - gap / 2, ro + 6));
      cTitle.textContent = it.label || '';
      cSub.textContent = it.desc || it.sub || '';
      if (o.onHover) o.onHover(it, i);
    }
    function fromPoint(x, y) {
      var r = box.getBoundingClientRect(), k = r.width / size;
      var dx = (x - r.left) / k - R, dy = (y - r.top) / k - R, d = Math.sqrt(dx * dx + dy * dy);
      if (d < ri * .6) return -1;
      var a = Math.atan2(dy, dx) - start; a = (a % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);
      var i = Math.floor(a / step);
      return items[i] && !items[i].disabled ? i : -1;
    }
    box.onmousemove = function (e) { set(fromPoint(e.clientX, e.clientY)); };
    box.onmouseleave = function () { if (!o.keepOnLeave) set(-1); };
    box.onclick = function (e) { var i = fromPoint(e.clientX, e.clientY); if (i >= 0 && o.onPick) o.onPick(items[i], i); };
    return { select: set, get active() { return active; } };
  };

  /* ======================================================================
     Bağlam menüsü
     ====================================================================== */
  MH.context = function (x, y, items, o) {
    o = o || {};
    MH.closeContext();
    var scr = $(o.target) || $('.mh-screen') || doc.body;
    var m = el('div', 'mh-panel mh-context mh-catch mh-enter-pop');
    m.setAttribute('data-mh', 'context');
    m.style.position = 'absolute'; m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.zIndex = 70;
    m.innerHTML = (o.title ? '<div class="mh-context__head"><span class="mh-kicker">' + esc(o.title) + '</span></div>' : '') + items.map(function (it, i) {
      if (it === '-' || it.sep) return '<div class="mh-context__sep"></div>';
      return '<button class="mh-context__item' + (it.danger ? ' is-danger' : '') + '" data-i="' + i + '">' + (it.icon ? icon(it.icon) : '') + '<span>' + esc(it.label) + '</span>' +
        (it.key ? '<span class="mh-key mh-key--sm">' + esc(it.key) + '</span>' : it.hint ? '<small>' + esc(it.hint) + '</small>' : '') + '</button>';
    }).join('');
    scr.appendChild(m);
    var r = m.getBoundingClientRect(), pr = scr.getBoundingClientRect(), k = pr.width / (scr.offsetWidth || pr.width);
    if (r.right > pr.right) m.style.left = (x - r.width / k) + 'px';
    if (r.bottom > pr.bottom) m.style.top = (y - r.height / k) + 'px';
    $$('.mh-context__item', m).forEach(function (b) {
      b.onclick = function (e) { e.stopPropagation(); var it = items[+b.getAttribute('data-i')]; MH.closeContext(); if (it.onClick) it.onClick(); if (o.onPick) o.onPick(it); };
    });
    setTimeout(function () { doc.addEventListener('mousedown', outside); }, 0);
    function outside(e) { if (!m.contains(e.target)) MH.closeContext(); }
    m.__off = function () { doc.removeEventListener('mousedown', outside); };
    return m;
  };
  MH.closeContext = function () { $$('[data-mh="context"]').forEach(function (m) { if (m.__off) m.__off(); remove(m); }); };

  /* ======================================================================
     Dünya katmanı: havuzlu düğümler, yalnızca transform yazılır
     ====================================================================== */
  function Pool(world, make, paint) {
    world = $(world);
    var nodes = {};
    function toPx(v, size) { return v <= 1.5 ? v * size : v; }
    return {
      update: function (list) {
        var w = world.clientWidth, h = world.clientHeight, seen = {};
        for (var i = 0; i < list.length; i++) {
          var it = list[i], id = it.id == null ? i : it.id;
          seen[id] = 1;
          var n = nodes[id];
          if (!n) { n = nodes[id] = make(it); world.appendChild(n); }
          if (n.__sig !== it.sig || it.sig == null) paint(n, it);
          n.__sig = it.sig;
          var s = it.scale == null ? 1 : it.scale;
          n.style.transform = 'translate3d(' + toPx(it.x, w).toFixed(1) + 'px,' + toPx(it.y, h).toFixed(1) + 'px,0) translate(-50%,-100%) scale(' + s + ')';
          n.style.opacity = it.alpha == null ? 1 : it.alpha;
          n.style.zIndex = it.z == null ? Math.round(s * 100) : it.z;
        }
        for (var k in nodes) if (!seen[k]) { world.removeChild(nodes[k]); delete nodes[k]; }
      },
      clear: function () { for (var k in nodes) world.removeChild(nodes[k]); nodes = {}; }
    };
  }
  MH.Pool = Pool;

  /* İsim etiketleri — list öğesi:
     { id, x, y, scale, alpha, name, sid, tone:'friend'|'enemy'|'team1', badge:{text,tone}, health, armor,
       sub, talking, dead, typing, icon, bubble, compact,
       variant:'plate|flag|pill|line|bar|pointer|banner|bracket|boss|npc|far|bounty|viewer|hp|glow|frontier|vip', role, avatar,
       level, clan, down, afk, leader } */
  MH.Nametags = function (world, opts) {
    opts = opts || {};
    return Pool(world, function () { return el('div', 'mh-tag'); }, function (n, t) {
      n.className = 'mh-tag' + (t.tone ? (/^team/.test(t.tone) ? ' mh-t-' + t.tone : ' is-' + t.tone) : '') +
        (t.talking ? ' is-talking' : '') + (t.down ? ' is-down' : '') + (t.afk ? ' is-afk' : '') + (t.leader ? ' is-leader' : '') + (t.dead ? ' is-dead' : '') + (t.typing ? ' is-typing' : '') + (t.compact || opts.compact ? ' mh-tag--compact' : '') + (t.variant || opts.variant ? ' mh-tag--' + (t.variant || opts.variant) : '');
      var bars = '';
      if (opts.bars !== false && t.health != null && !t.dead) {
        bars = '<div class="mh-tag__bars"><div class="mh-bar mh-t-' + (t.tone === 'enemy' || t.health <= 25 ? 'danger' : 'health') + '"><i class="mh-bar__fill" style="transform:scaleX(' + clamp(t.health / 100, 0, 1) + ')"></i></div>' +
          (t.armor ? '<div class="mh-bar mh-t-armor"><i class="mh-bar__fill" style="transform:scaleX(' + clamp(t.armor / 100, 0, 1) + ')"></i></div>' : '') + '</div>';
      }
      n.innerHTML = (t.bubble ? '<div class="mh-tag__bubble">' + esc(t.bubble) + '</div>' : '') +
        (t.role ? '<div class="mh-tag__role">' + esc(t.role) + '</div>' : '') + '<div class="mh-tag__line">' + (t.avatar ? '<span class="mh-avatar mh-avatar--round">' + esc(t.avatar) + '</span>' : '') + (t.dead ? icon('skull') : t.icon ? icon(t.icon) : '') + '<span class="mh-tag__voice">' + icon('mic') + '</span>' +
        (t.level != null ? '<span class="mh-tag__lvl">' + esc(t.level) + '</span>' : '') + (t.clan ? '<span class="mh-tag__clan">[' + esc(t.clan) + ']</span>' : '') + '<span class="mh-tag__name">' + esc(t.name) + '</span>' + (t.sid != null ? '<span class="mh-tag__id">' + esc(t.sid) + '</span>' : '') +
        (t.badge && opts.badges !== false ? '<span class="mh-badge mh-t-' + (t.badge.tone || 'neutral') + '">' + esc(t.badge.text) + '</span>' : '') + '</div>' +
        bars + (t.sub && opts.sub !== false ? '<div class="mh-tag__sub">' + esc(t.sub) + '</div>' : '');
    });
  };

  /* İşaretçiler — { id, x, y, icon, label, dist, tone, pulse } */
  MH.Markers = function (world) {
    return Pool(world, function () { return el('div', 'mh-marker'); }, function (n, m) {
      n.className = 'mh-marker' + (m.tone ? ' mh-t-' + m.tone : '') + (m.pulse ? ' is-pulse' : '');
      n.innerHTML = (m.label ? '<span class="mh-marker__label">' + esc(m.label) + '</span>' : '') +
        '<span class="mh-marker__pin">' + icon(m.icon || 'flag') + '</span>' +
        (m.dist != null ? '<span class="mh-marker__dist">' + (m.dist >= 1000 ? (m.dist / 1000).toFixed(1) + ' km' : Math.round(m.dist) + ' m') + '</span>' : '');
    });
  };

  MH.damageNumber = function (world, o) {
    var w = $(world); if (!w) return;
    var f = el('div', 'mh-float');
    var x = o.x <= 1.5 ? o.x * w.clientWidth : o.x, y = o.y <= 1.5 ? o.y * w.clientHeight : o.y;
    f.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    var s = el('span', 'mh-dmgnum' + (o.kind ? ' is-' + o.kind : ''), (o.kind === 'heal' ? '+' : '') + nf(o.value));
    s.style.setProperty('--dx', (Math.random() * 40 - 20).toFixed(0) + 'px');
    f.appendChild(s); w.appendChild(f);
    setTimeout(function () { f.remove(); }, 1050);
  };

  /* ======================================================================
     Savaş geri bildirimi
     ====================================================================== */
  MH.hit = function (target, kind) {
    var c = $(target) || $('.mh-screen'); if (!c) return;
    var h = el('div', 'mh-hitmarker' + (kind ? ' is-' + kind : ''), '<i></i><i></i><i></i><i></i>');
    c.appendChild(h);
    setTimeout(function () { h.remove(); }, 340);
  };
  /* angle: 0 = önden, 90 = sağdan, 180 = arkadan */
  MH.damageFrom = function (target, angle) {
    var c = $(target) || $('.mh-screen'); if (!c) return;
    var wrap = c.querySelector(':scope > .mh-dmgdir');
    if (!wrap) { wrap = el('div', 'mh-dmgdir'); c.appendChild(wrap); }
    var a = el('i', 'mh-dmgdir__arc');
    a.style.transform = 'rotate(' + (angle || 0) + 'deg)';
    wrap.appendChild(a);
    setTimeout(function () { a.remove(); }, 1450);
  };
  MH.flash = function (target, red) {
    var c = $(target) || $('.mh-screen'); if (!c) return;
    var f = el('div', 'mh-flash' + (red ? ' is-red' : ''));
    c.appendChild(f); setTimeout(function () { f.remove(); }, 520);
  };
  MH.vignette = function (target, health) {
    var v = $(target); if (!v) return;
    var k = health >= 40 ? 0 : clamp((40 - health) / 40, 0, 1);
    v.style.setProperty('--v', k.toFixed(2));
    v.classList.toggle('is-pulse', health > 0 && health < 20);
  };

  /* ======================================================================
     Pusula, hız göstergesi, sayaç
     ====================================================================== */
  var CARD = { 0: 'K', 45: 'KD', 90: 'D', 135: 'GD', 180: 'G', 225: 'GB', 270: 'B', 315: 'KB' };
  MH.cardinals = function (map) { CARD = map; };
  MH.compass = function (target, heading, marks) {
    var c = $(target); if (!c) return;
    var px = c.__px || 4; // derece başına piksel
    var tape = c.querySelector('.mh-compass__tape');
    if (!tape) {
      tape = el('div', 'mh-compass__tape');
      var h = '';
      for (var d = -360; d <= 720; d += 5) {
        var x = d * px, dd = ((d % 360) + 360) % 360;
        h += '<i class="mh-compass__tick' + (dd % 15 === 0 ? ' is-major' : '') + '" style="left:' + x + 'px"></i>';
        if (CARD[dd] != null) h += '<span class="mh-compass__lbl is-cardinal' + (dd === 0 ? ' is-north' : '') + '" style="left:' + x + 'px">' + CARD[dd] + '</span>';
        else if (dd % 15 === 0) h += '<span class="mh-compass__lbl" style="left:' + x + 'px">' + dd + '</span>';
      }
      tape.innerHTML = h + '<div class="mh-compass__marks"></div>';
      c.appendChild(tape);
      c.insertAdjacentHTML('beforeend', '<i class="mh-compass__needle"></i>');
    }
    heading = ((heading % 360) + 360) % 360;
    tape.style.transform = 'translateX(' + (-heading * px) + 'px)';
    if (marks) {
      var mk = tape.querySelector('.mh-compass__marks');
      mk.innerHTML = marks.map(function (m) {
        var b = ((m.bearing % 360) + 360) % 360;
        var rel = b - heading; if (rel > 180) b -= 360; if (rel < -180) b += 360;
        return '<span class="mh-compass__mark' + (m.tone ? ' mh-t-' + m.tone : '') + '" style="left:' + (b * px) + 'px">' + icon(m.icon || 'pin-f') + '</span>';
      }).join('');
    }
  };

  /* Hız göstergesi: ilk çağrıda kadranı çizer */
  MH.speedo = function (target, o) {
    var s = $(target); if (!s) return;
    o = o || {};
    var max = o.max || s.__max || 240;
    if (!s.__built) {
      s.__built = true; s.__max = max;
      var cx = 120, cy = 120, r = 104, a0 = 135, sweep = 270;
      var ticks = '';
      for (var v = 0; v <= max; v += 10) {
        var major = v % 40 === 0;
        var a = (a0 + sweep * v / max) * Math.PI / 180;
        var r1 = r - 12, r2 = r - (major ? 22 : 17);
        ticks += '<line class="' + (major ? '' : 'minor') + '" x1="' + (cx + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (cy + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (cx + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (cy + r2 * Math.sin(a)).toFixed(1) + '"/>';
        if (major) ticks += '<text x="' + (cx + (r - 34) * Math.cos(a)).toFixed(1) + '" y="' + (cy + (r - 34) * Math.sin(a)).toFixed(1) + '">' + v + '</text>';
      }
      var len = 2 * Math.PI * r * sweep / 360, rr = r - 9, rlen = 2 * Math.PI * rr * sweep / 360;
      s.querySelector('.mh-speedo__dial').innerHTML =
        '<circle class="mh-speedo__track" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-dasharray="' + len + ' 999" transform="rotate(' + a0 + ' ' + cx + ' ' + cy + ')"/>' +
        '<circle class="mh-speedo__redline" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-dasharray="0 ' + (len * .85) + ' ' + (len * .15) + ' 999" transform="rotate(' + a0 + ' ' + cx + ' ' + cy + ')"/>' +
        '<circle class="mh-speedo__arc" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-dasharray="' + len + ' 999" stroke-dashoffset="' + len + '" transform="rotate(' + a0 + ' ' + cx + ' ' + cy + ')"/>' +
        '<g class="mh-speedo__ticks">' + ticks + '</g>' +
        '<circle class="mh-speedo__rpm-track" cx="' + cx + '" cy="' + cy + '" r="' + (rr - 30) + '" stroke-dasharray="' + (2 * Math.PI * (rr - 30) * sweep / 360) + ' 999" transform="rotate(' + a0 + ' ' + cx + ' ' + cy + ')"/>' +
        '<circle class="mh-speedo__rpm" cx="' + cx + '" cy="' + cy + '" r="' + (rr - 30) + '" stroke-dasharray="' + (2 * Math.PI * (rr - 30) * sweep / 360) + ' 999" transform="rotate(' + a0 + ' ' + cx + ' ' + cy + ')"/>';
      s.__len = len; s.__rlen = 2 * Math.PI * (rr - 30) * sweep / 360;
    }
    if (o.speed != null) {
      s.querySelector('.mh-speedo__arc').setAttribute('stroke-dashoffset', (s.__len * (1 - clamp(o.speed / s.__max, 0, 1))).toFixed(1));
      var vEl = s.querySelector('.mh-speedo__value'); if (vEl) vEl.textContent = Math.round(o.speed);
    }
    if (o.rpm != null) s.querySelector('.mh-speedo__rpm').setAttribute('stroke-dashoffset', (s.__rlen * (1 - clamp(o.rpm, 0, 1))).toFixed(1));
    if (o.gear != null) { var g = s.querySelector('.mh-speedo__gear'); if (g) g.textContent = o.gear; }
  };

  /* Geri sayan sayaç: el = .mh-timer ya da içindeki değer düğümü */
  MH.timer = function (target, seconds, o) {
    var t = $(target); if (!t) return;
    o = o || {};
    var val = t.querySelector('.mh-timer__value') || t;
    var box = t.classList.contains('mh-timer') ? t : t.closest('.mh-timer');
    clearInterval(t.__iv);
    var end = Date.now() + seconds * 1000;
    function tick() {
      var left = (end - Date.now()) / 1000;
      val.textContent = time(left);
      if (box) box.classList.toggle('is-urgent', left <= (o.urgent == null ? 10 : o.urgent) && left > 0);
      if (left <= 0) { clearInterval(t.__iv); if (o.onEnd) o.onEnd(); }
    }
    tick(); t.__iv = setInterval(tick, 250);
    return { stop: function () { clearInterval(t.__iv); } };
  };

  /* ======================================================================
     YAYIN KIRPMA — kare (1:1), dikey (9:16), 4:5
     Yayıncı oyunun orta kısmını kırparak yayınlıyorsa HUD'u o alana sıkıştırır.
     ====================================================================== */
  var CROPS = { wide: 0, square: 1, vertical: 9 / 16, portrait: 4 / 5 };
  var PLATFORM = {  /* dikey yayında platform arayüzünün kapattığı alan (kırpma genişliğine/ekran yüksekliğine oran) */
    tiktok: { r: .16, b: .24, t: .1 }, reels: { r: .16, b: .22, t: .08 }, shorts: { r: .14, b: .2, t: .08 }, none: { r: 0, b: 0, t: 0 }
  };
  MH.crop = function (mode, o) {
    o = o || {};
    var scr = $(o.target) || $('.mh-screen'); if (!scr) return;
    function apply() {
      var W = scr.clientWidth, H = scr.clientHeight;
      var ratio = typeof mode === 'number' ? mode : CROPS[mode];
      if (!ratio || W / H <= ratio) {
        scr.removeAttribute('data-mh-crop');
        ['--mh-crop-l', '--mh-crop-r', '--mh-crop-w', '--mh-crop-pr', '--mh-crop-pb', '--mh-crop-pt'].forEach(function (k) { scr.style.removeProperty(k); });
        return { mode: 'wide', inset: 0, width: W };
      }
      var cw = Math.round(H * ratio), inset = Math.round((W - cw) / 2);
      var pf = PLATFORM[o.platform || 'none'] || PLATFORM.none;
      var vertical = ratio < .9;
      scr.setAttribute('data-mh-crop', typeof mode === 'number' ? 'custom' : mode);
      scr.style.setProperty('--mh-crop-l', inset + 'px');
      scr.style.setProperty('--mh-crop-r', inset + 'px');
      scr.style.setProperty('--mh-crop-w', cw + 'px');
      scr.style.setProperty('--mh-crop-pr', (vertical ? Math.round(cw * pf.r) : 0) + 'px');
      scr.style.setProperty('--mh-crop-pb', (vertical ? Math.round(H * pf.b) : 0) + 'px');
      scr.style.setProperty('--mh-crop-pt', (vertical ? Math.round(H * pf.t) : 0) + 'px');
      return { mode: mode, inset: inset, width: cw };
    }
    if (scr.__cropOff) scr.__cropOff();
    var res = apply();
    var onR = function () { apply(); };
    root.addEventListener('resize', onR);
    var ro = root.ResizeObserver ? new ResizeObserver(onR) : null;
    if (ro) ro.observe(scr);
    scr.__cropOff = function () { root.removeEventListener('resize', onR); if (ro) ro.disconnect(); };
    MH.cropGuide(scr, !!o.guide && res.mode !== 'wide', (typeof mode === 'number' ? mode : CROPS[mode]) < .9 ? o.platform : null);
    emit('crop', res);
    return res;
  };
  /* Kırpma kılavuzu: yayına girmeyen alanı karartır, platform arayüzünü taslak olarak gösterir */
  MH.cropGuide = function (target, on, platform) {
    var scr = $(target) || $('.mh-screen'); if (!scr) return;
    var g = scr.querySelector(':scope > .mh-crop-guide');
    if (!on) { if (g) g.remove(); return; }
    if (!g) { g = el('div', 'mh-crop-guide'); scr.appendChild(g); }
    g.innerHTML = '<i class="mh-crop-guide__frame"><span>' + esc(scr.getAttribute('data-mh-crop') === 'square' ? '1:1 yayın alanı' : 'Dikey yayın alanı') + '</span></i>' +
      (platform && platform !== 'none' ? '<i class="mh-crop-guide__ui"><b></b><b></b><b></b><b></b><em></em></i>' : '');
  };

  /* ======================================================================
     YAYINCI İSTATİSTİKLERİ
     ====================================================================== */
  /* Ekrandaki / kuyruktaki düşman sayacı: { onScreen, queued, max } */
  MH.enemies = function (target, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    var on = n.querySelector('[data-k="on"]'), q = n.querySelector('[data-k="queued"]');
    if (on && o.onScreen != null) { if (+on.textContent !== o.onScreen) bump(on); MH.count(on, o.onScreen, { duration: 250 }); }
    if (q && o.queued != null) { if (+q.textContent !== o.queued) bump(q); MH.count(q, o.queued, { duration: 250 }); }
    var bar = n.querySelector('.mh-bar');
    if (bar && o.max) MH.bar(bar, o.onScreen, { max: o.max });
    n.classList.toggle('is-swarm', o.max ? o.onScreen >= o.max * .8 : false);
  };
  function bump(node) { var b = node.closest('[data-bump]') || node; b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump'); }
  MH.bump = bump;
  /* Bir istatistik değerini günceller: <b data-stat="deaths"> */
  MH.stat = function (rootEl, key, value, o) {
    var r = $(rootEl) || doc;
    $$('[data-stat="' + key + '"]', r).forEach(function (n) {
      var prev = n.__val;
      if (typeof value === 'number') MH.count(n, value, o || { duration: 300 }); else n.textContent = value;
      n.__val = value;
      if (prev != null && prev !== value) bump(n);
    });
  };
  /* Maç geçmişi: ['W','L','W','D'] → kareler */
  MH.history = function (target, list, max) {
    var n = $(target); if (!n) return;
    list = (typeof list === 'string' ? list.split('') : list).slice(-(max || 10));
    var map = { W: ['G', 'win'], L: ['M', 'loss'], D: ['B', 'draw'] };
    n.innerHTML = list.map(function (r) { var m = map[String(r).toUpperCase()] || [r, 'draw']; return '<i class="is-' + m[1] + '">' + m[0] + '</i>'; }).join('');
  };
  /* Öldürme serisi: sayı + sönen bar */
  MH.streak = function (target, count, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    var v = n.querySelector('.mh-streak__count'); if (v) v.textContent = count;
    n.classList.toggle('mh-hidden', !count);
    n.classList.toggle('is-hot', count >= (o.hot || 5));
    bump(n);
    var bar = n.querySelector('.mh-streak__decay'); if (!bar) return;
    bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)'; void bar.offsetWidth;
    bar.style.transition = 'transform ' + (o.decay || 6000) + 'ms linear'; bar.style.transform = 'scaleX(0)';
  };

  /* ======================================================================
     GRAFİKLER (menü istatistikleri)
     ====================================================================== */
  MH.sparkline = function (target, values, o) {
    var n = $(target); if (!n || !values || !values.length) return;
    o = o || {};
    var w = o.width || 200, h = o.height || 48, pad = 3;
    var max = o.max != null ? o.max : Math.max.apply(null, values), min = o.min != null ? o.min : Math.min.apply(null, values.concat([0]));
    var span = max - min || 1, step = (w - pad * 2) / Math.max(1, values.length - 1);
    var pts = values.map(function (v, i) { return [pad + i * step, h - pad - (v - min) / span * (h - pad * 2)]; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var area = line + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + (h - pad) + ' L' + pad + ' ' + (h - pad) + ' Z';
    var last = pts[pts.length - 1];
    n.innerHTML = '<svg class="mh-spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
      (o.area !== false ? '<path class="mh-spark__area" d="' + area + '"/>' : '') + '<path class="mh-spark__line" d="' + line + '"/>' +
      '<circle class="mh-spark__dot" cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="3"/></svg>';
  };
  /* Yatay çubuk grafik: [{ label, value, icon, tone }] */
  MH.bars = function (target, rows, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    var max = o.max || Math.max.apply(null, rows.map(function (r) { return r.value; })) || 1;
    n.innerHTML = rows.map(function (r) {
      return '<div class="mh-hbar' + (r.tone ? ' mh-t-' + r.tone : '') + '">' + (r.icon ? icon(r.icon) : '') + '<span class="mh-hbar__label">' + esc(r.label) + '</span>' +
        '<span class="mh-hbar__track"><i style="transform:scaleX(' + (r.value / max).toFixed(3) + ')"></i></span><b>' + esc(o.format ? o.format(r.value) : nf(r.value)) + '</b></div>';
    }).join('');
  };
  /* Dikey sütun grafik: [{ label, value }] */
  MH.columns = function (target, rows, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    var max = o.max || Math.max.apply(null, rows.map(function (r) { return r.value; })) || 1;
    n.innerHTML = rows.map(function (r) {
      return '<div class="mh-col-bar' + (r.tone ? ' mh-t-' + r.tone : '') + '" title="' + esc(r.value) + '"><i style="transform:scaleY(' + (r.value / max).toFixed(3) + ')"></i><span>' + esc(r.label) + '</span></div>';
    }).join('');
  };

  /* ======================================================================
     BECERİ KONTROLÜ & QTE
     ====================================================================== */
  /* Dönen ibre başarı dilimine denk gelince SPACE. Promise: 'great' | 'good' | 'miss' */
  MH.skillCheck = function (target, o) {
    var n = $(target); if (!n) return Promise.resolve('miss');
    o = o || {};
    var zone = o.zone == null ? .62 + Math.random() * .25 : o.zone, size = o.size || .12, great = o.great || .035, speed = o.speed || 1.1;
    n.classList.add('mh-skill'); n.classList.remove('is-great', 'is-good', 'is-miss');
    var r = 44, c = 2 * Math.PI * r;
    n.innerHTML = '<svg viewBox="0 0 100 100"><circle class="mh-skill__track" cx="50" cy="50" r="' + r + '"/>' +
      '<circle class="mh-skill__zone" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + (c * size).toFixed(1) + ' ' + c.toFixed(1) + '" stroke-dashoffset="' + (-c * zone).toFixed(1) + '"/>' +
      '<circle class="mh-skill__great" cx="50" cy="50" r="' + r + '" stroke-dasharray="' + (c * great).toFixed(1) + ' ' + c.toFixed(1) + '" stroke-dashoffset="' + (-c * zone).toFixed(1) + '"/></svg>' +
      '<i class="mh-skill__needle"></i><span class="mh-skill__key"><span class="mh-key mh-key--lg">' + esc(o.key || 'SPACE') + '</span></span>';
    var needle = n.querySelector('.mh-skill__needle'), t0 = performance.now(), id, done = false;
    return new Promise(function (resolve) {
      function finish(res) {
        if (done) return; done = true; cancelAnimationFrame(id); doc.removeEventListener('keydown', key);
        n.classList.add('is-' + res); resolve(res);
      }
      function pos() { return ((performance.now() - t0) / 1000 * speed) % 1; }
      function key(e) { if (e.code === (o.code || 'Space')) { e.preventDefault(); hit(); } }
      function hit() { var p = pos(); finish(p >= zone && p <= zone + great ? 'great' : p >= zone && p <= zone + size ? 'good' : 'miss'); }
      (function step() {
        var p = pos();
        needle.style.transform = 'rotate(' + (p * 360) + 'deg)';
        if ((performance.now() - t0) / 1000 * speed > (o.turns || 1.15)) return finish('miss');
        id = raf(step);
      })();
      doc.addEventListener('keydown', key);
      n.__hit = hit;
    });
  };
  /* Sıralı tuş dizisi. Promise: true (tamam) / false (hata ya da süre) */
  MH.qte = function (target, keys, o) {
    var n = $(target); if (!n) return Promise.resolve(false);
    o = o || {};
    n.classList.add('mh-qte');
    n.innerHTML = keys.map(function (k) { return '<span class="mh-key mh-key--lg">' + esc(k) + '</span>'; }).join('') + '<i class="mh-qte__timer"></i>';
    var items = n.querySelectorAll('.mh-key'), i = 0, timer = n.querySelector('.mh-qte__timer');
    items[0].classList.add('is-current');
    var dur = o.duration || 4000;
    timer.style.transition = 'transform ' + dur + 'ms linear'; void timer.offsetWidth; timer.style.transform = 'scaleX(0)';
    return new Promise(function (resolve) {
      var to = setTimeout(function () { end(false); }, dur);
      function end(ok) { clearTimeout(to); doc.removeEventListener('keydown', key); n.classList.add(ok ? 'is-ok' : 'is-fail'); resolve(ok); }
      function key(e) {
        var want = String(keys[i]).toUpperCase(), got = e.key.length === 1 ? e.key.toUpperCase() : e.key.toUpperCase();
        var alias = { '↑': 'ARROWUP', '↓': 'ARROWDOWN', '←': 'ARROWLEFT', '→': 'ARROWRIGHT', 'SPACE': ' ' };
        if (got === want || got === alias[want]) {
          items[i].classList.remove('is-current'); items[i].classList.add('is-done'); i++;
          if (i >= items.length) return end(true);
          items[i].classList.add('is-current');
        } else if (o.strict !== false && /^[A-Z0-9 ]$|^ARROW/.test(got)) { items[i].classList.add('is-wrong'); end(false); }
      }
      doc.addEventListener('keydown', key);
    });
  };
  /* Daralan bölge sayacı */
  MH.zone = function (target, seconds, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    var t = n.querySelector('.mh-zone__time'), ring = n.querySelector('.mh-ring') ? n : null, total = o.total || seconds;
    clearInterval(n.__iv);
    var end = Date.now() + seconds * 1000;
    function tick() {
      var left = Math.max(0, (end - Date.now()) / 1000);
      if (t) t.textContent = time(left);
      if (ring) MH.ring(n.querySelector('.mh-zone__ring') || n, left / total);
      n.classList.toggle('is-closing', left <= (o.warn || 15));
      if (left <= 0) { clearInterval(n.__iv); if (o.onEnd) o.onEnd(); }
    }
    tick(); n.__iv = setInterval(tick, 250);
    return { stop: function () { clearInterval(n.__iv); } };
  };

  /* ======================================================================
     BASKI NESNELERİ (Eski Batı)
     ====================================================================== */
  MH.posterHTML = function (o) {
    o = o || {};
    return '<div class="mh-paper mh-poster"' + (o.tilt != null ? ' style="--tilt:' + o.tilt + 'deg"' : '') + '>' +
      '<div class="mh-poster__title">' + esc(o.title || 'Aranıyor') + '</div>' +
      '<div class="mh-poster__rule">' + esc(o.sub || 'Ölü ya da diri') + '</div>' +
      '<div class="mh-poster__photo">' + (o.photo ? '<img src="' + esc(o.photo) + '" alt="">' : icon(o.icon || 'cowboy')) + '</div>' +
      '<div class="mh-poster__name">' + esc(o.name || '') + '</div>' +
      (o.crime ? '<div class="mh-poster__crime">' + esc(o.crime) + '</div>' : '') +
      '<div class="mh-poster__reward"><b>' + esc(o.reward || '$100') + '</b><span>' + esc(o.rewardLabel || 'Ödül') + '</span></div>' +
      (o.fine ? '<div class="mh-poster__fine">' + esc(o.fine) + '</div>' : '') +
      (o.stamp ? '<span class="mh-stamp is-in">' + esc(o.stamp) + '</span>' : '') + '</div>';
  };
  MH.poster = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="poster"]', 'mh-anchor mh-mc');
    box.innerHTML = MH.posterHTML(o);
    var p = box.firstChild; p.classList.add('mh-enter-pop');
    if (o.duration !== 0) setTimeout(function () { remove(p); }, o.duration || 5000);
    return p;
  };
  MH.stamp = function (target, text, o) {
    var n = $(target); if (!n) return;
    o = o || {};
    var s = el('span', 'mh-stamp is-in' + (o.tone ? ' mh-t-' + o.tone : '') + (o.round ? ' mh-stamp--round' : ''), esc(text));
    if (o.tilt != null) s.style.setProperty('--tilt', o.tilt + 'deg');
    if (o.position === false) { n.appendChild(s); return s; }
    var pin = el('span', 'mh-stamp-pin'); pin.style.left = o.x || '50%'; pin.style.top = o.y || '45%';
    pin.appendChild(s); n.appendChild(pin);
    return s;
  };
  MH.telegram = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="telegram"]', 'mh-anchor mh-tc');
    if (!o.target && !box.style.top) box.style.top = '19%';
    box.innerHTML = '';
    var body = esc(o.text || '').replace(/\s*\bSTOP\b\s*/gi, '<span class="stop">STOP</span>');
    var t = el('div', 'mh-paper mh-telegram is-in' + (o.stamp ? ' has-stamp' : ''));
    t.innerHTML = '<div class="mh-telegram__head"><span class="mh-telegram__brand">' + esc(o.brand || 'Telgraf') + '</span><span class="mh-telegram__no">No. ' + esc(o.no || Math.floor(1000 + Math.random() * 8999)) + '</span></div>' +
      '<div class="mh-telegram__meta"><span>Kimden</span><b>' + esc(o.from || '—') + '</b><span>Kime</span><b>' + esc(o.to || '—') + '</b></div>' +
      '<div class="mh-telegram__body">' + body + '</div>' + (o.stamp ? '<span class="mh-stamp">' + esc(o.stamp) + '</span>' : '');
    box.appendChild(t);
    if (o.duration !== 0) setTimeout(function () { remove(t); }, o.duration || 7000);
    return t;
  };
  MH.headline = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="headline"]', 'mh-anchor mh-mc');
    box.innerHTML = '';
    var h = el('div', 'mh-paper mh-headline is-in');
    h.innerHTML = '<div class="mh-headline__mast">' + esc(o.mast || 'Sınır Boyu Gazetesi') + '</div>' +
      '<div class="mh-headline__dateline"><span>' + esc(o.date || '') + '</span><span>' + esc(o.price || '5 Sent') + '</span></div>' +
      '<div class="mh-headline__title">' + esc(o.title || '') + '</div>' + (o.deck ? '<div class="mh-headline__deck">' + esc(o.deck) + '</div>' : '') +
      (o.body ? '<div class="mh-headline__cols"><div>' + (o.icon ? '<div class="mh-headline__cut">' + icon(o.icon) + '</div>' : '') + '<p>' + esc(o.body[0] || '') + '</p></div><div><p>' + esc(o.body[1] || '') + '</p></div></div>' : '');
    box.appendChild(h);
    if (o.duration !== 0) setTimeout(function () { remove(h); }, o.duration || 6500);
    return h;
  };
  MH.sign = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="sign"]', 'mh-anchor mh-tc');
    if (!o.target && !box.style.top) box.style.top = '9%';
    box.innerHTML = '';
    var s = el('div', 'mh-sign is-in', (o.kicker ? '<span>' + esc(o.kicker) + '</span>' : '') + '<b>' + esc(o.title || '') + '</b>' + (o.sub ? '<small>' + esc(o.sub) + '</small>' : ''));
    box.appendChild(s);
    if (o.duration !== 0) setTimeout(function () { remove(s); }, o.duration || 4200);
    return s;
  };

  /* ======================================================================
     GANİMET, SOSYAL, HAYATTA KALMA
     ====================================================================== */
  MH.loot = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="loot"]', 'mh-anchor mh-bc');
    if (!o.target && !box.style.bottom) box.style.bottom = '220px';
    var c = el('div', 'mh-loot is-' + (o.tier || 'rare') + ' mh-enter-up');
    c.innerHTML = '<div class="mh-loot__art">' + art(o.art || ('i:' + (o.icon || 'chest'))) + '</div><div class="mh-loot__body"><span class="mh-loot__tier">' + esc(o.tierLabel || ({ common: 'Sıradan', rare: 'Nadir', epic: 'Destansı', legendary: 'Efsanevi' }[o.tier || 'rare'])) + '</span>' +
      '<b>' + esc(o.name || '') + '</b>' + (o.desc ? '<span>' + esc(o.desc) + '</span>' : '') + '</div>' + (o.amount ? '<em>×' + esc(o.amount) + '</em>' : '');
    box.appendChild(c);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    if (o.duration !== 0) setTimeout(function () { remove(c); }, o.duration || 3800);
    return c;
  };
  /* Kısa sosyal olay: katıldı / takip etti / paylaştı */
  MH.social = function (o) {
    o = o || {};
    var list = $(o.target) || host('[data-mh="social"]', 'mh-social');
    var kinds = { join: ['user-plus', 'katıldı', 'info'], follow: ['follow', 'takip etti', 'danger'], share: ['share', 'paylaştı', 'success'], like: ['heart', 'beğendi', 'danger'], sub: ['star', 'abone oldu', 'gold'] };
    var k = kinds[o.kind || 'join'] || kinds.join;
    var n = el('div', 'mh-social__item mh-t-' + (o.tone || k[2]) + ' mh-enter-left');
    n.innerHTML = icon(o.icon || k[0]) + '<b>' + esc(o.name || '') + '</b><span>' + esc(o.text || k[1]) + '</span>';
    list.insertBefore(n, list.firstChild);
    while (list.children.length > (o.max || 5)) list.removeChild(list.lastChild);
    setTimeout(function () { remove(n, 'mh-leave-left'); }, o.duration || 4000);
    return n;
  };
  /* L4D tarzı özel düşman uyarısı */
  MH.infected = function (o) {
    o = o || {};
    var box = $(o.target) || center('[data-mh="infected"]', 'mh-anchor mh-tc');
    if (!o.target && !box.style.top) box.style.top = '18%';
    var a = el('div', 'mh-infected' + (o.boss ? ' is-boss' : '') + ' mh-enter-pop');
    a.innerHTML = '<span class="mh-infected__icon">' + icon(o.icon || 'biohazard') + '</span><div><span class="mh-kicker">' + esc(o.kicker || (o.boss ? 'Tehlike' : 'Özel düşman')) + '</span><b>' + esc(o.name || '') + '</b></div>' +
      (o.hint ? '<small>' + esc(o.hint) + '</small>' : '');
    box.appendChild(a);
    while (box.children.length > 3) box.removeChild(box.firstChild);
    setTimeout(function () { remove(a); }, o.duration || 3600);
    return a;
  };
  MH.horde = function (o) {
    o = o || {};
    var scr = $(o.target) || $('.mh-screen') || doc.body;
    var old = scr.querySelector(':scope > .mh-horde'); if (old) old.remove();
    var h = el('div', 'mh-horde');
    h.innerHTML = '<div class="mh-horde__drums"><i></i><i></i><i></i><i></i><i></i></div><b>' + esc(o.title || 'Sürü geliyor!') + '</b><span>' + esc(o.sub || '') + '</span>';
    scr.appendChild(h);
    setTimeout(function () { remove(h); }, o.duration || 4200);
    return h;
  };

  /* ======================================================================
     WEBSOCKET KÖPRÜSÜ — OBS tarayıcı kaynağı, harici overlay, HTML5 oyunlar
     Mesaj biçimi NUI ile aynıdır: { action, data } ya da { action:'mhud', fn, args }
     ====================================================================== */
  MH.connect = function (url, o) {
    o = o || {};
    var ws, wait = o.retry || 1500, closed = false;
    function open() {
      try { ws = new WebSocket(url); } catch (e) { return retry(); }
      ws.onopen = function () { emit('socket:open', url); if (o.hello !== false) send({ action: 'hello', data: { client: 'mhud', version: MH.version } }); };
      ws.onmessage = function (e) { var d; try { d = JSON.parse(e.data); } catch (x) { return; } route(d); };
      ws.onclose = function () { emit('socket:close', url); retry(); };
      ws.onerror = function () { try { ws.close(); } catch (x) {} };
    }
    function retry() { if (!closed) setTimeout(open, wait); }
    function send(d) { if (ws && ws.readyState === 1) ws.send(JSON.stringify(d)); }
    open();
    MH.post = function (name, data) { send({ action: name, data: data || {} }); return Promise.resolve({ ok: true }); };
    return { send: send, close: function () { closed = true; if (ws) ws.close(); } };
  };

  /* ======================================================================
     Klasik menü / liste klavye kontrolü
     ====================================================================== */
  MH.listNav = function (target, o) {
    var list = $(target); if (!list) return;
    o = o || {};
    var sel = o.item || '.mh-classic__item, .mh-row';
    function items() { return $$(sel, list).filter(function (x) { return !x.classList.contains('is-disabled'); }); }
    function idx() { return items().indexOf(list.querySelector(sel.split(',').map(function (s) { return s.trim() + '.is-active'; }).join(','))); }
    function go(i) {
      var arr = items(); if (!arr.length) return;
      i = (i + arr.length) % arr.length;
      arr.forEach(function (x, k) { x.classList.toggle('is-active', k === i); });
      arr[i].scrollIntoView({ block: 'nearest' });
      if (o.onChange) o.onChange(arr[i], i);
    }
    function step(dir) {
      var a = items()[idx()]; if (!a) return;
      var st = a.querySelector('[data-mh-stepper]');
      if (st) st.__step(dir);
    }
    function key(e) {
      if (o.active && !o.active()) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); go(idx() + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); go(idx() - 1); }
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Enter') { var a = items()[idx()]; if (a && o.onSelect) o.onSelect(a); if (a) a.click(); }
      else if (e.key === 'Backspace' || e.key === 'Escape') { if (o.onBack) o.onBack(); }
    }
    doc.addEventListener('keydown', key);
    list.addEventListener('mousemove', function (e) {
      var it = e.target.closest(sel); if (!it || it.classList.contains('is-active') || it.classList.contains('is-disabled')) return;
      go(items().indexOf(it));
    });
    if (idx() < 0) go(0);
    return { go: go, destroy: function () { doc.removeEventListener('keydown', key); } };
  };

  /* ======================================================================
     Bildirimsel parçalar: MH.mount(kök)
     ====================================================================== */
  MH.mount = function (rootEl) {
    var r = $(rootEl) || doc;
    // ikonlar: <i data-i="heart"></i>  •  silah: <i data-weapon="carbine"></i>
    $$('i[data-i]', r).forEach(function (n) {
      var tmp = el('span', null, icon(n.getAttribute('data-i'), n.className));
      n.parentNode.replaceChild(tmp.firstChild, n);
    });
    $$('i[data-weapon]', r).forEach(function (n) {
      var tmp = el('span', null, weapon(n.getAttribute('data-weapon'), n.className));
      n.parentNode.replaceChild(tmp.firstChild, n);
    });
    // halkalar: data-mh-ring (isteğe bağlı data-r)
    $$('[data-mh-ring]', r).forEach(function (n) {
      if (n.querySelector(':scope > .mh-ring')) return;
      n.insertAdjacentHTML('afterbegin', ringSvg(n.getAttribute('data-r') ? +n.getAttribute('data-r') : null));
    });
    // bar başlangıç değerleri: data-v="64"
    $$('.mh-bar[data-v]', r).forEach(function (b) { MH.bar(b, +b.getAttribute('data-v'), { max: +(b.getAttribute('data-max') || 100) }); });
    // segmentler: data-pips="4/10"
    $$('[data-pips]', r).forEach(function (p) { var a = p.getAttribute('data-pips').split('/'); MH.pips(p, +a[0], +a[1]); });
    // pusula: data-heading="75" (isteğe bağlı data-marks='[{"bearing":120,"icon":"pin-f","tone":"accent"}]')
    $$('.mh-compass[data-heading]', r).forEach(function (c) { var m = c.getAttribute('data-marks'); MH.compass(c, +c.getAttribute('data-heading'), m ? JSON.parse(m) : null); });
    // hız göstergesi: data-speed, data-max, data-rpm (0-1), data-gear
    $$('.mh-speedo[data-speed]', r).forEach(function (n) { MH.speedo(n, { speed: +n.getAttribute('data-speed'), max: +(n.getAttribute('data-max') || 240), rpm: +(n.getAttribute('data-rpm') || 0), gear: n.getAttribute('data-gear') }); });
    // sekmeler: <div class="mh-tabs" data-mh-tabs="grup"> + [data-tab-panel="grup:ad"]
    $$('[data-mh-tabs]', r).forEach(function (tabs) {
      if (tabs.__mh) return; tabs.__mh = 1;
      var group = tabs.getAttribute('data-mh-tabs');
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        $$('button', tabs).forEach(function (x) { x.classList.toggle('is-active', x === b); });
        var name = b.getAttribute('data-tab');
        if (group) $$('[data-tab-panel^="' + group + ':"]').forEach(function (p) { p.classList.toggle('mh-hidden', p.getAttribute('data-tab-panel') !== group + ':' + name); });
        emit('tab', { group: group, tab: name });
      });
    });
    // segment & çip grupları: data-mh-seg
    $$('[data-mh-seg]', r).forEach(function (g) {
      if (g.__mh) return; g.__mh = 1;
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b || !g.contains(b)) return;
        $$('button', g).forEach(function (x) { x.classList.toggle('is-active', x === b); });
        emit('seg', { group: g.getAttribute('data-mh-seg'), value: b.getAttribute('data-value') || b.textContent.trim() });
      });
    });
    // değer seçici: <div class="mh-stepper" data-mh-stepper="Kolay|Normal|Zor" data-index="1">
    $$('[data-mh-stepper]', r).forEach(function (s) {
      if (s.__mh) return; s.__mh = 1;
      var opts = s.getAttribute('data-mh-stepper').split('|'), i = +(s.getAttribute('data-index') || 0);
      s.innerHTML = '<button class="mh-catch" data-d="-1" aria-label="Önceki">' + icon('chev-l') + '</button><span class="mh-stepper__value"></span><button class="mh-catch" data-d="1" aria-label="Sonraki">' + icon('chev-r') + '</button>';
      var out = s.querySelector('.mh-stepper__value');
      function paint() { out.textContent = opts[i]; s.setAttribute('data-index', i); }
      s.__step = function (d) { i = (i + d + opts.length) % opts.length; paint(); emit('stepper', { el: s, index: i, value: opts[i] }); };
      s.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) { e.stopPropagation(); s.__step(+b.getAttribute('data-d')); } });
      paint();
    });
    // seçenek kartları: .mh-optcard > input (radio/checkbox) → is-active
    $$('.mh-optcard > input', r).forEach(function (inp) {
      if (inp.__mh) return; inp.__mh = 1;
      function sync() { var scope = inp.name ? $$('.mh-optcard > input[name="' + inp.name + '"]', inp.closest('form, .mh-modal, .mh-menu') || doc) : [inp]; scope.forEach(function (x) { x.parentNode.classList.toggle('is-active', x.checked); }); }
      inp.addEventListener('change', sync); if (inp.checked) sync();
    });
    // kaydırıcılar: dolgu rengi + bağlı çıktı (data-out="#id")
    $$('.mh-slider', r).forEach(function (s) {
      if (s.__mh) return; s.__mh = 1;
      function paint() {
        var p = (s.value - (s.min || 0)) / ((s.max || 100) - (s.min || 0)) * 100;
        s.style.setProperty('--v', p + '%');
        var o = s.getAttribute('data-out'); if (o && $(o)) $(o).textContent = s.value + (s.getAttribute('data-unit') || '');
      }
      s.addEventListener('input', paint); paint();
    });
    // grafik & geçmiş: data-spark="3,5,2,8"  data-history="WWLWD"
    $$('[data-spark]', r).forEach(function (n) { MH.sparkline(n, n.getAttribute('data-spark').split(',').map(Number), { width: +(n.getAttribute('data-w') || 200), height: +(n.getAttribute('data-h') || 48) }); });
    $$('[data-history]', r).forEach(function (n) { MH.history(n, n.getAttribute('data-history')); });
    if (root.MH_ICON_SPRITE) root.MH_ICON_SPRITE();
    return r;
  };

  /* ======================================================================
     Olaylar & NUI köprüsü
     ====================================================================== */
  var handlers = {};
  function emit(name, data) { (handlers[name] || []).forEach(function (fn) { try { fn(data); } catch (e) { console.error('[MHud]', name, e); } }); }
  MH.on = function (name, fn) { (handlers[name] = handlers[name] || []).push(fn); return MH; };
  MH.off = function (name, fn) { handlers[name] = (handlers[name] || []).filter(function (f) { return f !== fn; }); };
  MH.emit = emit;

  MH.isNui = typeof root.GetParentResourceName === 'function';
  MH.resource = MH.isNui ? root.GetParentResourceName() : 'mhud';
  MH.post = function (name, data) {
    if (!MH.isNui) { if (MH.debug) console.log('[MHud] post', name, data); return Promise.resolve({ ok: true, dev: true }); }
    return fetch('https://' + MH.resource + '/' + name, {
      method: 'POST', headers: { 'Content-Type': 'application/json; charset=UTF-8' }, body: JSON.stringify(data || {})
    }).then(function (r) { return r.json().catch(function () { return {}; }); });
  };

  /* Lua'dan genel çağrı: SendNUIMessage({ action = 'mhud', fn = 'toast', args = { {...} } })
     Yalnızca bu listedeki fonksiyonlar çağrılabilir. */
  MH.rpcAllow = ['theme', 'accent', 'bar', 'ring', 'core', 'pips', 'count', 'money', 'toast', 'kill', 'gift', 'announce', 'banner',
    'levelUp', 'achievement', 'pickup', 'countdown', 'subtitle', 'progress', 'hit', 'damageFrom', 'flash', 'vignette', 'compass', 'speedo', 'timer',
    'crop', 'enemies', 'stat', 'history', 'streak', 'poster', 'stamp', 'telegram', 'headline', 'sign', 'loot', 'social', 'infected', 'horde', 'zone'];
  function route(d) {
    if (!d || typeof d !== 'object') return;
    var action = d.action || d.type;
    if (action === 'mhud' && d.fn && MH.rpcAllow.indexOf(d.fn) >= 0) {
      try { MH[d.fn].apply(MH, d.args || []); } catch (err) { console.error('[MHud] rpc', d.fn, err); }
      return;
    }
    if (action) emit(action, d.data !== undefined ? d.data : d);
  }
  MH.route = route;   // harici kaynaklardan gelen mesajı elle yönlendirmek için
  root.addEventListener('message', function (e) { route(e.data); });

  /* ESC ile odak bırakma — NUI menüleri için (MH.escClose = 'closeMenu') */
  doc.addEventListener('keyup', function (e) {
    if (e.key === 'Escape' && MH.escClose && !modalStack.length && Date.now() - modalEscAt > 400) { emit('escape'); MH.post(MH.escClose, {}); }
  });

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { MH.mount(); });
  else MH.mount();

  root.MH = MH;
})(window);
