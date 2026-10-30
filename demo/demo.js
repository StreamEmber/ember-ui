/* MHud sunum kabuğu — yalnızca tarayıcı önizlemesi. Oyuna taşınmaz.
   Menü, üst çubuk, görünüm paneli ve içindekiler tools/build-site.mjs ile statik yazılır;
   bu dosya yalnız davranış ekler: vurgu/sahne durumu, arama, çekmeceler, içindekiler takibi, sahne ölçekleme. */
(function () {
  'use strict';

  var script = document.currentScript;
  var BASE = script.getAttribute('src').replace(/demo\/demo\.js.*$/, '');   // '' veya '../'

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem('mhud-demo:' + k); localStorage.setItem('mhud-demo:' + k, v); } catch (e) { return null; }
  }
  function each(sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); }
  function wide() { return !matchMedia('(max-width: 1440px)').matches; }

  var params = new URLSearchParams(location.search);
  var DEFAULTS = { accent: '', scene: 'city', cols: 'auto', code: '0', aside: '1' };
  var state = {};
  Object.keys(DEFAULTS).forEach(function (k) {
    var v = params.get(k); if (v == null) v = store(k); if (v == null) v = DEFAULTS[k];
    state[k] = v;
  });

  function SCENE_OK(id) { return !!document.querySelector('.demo-scene-btn[data-scene="' + id + '"]') || !document.querySelector('.demo-scene-btn'); }
  function sceneUrl(id) { return id === 'none' ? 'none' : "url('" + BASE + 'demo/scenes/' + id + ".svg')"; }

  function apply() {
    if (!SCENE_OK(state.scene)) state.scene = DEFAULTS.scene;
    var b = document.body;
    if (state.accent) b.setAttribute('data-mh-accent', state.accent); else b.removeAttribute('data-mh-accent');
    if (state.cols !== 'auto') b.setAttribute('data-demo-cols', state.cols); else b.removeAttribute('data-demo-cols');
    b.classList.toggle('demo-noaside', state.aside === '0');
    document.documentElement.style.setProperty('--demo-scene', sceneUrl(state.scene));
    each('.demo-accent', function (n) { n.classList.toggle('is-active', n.getAttribute('data-accent') === state.accent); });
    each('.demo-scene-btn', function (n) { n.classList.toggle('is-active', n.getAttribute('data-scene') === state.scene); });
    each('[data-demo-cols-btn]', function (n) { n.classList.toggle('is-active', n.getAttribute('data-demo-cols-btn') === state.cols); });
    each('[data-demo-opt="code"]', function (n) { n.classList.toggle('is-on', state.code === '1'); });
    each('[data-demo-aside]', function (n) { n.classList.toggle('is-on', state.aside !== '0'); });
    each('details.demo-src', function (d) { d.open = state.code === '1'; });
    var lbl = document.getElementById('demo-scene-now');
    var sb = document.querySelector('.demo-scene-btn[data-scene="' + state.scene + '"]');
    if (lbl && sb) lbl.textContent = sb.title;
    window.dispatchEvent(new CustomEvent('demo:change', { detail: state }));
  }
  function set(k, v) { state[k] = v; store(k, v); apply(); }
  function closeDrawers() { document.body.classList.remove('demo-aside-open', 'demo-side-open'); }
  function flash(el, text) { var old = el.textContent; el.textContent = text; setTimeout(function () { el.textContent = old; }, 1300); }

  /* ---------- Sol menü: katlanan bölümler, arama ---------- */
  function initSide() {
    var side = document.querySelector('.demo-side'); if (!side) return;
    // kayıtlı kapalı bölümler ilk çizimde animasyonsuz kapanır
    each('.demo-sec', function (s) {
      if (store('sec:' + s.getAttribute('data-sec')) !== '0' || s.querySelector('.is-active')) return;
      s.classList.add('is-closed', 'is-static');
      s.querySelector('.demo-sec__head').setAttribute('aria-expanded', 'false');
      requestAnimationFrame(function () { requestAnimationFrame(function () { s.classList.remove('is-static'); }); });
    });
    side.addEventListener('click', function (e) {
      var head = e.target.closest('.demo-sec__head'); if (!head) return;
      var sec = head.parentNode; sec.classList.toggle('is-closed');
      head.setAttribute('aria-expanded', !sec.classList.contains('is-closed'));
      store('sec:' + sec.getAttribute('data-sec'), sec.classList.contains('is-closed') ? '0' : '1');
    });
    var input = side.querySelector('.demo-search input');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLocaleLowerCase('tr');
      side.classList.toggle('is-searching', !!q);
      each('.demo-side .demo-nav a', function (a) { a.classList.toggle('is-hidden', !!q && a.getAttribute('data-q').indexOf(q) < 0); });
      each('.demo-side .demo-group', function (g) { g.classList.toggle('is-hidden', !!q && !g.querySelector('a:not(.is-hidden)')); });
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { var a = side.querySelector('.demo-sec__body a:not(.is-hidden)'); if (a) location.href = a.href; }
      if (e.key === 'Escape') { input.value = ''; input.dispatchEvent(new Event('input')); input.blur(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '')) { e.preventDefault(); input.focus(); }
    });
    var act = side.querySelector('a.is-active'); if (act && act.scrollIntoView) act.scrollIntoView({ block: 'center' });
  }

  /* ---------- Tıklamalar: görünüm paneli, çekmeceler, katalog kartları ---------- */
  function initClicks() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('.demo-accent'); if (a) return set('accent', a.getAttribute('data-accent'));
      var s = e.target.closest('.demo-scene-btn'); if (s) return set('scene', s.getAttribute('data-scene'));
      var c = e.target.closest('[data-demo-cols-btn]'); if (c) return set('cols', c.getAttribute('data-demo-cols-btn'));
      if (e.target.closest('[data-demo-opt="code"]')) return set('code', state.code === '1' ? '0' : '1');
      if (e.target.closest('[data-demo-close]')) { if (wide()) set('aside', '0'); else closeDrawers(); return; }
      if (e.target.closest('[data-demo-aside]')) { if (wide()) set('aside', state.aside === '0' ? '1' : '0'); else document.body.classList.toggle('demo-aside-open'); return; }
      if (e.target.closest('[data-demo-toggle="side"]')) return document.body.classList.toggle('demo-side-open');
      if (e.target.closest('.demo-veil, .demo-toc a')) closeDrawers();
      var run = e.target.closest('[data-demo-run]');
      if (run) { try { new Function(run.closest('.demo-spec').querySelector('.demo-code').textContent)(); } catch (err) { console.error(err); } return; }
      var cp = e.target.closest('[data-demo-copy]');
      if (cp && navigator.clipboard) {
        navigator.clipboard.writeText(cp.closest('.demo-src__box').querySelector('.demo-code').textContent).then(function () { flash(cp.querySelector('span'), 'Kopyalandı'); });
        return;
      }
      var d = e.target.closest('[data-demo-do]'); if (!d) return;
      var what = d.getAttribute('data-demo-do');
      if (what === 'shuffle') Demo.shuffle();
      if (what === 'reset') { Object.keys(DEFAULTS).forEach(function (k) { if (k !== 'aside') { state[k] = DEFAULTS[k]; store(k, DEFAULTS[k]); } }); apply(); }
      if (what === 'link') {
        var u = new URL(location.href.split('#')[0]);
        ['accent', 'scene'].forEach(function (k) { if (state[k] !== DEFAULTS[k]) u.searchParams.set(k, state[k]); else u.searchParams.delete(k); });
        if (navigator.clipboard) navigator.clipboard.writeText(u.toString()).then(function () { flash(d.querySelector('span'), 'Kopyalandı'); }, function () { prompt('Bağlantı', u.toString()); });
        else prompt('Bağlantı', u.toString());
      }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawers(); });
  }

  /* ---------- İçindekiler: görünen bölümü işaretle ---------- */
  function initToc() {
    var links = document.querySelectorAll('.demo-toc a');
    if (!links.length || !window.IntersectionObserver) return;
    var targets = [], vis = {};
    Array.prototype.forEach.call(links, function (a) { var el = document.getElementById(a.getAttribute('href').slice(1)); if (el) targets.push({ el: el, a: a }); });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { vis[en.target.id] = en.isIntersecting; });
      var first = targets.filter(function (t) { return vis[t.el.id]; })[0];
      if (first) targets.forEach(function (t) { t.a.classList.toggle('is-active', t === first); });
    }, { rootMargin: '-60px 0px -55% 0px' });
    targets.forEach(function (t) { io.observe(t.el); });
  }

  /* ---------- Sahneler: 1920×1080 tuvali kutuya sığdır ---------- */
  function buildStages() {
    each('.demo-stage', function (stage) {
      if (stage.__demo) return; stage.__demo = 1;
      var canvas = document.createElement('div');
      canvas.className = 'demo-canvas';
      var w = +(stage.getAttribute('data-w') || 1920), h = +(stage.getAttribute('data-h') || 1080);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      if (!stage.hasAttribute('data-no-scene')) canvas.innerHTML = '<div class="demo-scene"></div>';
      while (stage.firstChild) canvas.appendChild(stage.firstChild);
      stage.appendChild(canvas);
      if (!stage.hasAttribute('data-no-badge')) stage.insertAdjacentHTML('beforeend', '<span class="demo-stage__badge">' + w + '×' + h + '</span>');
      stage.style.aspectRatio = w + ' / ' + h;
      function fit() { canvas.style.transform = 'scale(' + (stage.clientWidth / w) + ')'; }
      fit();
      if (window.ResizeObserver) new ResizeObserver(fit).observe(stage); else window.addEventListener('resize', fit);
    });
  }

  var rnd = Math.random;
  window.Demo = {
    state: state,
    set: set,
    base: BASE,
    fullscreen: function (sel) {
      var s = typeof sel === 'string' ? document.querySelector(sel) : sel;
      if (!document.fullscreenElement) s.requestFullscreen && s.requestFullscreen(); else document.exitFullscreen();
    },
    every: function (ms, fn) { fn(); return setInterval(fn, ms); },
    rand: function (a, b) { return a + Math.random() * (b - a); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    on: function (sel, fn) { each(sel, function (n) { n.addEventListener('click', fn); }); },
    // Sayfadaki ölçerlere rastgele değer ver (her sayfada çalışır)
    shuffle: function () {
      if (!window.MH) return;
      each('.demo-main .mh-bar[data-v]', function (b) { MH.bar(b, rnd() * 100); });
      each('.demo-main .mh-ringval', function (n) { var v = rnd(); MH.ring(n, v); var t = n.querySelector('b'); if (t) t.textContent = Math.round(v * 100); });
      each('.demo-main .mh-core', function (n) { MH.core(n, { value: rnd() * 100, core: rnd() * 100 }); });
      each('.demo-main .mh-compass', function (n) { MH.compass(n, rnd() * 360); });
      each('.demo-main .mh-wayarrow', function (n) { n.style.setProperty('--a', Math.round(rnd() * 360) + 'deg'); });
      each('.demo-main .mh-speedo', function (n) { MH.speedo(n, { speed: rnd() * 240, rpm: rnd(), gear: 1 + Math.floor(rnd() * 6) }); });
      each('.demo-main [data-pips]', function (n) { var t = n.children.length; MH.pips(n, Math.round(rnd() * t), t); });
    }
  };

  function boot() {
    document.body.classList.add('demo');
    initSide();
    initClicks();
    buildStages();
    initToc();
    apply();
    if (window.MH) MH.mount();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
