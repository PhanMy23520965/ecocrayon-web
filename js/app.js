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

  /* ---------- Âm thanh: tiếng hiệu ứng + nhạc nền, chung một nút loa ---------- */
  var S = EC.sfx = {
    on: store.get('sound', true), ctx: null,
    audio: function () {
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended' && !document.hidden) this.ctx.resume();
        return this.ctx;
      } catch (e) { return null; }
    },
    tone: function (f, d, type, t, vol) {
      var o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = type; o.frequency.value = f; g.gain.setValueAtTime(vol || 0.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + d);
      o.connect(g); g.connect(this.ctx.destination); o.start(t); o.stop(t + d + 0.03);
    },
    play: function (kind) {
      if (!this.on || !this.audio()) return;
      try {
        var t = this.ctx.currentTime, self = this;
        if (kind === 'good') { this.tone(660, 0.12, 'triangle', t); this.tone(880, 0.18, 'triangle', t + 0.1); }
        else if (kind === 'bad') { this.tone(200, 0.2, 'sawtooth', t, 0.04); }
        else if (kind === 'win') { [523, 659, 784, 1046].forEach(function (f, i) { self.tone(f, 0.2, 'triangle', t + i * 0.11); }); }
        else if (kind === 'flip') { this.tone(420, 0.05, 'square', t, 0.025); }
        else { this.tone(560, 0.07, 'sine', t, 0.08); }
      } catch (e) { /* không có âm thanh cũng không sao */ }
    }
  };

  /* Nhạc nền: giai điệu hộp nhạc tự tạo bằng code (không cần file nhạc), 8 nhịp lặp lại.
     Hợp âm C – Am – F – G – C – Am – F/G – C, nốt lấy từ âm giai ngũ cung để nghe vui, nhẹ. */
  var M = EC.music = (function () {
    var STEP = 0.3, LEVEL = 0.35, _ = 0;
    var MEL = [
      76,_,79,_,76,74,72,_,   69,_,72,_,76,_,74,_,   72,_,69,_,72,74,76,_,   74,_,_,_,71,_,67,_,
      76,_,79,_,76,74,72,74,  76,_,72,_,69,_,72,_,   69,_,72,_,71,_,74,_,    72,_,_,_,_,_,_,_
    ];
    var BASS = [[48, 55], [45, 52], [41, 48], [43, 50], [48, 55], [45, 52], [41, 43], [48, 48]];
    var hz = function (m) { return 440 * Math.pow(2, (m - 69) / 12); };
    var m = { playing: false, bus: null, step: 0, next: 0, timer: null, ducked: false };

    function note(ctx, midi, t, len, vol, type) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = hz(midi);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g); g.connect(m.bus); o.start(t); o.stop(t + len + 0.05);
    }
    function schedule(ctx, i, t) {
      var mel = MEL[i];
      if (mel) {
        var n = 1; while (n < 6 && i + n < MEL.length && !MEL[i + n]) n++;
        note(ctx, mel, t, Math.min(n * STEP + 0.25, 1.6), 0.12, 'sine');
        note(ctx, mel + 12, t, 0.35, 0.025, 'triangle');
      }
      if (i % 4 === 0) note(ctx, BASS[i >> 3][(i % 8) >> 2], t, 4 * STEP, 0.1, 'triangle');
    }
    function tick() {
      var ctx = S.ctx; if (!ctx) return;
      if (m.next < ctx.currentTime) m.next = ctx.currentTime + 0.05;
      while (m.next < ctx.currentTime + 0.4) { schedule(ctx, m.step, m.next); m.next += STEP; m.step = (m.step + 1) % MEL.length; }
    }
    function level() { return m.ducked ? LEVEL * 0.25 : LEVEL; }

    m.start = function () {
      if (m.playing || !S.on) return;
      var ctx = S.audio(); if (!ctx) return;
      if (!m.bus) {
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
        m.bus = ctx.createGain(); m.bus.gain.value = 0.0001;
        m.bus.connect(lp); lp.connect(ctx.destination);
      }
      m.bus.gain.cancelScheduledValues(ctx.currentTime);
      m.bus.gain.setTargetAtTime(level(), ctx.currentTime, 0.6);
      m.step = 0; m.next = ctx.currentTime + 0.1; m.playing = true;
      tick(); m.timer = setInterval(tick, 100);
    };
    m.stop = function () {
      if (!m.playing) return;
      m.playing = false; clearInterval(m.timer);
      if (m.bus && S.ctx) { m.bus.gain.cancelScheduledValues(S.ctx.currentTime); m.bus.gain.setTargetAtTime(0.0001, S.ctx.currentTime, 0.12); }
    };
    m.duck = function (on) {
      m.ducked = on;
      if (m.playing && m.bus) m.bus.gain.setTargetAtTime(level(), S.ctx.currentTime, 0.15);
    };
    return m;
  })();

  /* ---------- Đọc to tiếng Việt (giọng có sẵn trên máy): nút loa nhỏ cạnh lời Bé Sáp ---------- */
  var V = EC.voice = {
    ok: false, v: null, auto: false, tok: 0,
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
    },
    say: function (text, btn) {
      if (!this.ok || !text) return;
      try {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text), tok = ++this.tok, self = this;
        u.voice = this.v; u.lang = this.v.lang; u.rate = 0.92; u.pitch = 1.05;
        $$('.say.speaking').forEach(function (b) { b.classList.remove('speaking'); });
        if (btn) btn.classList.add('speaking');
        u.onend = u.onerror = function () {
          if (btn) btn.classList.remove('speaking');
          if (tok === self.tok) M.duck(false);
        };
        M.duck(true);
        window.speechSynthesis.speak(u);
      } catch (e) { M.duck(false); }
    },
    autoSay: function (text) { if (this.auto) this.say(text); },
    stop: function () { this.tok++; M.duck(false); try { window.speechSynthesis.cancel(); } catch (e) { /* bỏ qua */ } }
  };
  EC.sayBtn = function (text) { return '<button class="say" type="button" data-say="' + esc(text) + '" aria-label="Nghe đọc"></button>'; };

  /* ---------- Nhân vật nói (Bé Sáp hoặc nhân vật dẫn đường của vùng đất) ---------- */
  function charArt(ch, mood) { return A.character ? A.character(ch || 'besap', mood || 'happy') : A.mascot(mood || 'happy'); }
  EC.mascotLine = function (text, mood, id, ch) {
    return '<div class="mascot-row"' + (id ? ' id="' + id + '"' : '') + (ch ? ' data-char="' + ch + '"' : '') + '>' + charArt(ch, mood) +
      '<div class="bubble"><p>' + esc(text) + '</p>' + EC.sayBtn(text) + '</div></div>';
  };
  EC.setBubble = function (row, text, mood) {
    if (!row) return;
    var old = $('.mascot', row);
    var tmp = document.createElement('div'); tmp.innerHTML = charArt(row.getAttribute('data-char'), mood);
    old.replaceWith(tmp.firstChild);
    $('.bubble p', row).textContent = text;
    $('.bubble .say', row).setAttribute('data-say', text);
    $('.mascot', row).classList.add('bounce');
    V.autoSay(text);
  };

  /* ---------- Tiến trình của người chơi đang dùng (khách hoặc hồ sơ đã đăng nhập) ----------
     Dữ liệu thật nằm trong EC.db (bảng PlayerProgress); P.data luôn trỏ tới người chơi hiện tại. */
  var P = EC.progress = {
    get data() { return EC.db.progress(EC.auth.pid()); },
    save: function () { EC.db.save('progress'); document.dispatchEvent(new CustomEvent('ec:progress')); },
    stage: function () { var s = 0, n = this.data.xp; EC.TREE.forEach(function (t, i) { if (n >= t.xp) s = i; }); return s; },
    isDone: function (id) { return !!this.data.done[id]; },
    has: function (id) { return !!this.data.stickers[id]; },
    mark: function (id) { if (this.data.done[id]) return false; this.data.done[id] = Date.now(); this.save(); return true; },
    add: function (n, why) {
      var before = this.stage(); this.data.xp += n; this.save();
      EC.pulsePill();
      EC.toast('+' + n + ' XP · ' + why);
      var after = this.stage(); if (after > before) queueAward({ tree: after });
      if (EC.checkUnlocks) EC.checkUnlocks();
    },
    award: function (id) {
      if (this.data.stickers[id]) return false;
      this.data.stickers[id] = Date.now(); this.save(); queueAward({ sticker: id }); checkMeta(); return true;
    },
    reset: function () { var all = EC.db.progressAll(); all[EC.auth.pid()] = EC.db.newProgress(); this.save(); }
  };
  EC.pulsePill = function () { var pill = $('#userpill'); if (!pill) return; pill.classList.remove('pulse'); void pill.offsetWidth; pill.classList.add('pulse'); };
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
  /* Thưởng một lần cho một việc (các hoạt động cũ: trang màu, thử thách xanh, tô màu...).
     Mỗi "lá" của bản trước được đổi thành 5 XP. */
  EC.LEAF_XP = 5;
  EC.reward = function (opt) {
    var first = opt.once ? P.mark(opt.once) : true;
    var n = (first ? opt.leaves : (opt.repeatLeaves || 0)) * EC.LEAF_XP;
    if (n > 0) P.add(n, opt.why);
    if (opt.sticker) P.award(opt.sticker);
    return first;
  };

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

  /* Hàng đợi chúc mừng: nhãn dán, cây lớn, huy hiệu vùng đất, lên cấp, vật phẩm mới, danh hiệu cuối cùng */
  var awardQ = [], showing = false;
  function queueAward(x) { awardQ.push(x); if (!showing) setTimeout(nextAward, 350); showing = true; }
  EC.queueAward = queueAward;
  function okBtn(label, href) {
    return '<div class="row">' + (href ? '<a class="btn btn-ghost" href="' + href + '" data-close>Xem hộ chiếu</a>' : '') + '<button class="btn" type="button" data-close>' + label + '</button></div>';
  }
  function nextAward() {
    var x = awardQ.shift(); if (!x) { showing = false; return; }
    showing = true; S.play('win'); EC.confetti();
    var html = '', say = '';
    if (x.sticker) {
      var s = EC.STICKERS.filter(function (k) { return k.id === x.sticker; })[0];
      html = '<div class="disc">' + A.thing(s.icon) + '</div><h2 id="modal-title">Nhãn dán mới!</h2><p class="award-name">' + esc(s.name) + '</p>' + okBtn('Tuyệt quá!');
      say = 'Bé nhận được nhãn dán ' + s.name;
    } else if (x.tree != null) {
      var t = EC.TREE[x.tree];
      html = '<div style="max-width:220px;margin:0 auto">' + A.tree(x.tree) + '</div><h2 id="modal-title">Cây lớn rồi!</h2><p class="award-name">' + esc(t.name) + '</p>' + okBtn('Chơi tiếp');
      say = 'Cây của bé đã thành ' + t.name;
    } else if (x.badge) {
      var z = EC.zoneById(x.badge);
      if (!z) { nextAward(); return; }
      html = '<div class="award-medal">' + A.medal(z.badge.icon, 'var(--t-' + z.color + ')', true) + '</div><h2 id="modal-title">Huy hiệu mới!</h2><p class="award-name">' + esc(z.badge.name) + '</p>' +
        '<p class="small muted">Bé đã hoàn thành ' + esc(z.name) + '.</p>' + okBtn('Tuyệt quá!', '#ho-chieu');
      say = 'Chúc mừng! Bé nhận huy hiệu ' + z.badge.name;
    } else if (x.level != null) {
      var L = EC.content().levels[x.level] || { name: '' };
      html = '<div class="award-level"><span class="lv-num">' + (x.level + 1) + '</span></div><h2 id="modal-title">Lên cấp ' + (x.level + 1) + '!</h2><p class="award-name">' + esc(L.name) + '</p>' + okBtn('Hoan hô!');
      say = 'Bé đã lên cấp ' + (x.level + 1) + ': ' + L.name;
    } else if (x.items) {
      var C = EC.content().rewards;
      var list = x.items.map(function (id) { return C.filter(function (r) { return r.id === id; })[0]; }).filter(Boolean);
      html = '<h2 id="modal-title">Mở khóa vật phẩm!</h2><div class="award-items">' + list.map(function (r) { return '<div>' + EC.rewardArt(r) + '<b>' + esc(r.name) + '</b></div>'; }).join('') + '</div>' +
        '<p class="small muted">Xem trong Bộ sưu tập nhé.</p><div class="row"><a class="btn btn-ghost" href="#bo-suu-tap" data-close>Bộ sưu tập</a><button class="btn" type="button" data-close>Tuyệt quá!</button></div>';
      say = 'Bé mở khóa ' + list.length + ' vật phẩm mới';
    } else if (x.title) {
      html = '<div class="award-medal">' + A.medal('i-passport', '#FFFDF7', true) + '</div><p class="eyebrow">Danh hiệu cuối cùng</p><h2 id="modal-title">NHÀ KHÁM PHÁ ECOCRAYON</h2>' +
        '<p>Bé đã hoàn thành cả 4 vùng đất!</p><div class="row"><a class="btn c-nghe" href="#ho-chieu" data-close>Xem chứng nhận</a></div>';
      say = 'Chúc mừng Nhà khám phá ECOCRAYON!';
    }
    if (say) V.autoSay(say);
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
  /* Trang thường: EC.route('ten-trang', fn, tieuDe).
     Trang có tham số: EC.route('vung/', fn, tieuDe) → địa chỉ #vung/sac-mau gọi fn(view, ten, 'sac-mau'). */
  var ROUTES = {}, leaveFns = [];
  EC.route = function (name, fn, title) { ROUTES[name] = { fn: fn, title: title }; };
  EC.onLeave = function (fn) { leaveFns.push(fn); };
  var NAVGROUP = function (r) {
    var head = r.split('/')[0];
    if (r === 'trang-chu') return 'home';
    if (r === 've-ecocrayon') return 'gioithieu';
    if (['kham-pha', 'vung', 'bai-hoc', 'choi', 'tro-choi', 'ghep-cap', 'phan-loai', 'do-vui', 'pha-mau', 'to-mau', 'thu-thach', 'tai-che', 'vuon-mau'].indexOf(head) >= 0 || r.indexOf('mau-') === 0) return 'khampha';
    if (r === 'huong-dan' || r === 'phu-huynh') return 'huongdan';
    if (['ho-chieu', 'so-cua-be', 'bo-suu-tap'].indexOf(r) >= 0) return 'hochieu';
    if (['dang-nhap', 'dang-ky', 'ho-so'].indexOf(r) >= 0) return 'taikhoan';
    return '';
  };
  var TABGROUP = function (r) {
    var g = NAVGROUP(r), head = r.split('/')[0];
    if (['choi', 'tro-choi', 'ghep-cap', 'phan-loai', 'do-vui', 'pha-mau', 'to-mau'].indexOf(head) >= 0) return 'choi';
    return g;
  };
  function resolve(name) {
    if (ROUTES[name]) return { r: ROUTES[name], arg: null };
    var k = name.indexOf('/');
    if (k > 0 && ROUTES[name.slice(0, k + 1)]) return { r: ROUTES[name.slice(0, k + 1)], arg: name.slice(k + 1) };
    return null;
  }
  function render() {
    var name = '';
    try { name = decodeURIComponent(location.hash.slice(1)); } catch (e) { name = location.hash.slice(1); }
    var hit = resolve(name);
    if (!hit) {
      var code = EC.normCode(name);
      if (EC.CODES[code]) { location.replace('#' + EC.CODES[code]); return; }
      name = 'trang-chu'; hit = resolve(name);
    }
    var r = hit.r;
    leaveFns.splice(0).forEach(function (f) { try { f(); } catch (e) { /* bỏ qua */ } });
    $$('.drag-ghost').forEach(function (g) { g.remove(); });
    V.stop(); EC.closeModal();
    var view = $('#view'); view.innerHTML = '';
    view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter');
    r.fn(view, name, hit.arg);
    var t = typeof r.title === 'function' ? r.title(name, hit.arg) : r.title;
    document.title = t ? t + ' · ECOCRAYON' : 'ECOCRAYON – Thế giới khám phá sắc màu thiên nhiên';
    window.scrollTo(0, 0);
    var grp = NAVGROUP(name), tgrp = TABGROUP(name);
    $$('.mainnav [data-nav]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === grp); });
    $$('.tabbar [data-nav]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === tgrp); });
    $$('.drawer-panel a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + name); });
    closeDrawer();
    try { view.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ }
  }
  EC.rerender = render;
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
  /* Mã QR (SVG) cho một địa chỉ; dùng chung cho trang chủ, trang giới thiệu và trang in thẻ */
  EC.siteBase = function () { return location.href.split('#')[0].split('?')[0]; };
  EC.qrSVG = function (url) {
    try { var q = window.qrcode(0, 'M'); q.addData(url); q.make(); return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }
    catch (e) { return '<p class="small">Không tạo được mã</p>'; }
  };
  EC.worldQR = function () {
    var url = EC.siteBase() + '?qr=KHAMPHA#kham-pha';
    return '<div class="qr-box" title="' + esc(url) + '">' + EC.qrSVG(url) + '</div>' +
      (location.protocol === 'file:' ? '<p class="note note-safe small">Trang đang mở từ máy tính nên mã này chỉ chạy trên máy này. Đăng trang lên mạng để có mã dùng thật.</p>' : '');
  };
  EC.productBlock = function () {
    var PR = EC.PRODUCT;
    return '<div class="product sheet">' +
        '<div class="product-art">' + A.heroBox() + '</div>' +
        '<div class="stack product-copy"><p class="eyebrow">Sản phẩm</p><h2 class="h2">' + esc(PR.name) + '</h2><p class="lead">' + esc(PR.intro) + '</p>' +
          '<h3 class="h3">Thành phần và nguyên liệu</h3>' +
          '<div class="ingr">' + EC.COLORS.map(function (c) {
            return '<a class="ingr-item ' + colorClass(c.id) + '" href="#mau-' + c.id + '">' + A.ingredient(c.id) + '<span><b>' + esc(c.name) + '</b><small>' + esc(c.color) + ' · ' + esc(c.pigment) + '</small></span></a>';
          }).join('') + '</div>' +
          '<p class="small muted">' + esc(PR.base) + '</p>' +
        '</div></div>' +
      '<div class="grid product-more" style="--min:240px">' +
        '<div class="sheet"><h3 class="h3">Đặc điểm sản phẩm</h3><ul class="ticks">' + PR.features.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="sheet"><h3 class="h3">Thân thiện với môi trường</h3><ul class="ticks">' + PR.eco.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="sheet"><h3 class="h3">Hướng dẫn sử dụng</h3><ol class="steps">' + PR.usage.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol></div>' +
        '<div class="sheet qr-world"><h3 class="h3">Quét mã vào thế giới khám phá</h3>' + EC.worldQR() +
          '<form class="codebox" data-code autocomplete="off"><label>Hoặc nhập mã trên thẻ</label><div class="codebox-row"><input placeholder="VD: KHAMPHA" maxlength="12" spellcheck="false" aria-label="Mã trên thẻ"><button class="btn btn-sm" type="submit">Mở</button></div><p class="codebox-msg" aria-live="polite"></p></form>' +
        '</div>' +
      '</div>';
  };
  var EDU = [
    ['leaf', 'Khám phá thiên nhiên', 'Màu sắc đến từ rau củ, hoa lá; cây lớn lên thế nào.', 'la-dua'],
    ['b-bowl', 'Nhận biết và sáng tạo màu sắc', 'Màu cơ bản, màu nóng – lạnh, pha màu và vẽ tranh.', 'bap-cai'],
    ['b-recycle', 'Hiểu về tái chế', 'Phân loại rác, dùng lại đồ cũ, giảm rác thải.', 'ca-rot'],
    ['earth', 'Ý thức bảo vệ môi trường', 'Tiết kiệm nước, điện, giữ biển sạch và trồng cây.', 'dau-biec']
  ];
  function journeyStrip() {
    var prof = EC.auth.profile(), T = EC.totals(), lv = EC.levelOf(P.data.xp);
    if (!EC.auth.isGuest()) {
      return '<div class="journey sheet">' + EC.avatarHTML(prof, 64) +
        '<div class="stack journey-txt"><b class="h3">Chào ' + esc(prof.displayName) + '!</b><span class="muted">Cấp ' + (lv.idx + 1) + ' · ' + esc(lv.name) + ' · ' + T.stars + ' sao · ' + T.badges + '/' + T.zones + ' huy hiệu</span></div>' +
        '<div class="row"><a class="btn" href="#kham-pha">Tiếp tục hành trình</a><a class="btn btn-ghost" href="#ho-chieu">Hộ chiếu</a></div></div>';
    }
    return '<div class="journey sheet">' + EC.avatarHTML(prof, 64) +
      '<div class="stack journey-txt"><b class="h3">Bé đã có hồ sơ chưa?</b><span class="muted">Tạo hồ sơ để lưu sao, huy hiệu và hộ chiếu khám phá. Bé cũng có thể chơi thử ngay.' + (T.stars ? ' Bé đang có ' + T.stars + ' sao.' : '') + '</span></div>' +
      '<div class="row"><a class="btn" href="#dang-ky">Tạo hồ sơ</a><a class="btn btn-ghost" href="#dang-nhap">Đăng nhập</a></div></div>';
  }
  EC.route('trang-chu', function (view) {
    var cast = ['mam', 'eco', 'besap', 'robo', 'earth'].map(function (c, i) { return '<span class="cast-' + i + '">' + A.character(c, i === 2 ? 'wow' : 'happy') + '</span>'; }).join('');
    view.innerHTML =
      '<section class="hero hero-world"><div class="wrap hero-grid">' +
        '<div class="hero-copy">' +
          '<p class="eyebrow">Bộ màu sáp thiên nhiên · Học mà chơi</p>' +
          '<h1 class="h1"><span>Chào mừng đến với</span><span class="w2">thế giới ECOCRAYON!</span></h1>' +
          '<p class="lead">Cùng khám phá những vùng đất kỳ diệu, tìm hiểu sắc màu thiên nhiên và trở thành nhà khám phá nhí!</p>' +
          '<div class="row"><a class="btn btn-big" href="#kham-pha">Bắt đầu khám phá</a><a class="btn btn-big btn-ghost" href="#ve-ecocrayon">Tìm hiểu ECOCRAYON</a></div>' +
        '</div>' +
        '<div class="hero-art"><div class="cast" aria-hidden="true">' + cast + '</div></div>' +
      '</div></section>' +
      '<section class="section-tight"><div class="wrap">' + journeyStrip() + '</div></section>' +
      '<section class="section-tight"><div class="wrap">' +
        EC.head({ title: '4 vùng đất khám phá', lead: 'Vùng nào cũng mở sẵn. Bé thích chủ đề nào thì chọn vùng đó!', sc: '--c-den', side: '<a class="btn btn-sm btn-ghost" href="#kham-pha">Xem bản đồ</a>' }) +
        '<div class="zonecards">' + EC.zones().map(EC.zoneCard).join('') + '</div>' +
      '</div></section>' +
      '<section class="section"><div class="wrap stack" style="gap:20px">' + EC.productBlock() + '</div></section>' +
      '<section class="section-tight"><div class="wrap">' +
        EC.head({ title: 'Bé học được gì?', sc: '--c-la-dua' }) +
        '<div class="edu">' + EDU.map(function (e) { return '<div class="edu-card c-' + e[3] + '">' + A.thing(e[0]) + '<h3>' + e[1] + '</h3><p>' + e[2] + '</p></div>'; }).join('') + '</div>' +
      '</div></section>' +
      '<section class="section-tight"><div class="wrap"><nav class="grownups" aria-label="Dành cho người lớn"><span>Dành cho người lớn:</span>' +
        '<a href="#huong-dan">Hướng dẫn</a><a href="#phu-huynh">Phụ huynh &amp; giáo viên</a><a href="#ve-ecocrayon">Về ECOCRAYON</a><a href="#tai-che">Góc tái chế</a>' +
      '</nav></div></section>';
    $$('form[data-code]', view).forEach(bindCodeForm);
    $$('.hero-crayon', view).forEach(function (a) { a.addEventListener('mouseenter', function () { S.play('pop'); }); });
  }, '');

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
      return '<div class="mission' + (d ? ' done' : '') + '"><span class="chip leafchip">+' + m.leaves * EC.LEAF_XP + ' XP</span><h3>' + esc(m.title) + '</h3><p>' + esc(m.how) + '</p>' +
        (d ? '<span class="stamp">Đã xong ✓</span>' : '<button class="btn btn-sm c-la-dua" type="button" data-m="' + m.id + '">Xong rồi!</button>') + '</div>';
    }
    function diyCard(x) {
      var d = P.isDone(x.id);
      return '<details class="diy' + (d ? ' done' : '') + '"><summary>' + A.thing(DIY_ICON[x.id]) +
        '<h3>' + esc(x.title) + '</h3><span class="chip">' + (d ? 'Đã làm ✓' : '+' + x.leaves * EC.LEAF_XP + ' XP') + '</span></summary>' +
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

  /* ================= SỔ CỦA BÉ → nay là Hộ chiếu khám phá ================= */
  EC.route('so-cua-be', function () { location.replace('#ho-chieu'); }, 'Hộ chiếu');

  /* ================= TRÒ CHƠI (tổng hợp) ================= */
  EC.route('tro-choi', function (view) {
    function card(href, cls, art, title, text, extra) {
      return '<a class="gamecard ' + cls + '" href="' + href + '"><div class="gc-art">' + art + '</div><div style="min-width:0"><h3>' + title + '</h3><p>' + text + '</p>' + (extra || '') + '</div></a>';
    }
    var prog = P.data;
    var zones = EC.zones().map(function (z) {
      var list = EC.gamesOf(z).concat(z.challenge ? [z.challenge] : []);
      return '<div class="stack" style="gap:12px"><h2 class="h3 zone-title c-' + z.color + '"><span class="dot"></span>' + esc(z.name) + '</h2><div class="gamecards">' +
        list.map(function (g) { var r = prog.games[g.id]; return card('#choi/' + g.id, 'c-' + z.color, EC.pic(g.icon || (g === z.challenge ? z.badge.icon : 'b-quiz')), esc(g.title), esc(g.desc), EC.starsHTML(r ? r.stars : 0)); }).join('') +
        '</div></div>';
    }).join('');
    view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:28px">' +
      EC.head({ title: 'Trò chơi', lead: '12 trò chơi và 4 thử thách của 4 vùng đất. Chơi lại bao nhiêu lần cũng được để đạt 3 sao!', sc: '--c-dau-biec', side: '<a class="btn btn-sm btn-ghost" href="#kham-pha">Bản đồ</a>' }) +
      zones +
      '<div class="stack" style="gap:12px"><h2 class="h3">Trò chơi thêm</h2><div class="gamecards">' +
        card('#ghep-cap', 'c-nghe', A.thing('b-cards'), 'Ghép cặp màu', 'Lật thẻ, tìm cặp cùng màu.') +
        card('#phan-loai', 'c-la-dua', A.bin(EC.BINS[0]), 'Phân loại rác', 'Đưa rác về đúng thùng.') +
        card('#do-vui', 'c-dau-biec', A.thing('b-quiz'), 'Đố vui xanh', '8 câu hỏi vui.') +
        card('#pha-mau', 'c-ca-rot', A.thing('b-bowl'), 'Bếp pha màu', 'Trộn 2 màu sáp ra màu mới.') +
        card('#mau-bap-cai', 'c-bap-cai', A.thing('b-beaker'), 'Thí nghiệm', 'Nước tím đổi màu!') +
        card('#to-mau', 'c-den', A.thing('b-crayon'), 'Tô màu tự do', 'Tô tranh, kể chuyện.') +
      '</div></div></div></section>';
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
    var here = EC.siteBase();
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
      b = b.replace(/#.*$/, '').replace(/\?.*$/, '');
      var list = [{ cls: 'dau-biec', title: 'Thế giới khám phá', sub: '4 vùng đất, 12 trò chơi', art: A.thing('i-map'), code: 'KHAMPHA', route: 'kham-pha', text: 'Quét để vào bản đồ 4 vùng đất.' }];
      EC.zones().forEach(function (z) { var code = EC.zoneCode(z.id); if (code) list.push({ cls: z.color, title: z.name, sub: z.charName, art: A.character(z.char, 'happy', '', true), code: code, route: 'vung/' + z.id, text: 'Quét để vào ' + z.name + '.' }); });
      list = list.concat(EC.COLORS.map(function (c) { return { cls: c.id, title: c.color, sub: c.name, art: A.ingredient(c.id), code: c.code, route: 'mau-' + c.id, text: 'Quét để gặp ' + c.name + '.' }; }));
      list.push({ cls: 'la-dua', title: 'Tái chế', sub: 'Phân loại rác', art: A.thing('b-recycle'), code: 'TAICHE', route: 'tai-che', text: 'Quét để học phân loại rác.' });
      list.push({ cls: 'nghe', title: 'Tô màu', sub: 'Sổ tô màu điện tử', art: A.thing('b-crayon'), code: 'TOMAU', route: 'to-mau', text: 'Quét để tô tranh.' });
      return list.map(function (x) {
        var url = b + '?qr=' + x.code + '#' + x.route, svgQR = EC.qrSVG(url);
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
      EC.head({ title: 'Giới thiệu ECOCRAYON', lead: 'Bút sáp lấy màu từ rau củ, hộp làm từ giấy tái chế, kèm sổ tô màu và mã QR dẫn vào thế giới khám phá.', sc: '--c-nghe', side: '<a class="btn btn-sm" href="#kham-pha">Vào thế giới khám phá</a>' }) +
      '<div class="stack" style="gap:20px">' + EC.productBlock() + '</div>' +
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
    $$('form[data-code]', view).forEach(bindCodeForm);
  }, 'Giới thiệu ECOCRAYON');

  /* ================= KHỞI ĐỘNG ================= */
  /* Thanh trên, ngăn kéo menu, chân trang: cập nhật theo người chơi và nội dung */
  function renderChrome() {
    var prof = EC.auth.profile(), guest = EC.auth.isGuest(), T = EC.totals();
    var pill = $('#userpill');
    if (guest) {
      pill.setAttribute('href', '#dang-nhap');
      pill.innerHTML = EC.avatarHTML(prof, 34) + '<span class="up-txt">Đăng nhập<small>hoặc Đăng ký</small></span>';
      pill.setAttribute('aria-label', 'Đăng nhập hoặc đăng ký');
    } else {
      pill.setAttribute('href', '#ho-so');
      pill.innerHTML = EC.avatarHTML(prof, 34) + '<span class="up-txt">' + esc(prof.displayName) + '<small>' + A.star() + T.stars + ' sao</small></span>';
      pill.setAttribute('aria-label', 'Hồ sơ của ' + prof.displayName + ', ' + T.stars + ' sao');
    }
    var da = $('#drawer-account');
    if (da) da.innerHTML = guest
      ? '<a href="#dang-nhap">Đăng nhập</a><a href="#dang-ky">Đăng ký hồ sơ mới</a>'
      : '<a href="#ho-so">Hồ sơ của ' + esc(prof.displayName) + '</a><button type="button" class="drawer-btn" data-logout>Đăng xuất</button>';
    var tb = $('#tab-account');
    if (tb) { tb.setAttribute('href', guest ? '#dang-nhap' : '#ho-so'); $('.tb-lbl', tb).textContent = 'Hồ sơ'; $('.tb-ico', tb).innerHTML = EC.avatarHTML(prof, 32); }
    var c = EC.content().settings.contact, items = [], fc = $('#foot-contact');
    if (fc) {
      items.push('<li><b>' + esc(c.org || 'ECOCRAYON') + '</b></li>');
      if (c.email) items.push('<li>Email: <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></li>');
      if (c.phone) items.push('<li>Điện thoại: <a href="tel:' + esc(String(c.phone).replace(/[^0-9+]/g, '')) + '">' + esc(c.phone) + '</a></li>');
      if (c.address) items.push('<li>' + esc(c.address) + '</li>');
      if (c.facebook && /^https?:\/\//.test(c.facebook)) items.push('<li><a href="' + esc(c.facebook) + '" target="_blank" rel="noopener">Trang mạng xã hội</a></li>');
      if (!c.email && !c.phone && !c.address) items.push('<li class="muted">Thông tin liên hệ đang được cập nhật.</li>');
      fc.innerHTML = items.join('');
    }
  }
  EC.renderChrome = renderChrome;

  EC.start = function () {
    $('#brand-mark').innerHTML = A.logo();
    var ico = { home: A.thing('i-home'), khampha: A.thing('i-map'), choi: A.thing('b-cards'), hochieu: A.thing('i-passport') };
    $$('.tb-ico[data-ico]').forEach(function (s) { s.innerHTML = ico[s.getAttribute('data-ico')] || ''; });
    var yr = $('#foot-year'); if (yr) yr.textContent = new Date().getFullYear();
    bindCodeForm($('#foot-code'));

    /* Thống kê: lượt truy cập và lượt vào bằng mã QR (?qr=MÃ) */
    EC.stats.visit();
    var qm = location.search.match(/[?&]qr=([^&#]+)/);
    if (qm) {
      try { EC.stats.qr(decodeURIComponent(qm[1])); } catch (e) { /* bỏ qua */ }
      try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* bỏ qua */ }
    }
    renderChrome();
    ['ec:progress', 'ec:auth', 'ec:content'].forEach(function (ev) { document.addEventListener(ev, renderChrome); });
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-logout]')) { EC.auth.logout(); EC.toast('Đã đăng xuất. Hẹn gặp lại!'); closeDrawer(); EC.go('trang-chu'); }
    });

    var sb = $('#btn-sound');
    var soundUi = function () {
      sb.setAttribute('aria-pressed', String(S.on));
      sb.title = S.on ? 'Tắt nhạc và âm thanh' : 'Bật nhạc và âm thanh';
    };
    soundUi();
    sb.addEventListener('click', function () {
      S.on = !S.on; store.set('sound', S.on); soundUi();
      if (S.on) { M.start(); S.play('pop'); EC.toast('Đã bật nhạc'); } else { M.stop(); EC.toast('Đã tắt nhạc'); }
    });
    /* Trình duyệt chỉ cho phát tiếng sau lần chạm đầu tiên, nên nhạc bắt đầu từ lúc đó. */
    var firstTouch = function () {
      document.removeEventListener('pointerdown', firstTouch, true);
      document.removeEventListener('keydown', firstTouch, true);
      if (S.on) M.start();
    };
    document.addEventListener('pointerdown', firstTouch, true);
    document.addEventListener('keydown', firstTouch, true);
    document.addEventListener('visibilitychange', function () {
      if (!S.ctx) return;
      if (document.hidden) S.ctx.suspend(); else if (S.on) S.ctx.resume();
    });
    V.init();
    document.addEventListener('click', function (e) { var b = e.target.closest('.say'); if (b) { e.preventDefault(); V.say(b.getAttribute('data-say'), b); } });

    var drawer = $('#drawer'), mb = $('#btn-menu');
    mb.addEventListener('click', function () { var open = drawer.hidden; drawer.hidden = !open; mb.setAttribute('aria-expanded', String(open)); if (open) $('a', drawer).focus(); });
    drawer.addEventListener('click', function (e) { if (e.target === drawer) closeDrawer(); });

    window.addEventListener('hashchange', render);
    render();
  };
})();
