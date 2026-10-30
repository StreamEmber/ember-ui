/* MHud atlas adapter: shared by game mods, with native-frame positioning through the overlay. */
(function (root) {
  'use strict';
  var MH = root.MH;
  MH.Atlas = function (action) {
    var host, layout, slots = [], pending = [], scheduled = false;
    function geometry() {
      if (!layout || !host) return;
      var z = parseFloat(document.documentElement.style.zoom) || 1;
      var screen = MH.bridge && MH.bridge.screenHeight || layout.screenHeight;
      var offset = MH.bridge && MH.bridge.atlasOffset || 0;
      host.style.cssText = 'position:absolute;left:0;pointer-events:none;top:' + ((screen + offset) / z) + 'px;width:' + (layout.columns * layout.slotWidth / z) + 'px;height:' + (layout.rows * layout.slotHeight / z) + 'px';
      slots.forEach(function (s, i) {
        s.el.style.cssText = 'position:absolute;overflow:hidden;left:' + (i % layout.columns * layout.slotWidth / z) + 'px;top:' + (Math.floor(i / layout.columns) * layout.slotHeight / z) + 'px;width:' + (layout.slotWidth / z) + 'px;height:' + (layout.slotHeight / z) + 'px';
        if (s.item) draw(s);
      });
    }
    function draw(s) {
      var z = parseFloat(document.documentElement.style.zoom) || 1;
      var t = Object.assign({}, s.item, { id: 0, x: layout.slotWidth / z / 2, y: layout.slotHeight / z - 2, scale: 1, alpha: 1 });
      t.sig = JSON.stringify(s.item); s.pool.update([t]);
      var tag = s.el.querySelector('.mh-tag');
      if (tag) { tag.style.position = 'absolute'; tag.style.left = '0'; tag.style.top = '0'; }
    }
    function ack() {
      if (scheduled) return; scheduled = true;
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        scheduled = false;
        var screen = MH.bridge && MH.bridge.screenHeight || layout.screenHeight;
        var offset = MH.bridge && MH.bridge.atlasOffset || 0;
        if (root.innerHeight < screen + offset + layout.rows * layout.slotHeight) { if (pending.length) ack(); return; }
        if (pending.length) { MH.post('atlasReady', { s: pending.splice(0) }); }
      }); });
    }
    MH.on(action, function (d) {
      if (d.reset) {
        if (host) host.remove(); host = null; slots = []; pending = []; layout = d.layout;
        if (!layout || !layout.rows) return;
        host = document.createElement('div'); document.body.appendChild(host);
        for (var i = 0; i < layout.columns * layout.rows; i++) { var el = document.createElement('div'); host.appendChild(el); slots.push({ el: el, pool: MH.Nametags(el) }); }
        geometry();
      }
      if (!layout) return;
      (d.set || []).forEach(function (v) { var s = slots[v.slot]; if (!s) return; s.item = v.item; draw(s); pending.push(v.slot, v.ver); });
      (d.clear || []).forEach(function (i) { if (slots[i]) { slots[i].item = null; slots[i].pool.update([]); } });
      if (pending.length) ack();
    });
    root.addEventListener('resize', geometry);
  };
})(window);
