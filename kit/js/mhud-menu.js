/* ==========================================================================
   MHud Menu — veriyle kurulan tam ekran menü (MH.Menu)
   --------------------------------------------------------------------------
   Mod menüsü HTML'i ELLE YAZILMAZ: bölümleri ve veriyi ver, menü kendini çizer.
   Katman + perde, ekrana sığma, aç/kapa, ESC, klavye gezinme, bölüm değiştirme,
   detay paneline göre 2/3 sütun, alt ipuçları ve olay çıkışı menünün işidir.

     var menu = MH.Menu('#screen', {
       kicker: 'Rumble', title: 'Mod menüsü',
       stats: [{ label: 'Nakit', value: '$12.480', tone: 'success' }],
       sections: [
         { group: 'Oyuncu' },
         { id: 'inv',  label: 'Envanter', icon: 'backpack', view: 'list',     items: [...] },
         { id: 'shop', label: 'Mağaza',   icon: 'store',    view: 'grid',     items: [...], detail: 'buy' },
         { group: 'Sistem' },
         { id: 'set',  label: 'Ayarlar',  icon: 'settings', view: 'settings', fields: [...] },
         { id: 'quit', label: 'Çıkış',    icon: 'door',     confirm: { title: 'Çıkılsın mı?', danger: true } }
       ],
       onAction: function (a) { … }        // a = { action, section, id, value, item }
     });
     menu.open('inv'); menu.update('inv', { items: [...] }); menu.close();

   Görünümler (view): list · grid · settings · table · custom (render ile).
   Detay (detail): 'item' (varsayılan, öğede desc/stats/specs/actions varsa) · 'buy' · 'none' · function(item, menu).
   Her eylem önce onAction'a gider; onAction false döndürmezse MH.post(spec.post || 'menu', a) ile oyuna da gider.
   Tam şema: ai/menu.md.
   ========================================================================== */
(function (root) {
  'use strict';
  var MH = root.MH; if (!MH) return;
  var I = MH.icon, E = MH.esc;

  function val(v, st, m) { return typeof v === 'function' ? v(st, m) : v; }
  function art(it) {
    if (it.img) return '<img src="' + E(it.img) + '" alt="">';
    if (it.weapon) return MH.weapon(it.weapon);
    if (it.art) return MH.art(it.art);
    return I(it.icon || 'box');
  }
  function badge(b) {
    if (!b) return '';
    if (typeof b === 'string') b = { text: b };
    return '<span class="mh-badge' + (b.tone ? ' mh-t-' + E(b.tone) : '') + '">' + (b.icon ? I(b.icon) : '') + E(b.text) + '</span>';
  }
  function price(it, cls) {
    if (it.price == null || it.price === '') return '';
    return '<span class="mh-price ' + (cls || '') + (it.locked ? ' is-locked' : '') + '">' + E(typeof it.price === 'number' ? '$' + MH.fmt(it.price) : it.price) + '</span>';
  }
  function itemCls(it, active) {
    return (it.tone ? ' is-' + it.tone : '') + (it.owned ? ' is-owned' : '') + (it.locked ? ' is-locked' : '') +
      (it.disabled ? ' is-disabled' : '') + (active ? ' is-active' : '');
  }
  function hasDetail(it) { return !!(it && (it.desc || it.stats || it.specs || it.actions || it.note)); }

  /* ---------------- Görünümler ---------------- */
  var VIEWS = {
    list: function (sec, sel) {
      var items = sec.items || [];
      if (!items.length) return empty(sec);
      return '<div class="mh-list mh-scroll mh-menu__scroll">' + items.map(function (it) {
        return '<div class="mh-row' + itemCls(it, it.id === sel) + '" data-mh-item="' + E(it.id) + '">' +
          '<span class="mh-row__icon">' + art(it) + '</span>' +
          '<div class="mh-row__main"><span class="mh-row__title">' + E(it.title || it.name || '') + '</span>' + (it.sub ? '<span class="mh-row__sub">' + E(it.sub) + '</span>' : '') + '</div>' +
          '<div class="mh-row__meta">' + badge(it.badge) + (it.meta != null ? '<span class="mh-num">' + E(it.meta) + '</span>' : '') + price(it, 'mh-price--sm') + (it.locked ? I('lock') : '') + '</div></div>';
      }).join('') + '</div>';
    },
    grid: function (sec, sel) {
      var items = sec.items || [], last = null;
      if (!items.length) return empty(sec);
      var counts = {}; items.forEach(function (it) { if (it.group) counts[it.group] = (counts[it.group] || 0) + 1; });
      return '<div class="mh-shopgrid mh-scroll mh-menu__scroll" style="--cols:' + (+sec.cols || 4) + '">' + items.map(function (it) {
        var g = '';
        if (it.group && it.group !== last) { last = it.group; g = '<div class="mh-shopgroup"><span class="mh-kicker">' + E(it.group) + '</span><small>' + counts[it.group] + '</small></div>'; }
        return g + '<div class="mh-item' + itemCls(it, it.id === sel) + '" data-mh-item="' + E(it.id) + '">' +
          '<div class="mh-item__art">' + badge(it.badge) + art(it) + '</div>' +
          '<div class="mh-item__body"><span class="mh-item__name">' + E(it.title || it.name || '') + '</span>' +
          '<div class="mh-item__meta"><span>' + E(it.sub || '') + '</span>' + (it.owned && it.price == null ? '<span class="mh-badge mh-t-success">Sende</span>' : price(it, 'mh-price--sm')) + '</div></div></div>';
      }).join('') + '</div>';
    },
    settings: function (sec, sel) {
      var fields = sec.fields || [];
      if (!fields.length) return empty(sec);
      return '<div class="mh-scroll mh-menu__scroll">' + fields.map(function (f) {
        if (f.heading) return '<div class="mh-menu__toolbar"><span class="mh-title mh-title--sm">' + E(f.heading) + '</span></div>';
        return '<div class="mh-setting' + (f.id === sel ? ' is-active' : '') + (f.disabled ? ' is-disabled' : '') + '" data-mh-item="' + E(f.id) + '">' +
          '<div class="mh-setting__text"><b>' + E(f.label) + '</b>' + (f.desc ? '<span>' + E(f.desc) + '</span>' : '') + '</div>' +
          '<div class="mh-setting__control">' + control(f) + '</div></div>';
      }).join('') + '</div>';
    },
    table: function (sec, sel) {
      var cols = sec.columns || [], rows = sec.rows || [];
      if (!rows.length) return empty(sec);
      return '<div class="mh-scroll mh-menu__scroll mh-menu__pad"><table class="mh-table"><thead><tr>' + cols.map(function (c) {
        return '<th' + (c.align ? ' class="' + E(c.align) + '"' : '') + '>' + E(c.label || '') + '</th>';
      }).join('') + '</tr></thead><tbody>' + rows.map(function (r) {
        return '<tr class="' + (r.self ? 'is-self ' : '') + (r.dead ? 'is-dead ' : '') + (r.id != null && r.id === sel ? 'is-active' : '') + '"' + (r.id != null ? ' data-mh-item="' + E(r.id) + '"' : '') + '>' + cols.map(function (c) {
          var v = r[c.key]; return '<td class="' + (c.align || '') + (c.num ? ' mh-num' : '') + '">' + (c.html ? (v == null ? '' : v) : E(v == null ? '' : v)) + '</td>';
        }).join('') + '</tr>';
      }).join('') + '</tbody></table></div>';
    }
  };
  function empty(sec) {
    var e = sec.empty || {};
    return '<div class="mh-empty">' + I(e.icon || 'box') + '<b>' + E(e.title || 'Burada henüz bir şey yok') + '</b>' + (e.text ? '<span>' + E(e.text) + '</span>' : '') + '</div>';
  }
  function control(f) {
    var id = ' data-mh-field="' + E(f.id) + '"';
    var opts = (f.options || []).map(function (o) { return typeof o === 'object' ? o : { value: o, label: String(o) }; });
    switch (f.type) {
      case 'toggle':
        return '<label class="mh-toggle"><input type="checkbox"' + id + (f.value ? ' checked' : '') + (f.disabled ? ' disabled' : '') + '><span class="mh-toggle__track"></span></label>';
      case 'slider':
        return '<input type="range" class="mh-slider"' + id + ' min="' + (f.min != null ? f.min : 0) + '" max="' + (f.max != null ? f.max : 100) + '" step="' + (f.step || 1) + '" value="' + E(f.value != null ? f.value : 0) + '"' + (f.disabled ? ' disabled' : '') + '>' +
          '<b data-mh-out>' + E((f.value != null ? f.value : 0) + (f.unit || '')) + '</b>';
      case 'seg':
        return '<div class="mh-seg">' + opts.map(function (o) { return '<button' + id + ' data-value="' + E(o.value) + '"' + (String(o.value) === String(f.value) ? ' class="is-active"' : '') + '>' + E(o.label) + '</button>'; }).join('') + '</div>';
      case 'stepper':
        var i = Math.max(0, opts.map(function (o) { return String(o.value); }).indexOf(String(f.value)));
        return '<div class="mh-stepper"><button' + id + ' data-step="-1">' + I('chev-l') + '</button><span class="mh-stepper__value">' + E(opts[i] ? opts[i].label : '') + '</span><button' + id + ' data-step="1">' + I('chev-r') + '</button></div>';
      case 'select':
        return '<select class="mh-input mh-select"' + id + '>' + opts.map(function (o) { return '<option value="' + E(o.value) + '"' + (String(o.value) === String(f.value) ? ' selected' : '') + '>' + E(o.label) + '</option>'; }).join('') + '</select>';
      case 'button':
        return '<button class="mh-btn mh-btn--sm' + (f.danger ? ' mh-btn--tone mh-t-danger' : '') + '"' + id + ' data-mh-press>' + (f.icon ? I(f.icon) : '') + E(f.text || f.label) + '</button>';
      default:
        return '<span class="mh-sub">' + E(f.value == null ? '' : f.value) + '</span>';
    }
  }

  /* ---------------- Detay paneli ---------------- */
  function actionsHtml(it) {
    return (it.actions || []).map(function (a, i) {
      return '<button class="mh-btn mh-btn--block ' + (a.primary || (i === 0 && a.primary !== false) ? 'mh-btn--primary' : a.danger ? 'mh-btn--tone mh-t-danger' : '') + '" data-mh-act="' + E(a.id) + '"' + (a.disabled || it.locked ? ' disabled' : '') + '>' +
        (a.key ? '<span class="mh-key mh-key--sm">' + E(a.key) + '</span>' : a.icon ? I(a.icon) : '') + E(a.label) + '</button>';
    }).join('');
  }
  var DETAILS = {
    item: function (it) {
      return '<div class="mh-preview">' + art(it) + '</div>' +
        '<div><div class="mh-title mh-title--lg">' + E(it.title || it.name || '') + '</div>' + (it.sub ? '<div class="mh-sub">' + E(it.sub) + '</div>' : '') + '</div>' +
        (it.desc ? '<p class="mh-buy__desc">' + E(it.desc) + '</p>' : '') +
        (it.stats ? '<div class="mh-statlines">' + it.stats.map(function (s) {
          return '<div class="mh-statline"><span class="mh-kicker">' + E(s.label) + '</span><div class="mh-bar' + (s.tone ? ' mh-t-' + E(s.tone) : '') + '" data-v="' + (+s.value || 0) + '"><i class="mh-bar__fill"></i></div><b>' + E(s.text != null ? s.text : s.value) + '</b></div>';
        }).join('') + '</div>' : '') +
        (it.specs ? '<dl class="mh-buy__specs">' + it.specs.map(function (p) { return '<dt>' + E(p[0]) + '</dt><dd>' + E(p[1]) + '</dd>'; }).join('') + '</dl>' : '') +
        '<div class="mh-menu__actions">' + actionsHtml(it) + (it.note ? '<span class="mh-buy__note">' + I('info') + E(it.note) + '</span>' : '') + '</div>';
    },
    buy: function (it) {
      return '<div class="mh-buy">' +
        '<div class="mh-buy__art">' + badge(it.badge) + art(it) + '</div>' +
        '<div class="mh-buy__title">' + (it.kicker ? '<span class="mh-kicker mh-kicker--accent">' + E(it.kicker) + '</span>' : '') + '<span class="mh-title mh-title--lg">' + E(it.title || it.name || '') + '</span></div>' +
        (it.desc ? '<p class="mh-buy__desc">' + E(it.desc) + '</p>' : '') +
        (it.specs ? '<dl class="mh-buy__specs">' + it.specs.map(function (p) { return '<dt>' + E(p[0]) + '</dt><dd>' + E(p[1]) + '</dd>'; }).join('') + '</dl>' : '') +
        (it.price != null ? '<div class="mh-buy__total">' + (it.qty ? '<div class="mh-qty"><button data-mh-qty="-1">−</button><b>' + (+it.qty || 1) + '</b><button data-mh-qty="1">+</button></div>' : '<span></span>') + price(it) + '</div>' : '') +
        (it.actions ? actionsHtml(it) : '<button class="mh-btn mh-btn--primary mh-btn--block" data-mh-act="buy"' + (it.locked || it.owned ? ' disabled' : '') + '>' + I('cart') + E(it.owned ? 'Sende var' : 'Satın al') + '</button>') +
        (it.note ? '<span class="mh-buy__note">' + I('wallet') + E(it.note) + '</span>' : '') + '</div>';
    }
  };

  MH.Menu = function (target, spec) {
    if (target && typeof target === 'object' && !target.nodeType && !spec) { spec = target; target = null; }
    spec = spec || {};
    var host = MH.$(target) || document.querySelector('.mh-screen') || document.body;
    var useLayer = spec.layer !== false;
    var S = spec.state || {}, ui = { section: null, sel: {} }, isOpen = !useLayer || !!spec.open;
    var sections = [];
    var layer = null, el = MH.el('section', 'mh-panel mh-menu' + (spec.cls ? ' ' + spec.cls : ''));
    el.setAttribute('data-mh', 'menu');
    el.style.setProperty('--w', (spec.w || 1180) + 'px'); el.style.setProperty('--h', (spec.h || 720) + 'px');
    if (useLayer) {
      layer = MH.el('div', 'mh-layer mh-catch' + (isOpen ? '' : ' mh-hidden'));
      if (spec.scrim !== false) layer.appendChild(MH.el('div', 'mh-scrim mh-scrim--soft'));
      layer.appendChild(el); host.appendChild(layer);
    } else { el.classList.add('mh-catch'); host.appendChild(el); }

    function log() { if (MH.debug) console.log.apply(console, ['[MHud menu]'].concat([].slice.call(arguments))); }
    function setSections(list) {
      sections = (list || []).slice();
      sections.forEach(function (s) { if (s.id != null) s.id = String(s.id); if (s.view === 'list' || s.view === 'grid' || s.view === 'settings' || s.view === 'table' || s.render || s.confirm || s.action) return; if (s.id) console.warn('[MHud menu] bölüm "' + s.id + '" için view/render/confirm/action yok'); });
    }
    setSections(spec.sections);
    function real() { return sections.filter(function (s) { return s.id && !s.confirm && !s.action && !val(s.disabled, S, api); }); }
    function sec() { return sections.filter(function (s) { return s.id === ui.section; })[0]; }
    function items(s) { s = s || sec(); if (!s) return []; return (s.view === 'settings' ? (s.fields || []).filter(function (f) { return !f.heading; }) : s.view === 'table' ? (s.rows || []).filter(function (r) { return r.id != null; }) : s.items || []).filter(function (x) { return !x.disabled; }); }
    function find(s, id) { var all = s.view === 'settings' ? s.fields || [] : s.view === 'table' ? s.rows || [] : s.items || []; return all.filter(function (x) { return String(x.id) === String(id); })[0]; }
    function selId(s) {
      s = s || sec(); if (!s) return null;
      var cur = ui.sel[s.id], list = items(s);
      if (cur != null && list.some(function (x) { return String(x.id) === String(cur); })) return cur;
      var first = list.filter(function (x) { return x.active; })[0] || list[0];
      return ui.sel[s.id] = first ? first.id : null;
    }
    function emit(a) {
      a.section = a.section || ui.section;
      log(a.action, a);
      MH.emit('menu:action', a);
      if (spec.onAction && spec.onAction(a, api) === false) return;
      if (spec.post !== false) MH.post(spec.post || 'menu', { action: a.action, section: a.section, id: a.id, value: a.value });
    }

    /* ---------------- Çizim ---------------- */
    function head() {
      var st = val(spec.stats, S, api) || [];
      return '<header class="mh-menu__head">' + (spec.head ? val(spec.head, S, api) : '') +
        '<div class="mh-menu__title"><span class="mh-kicker mh-kicker--accent">' + E(val(spec.kicker, S, api) || '') + '</span><span class="mh-title">' + E(val(spec.title, S, api) || '') + '</span></div>' +
        (spec.headRight ? val(spec.headRight, S, api) : '') +
        (st.length ? '<div class="mh-menu__stats">' + st.slice(0, 3).map(function (x) {
          return '<div class="mh-stat"><span class="mh-kicker">' + E(x.label) + '</span><b' + (x.tone ? ' class="mh-tone mh-t-' + E(x.tone) + '"' : '') + '>' + E(x.value) + '</b></div>';
        }).join('') + '</div>' : '') + '</header>';
    }
    function nav() {
      return '<nav class="mh-menu__nav mh-scroll">' + sections.map(function (x) {
        if (x.group) return '<div class="mh-nav__group"><span class="mh-kicker">' + E(x.group) + '</span></div>';
        var dis = val(x.disabled, S, api), n = val(x.count, S, api), sm = val(x.small, S, api);
        return '<button class="mh-nav__item' + (ui.section === x.id ? ' is-active' : '') + (dis ? ' is-disabled' : '') + (x.danger ? ' is-danger' : '') + '" data-mh-sec="' + E(x.id) + '"' + (dis ? ' disabled' : '') + '>' +
          I(x.icon || 'chev-r') + E(x.label) + (n ? '<span class="mh-count">' + E(n) + '</span>' : sm != null && sm !== '' ? '<small>' + E(sm) + '</small>' : '') + '</button>';
      }).join('') + '</nav>';
    }
    function hints(s, layout) {
      var h = [];
      if (s && (s.view === 'list' || s.view === 'grid' || s.view === 'settings' || s.view === 'table')) h.push(['↑', '↓', 'Seç']);
      if (s && s.view === 'grid') h.splice(0, 1, ['↑', '↓', '←', '→', 'Seç']);
      if (s && s.view === 'settings') h.push(['←', '→', 'Değiştir']);
      else if (s && (s.view === 'list' || s.view === 'grid') && (s.activate !== false)) h.push(['ENTER', 'Onayla']);
      if (real().length > 1) h.push(['Q', 'E', 'Bölüm']);
      if (spec.closable !== false && useLayer) h.push(['ESC', 'Kapat']);
      (s && s.hints || []).forEach(function (x) { h.push(x); });
      return '<div class="mh-hints">' + h.map(function (x) {
        return '<span class="mh-hint">' + x.slice(0, -1).map(function (k) { return '<span class="mh-key">' + E(k) + '</span>'; }).join('') + E(x[x.length - 1]) + '</span>';
      }).join('') + '</div>';
    }
    function detailHtml(s) {
      if (!s || s.view === 'settings' || s.view === 'table') return '';
      var d = s.detail, it = find(s, selId(s));
      if (d === 'none') return '';
      if (!it) return d ? '<div class="mh-empty">' + I('pointer') + '<b>Bir öğe seç</b></div>' : '';
      if (typeof d === 'function') return d(it, api) || '';
      if (d === 'buy') return DETAILS.buy(it);
      return (d === 'item' || (!d && (s.items || []).some(hasDetail))) ? DETAILS.item(it) : '';
    }
    function render() {
      if (!ui.section || !sec() || val(sec().disabled, S, api)) ui.section = (real()[0] || {}).id || null;
      var s = sec(), main = '', aside = '';
      if (s && s.render) { var r = s.render(S, api) || {}; main = r.main || ''; aside = r.aside || ''; }
      else if (s && VIEWS[s.view]) {
        var sel = selId(s);
        main = (s.toolbar !== false ? '<div class="mh-menu__toolbar"><span class="mh-title mh-title--sm">' + E(s.title || s.label) + '</span>' +
          (s.search ? '<div class="mh-input-wrap" style="margin-left:auto;width:260px">' + I('search') + '<input class="mh-input" data-mh-search placeholder="Ara…"></div>' : '') +
          (s.tools ? val(s.tools, S, api) : '') + '</div>' : '') + VIEWS[s.view](s, sel);
        aside = detailHtml(s);
      }
      var scroll = el.querySelector('.mh-menu__main .mh-scroll'), st = scroll ? scroll.scrollTop : 0, keep = el.__lastSec === ui.section;
      el.innerHTML = head() + '<div class="mh-menu__body' + (aside ? '' : ' mh-menu__body--2') + '">' + nav() +
        '<div class="mh-menu__main" data-panel="' + E(ui.section || '') + '">' + main + '</div>' + (aside ? '<aside class="mh-menu__aside">' + aside + '</aside>' : '') + '</div>' +
        '<footer class="mh-menu__foot">' + hints(s) + '<span class="mh-mute">' + E(val(spec.foot, S, api) || '') + '</span></footer>';
      MH.mount(el);
      if (keep) { var ns = el.querySelector('.mh-menu__main .mh-scroll'); if (ns) ns.scrollTop = st; }
      el.__lastSec = ui.section;
      if (spec.onRender) spec.onRender(api);
    }
    function paintSel(scroll) {
      var s = sec(); if (!s || s.render) return render();
      var id = selId(s);
      el.querySelectorAll('[data-mh-item]').forEach(function (n) { n.classList.toggle('is-active', n.getAttribute('data-mh-item') === String(id)); });
      var a = el.querySelector('.mh-menu__aside'), html = detailHtml(s);
      if (!!a !== !!html) return render();
      if (a) { a.innerHTML = html; MH.mount(a); }
      var cur = el.querySelector('[data-mh-item].is-active'); if (cur && scroll) cur.scrollIntoView({ block: 'nearest' });
    }

    /* ---------------- Eylemler ---------------- */
    function go(id) {
      var s = sections.filter(function (x) { return x.id === String(id); })[0];
      if (!s || val(s.disabled, S, api)) return;
      if (s.confirm) {
        var c = s.confirm;
        MH.confirm({ title: c.title || s.label, text: c.text, danger: c.danger, ok: c.ok || s.label, icon: c.icon || s.icon })
          .then(function (ok) { if (ok) emit({ action: s.id, section: s.id }); });
        return;
      }
      if (s.action === 'close') { api.close(); return; }
      if (s.action) { emit({ action: s.action, section: s.id }); return; }
      if (ui.section === s.id) return;
      ui.section = s.id; render(); emit({ action: 'section', id: s.id });
    }
    function select(id, quiet) {
      var s = sec(); if (!s) return;
      var it = find(s, id); if (!it || it.disabled) return;
      if (String(ui.sel[s.id]) === String(id)) return;
      ui.sel[s.id] = it.id; paintSel(true);
      if (!quiet) emit({ action: 'select', id: it.id, item: it });
    }
    // öğe eylemi; eylemde confirm varsa önce onay sorulur
    function runAct(id, it) {
      var a = it && (it.actions || []).filter(function (x) { return x.id === id; })[0];
      var go = function () { emit({ action: id, id: it ? it.id : null, item: it, value: it && it.qty }); };
      if (a && a.confirm) {
        var c = a.confirm === true ? {} : a.confirm;
        MH.confirm({ title: c.title || a.label + '?', text: c.text, danger: c.danger != null ? c.danger : a.danger, ok: c.ok || a.label, icon: c.icon })
          .then(function (ok) { if (ok) go(); });
      } else go();
    }
    function activate() {
      var s = sec(); if (!s || s.activate === false) return;
      var it = find(s, selId(s)); if (!it || it.locked) return;
      if (s.view === 'settings') return;
      var first = (it.actions || [])[0] || (s.detail === 'buy' && !it.owned ? { id: 'buy' } : null);
      if (first) runAct(first.id, it); else emit({ action: 'activate', id: it.id, item: it });
    }
    function move(dx, dy) {
      var s = sec(), list = items(s); if (!list.length) return;
      var i = list.map(function (x) { return String(x.id); }).indexOf(String(selId(s)));
      var step = s.view === 'grid' ? dy * (+s.cols || 4) + dx : dy;
      if (!step) return;
      select(list[(i + step + list.length) % list.length].id);
    }
    function setField(f, v) {
      f.value = v;
      emit({ action: 'change', id: f.id, value: v, item: f });
      render();
    }
    function nudge(dir) {
      var s = sec(); if (!s || s.view !== 'settings') return false;
      var f = find(s, selId(s)); if (!f || f.disabled) return false;
      var opts = (f.options || []).map(function (o) { return typeof o === 'object' ? o.value : o; });
      if (f.type === 'toggle') setField(f, !f.value);
      else if (f.type === 'slider') { var st = +f.step || 1, mn = f.min != null ? +f.min : 0, mx = f.max != null ? +f.max : 100; setField(f, Math.min(mx, Math.max(mn, (+f.value || 0) + dir * st))); }
      else if (opts.length) { var i = opts.map(String).indexOf(String(f.value)); setField(f, opts[(i + dir + opts.length) % opts.length]); }
      return true;
    }

    el.addEventListener('click', function (e) {
      var t = e.target;
      var n = t.closest('[data-mh-sec]'); if (n && el.contains(n)) { if (!n.disabled) go(n.getAttribute('data-mh-sec')); return; }
      var s = sec();
      var b = t.closest('[data-mh-act]');
      if (b && !b.disabled) { var it = s && find(s, selId(s)); runAct(b.getAttribute('data-mh-act'), it); return; }
      var q = t.closest('[data-mh-qty]');
      if (q && s) { var iq = find(s, selId(s)); if (iq) { iq.qty = Math.max(1, Math.min(iq.max || 99, (+iq.qty || 1) + (+q.getAttribute('data-mh-qty')))); paintSel(); } return; }
      var st = t.closest('[data-step][data-mh-field]');
      if (st && s) { ui.sel[s.id] = st.getAttribute('data-mh-field'); paintSel(); nudge(+st.getAttribute('data-step')); return; }
      var sg = t.closest('.mh-seg > [data-mh-field]');
      if (sg && s) { var fs = find(s, sg.getAttribute('data-mh-field')); if (fs) { ui.sel[s.id] = fs.id; setField(fs, sg.getAttribute('data-value')); } return; }
      var pr = t.closest('[data-mh-press]');
      if (pr && s) { emit({ action: 'press', id: pr.getAttribute('data-mh-field') }); return; }
      var row = t.closest('[data-mh-item]');
      if (row && el.contains(row)) {
        if (s && s.view === 'settings') { ui.sel[s.id] = row.getAttribute('data-mh-item'); paintSel(); return; }
        select(row.getAttribute('data-mh-item'));
      }
    });
    el.addEventListener('dblclick', function (e) { if (e.target.closest('[data-mh-item]') && !e.target.closest('button, input, select')) activate(); });
    el.addEventListener('change', function (e) {
      var t = e.target, id = t.getAttribute('data-mh-field'), s = sec(); if (!id || !s) return;
      var f = find(s, id); if (!f) return;
      setField(f, t.type === 'checkbox' ? t.checked : f.type === 'slider' ? +t.value : t.value);
    });
    el.addEventListener('input', function (e) {
      var t = e.target;
      if (t.hasAttribute('data-mh-search')) {
        var q = t.value.toLocaleLowerCase('tr').trim();
        el.querySelectorAll('.mh-menu__main [data-mh-item]').forEach(function (r) { r.classList.toggle('mh-hidden', !!q && r.textContent.toLocaleLowerCase('tr').indexOf(q) < 0); });
        return;
      }
      if (t.type === 'range' && t.hasAttribute('data-mh-field')) {
        var f = find(sec(), t.getAttribute('data-mh-field')), out = t.parentNode.querySelector('[data-mh-out]');
        if (out && f) out.textContent = t.value + (f.unit || '');
      }
    });
    function key(e) {
      if (!isOpen || !el.isConnected || e.defaultPrevented || MH.modalOpen()) return;
      var typing = e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName) && e.target.type !== 'range' && e.target.type !== 'checkbox';
      if (e.key === 'Escape') { if (spec.closable !== false && useLayer) { e.preventDefault(); api.close(); } return; }
      if (typing) return;
      var k = e.key, s = sec(), grid = s && s.view === 'grid';
      if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); move(0, k === 'ArrowDown' ? 1 : -1); }
      else if (k === 'ArrowLeft' || k === 'ArrowRight') { var d = k === 'ArrowRight' ? 1 : -1; if (grid) { e.preventDefault(); move(d, 0); } else if (nudge(d)) e.preventDefault(); }
      else if (k === 'Enter') { e.preventDefault(); if (s && s.view === 'settings') nudge(1); else activate(); }
      else if (k === 'q' || k === 'Q' || k === 'e' || k === 'E') {
        var list = real(), i = list.map(function (x) { return x.id; }).indexOf(ui.section), dir = k.toLowerCase() === 'e' ? 1 : -1;
        if (list.length > 1) { e.preventDefault(); go(list[(i + dir + list.length) % list.length].id); }
      }
    }
    document.addEventListener('keydown', key);

    var api = {
      el: el, layer: layer, ui: ui,
      get state() { return S; },
      get section() { return ui.section; },
      get sections() { return sections; },
      open: function (id) {
        if (id) ui.section = String(id);
        var was = isOpen; isOpen = true; render();
        if (layer) layer.classList.remove('mh-hidden');
        if (!was) { emit({ action: 'open' }); MH.emit('menu:open', api); if (spec.onOpen) spec.onOpen(api); }
        return api;
      },
      close: function () {
        if (!isOpen || !useLayer) return api;
        isOpen = false; MH.closeModals(); MH.closeContext && MH.closeContext();
        layer.classList.add('mh-hidden');
        emit({ action: 'close' }); MH.emit('menu:close', api); if (spec.onClose) spec.onClose(api);
        return api;
      },
      toggle: function (id) { return isOpen ? api.close() : api.open(id); },
      isOpen: function () { return isOpen; },
      go: function (id) { go(id); return api; },
      select: function (id) { select(id, true); return api; },
      selected: function () { var s = sec(); return s ? find(s, selId(s)) : null; },
      set: function (st) { S = st || {}; render(); return api; },
      patch: function (p) { Object.keys(p || {}).forEach(function (k) { S[k] = p[k]; }); render(); return api; },
      update: function (id, patch) {
        var s = sections.filter(function (x) { return x.id === String(id); })[0];
        if (!s) { console.warn('[MHud menu] update: bölüm yok', id); return api; }
        Object.keys(patch || {}).forEach(function (k) { s[k] = patch[k]; }); render(); return api;
      },
      setSections: function (list) { setSections(list); render(); return api; },
      render: render,
      destroy: function () { document.removeEventListener('keydown', key); (layer || el).remove(); }
    };
    if (spec.section) ui.section = String(spec.section);
    render();
    return api;
  };
})(window);
