/* ECOCRAYON – trò chơi: ghép cặp, phân loại rác, đố vui, bếp pha màu. */
(function () {
  'use strict';
  var $ = EC.$, $$ = EC.$$, esc = EC.esc, A = EC.art, S = EC.sfx, V = EC.voice;
  var crumbs = '<a class="back" href="#tro-choi">‹ Trò chơi</a>';
  function seg(id, opts, cur) {
    return '<div class="seg" id="' + id + '" role="group">' + opts.map(function (o) { return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (o[0] === cur) + '">' + o[1] + '</button>'; }).join('') + '</div>';
  }
  function bindSeg(el, cb) {
    $$('button', el).forEach(function (b) {
      b.addEventListener('click', function () { $$('button', el).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); cb(b.getAttribute('data-v')); });
    });
  }

  /* ================= GHÉP CẶP ================= */
  EC.route('ghep-cap', function (view) {
    var mode = EC.store.get('mem-mode', 'de');
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ crumbs: crumbs, title: 'Ghép cặp màu', sc: '--c-nghe' }) +
      '<div class="gamebar">' + seg('mem-mode', [['de', 'Dễ'], ['vua', 'Khó']], mode) + '<span class="score" id="mem-score"></span></div>' +
      EC.mascotLine('Lật 2 thẻ cùng màu nhé!', 'happy', 'mem-m') +
      '<div class="memgrid" id="memgrid" style="margin-top:18px"></div>' +
      '<div class="row" style="justify-content:center;margin-top:18px"><button class="btn btn-ghost" type="button" id="mem-again">Chơi lại</button></div>' +
      '</div></section>';
    var grid = $('#memgrid'), row = $('#mem-m'), score = $('#mem-score'), lock = false, up = [], moves = 0, matched = 0, pairs = 0, timer = null;
    function start() {
      clearTimeout(timer);
      var cols = EC.shuffle(EC.COLORS).slice(0, mode === 'de' ? 3 : 6);
      pairs = cols.length; moves = 0; matched = 0; up = []; lock = false;
      var cards = [];
      cols.forEach(function (c) {
        cards.push({ id: c.id, kind: 'sap', html: A.crayon(c.hex) + '<span>' + esc(c.color) + '</span>' });
        cards.push({ id: c.id, kind: 'ing', html: A.ingredient(c.id) + '<span>' + esc(c.name) + '</span>' });
      });
      cards = EC.shuffle(cards);
      grid.style.setProperty('--cols', pairs === 3 ? 3 : 4);
      grid.innerHTML = cards.map(function (k, i) {
        return '<button class="memcard c-' + k.id + '" type="button" data-id="' + k.id + '" aria-label="Thẻ số ' + (i + 1) + ', đang úp"><div class="memcard-in">' +
          '<div class="memface memback">' + A.logo() + '</div><div class="memface memfront">' + k.html + '</div></div></button>';
      }).join('');
      paintScore();
      $$('.memcard', grid).forEach(function (b, i) { b.addEventListener('click', function () { flip(b, cards[i]); }); });
    }
    function paintScore() { score.textContent = matched + ' / ' + pairs + ' cặp'; }
    function flip(b, card) {
      if (lock || b.classList.contains('up') || b.classList.contains('matched')) return;
      b.classList.add('up'); S.play('flip'); up.push({ b: b, card: card });
      b.setAttribute('aria-label', card.kind === 'sap' ? 'Bút sáp màu ' + EC.colorById(card.id).color : EC.colorById(card.id).name);
      if (up.length < 2) return;
      moves++; lock = true;
      var a = up[0], c = up[1];
      if (a.card.id === c.card.id && a.card.kind !== c.card.kind) {
        var col = EC.colorById(a.card.id);
        a.b.classList.add('matched'); c.b.classList.add('matched'); matched++; up = []; lock = false; S.play('good');
        if (matched === pairs) {
          var best = pairs + Math.ceil(pairs / 2);
          EC.setBubble(row, moves <= best ? 'Trí nhớ siêu đỉnh!' : 'Xong rồi! Giỏi quá!', 'wow');
          EC.reward({ leaves: pairs === 3 ? 1 : 2, why: 'Ghép cặp màu', sticker: 'ghep-cap' });
        } else {
          EC.setBubble(row, 'Đúng rồi! ' + col.name + ': màu ' + col.color.toLowerCase() + '.', 'happy');
        }
      } else {
        S.play('bad');
        timer = setTimeout(function () {
          a.b.classList.remove('up'); c.b.classList.remove('up');
          a.b.setAttribute('aria-label', 'Thẻ đang úp'); c.b.setAttribute('aria-label', 'Thẻ đang úp');
          up = []; lock = false;
        }, 950);
      }
      paintScore();
    }
    bindSeg($('#mem-mode'), function (v) { mode = v; EC.store.set('mem-mode', v); start(); });
    $('#mem-again').addEventListener('click', start);
    EC.onLeave(function () { clearTimeout(timer); });
    start();
  }, 'Ghép cặp màu');

  /* ================= PHÂN LOẠI RÁC ================= */
  var BIN_HINT = { giay: 'làm từ giấy', nhua: 'làm bằng nhựa', kimloai: 'làm bằng kim loại', huuco: 'là rác hữu cơ' };
  EC.route('phan-loai', function (view) {
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ crumbs: crumbs, title: 'Phân loại rác', sc: '--c-la-dua' }) +
      '<div class="gamebar"><span class="score" id="sort-score"></span></div>' +
      '<div class="sortwrap">' +
        EC.mascotLine('Kéo rác vào đúng thùng nhé!', 'happy', 'sort-m') +
        '<div class="tray" id="tray" aria-label="Rác cần phân loại"></div>' +
        '<div class="bins" id="bins">' + EC.BINS.map(function (b) { return '<button class="binbox" type="button" data-bin="' + b.id + '">' + A.bin(b) + '<span>' + b.name + '</span><span class="cnt" data-cnt="' + b.id + '">0</span></button>'; }).join('') + '</div>' +
        '<div class="row" style="justify-content:center" id="sort-end" hidden><button class="btn" type="button" id="sort-again">Chơi lại</button><a class="btn btn-ghost" href="#tro-choi">Trò khác</a></div>' +
      '</div></div></section>';
    var tray = $('#tray'), row = $('#sort-m'), score = $('#sort-score'), queue = [], firstTry = 0, done = 0, total = 0, missed = {}, sel = null, counts = {};
    var drag = null;
    function start() {
      queue = []; EC.BINS.forEach(function (b) { queue = queue.concat(EC.shuffle(EC.WASTE.filter(function (w) { return w.bin === b.id; })).slice(0, 3)); });
      queue = EC.shuffle(queue); total = queue.length; firstTry = 0; done = 0; missed = {}; sel = null; counts = {};
      $$('[data-cnt]').forEach(function (c) { c.textContent = '0'; });
      $('#sort-end').hidden = true; tray.innerHTML = '';
      refill(); paint();
    }
    function paint() { score.textContent = done + ' / ' + total; }
    function refill() {
      while ($$('.witem:not(.gone)', tray).length < 3 && queue.length) {
        var w = queue.shift(), b = document.createElement('button');
        b.type = 'button'; b.className = 'witem'; b.setAttribute('data-id', w.id);
        b.innerHTML = A.thing(w.id) + '<span>' + esc(w.name) + '</span>';
        tray.appendChild(b); bindItem(b);
      }
    }
    function wasteOf(el) { var id = el.getAttribute('data-id'); return EC.WASTE.filter(function (w) { return w.id === id; })[0]; }
    function select(el) {
      $$('.witem.sel', tray).forEach(function (x) { x.classList.remove('sel'); });
      sel = el; el.classList.add('sel'); S.play('pop');
      EC.setBubble(row, wasteOf(el).name + ': thùng nào nhỉ?', 'think');
    }
    function drop(el, binEl) {
      var w = wasteOf(el), binId = binEl.getAttribute('data-bin');
      if (w.bin === binId) {
        if (!missed[w.id]) firstTry++;
        el.classList.remove('sel'); el.classList.add('gone'); sel = null; done++; S.play('good');
        counts[binId] = (counts[binId] || 0) + 1; $('[data-cnt="' + binId + '"]').textContent = counts[binId];
        setTimeout(function () { el.remove(); refill(); if (done === total) finish(); }, 380);
        EC.setBubble(row, 'Đúng rồi! ' + w.tip, 'happy');
      } else {
        missed[w.id] = true; S.play('bad');
        binEl.classList.remove('shake'); void binEl.offsetWidth; binEl.classList.add('shake');
        EC.setBubble(row, 'Chưa đúng! ' + w.name + ' ' + BIN_HINT[w.bin] + '.', 'think');
      }
      paint();
    }
    function finish() {
      $('#sort-end').hidden = false;
      EC.setBubble(row, 'Xong! Đúng ngay ' + firstTry + ' / ' + total + ' món.' + (firstTry >= total - 2 ? ' Giỏi quá!' : ' Chơi lại nhé!'), 'wow');
      EC.reward({ leaves: firstTry >= total - 2 ? 3 : 2, why: 'Phân loại rác', sticker: 'phan-loai' });
    }
    function binAt(x, y) { var el = document.elementFromPoint(x, y); return el && el.closest ? el.closest('.binbox') : null; }
    function clearHover() { $$('.binbox.hover').forEach(function (b) { b.classList.remove('hover'); }); }
    function bindItem(el) {
      el.addEventListener('pointerdown', function (e) {
        if (e.button > 0 || el.classList.contains('gone')) return;
        drag = { el: el, x: e.clientX, y: e.clientY, moved: false, ghost: null, id: e.pointerId };
        try { el.setPointerCapture(e.pointerId); } catch (er) { /* bỏ qua */ }
      });
      el.addEventListener('pointermove', function (e) {
        if (!drag || drag.el !== el) return;
        if (!drag.moved && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8) {
          drag.moved = true; var g = el.cloneNode(true); g.classList.add('dragging'); g.classList.remove('sel');
          document.body.appendChild(g); drag.ghost = g; el.style.visibility = 'hidden';
        }
        if (drag.moved) {
          drag.ghost.style.left = (e.clientX - 52) + 'px'; drag.ghost.style.top = (e.clientY - 56) + 'px';
          clearHover(); var b = binAt(e.clientX, e.clientY); if (b) b.classList.add('hover');
        }
      });
      var end = function (e, cancel) {
        if (!drag || drag.el !== el) return;
        var d = drag; drag = null; clearHover();
        if (d.moved) {
          d.ghost.remove(); el.style.visibility = '';
          var b = cancel ? null : binAt(e.clientX, e.clientY);
          if (b) drop(el, b);
        } else if (!cancel) select(el);
        el.dataset.skipClick = '1';
      };
      el.addEventListener('pointerup', function (e) { end(e, false); });
      el.addEventListener('pointercancel', function (e) { end(e, true); });
      el.addEventListener('click', function () {
        if (el.dataset.skipClick) { delete el.dataset.skipClick; return; }
        select(el);
      });
    }
    $$('.binbox', view).forEach(function (b) {
      b.addEventListener('click', function () {
        if (sel && !sel.classList.contains('gone')) drop(sel, b);
        else EC.setBubble(row, 'Chọn một món rác trước nhé.', 'think');
      });
    });
    $('#sort-again').addEventListener('click', start);
    EC.onLeave(function () { if (drag && drag.ghost) drag.ghost.remove(); drag = null; });
    start();
  }, 'Phân loại rác');

  /* ================= ĐỐ VUI ================= */
  EC.route('do-vui', function (view) {
    var mode = EC.store.get('quiz-mode', 'nho');
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ crumbs: crumbs, title: 'Đố vui xanh', sc: '--c-dau-biec' }) +
      '<div class="gamebar">' + seg('quiz-mode', [['nho', 'Bé nhỏ'], ['lon', 'Bé lớn']], mode) + '<span class="score" id="quiz-score"></span></div>' +
      '<div class="quiz sheet" id="quiz"></div></div></section>';
    var box = $('#quiz'), qs = [], i = 0, right = 0, res = [];
    function start() {
      qs = EC.shuffle(EC.QUIZ).slice(0, 8).map(function (q) {
        var opts = q.a.map(function (t, k) { return { t: t, ok: k === 0 }; });
        if (mode === 'nho' && opts.length > 2) opts = [opts[0], EC.shuffle(opts.slice(1))[0]];
        return { q: q.q, art: q.art, ex: q.ex, opts: EC.shuffle(opts) };
      });
      i = 0; right = 0; res = []; show();
    }
    function bar() { return '<div class="qprogress" aria-hidden="true">' + qs.map(function (_, k) { return '<span class="' + (k < res.length ? (res[k] ? 'ok' : 'no') : k === i ? 'now' : '') + '"></span>'; }).join('') + '</div>'; }
    function show() {
      var q = qs[i];
      $('#quiz-score').textContent = 'Câu ' + (i + 1) + ' / ' + qs.length + ' · Đúng ' + right;
      box.innerHTML = bar() + '<div class="qcard' + (q.art && A.has(q.art) ? '' : ' noart') + '">' + (q.art && A.has(q.art) ? A.thing(q.art) : '') +
        '<p class="qtext"><span>' + esc(q.q) + '</span>' + EC.sayBtn(q.q) + '</p></div>' +
        '<div class="qopts">' + q.opts.map(function (o, k) { return '<button class="btn qopt" type="button" data-k="' + k + '"><span class="k">' + 'ABCD'[k] + '</span><span>' + esc(o.t) + '</span></button>'; }).join('') + '</div>' +
        '<div class="qexp" id="qexp"></div>';
      V.autoSay(q.q);
      $$('.qopt', box).forEach(function (b) { b.addEventListener('click', function () { answer(+b.getAttribute('data-k')); }); });
      var f = $('.qopt', box); if (f) f.focus({ preventScroll: true });
    }
    function answer(k) {
      var q = qs[i], ok = q.opts[k].ok;
      $$('.qopt', box).forEach(function (b, n) { b.disabled = true; if (q.opts[n].ok) b.classList.add('right'); else if (n === k) b.classList.add('wrong'); });
      res.push(ok); if (ok) right++;
      S.play(ok ? 'good' : 'bad');
      $('#qexp').innerHTML = EC.mascotLine((ok ? 'Đúng rồi! ' : 'Chưa đúng. ') + q.ex, ok ? 'wow' : 'think') +
        '<div class="row" style="margin-top:14px;justify-content:flex-end"><button class="btn" type="button" id="qnext">' + (i < qs.length - 1 ? 'Tiếp' : 'Xem điểm') + '</button></div>';
      V.autoSay((ok ? 'Đúng rồi! ' : 'Chưa đúng. ') + q.ex);
      $('#quiz-score').textContent = 'Câu ' + (i + 1) + ' / ' + qs.length + ' · Đúng ' + right;
      var nb = $('#qnext'); nb.focus({ preventScroll: true });
      nb.addEventListener('click', function () { if (i < qs.length - 1) { i++; show(); } else end(); });
    }
    function end() {
      var good = right >= 6;
      var msg = good ? 'Tuyệt vời! Đúng ' + right + ' / 8 câu!' : 'Đúng ' + right + ' / 8 câu. Chơi lại nhé!';
      $('#quiz-score').textContent = 'Đúng ' + right + ' / 8';
      box.innerHTML = bar() + EC.mascotLine(msg, good ? 'wow' : 'happy') +
        '<div class="row" style="margin-top:16px;justify-content:center"><button class="btn" type="button" id="qagain">Chơi lại</button><a class="btn btn-ghost" href="#tro-choi">Trò khác</a></div>';
      V.autoSay(msg);
      EC.reward({ leaves: right >= 6 ? 3 : right >= 4 ? 2 : 1, why: 'Đố vui xanh', sticker: good ? 'do-vui' : null });
      $('#qagain').addEventListener('click', start);
    }
    bindSeg($('#quiz-mode'), function (v) { mode = v; EC.store.set('quiz-mode', v); start(); });
    start();
  }, 'Đố vui xanh');

  /* ================= BẾP PHA MÀU ================= */
  function hexRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function rgbHex(r) { return '#' + r.map(function (v) { return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); }).join(''); }
  EC.mixHex = function (a, b) {
    var rec = EC.MIX.filter(function (m) { return (m.a === a && m.b === b) || (m.a === b && m.b === a); })[0];
    if (rec) return rec.hex;
    if (a === b) return EC.colorById(a).hex;
    var x = hexRgb(EC.colorById(a).hex), y = hexRgb(EC.colorById(b).hex);
    return rgbHex([0, 1, 2].map(function (k) { return (x[k] + y[k]) / 2 * 0.88; }));
  };
  function bowlSVG() {
    return '<svg class="art bowl" viewBox="0 0 200 150" aria-hidden="true"><g stroke="currentColor" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M16 60 H184 C184 112 146 140 100 140 C54 140 16 112 16 60 Z" fill="#EFE6D2"/>' +
      '<ellipse class="bowlfill" cx="100" cy="60" rx="84" ry="16"/>' +
      '<path class="swirl2" d="M70 60 Q86 52 100 60 Q114 68 130 60" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="4"/>' +
      '<path d="M40 96 Q60 112 80 116" fill="none" stroke="#D8CBB0" stroke-width="4"/></g></svg>';
  }
  EC.route('pha-mau', function (view) {
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ crumbs: crumbs, title: 'Bếp pha màu', sc: '--c-ca-rot' }) +
      '<div class="gamebar"><span class="score" id="mix-score"></span></div>' +
      '<div class="sheet"><div class="mix">' +
        '<div class="stack"><div class="order" id="order"></div>' + EC.mascotLine('Chọn 2 cây sáp nhé!', 'happy', 'mix-m') +
          '<div class="jars" id="jars">' + EC.COLORS.map(function (c) { return '<button class="jar" type="button" data-id="' + c.id + '" aria-pressed="false">' + A.crayon(c.hex) + '<span>' + esc(c.color) + '</span></button>'; }).join('') + '</div></div>' +
        '<div class="bowlbox">' + bowlSVG() + '<p class="score" id="mix-now">Bát đang trống</p><div class="row" id="mix-next-row" hidden><button class="btn" type="button" id="mix-next">Tiếp</button></div></div>' +
      '</div></div>' +
      '<div class="sheet-flat" style="margin-top:18px"><b>Công thức của bé</b><div class="row" id="recipes" style="margin-top:8px"><span class="small muted">Chưa có.</span></div></div>' +
      '</div></section>';
    var orders = [], i = 0, picks = [], tries = 0, found = [], bowl = $('.bowl', view), row = $('#mix-m');
    function start() { orders = EC.shuffle(EC.MIX); i = 0; found = []; showOrder(); paintRecipes(); }
    function showOrder() {
      var o = orders[i]; picks = []; tries = 0;
      $('#order').innerHTML = '<span class="sw" style="background:' + o.hex + '"></span><div><p class="eyebrow">Đơn ' + (i + 1) + ' / ' + orders.length + '</p><p class="h3">Cần màu ' + esc(o.name.toLowerCase()) + '</p></div>';
      $('#mix-score').textContent = i + ' / ' + orders.length + ' màu';
      $('#mix-next-row').hidden = true; $('#mix-now').textContent = 'Bát đang trống';
      bowl.style.setProperty('--mix', '#F6EFDF');
      paintJars();
      EC.setBubble(row, 'Pha màu ' + o.name.toLowerCase() + ' thế nào nhỉ?', 'think');
    }
    function paintJars() { $$('.jar', view).forEach(function (j) { var on = picks.indexOf(j.getAttribute('data-id')) >= 0; j.classList.toggle('picked', on); j.setAttribute('aria-pressed', String(on)); j.disabled = !$('#mix-next-row').hidden; }); }
    function paintRecipes() {
      $('#recipes').innerHTML = found.length ? found.map(function (m) { return '<span class="chip"><span style="width:12px;height:12px;border-radius:50%;background:' + EC.colorById(m.a).hex + '"></span>+<span style="width:12px;height:12px;border-radius:50%;background:' + EC.colorById(m.b).hex + '"></span>= ' + esc(m.name) + '</span>'; }).join('') : '<span class="small muted">Chưa có.</span>';
    }
    $$('.jar', view).forEach(function (j) {
      j.addEventListener('click', function () {
        var id = j.getAttribute('data-id'), k = picks.indexOf(id);
        if (k >= 0) picks.splice(k, 1); else picks.push(id);
        S.play('pop'); paintJars();
        if (picks.length === 1) { bowl.style.setProperty('--mix', EC.colorById(id).hex); $('#mix-now').textContent = 'Đã cho màu ' + EC.colorById(id).color.toLowerCase(); }
        if (picks.length === 2) pour();
        if (picks.length === 0) { bowl.style.setProperty('--mix', '#F6EFDF'); $('#mix-now').textContent = 'Bát đang trống'; }
      });
    });
    function pour() {
      var o = orders[i], a = picks[0], b = picks[1], hex = EC.mixHex(a, b);
      bowl.classList.remove('stir'); void bowl.getBoundingClientRect(); bowl.classList.add('stir');
      bowl.style.setProperty('--mix', hex);
      var ca = EC.colorById(a), cb = EC.colorById(b);
      var ok = (o.a === a && o.b === b) || (o.a === b && o.b === a);
      setTimeout(function () {
        if (ok) {
          S.play('good'); found.push(o); paintRecipes();
          $('#mix-now').textContent = ca.color + ' + ' + cb.color + ' = ' + o.name;
          EC.setBubble(row, 'Đúng rồi! ' + ca.color + ' + ' + cb.color.toLowerCase() + ' = ' + o.name.toLowerCase() + '.', 'wow');
          $('#mix-next').textContent = i < orders.length - 1 ? 'Tiếp' : 'Xong';
          $('#mix-next-row').hidden = false; paintJars();
        } else {
          S.play('bad'); tries++;
          $('#mix-now').textContent = 'Chưa đúng';
          EC.setBubble(row, 'Chưa đúng!' + (tries >= 2 ? ' Thử màu ' + EC.colorById(o.a).color.toLowerCase() + ' xem.' : ' Thử lại nhé.'), 'think');
          picks = []; setTimeout(function () { paintJars(); bowl.style.setProperty('--mix', '#F6EFDF'); }, 900);
        }
      }, 700);
    }
    var finished = false;
    $('#mix-next').addEventListener('click', function () {
      if (finished) { finished = false; start(); return; }
      if (i < orders.length - 1) { i++; showOrder(); return; }
      finished = true;
      $('#mix-score').textContent = orders.length + ' / ' + orders.length + ' màu';
      EC.setBubble(row, 'Bé pha đủ 6 màu rồi!', 'wow');
      $('#mix-next').textContent = 'Chơi lại';
      EC.reward({ leaves: 3, why: 'Bếp pha màu', sticker: 'pha-mau' });
    });
    start();
  }, 'Bếp pha màu');
})();
