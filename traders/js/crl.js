/* ============================================================
   CRL · script condiviso. UNICA fonte per tutte le pagine.
   Inietta nav + footer + disclaimer + modali e collega la logica.
   Ogni pagina deve solo: <body data-page="..."> ... <script src="js/crl.js" defer></script>
   ============================================================ */
(function () {
  'use strict';

  /* --- Endpoint Formspree (invariati dal sito attuale) --- */
  var FORMSPREE_GATE = 'https://formspree.io/f/xpwevykk';
  var FORMSPREE_DEMO = 'https://formspree.io/f/mwpzyldd';

  /* --- Voci di menu: modifica QUI e cambia in tutte le pagine --- */
  var NAV = [
    { label: 'How it works',     href: 'crl.html',              page: 'crl' },
    { label: 'Risk & pricing', href: 'crl-risk.html',         page: 'crl-risk' },
    { label: 'Availability',   href: 'crl-availability.html', page: 'crl-availability' }
  ];

  /* --- Flusso "CRL reference": sub-nav persistente sulle pagine CRL --- */
  var FLOW = [
    { label: 'How it works',    href: 'crl.html',             page: 'crl' },
    { label: 'Risk & pricing', href: 'crl-risk.html',        page: 'crl-risk' },
    { label: 'Availability',  href: 'crl-availability.html', page: 'crl-availability' }
  ];

  var FREE_EMAIL = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','proton.me','protonmail.com','aol.com','gmx.com','live.com','me.com'];
  var currentPage = document.body.getAttribute('data-page') || '';

  /* ============================================================
     1. NAV
     ============================================================ */
  function buildNav() {
    var links = NAV.map(function (n) {
      var cur = (n.page === currentPage) ? ' aria-current="page"' : '';
      return '<a href="' + n.href + '"' + cur + '>' + n.label + '</a>';
    }).join('');

    var html =
      '<header class="nav">' +
        '<div class="wrap nav-inner">' +
          '<a class="logo" href="index.html" aria-label="CRL home"><img class="logo-img" src="images/logo-crl-serpent.png" alt="" width="40" height="40" decoding="async">CRL</a>' +
          '<nav class="nav-menu" aria-label="Primary">' + links + '</nav>' +
          '<button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="crl-nav-menu">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
        '</div>' +
      '</header>';

    document.body.insertAdjacentHTML('afterbegin', html);

    var menu = document.querySelector('.nav-menu');
    menu.id = 'crl-nav-menu';
    var toggle = document.querySelector('.nav-toggle');
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ============================================================
     1b. SUB-NAV "CRL reference" (solo pagine del flusso CRL)
     ============================================================ */
  function buildFlowNav() {
    var inFlow = false, i;
    for (i = 0; i < FLOW.length; i++) { if (FLOW[i].page === currentPage) { inFlow = true; break; } }
    if (!inFlow) return;
    var links = FLOW.map(function (f) {
      var cur = (f.page === currentPage) ? ' aria-current="page"' : '';
      return '<a href="' + f.href + '"' + cur + '>' + f.label + '</a>';
    }).join('<span class="sep">/</span>');
    var html =
      '<nav class="flownav" aria-label="CRL reference">' +
        '<div class="wrap flownav-inner">' +
          '<span class="flownav-label">CRL reference</span>' + links +
        '</div>' +
      '</nav>';
    var header = document.querySelector('.nav');
    if (header) { header.insertAdjacentHTML('afterend', html); }
    else { document.body.insertAdjacentHTML('afterbegin', html); }
  }

  /* ============================================================
     2. FOOTER + DISCLAIMER REGULATORY  (single-source)
     ============================================================ */
  function buildFooter() {
    var reg =
      '<section class="reg" aria-label="Regulatory notice"><div class="wrap reg-inner">' +
        '<h3>Regulatory &amp; eligibility notice</h3>' +
        '<p>CRL Technologies, Inc. provides calculation technology exclusively to authorized financial institutions. ' +
        'CRL products and services are intended <strong>only</strong> for qualified professional counterparties; retail distribution is prohibited. ' +
        'Availability is subject to jurisdiction and approval by the authorized intermediary.</p>' +
        '<div class="reg-grid">' +
          '<div class="j"><strong>EU</strong><span>Professional Clients &amp; Eligible Counterparties (MiFID II)</span></div>' +
          '<div class="j"><strong>UK</strong><span>Professional Clients &amp; ECPs (FCA COBS)</span></div>' +
          '<div class="j"><strong>Switzerland</strong><span>Professional clients (FinSA)</span></div>' +
          '<div class="j"><strong>United States</strong><span>QIBs / Accredited Investors, where applicable</span></div>' +
          '<div class="j"><strong>Hong Kong</strong><span>Professional Investors (SFO)</span></div>' +
          '<div class="j"><strong>Singapore</strong><span>Accredited / Institutional Investors (SFA)</span></div>' +
          '<div class="j"><strong>Australia</strong><span>Wholesale Clients (Corporations Act)</span></div>' +
          '<div class="j"><strong>APAC / Other</strong><span>Equivalent qualified entities, where permitted</span></div>' +
        '</div>' +
        '<p>CRL does not offer financial advice or execution/placement services. Compliance, product approval and risk management remain the responsibility of the authorized intermediary. ' +
        'Historical data and backtests are illustrative only and do not guarantee future results.</p>' +
      '</div></section>';

    var footer =
      '<footer class="wrap footer">' +
        '<div class="logo"><img class="logo-img" src="images/logo-crl-serpent.png" alt="" width="52" height="52" decoding="async">CRL</div>' +
        '<div>' +
          '<div class="copyright">© 2026 CRL Technologies, Inc. · Conditional Retroactive Leverage™</div>' +
          '<p class="disclaimer">This material is for information only and is directed at professional clients and eligible counterparties within the meaning of MiFID II and equivalent regimes. ' +
          'It does not constitute an offer, a solicitation or investment advice. Leveraged instruments carry significant risk, including the possible total loss of capital. ' +
          'Performance figures stated are technical targets of the infrastructure and are not a guarantee of results. ' +
          'Conditional Retroactive Leverage™ is a trademark of CRL Technologies, Inc.; the engine and its documentation are protected by copyright.</p>' +
          '<nav class="footer-links" aria-label="Legal">' +
            '<a href="regulatory.html">Regulatory</a>' +
            '<a href="privacy.html">Privacy</a>' +
            '<a href="terms.html">Terms</a>' +
            '<a href="cookies.html">Cookies</a>' +
          '</nav>' +
          '<div class="footer-address"><strong>CRL Technologies, Inc.</strong><br>1313 N Market Street, Suite 5100 · Wilmington, DE 19801 · United States<br>' +
          'EIN 61-2277123 · <a href="mailto:info@crl-technologies.com" style="color:var(--blue)">info@crl-technologies.com</a></div>' +
        '</div>' +
      '</footer>';

    document.body.insertAdjacentHTML('beforeend', reg + footer);
  }

  /* ============================================================
     3. MODALI  (Gate + Demo)
     ============================================================ */
  function buildModals() {
    var gate =
      '<div class="backdrop" id="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title" aria-hidden="true"><div class="modal">' +
        '<h3 id="gate-title">Professional qualification</h3>' +
        '<p class="modal-sub">Technical documentation and detailed research are reserved for licensed institutions and professional or eligible counterparties. If you are a retail client, this material is not intended for you.</p>' +
        '<div class="err" id="gate-err"></div>' +
        '<form id="gate-form" novalidate>' +
          '<div><label for="g-jur">Regulatory jurisdiction</label>' +
            '<select id="g-jur" name="jurisdiction" required>' +
              '<option value="">Select…</option><option>EU (MiFID II)</option><option>UK (FCA)</option><option>Switzerland (FinSA)</option>' +
              '<option>US (QIB/Accredited)</option><option>Hong Kong (SFO)</option><option>Singapore (SFA)</option>' +
              '<option>Australia (Corporations Act)</option><option>Other professional</option>' +
            '</select></div>' +
          '<div><label for="g-email">Corporate email</label><input type="email" id="g-email" name="email" placeholder="name@institution.com" required></div>' +
          '<div><label for="g-inst">Institution</label><input type="text" id="g-inst" name="company" placeholder="Your licensed institution" required></div>' +
          '<div class="checks"><input type="checkbox" id="g-att" name="attestation" required>' +
            '<label for="g-att" style="text-transform:none;letter-spacing:0;font-family:var(--sans);font-weight:300"><span>I confirm I am a Professional Client or Eligible Counterparty under applicable regulations and understand this is not investment advice.</span></label></div>' +
          '<div class="actions"><button type="button" class="btn ghost" data-close>Cancel</button><button type="submit" class="btn">Request access <span>→</span></button></div>' +
        '</form>' +
        '<p class="fine">We process your data solely to verify professional status. See our <a href="privacy.html">Privacy Policy</a>. We do not sell personal data.</p>' +
      '</div></div>';

    var demo =
      '<div class="backdrop" id="demo" role="dialog" aria-modal="true" aria-labelledby="demo-title" aria-hidden="true"><div class="modal">' +
        '<h3 id="demo-title">Technical demonstration</h3>' +
        '<p class="modal-sub">A 30-minute session on the payoff, the integration and the risk model, with a live walkthrough of the calculation engine.</p>' +
        '<div class="err" id="demo-err"></div>' +
        '<form id="demo-form" novalidate>' +
          '<div><label for="d-name">Full name</label><input type="text" id="d-name" name="name" required></div>' +
          '<div><label for="d-title">Title</label><input type="text" id="d-title" name="title" placeholder="e.g. Head of Trading" required></div>' +
          '<div><label for="d-inst">Institution</label><input type="text" id="d-inst" name="company" required></div>' +
          '<div><label for="d-email">Work email</label><input type="email" id="d-email" name="email" required></div>' +
          '<div><label for="d-vol">Monthly derivatives volume</label>' +
            '<select id="d-vol" name="volume" required><option value="">Select…</option><option>€10–50M</option><option>€50–200M</option><option>€200–500M</option><option>€500M+</option></select></div>' +
          '<div><label for="d-int">Primary interest</label>' +
            '<select id="d-int" name="interest" required><option value="">Select…</option><option>Integration timeline &amp; requirements</option><option>Hedging and risk management</option><option>Commercial terms &amp; pricing</option><option>Regulatory considerations</option><option>Technical architecture</option></select></div>' +
          '<input type="hidden" name="_subject" value="New CRL demo request">' +
          '<div class="actions"><button type="button" class="btn ghost" data-close>Cancel</button><button type="submit" class="btn">Book demo <span>→</span></button></div>' +
        '</form>' +
        '<p class="fine">We send a calendar invite within 24 hours. Demos are conducted via secure video conference. See our <a href="privacy.html">Privacy Policy</a>.</p>' +
      '</div></div>';

    document.body.insertAdjacentHTML('beforeend', gate + demo);
  }

  /* ---------- meccanica modali: apertura, chiusura, focus-trap ---------- */
  var lastFocus = null;
  function openModal(id, opener) {
    var el = document.getElementById(id);
    if (!el) return;
    lastFocus = opener || document.activeElement;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var f = el.querySelector('input,select,button');
    if (f) f.focus();
  }
  function closeModal(el) {
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) { lastFocus.focus(); lastFocus = null; }
  }
  function wireModals() {
    document.querySelectorAll('[data-open-gate]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); openModal('gate', b); });
    });
    document.querySelectorAll('[data-open-demo]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); openModal('demo', b); });
    });
    document.querySelectorAll('.backdrop').forEach(function (bd) {
      bd.addEventListener('click', function (e) { if (e.target === bd) closeModal(bd); });
      bd.querySelectorAll('[data-close]').forEach(function (c) {
        c.addEventListener('click', function () { closeModal(bd); });
      });
      bd.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { closeModal(bd); return; }
        if (e.key !== 'Tab') return;
        var f = bd.querySelectorAll('button,[href],input,select,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    });
  }
  function showErr(id, msg) { var e = document.getElementById(id); if (e) { e.textContent = msg; e.classList.add('show'); } }
  function clearErr(id) { var e = document.getElementById(id); if (e) e.classList.remove('show'); }
  function badEmail(v) {
    var dom = (v.split('@')[1] || '').toLowerCase();
    return !dom || FREE_EMAIL.indexOf(dom) !== -1;
  }
  function submitForm(form, endpoint, done) {
    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
      .then(function (r) { done(r.ok); })
      .catch(function () { done(false); });
  }
  function wireForms() {
    var gf = document.getElementById('gate-form');
    if (gf) gf.addEventListener('submit', function (e) {
      e.preventDefault(); clearErr('gate-err');
      var f = new FormData(gf);
      if (!f.get('jurisdiction')) return showErr('gate-err', 'Please select your regulatory jurisdiction.');
      var email = (f.get('email') || '').trim();
      if (!document.getElementById('g-email').checkValidity() || badEmail(email)) return showErr('gate-err', 'Please use a valid corporate email address.');
      if (!(f.get('company') || '').trim()) return showErr('gate-err', 'Please enter your institution name.');
      if (!f.get('attestation')) return showErr('gate-err', 'Please confirm your professional status.');
      submitForm(gf, FORMSPREE_GATE, function (ok) {
        if (ok) { closeModal(document.getElementById('gate')); gf.reset(); alert('Access requested. We will contact you shortly.'); }
        else showErr('gate-err', 'Submission error. Please try again.');
      });
    });

    var df = document.getElementById('demo-form');
    if (df) df.addEventListener('submit', function (e) {
      e.preventDefault(); clearErr('demo-err');
      var f = new FormData(df);
      if (!(f.get('name') || '').trim()) return showErr('demo-err', 'Please enter your full name.');
      if (!(f.get('title') || '').trim()) return showErr('demo-err', 'Please enter your title.');
      if (!(f.get('company') || '').trim()) return showErr('demo-err', 'Please enter your institution name.');
      var email = (f.get('email') || '').trim();
      if (!document.getElementById('d-email').checkValidity() || badEmail(email)) return showErr('demo-err', 'Please use a valid corporate email address.');
      if (!f.get('volume')) return showErr('demo-err', 'Please select your monthly derivatives volume.');
      if (!f.get('interest')) return showErr('demo-err', 'Please select your primary interest.');
      submitForm(df, FORMSPREE_DEMO, function (ok) {
        if (ok) { closeModal(document.getElementById('demo')); df.reset(); alert('Demo request received. We will contact you within 24 hours.'); }
        else showErr('demo-err', 'Submission error. Please try again.');
      });
    });
  }

  /* ============================================================
     4. REVEAL on scroll
     ============================================================ */
  function wireReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ============================================================
     5. DISEGNO MODELLO PAYOFF (solo home, se presente lo svg del modello)
     ============================================================ */
  function drawSurface() {
    var cv = document.getElementById('surfaceCanvas');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var LW = 900, LH = 520; // spazio logico della proiezione
    function project(x, y, z) { return [540 + x * 58 + y * 30, 285 + y * 12 - z * 72 - x * 5]; }

    // Mare in tempesta: sovrapposizione di onde a frequenze/direzioni diverse (irregolare, non ripetitiva)
    function zf(x, y, t) {
      var s = 0.18 * Math.sin(0.35 * x + 0.22 * y + t * 0.45);   // grande swell lento
      s += 0.26 * Math.sin(0.75 * x - 0.55 * y + t * 0.90);
      s += 0.20 * Math.sin(1.25 * x + 0.95 * y - t * 1.10);
      s += 0.15 * Math.sin(1.90 * x - 1.60 * y + t * 1.45);
      s += 0.11 * Math.sin(2.70 * x + 2.30 * y + t * 1.80);      // cavalloni / chop
      s += 0.08 * Math.sin(3.60 * x - 3.10 * y - t * 2.20);
      return s;
    }

    // nuvola di punti: footprint circolare, più densa al centro (niente crinale: il blu è solo CRL)
    var STEP = .13, pts = [], xi, yi, R = 4.2;
    for (yi = -4.35; yi <= 4.351; yi += STEP) {
      for (xi = -4.35; xi <= 4.351; xi += STEP) {
        var rr = Math.sqrt(xi * xi + yi * yi) / R;   // 0 = centro, 1 = bordo
        if (rr > 1) continue;                         // taglio circolare
        if (Math.random() > 1 - 0.82 * Math.pow(rr, 1.7)) continue; // meno punti esterni, più interni
        var near = (yi + 4) / 8;                      // 0 = fondo, 1 = davanti
        var fade = 0.4 + 0.6 * (1 - rr * rr);         // opacità che sfuma verso il bordo
        pts.push({ x: xi, y: yi, o: (0.16 + 0.5 * near) * fade, s: 0.6 + 0.7 * near });
      }
    }

    var scale = 1, offx = 0, offy = 0, dpr = 1;
    function resize() {
      var rect = cv.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      cv.width = Math.max(1, Math.round(rect.width * dpr));
      cv.height = Math.max(1, Math.round(rect.height * dpr));
      scale = cv.width / LW;               // uniforme (aspect del contenitore = 900/520)
      offy = (cv.height - LH * scale) / 2;
    }
    resize();
    window.addEventListener('resize', resize);

    // Ciclo di una posizione: si apre, va SOLO avanti, si chiude, si riapre
    var CYCLE = 8.0, X0 = -2.4, X1 = 2.4, NAVY = 0.12, R_IN = 0.9, R_OUT = 2.9, MIN_CALM = 0.30;
    function smooth01(u) { if (u < 0) u = 0; else if (u > 1) u = 1; return u * u * (3 - 2 * u); }
    function stormMask(dist) { return smooth01((dist - R_IN) / (R_OUT - R_IN)); } // 0 vicino a CRL, 1 lontano
    function lifeAlpha(cp) { var v = Math.min(smooth01(cp / 0.14), 1 - smooth01((cp - 0.82) / 0.18)); return v < 0 ? 0 : v; }
    var trail = [], prevCp = 0;

    function render(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      var cp = t / CYCLE; cp = cp - Math.floor(cp);   // 0..1 nel ciclo della posizione
      var life = lifeAlpha(cp);
      var nx = X0 + (X1 - X0) * cp;                   // avanti, mai indietro
      var i, p, z, calm, amp, pr, px, py, d, h, a, dx, dy;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        dx = p.x - nx; dy = p.y - NAVY;
        // pozza di CRL: ampiezza ridotta (ma non spenta) al centro, piena tempesta lontano; solo se la posizione è aperta
        calm = MIN_CALM + (1 - MIN_CALM) * stormMask(Math.sqrt(dx * dx + dy * dy));
        amp = 1 - life * (1 - calm);
        z = zf(p.x, p.y, t) * amp;
        pr = project(p.x, p.y, z);
        px = offx + pr[0] * scale; py = offy + pr[1] * scale; d = p.s * dpr;
        h = (z + 0.55) / 1.35; if (h < 0) h = 0; else if (h > 1) h = 1; // creste marcate, cavi tenui
        a = p.o * (0.4 + 0.85 * h); if (a > 1) a = 1;
        ctx.globalAlpha = a;
        ctx.fillStyle = '#6f747c';
        ctx.fillRect(px - d, py - d, d * 2, d * 2);
      }
      ctx.globalAlpha = 1;

      // CRL sulla superficie della sua pozza (che si muove ancora un po')
      if (cp < prevCp) trail = [];                    // nuova posizione: scia nuova
      prevCp = cp;
      var zc = zf(nx, NAVY, t) * MIN_CALM + 0.05;     // segue il lieve moto della pozza, resta in superficie
      var n = project(nx, NAVY, zc);
      var kx = offx + n[0] * scale, ky = offy + n[1] * scale;
      if (life > 0.02) { trail.push([kx, ky, life]); if (trail.length > 60) trail.shift(); }
      ctx.lineWidth = 1.4 * dpr; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = '#173e78';
      for (i = 1; i < trail.length; i++) {
        ctx.globalAlpha = (i / trail.length) * 0.42 * trail[i][2];
        ctx.beginPath(); ctx.moveTo(trail[i - 1][0], trail[i - 1][1]); ctx.lineTo(trail[i][0], trail[i][1]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      var pulse = 1 + 0.1 * Math.sin(t * 2.6);
      ctx.save();
      ctx.shadowColor = 'rgba(23,62,120,.6)'; ctx.shadowBlur = 12 * dpr; ctx.globalAlpha = life;
      ctx.fillStyle = '#173e78';
      ctx.beginPath(); ctx.arc(kx, ky, 4.6 * dpr * pulse, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.globalAlpha = life;
      ctx.fillStyle = '#fbfaf6';
      ctx.beginPath(); ctx.arc(kx, ky, 1.7 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }

    var phase = 0, last = null;
    function loop(now) {
      if (last === null) last = now;
      var dt = now - last; last = now;
      if (dt > 100) dt = 16; // dopo un cambio scheda: niente salti, movimento sempre seamless
      phase += dt * 0.0013;
      render(phase);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ============================================================
     6. AUDIT CHAIN animata (solo Technology, se presente #auditChain)
     ============================================================ */
  function drawAuditChain() {
    var cv = document.getElementById('auditChain');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    var dpr = 1, W = 0, H = 0;
    function resize() {
      var r = cv.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      W = cv.width; H = cv.height;
    }
    resize();
    window.addEventListener('resize', resize);

    function hashHex(n) {                 // hash esadecimale pseudo-casuale, deterministico dall'indice
      var x = (n * 2654435761) >>> 0, s = '';
      for (var i = 0; i < 8; i++) { x = (x * 1664525 + 1013904223) >>> 0; s += (x >>> 28).toString(16); }
      return s;
    }
    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    var GAP = 188, BW = 132, BH = 62, SPEED = 22; // px logici
    function render(t) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      var gap = GAP * dpr, bw = BW * dpr, bh = BH * dpr, cy = H / 2;
      var off = t * SPEED * dpr;
      var k0 = Math.floor(off / gap) - 1, k, x, cx, a, edge = 110 * dpr;
      for (k = k0; k * gap - off < W + gap; k++) {
        x = k * gap - off + 24 * dpr; cx = x + bw / 2;
        a = 1;
        if (cx < edge) a = cx / edge; else if (cx > W - edge) a = (W - cx) / edge;
        if (a <= 0.02) continue; if (a > 1) a = 1;
        // collegamento al blocco successivo + freccia
        ctx.globalAlpha = a * 0.7; ctx.strokeStyle = '#5f7bb0'; ctx.lineWidth = dpr;
        ctx.beginPath(); ctx.moveTo(x + bw, cy); ctx.lineTo(x + gap, cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x + gap - 5 * dpr, cy - 3 * dpr); ctx.lineTo(x + gap, cy); ctx.lineTo(x + gap - 5 * dpr, cy + 3 * dpr); ctx.stroke();
        // blocco (card scura, console dati)
        ctx.globalAlpha = a;
        rr(x, cy - bh / 2, bw, bh, 3 * dpr);
        ctx.fillStyle = '#171c24'; ctx.fill();
        ctx.strokeStyle = '#2c333e'; ctx.lineWidth = dpr; ctx.stroke();
        ctx.fillStyle = '#6f7784'; ctx.font = (9.5 * dpr) + 'px "IBM Plex Mono", monospace';
        ctx.fillText('BLOCK #' + (100000 + k), x + 12 * dpr, cy - bh / 2 + 18 * dpr);
        ctx.fillStyle = '#7ea2e0'; ctx.font = (13 * dpr) + 'px "IBM Plex Mono", monospace';
        ctx.fillText(hashHex(k), x + 12 * dpr, cy + 6 * dpr);
        ctx.fillStyle = '#6f7784'; ctx.font = (9 * dpr) + 'px "IBM Plex Mono", monospace';
        ctx.fillText('prev ' + hashHex(k - 1).slice(0, 6), x + 12 * dpr, cy + bh / 2 - 8 * dpr);
      }
      ctx.globalAlpha = 1;
    }
    var phase = 0, last = null;
    function loop(now) {
      if (last === null) last = now;
      var dt = now - last; last = now;
      if (dt > 100) dt = 16;
      phase += dt / 1000;
      render(phase);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* ============================================================
     7. HERO CINEMATOGRAFICO (solo for-traders, se presente #heroBg)
     ============================================================ */
  function cinematicHero() {
    var bg = document.getElementById('heroBg');
    if (!bg) return;
    var badge = document.querySelector('.cine-badge'),
        l1 = document.querySelector('.cine-l1'),
        l2 = document.querySelector('.cine-l2'),
        cap = document.querySelector('.cine-cap'),
        scrollEl = document.querySelector('.cine-scroll');
    setTimeout(function () { if (badge) badge.classList.add('visible'); }, 150);
    setTimeout(function () { if (l1) l1.classList.add('visible'); }, 350);
    setTimeout(function () { if (l2) l2.classList.add('visible'); }, 560);
    setTimeout(function () { if (cap) cap.classList.add('visible'); }, 950);
    function onScroll() {
      var y = window.scrollY || window.pageYOffset, vh = window.innerHeight;
      bg.classList.toggle('desaturated', y > vh * 0.30);           // scorrendo, la bomba si disarma
      if (scrollEl) scrollEl.classList.toggle('hide', y > vh * 0.12);
      document.body.classList.toggle('scrolled', y > vh * 0.85);   // nav torna chiara oltre l'hero
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     INIT
     ============================================================ */
  buildNav();
  buildFooter();
  buildModals();
  wireModals();
  wireForms();
  wireReveal();
  drawSurface();
  drawAuditChain();
  cinematicHero();
})();
