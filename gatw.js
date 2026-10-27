/* ============================================================
   iRiLLL MODZ — LOGIC.JS (full: UI + features + toggles)
   version: 2.6.1 (UI Revamp + Unlimited Godmode)
   License: LOCAL KEYLIST (offline, no pastefy)
   ============================================================ */
(function () {
  'use strict';
  if (window.__pb) return;

  /* ============================================================
     LICENSE GATE — LOCAL KEYLIST
     ============================================================ */
  var PF_KEY_LS    = 'iril_pf_key';
  var PF_TOKEN_LS  = 'iril_pf_token';
  var PF_EXP_LS    = 'iril_pf_exp';
  var PF_CACHE_MS  = 1 * 3600 * 1000;

  var PF_LOCAL_KEYS = [
    'IRIL', 'IRIL-VIP-MODZ', 'IRIL-ABCD-1234', 'IRIL-EFGH-5678',
    'IRIL-IJKL-9012', 'my key 123', 'abc', 'k', '🔥PREMIUM🔥'
  ];

  function pfGet(k, d) {
    try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; }
  }
  function pfSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }

  function pfValidate(key, cb) {
    var target = String(key).trim();
    if (!target) { cb(false, 'invalid'); return; }
    var ok = PF_LOCAL_KEYS.some(function (k) { return k === target; });
    if (ok) {
      pfSet(PF_TOKEN_LS, 'ok_' + Date.now());
      pfSet(PF_EXP_LS, String(Date.now() + PF_CACHE_MS));
      cb(true);
    } else {
      cb(false, 'invalid');
    }
  }

  function pfCacheValid() {
    var tok = pfGet(PF_TOKEN_LS, '');
    var exp = parseInt(pfGet(PF_EXP_LS, '0'), 10) || 0;
    return !!(tok && exp > Date.now());
  }

  function pfPrompt(title, msg, cb) {
    function mk() {
      try {
        var wrap = document.createElement('div');
        wrap.setAttribute('data-pf-prompt', '1');
        wrap.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:2147483647;display:flex;align-items:center;justify-content:center;font:13px/1.4 system-ui,Tahoma,sans-serif';

        var box = document.createElement('div');
        box.style.cssText = 'background:#fff;border-radius:12px;padding:18px 18px 14px;width:min(340px,90vw);box-shadow:0 20px 50px rgba(0,0,0,.35);color:#0f172a';

        var t = document.createElement('div');
        t.textContent = title;
        t.style.cssText = 'font-weight:800;font-size:14px;margin-bottom:6px;color:#7c3aed';

        var m = document.createElement('div');
        m.textContent = msg;
        m.style.cssText = 'color:#475569;margin-bottom:10px;font-size:12px;line-height:1.5';

        var inp = document.createElement('input');
        inp.type = 'text';
        inp.placeholder = 'Masukkan License Key';
        inp.style.cssText = 'width:100%;box-sizing:border-box;padding:9px 10px;border:1px solid #cbd5e1;border-radius:8px;font:13px monospace;outline:none';

        var row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:8px;margin-top:12px';

        var btnOk = document.createElement('button');
        btnOk.textContent = 'Aktifkan';
        btnOk.style.cssText = 'flex:1;padding:9px 0;border:0;border-radius:8px;background:#7c3aed;color:#fff;font-weight:800;cursor:pointer;font-size:12px';

        var btnNo = document.createElement('button');
        btnNo.textContent = 'Batal';
        btnNo.style.cssText = 'flex:0 0 84px;padding:9px 0;border:1px solid #cbd5e1;border-radius:8px;background:#f1f5f9;color:#334155;font-weight:700;cursor:pointer;font-size:12px';

        var st = document.createElement('div');
        st.style.cssText = 'margin-top:8px;font-size:11px;color:#b91c1c;min-height:14px';

        row.appendChild(btnOk); row.appendChild(btnNo);
        box.appendChild(t); box.appendChild(m); box.appendChild(inp);
        box.appendChild(row); box.appendChild(st);
        wrap.appendChild(box);
        (document.body || document.documentElement).appendChild(wrap);
        setTimeout(function () { try { inp.focus(); } catch (e) {} }, 60);

        function close() { try { wrap.remove(); } catch (e) {} }
        btnNo.addEventListener('click', function () { close(); cb(null); });
        function submit() {
          var k = (inp.value || '').trim();
          if (!k) { st.style.color = '#b91c1c'; st.textContent = 'Key tidak boleh kosong'; return; }
          st.style.color = '#7c3aed'; st.textContent = 'Memverifikasi…';
          btnOk.disabled = true; btnOk.style.opacity = '.7';
          pfValidate(k, function (ok, reason) {
            btnOk.disabled = false; btnOk.style.opacity = '1';
            if (ok) { pfSet(PF_KEY_LS, k); close(); cb(k); }
            else { st.style.color = '#b91c1c'; st.textContent = 'Key tidak valid'; }
          });
        }
        btnOk.addEventListener('click', submit);
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); });
      } catch (e) { cb(null); }
    }
    if (document.body) mk();
    else document.addEventListener('DOMContentLoaded', mk, { once: true });
  }

  function pfGate() {
    if (pfCacheValid()) { bootCore(); startLicenseWatcher(); return; }
    var saved = pfGet(PF_KEY_LS, '');
    if (saved) {
      pfValidate(saved, function (ok) {
        if (ok) { bootCore(); startLicenseWatcher(); }
        else pfPrompt('License Required', 'Key tersimpan tidak valid. Masukkan key baru.', function (k) { if (k) { bootCore(); startLicenseWatcher(); } });
      });
    } else {
      pfPrompt('License Required', 'Masukkan License Key iRiLLL MODZ untuk melanjutkan.', function (k) { if (k) { bootCore(); startLicenseWatcher(); } });
    }
  }

  var __pfWatcherStarted = false;
  function startLicenseWatcher() {
    if (__pfWatcherStarted) return;
    __pfWatcherStarted = true;

    setInterval(function () {
      try {
        if (pfCacheValid()) return;
        var existing = document.querySelector('div[data-pf-prompt="1"]');
        if (existing) return;
        try { if (window.__pb && window.__pb.off) window.__pb.off(); } catch (e) {}
        pfPrompt('License Expired', 'Sesi 1 jam kamu sudah habis. Masukkan License Key lagi.', function (k) {
          if (k) {
            try { if (window.__pb && window.__pb.on) window.__pb.on(); } catch (e) {}
            __pfWatcherStarted = false; startLicenseWatcher();
          } else {
            setTimeout(function () { if (!pfCacheValid()) { try { startLicenseWatcher(); } catch (e) {} } }, 5000);
          }
        });
      } catch (e) {}
    }, 30000);
  }

  function bootCore() {
    var V = '2.6.1';
    var BRAND = 'iRiLLL MODZ';
    function log() { try { console.log.apply(console, ['[iR]'].concat([].slice.call(arguments))); } catch (e) {} }

    (function preboot() {
      try {
        if (!/\/jogo|game\.html/.test(location.pathname)) return;
        if (window.G || window.HUDO || window.GAME_READY || window.__pbBoot) return;
        window.__pbBoot = 1;
        try { var nb = +sessionStorage.getItem('pb_noboot') || 0; if (nb && Date.now() - nb < 120000) return; } catch (e0) {}
        if (document.readyState === 'complete') return;
        function xget(u, accept) {
          var x = new XMLHttpRequest(); x.open('GET', u, false);
          try { x.setRequestHeader('Accept', accept); } catch (e) {}
          x.send(null);
          if (x.status !== 200 || !x.responseText) throw new Error('xhr ' + x.status);
          return x.responseText;
        }
        var html = xget(location.href, 'text/html,*/*');
        if (html.indexOf('/static/game/bundle.js') < 0) return;
        var bm = /src="([^"]*\/static\/game\/bundle\.js[^"]*)"/.exec(html);
        if (!bm) return;
        var bsrc = xget(new URL(bm[1], location.href).href, '*/*');

        var gateJi = /ji\s*=\s*"localhost"===location\.hostname\|\|"127\.0\.0\.1"===location\.hostname\|\|"\[::1\]"===location\.hostname/;
        var gateUi = /const Ui="localhost"===location\.hostname\|\|"127\.0\.0\.1"===location\.hostname\|\|"\[::1\]"===location\.hostname,/;

        var patched = false;
        if (gateJi.test(bsrc)) { bsrc = bsrc.replace(gateJi, 'ji=!0'); patched = true; }
        else if (gateUi.test(bsrc)) { bsrc = bsrc.replace(gateUi, 'const Ui=!0,'); patched = true; }
        if (!patched) return;

        var parsed = new DOMParser().parseFromString(html, 'text/html');
        var scripts = [].slice.call(parsed.querySelectorAll('script')).map(function (s) {
          return { src: s.getAttribute('src'), text: s.textContent, type: s.getAttribute('type') || '' };
        });
        if (!scripts.length) return;
        [].slice.call(parsed.querySelectorAll('script')).forEach(function (s) { if (s.parentNode) s.parentNode.removeChild(s); });
        var dt = parsed.doctype ? '<!doctype ' + parsed.doctype.name + '>' : '<!doctype html>';
        var clean = dt + parsed.documentElement.outerHTML;
        var burl = '';
        try { burl = URL.createObjectURL(new Blob([bsrc], { type: 'text/javascript' })); } catch (e1) {}
        try {
          if (document.referrer.indexOf('android-app://') === 0 || matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches)
            document.cookie = 'pbapp=1; max-age=31536000; path=/; secure; samesite=lax';
        } catch (e4) {}
        try { document.open(); document.write(clean); document.close(); }
        catch (e2) { try { sessionStorage.setItem('pb_noboot', String(Date.now())); } catch (e3) {} location.reload(); return; }
        var i = 0;
        function next() {
          while (i < scripts.length) {
            var s = scripts[i++];
            try {
              var t = (s.type || '').toLowerCase();
              if (t && t.indexOf('javascript') < 0 && t.indexOf('ecmascript') < 0) continue;
              var el = document.createElement('script');
              var head = document.head || document.documentElement;
              if (s.src) {
                var abs;
                try { abs = new URL(s.src, location.href).href; } catch (eU) { abs = s.src; }
                if (/\/static\/game\/bundle\.js(\?|$)/.test(abs)) abs = burl || '';
                if (abs) {
                  el.src = abs; el.async = false;
                  var done = false;
                  var fin = function () { if (done) return; done = true; clearTimeout(to); next(); };
                  var to = setTimeout(fin, 20000);
                  el.onload = el.onerror = fin;
                  head.appendChild(el); return;
                }
                el.textContent = bsrc; head.appendChild(el); continue;
              }
              el.textContent = s.text; head.appendChild(el);
            } catch (eL) {}
          }
        }
        next();
      } catch (e) {}
    })();

    var HIDDEN = { pb: null, pbvis: null, pbnade: null, pbqc: null, pbx: null };

    var P = {
      cone: 0.45, reach: 150, autoFire: 0, gain: 0.9, headR: 0.11, mode: 'near', bias: 0.35,
      aimMode: 'pov', povCircleR: 180, hitbox: 'head'
    };
    var O = { sens: 0.5, fov: 70, invert: false };
    function readOpts() {
      try {
        var s = localStorage.getItem('pbweb_opts');
        if (!s) return;
        var o = JSON.parse(s);
        if (typeof o.sens === 'number' && o.sens > 0) O.sens = o.sens;
        if (typeof o.fov === 'number' && o.fov > 0) O.fov = o.fov;
        O.invert = !!o.invert;
      } catch (e) {}
    }
    readOpts();
    try { addEventListener('pbopts', function () { readOpts(); }); } catch (e) {}

    try {
      var _am = localStorage.getItem('ir_aimmode');
      if (_am === 'legacy' || _am === 'pov') P.aimMode = _am;
      var _pr = parseFloat(localStorage.getItem('ir_povcirc'));
      if (isFinite(_pr) && _pr >= 40 && _pr <= 400) P.povCircleR = _pr;
      var _hb = localStorage.getItem('ir_hitbox');
      if (_hb === 'head' || _hb === 'body' || _hb === 'nearest') P.hitbox = _hb;
    } catch (e) {}

    var G = null, aimOn = true, fireHeld = 0, nextTap = 0, holding = false;
    var lastPick = null, st = { v: V, aim: true, G: false, bots: 0, enemies: 0, lock: 0, err: 0, fire: 0, dist: 0, hitbox: P.hitbox };

    var DBG = { el: null, n: 0 };
    function dbg(t) {
      try {
        if (!DBG.el) {
          var d = document.createElement('div');
          d.setAttribute('data-pb', '1');
          d.style.cssText = 'position:fixed;left:6px;bottom:6px;padding:2px 6px;background:#000a;color:#fff;font:11px monospace;z-index:2147483000;pointer-events:none;border-radius:2px';
          (document.body || document.documentElement).appendChild(d);
          DBG.el = d;
        }
        DBG.el.textContent = t;
      } catch (e) {}
    }
    setInterval(function () {
      if (DBG.n > 3) return;
      if (game()) { dbg('iRiLLL MODZ'); if (++DBG.n > 3) { try { DBG.el.remove(); } catch (e) {} DBG.el = null; } }
      else if (!DBG.n) { dbg('iRiLLL MODZ'); }
    }, 1000);

    function game() {
      try { var g = window.G; if (g && g.P && g.P.s && g.camera && g.bots) return g; } catch (e) {}
      return null;
    }
    function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
    function wrap(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
    function wpos(b, out) { var e = b.matrixWorld.elements; out.x = e[12]; out.y = e[13]; out.z = e[14]; return out; }
    var A = { x: 0, y: 0, z: 0 }, B = { x: 0, y: 0, z: 0 };

    var _hpOut = { x: 0, y: 0, z: 0 };
    var _pv = null, _pDir = { x: 0, y: 0, z: 0 };

    function headPoint(p) {
      var by = p.c && p.c.byName; if (!by) return null;
      var h = by.Head || by.head || null, g = by.Bone_HeadGearAttach || null;
      if (!h && !g) return null;
      if (h && g) {
        wpos(h, A); wpos(g, B);
        _hpOut.x = (A.x + B.x) * .5; _hpOut.y = (A.y + B.y) * .5; _hpOut.z = (A.z + B.z) * .5;
      } else wpos(h || g, _hpOut);
      return _hpOut;
    }

    function bodyPoint(p) {
      var by = p.c && p.c.byName; if (!by) return null;
      var h = by.Spine2 || by.Spine1 || by.Pelvis || by.Neck;
      if (!h) return null;
      wpos(h, _hpOut); return _hpOut;
    }

    function getTargetPoint(p) {
      var by = p.c && p.c.byName; if (!by) return null;
      if (P.hitbox === 'head') return headPoint(p);
      if (P.hitbox === 'body') return bodyPoint(p);
      var hp = headPoint(p), bp = bodyPoint(p);
      if (!hp) return bp;
      if (!bp) return hp;
      var hx = hp.x - C.x, hy = hp.y - C.y, hz = hp.z - C.z;
      var hd = Math.sqrt(hx*hx + hy*hy + hz*hz);
      var bx = bp.x - C.x, by2 = bp.y - C.y, bz = bp.z - C.z;
      var bd = Math.sqrt(bx*bx + by2*by2 + bz*bz);
      if (hd < bd) { _hpOut.x = hp.x; _hpOut.y = hp.y; _hpOut.z = hp.z; }
      else { _hpOut.x = bp.x; _hpOut.y = bp.y; _hpOut.z = bp.z; }
      return _hpOut;
    }

    function isInsidePOVCircle(cam, hp) {
      try {
        if (!_pv) _pv = cam.position.clone();
        var ndc = _pv.set(hp.x, hp.y, hp.z).project(cam);
        if (!(ndc.z > -1 && ndc.z < 1)) return false;
        var px = ndc.x * (innerWidth / 2), py = -ndc.y * (innerHeight / 2);
        return Math.sqrt(px * px + py * py) <= P.povCircleR;
      } catch (e) { return false; }
    }

    function hasLineOfSight(g, cam, hp) {
      try {
        if (typeof g.cast !== 'function') return true;
        var eye = cam.position;
        var dx = hp.x - eye.x, dy = hp.y - eye.y, dz = hp.z - eye.z;
        var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (!(dist > 0.5)) return false;
        _pDir.x = dx / dist; _pDir.y = dy / dist; _pDir.z = dz / dist;
        return !g.cast(eye, _pDir, dist - 0.35);
      } catch (e) { return true; }
    }

    function isBotReal(p) {
      if (!p || !p.obj || !p.c || p.dead || !(p.hp > 0) || !p.obj.parent || p.obj.visible === false) return false;
      return true;
    }

    function move(dx, dy) {
      var ev;
      try { ev = new MouseEvent('mousemove', { bubbles: true, cancelable: true, movementX: dx, movementY: dy }); }
      catch (e) { ev = new MouseEvent('mousemove', { bubbles: true, cancelable: true }); }
      if (ev.movementX !== dx) { try { Object.defineProperty(ev, 'movementX', { value: dx }); } catch (e) {} }
      if (ev.movementY !== dy) { try { Object.defineProperty(ev, 'movementY', { value: dy }); } catch (e) {} }
      (document.body || document.documentElement).dispatchEvent(ev);
    }
    function down() { try { (document.body || document.documentElement).dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 })); } catch (e) {} }
    function up() { try { (document.body || document.documentElement).dispatchEvent(new MouseEvent('mouseup', { bubbles: true, button: 0 })); } catch (e) {} holding = false; }

    var fireIds = new Set();
    function inZone(t) { return t.clientX > innerWidth * 0.50 && t.clientY > innerHeight * 0.45; }
    function syncFire() { fireHeld = fireIds.size; st.fire = fireHeld; }
    addEventListener('touchstart', function (e) { for (var i = 0; i < e.changedTouches.length; i++) { if (inZone(e.changedTouches[i])) fireIds.add(e.changedTouches[i].identifier); } syncFire(); }, true);
    addEventListener('touchmove', function (e) { for (var i = 0; i < e.changedTouches.length; i++) { var t = e.changedTouches[i]; if (inZone(t)) fireIds.add(t.identifier); else fireIds.delete(t.identifier); } syncFire(); }, true);
    function touchEnd(e) { for (var i = 0; i < e.changedTouches.length; i++) fireIds.delete(e.changedTouches[i].identifier); syncFire(); }
    addEventListener('touchend', touchEnd, true);
    addEventListener('touchcancel', touchEnd, true);

    var F = { x: 0, y: 0, z: 0 }, C = { x: 0, y: 0, z: 0 };

    function tick() {
      requestAnimationFrame(tick);
      if (!G) { G = game(); if (!G) return; st.G = true; log('G unlocked', V); try { buzz(30); } catch (e) {} }
      var g = G, self = g.P.s, cam = g.camera;
      if (!self || self.dead) { if (holding) up(); lastPick = null; st.lock = 0; return; }
      var now = performance.now(), m = cam.matrixWorld.elements;
      C.x = m[12]; C.y = m[13]; C.z = m[14];
      var yaw = +self.yaw || 0, pitch = +self.pitch || 0;
      var cp = Math.cos(pitch);
      F.x = -Math.sin(yaw) * cp; F.y = Math.sin(pitch); F.z = -Math.cos(yaw) * cp;

      var useLegacy = (P.aimMode === 'legacy');
      var best = null, bestP = null, bestA = 1e9, bestD = 1e9, myTeam = self.team, list = g.bots, n = 0, en = 0;
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (!isBotReal(p)) continue;
        n++;
        if (p.team === myTeam || p === self) continue;
        var hp = getTargetPoint(p); if (!hp) continue;
        var dx = hp.x - C.x, dy = hp.y - C.y, dz = hp.z - C.z;
        var d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < 2 || d > P.reach) continue;

        if (!useLegacy) {
          if (!isInsidePOVCircle(cam, hp)) continue;
          if (!hasLineOfSight(g, cam, hp)) continue;
        }
        en++;
        var ey = wrap(Math.atan2(-dx, -dz) - yaw);
        var ep = Math.asin(clamp(dy / d, -1, 1)) - pitch;
        var a = Math.sqrt(ey * ey + ep * ep);
        if (a > P.cone) continue;

        var better = (P.mode === 'angle') ? (a < bestA) : (d < bestD - P.bias || (d <= bestD + P.bias && a < bestA));
        if (better) { bestA = a; bestD = d; best = p; bestP = { x: hp.x, y: hp.y, z: hp.z }; }
      }
      st.bots = n; st.enemies = en;
      if (!best || !aimOn) { lastPick = null; st.lock = 0; if (holding) up(); return; }

      if (!useLegacy && (!isInsidePOVCircle(cam, bestP) || !hasLineOfSight(g, cam, bestP))) {
        lastPick = null; st.lock = 0; if (holding) up(); return;
      }

      var t = O.sens * (cam.fov / O.fov) * 0.005;
      if (!(t > 0)) return;
      var ey2 = wrap(Math.atan2(-(bestP.x - C.x), -(bestP.z - C.z)) - yaw);
      var d2 = Math.hypot(bestP.x - C.x, bestP.y - C.y, bestP.z - C.z);
      var ep2 = Math.asin(clamp((bestP.y - C.y) / d2, -1, 1)) - pitch;
      var px = clamp(-ey2 / t * P.gain, -220, 220);
      var py = clamp((O.invert ? 1 : -1) * ep2 / t * P.gain, -220, 220);
      if (Math.abs(px) + Math.abs(py) > 0.5) move(px, py);
      st.err = bestA; st.dist = bestD; st.lock = 1; lastPick = best;

      if (!(P.autoFire || fireHeld) || now < nextTap || holding) return;
      if (!useLegacy && !hasLineOfSight(g, cam, bestP) && !FL.wallbang) return;

      var hit = null;
      try { hit = best.hitTest(C, F, P.reach); } catch (e) { hit = null; }
      if (!hit) return;

      if (P.hitbox === 'head' && !hit.head) return;

      down(); holding = true;
      var holdMs = 45 + Math.random() * 30;
      setTimeout(function () { if (holding) up(); }, holdMs);
      nextTap = now + holdMs + 90 + Math.random() * 70;
    }

    function buzz(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} }
    setInterval(function () {
      try { var Bx = window.PBAndroid, v; if (Bx && Bx.poll) v = Bx.poll();
        if (v === 1) { aimOn = true; st.aim = true; buzz([20, 40, 20]); }
        else if (v === -1) { aimOn = false; st.aim = false; up(); buzz(60); }
      } catch (e) {}
    }, 120);
    setInterval(function () { if (!G) { G = game(); if (G) { st.G = true; } } }, 500);

    var FL = {
      wallbang: 1, infAmmo: 1, noRecoil: 1, godmode: 0, godmodeOff: 0,
      noclip: 0, nadeAim: 1, antiKick: 1
    };

    var PB_API = {
      state: function () {
        return {
          v: V, aim: aimOn, G: !!G, bots: st.bots, enemies: st.enemies, lock: st.lock,
          dist: +st.dist.toFixed(2), mode: P.mode, aimMode: P.aimMode,
          povCircleR: P.povCircleR, hitbox: P.hitbox, err: +(st.err * 57.2958).toFixed(2),
          fire: fireHeld, autoFire: P.autoFire, sens: O.sens, fov: O.fov
        };
      },
      cfg: function (o) { if (o) for (var k in o) if (k in P) P[k] = o[k]; return P; },
      on: function () { aimOn = true; st.aim = true; return 'on'; },
      off: function () { aimOn = false; st.aim = false; up(); return 'off'; },
      aimMode: function (mode) {
        if (mode === 'pov' || mode === 'legacy') {
          P.aimMode = mode; try { localStorage.setItem('ir_aimmode', mode); } catch (e) {}
        }
        return P.aimMode;
      },
      povCircle: function (v) {
        if (typeof v === 'number' && v >= 40 && v <= 400) {
          P.povCircleR = v; try { localStorage.setItem('ir_povcirc', String(v)); } catch (e) {}
        }
        return P.povCircleR;
      },
      hitbox: function (v) {
        if (v === 'head' || v === 'body' || v === 'nearest') {
          P.hitbox = v; st.hitbox = v; try { localStorage.setItem('ir_hitbox', v); } catch (e) {}
        }
        return P.hitbox;
      },
      list: function () {
        var g = game(); if (!g) return 'no G';
        return (g.bots || []).map(function (p) { return { id: p.id, team: p.team, my: p.team === g.P.s.team, dead: !!p.dead, hp: p.hp }; });
      },
      head: function () {
        var hp = lastPick && getTargetPoint(lastPick);
        return hp ? { x: +hp.x.toFixed(2), y: +hp.y.toFixed(2), z: +hp.z.toFixed(2), team: lastPick.team, hp: lastPick.hp } : null;
      }
    };
    window.__pb = PB_API; HIDDEN.pb = PB_API;

    /* ESP & VISUAL */
    var E = { on: 1, wrap: null, host: null, hostAt: 0, slots: [], last: 0, n: 0 };
    function eInit() {
      if (E.wrap && E.wrap.parentNode) return true;
      var host = document.body || document.documentElement;
      if (!host) return false;
      var w = document.createElement('div');
      w.setAttribute('data-pb', '1');
      w.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:2147483000';
      host.appendChild(w);
      E.wrap = w; E.slots = [];
      return true;
    }
    function eSlot(i) {
      var s = E.slots[i];
      if (s) return s;
      var box = document.createElement('div');
      box.style.cssText = 'position:absolute;left:0;top:0;box-sizing:border-box;border:1px solid rgba(0,200,90,.9);border-radius:1px;display:none;will-change:transform';
      var hb = document.createElement('div');
      hb.style.cssText = 'position:absolute;left:-1px;top:-5px;width:calc(100% + 2px);height:3px;background:rgba(0,0,0,.35)';
      var hf = document.createElement('div');
      hf.style.cssText = 'position:absolute;left:0;top:0;height:100%;width:100%;background:#2cc76a';
      hb.appendChild(hf);
      var tx = document.createElement('div');
      tx.style.cssText = 'position:absolute;right:0;top:-15px;font:10px/12px Tahoma,sans-serif;color:#0a5c2a;text-shadow:0 1px 2px #fff;white-space:nowrap;font-weight:700';
      box.appendChild(hb); box.appendChild(tx);
      E.wrap.appendChild(box);
      s = { box: box, hp: hf, tx: tx };
      E.slots[i] = s;
      return s;
    }
    function eClear() { for (var i = 0; i < E.slots.length; i++) E.slots[i].box.style.display = 'none'; E.n = 0; }
    function eHost() {
      var now = performance.now();
      if (E.host && E.host.parentNode && now - E.hostAt < 400) return E.host;
      E.hostAt = now;
      var best = null, ba = 0, cs = document.getElementsByTagName('canvas');
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        if (c.getAttribute('data-pb')) continue;
        var r = c.getBoundingClientRect(), a = r.width * r.height;
        if (a > ba) { ba = a; best = c; }
      }
      E.host = best || null; return E.host;
    }
    function eProj(cam, r, x, y, z) {
      if (!E.v) { try { E.v = cam.position.clone(); } catch (e) { return null; } }
      var d = E.v.set(x, y, z).project(cam);
      if (!(d.z > -1 && d.z < 1)) return null;
      return { x: r.left + (d.x * 0.5 + 0.5) * r.width, y: r.top + (-d.y * 0.5 + 0.5) * r.height };
    }
    function eDraw(g) {
      var cam = g.camera, list = g.bots, self = g.P && g.P.s;
      if (!list || !cam || !self || self.dead) { eClear(); return; }
      var host = eHost();
      if (!host) { eClear(); return; }
      var r = host.getBoundingClientRect();
      if (!(r.width > 0)) { eClear(); return; }
      var me = cam.matrixWorld && cam.matrixWorld.elements;
      var cx = me ? me[12] : 0, cy = me ? me[13] : 0, cz = me ? me[14] : 0;
      var my = self.team, idx = 0;
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (!p || !p.obj || !p.c || p === self || p.team === my || p.dead || !(p.hp > 0)) continue;
        var hp = headPoint(p); if (!hp) continue;
        var mm = p.obj.matrixWorld && p.obj.matrixWorld.elements; if (!mm) continue;
        var a = eProj(cam, r, hp.x, hp.y, hp.z), b = eProj(cam, r, mm[12], mm[13], mm[14]);
        if (!a || !b) continue;
        var bh = b.y - a.y;
        if (!(bh > 6)) continue;
        if (a.x < r.left - 60 || a.x > r.left + r.width + 60 || b.y < r.top - 60 || a.y > r.top + r.height + 60) continue;
        var bw = bh * 0.42; if (bw > 400) bw = 400;
        var s = eSlot(idx++);
        s.box.style.display = 'block';
        s.box.style.transform = 'translate3d(' + (a.x - bw / 2).toFixed(1) + 'px,' + a.y.toFixed(1) + 'px,0)';
        s.box.style.width = bw.toFixed(1) + 'px';
        s.box.style.height = bh.toFixed(1) + 'px';
        var mxh = p.maxHp > 0 ? p.maxHp : 100;
        var f = Math.max(0, Math.min(1, (p.hp || 0) / mxh));
        s.hp.style.width = (f * 100).toFixed(0) + '%';
        s.hp.style.background = f > 0.5 ? '#2cc76a' : (f > 0.25 ? '#f5b942' : '#ff3b30');
        s.tx.textContent = Math.round(Math.sqrt((hp.x - cx)*(hp.x - cx) + (hp.y - cy)*(hp.y - cy) + (hp.z - cz)*(hp.z - cz))) + 'm';
      }
      for (; idx < E.slots.length; idx++) E.slots[idx].box.style.display = 'none';
      E.n = idx;
    }

    /* BONE ESP */
    var BE = { on: 0, wrap: null, host: null, hostAt: 0, last: 0, range: 60 };
    var BONE_PAIRS = [
      ['Head','Neck'],['Neck','Spine3'],['Spine3','Spine2'],['Spine2','Spine1'],['Spine1','Pelvis'],
      ['Spine3','L_Clavicle'],['L_Clavicle','L_UpperArm'],['L_UpperArm','L_Forearm'],['L_Forearm','L_Hand'],
      ['Spine3','R_Clavicle'],['R_Clavicle','R_UpperArm'],['R_UpperArm','R_Forearm'],['R_Forearm','R_Hand'],
      ['Pelvis','L_Thigh'],['L_Thigh','L_Calf'],['L_Calf','L_Foot'],['Pelvis','R_Thigh'],['R_Thigh','R_Calf'],['R_Calf','R_Foot']
    ];
    function beInit() {
      if (BE.wrap && BE.wrap.parentNode) return true;
      var host = document.body || document.documentElement;
      if (!host) return false;
      var w = document.createElement('canvas');
      w.setAttribute('data-pb', '1');
      w.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:2147482999';
      host.appendChild(w);
      BE.wrap = w; BE.ctx = w.getContext('2d');
      return true;
    }
    function beClear() { if (BE.ctx && BE.wrap) BE.ctx.clearRect(0, 0, BE.wrap.width, BE.wrap.height); }
    function beHost() {
      var now = performance.now();
      if (BE.host && BE.host.parentNode && now - BE.hostAt < 400) return BE.host;
      BE.hostAt = now;
      var best = null, ba = 0, cs = document.getElementsByTagName('canvas');
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        if (c.getAttribute('data-pb')) continue;
        var r = c.getBoundingClientRect(), a = r.width * r.height;
        if (a > ba) { ba = a; best = c; }
      }
      BE.host = best || null; return BE.host;
    }
    function beProject(cam, r, b, out) {
      if (!BE._v) { try { BE._v = cam.position.clone(); } catch (e) { return false; } }
      var e = b.matrixWorld.elements;
      var d = BE._v.set(e[12], e[13], e[14]).project(cam);
      if (!(d.z > -1 && d.z < 1)) return false;
      out.x = r.left + (d.x * 0.5 + 0.5) * r.width;
      out.y = r.top + (-d.y * 0.5 + 0.5) * r.height;
      return true;
    }
    function beDraw(g) {
      if (!BE.on) { beClear(); return; }
      var cam = g.camera, list = g.bots, self = g.P && g.P.s;
      if (!list || !cam || !self || self.dead) { beClear(); return; }
      if (!beInit()) return;
      var host = beHost();
      if (!host) { beClear(); return; }
      var r = host.getBoundingClientRect();
      if (!(r.width > 0)) { beClear(); return; }
      var dpr = Math.min(2, devicePixelRatio || 1);
      var w = Math.round(innerWidth * dpr), h = Math.round(innerHeight * dpr);
      if (BE.wrap.width !== w || BE.wrap.height !== h) { BE.wrap.width = w; BE.wrap.height = h; }
      var ctx = BE.ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,80,80,0.65)';
      ctx.shadowColor = 'rgba(255,80,80,0.4)'; ctx.shadowBlur = 2;
      var my = self.team, me = cam.matrixWorld.elements;
      var cx = me[12], cy = me[13], cz = me[14];
      var pa = { x: 0, y: 0 }, pb = { x: 0, y: 0 };
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (!p || !p.obj || !p.c || p === self || p.team === my || p.dead || !(p.hp > 0)) continue;
        var mm = p.obj.matrixWorld && p.obj.matrixWorld.elements;
        if (!mm) continue;
        var dist = Math.sqrt((mm[12]-cx)*(mm[12]-cx) + (mm[13]-cy)*(mm[13]-cy) + (mm[14]-cz)*(mm[14]-cz));
        if (dist > BE.range) continue;
        var by = p.c.byName; if (!by) continue;
        for (var j = 0; j < BONE_PAIRS.length; j++) {
          var ba = by[BONE_PAIRS[j][0]], bb = by[BONE_PAIRS[j][1]];
          if (!ba || !bb) continue;
          if (!beProject(cam, r, ba, pa) || !beProject(cam, r, bb, pb)) continue;
          if (pa.x < r.left - 200 || pa.x > r.left + r.width + 200 || pa.y < r.top - 200 || pa.y > r.top + r.height + 200) continue;
          ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
    }

    function eFrame() {
      requestAnimationFrame(eFrame);
      var g = G || game();
      if (g) { try { wbPatch(); } catch (e) {} try { ammoTick(); } catch (e) {} try { dmgTick(); } catch (e) {} }
      if (!E.on) eClear(); else {
        var t = performance.now();
        if (t - E.last >= 33) { E.last = t; if (eInit() && g) { try { eDraw(g); } catch (err) { eClear(); } } }
      }
      try { beDraw(g); } catch (e) { beClear(); }
    }
    try { requestAnimationFrame(eFrame); } catch (e) {}

    var DM = { at: 0, mult: 1.3 };
    function dmgTick() {
      var g = G || game(); if (!g || !g.P) return;
      var now = performance.now();
      if (now < DM.at) return;
      DM.at = now + 500;
      var w = null; try { w = g.P.W; } catch (e) { w = null; }
      if (!w || w.melee || w.c4 || w.grenade || w.dmg || !(w.damage > 0) || w.__pbD) return;
      try { w.damage = Math.round(w.damage * DM.mult); w.__pbD = 1; } catch (e) {}
    }

    var VIS_API = {
      on: function () { E.on = 1; return 'on'; },
      off: function () { E.on = 0; eClear(); return 'off'; },
      is: function () { return E.on; },
      dmg: function (m) { if (typeof m === 'number' && m >= 1 && m <= 3) DM.mult = m; return DM.mult; },
      bone: function (on, range) { BE.on = on ? 1 : 0; if (typeof range === 'number') BE.range = range; if (!on) beClear(); return { on: BE.on, range: BE.range }; }
    };
    window.__pbvis = VIS_API; HIDDEN.pbvis = VIS_API;

    /* WALLBANG */
    var WB = 200;
    function wbGun() {
      try { var g = G || game(); var w = g && g.P && g.P.W; return !!(w && !w.melee && !w.grenade && !w.c4); } catch (e) { return false; }
    }
    function wbPatch() {
      if (!FL.wallbang) return;
      var g = G || game(); var L = g && g.bots;
      if (!L || !L.length) return;
      for (var i = 0; i < L.length; i++) {
        var b = L[i];
        if (!b || b.__wb || typeof b.hitTest !== 'function') continue;
        b.__wb = 1;
        (function (b, f) {
          b.hitTest = function (o, d, m) {
            var r = (FL.wallbang && wbGun() && typeof m === 'number') ? WB : m;
            try { return f.call(this, o, d, r); } catch (e) { return null; }
          };
        })(b, b.hitTest);
      }
    }

    /* AMMO */
    var AM = { at: 0 };
    function ammoTick() {
      if (!FL.infAmmo) return;
      var g = G || game(); if (!g || !g.P) return;
      var now = performance.now();
      if (now < AM.at) return;
      AM.at = now + 200;
      var p = g.P, inv = null, w = null;
      try { inv = p.inv; } catch (e) {}
      if (inv) for (var k in inv) { var s = inv[k]; if (s && typeof s === 'object' && typeof s.reserve === 'number') { try { s.reserve = 999; } catch (e) {} } }
      try { if (typeof p.extReserve === 'number') p.extReserve = 99; } catch (e) {}
      try { w = p.W; } catch (e) { w = null; }
      if (!w || w.melee || w.c4 || w.grenade) return;
      try { if (typeof p.ammo === 'number' && p.ammo !== 999) p.ammo = 999; } catch (e) {}
      try { if (typeof p.reserve === 'number' && p.reserve !== 999) p.reserve = 999; } catch (e) {}
    }

    /* NO RECOIL */
    function nrecTick() {
      requestAnimationFrame(nrecTick);
      if (!FL.noRecoil) return;
      try {
        var g = G || game(); if (!g || !g.P) return;
        var p = g.P, r = p.rec;
        if (r) { r.v = 0; r.A = 0; r.t = 0; r.T = 0; r.hPend = 0; r.hRate = 0; r.hState = 0; }
        if (p.kick) p.kick = 0;
      } catch (e) {}
    }
    try { requestAnimationFrame(nrecTick); } catch (e) {}

    /* ============================================================
       GODMODE v3 — Unlimited Respawn Flicker (Invincible)
       ============================================================ */
    var GB = { s: null, origHit: null, origDie: null, wasDead: false, patched: false, baseHp: 100, lastFlicker: 0 };

    function gbPatch(s) {
      if (!s || GB.s === s) return;
      GB.s = s; GB.patched = false; GB.wasDead = !!s.dead;
      GB.baseHp = (typeof s.maxHp === 'number' && s.maxHp > 1) ? s.maxHp : 100;
      GB.origHit = typeof s.hitTest === 'function' ? s.hitTest : null;
      GB.origDie = typeof s.die === 'function' ? s.die : null;

      try {
        s.hitTest = function () {
          if (FL.godmode && !FL.godmodeOff) return null;
          if (GB.origHit) return GB.origHit.apply(this, arguments);
          return null;
        };
        GB.patched = true;
      } catch (e) {}

      try {
        s.die = function (killer, kind) {
          if (FL.godmode && !FL.godmodeOff) {
            try { this.dead = false; this.hp = GB.baseHp; } catch (e) {}
            return;
          }
          if (GB.origDie) return GB.origDie.apply(this, arguments);
        };
      } catch (e) {}
    }

    function gbTick() {
      requestAnimationFrame(gbTick);
      try {
        var g = G || game();
        if (!g || !g.P || !g.P.s) return;
        var s = g.P.s;
        if (s !== GB.s || !GB.patched) gbPatch(s);

        if (!FL.godmode) {
          GB.wasDead = !!s.dead;
          if (s.obj) s.obj.visible = true;
          return;
        }

        GB.wasDead = !!s.dead;
        if (!s.dead) { try { s.hp = GB.baseHp; } catch (e) {} } else { try { s.dead = false; s.hp = GB.baseHp; } catch (e) {} }

        // Unlimited Flicker (Kedip-kedip terus tanpa batas)
        var now = performance.now();
        if (now - GB.lastFlicker > 100) { // ganti kedipan tiap 100ms
          GB.lastFlicker = now;
          if (s.obj) s.obj.visible = !s.obj.visible;
        }
      } catch (e) {}
    }
    try { requestAnimationFrame(gbTick); } catch (e) {}

    /* NOCLIP */
    var NC = { s: null, m: null, has: 0, gx: 0, gy: 0, gz: 0, o: null, d: null, mv: null, patched: 0 };
    function ncBind() {
      if (!FL.noclip) return;
      var g = G || game();
      if (!g || !g.P || !g.P.s) return;
      var s = g.P.s, m = s.mover; if (!m) return;
      NC.s = s;
      if (NC.m === m && NC.patched) return;
      NC.m = m; NC.has = 0; NC.patched = 1;
      try { m.blocked = function () { return false; }; } catch (e) {}
      try { m.crosses = function () { return false; }; } catch (e) {}
      try { m.depenetrate = function () { return false; }; } catch (e) {}
      try {
        NC.mv = m.move;
        m.move = function () { var r = NC.mv.apply(this, arguments); try { ncGuard(this); } catch (err) {} return r; };
      } catch (e) {}
    }
    function ncProbe(g, x, y, z) {
      try {
        if (!g || typeof g.cast !== 'function') return true;
        if (!NC.o) { NC.o = g.camera.position.clone(); NC.d = g.camera.position.clone(); }
        NC.o.set(x, y, z); NC.d.set(0, -1, 0);
        return !!g.cast(NC.o, NC.d, 3.0);
      } catch (e) { return true; }
    }
    function ncGuard(m) {
      if (!FL.noclip || !m || !m.pos || !isFinite(m.pos.y) || m.jt >= 0 || m.noGrav || m.climb) return;
      if (NC.s && NC.s.dead) { NC.has = 0; return; }
      var p = m.pos, floor = ncProbe(G || game(), p.x, p.y + 1.8, p.z);
      if (floor && m.onGround) { NC.gx = p.x; NC.gy = p.y; NC.gz = p.z; NC.has = 1; return; }
      if (!floor && NC.has && p.y <= NC.gy + 0.05) {
        p.x = NC.gx; p.y = NC.gy; p.z = NC.gz;
        m.vy = 0; m.ft = 0; m.airT = 0; m.jt = -1; m.landT = 1; m.fy0 = NC.gy; m.offY = NC.gy; m.onGround = true;
        try { m.vel.set(0, 0, 0); m.tA = 0; } catch (e) {}
        try { if (m._last) m._last.copy(p); } catch (e) {}
      }
    }
    function ncTick() { requestAnimationFrame(ncTick); try { ncBind(); } catch (e) {} }
    try { requestAnimationFrame(ncTick); } catch (e) {}

    /* QUICK CHANGE */
    var QC = { on: 1, fast: 0, slot: 0, ammo: -1, gate: {}, invRef: null, n: 0, sw: 0, dead: 0 };
    function qcW(p, slot) { try { var s = p.inv[slot]; return s && s.w ? s.w : null; } catch (e) { return null; } }
    function qcTap(code) {
      try {
        var o = { code: code, key: code, bubbles: true, cancelable: true };
        window.dispatchEvent(new KeyboardEvent('keydown', o));
        window.dispatchEvent(new KeyboardEvent('keyup', o));
      } catch (e) {}
    }
    function qcTick() {
      requestAnimationFrame(qcTick);
      try {
        var g = G || game(); if (!g || !g.P || !g.P.s) return;
        var p = g.P, s = p.s; if (!p.inv) return;
        if (QC.invRef !== p.inv) { QC.invRef = p.inv; QC.gate = {}; QC.slot = p.slot; QC.ammo = p.ammo; }
        if (s.dead) { if (!QC.dead) { QC.dead = 1; QC.gate = {}; } QC.slot = p.slot; QC.ammo = p.ammo; return; }
        if (QC.dead) { QC.dead = 0; QC.gate = {}; QC.slot = p.slot; QC.ammo = p.ammo; }
        if (p.slot === QC.slot && typeof p.ammo === 'number' && QC.ammo >= 0 && p.ammo < QC.ammo) { QC.gate[p.slot] = +p.nextShot || 0; QC.n++; }
        if (p.slot !== QC.slot) {
          if (QC.on) {
            p.swapEnd = 0; p.nextShot = QC.fast ? 0 : (QC.gate[p.slot] || 0);
            try { if (p.fpActs && p.fpActs.change) p.fpActs.change.timeScale = 8; } catch (e) {}
            QC.sw++;
          }
          QC.slot = p.slot;
        }
        QC.ammo = p.ammo;
      } catch (e) {}
    }
    try { requestAnimationFrame(qcTick); } catch (e) {}

    var QC_API = {
      cfg: function (o) { if (o) for (var k in o) if (k === 'on' || k === 'fast') QC[k] = o[k]; return { on: QC.on, fast: QC.fast }; },
      on: function () { QC.on = 1; return 'on'; },
      off: function () { QC.on = 0; return 'off'; },
      swap: function () { qcTap('KeyQ'); return 'swap'; },
      st: function () { var g = G || game(), p = g && g.P, w = p && qcW(p, p.slot); return { v: V, on: QC.on, slot: p && p.slot, w: w && w.name, shots: QC.n, swaps: QC.sw, fast: QC.fast }; }
    };
    window.__pbqc = QC_API; HIDDEN.pbqc = QC_API;

    /* OTHER FEATURES (RF, FR, IS, TB, SA, IR, RD, HPO, FC, TR) */
    var PR = { on: 0, ms: 120 };
    function predictPos(bot, ms) {
      try { var mv = bot && bot.mover; if (!mv || !mv.vel) return null; var e = bot.obj && bot.obj.matrixWorld && bot.obj.matrixWorld.elements; if (!e) return null; var t = (ms || 120) / 1000; return { x: e[12] + mv.vel.x * t, y: e[13] + mv.vel.y * t * 0.35, z: e[14] + mv.vel.z * t }; } catch (err) { return null; }
    }
    var RF = { on: 0 };
    function rfTick() {
      requestAnimationFrame(rfTick);
      if (!RF.on) return;
      try { var g = G || game(); if (!g || !g.P) return; var p = g.P, w = null; try { w = p.W; } catch (e) {} if (!w || w.melee || w.c4 || w.grenade) return; if (typeof p.nextShot === 'number' && p.nextShot > 0) p.nextShot = 0; if (typeof p.swapEnd === 'number' && p.swapEnd > 0) p.swapEnd = 0; } catch (e) {}
    }
    try { requestAnimationFrame(rfTick); } catch (e) {}

    var FR = { on: 0, at: 0 };
    function frTick() {
      requestAnimationFrame(frTick);
      if (!FR.on) return;
      var now = performance.now(); if (now < FR.at) return; FR.at = now + 80;
      try { var g = G || game(); if (!g || !g.P) return; var p = g.P, w = null; try { w = p.W; } catch (e) {} if (!w || w.melee || w.grenade || w.c4) return; if (typeof p.reloading === 'number' && p.reloading > 0) { try { if (typeof p.ammo === 'number' && typeof w.mag === 'number') p.ammo = w.mag; } catch (e) {} p.reloading = 0; if (typeof p.reloadT === 'number') p.reloadT = 0; } } catch (e) {}
    }
    try { requestAnimationFrame(frTick); } catch (e) {}

    var IS = { on: 0 };
    function isTick() {
      requestAnimationFrame(isTick);
      if (!IS.on) return;
      try { var g = G || game(); if (!g || !g.P) return; var p = g.P; if (p.fpActs && p.fpActs.scope) p.fpActs.scope.timeScale = 20; if (typeof p.scopeT === 'number' && p.scopeT > 0 && p.scopeT < 0.2) p.scopeT = 0.05; } catch (e) {}
    }
    try { requestAnimationFrame(isTick); } catch (e) {}

    var TB = { on: 0, at: 0 };
    function tbTick() {
      requestAnimationFrame(tbTick);
      if (!TB.on) return;
      var now = performance.now(); if (now < TB.at) return; TB.at = now + 40;
      try {
        var g = G || game(); if (!g || !g.P || !g.P.s) return;
        var p = g.P, s = p.s, w = null; try { w = p.W; } catch (e) {}
        if (!w || w.melee || w.grenade || w.c4 || s.dead) return;
        var cam = g.camera, m = cam.matrixWorld.elements;
        var Cx = m[12], Cy = m[13], Cz = m[14];
        var yaw = +s.yaw || 0, pitch = +s.pitch || 0, cp = Math.cos(pitch);
        var orig = { x: Cx, y: Cy, z: Cz }, dir = { x: -Math.sin(yaw) * cp, y: Math.sin(pitch), z: -Math.cos(yaw) * cp };
        var list = g.bots || [];
        for (var i = 0; i < list.length; i++) {
          var b = list[i];
          if (!b || b === s || b.dead || !(b.hp > 0) || b.team === s.team || typeof b.hitTest !== 'function') continue;
          var h = null; try { h = b.hitTest(orig, dir, 200); } catch (e) { h = null; }
          if (!h || !h.head) continue;
          if (now < nextTap || holding) return;
          down(); holding = true;
          var holdMs = 40 + Math.random() * 25;
          setTimeout(function () { if (holding) up(); }, holdMs);
          nextTap = now + holdMs + 80 + Math.random() * 60;
          return;
        }
      } catch (e) {}
    }
    try { requestAnimationFrame(tbTick); } catch (e) {}

    var SA = { on: 0 };
    function saPatch() {
      var g = G || game(); var L = g && g.bots;
      if (!L || !L.length) return;
      for (var i = 0; i < L.length; i++) {
        var b = L[i];
        if (!b || b.__sa || typeof b.hitTest !== 'function') continue;
        b.__sa = 1;
        (function (b, f) {
          b.hitTest = function (o, d, m) {
            if (!SA.on) return f.call(this, o, d, m);
            try {
              var g2 = G || game(); if (!g2 || !g2.P || !g2.P.s || !wbGun()) return f.call(this, o, d, m);
              var hp = headPoint(this); if (!hp) return f.call(this, o, d, m);
              var cam = g2.camera, me = cam.matrixWorld.elements;
              var ox = me[12], oy = me[13], oz = me[14];
              var dx = hp.x - ox, dy = hp.y - oy, dz = hp.z - oz;
              var len = Math.sqrt(dx * dx + dy * dy + dz * dz); if (len < 1) return f.call(this, o, d, m);
              return f.call(this, { x: ox, y: oy, z: oz }, { x: dx / len, y: dy / len, z: dz / len }, len + 1);
            } catch (e) { return f.call(this, o, d, m); }
          };
        })(b, b.hitTest);
      }
    }

    var IR = { on: 0, at: 0 };
    function irTick() {
      requestAnimationFrame(irTick);
      if (!IR.on) return;
      var now = performance.now(); if (now < IR.at) return; IR.at = now + 200;
      try { var g = G || game(); if (!g || !g.P || !g.P.s) return; var s = g.P.s; if (s.dead && !FL.godmodeOff) { s.dead = false; if (GB.baseHp) { try { s.hp = GB.baseHp; } catch (e) {} } } } catch (e) {}
    }
    try { requestAnimationFrame(irTick); } catch (e) {}

    var RD = { on: 0, el: null, dots: [], last: 0 };
    function rdInit() {
      if (RD.el && RD.el.parentNode) return true;
      var host = document.body || document.documentElement;
      if (!host) return false;
      var w = document.createElement('div');
      w.setAttribute('data-pb', '1');
      w.style.cssText = 'position:fixed;right:8px;bottom:8px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.7);border:1px solid rgba(0,180,80,.6);z-index:2147483000;pointer-events:none;display:none';
      host.appendChild(w); RD.el = w; RD.dots = [];
      return true;
    }
    function rdDraw(g) {
      if (!RD.on) { if (RD.el) RD.el.style.display = 'none'; return; }
      if (!rdInit()) return;
      RD.el.style.display = 'block';
      var now = performance.now(); if (now - RD.last < 50) return; RD.last = now;
      var s = g.P && g.P.s; if (!s || !s.mover || !s.mover.pos) return;
      var sx = s.mover.pos.x, sz = s.mover.pos.z, yaw = +s.yaw || 0, range = 60, list = g.bots || [], idx = 0;
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (!p || p === s || p.dead || !(p.hp > 0) || p.team === s.team) continue;
        var e = p.obj && p.obj.matrixWorld && p.obj.matrixWorld.elements; if (!e) continue;
        var dx = e[12] - sx, dz = e[14] - sz, d = Math.sqrt(dx * dx + dz * dz); if (d > range) continue;
        var ca = Math.cos(-yaw), sa = Math.sin(-yaw);
        var rx = dx * ca - dz * sa, rz = dx * sa + dz * ca;
        var cx = 60 + (rx / range) * 55, cz = 60 + (rz / range) * 55;
        var dot = RD.dots[idx];
        if (!dot) {
          dot = document.createElement('div');
          dot.style.cssText = 'position:absolute;width:5px;height:5px;margin:-2.5px 0 0 -2.5px;border-radius:50%;background:#ef4444';
          RD.el.appendChild(dot); RD.dots[idx] = dot;
        }
        dot.style.display = 'block'; dot.style.left = cx.toFixed(1) + 'px'; dot.style.top = cz.toFixed(1) + 'px';
        idx++;
      }
      for (; idx < RD.dots.length; idx++) RD.dots[idx].style.display = 'none';
    }

    var HPO = { on: 0 };
    (function hpoHook() {
      var _eSlot = eSlot;
      eSlot = function (i) {
        var s = _eSlot(i);
        if (!s.tx2) { s.tx2 = document.createElement('div'); s.tx2.style.cssText = 'position:absolute;left:0;top:-15px;font:10px/12px Tahoma,sans-serif;color:#c0392b;text-shadow:0 1px 2px #fff;white-space:nowrap;font-weight:700'; s.box.appendChild(s.tx2); }
        return s;
      };
      var _eDraw = eDraw;
      eDraw = function (g) {
        _eDraw(g);
        if (!HPO.on) return;
        try {
          var list = g.bots || [], self = g.P && g.P.s, idx = 0;
          for (var i = 0; i < list.length; i++) {
            var p = list[i];
            if (!p || p === self || p.dead || !(p.hp > 0) || p.team === self.team) continue;
            var s = E.slots[idx++];
            if (s && s.tx2) { s.tx2.textContent = Math.round(p.hp) + ' HP'; s.tx2.style.display = 'block'; }
          }
          for (; idx < E.slots.length; idx++) { var s2 = E.slots[idx]; if (s2 && s2.tx2) s2.tx2.style.display = 'none'; }
        } catch (e) {}
      };
    })();

    var FC = { on: 1, el: null, last: 0 };
    function fcInit() {
      if (FC.el && FC.el.parentNode) return true;
      var host = document.body || document.documentElement;
      if (!host) return false;
      var w = document.createElement('div');
      w.setAttribute('data-pb', '1');
      w.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);border:1.5px dashed rgba(0,180,80,.85);border-radius:50%;z-index:2147482999;pointer-events:none;display:none';
      host.appendChild(w); FC.el = w;
      return true;
    }
    function fcTick() {
      requestAnimationFrame(fcTick);
      if (!FC.on) { if (FC.el) FC.el.style.display = 'none'; return; }
      if (!fcInit()) return;
      FC.el.style.display = 'block';
      FC.el.style.width = (P.povCircleR * 2).toFixed(0) + 'px';
      FC.el.style.height = (P.povCircleR * 2).toFixed(0) + 'px';
    }
    try { requestAnimationFrame(fcTick); } catch (e) {}

    var SL = { on: 0 };
    var _naTarget = naTarget;
    naTarget = function (g, off) {
      var t = _naTarget(g, off);
      if (!t || !SL.on || !t.bot) return t;
      var pp = predictPos(t.bot, 300);
      if (pp) { t.x = pp.x; t.z = pp.z; }
      return t;
    };

    var TR = { on: 0, wrap: null, host: null, hostAt: 0, slots: [], last: 0 };
    function trInit() {
      if (TR.wrap && TR.wrap.parentNode) return true;
      var host = document.body || document.documentElement;
      if (!host) return false;
      var w = document.createElement('div');
      w.setAttribute('data-pb', '1');
      w.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:2147482999';
      host.appendChild(w); TR.wrap = w; TR.slots = [];
      return true;
    }
    function trSlot(i) {
      var s = TR.slots[i];
      if (s) return s;
      var line = document.createElement('div');
      line.style.cssText = 'position:absolute;left:0;top:0;height:1.5px;background:linear-gradient(90deg,rgba(16,185,129,.95),rgba(16,185,129,.35));transform-origin:0 50%;display:none;box-shadow:0 0 4px rgba(16,185,129,.6);border-radius:1px';
      TR.wrap.appendChild(line); s = { line: line }; TR.slots[i] = s;
      return s;
    }
    function trClear() { for (var i = 0; i < TR.slots.length; i++) TR.slots[i].line.style.display = 'none'; }
    function trHost() {
      var now = performance.now();
      if (TR.host && TR.host.parentNode && now - TR.hostAt < 400) return TR.host;
      TR.hostAt = now;
      var best = null, ba = 0, cs = document.getElementsByTagName('canvas');
      for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        if (c.getAttribute('data-pb')) continue;
        var r = c.getBoundingClientRect(), a = r.width * r.height;
        if (a > ba) { ba = a; best = c; }
      }
      TR.host = best || null; return TR.host;
    }
    var _trV = null;
    function trProj(cam, r, x, y, z) {
      if (!_trV) { try { _trV = cam.position.clone(); } catch (e) { return null; } }
      var d = _trV.set(x, y, z).project(cam);
      if (!(d.z > -1 && d.z < 1)) return null;
      return { x: r.left + (d.x * 0.5 + 0.5) * r.width, y: r.top + (-d.y * 0.5 + 0.5) * r.height };
    }
    function trDraw(g) {
      if (!TR.on) { if (TR.wrap) trClear(); return; }
      var cam = g.camera, list = g.bots, self = g.P && g.P.s;
      if (!list || !cam || !self || self.dead) { trClear(); return; }
      if (!trInit()) return;
      var host = trHost(); if (!host) { trClear(); return; }
      var r = host.getBoundingClientRect(); if (!(r.width > 0)) { trClear(); return; }
      var ox = r.left + r.width / 2, oy = r.top;
      var my = self.team, idx = 0;
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        if (!p || !p.obj || !p.c || p === self || p.team === my || p.dead || !(p.hp > 0)) continue;
        var hp = headPoint(p); if (!hp) continue;
        var t = trProj(cam, r, hp.x, hp.y, hp.z); if (!t) continue;
        if (t.x < r.left - 40 || t.x > r.left + r.width + 40 || t.y < r.top - 40 || t.y > r.top + r.height + 40) continue;
        var dx = t.x - ox, dy = t.y - oy, len = Math.sqrt(dx * dx + dy * dy); if (len < 20) continue;
        var ang = Math.atan2(dy, dx) * 180 / Math.PI;
        var s = trSlot(idx++);
        s.line.style.display = 'block'; s.line.style.left = ox.toFixed(1) + 'px'; s.line.style.top = oy.toFixed(1) + 'px';
        s.line.style.width = len.toFixed(1) + 'px'; s.line.style.transform = 'rotate(' + ang.toFixed(2) + 'deg)';
      }
      for (; idx < TR.slots.length; idx++) TR.slots[idx].line.style.display = 'none';
    }

    var PBX_API = {
      pred: function (on, ms) { PR.on = on ? 1 : 0; if (typeof ms === 'number') PR.ms = ms; return { on: PR.on, ms: PR.ms }; },
      rapid: function (on) { RF.on = on ? 1 : 0; return RF.on; },
      fastReload: function (on) { FR.on = on ? 1 : 0; return FR.on; },
      instScope: function (on) { IS.on = on ? 1 : 0; return IS.on; },
      trig: function (on) { TB.on = on ? 1 : 0; return TB.on; },
      silent: function (on) { SA.on = on ? 1 : 0; saPatch(); return SA.on; },
      lob: function (on) { SL.on = on ? 1 : 0; return SL.on; },
      respawn: function (on) { IR.on = on ? 1 : 0; return IR.on; },
      radar: function (on) { RD.on = on ? 1 : 0; if (!on && RD.el) RD.el.style.display = 'none'; return RD.on; },
      hpo: function (on) { HPO.on = on ? 1 : 0; return HPO.on; },
      fovc: function (on) { FC.on = on ? 1 : 0; return FC.on; },
      tracer: function (on) { TR.on = on ? 1 : 0; if (!on) trClear(); return TR.on; },
      wallbang: function (on) { FL.wallbang = on ? 1 : 0; return FL.wallbang; },
      infAmmo: function (on) { FL.infAmmo = on ? 1 : 0; return FL.infAmmo; },
      noRecoil: function (on) { FL.noRecoil = on ? 1 : 0; return FL.noRecoil; },
      godmode: function (on) { FL.godmode = on ? 1 : 0; return FL.godmode; },
      noclip: function (on) { FL.noclip = on ? 1 : 0; if (!FL.noclip) NC.patched = 0; return FL.noclip; },
      nadeAim: function (on) { FL.nadeAim = on ? 1 : 0; NA.aim = FL.nadeAim ? 1 : 0; return FL.nadeAim; },
      antiKick: function (on) { FL.antiKick = on ? 1 : 0; return FL.antiKick; },
      st: function () {
        return { pred: PR.on, rapid: RF.on, fastReload: FR.on, instScope: IS.on, trig: TB.on, silent: SA.on, lob: SL.on, respawn: IR.on, radar: RD.on, hpo: HPO.on, fovc: FC.on, tracer: TR.on, wallbang: FL.wallbang, infAmmo: FL.infAmmo, noRecoil: FL.noRecoil, godmode: FL.godmode, noclip: FL.noclip, nadeAim: FL.nadeAim, antiKick: FL.antiKick };
      }
    };
    window.__pbx = PBX_API; HIDDEN.pbx = PBX_API;

    (function pbxFrame() {
      requestAnimationFrame(pbxFrame);
      try { var g = G || game(); if (!g) return; if (SA.on) saPatch(); if (RD.on) rdDraw(g); if (TR.on) trDraw(g); } catch (e) {}
    })();

    (function hideAPIs() {
      try {
        ['__pb', '__pbvis', '__pbnade', '__pbqc', '__pbx'].forEach(function (k) {
          try { var v = window[k]; if (!v) return; Object.defineProperty(window, k, { configurable: false, enumerable: false, get: function () { return v; } }); } catch (e) {}
        });
      } catch (e) {}
    })();

    log(BRAND, V, 'up');
    requestAnimationFrame(tick);

    /* ============================================================
       UI PANEL v4 — Layout Sidebar Kanan + Collapse Mode Horizontal
       ============================================================ */
    (function pbUI() {
      if (window.__pbUI) return;
      window.__pbUI = 1;

      if (!document.querySelector('link[data-pb-fa]')) {
        var fa = document.createElement('link');
        fa.setAttribute('data-pb-fa', '1');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
        (document.head || document.documentElement).appendChild(fa);
      }

      var css = `
        .fk{position:fixed;top:50%;right:12px;transform:translateY(-50%);
          z-index:2147483600;font:12px/1.35 system-ui,Tahoma,sans-serif;color:#1f2937;
          background:#fff;border:1px solid #e2e8f0;border-radius:12px;
          box-shadow:0 8px 30px rgba(0,0,0,.2);display:flex;
          pointer-events:auto;user-select:none;overflow:hidden;transition:width .2s}
        
        /* Mode Collapsed (Minimize ke bentuk tabbar memanjang ke samping) */
        .fk.collapsed{width:auto;height:auto;border-radius:20px;padding:0 8px 0 0;transform:translateY(-50%)}
        .fk.collapsed .fk-body-wrap{display:none}
        .fk.collapsed .fk-nav{display:none}
        .fk.collapsed .fk-mini-bar{display:flex}
        
        /* Mode Expanded */
        .fk-body-wrap{order:1;width:320px;flex:0 0 320px;display:flex;flex-direction:column;background:#f8fafc;border-radius:12px 0 0 12px}
        .fk-nav{display:flex;flex-direction:column;background:#fff;
          border-left:1px solid #e2e8f0;order:2;width:64px;flex:0 0 64px;border-radius:0 12px 12px 0}
        
        /* Mini Bar (Horizontal) */
        .fk-mini-bar{display:none;align-items:center;justify-content:center;gap:8px;
          padding:8px 12px;background:#7c3aed;color:#fff;cursor:pointer;border-radius:20px;
          font-weight:800;font-size:13px;letter-spacing:1px;box-shadow:0 4px 10px rgba(124,58,237,0.4)}
        .fk-mini-bar:hover{background:#6d28d9}
        .fk-mini-bar i{font-size:16px}
        .fk-mini-bar .txt{font-size:12px}
        
        /* Sidebar Kanan */
        .fk-brand{display:flex;align-items:center;justify-content:center;
          padding:12px 0;border-bottom:1px solid #e2e8f0;color:#7c3aed;font-size:18px}
        .fk-tab-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;
          padding:12px 0;gap:4px;cursor:pointer;color:#64748b;font-size:14px;
          border-left:3px solid transparent;transition:.15s}
        .fk-tab-btn:hover{background:#f1f5f9;color:#334155}
        .fk-tab-btn.on{color:#7c3aed;border-left-color:#7c3aed;background:#f5f3ff}
        .fk-tab-btn small{font-size:8px;font-weight:800;letter-spacing:.3px}
        .fk-collapse{margin-top:auto;display:flex;align-items:center;justify-content:center;
          padding:12px 0;cursor:pointer;color:#94a3b8;border-top:1px solid #e2e8f0;font-size:16px}
        .fk-collapse:hover{color:#334155;background:#f1f5f9}

        /* Header Content */
        .fk-h{display:flex;align-items:center;gap:8px;padding:10px 12px;
          border-bottom:1px solid #e2e8f0;background:#fff;font-weight:800;cursor:move;border-radius:12px 0 0 0}
        .fk-h .dot{width:9px;height:9px;border-radius:50%;background:#7c3aed;box-shadow:0 0 6px #a78bfa}
        .fk-h .title{font-size:13px;color:#0f172a;letter-spacing:.4px}
        .fk-h .v{opacity:.85;font-weight:400;font-size:10px;margin-left:auto;color:#64748b}
        
        /* Body / Content */
        .fk-body{padding:10px 12px;max-height:65vh;overflow-y:auto;background:#fff;flex:1;border-radius:0 0 0 12px}
        .fk-body::-webkit-scrollbar{width:5px}
        .fk-body::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
        .fk-page{display:none}
        .fk-page.on{display:block}
        
        /* Elements */
        .fk-sec{margin:12px 0 6px;font-size:10px;letter-spacing:1px;color:#7c3aed;text-transform:uppercase;font-weight:800;display:flex;align-items:center;gap:6px}
        .fk-sec:first-child{margin-top:0}
        .fk-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 0;border-bottom:1px dashed #f1f5f9}
        .fk-row:last-child{border-bottom:none}
        .fk-row .info{flex:1;min-width:0}
        .fk-row .info b{display:block;color:#1e293b;font-size:12px;font-weight:600}
        .fk-row .info small{display:block;color:#94a3b8;font-size:10px;margin-top:1px;line-height:1.3}
        .fk-row .risk-badge{display:inline-block;padding:0 4px;margin-left:4px;border-radius:3px;font-size:8px;background:#f59e0b;color:#fff;font-weight:900;vertical-align:middle}
        
        .fk-sw{position:relative;width:36px;height:20px;flex:0 0 36px;border-radius:10px;background:#cbd5e1;transition:background .15s;cursor:pointer}
        .fk-sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.2);transition:transform .15s}
        .fk-sw.on{background:#7c3aed}
        .fk-sw.on::after{transform:translateX(16px)}
        
        .fk-slider{padding:6px 0}
        .fk-slider .head{display:flex;justify-content:space-between;font-size:11px;color:#334155;margin-bottom:4px}
        .fk-slider .head span{color:#7c3aed;font-weight:700}
        .fk-slider input[type=range]{width:100%;height:3px;-webkit-appearance:none;background:#e2e8f0;border-radius:2px}
        .fk-slider input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#7c3aed;cursor:pointer}
          
        .fk-select{width:100%;box-sizing:border-box;padding:6px 8px;border:1px solid #cbd5e1;border-radius:6px;font:12px system-ui;outline:none;margin-top:4px}
        .fk-hint{font-size:10px;color:#64748b;line-height:1.4;background:#f1f5f9;border-radius:6px;padding:6px 8px;margin-top:6px}
        .fk-btn{width:100%;padding:8px 0;text-align:center;border-radius:6px;background:#f1f5f9;border:1px solid #cbd5e1;color:#334155;cursor:pointer;font-size:11px;font-weight:600;margin-top:8px}
        .fk-btn:hover{background:#e2e8f0}
        .fk-btn.danger{background:#fef2f2;border-color:#fca5a5;color:#b91c1c}
        
        .fk-foot{font-size:10px;color:#64748b;background:#f8fafc;padding:8px;border-radius:6px;margin-top:6px}
        .fk-warn{padding:8px;border-radius:6px;background:#fffbeb;border:1px solid #fcd34d;color:#92400e;font-size:10px;margin-top:8px}
      `;

      var style = document.createElement('style');
      style.setAttribute('data-pb', '1');
      style.textContent = css;
      (document.head || document.documentElement).appendChild(style);

      function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
      function icon(name) { return el('i', 'fa-solid fa-' + name); }
      
      function toggle(init, onChange) {
        var sw = el('div', 'fk-sw' + (init ? ' on' : ''));
        var state = !!init;
        sw.addEventListener('click', function () {
          state = !state; sw.classList.toggle('on', state);
          try { onChange(state); } catch (e) {}
          refreshFoot();
        });
        return { node: sw, get: function () { return state; }, set: function (v) { state = !!v; sw.classList.toggle('on', state); } };
      }
      
      function slider(min, max, step, val, fmt, onChange) {
        var wrap = el('div', 'fk-slider');
        var head = el('div', 'head');
        var lb = el('b', null, '');
        var num = el('span', null, fmt(val));
        head.appendChild(lb); head.appendChild(num);
        var inp = document.createElement('input');
        inp.type = 'range'; inp.min = min; inp.max = max; inp.step = step; inp.value = val;
        inp.addEventListener('input', function () {
          var v = parseFloat(inp.value);
          num.textContent = fmt(v);
          try { onChange(v); } catch (e) {}
        });
        wrap.appendChild(head); wrap.appendChild(inp);
        return { node: wrap, label: lb, input: inp, set: function (v) { inp.value = v; num.textContent = fmt(v); } };
      }
      
      function row(label, desc, node, risk) {
        var r = el('div', 'fk-row');
        var info = el('div', 'info');
        var b = el('b', null, label);
        if (risk) b.appendChild(el('span', 'risk-badge', 'RISK'));
        info.appendChild(b);
        if (desc) info.appendChild(el('small', null, desc));
        r.appendChild(info); r.appendChild(node);
        return r;
      }
      
      function sec(iconName, label) {
        var s = el('div', 'fk-sec');
        s.appendChild(icon(iconName)); s.appendChild(document.createTextNode(label));
        return s;
      }

      var panel = el('div', 'fk');
      panel.setAttribute('data-pb', '1');

      // Mini Bar (Collapsed mode)
      var miniBar = el('div', 'fk-mini-bar');
      var miniIcon = icon('crosshairs');
      var miniTxt = el('div', 'txt', 'iRiLLL MODZ');
      var miniPlus = el('i', 'fa-solid fa-plus');
      miniPlus.style.fontSize = '12px';
      miniPlus.style.marginLeft = '4px';
      miniBar.appendChild(miniIcon);
      miniBar.appendChild(miniTxt);
      miniBar.appendChild(miniPlus);
      panel.appendChild(miniBar);

      // Sidebar Kanan
      var nav = el('div', 'fk-nav');
      var brand = el('div', 'fk-brand');
      brand.appendChild(icon('crosshairs'));
      nav.appendChild(brand);

      var collapseBtn = el('div', 'fk-collapse');
      collapseBtn.appendChild(icon('chevron-right'));
      collapseBtn.title = 'Minimize ( - )';
      nav.appendChild(collapseBtn);

      // Body Content (Kiri)
      var bodyWrap = el('div', 'fk-body-wrap');
      var head = el('div', 'fk-h');
      head.appendChild(el('div', 'dot'));
      head.appendChild(el('div', 'title', 'iRiLLL MODZ'));
      head.appendChild(el('div', 'v', 'V' + V));
      var body = el('div', 'fk-body');
      bodyWrap.appendChild(head); bodyWrap.appendChild(body);

      panel.appendChild(bodyWrap);
      panel.appendChild(nav);

      // Setup Tabs
      var TABS = [
        { key: 'aim',   icon: 'bullseye',           label: 'AIM' },
        { key: 'esp',   icon: 'eye',                label: 'ESP' },
        { key: 'gacor', icon: 'bolt',               label: 'GACOR' },
        { key: 'misc',  icon: 'screwdriver-wrench', label: 'MISC' },
        { key: 'info',  icon: 'circle-info',        label: 'INFO' }
      ];
      var tabs = {}, pages = {}, order = [];

      TABS.forEach(function (t) {
        var btn = el('div', 'fk-tab-btn');
        btn.appendChild(icon(t.icon));
        btn.appendChild(el('small', null, t.label));
        btn.addEventListener('click', function () { selectTab(t.key); });
        nav.insertBefore(btn, collapseBtn);
        tabs[t.key] = btn;
        var page = el('div', 'fk-page');
        body.appendChild(page);
        pages[t.key] = page;
        order.push(t.key);
      });

      function selectTab(key) {
        order.forEach(function (k) {
          tabs[k].classList.toggle('on', k === key);
          pages[k].classList.toggle('on', k === key);
        });
        try { localStorage.setItem('ir_ui_tab', key); } catch (e) {}
        if (panel.classList.contains('collapsed')) setCollapsed(false);
      }
      
      function setCollapsed(c) {
        panel.classList.toggle('collapsed', c);
        var i = collapseBtn.querySelector('i');
        if (i) i.className = c ? 'fa-solid fa-plus' : 'fa-solid fa-chevron-right';
        try { localStorage.setItem('ir_collapsed', c ? '1' : '0'); } catch (e) {}
      }
      
      collapseBtn.addEventListener('click', function (e) { e.stopPropagation(); setCollapsed(!panel.classList.contains('collapsed')); });
      miniBar.addEventListener('click', function() { setCollapsed(false); });

      /* ============ KONTEN TIAP TAB ============ */
      var pAim = pages['aim'];
      pAim.appendChild(sec('crosshairs', 'Aim Mode'));
      var modeInfo = el('div', 'fk-hint');
      pAim.appendChild(modeInfo);
      
      function updateModeInfo() {
        modeInfo.innerHTML = (P.aimMode === 'legacy')
          ? '<b>LEGACY</b> Aim ke target di mana saja, bisa tembus dinding & di luar lingkaran.'
          : '<b>POV</b> Aim ke target yang masuk lingkaran & terlihat.';
      }
      updateModeInfo();

      var povT = toggle(P.aimMode !== 'legacy', function (on) {
        window.__pb.aimMode(on ? 'pov' : 'legacy'); updateModeInfo();
      });
      pAim.appendChild(row('POV Mode', 'Target wajib masuk lingkaran', povT.node));

      pAim.appendChild(sec('location-crosshairs', 'Target Hitbox'));
      var hitboxSelect = el('select', 'fk-select');
      hitboxSelect.innerHTML = `<option value="head">Kepala (Head)</option><option value="body">Badan (Body)</option><option value="nearest">Terdekat (Nearest)</option>`;
      hitboxSelect.value = P.hitbox;
      hitboxSelect.addEventListener('change', function () { window.__pb.hitbox(this.value); });
      pAim.appendChild(hitboxSelect);

      pAim.appendChild(sec('gun', 'Aimbot'));
      var aimT = toggle(!!(window.__pb && window.__pb.state().aim), function (on) { if (on) window.__pb.on(); else window.__pb.off(); });
      pAim.appendChild(row('Aim Lock', 'Kunci target otomatis', aimT.node));
      var autoFireT = toggle(!!P.autoFire, function (on) { P.autoFire = on ? 1 : 0; });
      pAim.appendChild(row('Auto Fire', 'Tembak otomatis saat lock', autoFireT.node));

      var pVis = pages['esp'];
      pVis.appendChild(sec('circle-dot', 'Lingkaran Aim (POV)'));
      var fcT = toggle(!!FC.on, function (on) { window.__pbx.fovc(on); });
      pVis.appendChild(row('Tampilkan Lingkaran', 'Ring visual batas aimbot', fcT.node));
      var povCircleS = slider(40, 400, 10, P.povCircleR, function (v) { return v.toFixed(0) + 'px'; }, function (v) { window.__pb.povCircle(v); });
      povCircleS.label.textContent = 'Ukuran Lingkaran';
      pVis.appendChild(povCircleS.node);

      pVis.appendChild(sec('layer-group', 'Overlay Visual'));
      var espT = toggle(!!(window.__pbvis && window.__pbvis.is()), function (on) { if (on) window.__pbvis.on(); else window.__pbvis.off(); });
      pVis.appendChild(row('ESP Kotak', 'Kotak di sekitar musuh', espT.node));
      var boneT = toggle(!!BE.on, function (on) { window.__pbvis.bone(on, BE.range); });
      pVis.appendChild(row('ESP Tulang', 'Garis tulang musuh', boneT.node, true));
      var hpoT = toggle(!!HPO.on, function (on) { window.__pbx.hpo(on); });
      pVis.appendChild(row('Tampilkan HP', 'Angka HP musuh', hpoT.node));
      var rdT = toggle(!!RD.on, function (on) { window.__pbx.radar(on); });
      pVis.appendChild(row('Radar Mini', 'Radar musuh di kanan bawah', rdT.node));

      var pGac = pages['gacor'];
      pGac.appendChild(sec('bolt', 'Enhancement'));
      var predT = toggle(!!PR.on, function (on) { window.__pbx.pred(on, PR.ms); });
      pGac.appendChild(row('Prediction', 'Aim ke posisi depan musuh', predT.node, true));
      var saT = toggle(!!SA.on, function (on) { window.__pbx.silent(on); });
      pGac.appendChild(row('Silent Aim', 'Auto headshot tanpa geser kamera', saT.node, true));
      var tbT = toggle(!!TB.on, function (on) { window.__pbx.trig(on); });
      pGac.appendChild(row('Auto Trigger', 'Tembak otomatis saat crosshair kena', tbT.node, true));

      pGac.appendChild(sec('gun', 'Senjata'));
      var rapidT = toggle(!!RF.on, function (on) { window.__pbx.rapid(on); });
      pGac.appendChild(row('Rapid Fire', 'Hilangkan jeda tembak', rapidT.node, true));
      var frT = toggle(!!FR.on, function (on) { window.__pbx.fastReload(on); });
      pGac.appendChild(row('Fast Reload', 'Reload instan', frT.node, true));
      var wallT = toggle(!!FL.wallbang, function (on) { window.__pbx.wallbang(on); });
      pGac.appendChild(row('Wallbang', 'Peluru tembus dinding', wallT.node, true));
      var ammoT = toggle(!!FL.infAmmo, function (on) { window.__pbx.infAmmo(on); });
      pGac.appendChild(row('Ammo Terbatas', 'Ammo tidak habis', ammoT.node, true));
      var nrecT = toggle(!!FL.noRecoil, function (on) { window.__pbx.noRecoil(on); });
      pGac.appendChild(row('Tanpa Recoil', 'Kick senjata jadi 0', nrecT.node, true));

      var pMisc = pages['misc'];
      pMisc.appendChild(sec('heart-pulse', 'Survival'));
      var irT = toggle(!!IR.on, function (on) { window.__pbx.respawn(on); });
      pMisc.appendChild(row('Respawn Instan', 'Auto respawn saat mati', irT.node));
      var godT = toggle(!!FL.godmode, function (on) { window.__pbx.godmode(on); });
      pMisc.appendChild(row('Godmode (Flicker)', 'Kedip-kedip kebal hit tanpa batas', godT.node, true));
      var ncT = toggle(!!FL.noclip, function (on) { window.__pbx.noclip(on); });
      pMisc.appendChild(row('Noclip', 'Tembus dinding', ncT.node, true));
      
      pMisc.appendChild(sec('wand-magic-sparkles', 'Utility'));
      var nadeT = toggle(!!(window.__pbnade && window.__pbnade.is()), function (on) { window.__pbx.nadeAim(on); });
      pMisc.appendChild(row('Nade Aim', 'Granat auto-aim', nadeT.node, true));
      var akT = toggle(!!FL.antiKick, function (on) { window.__pbx.antiKick(on); });
      pMisc.appendChild(row('Anti-Kick', 'Tahan dari kick/ban', akT.node, true));

      var pInfo = pages['info'];
      pInfo.appendChild(sec('chart-line', 'Status'));
      var foot = el('div', 'fk-foot', 'engine belum siap…');
      pInfo.appendChild(foot);
      
      var resetBtn = el('div', 'fk-btn danger');
      resetBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Reset Semua Fitur';
      resetBtn.addEventListener('click', function () {
        try {
          window.__pb.on(); window.__pbvis.on(); window.__pbnade.on(); window.__pbqc.on(); window.__pbqc.cfg({ fast: 0 });
          window.__pbx.pred(0); window.__pbx.rapid(0); window.__pbx.fastReload(0); window.__pbx.instScope(0); window.__pbx.trig(0); window.__pbx.silent(0);
          window.__pbx.lob(0); window.__pbx.respawn(0); window.__pbx.radar(0); window.__pbx.hpo(0); window.__pbx.fovc(1); window.__pbx.tracer(0);
          window.__pbx.wallbang(1); window.__pbx.infAmmo(1); window.__pbx.noRecoil(1); window.__pbx.godmode(0); window.__pbx.noclip(0); window.__pbx.nadeAim(1); window.__pbx.antiKick(1);
          window.__pbvis.bone(0); window.__pb.hitbox('head'); syncAll();
        } catch (e) {}
      });
      pInfo.appendChild(resetBtn);
      pInfo.appendChild(el('div', 'fk-warn', '<i class="fa-solid fa-triangle-exclamation"></i> Fitur RISK bisa kena flag server. Pakai bijak di ranked.'));

      function refreshFoot() {
        try {
          var s2 = window.__pb && window.__pb.state();
          if (!s2) { foot.textContent = 'engine belum siap…'; return; }
          var parts = [];
          parts.push(s2.aim ? '<b style="color:#16a34a">AIM ON</b>' : 'AIM OFF');
          parts.push(s2.aimMode === 'legacy' ? 'LEGACY' : 'POV');
          parts.push(s2.hitbox.toUpperCase());
          parts.push(s2.G ? 'G✓' : 'G✕');
          parts.push('enemy ' + s2.enemies);
          parts.push('lock ' + s2.lock);
          if (s2.lock) parts.push(s2.dist.toFixed(1) + 'm');
          foot.innerHTML = parts.join(' · ');
        } catch (e) { foot.textContent = '…'; }
      }
      setInterval(refreshFoot, 500);

      function syncAll() {
        try {
          if (window.__pb) {
            aimT.set(!!window.__pb.state().aim);
            povT.set(window.__pb.state().aimMode !== 'legacy');
            hitboxSelect.value = window.__pb.state().hitbox;
            updateModeInfo();
          }
          if (window.__pbvis) espT.set(!!window.__pbvis.is());
          if (window.__pbx) {
            var x = window.__pbx.st();
            predT.set(!!x.pred); rapidT.set(!!x.rapid); frT.set(!!x.fastReload);
            tbT.set(!!x.trig); saT.set(!!x.silent); irT.set(!!x.respawn); rdT.set(!!x.radar); hpoT.set(!!x.hpo); fcT.set(!!x.fovc);
            wallT.set(!!x.wallbang); ammoT.set(!!x.infAmmo); nrecT.set(!!x.noRecoil); godT.set(!!x.godmode); ncT.set(!!x.noclip); nadeT.set(!!x.nadeAim); akT.set(!!x.antiKick);
          }
        } catch (e) {}
      }
      setInterval(syncAll, 1000);

      // Drag via Header
      (function () {
        var dragging = false, ox = 0, oy = 0;
        head.addEventListener('mousedown', function (e) {
          dragging = true;
          var r = panel.getBoundingClientRect();
          ox = e.clientX - r.left; oy = e.clientY - r.top;
          e.preventDefault();
        });
        head.addEventListener('touchstart', function (e) {
          if (!e.touches || !e.touches[0]) return;
          var t = e.touches[0];
          dragging = true;
          var r = panel.getBoundingClientRect();
          ox = t.clientX - r.left; oy = t.clientY - r.top;
        }, { passive: true });
        addEventListener('mousemove', function (e) {
          if (!dragging) return;
          var x = e.clientX - ox, y = e.clientY - oy;
          x = Math.max(4, Math.min(innerWidth - 60, x)); y = Math.max(4, Math.min(innerHeight - 40, y));
          panel.style.left = x + 'px'; panel.style.top = y + 'px'; panel.style.right = 'auto'; panel.style.transform = 'none';
        });
        addEventListener('touchmove', function (e) {
          if (!dragging) return;
          if (!e.touches || !e.touches[0]) return;
          var t = e.touches[0];
          var x = t.clientX - ox, y = t.clientY - oy;
          x = Math.max(4, Math.min(innerWidth - 60, x)); y = Math.max(4, Math.min(innerHeight - 40, y));
          panel.style.left = x + 'px'; panel.style.top = y + 'px'; panel.style.right = 'auto'; panel.style.transform = 'none';
        }, { passive: true });
        addEventListener('mouseup', function () { dragging = false; });
        addEventListener('touchend', function () { dragging = false; });
      })();

      function mount() {
        var host = document.body || document.documentElement;
        if (!host) return setTimeout(mount, 100);
        host.appendChild(panel);
        var lastTab = 'aim';
        try { lastTab = localStorage.getItem('ir_ui_tab') || 'aim'; } catch (e) {}
        if (!tabs[lastTab]) lastTab = 'aim';
        selectTab(lastTab);
        var collapsed = false;
        try { collapsed = localStorage.getItem('ir_collapsed') === '1'; } catch (e) {}
        setCollapsed(collapsed);
        refreshFoot();
      }
      mount();

      log('iRiLLL MODZ UI v4 ready');
    })();
  }

  pfGate();
})();
