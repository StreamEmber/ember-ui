/* MHud demo kabuğu — yalnızca tarayıcı önizlemesi. Oyuna taşınmaz. */
(function () {
  'use strict';

  var script = document.currentScript;
  var BASE = script.getAttribute('src').replace(/demo\/demo\.js.*$/, '');   // '' veya '../'

  var PAGES = [
    { group: 'Sunumlar', items: [
      { href: 'pages/components.html', label: 'Temel bileşenler', icon: 'layers' }
    ]},
    { group: 'Ölçerler', items: [
      { href: 'pages/vitals.html', label: 'Yaşam göstergeleri', icon: 'stats' },
      { href: 'pages/bars.html', label: 'Barlar', icon: 'gauge' }
    ]},
    { group: 'Oyun içi HUD', items: [
      { href: 'pages/hud.html', label: 'Oyuncu HUD', icon: 'heart' },
      { href: 'pages/vehicle.html', label: 'Araç & binek', icon: 'steering' },
      { href: 'pages/combat.html', label: 'Çatışma', icon: 'crosshair' },
      { href: 'pages/mode.html', label: 'Oyun modu', icon: 'flag' },
      { href: 'pages/world.html', label: 'Dünya katmanı', icon: 'pin' },
      { href: 'pages/tags.html', label: 'İsim etiketleri', icon: 'tag' }
    ]},
    { group: 'Yayın & oyunlar', items: [
      { href: 'pages/broadcast.html', label: 'Yayın düzeni (kare/dikey)', icon: 'phone' },
      { href: 'pages/western.html', label: 'Eski Batı', icon: 'hat' }
    ]},
    { group: 'Akışlar', items: [
      { href: 'pages/notifications.html', label: 'Bildirimler', icon: 'bell' },
      { href: 'pages/stream.html', label: 'Yayın & hediyeler', icon: 'gift' }
    ]},
    { group: 'Arayüz', items: [
      { href: 'pages/menus.html', label: 'Menüler', icon: 'list' },
      { href: 'pages/social.html', label: 'Ekip & kanallar', icon: 'crew' },
      { href: 'pages/interaction.html', label: 'Etkileşim', icon: 'pointer' },
      { href: 'pages/screens.html', label: 'Tam ekranlar', icon: 'focus' },
      { href: 'pages/parts.html', label: 'Diğer parçalar', icon: 'box' }
    ]}
  ];
  // build-catalog bu satırı aile listesiyle değiştirir (galeri sitesinde)
  var CATALOG = [];
  if (CATALOG.length) PAGES.unshift({ group: 'Bileşen kataloğu', items: [{ href: 'index.html', label: 'Tüm aileler', icon: 'grid' }].concat(CATALOG) });
  var THEMES = [
    { id: 'modern',   label: 'Modern',   note: 'GTA V',  sw: 'linear-gradient(135deg,#0d1117 45%,#f5b83d 45%)', scene: 'city' },
    { id: 'tactical', label: 'Tactical', note: 'Askeri', sw: 'linear-gradient(135deg,#0e110c 45%,#c4f052 45%)', scene: 'forest' },
    { id: 'frontier', label: 'Frontier', note: 'RDR2',   sw: 'linear-gradient(135deg,#110d09 45%,#cdaa69 45% 72%,#f1e6cf 72%)', scene: 'desert' },
    { id: 'oldwest',  label: 'Old West', note: 'Eski Batı', sw: 'linear-gradient(135deg,#e6d6b4 45%,#8e2b1e 45% 72%,#2b1d10 72%)', scene: 'town' }
  ];
  var ACCENTS = [
    { id: '', c: null }, { id: 'amber', c: '#f5b83d' }, { id: 'crimson', c: '#ff4858' }, { id: 'mint', c: '#46de96' },
    { id: 'ice', c: '#50aaff' }, { id: 'violet', c: '#a878ff' }, { id: 'rose', c: '#ff5caa' }, { id: 'cyan', c: '#3ee8ff' },
    { id: 'lime', c: '#c4f052' }, { id: 'gold', c: '#cdaa69' }, { id: 'tiktok', c: '#fe2c55' }
  ];
  var SCENES = ['city', 'night', 'desert', 'town', 'forest', 'bright', 'none'];
  var SCENE_LABEL = { city: 'Şehir', night: 'Gece', desert: 'Çöl', town: 'Kasaba', forest: 'Orman', bright: 'Gündüz', none: 'Düz' };

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem('mhud-demo:' + k); localStorage.setItem('mhud-demo:' + k, v); } catch (e) { return null; }
  }
  var params = new URLSearchParams(location.search);
  var state = {
    theme: params.get('theme') || store('theme') || 'modern',
    accent: params.get('accent') != null ? params.get('accent') : (store('accent') || ''),
    scene: params.get('scene') || store('scene') || 'auto'
  };

  if (!THEMES.some(function (t) { return t.id === state.theme; })) state.theme = 'modern';
  function sceneUrl(id) {
    if (id === 'none') return 'none';
    return 'url("' + BASE + 'demo/scenes/' + id + '.svg")';
  }
  function currentScene() {
    if (state.scene !== 'auto') return state.scene;
    var t = THEMES.filter(function (x) { return x.id === state.theme; })[0];
    return t ? t.scene : 'city';
  }
  function apply() {
    var b = document.body;
    b.setAttribute('data-mh-theme', state.theme);
    if (state.accent) b.setAttribute('data-mh-accent', state.accent); else b.removeAttribute('data-mh-accent');
    var sc = currentScene();
    document.documentElement.style.setProperty('--demo-scene', sceneUrl(sc));
    document.querySelectorAll('.demo-theme, .demo-themecard').forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-theme') === state.theme); });
    document.querySelectorAll('.demo-accent').forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-accent') === state.accent); });
    document.querySelectorAll('.demo-scene-btn').forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-scene') === state.scene); });
    document.querySelectorAll('.demo-map').forEach(function (img) { img.src = BASE + 'demo/scenes/' + (state.theme === 'frontier' || state.theme === 'oldwest' ? 'minimap-frontier' : 'minimap') + '.svg'; });
    window.dispatchEvent(new CustomEvent('demo:theme', { detail: state }));
  }
  function set(k, v) { state[k] = v; store(k, v); apply(); }

  /* ---------- Kenar çubuğu ---------- */
  function buildSide() {
    var here = location.pathname.split('/').slice(-2).join('/');
    var I = function (n) { return window.MH ? MH.icon(n) : ''; };
    var h = '<a class="demo-brand" href="' + BASE + 'index.html"><span class="demo-brand__mark">M</span><span class="demo-brand__name">MHud</span><span class="demo-brand__ver">v' + (window.MH ? MH.version : '1') + '</span></a>';
    PAGES.forEach(function (g) {
      h += '<nav class="demo-group demo-nav"><div class="demo-group__label">' + g.group + '</div>';
      g.items.forEach(function (p) {
        var active = BASE ? here === p.href : (here.split('/').pop() || 'index.html') === p.href;
        h += '<a href="' + BASE + p.href + '" class="' + (active ? 'is-active' : '') + '">' + I(p.icon) + p.label + '</a>';
      });
      h += '</nav>';
    });
    h += '<div class="demo-group"><div class="demo-group__label">Tema</div><div class="demo-themes">' + THEMES.map(function (t) {
      return '<button class="demo-theme" data-theme="' + t.id + '"><span class="demo-theme__sw" style="background:' + t.sw + '"></span>' + t.label + '<small>' + t.note + '</small></button>';
    }).join('') + '</div></div>';
    h += '<div class="demo-group"><div class="demo-group__label">Vurgu rengi</div><div class="demo-accents">' + ACCENTS.map(function (a) {
      return '<button class="demo-accent' + (a.c ? '' : ' demo-accent--none') + '" data-accent="' + a.id + '" title="' + (a.id || 'Temanın kendi rengi') + '"' + (a.c ? ' style="background:' + a.c + '"' : '') + '></button>';
    }).join('') + '</div></div>';
    h += '<div class="demo-group"><div class="demo-group__label">Sahne</div><div class="demo-scenes">' +
      '<button class="demo-scene-btn" data-scene="auto" style="background:linear-gradient(135deg,#2a3040,#4b3a52)"><span>Otomatik</span></button>' +
      SCENES.map(function (s) { return '<button class="demo-scene-btn" data-scene="' + s + '" style="background-image:' + (s === 'none' ? 'none;background:#1a1d24' : sceneUrl(s)) + '"><span>' + SCENE_LABEL[s] + '</span></button>'; }).join('') + '</div></div>';
    h += '<div class="demo-side__foot">Sunum sayfaları bileşenlerin bir arada kullanımını gösterir. Tüm ölçüler 1920×1080 referanslıdır.</div>';
    var side = document.createElement('aside');
    side.className = 'demo-side';
    side.innerHTML = h;
    document.body.insertBefore(side, document.body.firstChild);
    side.addEventListener('click', function (e) {
      var t = e.target.closest('[data-theme]'); if (t) return set('theme', t.getAttribute('data-theme'));
      var a = e.target.closest('[data-accent]'); if (a) return set('accent', a.getAttribute('data-accent'));
      var s = e.target.closest('[data-scene]'); if (s) return set('scene', s.getAttribute('data-scene'));
    });
    document.addEventListener('click', function (e) {
      var t = e.target.closest('.demo-themecard[data-theme]'); if (t) set('theme', t.getAttribute('data-theme'));
    });
  }

  /* ---------- Sahneler: 1920×1080 tuvali kutuya sığdır ---------- */
  function buildStages() {
    document.querySelectorAll('.demo-stage').forEach(function (stage) {
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
    on: function (sel, fn) { document.querySelectorAll(sel).forEach(function (n) { n.addEventListener('click', fn); }); }
  };

  function boot() {
    document.body.classList.add('demo');
    buildSide();
    buildStages();
    apply();
    if (window.MH) MH.mount();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
