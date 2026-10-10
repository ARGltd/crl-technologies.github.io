/* ============================================================
   CRL · Home v2 - interactions
   Nav, scroll reveal, research particle form, enquiry gate modal.
   Gate logic + Formspree endpoint reused from crl.js.
   ============================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Pause a rAF loop when its canvas is offscreen or the tab is hidden. */
  function gatedLoop(cv, step) {
    var running = false, onscreen = true, visible = !document.hidden, raf = 0;
    function tick(now) { if (!running) return; step(now); raf = requestAnimationFrame(tick); }
    function start() { if (running || !onscreen || !visible) return; running = true; raf = requestAnimationFrame(tick); }
    function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { onscreen = es[0].isIntersecting; onscreen ? start() : stop(); }, { threshold: 0 }).observe(cv);
    }
    document.addEventListener('visibilitychange', function () { visible = !document.hidden; visible ? start() : stop(); });
    start();
  }

  /* ---------- NAV ---------- */
  var nav = document.getElementById('nav'),
      menu = document.getElementById('navmenu'),
      toggle = document.querySelector('.nav-toggle');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var o = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }
  function onScroll() { if (nav) nav.classList.toggle('solid', (window.scrollY || window.pageYOffset || 0) > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- REVEAL ---------- */
  var els = document.querySelectorAll('.reveal');
  // Content is visible by default (CSS). Above-the-fold gets .in immediately
  // (so .in-keyed animations play, nothing waits on JS); below-the-fold is
  // hidden (.pre) and reveals on scroll.
  if ('IntersectionObserver' in window && !reduce) {
    var revVh = window.innerHeight || 800, toObs = [];
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top > revVh * 0.9) { el.classList.add('pre'); toObs.push(el); }
      else { el.classList.add('in'); }
    });
    if (toObs.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
      toObs.forEach(function (el) { io.observe(el); });
    }
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- RESEARCH particle form (organic mathematical loop) ---------- */
  (function () {
    var cv = document.getElementById('resCanvas');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dpr = 1, W = 0, H = 0, pts = [];
    function rnd(i) { var x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); }
    var N = 1000;
    for (var i = 0; i < N; i++) {
      pts.push({
        u: (i / N) * Math.PI * 2 * 3,      // wind around the loop three times
        v: rnd(i) * Math.PI * 2,
        r: 0.34 + 0.10 * rnd(i + 7),
        lime: rnd(i + 3) > 0.85
      });
    }
    function resize() {
      var r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      W = cv.width; H = cv.height;
    }
    function frame(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H);
      var cx = W / 2, cy = H * 0.48, scale = Math.min(W, H) * 0.36;
      var a = t * 0.5, b = 0.62 + Math.sin(t * 0.07) * 0.13;
      var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), i, p;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        var ring = 1.0 + p.r * Math.cos(p.v);
        var x = ring * Math.cos(p.u), y = ring * Math.sin(p.u), z = p.r * Math.sin(p.v);
        var x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        var y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
        var pers = 1 / (2.2 - z2 * 0.8);
        var sx = cx + x1 * scale * pers, sy = cy + y1 * scale * pers;
        var depth = (z2 + 1) / 2;
        var sz = (0.8 + depth * 1.8) * dpr;
        ctx.fillStyle = p.lime ? 'rgba(143,176,232,' + (0.40 + depth * 0.58) + ')'
                               : 'rgba(223,229,238,' + (0.18 + depth * 0.62) + ')';
        ctx.beginPath(); ctx.arc(sx, sy, sz, 0, 6.2832); ctx.fill();
      }
    }
    var phase = 0, last = null;
    function step(now) { if (last === null) last = now; var dt = now - last; last = now; if (dt > 100) dt = 16; phase += dt * (reduce ? 0.0004 : 0.001); frame(phase); }
    resize(); frame(0.2); window.addEventListener('resize', resize);
    gatedLoop(cv, step);
  })();

  /* ---------- HERO: ensemble of possible futures (Time Fan) ----------
     Porting in JS puro della piastra "CRL Ensemble 1 - Time Fan".
     S0 inchiodato, K unica soglia sopra S0 (convenzione long). La maggioranza
     grigia non conferma mai; la minoranza realizzata diventa blu e viene
     rimisurata da S0 a L. Dietro, il cono fantasma della leva standard,
     gia' largo da t0. Poi si dissolve e ricomincia. ------------------- */
  (function () {
    var cv = document.getElementById('heroFan');
    if (!cv || !cv.getContext) return;
    var INK = '15,17,19', BLUE = '27,79,166', GREY = '139,143,152', HAIR = '211,205,190', IVORY = '#F6F3EC';
    var L = 2, ns = 100, CYCLE = 20, SWEEP_END = 0.78, HOLD_END = 0.88, LIFT = 0.5;
    var tr = [], epochCur = -1;
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
    function easeOut(x) { return 1 - Math.pow(1 - x, 3); }
    function rngFactory(a) {
      return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        var t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function gen(epoch) {
      var rng = rngFactory(epoch * 9301 + 49297), n = 900, i, k;
      tr = [];
      for (i = 0; i < n; i++) {
        var d = new Float32Array(ns), v = 0;
        var vol = 0.05 * (0.6 + rng() * 1.25);
        var preDrift = (rng() - 0.5) * 0.010;
        var roll = rng();
        var contMag = 0.010 + rng() * 0.012;
        var deepMag = 0.05 + rng() * 0.025;
        var tcross = -1, drift;
        for (k = 0; k < ns; k++) {
          d[k] = v;
          if (tcross < 0 && v >= 1) tcross = k;          // unica soglia K sopra S0
          if (tcross < 0) drift = preDrift;              // non confermata
          else if (roll < 0.52) drift = contMag;         // prosegue e dilata
          else if (roll < 0.72) drift = 0.002;           // resta sospesa
          else if (roll < 0.80) drift = -contMag * 0.5;  // rientro modesto
          else drift = -deepMag;                         // reversal profondo (raro, visibile)
          v += drift + (rng() * 2 - 1) * vol;
        }
        tr.push({ d: d, tcross: tcross, a: 0.05 + rng() * 0.10, w: 0.4 + rng() * 0.4 });
      }
    }

    /* I percorsi di ogni ciclo sono noti dall'inizio: cono fantasma ed ensemble grigio si
       disegnano interi, un tratto continuo per percorso, in due livelli fuori schermo, e il
       presente li rivela con un clip al pixel. Niente scatti di campione, niente giunture, e i
       1.800 tracciati tenui non si ridisegnano a ogni fotogramma. Il disegno dei livelli e'
       spalmato sui primi fotogrammi del ciclo, mentre il fan compare in dissolvenza. */
    var geo = null, layers = null, pre = 0, CHUNK = 150;
    function X(k) { return geo.x0 + (k / (ns - 1)) * (geo.x1 - geo.x0); }
    function Yd(v) { return geo.yc - v * geo.yScale; }
    function setup(W, H, dpr) {
      var S = Math.min(W, H) / 470, m = 14 * S;
      geo = { W: W, H: H, dpr: dpr, S: S, m: m, x0: m + 44 * S, x1: W - m - 18 * S, yc: H * 0.5, yScale: (H * 0.5 - m - 24 * S) / 2.6 };
      function mk() {
        var c = document.createElement('canvas');
        c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
        var x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
        x.lineCap = 'butt'; x.globalCompositeOperation = 'multiply';
        return { c: c, x: x };
      }
      layers = { ghost: mk(), grey: mk() }; pre = 0;
    }
    /* curva morbida per i punti medi: nessun angolo condiviso da 1.800 tracciati sottili,
       quindi nessuna colonna piu' chiara dove il browser rasterizza gli spigoli */
    function poly(c, d, mult, a, b) {
      c.beginPath(); c.moveTo(X(a), Yd(mult * d[a]));
      for (var j = a + 1; j < b; j++) {
        var xa = X(j), ya = Yd(mult * d[j]), xb = X(j + 1), yb = Yd(mult * d[j + 1]);
        c.quadraticCurveTo(xa, ya, (xa + xb) / 2, (ya + yb) / 2);
      }
      c.lineTo(X(b), Yd(mult * d[b]));
      c.stroke();
    }
    function prerender(budget) {
      var gx = layers.ghost.x, ex = layers.grey.x, S = geo.S, end = Math.min(tr.length, pre + budget), i, t, d;
      gx.lineJoin = ex.lineJoin = 'round'; gx.lineCap = ex.lineCap = 'round'; gx.lineWidth = 0.5 * S;
      for (i = pre; i < end; i++) {
        t = tr[i]; d = t.d;
        gx.strokeStyle = 'rgba(' + GREY + ',' + (t.a * 0.26).toFixed(3) + ')';
        poly(gx, d, L, 0, ns - 1);
        var ge = t.tcross >= 0 ? t.tcross : ns - 1, fade = clamp(1 - Math.abs(d[ge]) / 2.6, 0.25, 1);
        ex.strokeStyle = 'rgba(' + GREY + ',' + (t.a * (0.7 + fade * 0.3)).toFixed(3) + ')';
        ex.lineWidth = t.w * S;
        poly(ex, d, 1, 0, ge);
      }
      pre = end;
    }
    function reveal(ctx, layer, xh, alpha) {
      if (alpha <= 0) return;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, xh, geo.H); ctx.clip();
      ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(layer.c, 0, 0, geo.W, geo.H);
      ctx.restore();
    }

    function draw(time) {
      var spd = reduce ? 0.30 : 1, T = time * spd;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var W = cv.clientWidth || 560, H = cv.clientHeight || 470;
      if (W < 2 || H < 2) return;
      if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      }
      var epoch = Math.floor(T / CYCLE);
      if (epoch !== epochCur) { epochCur = epoch; gen(epoch); setup(W, H, dpr); }
      else if (!geo || geo.W !== W || geo.H !== H || geo.dpr !== dpr) setup(W, H, dpr);
      var ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var S = geo.S, m = geo.m, x0 = geo.x0, x1 = geo.x1, yc = geo.yc;

      var frac = (T % CYCLE) / CYCLE, tnow, ens;
      if (frac < SWEEP_END) { tnow = frac / SWEEP_END; ens = clamp(frac / 0.05, 0, 1); }
      else if (frac < HOLD_END) { tnow = 1; ens = 1; }
      else { tnow = 1; ens = 1 - (frac - HOLD_END) / (1 - HOLD_END); }
      var h = tnow * (ns - 1), k0 = Math.floor(h), f = h - k0, xh = X(h), i, k, y;
      if (pre < tr.length) prerender(CHUNK);

      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.fillStyle = IVORY; ctx.fillRect(0, 0, W, H);

      /* cono fantasma: leva standard, gia' amplificata da t0 */
      reveal(ctx, layers.ghost, xh, ens);

      ctx.strokeStyle = 'rgba(' + HAIR + ',0.55)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, yc); ctx.lineTo(x1, yc); ctx.stroke();

      /* inviluppo di probabilita' dell'ensemble CRL, fino al presente esatto */
      var baseSig = 0.62;
      function sigAt(kk) { return baseSig * Math.sqrt(kk / (ns - 1)); }
      ctx.globalCompositeOperation = 'multiply';
      [[2.0, 0.04], [1.0, 0.06]].forEach(function (p) {
        ctx.beginPath();
        for (k = 0; k <= k0; k++) { y = Yd(sigAt(k) * p[0]); if (k === 0) ctx.moveTo(X(k), y); else ctx.lineTo(X(k), y); }
        ctx.lineTo(xh, Yd(sigAt(h) * p[0])); ctx.lineTo(xh, Yd(-sigAt(h) * p[0]));
        for (k = k0; k >= 0; k--) ctx.lineTo(X(k), Yd(-sigAt(k) * p[0]));
        ctx.closePath();
        ctx.fillStyle = 'rgba(' + GREY + ',' + (p[1] * ens).toFixed(3) + ')'; ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';

      /* graduazioni: solo tick sull'asse (niente pentagramma) */
      ctx.lineWidth = 1;
      for (var g = -1; g <= 1 + 1e-6; g += 0.5) {
        y = Yd(g);
        ctx.strokeStyle = Math.abs(g) < 0.01 ? 'rgba(' + INK + ',0.5)' : 'rgba(' + GREY + ',0.7)';
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (Math.abs(g) < 0.01 ? 10 : 8) * S, y); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(' + BLUE + ',0.5)';
      for (var g2 = 1 + 0.5 / L; g2 <= 2.6; g2 += 0.5 / L) {
        y = Yd(g2); if (y < m || y > H - m) continue;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 6 * S, y); ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(' + GREY + ',0.4)';
      for (k = 0; k < ns; k += 5) { var xt = X(k); ctx.beginPath(); ctx.moveTo(xt, yc - 3 * S); ctx.lineTo(xt, yc + 3 * S); ctx.stroke(); }

      /* soglia K */
      ctx.strokeStyle = 'rgba(' + BLUE + ',0.5)'; ctx.lineWidth = 1.1;
      ctx.save(); ctx.setLineDash([5 * S, 4 * S]);
      ctx.beginPath(); ctx.moveTo(x0, Yd(1)); ctx.lineTo(x1, Yd(1)); ctx.stroke(); ctx.restore();

      /* ensemble: grigio non risolto */
      reveal(ctx, layers.grey, xh, ens);

      /* ensemble: blu realizzato. Al trigger il P&L maturato viene rimisurato da S0 a L:
         il salto cresce in mezzo secondo e il tratto prosegue alla leva fino al presente. */
      ctx.globalCompositeOperation = 'source-over'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      var t0Epoch = epoch * CYCLE;
      for (i = 0; i < tr.length; i++) {
        var t2 = tr[i], d2 = t2.d, tc = t2.tcross;
        if (tc < 0 || h < tc) continue;
        var tCross = t0Epoch + (tc / (ns - 1)) * SWEEP_END * CYCLE;
        var mult = 1 + (L - 1) * easeOut(clamp((T - tCross) / LIFT, 0, 1));
        ctx.beginPath();
        ctx.moveTo(X(tc), Yd(d2[tc]));
        ctx.lineTo(X(tc), Yd(mult * d2[tc]));
        for (k = tc + 1; k <= k0; k++) ctx.lineTo(X(k), Yd(mult * d2[k]));
        var tipX = X(k0), tipV = d2[k0];
        if (k0 < ns - 1 && h > tc) { tipV = d2[k0] + (d2[k0 + 1] - d2[k0]) * f; tipX = xh; ctx.lineTo(tipX, Yd(mult * tipV)); }
        var a2 = clamp(t2.a * 2.4, 0.16, 0.5) * ens;
        ctx.strokeStyle = 'rgba(' + BLUE + ',' + a2.toFixed(3) + ')';
        ctx.lineWidth = (t2.w + 0.3) * S; ctx.stroke();
        ctx.fillStyle = 'rgba(' + BLUE + ',' + (0.7 * ens).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(tipX, Yd(mult * tipV), 1.7 * S, 0, Math.PI * 2); ctx.fill();
      }

      /* linea del presente */
      ctx.strokeStyle = 'rgba(' + INK + ',' + (0.10 * ens).toFixed(3) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(xh, m + 6 * S); ctx.lineTo(xh, H - m - 6 * S); ctx.stroke();

      /* S0 inchiodato */
      ctx.fillStyle = 'rgba(' + INK + ',0.9)';
      ctx.beginPath(); ctx.arc(x0, yc, 2.8 * S, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(' + INK + ',0.9)'; ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(x0 - 5 * S, yc); ctx.lineTo(x0 + 5 * S, yc);
      ctx.moveTo(x0, yc - 5 * S); ctx.lineTo(x0, yc + 5 * S); ctx.stroke();

      /* nessuna grana e nessuna vignettatura: la piastra vive sulla carta della pagina */

      /* annotazione: S0, K, 1x, Lx + fantasma.
         LS e' indipendente da S: il testo non deve rimpicciolirsi con la geometria. */
      var LS = Math.max(1, Math.min(W / 560, H / 470));
      function label(px) { return (px * LS).toFixed(2) + 'px "IBM Plex Mono", monospace'; }
      /* alone di carta dietro il testo, cosi' resta leggibile sopra i tracciati */
      function tag(txt, x, y, col, px, align) {
        ctx.font = label(px); ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle';
        var w = ctx.measureText(txt).width, hh = px * LS, pad = 3 * LS;
        var bx = align === 'right' ? x - w - pad : x - pad;
        ctx.fillStyle = IVORY; ctx.globalAlpha = 0.82;
        ctx.fillRect(bx, y - hh * 0.62 - pad * 0.4, w + pad * 2, hh * 1.24 + pad * 0.8);
        ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.fillText(txt, x, y);
      }
      tag('S₀', x0 + 9 * LS, yc - 13 * LS, 'rgba(' + INK + ',0.95)', 13);
      tag('K', x1, Yd(1) - 10 * LS, 'rgba(' + BLUE + ',0.95)', 13, 'right');
      tag('1×', x0 + 4 * LS, Yd(0.5), 'rgba(' + GREY + ',0.95)', 12);
      tag('L×', x0 + 4 * LS, Yd(2), 'rgba(' + BLUE + ',0.9)', 12);
      tag('leveraged from t₀', x1, Yd(2.42), 'rgba(' + GREY + ',0.85)', 10.5, 'right');

      /* marca polare: la direzione e' indifferente (long | short) */
      var pcx = x1 - 13 * S, pcy = H - m - 15 * S, pr = 8 * S;
      ctx.strokeStyle = 'rgba(' + GREY + ',0.55)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(pcx, pcy, pr, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pcx, pcy - pr); ctx.lineTo(pcx, pcy + pr); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pcx - 2.2 * S, pcy - pr + 3 * S); ctx.lineTo(pcx, pcy - pr); ctx.lineTo(pcx + 2.2 * S, pcy - pr + 3 * S); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pcx - 2.2 * S, pcy + pr - 3 * S); ctx.lineTo(pcx, pcy + pr); ctx.lineTo(pcx + 2.2 * S, pcy + pr - 3 * S); ctx.stroke();
    }
    // Start the sweep from the beginning (near S0) each time the page opens.
    var acc = 0.2, last = null;
    function step(now) { if (last === null) last = now; var dt = (now - last) / 1000; last = now; if (dt > 0.1) dt = 0.016; acc += dt; draw(acc); }
    draw(0.2);
    if (window.ResizeObserver) new ResizeObserver(function () { draw(acc); }).observe(cv.parentNode);
    gatedLoop(cv, step);
  })();

  /* ---------- ENQUIRY GATE MODAL (reused from crl.js) ---------- */
  var FORMSPREE = 'https://formspree.io/f/xpwevykk';
  var FREE = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','proton.me','protonmail.com','aol.com','gmx.com','live.com','me.com'];
  var lastFocus = null;
  function openModal(id, opener) {
    var el = document.getElementById(id); if (!el) return;
    lastFocus = opener || document.activeElement;
    el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    var f = el.querySelector('input,select,button'); if (f) f.focus();
  }
  function closeModal(el) {
    el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }
  document.querySelectorAll('[data-open-gate]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openModal('gate', b); });
  });
  document.querySelectorAll('.backdrop').forEach(function (bd) {
    bd.addEventListener('click', function (e) { if (e.target === bd) closeModal(bd); });
    bd.querySelectorAll('[data-close]').forEach(function (c) { c.addEventListener('click', function () { closeModal(bd); }); });
    bd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(bd); return; }
      if (e.key !== 'Tab') return;
      var f = bd.querySelectorAll('button,[href],input,select,[tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last2 = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last2.focus(); }
      else if (!e.shiftKey && document.activeElement === last2) { e.preventDefault(); first.focus(); }
    });
  });
  function showErr(m) { var e = document.getElementById('gate-err'); if (e) { e.textContent = m; e.classList.add('show'); } }
  function badEmail(v) { var d = (v.split('@')[1] || '').toLowerCase(); return !d || FREE.indexOf(d) !== -1; }
  var gf = document.getElementById('gate-form');
  if (gf) gf.addEventListener('submit', function (e) {
    e.preventDefault();
    var er = document.getElementById('gate-err'); if (er) er.classList.remove('show');
    var f = new FormData(gf);
    if (!f.get('jurisdiction')) return showErr('Please select your regulatory jurisdiction.');
    var email = (f.get('email') || '').trim();
    if (!document.getElementById('g-email').checkValidity() || badEmail(email)) return showErr('Please use a valid corporate email address.');
    if (!(f.get('company') || '').trim()) return showErr('Please enter your institution name.');
    if (!f.get('attestation')) return showErr('Please confirm your professional status.');
    fetch(FORMSPREE, { method: 'POST', body: f, headers: { 'Accept': 'application/json' } })
      .then(function (r) {
        if (r.ok) { closeModal(document.getElementById('gate')); gf.reset(); alert('Access requested. We will contact you shortly.'); }
        else showErr('Submission error. Please try again.');
      })
      .catch(function () { showErr('Submission error. Please try again.'); });
  });
})();
