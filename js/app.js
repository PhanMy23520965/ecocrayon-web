/* ECOCRAYON – lõi trang: điều hướng, tiến trình của bé, đọc to, âm thanh và các trang nội dung. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var A = EC.art;
  EC.$ = $; EC.$$ = $$; EC.esc = esc;

  EC.shuffle = function (arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  /* ---------- Lưu trên máy (không gửi đi đâu) ---------- */
  var store = EC.store = {
    get: function (k, d) { try { var v = localStorage.getItem('ecocrayon.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('ecocrayon.' + k, JSON.stringify(v)); } catch (e) { /* trình duyệt chặn lưu: trang vẫn chạy */ } }
  };

  /* ---------- Thông báo nhỏ ---------- */
  var toastTimer;
  EC.toast = function (msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  };

  /* ---------- Âm thanh ---------- */
  var S = EC.sfx = {
    on: store.get('sound', true), ctx: null,
    tone: function (f, d, type, t, vol) {
      var o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + d + 0.03);
    },
    play: function (kind) {
      if (!this.on) return;
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        var t = this.ctx.currentTime, self = this;
        if (kind === 'good') { this.tone(660, 0.12, 'triangle', t); this.tone(880, 0.18, 'triangle', t + 0.1); }
        else if (kind === 'bad') { this.tone(200, 0.2, 'sawtooth', t, 0.04); }
        else if (kind === 'win') { [523, 659, 784, 1046].forEach(function (f, i) { self.tone(f, 0.2, 'triangle', t + i * 0.11); }); }
        else if (kind === 'flip') { this.tone(420, 0.05, 'square', t, 0.025); }
        else { this.tone(560, 0.07, 'sine', t, 0.08); }
      } catch (e) { /* không có âm thanh cũng không sao */ }
    }
  };

  /* ---------- Đọc to tiếng Việt (giọng có sẵn trên máy) ---------- */
  var V = EC.voice = {
    ok: false, v: null, auto: store.get('voice', false),
    init: function () {
      var self = this;
      if (!('speechSynthesis' in window)) { this.ui(); return; }
      var pick = function () {
        var vs = window.speechSynthesis.getVoices() || [];
        self.v = vs.filter(function (x) { return /^vi([-_]|$)/i.test(x.lang); })[0] || null;
        self.ok = !!self.v; self.ui();
      };
      pick(); window.speechSynthesis.onvoiceschanged = pick; setTimeout(pick, 900);
    },
    ui: function () {
      document.body.classList.toggle('no-voice', !this.ok);
      var b = $('#btn-voice');
      b.setAttribute('aria-pressed', String(this.ok && this.auto));
      b.title = !this.ok ? 'Máy này chưa có giọng đọc tiếng Việt' : (this.auto ? 'Tắt đọc to' : 'Bật đọc to');
    },
    say: function (text, btn) {
      if (!this.ok || !text) return;
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.voice = this.v; u.lang = this.v.lang; u.rate = 0.92; u.pitch = 1.05;
        $$('.say.speaking').forEach(function (b) { b.classList.remove('speaking'); });
        if (btn) { btn.classList.add('speaking'); u.onend = u.onerror = function () { btn.classList.remove('speaking'); }; }
        window.speechSynthesis.speak(u);
      } catch (e) { /* bỏ qua */ }
    },
    autoSay: function (text) { if (this.auto) this.say(text); },
    stop: function () { try { window.speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } }
  };
  EC.sayBtn = function (text) { return '<button class="say" type="button" data-say="' + esc(text) + '" aria-label="Nghe đọc"></button>'; };

  /* ---------- Bé Sáp nói ---------- */
  EC.mascotLine = function (text, mood, id) {
    return '<div class="mascot-row"' + (id ? ' id="' + id + '"' : '') + '>' + A.mascot(mood || 'happy') +
      '<div class="bubble"><p>' + esc(text) + '</p>' + EC.sayBtn(text) + '</div></div>';
  };
  EC.setBubble = function (row, text, mood) {
    if (!row) return;
    var old = $('.mascot', row);
    var tmp = document.createElement('div'); tmp.innerHTML = A.mascot(mood || 'happy');
    old.replaceWith(tmp.firstChild);
    $('.bubble p', row).textContent = text;
    $('.bubble .say', row).setAttribute('data-say', text);
    $('.mascot', row).classList.add('bounce');
    V.autoSay(text);
  };

  /* ---------- Tiến trình: lá, huy hiệu, việc đã làm ---------- */
  var P = EC.progress = {
    data: (function () { var d = store.get('progress', null); if (!d || typeof d !== 'object') d = {}; d.leaves = d.leaves || 0; d.stickers = d.stickers || {}; d.done = d.done || {}; d.name = d.name || ''; return d; })(),
    save: function () { store.set('progress', this.data); document.dispatchEvent(new CustomEvent('ec:progress')); },
    stage: function () { var s = 0, n = this.data.leaves; EC.TREE.forEach(function (t, i) { if (n >= t.at) s = i; }); return s; },
    isDone: function (id) { return !!this.data.done[id]; },
    has: function (id) { return !!this.data.stickers[id]; },
    mark: function (id) { if (this.data.done[id]) return false; this.data.done[id] = Date.now(); this.save(); return true; },
    add: function (n, why) {
      var before = this.stage(); this.data.leaves += n; this.save();
      var pill = $('#leafpill'); pill.classList.remove('pulse'); void pill.offsetWidth; pill.classList.add('pulse');
      EC.toast('+' + n + ' lá · ' + why);
      var after = this.stage(); if (after > before) queueAward({ tree: after });
    },
    award: function (id) {
      if (this.data.stickers[id]) return false;
      this.data.stickers[id] = Date.now(); this.save(); queueAward({ sticker: id }); checkMeta(); return true;
    },
    reset: function () { this.data.leaves = 0; this.data.stickers = {}; this.data.done = {}; this.save(); }
  };
  EC.missionCount = function () {
    var ids = EC.MISSIONS.map(function (m) { return m.id; });
    return Object.keys(P.data.done).filter(function (k) { return ids.indexOf(k) >= 0 || k.indexOf('nha-') === 0; }).length;
  };
  function checkMeta() {
    if (EC.COLORS.every(function (c) { return P.has('mau-' + c.id); })) P.award('cau-vong');
    var n = EC.missionCount();
    if (n >= 3) P.award('chien-binh');
    if (n >= 6) P.award('sieu-anh-hung');
  }
  /* Thưởng một lần cho một việc; chơi lại vẫn được lá nếu repeatLeaves > 0 */
  EC.reward = function (opt) {
    var first = opt.once ? P.mark(opt.once) : true;
    var n = first ? opt.leaves : (opt.repeatLeaves || 0);
    if (n > 0) P.add(n, opt.why);
    if (opt.sticker) P.award(opt.sticker);
    return first;
  };
  document.addEventListener('ec:progress', function () { $('#leaf-count').textContent = P.data.leaves; });

  /* ---------- Hộp thoại ---------- */
  var lastFocus = null, modalClose = null;
  EC.modal = function (html, onClose) {
    var m = $('#modal'); lastFocus = document.activeElement;
    $('#modal-body').innerHTML = html; m.hidden = false; modalClose = onClose || null;
    var first = $('button, a, input', m); if (first) first.focus();
  };
  EC.closeModal = function () {
    var m = $('#modal'); if (m.hidden) return;
    m.hidden = true; $('#modal-body').innerHTML = '';
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ }
    var cb = modalClose; modalClose = null; if (cb) cb();
  };
  document.addEventListener('click', function (e) {
    if (e.target.id === 'modal' || e.target.closest('[data-close]')) EC.closeModal();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { EC.closeModal(); closeDrawer(); } });

  EC.confetti = function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = $('#confetti'), cols = EC.COLORS.map(function (c) { return c.hex; });
    for (var i = 0; i < 70; i++) {
      var d = document.createElement('i'); d.className = 'cf';
      d.style.left = Math.random() * 100 + 'vw'; d.style.background = cols[i % cols.length];
      d.style.animationDuration = (1.6 + Math.random() * 1.4) + 's'; d.style.animationDelay = Math.random() * 0.4 + 's';
      d.style.setProperty('--rot', (Math.random() * 900 - 450) + 'deg');
      box.appendChild(d);
    }
    setTimeout(function () { box.innerHTML = ''; }, 3600);
  };

  var awardQ = [], showing = false;
  function queueAward(x) { awardQ.push(x); if (!showing) nextAward(); }
  function nextAward() {
    var x = awardQ.shift(); if (!x) { showing = false; return; }
    showing = true; S.play('win'); EC.confetti();
    var html;
    if (x.sticker) {
      var s = EC.STICKERS.filter(function (k) { return k.id === x.sticker; })[0];
      html = '<div class="disc">' + A.thing(s.icon) + '</div><h2 id="modal-title">Huy hiệu mới!</h2><p class="award-name">' + esc(s.name) + '</p>' +
        '<div class="row"><button class="btn" type="button" data-close>Tuyệt quá!</button></div>';
      V.autoSay('Bé nhận được huy hiệu ' + s.name);
    } else {
      var t = EC.TREE[x.tree];
      html = '<div style="max-width:220px;margin:0 auto">' + A.tree(x.tree) + '</div><h2 id="modal-title">Cây lớn rồi!</h2><p class="award-name">' + esc(t.name) + '</p>' +
        '<div class="row"><button class="btn" type="button" data-close>Chơi tiếp</button></div>';
      V.autoSay('Cây của bé đã thành ' + t.name);
    }
    EC.modal(html, function () { setTimeout(nextAward, 250); });
  }

  /* ---------- In, tải file ---------- */
  EC.printHTML = function (html) {
    var root = $('#print-root'); root.innerHTML = html; document.body.classList.add('printing');
    var done = function () { document.body.classList.remove('printing'); root.innerHTML = ''; window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(function () { window.print(); }, 80);
  };
  EC.download = function (filename, blob) {
    var url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  };

  /* ---------- Mã trên thẻ ---------- */
  EC.normCode = function (s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'D').replace(/[^A-Za-z0-9]/g, '').toUpperCase(); };
  function bindCodeForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', form), msg = $('.codebox-msg', form), code = EC.normCode(input.value);
      if (!code) { msg.textContent = 'Nhập mã trên thẻ, ví dụ NGHE.'; input.focus(); return; }
      var route = EC.CODES[code];
      if (!route) { msg.textContent = 'Không có mã “' + code + '”.'; return; }
      msg.textContent = ''; input.value = ''; location.hash = '#' + route;
    });
  }

  /* ---------- Điều hướng ---------- */
  var ROUTES = {}, leaveFns = [];
  EC.route = function (name, fn, title) { ROUTES[name] = { fn: fn, title: title }; };
  EC.onLeave = function (fn) { leaveFns.push(fn); };
  var NAVGROUP = function (r) {
    if (r === 'vuon-mau' || r.indexOf('mau-') === 0) return 'mau';
    if (['tro-choi', 'ghep-cap', 'phan-loai', 'do-vui', 'pha-mau'].indexOf(r) >= 0) return 'choi';
    if (r === 'to-mau') return 'to';
    if (r === 'thu-thach' || r === 'tai-che') return 'thuthach';
    if (r === 'so-cua-be') return 'so';
    if (['phu-huynh', 've-ecocrayon', 'ma-qr'].indexOf(r) >= 0) return 'lon';
    return '';
  };
  function render() {
    var name = '';
    try { name = decodeURIComponent(location.hash.slice(1)); } catch (e) { name = location.hash.slice(1); }
    if (!ROUTES[name]) {
      var code = EC.normCode(name);
      if (EC.CODES[code]) { location.replace('#' + EC.CODES[code]); return; }
      name = 'trang-chu';
    }
    var r = ROUTES[name];
    leaveFns.splice(0).forEach(function (f) { try { f(); } catch (e) { /* bỏ qua */ } });
    V.stop(); EC.closeModal();
    var view = $('#view'); view.innerHTML = '';
    r.fn(view, name);
    var t = typeof r.title === 'function' ? r.title(name) : r.title;
    document.title = t ? t + ' · ECOCRAYON' : 'ECOCRAYON – Bộ màu sáp thiên nhiên';
    window.scrollTo(0, 0);
    var grp = NAVGROUP(name);
    $$('[data-nav]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === grp); });
    $$('.drawer-panel a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + name); });
    closeDrawer();
    try { view.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ }
  }
  EC.go = function (name) { if (location.hash === '#' + name) render(); else location.hash = '#' + name; };
  function closeDrawer() { var d = $('#drawer'); if (!d.hidden) { d.hidden = true; $('#btn-menu').setAttribute('aria-expanded', 'false'); } }

  /* ---------- Mẩu giao diện dùng chung ---------- */
  EC.head = function (o) {
    return '<div class="sec-head"><div class="stack" style="gap:6px">' +
      (o.crumbs ? '<nav class="crumbs" aria-label="Quay lại">' + o.crumbs + '</nav>' : '') +
      '<h1 class="h2"><span class="title-scribble" style="--sc:var(' + (o.sc || '--c-nghe') + ')">' + o.title + '</span></h1>' +
      (o.lead ? '<p class="lead">' + o.lead + '</p>' : '') + '</div>' + (o.side || '') + '</div>';
  };
  function colorClass(id) { return 'c-' + id; }
  function adultBox(inner) { return '<details class="adult"><summary>Góc người lớn</summary><div class="stack" style="gap:8px">' + inner + '</div></details>'; }

  /* ================= TRANG CHỦ ================= */
  EC.route('trang-chu', function (view) {
    var chips = EC.COLORS.map(function (c) { return '<a href="#mau-' + c.id + '" class="' + colorClass(c.id) + '"><span class="chip">' + esc(c.name) + '</span></a>'; }).join('');
    var stage = P.stage(), next = EC.TREE[stage + 1];
    var pct = next ? Math.round((P.data.leaves - EC.TREE[stage].at) / (next.at - EC.TREE[stage].at) * 100) : 100;
    view.innerHTML =
      '<section class="hero"><div class="wrap hero-grid">' +
        '<div class="hero-copy">' +
          '<h1 class="h1"><span>Tô màu thiên nhiên,</span><span class="w2">khơi nguồn tri thức xanh</span></h1>' +
          EC.mascotLine('Chào bé! Chạm vào một cây sáp nhé!', 'happy', 'home-m') +
          '<div class="row"><a class="btn btn-big" href="#vuon-mau">Khám phá màu</a><a class="btn btn-big btn-ghost" href="#tro-choi">Chơi ngay</a></div>' +
        '</div>' +
        '<div class="hero-art">' + A.heroBox() + '<div class="hero-chips">' + chips + '</div></div>' +
      '</div></section>' +
      '<section class="section-tight"><div class="wrap">' +
        '<h2 class="h2" style="margin-bottom:18px"><span class="title-scribble" style="--sc:var(--c-den)">Bé muốn làm gì?</span></h2>' +
        '<div class="acts">' +
          act('#vuon-mau', 'c-den', A.ingredient('den') + A.ingredient('nghe'), 'Khám phá màu') +
          act('#tro-choi', 'c-dau-biec', A.thing('b-cards') + A.bin(EC.BINS[3]), 'Trò chơi') +
          act('#to-mau', 'c-nghe', A.crayon(EC.COLORS[1].hex) + A.crayon(EC.COLORS[0].hex) + A.thing('k-book'), 'Tô màu') +
          act('#thu-thach', 'c-la-dua', A.thing('b-leaf') + A.thing('b-recycle'), 'Thử thách xanh') +
        '</div>' +
      '</div></section>' +
      '<section class="section"><div class="wrap home-duo">' +
        '<a class="sheet treecard" href="#so-cua-be">' + A.tree(stage) +
          '<div class="stack" style="gap:10px"><h2 class="h3">Cây của bé</h2><p class="big-stat">' + esc(EC.TREE[stage].name) + ' · ' + P.data.leaves + ' lá</p>' +
          '<div class="meter" role="img" aria-label="Tiến độ"><span style="width:' + pct + '%"></span></div></div>' +
        '</a>' +
        '<form class="sheet codebox" id="home-code" autocomplete="off">' +
          '<h2 class="h3"><label for="home-code-in">Nhập mã trên thẻ màu</label></h2>' +
          '<div class="codebox-row"><input id="home-code-in" placeholder="VD: NGHE" maxlength="12" spellcheck="false"><button class="btn" type="submit">Mở</button></div>' +
          '<p class="codebox-msg" aria-live="polite"></p>' +
        '</form>' +
      '</div></section>' +
      '<section class="section-tight"><div class="wrap"><nav class="grownups" aria-label="Dành cho người lớn"><span>Dành cho người lớn:</span>' +
        '<a href="#phu-huynh">Phụ huynh &amp; giáo viên</a><a href="#ve-ecocrayon">Về ECOCRAYON</a><a href="#tai-che">Góc tái chế</a>' +
      '</nav></div></section>';
    bindCodeForm($('#home-code'));
    $$('.hero-crayon', view).forEach(function (a) { a.addEventListener('mouseenter', function () { S.play('pop'); }); });
  }, '');
  function act(href, cls, art, title) {
    return '<a class="act ' + cls + '" href="' + href + '"><div class="act-art">' + art + '</div><h3>' + title + '</h3></a>';
  }

  /* ================= VƯỜN MÀU ================= */
  EC.route('vuon-mau', function (view) {
    var cards = EC.COLORS.map(function (c) {
      return '<a class="colorcard ' + colorClass(c.id) + '" href="#mau-' + c.id + '">' + A.ingredient(c.id) +
        '<div class="stack" style="gap:4px;min-width:0"><h3><span class="dot"></span>' + esc(c.color) + '</h3><p class="cc-name">' + esc(c.name) + '</p></div>' +
        (P.has('mau-' + c.id) ? '<span class="done-mark" aria-label="Đã xong">✓</span>' : '') + '</a>';
    }).join('');
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ title: 'Chọn một màu', sc: '--c-la-dua' }) +
      '<div class="colorgrid">' + cards + '</div>' +
      '</div></section>';
  }, 'Vườn màu');

  /* ================= TRANG MỘT MÀU (đích của mã QR) ================= */
  EC.COLORS.forEach(function (c, idx) {
    EC.route('mau-' + c.id, function (view) { colorPage(view, c, idx); }, c.color + ' – ' + c.name);
  });

  function colorPage(view, c, idx) {
    var prev = EC.COLORS[(idx + 5) % 6], next = EC.COLORS[(idx + 1) % 6], col = c.color.toLowerCase();
    var flips = c.facts.map(function (f, i) {
      return '<button class="flip" type="button" aria-label="Lật thẻ số ' + (i + 1) + '"><div class="flip-in">' +
        '<div class="flip-face flip-front"><span class="q">?</span></div>' +
        '<div class="flip-face flip-back"><p>' + esc(f) + '</p></div></div></button>';
    }).join('');
    view.innerHTML =
      '<div class="cband ' + colorClass(c.id) + '"><div class="wrap cband-in">' +
        '<div class="cband-copy">' +
          '<a class="back" href="#vuon-mau">‹ Vườn màu</a>' +
          '<h1 class="h1">' + esc(c.name) + '<small>màu ' + esc(col) + '</small></h1>' +
          '<div class="bubble"><p>' + esc(c.hello) + '</p>' + EC.sayBtn(c.hello) + '</div>' +
          '<div class="cfacts">' +
            '<div class="cfact"><b>Phần cho màu</b><strong>' + esc(c.part) + '</strong></div>' +
            '<div class="cfact"><b>Chất màu</b><strong>' + esc(c.pigment) + '</strong></div>' +
            '<div class="cfact"><b>Sống ở</b><strong>' + esc(c.home) + '</strong></div>' +
          '</div>' +
        '</div>' +
        '<div class="cband-art">' + A.ingredient(c.id, '', c.name) + A.crayon(c.hex, 'cband-crayon') + '</div>' +
      '</div></div>' +

      '<section class="section ' + colorClass(c.id) + '"><div class="wrap">' +
        '<h2 class="h2" style="margin-bottom:16px"><span class="title-scribble" style="--sc:var(--c)">Màu làm ra thế nào?</span></h2>' +
        '<div class="film" id="film">' +
          '<div class="film-stage" id="film-stage"></div>' +
          '<div class="stack">' +
            '<p class="film-cap" id="film-cap" aria-live="polite"></p>' +
            '<div class="film-dots" id="film-dots"></div>' +
            '<div class="row"><button class="btn btn-ghost" type="button" id="film-prev" aria-label="Bước trước">‹</button>' +
            '<button class="btn" type="button" id="film-play">Xem phim</button>' +
            '<button class="btn btn-ghost" type="button" id="film-next" aria-label="Bước sau">›</button></div>' +
          '</div>' +
        '</div>' +
        (c.video ? '<video class="film-video" controls preload="none" src="' + esc(c.video) + '" style="margin-top:18px"></video>' : '') +
      '</div></section>' +

      '<section class="section-tight ' + colorClass(c.id) + '"><div class="wrap">' +
        '<h2 class="h2" style="margin-bottom:16px">Bé có biết?</h2><div class="flips">' + flips + '</div>' +
      '</div></section>' +

      '<section class="section ' + colorClass(c.id) + '"><div class="wrap">' +
        '<div class="sheet stack">' +
          '<div class="sec-head" style="margin:0"><h2 class="h2">Tìm màu ' + esc(col) + '</h2><span class="score" id="find-score"></span></div>' +
          EC.mascotLine('Chạm vào những thứ màu ' + col + '!', 'happy', 'find-m') +
          '<div class="findgrid" id="findgrid"></div>' +
          '<div class="row" id="find-again" hidden><button class="btn btn-ghost" type="button">Chơi lại</button></div>' +
        '</div>' +
      '</div></section>' +

      (c.lab ? '<section class="section-tight ' + colorClass(c.id) + '"><div class="wrap"><div class="sheet" id="lab"></div></div></section>' : '') +

      '<section class="section ' + colorClass(c.id) + '"><div class="wrap stack">' +
        '<div class="tasks">' +
          '<div class="sheet stack"><h2 class="h3">Vẽ với sáp thật</h2><p class="task-text">' + esc(c.draw) + '</p>' +
            (c.drawLink ? '<a class="btn btn-sm" href="' + c.drawLink.href + '" style="align-self:flex-start">' + esc(c.drawLink.label) + '</a>' : '') + '</div>' +
          '<div class="sheet stack"><h2 class="h3">Việc xanh</h2><p class="task-text">' + esc(c.task.text) + '</p>' +
            '<button class="btn btn-sm" type="button" id="task-btn" style="align-self:flex-start"></button></div>' +
        '</div>' +
        adultBox('<p>' + esc(c.adult) + '</p>' +
          '<p class="small muted">' + (c.status === 'core' ? 'Màu chính trong bộ mẫu đầu tiên.' : 'Màu nhóm đang thử nghiệm.') + ' Mã thẻ: <b>' + c.code + '</b>. Phim nhỏ mô tả cách nhóm đang thử làm màu; việc đun, sấy, làm chảy sáp luôn do người lớn làm. Bút sáp để vẽ, không ăn được. Màu thật có thể đậm nhạt khác màu trên màn hình.</p>') +
        '<div class="prevnext"><a class="btn btn-ghost btn-sm" href="#mau-' + prev.id + '">‹ ' + esc(prev.color) + '</a><a class="btn btn-ghost btn-sm" href="#mau-' + next.id + '">' + esc(next.color) + ' ›</a></div>' +
      '</div></section>';

    filmPlayer(c);
    $$('.flip', view).forEach(function (b) {
      b.addEventListener('click', function () { b.classList.toggle('open'); S.play('flip'); if (b.classList.contains('open')) V.autoSay($('.flip-back p', b).textContent); });
    });
    findGame(c);
    if (c.lab) EC.labWidget($('#lab'), c);
    taskButton(c);
  }

  function filmPlayer(c) {
    var i = 0, timer = null, stage = $('#film-stage'), cap = $('#film-cap'), dots = $('#film-dots'), play = $('#film-play');
    dots.innerHTML = c.film.map(function (_, k) { return '<button type="button" aria-label="Bước ' + (k + 1) + '"></button>'; }).join('');
    function show() {
      stage.innerHTML = A.film(i, c);
      cap.textContent = (i + 1) + '. ' + c.film[i];
      $$('button', dots).forEach(function (d, k) { d.classList.toggle('on', k <= i); });
      if (i === c.film.length - 1) EC.reward({ once: 'film-' + c.id, leaves: 1, why: 'Xem hết phim' });
    }
    function stop() { clearInterval(timer); timer = null; play.textContent = i === c.film.length - 1 ? 'Xem lại' : 'Xem phim'; }
    function go(k) { i = Math.max(0, Math.min(c.film.length - 1, k)); show(); V.autoSay(c.film[i]); }
    play.addEventListener('click', function () {
      if (timer) { stop(); return; }
      if (i === c.film.length - 1) go(0); else V.autoSay(c.film[i]);
      play.textContent = 'Dừng';
      timer = setInterval(function () { if (i < c.film.length - 1) go(i + 1); if (i === c.film.length - 1) stop(); }, 3000);
    });
    $('#film-prev').addEventListener('click', function () { stop(); go(i - 1); });
    $('#film-next').addEventListener('click', function () { stop(); go(i + 1); });
    $$('button', dots).forEach(function (d, k) { d.addEventListener('click', function () { stop(); go(k); }); });
    EC.onLeave(function () { clearInterval(timer); });
    show();
  }

  function findGame(c) {
    var grid = $('#findgrid'), row = $('#find-m'), score = $('#find-score'), again = $('#find-again'), col = c.color.toLowerCase();
    function start() {
      var items = EC.shuffle(c.find.yes.concat(c.find.no)), found = 0;
      again.hidden = true;
      grid.innerHTML = items.map(function (id) { return '<button class="finditem" type="button" data-id="' + id + '">' + A.thing(id) + '<span>' + esc(EC.NATURE[id]) + '</span></button>'; }).join('');
      score.textContent = '0 / ' + c.find.yes.length;
      $$('.finditem', grid).forEach(function (b) {
        b.addEventListener('click', function () {
          var id = b.getAttribute('data-id'), name = EC.NATURE[id];
          if (b.classList.contains('is-yes')) return;
          if (c.find.yes.indexOf(id) >= 0) {
            b.classList.add('is-yes'); found++; S.play('good');
            score.textContent = found + ' / ' + c.find.yes.length;
            if (found === c.find.yes.length) {
              EC.setBubble(row, 'Giỏi quá! Tìm đủ rồi!', 'wow');
              again.hidden = false;
              EC.reward({ once: 'find-' + c.id, leaves: 2, why: 'Tìm màu ' + col, sticker: 'mau-' + c.id });
            } else {
              EC.setBubble(row, 'Đúng rồi! ' + name + ' màu ' + col + '.', 'happy');
            }
          } else {
            b.classList.remove('is-no'); void b.offsetWidth; b.classList.add('is-no'); S.play('bad');
            EC.setBubble(row, name + ' không phải màu ' + col + '.', 'think');
          }
        });
      });
    }
    $('button', again).addEventListener('click', start);
    start();
  }

  function taskButton(c) {
    var b = $('#task-btn');
    function paint() { var d = P.isDone(c.task.id); b.textContent = d ? 'Đã xong ✓' : 'Bé làm xong rồi!'; b.disabled = d; }
    b.addEventListener('click', function () {
      if (EC.reward({ once: c.task.id, leaves: 1, why: 'Việc xanh' })) { S.play('good'); checkMeta(); }
      paint();
    });
    paint();
  }

  /* Phòng thí nghiệm đổi màu (dùng chung cho đậu biếc và bắp cải tím) */
  EC.labWidget = function (box, c) {
    var L = EC.LAB[c.lab], k = 2, seen = { 2: true };
    box.innerHTML = '<div class="lab"><div>' + A.beaker() + '</div><div class="stack">' +
      '<h2 class="h2">Thí nghiệm đổi màu</h2>' +
      '<p class="lab-say" id="lab-say" aria-live="polite"></p>' +
      '<div class="lab-scale" id="lab-scale">' + L.colors.map(function (col) { return '<span style="background:' + col + '"></span>'; }).join('') + '</div>' +
      '<div class="lab-ends"><span>Chua</span><span>Nồng</span></div>' +
      '<div class="row"><button class="btn c-nghe" type="button" data-d="-1">+ Chanh</button><button class="btn c-dau-biec" type="button" data-d="1">+ Muối nở</button><button class="btn btn-ghost" type="button" data-d="0">Làm lại</button></div>' +
      '</div></div>' +
      adultBox('<p>Chất anthocyanin trong ' + esc(c.name.toLowerCase()) + ' đổi màu khi gặp chua (chanh) hoặc nồng (muối nở). Làm thật cùng người lớn và không uống nước thí nghiệm.</p>');
    var svgEl = $('.beaker', box);
    function paint(sayIt) {
      svgEl.style.setProperty('--lab', L.colors[k]);
      $$('#lab-scale span', box).forEach(function (s, i) { s.classList.toggle('on', i === k); });
      var msg = k === 2 ? 'Nước màu ' + L.words[k] + '.' : (k < 2 ? 'Thêm chanh: ' : 'Thêm muối nở: ') + 'nước hóa ' + L.words[k] + '!';
      $('#lab-say', box).textContent = msg;
      if (sayIt) V.autoSay(msg);
    }
    $$('button[data-d]', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var d = +b.getAttribute('data-d');
        k = d === 0 ? 2 : Math.max(0, Math.min(4, k + d)); seen[k] = true; S.play('pop'); paint(true);
        if (seen[0] && seen[4]) EC.reward({ once: 'lab-' + c.id, leaves: 2, why: 'Thí nghiệm đổi màu', sticker: 'thi-nghiem' });
      });
    });
    paint(false);
  };

  /* ================= GÓC TÁI CHẾ (đích mã QR TAICHE) ================= */
  EC.route('tai-che', function (view) {
    var bins = EC.BINS.map(function (b) {
      var ex = EC.WASTE.filter(function (w) { return w.bin === b.id; }).slice(0, 3);
      return '<div class="sheet recycle-bin"><div class="rb-bin">' + A.bin(b) + '</div><h3 class="h3">' + b.name + '</h3>' +
        '<div class="row rb-ex">' + ex.map(function (w) { return '<span title="' + esc(w.name) + '">' + A.thing(w.id, '', w.name) + '</span>'; }).join('') + '</div></div>';
    }).join('');
    view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:22px">' +
      EC.head({ title: 'Rác nào về nhà nấy', sc: '--c-la-dua' }) +
      EC.mascotLine('Rửa sạch, để khô rồi mới bỏ rác nhé!', 'happy') +
      '<div class="grid" style="--min:220px">' + bins + '</div>' +
      '<div class="row"><a class="btn btn-big c-la-dua" href="#phan-loai">Chơi phân loại rác</a><a class="btn btn-big btn-ghost" href="#thu-thach">Làm đồ tái chế</a></div>' +
      adultBox('<p>Theo Luật Bảo vệ môi trường 2020, rác sinh hoạt hộ gia đình được phân thành ba nhóm chính: rác tái chế được, rác thực phẩm và rác khác. Trò chơi chia nhỏ nhóm tái chế thành giấy, nhựa, kim loại để bé dễ nhận biết. Cách thu gom có thể khác nhau ở từng địa phương.</p>' +
        '<ul><li>Rửa sạch chai, hộp, lon và để khô.</li><li>Gấp dẹp hộp carton, tách nắp khỏi chai.</li><li>Pin, bóng đèn, thuốc hết hạn không bỏ chung rác thường.</li></ul>') +
      '</div></section>';
  }, 'Góc tái chế');

  /* ================= THỬ THÁCH XANH ================= */
  var DIY_ICON = { 'ong-cam-but': 'loigiay', 'khay-nap-chai': 'nap', 'hop-carton': 'carton', 'tui-cuon': 'k-bag', 'khay-bot-giay': 'bao' };
  EC.route('thu-thach', function (view) {
    function missionCard(m) {
      var d = P.isDone(m.id);
      return '<div class="mission' + (d ? ' done' : '') + '"><span class="chip leafchip">+' + m.leaves + ' lá</span><h3>' + esc(m.title) + '</h3><p>' + esc(m.how) + '</p>' +
        (d ? '<span class="stamp">Đã xong ✓</span>' : '<button class="btn btn-sm c-la-dua" type="button" data-m="' + m.id + '">Xong rồi!</button>') + '</div>';
    }
    function diyCard(x) {
      var d = P.isDone(x.id);
      return '<details class="diy' + (d ? ' done' : '') + '"><summary>' + A.thing(DIY_ICON[x.id]) +
        '<h3>' + esc(x.title) + '</h3><span class="chip">' + (d ? 'Đã làm ✓' : '+' + x.leaves + ' lá') + '</span></summary>' +
        '<div class="diy-body"><div><b>Cần có</b><ul>' + x.need.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul><p class="note note-safe small" style="margin-top:10px">' + esc(x.safe) + '</p></div>' +
        '<div><b>Cách làm</b><ol>' + x.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
        (d ? '' : '<button class="btn btn-sm c-ca-rot" type="button" data-diy="' + x.id + '" style="margin-top:12px">Làm xong rồi!</button>') + '</div></div></details>';
    }
    function paint() {
      view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:24px">' +
        EC.head({ title: 'Thử thách xanh', sc: '--c-la-dua', side: '<span class="score">Đã xong: ' + EC.missionCount() + '</span>' }) +
        '<div class="missions">' + EC.MISSIONS.map(missionCard).join('') + '</div>' +
        '<div><h2 class="h2" style="margin-bottom:16px"><span class="title-scribble" style="--sc:var(--c-ca-rot)">Đồ tái chế tự làm</span></h2>' +
        '<div class="diys">' + EC.DIY.map(diyCard).join('') + '</div></div>' +
        '</div></section>';
      $$('[data-m]', view).forEach(function (b) {
        b.addEventListener('click', function () {
          var m = EC.MISSIONS.filter(function (x) { return x.id === b.getAttribute('data-m'); })[0];
          if (EC.reward({ once: m.id, leaves: m.leaves, why: m.title })) { S.play('good'); checkMeta(); }
          paint();
        });
      });
      $$('[data-diy]', view).forEach(function (b) {
        b.addEventListener('click', function () {
          var x = EC.DIY.filter(function (k) { return k.id === b.getAttribute('data-diy'); })[0];
          if (EC.reward({ once: x.id, leaves: x.leaves, why: x.title, sticker: 'kheo-tay' })) S.play('good');
          paint();
        });
      });
    }
    paint();
  }, 'Thử thách xanh');

  /* ================= SỔ CỦA BÉ ================= */
  EC.route('so-cua-be', function (view) {
    function paint() {
      var st = P.stage(), next = EC.TREE[st + 1], got = Object.keys(P.data.stickers).length;
      var pct = next ? Math.round((P.data.leaves - EC.TREE[st].at) / (next.at - EC.TREE[st].at) * 100) : 100;
      view.innerHTML = '<section class="section"><div class="wrap">' +
        EC.head({ title: P.data.name ? 'Sổ của ' + esc(P.data.name) : 'Sổ của bé', sc: '--c-la-dua' }) +
        '<div class="book">' +
          '<div class="sheet stack tree-wrap">' + A.tree(st) +
            '<p class="big-stat">' + esc(EC.TREE[st].name) + ' · ' + P.data.leaves + ' lá</p>' +
            '<div class="meter"><span style="width:' + pct + '%"></span></div>' +
            (next ? '<p class="muted">Còn ' + (next.at - P.data.leaves) + ' lá nữa</p>' : '') +
            '<form class="namebox" id="namebox"><label class="sr" for="kid-name">Tên của bé</label><input id="kid-name" maxlength="30" placeholder="Tên của bé" value="' + esc(P.data.name) + '"><button class="btn btn-sm" type="submit">Lưu</button></form>' +
            '<button class="btn c-nghe" type="button" id="cert"' + (P.data.leaves >= EC.CERT_AT ? '' : ' disabled') + '>In giấy khen</button>' +
            (P.data.leaves >= EC.CERT_AT ? '' : '<p class="small muted">Đủ ' + EC.CERT_AT + ' lá để in</p>') +
            '<div id="reset-box"><button class="btn btn-ghost btn-sm" type="button" id="reset">Bắt đầu lại</button></div>' +
          '</div>' +
          '<div class="sheet"><div class="sec-head" style="margin-bottom:14px"><h2 class="h3">Huy hiệu</h2><span class="score">' + got + ' / ' + EC.STICKERS.length + '</span></div><div class="stickers">' +
            EC.STICKERS.map(function (s) { var has = P.has(s.id); return '<div class="sticker' + (has ? ' got' : '') + '" title="' + esc(s.how) + '"><div class="disc">' + A.thing(s.icon) + '</div><b>' + esc(s.name) + '</b></div>'; }).join('') +
          '</div></div>' +
        '</div></div></section>';
      $('#namebox').addEventListener('submit', function (e) { e.preventDefault(); P.data.name = $('#kid-name').value.trim().slice(0, 30); P.save(); EC.toast('Đã lưu tên'); paint(); });
      $('#cert').addEventListener('click', printCert);
      $('#reset').addEventListener('click', function () {
        $('#reset-box').innerHTML = '<p><b>Xóa hết lá và huy hiệu?</b></p><div class="row"><button class="btn btn-sm c-den" type="button" id="reset-yes">Xóa</button><button class="btn btn-sm btn-ghost" type="button" id="reset-no">Không</button></div>';
        $('#reset-yes').addEventListener('click', function () { P.reset(); P.data.name = ''; P.save(); EC.toast('Đã bắt đầu lại'); paint(); });
        $('#reset-no').addEventListener('click', paint);
      });
    }
    paint();
  }, 'Sổ của bé');

  function printCert() {
    var d = new Date(), date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
    EC.printHTML('<div class="cert"><p class="eyebrow">ECOCRAYON · Tô màu thiên nhiên – Khơi nguồn tri thức xanh</p><h1>Giấy khen</h1><p style="margin-top:8px">Chúc mừng bạn nhỏ</p>' +
      '<div class="name">' + esc(P.data.name || '............................') + '</div>' +
      '<p>đã trở thành <b>Nhà thám hiểm xanh</b>: khám phá màu từ thiên nhiên, phân loại rác và làm những việc nhỏ giúp Trái Đất.</p>' +
      A.tree(P.stage()) + '<p>' + P.data.leaves + ' lá · ' + Object.keys(P.data.stickers).length + ' huy hiệu · ngày ' + date + '</p>' +
      '<div class="sign"><div>Phụ huynh / Giáo viên<br><br><br>.....................</div><div>Bé Sáp<br><br><br>(ký bằng bút sáp)</div></div></div>');
  }

  /* ================= TRÒ CHƠI ================= */
  EC.route('tro-choi', function (view) {
    function card(href, cls, art, title, text) {
      return '<a class="gamecard ' + cls + '" href="' + href + '"><div class="gc-art">' + art + '</div><div style="min-width:0"><h3>' + title + '</h3><p>' + text + '</p></div></a>';
    }
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ title: 'Trò chơi', sc: '--c-dau-biec' }) +
      '<div class="gamecards">' +
        card('#ghep-cap', 'c-nghe', A.thing('b-cards'), 'Ghép cặp màu', 'Lật thẻ, tìm cặp cùng màu.') +
        card('#phan-loai', 'c-la-dua', A.bin(EC.BINS[0]), 'Phân loại rác', 'Đưa rác về đúng thùng.') +
        card('#do-vui', 'c-dau-biec', A.thing('b-quiz'), 'Đố vui xanh', '8 câu hỏi vui.') +
        card('#pha-mau', 'c-ca-rot', A.thing('b-bowl'), 'Bếp pha màu', 'Trộn 2 màu ra màu mới.') +
        card('#mau-bap-cai', 'c-bap-cai', A.thing('b-beaker'), 'Thí nghiệm', 'Nước tím đổi màu!') +
        card('#to-mau', 'c-den', A.thing('b-crayon'), 'Tô màu', 'Tô tranh, kể chuyện.') +
      '</div></div></section>';
  }, 'Trò chơi');

  /* ================= PHỤ HUYNH & GIÁO VIÊN ================= */
  EC.route('phu-huynh', function (view) {
    var tabs = [['dung', 'Cách dùng'], ['tuoi', 'Độ tuổi'], ['giaoan', 'Giáo án'], ['antoan', 'An toàn'], ['phieu', 'Phiếu quan sát'], ['hoidap', 'Hỏi đáp']];
    var cur = store.get('ptab', 'dung');
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ title: 'Phụ huynh & giáo viên', sc: '--c-den' }) +
      '<div class="ptabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" id="tab-' + t[0] + '" data-t="' + t[0] + '" aria-selected="' + (t[0] === cur) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="ptab-body" role="tabpanel"></div></div></section>';
    function show(t) {
      cur = t; store.set('ptab', t);
      $$('.ptabs button', view).forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-t') === t)); });
      var body = $('#ptab-body'); body.setAttribute('aria-labelledby', 'tab-' + t);
      body.innerHTML = PT[t]();
      if (t === 'phieu') obsForm(body);
    }
    $$('.ptabs button', view).forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-t')); }); });
    show(tabs.some(function (t) { return t[0] === cur; }) ? cur : 'dung');
  }, 'Phụ huynh & giáo viên');

  var PT = {
    dung: function () {
      return '<div class="stack" style="gap:22px">' +
        '<div><h2 class="h3" style="margin-bottom:12px">Trong hộp có gì</h2><div class="kit">' + EC.KIT.map(function (k) { return '<div class="item">' + A.thing(k.icon) + '<div><b>' + esc(k.name) + '</b><span>' + esc(k.text) + '</span></div></div>'; }).join('') + '</div></div>' +
        '<div class="grid" style="--min:280px">' +
          '<div class="sheet prose"><h2 class="h3">Mã QR</h2><ol><li>Mở camera, quét mã trên thẻ màu.</li><li>Trang của màu đó mở ra.</li><li>Không quét được: nhập mã chữ ở trang chủ.</li></ol></div>' +
          '<div class="sheet prose"><h2 class="h3">Một buổi 20 phút</h2><ol><li>5 phút: quét thẻ, xem phim nhỏ.</li><li>10 phút: tô sổ bằng bút sáp thật.</li><li>5 phút: chơi một trò hoặc chọn thử thách.</li></ol></div>' +
        '</div>' +
        '<div class="row"><a class="btn btn-sm" href="#to-mau">In tranh tô màu</a><a class="btn btn-sm btn-ghost" href="#ma-qr">In thẻ mã QR</a><a class="btn btn-sm btn-ghost" href="#ve-ecocrayon">Về sản phẩm</a></div></div>';
    },
    tuoi: function () {
      return '<div class="agecards">' + EC.AGES.map(function (a) {
        return '<div class="sheet"><p class="eyebrow">' + esc(a.who) + '</p><h3>' + esc(a.age) + '</h3><p class="small muted">' + esc(a.time) + '</p><ul>' + a.do.map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul><p class="note small">' + esc(a.tip) + '</p></div>';
      }).join('') + '</div><p class="note" style="margin-top:16px">Gợi ý ban đầu. Nhóm sẽ khảo sát thực tế để chọn độ tuổi trọng tâm.</p>';
    },
    giaoan: function () {
      return EC.LESSONS.map(function (L) {
        return '<article class="sheet lesson"><div class="row" style="justify-content:space-between"><h2 class="h3">' + esc(L.title) + '</h2><div class="row" style="gap:6px"><span class="chip">' + L.time + '</span><span class="chip">' + L.age + '</span></div></div>' +
          '<p><b>Mục tiêu:</b> ' + esc(L.goal) + '</p><p><b>Chuẩn bị:</b> ' + esc(L.prep) + '</p>' +
          '<div class="tablebox"><table class="flow"><thead><tr><th>Phần</th><th>Thời gian</th><th>Hoạt động</th></tr></thead><tbody>' +
          L.flow.map(function (f) { return '<tr><td><b>' + esc(f[0]) + '</b></td><td>' + esc(f[1]) + '</td><td>' + esc(f[2]) + '</td></tr>'; }).join('') + '</tbody></table></div>' +
          '<p><b>Câu hỏi gợi mở:</b></p><ul style="margin:0;padding-left:22px">' + L.ask.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ul></article>';
      }).join('');
    },
    antoan: function () {
      return '<div class="grid" style="--min:300px"><div class="sheet prose"><h2 class="h3">Khi dùng bút và làm đồ tái chế</h2><ul>' + EC.SAFETY.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="sheet prose"><h2 class="h3">Nhóm ECOCRAYON cam kết</h2><p>Sản phẩm đang ở giai đoạn mẫu thử. Trước khi bán, nguyên liệu và thành phẩm sẽ được đánh giá an toàn theo quy định.</p><p>Chưa có kết quả kiểm nghiệm thì nhóm không dùng chữ “không độc”, “an toàn tuyệt đối”, “ăn được” và không quảng cáo độ bền màu.</p></div></div>';
    },
    phieu: function () {
      var today = new Date().toISOString().slice(0, 10);
      return '<div class="grid" style="--min:320px;align-items:start">' +
        '<form class="sheet obs" id="obs" autocomplete="off"><div><h2 class="h3">Phiếu quan sát buổi dùng thử</h2><p class="small muted">Lưu trên máy này. Tải về dạng CSV, mở bằng Excel.</p></div>' +
          '<div class="fields"><label>Ngày<input type="date" id="o-ngay" value="' + today + '"></label><label>Lớp / nhóm<input type="text" id="o-noi" placeholder="VD: Lá 2"></label>' +
          '<label>Độ tuổi<select id="o-tuoi"><option>5–6 tuổi</option><option>6–8 tuổi</option><option>8–11 tuổi</option><option>Nhiều độ tuổi</option></select></label>' +
          '<label>Số trẻ<input type="number" id="o-sotre" min="1" max="60" value="1"></label>' +
          '<label>Mã QR<select id="o-qr"><option>Quét được ngay</option><option>Phải thử vài lần</option><option>Không quét được</option><option>Không dùng mã QR</option></select></label>' +
          '<label>Số phút<input type="number" id="o-phut" min="1" max="180" value="20"></label></div>' +
          '<fieldset><legend>Hoạt động đã dùng</legend><div class="checks">' + EC.OBS_ACTS.map(function (a, i) { return '<label><input type="checkbox" value="' + esc(a) + '" id="o-act-' + i + '"> ' + esc(a) + '</label>'; }).join('') + '</div></fieldset>' +
          '<fieldset><legend>Chấm điểm 1–5</legend>' + EC.OBS_SCALES.map(function (s) {
            return '<div class="scale-row"><span>' + esc(s.label) + '</span><div class="stars5" data-scale="' + s.id + '" role="radiogroup" aria-label="' + esc(s.label) + '">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" role="radio" aria-checked="false" data-v="' + n + '">' + n + '</button>'; }).join('') + '</div></div>';
          }).join('') + '</fieldset>' +
          '<label>Trẻ thích nhất<input type="text" id="o-thich"></label>' +
          '<label>Khó khăn<textarea id="o-kho" placeholder="Bút gãy, màu nhạt, trẻ lúng túng..."></textarea></label>' +
          '<label>Ghi chú<textarea id="o-note"></textarea></label>' +
          '<div class="row"><button class="btn" type="submit">Lưu phiếu</button><span class="small muted" id="o-msg" aria-live="polite"></span></div></form>' +
        '<div class="sheet stack"><div class="sec-head" style="margin:0"><h2 class="h3">Phiếu đã lưu</h2><span class="score" id="o-count"></span></div><div class="tablebox" id="o-list"></div>' +
          '<div class="row"><button class="btn btn-sm" type="button" id="o-csv">Tải CSV</button><button class="btn btn-sm btn-ghost" type="button" id="o-copy">Sao chép</button></div></div>' +
        '</div>';
    },
    hoidap: function () {
      return '<div class="sheet faq">' + EC.FAQ.map(function (f) { return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>'; }).join('') + '</div>';
    }
  };

  function obsForm(body) {
    var form = $('#obs', body), scores = {};
    $$('.stars5', form).forEach(function (g) {
      $$('button', g).forEach(function (b) {
        b.addEventListener('click', function () {
          var v = +b.getAttribute('data-v'); scores[g.getAttribute('data-scale')] = v;
          $$('button', g).forEach(function (x) { var on = +x.getAttribute('data-v') <= v; x.classList.toggle('on', on); x.setAttribute('aria-checked', String(+x.getAttribute('data-v') === v)); });
        });
      });
    });
    function list() { return store.get('obs', []); }
    function cols() { return ['Ngày', 'Lớp/nhóm', 'Độ tuổi', 'Số trẻ', 'Thời lượng', 'Mã QR', 'Hoạt động'].concat(EC.OBS_SCALES.map(function (s) { return s.label; })).concat(['Trẻ thích nhất', 'Khó khăn', 'Ghi chú']); }
    function row(o) { return [o.ngay, o.noi, o.tuoi, o.sotre, o.phut, o.qr, (o.acts || []).join('; ')].concat(EC.OBS_SCALES.map(function (s) { return o.s && o.s[s.id] ? o.s[s.id] : ''; })).concat([o.thich, o.kho, o.note]); }
    function paint() {
      var L = list(), box = $('#o-list', body);
      $('#o-count', body).textContent = L.length + ' phiếu';
      if (!L.length) { box.innerHTML = '<p class="muted small">Chưa có phiếu nào.</p>'; return; }
      box.innerHTML = '<table class="obstable"><thead><tr><th>Ngày</th><th>Nhóm</th><th>Tuổi</th><th>Trẻ</th>' + EC.OBS_SCALES.map(function (s) { return '<th title="' + esc(s.label) + '">' + esc(s.label.split(' ').slice(-2).join(' ')) + '</th>'; }).join('') + '<th></th></tr></thead><tbody>' +
        L.map(function (o, i) {
          return '<tr><td>' + esc(o.ngay) + '</td><td>' + esc(o.noi) + '</td><td>' + esc(o.tuoi) + '</td><td class="n">' + esc(o.sotre) + '</td>' + EC.OBS_SCALES.map(function (s) { return '<td class="n">' + (o.s && o.s[s.id] ? o.s[s.id] : '–') + '</td>'; }).join('') +
            '<td><button class="btn btn-sm btn-ghost" type="button" data-del="' + i + '" aria-label="Xóa phiếu ngày ' + esc(o.ngay) + '">Xóa</button></td></tr>';
        }).join('') + '</tbody></table>';
      $$('[data-del]', box).forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.getAttribute('data-sure')) { var L2 = list(); L2.splice(+b.getAttribute('data-del'), 1); store.set('obs', L2); paint(); return; }
          b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn xóa?';
        });
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var o = { ngay: $('#o-ngay').value, noi: $('#o-noi').value.trim(), tuoi: $('#o-tuoi').value, sotre: $('#o-sotre').value, phut: $('#o-phut').value, qr: $('#o-qr').value,
        acts: $$('.checks input:checked', form).map(function (x) { return x.value; }), s: Object.assign({}, scores),
        thich: $('#o-thich').value.trim(), kho: $('#o-kho').value.trim(), note: $('#o-note').value.trim() };
      if (!o.noi) { $('#o-msg').textContent = 'Cần ghi lớp hoặc nhóm.'; $('#o-noi').focus(); return; }
      var L = list(); L.unshift(o); store.set('obs', L);
      $('#o-msg').textContent = 'Đã lưu.'; form.reset(); $('#o-ngay').value = new Date().toISOString().slice(0, 10);
      scores = {}; $$('.stars5 button', form).forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
      paint();
    });
    function csv() {
      var q = function (v) { v = String(v == null ? '' : v); return /[",\n;]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
      return '﻿' + [cols()].concat(list().map(row)).map(function (r) { return r.map(q).join(','); }).join('\r\n');
    }
    $('#o-csv', body).addEventListener('click', function () {
      if (!list().length) { EC.toast('Chưa có phiếu để tải'); return; }
      EC.download('ecocrayon-phieu-quan-sat.csv', new Blob([csv()], { type: 'text/csv;charset=utf-8' }));
    });
    $('#o-copy', body).addEventListener('click', function () {
      var text = [cols()].concat(list().map(row)).map(function (r) { return r.join('\t'); }).join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { EC.toast('Đã sao chép. Dán vào Excel nhé.'); }, function () { EC.toast('Không sao chép được. Dùng nút Tải CSV.'); });
      else EC.toast('Không sao chép được. Dùng nút Tải CSV.');
    });
    paint();
  }

  /* ================= THẺ MÃ QR (cho nhóm in) ================= */
  EC.route('ma-qr', function (view) {
    var here = location.href.split('#')[0];
    var base = store.get('qrbase', '') || here;
    var isFile = location.protocol === 'file:';
    view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:20px">' +
      EC.head({ title: 'In thẻ mã QR', sc: '--c-dau-biec' }) +
      '<div class="sheet qrtools"><label for="qr-base"><b>Địa chỉ trang web của nhóm</b></label><input id="qr-base" type="url" value="' + esc(base) + '" spellcheck="false">' +
      (isFile ? '<p class="note note-safe small">Đang mở từ máy tính (file://): mã QR chỉ chạy trên máy này. Đăng trang lên mạng rồi dán địa chỉ thật vào ô trên trước khi in.</p>' : '') +
      '<div class="row"><button class="btn" type="button" id="qr-make">Tạo lại mã</button><button class="btn c-nghe" type="button" id="qr-print">In thẻ</button><button class="btn btn-ghost btn-sm" type="button" id="qr-here">Dùng địa chỉ hiện tại</button></div></div>' +
      '<div class="qrcards" id="qrcards"></div>' +
      '<div class="sheet-flat prose"><h2 class="h3">Trước khi đóng gói</h2><ul><li>Quét thử mỗi thẻ bằng 2 điện thoại (Android, iPhone).</li><li>Mã QR rộng ít nhất 2 cm, mực đậm trên nền trắng.</li><li>Dùng một địa chỉ cố định, không đổi sau khi in.</li></ul></div>' +
      '</div></section>';
    function cardsHTML(b) {
      b = b.replace(/#.*$/, '');
      var list = EC.COLORS.map(function (c) { return { cls: c.id, title: c.color, sub: c.name, art: A.ingredient(c.id), code: c.code, route: 'mau-' + c.id, text: 'Quét để gặp ' + c.name + '.' }; });
      list.push({ cls: 'la-dua', title: 'Tái chế', sub: 'Phân loại rác', art: A.thing('b-recycle'), code: 'TAICHE', route: 'tai-che', text: 'Quét để học phân loại rác.' });
      list.push({ cls: 'nghe', title: 'Tô màu', sub: 'Sổ tô màu điện tử', art: A.thing('b-crayon'), code: 'TOMAU', route: 'to-mau', text: 'Quét để tô tranh.' });
      return list.map(function (x) {
        var url = b + '#' + x.route, svgQR = '';
        try { var q = window.qrcode(0, 'M'); q.addData(url); q.make(); svgQR = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); } catch (e) { svgQR = '<p class="small">Không tạo được mã</p>'; }
        return '<div class="qrcard" style="--cc:var(--c-' + x.cls + ');--cc-on:var(--on-' + x.cls + ')"><div class="qtop">' + x.art + '<div><b>' + esc(x.title) + '</b><span>' + esc(x.sub) + '</span></div></div>' +
          '<div class="qbody"><div class="stack" style="gap:6px"><p>' + esc(x.text) + '</p><p>Hoặc nhập mã:</p><span class="qcode">' + x.code + '</span></div><div class="qimg">' + svgQR + '</div></div>' +
          '<p class="qurl">' + esc(url) + '</p></div>';
      }).join('');
    }
    function make() { var b = $('#qr-base').value.trim() || here; store.set('qrbase', b === here ? '' : b); $('#qrcards').innerHTML = cardsHTML(b); }
    $('#qr-make').addEventListener('click', make);
    $('#qr-here').addEventListener('click', function () { $('#qr-base').value = here; make(); });
    $('#qr-print').addEventListener('click', function () { make(); EC.printHTML('<div class="qrcards">' + $('#qrcards').innerHTML + '</div>'); });
    make();
  }, 'In thẻ mã QR');

  /* ================= VỀ ECOCRAYON ================= */
  EC.route('ve-ecocrayon', function (view) {
    view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:34px">' +
      EC.head({ title: 'Về ECOCRAYON', lead: 'Bút sáp lấy màu từ rau củ, hộp làm từ giấy tái chế, kèm sổ tô màu và mã QR dẫn tới trang học.', sc: '--c-nghe' }) +
      '<div><h2 class="h3" style="margin-bottom:12px">Trong hộp có gì</h2><div class="kit">' + EC.KIT.map(function (k) { return '<div class="item">' + A.thing(k.icon) + '<div><b>' + esc(k.name) + '</b><span>' + esc(k.text) + '</span></div></div>'; }).join('') + '</div></div>' +
      '<div><h2 class="h3" style="margin-bottom:12px">Điểm khác biệt</h2><div class="values">' + EC.VALUES.map(function (v) { return '<div class="v c-' + v.c + '"><b>' + esc(v.k) + '</b><p>' + esc(v.t) + '</p></div>'; }).join('') + '</div></div>' +
      '<div><h2 class="h3" style="margin-bottom:12px">Vật liệu tái chế</h2><div class="tablebox"><table class="mattable"><thead><tr><th>Vật liệu</th><th>Cách tận dụng</th><th>Vai trò</th></tr></thead><tbody>' +
        EC.MATERIALS.map(function (m) { return '<tr><td><b>' + esc(m.m) + '</b></td><td>' + esc(m.use) + '</td><td>' + esc(m.role) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div><h2 class="h3" style="margin-bottom:16px">Lộ trình công nghệ</h2><div class="roadmap">' + EC.ROADMAP.map(function (r) { return '<div class="st ' + r.state + '"><span class="eyebrow">' + esc(r.stage) + (r.state === 'now' ? ' · đang làm' : '') + '</span><b>' + esc(r.name) + '</b><p>' + esc(r.what) + '</p></div>'; }).join('') + '</div></div>' +
      '<div><h2 class="h3" style="margin-bottom:12px">Kế hoạch làm mẫu thử</h2><ol class="plan">' + EC.PLAN.map(function (s) { return '<li><b>' + esc(s.t) + '</b>' + esc(s.d) + '</li>'; }).join('') + '</ol></div>' +
      '<div><h2 class="h3" style="margin-bottom:12px">Rủi ro và cách xử lý</h2><div class="tablebox"><table class="mattable"><thead><tr><th>Vấn đề</th><th>Cách xử lý</th></tr></thead><tbody>' +
        EC.RISKS.map(function (r) { return '<tr><td><b>' + esc(r.r) + '</b></td><td>' + esc(r.a) + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="sheet"><h2 class="h3" style="margin-bottom:8px">Bộ theo chủ đề sắp tới</h2><p>Khu vườn rau củ · Động vật quanh em · Đại dương xanh · Bộ cho lớp học. Ba chủ đề đầu đã có tranh mẫu.</p>' +
        '<div class="row" style="margin-top:12px"><a class="btn btn-sm" href="#to-mau">Xem tranh mẫu</a><a class="btn btn-sm btn-ghost" href="#ma-qr">In thẻ mã QR</a></div></div>' +
      '</div></section>';
  }, 'Về ECOCRAYON');

  /* ================= KHỞI ĐỘNG ================= */
  EC.start = function () {
    $('#brand-mark').innerHTML = A.logo();
    var ico = { mau: A.ingredient('den'), choi: A.thing('b-cards'), to: A.thing('b-crayon'), thuthach: A.thing('b-leaf'), so: A.thing('b-story') };
    $$('.tb-ico').forEach(function (s) { s.innerHTML = ico[s.getAttribute('data-ico')] || ''; });
    $('#leaf-count').textContent = P.data.leaves;
    bindCodeForm($('#foot-code'));

    var sb = $('#btn-sound');
    sb.setAttribute('aria-pressed', String(S.on));
    sb.addEventListener('click', function () { S.on = !S.on; store.set('sound', S.on); sb.setAttribute('aria-pressed', String(S.on)); EC.toast(S.on ? 'Đã bật âm thanh' : 'Đã tắt âm thanh'); S.play('pop'); });
    V.init();
    $('#btn-voice').addEventListener('click', function () {
      if (!V.ok) { EC.toast('Máy này chưa có giọng đọc tiếng Việt.'); return; }
      V.auto = !V.auto; store.set('voice', V.auto); V.ui();
      if (V.auto) V.say('Đã bật đọc to.'); else { V.stop(); EC.toast('Đã tắt đọc to'); }
    });
    document.addEventListener('click', function (e) { var b = e.target.closest('.say'); if (b) { e.preventDefault(); V.say(b.getAttribute('data-say'), b); } });

    var drawer = $('#drawer'), mb = $('#btn-menu');
    mb.addEventListener('click', function () { var open = drawer.hidden; drawer.hidden = !open; mb.setAttribute('aria-expanded', String(open)); if (open) $('a', drawer).focus(); });
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });

    window.addEventListener('hashchange', render);
    render();
  };
})();
