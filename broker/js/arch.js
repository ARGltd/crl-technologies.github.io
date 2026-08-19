/* CRL - System as edifice.
   Assonometria incisa dei 12 sottosistemi come un unico portico a sbalzo.
   Canvas 2D, nessuna dipendenza. */
(function () {
  var cv = document.getElementById('archPlate');
  if (!cv || !cv.getContext) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var L = [
    { n: '01', name: 'INSTRUMENT', c: 3 },
    { n: '02', name: 'CALCULATION ENGINE', c: 9 },
    { n: '03', name: 'PRICING & MARKET DATA', c: 6 },
    { n: '04', name: 'OPERATIONAL CONTROLS', c: 6 },
    { n: '05', name: 'MULTI-TENANCY & SECURITY', c: 6 },
    { n: '06', name: 'AUDIT & ATTESTATION', c: 7 },
    { n: '07', name: 'API', c: 8 },
    { n: '08', name: 'SDK & INTEGRATION', c: 9 },
    { n: '09', name: 'DEPLOYMENT', c: 4 },
    { n: '10', name: 'OBSERVABILITY', c: 5 },
    { n: '11', name: 'INSTITUTIONAL DOCS', c: 11 },
    { n: '12', name: 'QUANTITATIVE RESEARCH', c: 6 }
  ];

  var t0 = performance.now(), raf = 0;

  function draw(t) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = cv.clientWidth || 1200, H = cv.clientHeight || 780;
    if (!W || !H) return;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) {
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    }
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var HAIR = '35,42,51', NEU = '154,161,173', ACC = '143,176,232', DIM = '90,98,110';
    var S = Math.min(W / 1200, H / 780);
    function fpx(n) { return Math.max(n * S, n * 0.82).toFixed(2) + 'px "IBM Plex Mono", monospace'; }
    function setF(n, w) { ctx.font = (w || 400) + ' ' + fpx(n); }

    ctx.fillStyle = '#080a0d'; ctx.fillRect(0, 0, W, H);

    var m = 22 * S;
    ctx.strokeStyle = 'rgb(' + HAIR + ')'; ctx.lineWidth = 1;
    ctx.strokeRect(m, m, W - 2 * m, H - 2 * m);
    ctx.strokeStyle = 'rgb(' + NEU + ')';
    var ck = 9 * S;
    [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(function (q) {
      ctx.beginPath(); ctx.moveTo(q[0], q[1] + q[3] * ck); ctx.lineTo(q[0], q[1]); ctx.lineTo(q[0] + q[2] * ck, q[1]); ctx.stroke();
    });
    setF(10.5); ctx.fillStyle = 'rgba(' + NEU + ',0.82)'; ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left'; ctx.fillText('CRL · SYSTEM AS EDIFICE', m + 14 * S, m + 20 * S);
    ctx.textAlign = 'right'; ctx.fillText('TWELVE SUBSYSTEMS · ONE PORTICO', W - m - 14 * S, m + 20 * S);

    var cx = W * 0.50, cy = H * 0.50;
    var K = Math.min(W, H) * 0.072;
    var camZ = 8.4, focal = 5.6;
    var phi = -0.34 + 0.26 * Math.sin(t * 0.09);
    var theta = -0.42 + 0.5 * Math.sin(t * 0.11);
    var cph = Math.cos(phi), sph = Math.sin(phi), cth = Math.cos(theta), sth = Math.sin(theta);
    var LX = 11, DZ = 3.4, Hh = 4.2, ySpr = 2.7;

    function tf(x, y, z) {
      var x0 = x - LX / 2, z0 = z - DZ / 2;
      var X = x0 * cth + z0 * sth, Z = -x0 * sth + z0 * cth;
      return { x: X, y: y * cph - Z * sph, z: y * sph + Z * cph };
    }
    function proj(p) { var s = focal / (camZ - p.z); return { x: cx + p.x * K * s, y: cy - p.y * K * s, s: s, z: p.z }; }
    function P(x, y, z, mir) { return proj(tf(x, mir ? -y * 0.6 : y, z)); }

    var NB = 6;
    function bx(i) { return 0.5 + i * (LX - 1) / NB; }
    var CYCLE = 15, front = Math.floor((t % CYCLE) / CYCLE * 12);

    function quad(a, b, c, d, fill, stroke, lw) {
      ctx.beginPath();
      [a, b, c, d].forEach(function (p, i) { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
    }
    function poly(pts, fill, stroke, lw) {
      ctx.beginPath();
      pts.forEach(function (p, i) { i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
      if (fill) { ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); }
    }
    function node(x, y, z, mir, hot) {
      var am = mir ? 0.14 : 1, p = P(x, y, z, mir);
      ctx.fillStyle = hot ? 'rgba(' + ACC + ',' + (0.95 * am) + ')' : 'rgba(' + NEU + ',' + (0.72 * am) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, (hot ? 2.3 : 1.8) * S, 0, 6.28); ctx.fill();
      ctx.strokeStyle = 'rgba(' + (hot ? ACC : NEU) + ',' + (0.5 * am) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(p.x, p.y, (hot ? 4 : 3) * S, 0, 6.28); ctx.stroke();
    }

    function arcade(z, baseIdx, mir) {
      var pw = 0.3, dp = 0.36, am = mir ? 0.14 : 1, i;
      for (i = 0; i <= NB; i++) {
        var x = bx(i) - pw / 2;
        var Q = function (a, b, c) { return P(x + a * pw, b * ySpr, z + c * dp, mir); };
        quad(Q(0, 0, 0), Q(1, 0, 0), Q(1, 1, 0), Q(0, 1, 0), 'rgba(' + NEU + ',' + (0.05 * am) + ')', 'rgba(' + NEU + ',' + (0.5 * am) + ')', 1);
        quad(Q(1, 0, 0), Q(1, 0, 1), Q(1, 1, 1), Q(1, 1, 0), 'rgba(' + NEU + ',' + (0.03 * am) + ')', 'rgba(' + NEU + ',' + (0.4 * am) + ')', 1);
        quad(Q(0, 1, 0), Q(1, 1, 0), Q(1, 1, 1), Q(0, 1, 1), 'rgba(' + NEU + ',' + (0.07 * am) + ')', 'rgba(' + NEU + ',' + (0.5 * am) + ')', 1);
      }
      for (i = 0; i < NB; i++) {
        var idx = baseIdx + i, hot = idx === front, col = hot ? ACC : NEU;
        var x0 = bx(i), x1 = bx(i + 1), xm = (x0 + x1) / 2;
        var A = function (u) {
          var xx, yy;
          if (u < 0.5) { var uu = u / 0.5; xx = x0 + (xm - x0) * uu; yy = ySpr + (Hh - ySpr) * uu * uu; }
          else { var vv = (u - 0.5) / 0.5; xx = xm + (x1 - xm) * vv; yy = Hh - (Hh - ySpr) * vv * vv; }
          return [xx, yy];
        };
        var F = [], B = [], s2;
        for (s2 = 0; s2 <= 20; s2++) { var q2 = A(s2 / 20); F.push(P(q2[0], q2[1], z, mir)); B.push(P(q2[0], q2[1], z + dp, mir)); }
        ctx.beginPath();
        F.forEach(function (p, k) { k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
        for (var k2 = B.length - 1; k2 >= 0; k2--) ctx.lineTo(B[k2].x, B[k2].y);
        ctx.closePath(); ctx.fillStyle = 'rgba(' + col + ',' + ((hot ? 0.08 : 0.04) * am) + ')'; ctx.fill();
        ctx.beginPath();
        F.forEach(function (p, k) { k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
        ctx.strokeStyle = 'rgba(' + col + ',' + ((hot ? 0.9 : 0.5) * am) + ')'; ctx.lineWidth = (hot ? 1.5 : 1) * S; ctx.stroke();
        ctx.beginPath();
        B.forEach(function (p, k) { k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); });
        ctx.strokeStyle = 'rgba(' + col + ',' + ((hot ? 0.5 : 0.28) * am) + ')'; ctx.lineWidth = 1; ctx.stroke();
      }
      for (i = 0; i <= NB; i++) { node(bx(i), ySpr, z, mir, false); node(bx(i), ySpr, z + dp, mir, false); node(bx(i), 0, z, mir, false); }
      for (i = 0; i < NB; i++) {
        var h2 = (baseIdx + i) === front, xm2 = (bx(i) + bx(i + 1)) / 2;
        node(xm2, Hh, z, mir, h2); node(xm2, Hh, z + dp, mir, h2);
      }
      if (!mir) for (i = 0; i < NB; i++) {
        var id3 = baseIdx + i, Ld = L[id3], h3 = id3 === front, xm3 = (bx(i) + bx(i + 1)) / 2;
        if (tf(xm3, 0, z).z < -0.3) continue;
        var lp = P(xm3, ySpr + 0.42, z);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = h3 ? 'rgba(' + ACC + ',0.98)' : 'rgba(' + NEU + ',0.8)';
        setF(11.5, 500); ctx.fillText(Ld.n, lp.x, lp.y);
        for (var qq = 0; qq < Ld.c; qq++) {
          var u3 = 0.2 + (Ld.c > 1 ? qq / (Ld.c - 1) * 0.6 : 0.3);
          var pp = P(xm3, 0.4 + u3 * (ySpr - 0.8), z);
          ctx.fillStyle = h3 ? 'rgba(' + ACC + ',0.85)' : 'rgba(' + DIM + ',0.8)';
          ctx.beginPath(); ctx.arc(pp.x, pp.y, 1.4 * S, 0, 6.28); ctx.fill();
        }
      }
    }

    var zc0 = tf(LX / 2, 0, 0).z, zcD = tf(LX / 2, 0, DZ).z;
    var backZ = zc0 < zcD ? 0 : DZ, frontZ = zc0 < zcD ? DZ : 0;
    var backBase = backZ === 0 ? 0 : 6, frontBase = frontZ === 0 ? 0 : 6;

    /* specchio d'acqua */
    poly([P(-1.2, 0, -1.2), P(LX + 1.2, 0, -1.2), P(LX + 1.2, 0, DZ + 1.2), P(-1.2, 0, DZ + 1.2)],
      'rgba(143,176,232,0.02)', 'rgb(' + HAIR + ')', 1);

    /* riflesso */
    arcade(backZ, backBase, true);
    arcade(frontZ, frontBase, true);
    var gl = ctx.createLinearGradient(0, cy, 0, H);
    gl.addColorStop(0, 'rgba(8,10,13,0)'); gl.addColorStop(1, 'rgba(8,10,13,0.9)');
    ctx.fillStyle = gl; ctx.fillRect(m, cy, W - 2 * m, H - m - cy);

    arcade(backZ, backBase, false);

    /* volume vetrato sospeso */
    var gx0 = 1.4, gx1 = LX - 1.4, gy0 = 1.1, gy1 = ySpr - 0.15, gz0 = 1.0, gz1 = DZ - 1.0;
    function GP(a, b, c) { return P(a ? gx1 : gx0, b ? gy1 : gy0, c ? gz1 : gz0); }
    quad(GP(0, 0, 0), GP(1, 0, 0), GP(1, 1, 0), GP(0, 1, 0), 'rgba(' + ACC + ',0.05)', 'rgba(' + ACC + ',0.4)', 1);
    quad(GP(1, 0, 0), GP(1, 0, 1), GP(1, 1, 1), GP(1, 1, 0), 'rgba(' + ACC + ',0.04)', 'rgba(' + ACC + ',0.35)', 1);
    quad(GP(0, 1, 0), GP(1, 1, 0), GP(1, 1, 1), GP(0, 1, 1), 'rgba(' + ACC + ',0.06)', 'rgba(' + ACC + ',0.4)', 1);
    var g;
    for (g = 1; g < 8; g++) { var ug = g / 8; poly([P(gx0 + (gx1 - gx0) * ug, gy0, gz0), P(gx0 + (gx1 - gx0) * ug, gy1, gz0)], null, 'rgba(' + ACC + ',0.18)', 1); }
    for (g = 1; g < 3; g++) { var uh = g / 3; poly([P(gx0, gy0 + (gy1 - gy0) * uh, gz0), P(gx1, gy0 + (gy1 - gy0) * uh, gz0)], null, 'rgba(' + ACC + ',0.18)', 1); }
    [gx0, (gx0 + gx1) / 2, gx1].forEach(function (hx) {
      poly([P(hx, gy1, gz0), P(hx, Hh, gz0)], null, 'rgba(' + NEU + ',0.3)', 1);
      node(hx, gy1, gz0, false, false); node(hx, Hh, gz0, false, false);
    });

    arcade(frontZ, frontBase, false);

    /* copertura piana a sbalzo */
    var ov = 0.42, rt = Hh, rb = Hh + 0.24;
    function RT(a, c) { return P(a ? LX + ov : -ov, rb, c ? DZ + ov : -ov); }
    function RB(a, c) { return P(a ? LX + ov : -ov, rt, c ? DZ + ov : -ov); }
    quad(RT(0, 0), RT(1, 0), RT(1, 1), RT(0, 1), 'rgba(' + NEU + ',0.13)', 'rgba(' + NEU + ',0.72)', 1.4 * S);
    quad(RB(0, 0), RB(1, 0), RT(1, 0), RT(0, 0), 'rgba(' + NEU + ',0.06)', 'rgba(' + NEU + ',0.6)', 1);
    quad(RB(1, 0), RB(1, 1), RT(1, 1), RT(1, 0), 'rgba(' + NEU + ',0.04)', 'rgba(' + NEU + ',0.5)', 1);
    for (var i4 = 0; i4 <= NB; i4++) { node(bx(i4), Hh, frontZ, false, false); node(bx(i4), Hh, backZ, false, false); }

    var dd0 = P(-1.2, 0, DZ + 1.4), dd1 = P(LX + 1.2, 0, DZ + 1.4);
    ctx.strokeStyle = 'rgba(' + DIM + ',0.45)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(dd0.x, dd0.y + 12 * S); ctx.lineTo(dd1.x, dd1.y + 12 * S); ctx.stroke();

    ctx.fillStyle = 'rgba(' + NEU + ',0.7)'; setF(8.5); ctx.textAlign = 'left';
    ctx.fillText('CANTILEVER ROOF · SUSPENDED GLASS · POOL', m + 14 * S, H - m - 12 * S);

    /* la legenda vive in HTML: qui sincronizziamo solo l'evidenza */
    if (front !== lastFront) { lastFront = front; syncKey(front); }
  }

  var lastFront = -1;
  var rows = [].slice.call(document.querySelectorAll('.arch-key li'));
  function syncKey(i) {
    for (var r = 0; r < rows.length; r++) rows[r].classList.toggle('on', r === i);
  }

  function step(now) { draw((now - t0) / 1000 * (reduced ? 0.4 : 1)); raf = requestAnimationFrame(step); }
  raf = requestAnimationFrame(step);

  if (document.fonts && document.fonts.load) { document.fonts.load('500 12px "IBM Plex Mono"').catch(function () {}); }
})();
