/* ECOCRAYON – 12 trò chơi của 4 vùng đất và thử thách tổng kết.
   Mỗi kiểu trò chơi nhận (stage, game, api):
   stage: chỗ vẽ trò chơi · game: dữ liệu trong js/zones.js · api: chấm điểm, tiến trình, lời nhân vật (xem world.js). */
(function () {
  'use strict';
  var $ = EC.$, $$ = EC.$$, esc = EC.esc, A = EC.art, S = EC.sfx, V = EC.voice, P = EC.progress;

  function col(c) { return EC.COLORSET[c] || { name: String(c), hex: '#999999', fam: String(c) }; }
  function nextBtn(label) { return '<div class="row g-next"><button class="btn btn-big" type="button" data-next>' + (label || 'Tiếp') + ' ›</button></div>'; }
  function onNext(stage, fn) {
    var b = $('[data-next]', stage); if (!b) return;
    b.addEventListener('click', function () { b.disabled = true; fn(); });
    try { b.focus({ preventScroll: true }); } catch (e) { /* bỏ qua */ }
  }
  /* Đúng ngay lần đầu: đủ điểm; lần hai: nửa điểm; sau đó: 0 điểm (vẫn được đi tiếp) */
  function ptsFor(tries, pts) { return tries === 0 ? pts : tries === 1 ? Math.round(pts / 2) : 0; }
  function hexRgb(h) { h = String(h).replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function rgbHex(r) { return '#' + r.map(function (v) { return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); }).join(''); }
  function mix(a, b, t) { var x = hexRgb(a), y = hexRgb(b); return rgbHex([0, 1, 2].map(function (k) { return x[k] + (y[k] - x[k]) * t; })); }
  function need(cond, msg) { if (!cond) throw new Error(msg); }

  /* ================= 1. GIẢI CỨU MÀU SẮC (chọn màu) ================= */
  EC.gameType('rescue', function (stage, game, api) {
    var pool = (game.items || []).filter(function (x) { return EC.COLORSET[x.color]; });
    var items = EC.shuffle(pool).slice(0, Math.min(+game.count || 8, pool.length)), i = 0, tries = 0;
    var MAIN = ['do', 'cam', 'vang', 'xanhla', 'xanhduong', 'tim'];
    need(items.length, 'Chưa có rau củ');
    api.setMax(items.length * api.pts);
    function show() {
      var it = items[i], c = col(it.color); tries = 0;
      var opts = EC.shuffle([it.color].concat(EC.shuffle(MAIN.filter(function (k) { return col(k).fam !== c.fam; })).slice(0, 2)));
      api.progress(i, items.length);
      stage.innerHTML = '<div class="rescue sheet">' +
        '<div class="rescue-art grey" id="rs-art">' + EC.pic(it.art, '', it.name) + '<span class="sparkles" aria-hidden="true"></span></div>' +
        '<div class="stack rescue-side"><p class="eyebrow">Bạn thứ ' + (i + 1) + '/' + items.length + '</p>' +
          '<p class="g-q">' + esc(it.name) + ' bị mất màu rồi! Bạn ấy màu gì?</p>' +
          '<div class="swatchbtns">' + opts.map(function (k) { return '<button class="swbtn" type="button" data-c="' + k + '" style="--sw:' + col(k).hex + '"><span class="blob" aria-hidden="true"></span><span>' + esc(col(k).name) + '</span></button>'; }).join('') + '</div>' +
          '<div id="rs-after"></div></div></div>';
      api.say(it.name + ' bị mất màu rồi! Bé chọn màu nào?', 'think');
      $$('.swbtn', stage).forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-c');
          if (k === it.color) {
            api.add(ptsFor(tries, api.pts));
            $$('.swbtn', stage).forEach(function (x) { x.disabled = true; });
            b.classList.add('right');
            var art = $('#rs-art', stage); art.classList.remove('grey'); art.classList.add('restored');
            api.good('Đúng rồi! ' + it.name + ' màu ' + c.name.toLowerCase() + '. Màu đã trở lại!', art);
            $('#rs-after', stage).innerHTML = nextBtn(i < items.length - 1 ? 'Bạn tiếp theo' : 'Xem kết quả');
            onNext(stage, function () { i++; if (i < items.length) show(); else api.finish(); });
          } else {
            tries++; b.disabled = true; b.classList.add('wrong');
            api.bad('Chưa đúng! ' + it.name + ' không có màu ' + col(k).name.toLowerCase() + '. Thử màu khác nhé!', b);
          }
        });
      });
    }
    show();
  });

  /* ================= 2. AI ĐANG TRỐN TRONG KHU VƯỜN? (tìm theo gợi ý) ================= */
  EC.gameType('hide', function (stage, game, api) {
    var pool = game.items || [], rounds = EC.shuffle(pool).slice(0, Math.min(+game.count || 6, pool.length)), i = 0, tries = 0;
    need(rounds.length >= 2, 'Cần ít nhất 2 bạn rau củ');
    api.setMax(rounds.length * api.pts);
    function show() {
      var target = rounds[i]; tries = 0;
      var cells = EC.shuffle([target].concat(EC.shuffle(pool.filter(function (x) { return x !== target; })).slice(0, 7)));
      api.progress(i, rounds.length);
      stage.innerHTML = '<div class="clue sheet"><p class="eyebrow">Gợi ý ' + (i + 1) + '/' + rounds.length + '</p><p class="g-q">“' + esc(target.clue) + '”</p>' + EC.sayBtn(target.clue) + '</div>' +
        '<div class="garden">' + cells.map(function (c, k) {
          return '<button class="plot" type="button" data-k="' + k + '" aria-label="Bụi cây số ' + (k + 1) + '"><span class="plot-item">' + EC.pic(c.art) + '</span><span class="plot-bush" aria-hidden="true">' + A.thing('bush') + '</span><span class="plot-name">' + esc(c.name) + '</span></button>';
        }).join('') + '</div><div id="hd-card" aria-live="polite"></div>';
      api.say('Ai đang trốn nhỉ? Nghe gợi ý rồi chạm vào bụi cây nhé!', 'think');
      V.autoSay(target.clue);
      $$('.plot', stage).forEach(function (b) {
        b.addEventListener('click', function () {
          var c = cells[+b.getAttribute('data-k')];
          b.classList.add('open'); b.disabled = true; b.setAttribute('aria-label', c.name);
          if (c === target) {
            api.add(ptsFor(tries, api.pts));
            $$('.plot', stage).forEach(function (x) { x.disabled = true; });
            b.classList.add('found');
            var prog = P.data, isNew = !prog.cards[target.art];
            if (isNew) { prog.cards[target.art] = Date.now(); P.save(); }
            api.good('Tìm ra rồi! Đó là ' + target.name + '!', b);
            $('#hd-card', stage).innerHTML = '<div class="charcard sheet">' + EC.pic(target.art) + '<div class="stack" style="gap:4px"><p class="eyebrow">' + (isNew ? 'Mở khóa thẻ nhân vật!' : 'Thẻ nhân vật') + '</p><b class="h3">' + esc(target.name) + '</b><p>' + esc(target.fact || '') + '</p></div></div>' +
              nextBtn(i < rounds.length - 1 ? 'Gợi ý tiếp' : 'Xem kết quả');
            onNext(stage, function () { i++; if (i < rounds.length) show(); else api.finish(); });
          } else {
            tries++;
            api.bad('Đó là ' + c.name + '. Chưa phải bạn cần tìm, thử bụi khác nhé!', b);
            if (tries >= 2) $$('.plot', stage)[cells.indexOf(target)].classList.add('hint');
          }
        });
      });
    }
    show();
  });

  /* ================= 3. GHÉP ĐÔI THIÊN NHIÊN ================= */
  EC.gameType('match', function (stage, game, api) {
    var rounds = (game.rounds || []).filter(function (R) { return R.pairs && R.pairs.length; }), r = 0, total = 0, done = 0;
    rounds.forEach(function (R) { total += R.pairs.length; });
    need(total, 'Chưa có cặp nào');
    api.setMax(total * api.pts);
    function face(ref, hideName) {
      ref = String(ref);
      if (ref.indexOf('c:') === 0) { var c = col(ref.slice(2)); return '<span class="m-sw" style="background:' + c.hex + '"></span><span class="m-lbl">' + esc(c.name) + '</span>'; }
      if (ref.indexOf('t:') === 0) return '<span class="m-text">' + esc(ref.slice(2)) + '</span>';
      return EC.pic(ref, '', EC.artName(ref)) + (hideName ? '' : '<span class="m-lbl">' + esc(EC.artName(ref)) + '</span>');
    }
    function label(ref) { ref = String(ref); if (ref.indexOf('c:') === 0) return 'Màu ' + col(ref.slice(2)).name; if (ref.indexOf('t:') === 0) return ref.slice(2); return EC.artName(ref) || 'Hình'; }
    function show() {
      var R = rounds[r], sel = null, miss = {}, matched = 0, tag = 0;
      var Ls = EC.shuffle(R.pairs.map(function (p, k) { return { k: k, ref: p.l }; })), Rs = EC.shuffle(R.pairs.map(function (p, k) { return { k: k, ref: p.r }; }));
      stage.innerHTML = '<div class="sheet match-wrap"><p class="g-q">Vòng ' + (r + 1) + '/' + rounds.length + ': ' + esc(R.title) + '</p>' +
        '<p class="small muted">Chạm một ô bên trái, rồi chạm ô hợp với nó bên phải.</p>' +
        '<div class="matchboard"><div class="mcol">' + Ls.map(function (x, n) { return '<button class="mcard" type="button" data-side="l" data-k="' + x.k + '" aria-pressed="false" aria-label="' + esc(R.hideNames ? 'Hình số ' + (n + 1) : label(x.ref)) + '">' + face(x.ref, R.hideNames) + '</button>'; }).join('') + '</div>' +
        '<div class="mcol">' + Rs.map(function (x) { return '<button class="mcard" type="button" data-side="r" data-k="' + x.k + '" aria-pressed="false" aria-label="' + esc(label(x.ref)) + '">' + face(x.ref, false) + '</button>'; }).join('') + '</div></div></div>';
      api.say(R.title + ' Bé nối từng cặp nhé!', 'happy');
      $$('.mcard', stage).forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.classList.contains('paired')) return;
          if (!sel || sel.getAttribute('data-side') === b.getAttribute('data-side')) {
            $$('.mcard.sel', stage).forEach(function (x) { x.classList.remove('sel'); x.setAttribute('aria-pressed', 'false'); });
            sel = b; b.classList.add('sel'); b.setAttribute('aria-pressed', 'true'); S.play('pop');
            return;
          }
          var left = sel.getAttribute('data-side') === 'l' ? sel : b, k1 = +sel.getAttribute('data-k'), k2 = +b.getAttribute('data-k');
          if (k1 === k2) {
            tag++;
            [sel, b].forEach(function (x) { x.classList.remove('sel'); x.classList.add('paired'); x.disabled = true; x.setAttribute('data-tag', tag); x.setAttribute('aria-pressed', 'false'); });
            api.add(miss[k1] ? Math.round(api.pts / 2) : api.pts); done++; matched++; api.progress(done, total);
            api.good('Đúng rồi! ' + (R.pairs[k1].ex || ''), b);
            sel = null;
            if (matched === R.pairs.length) setTimeout(function () { r++; if (r < rounds.length) show(); else api.finish(); }, 1200);
          } else {
            miss[+left.getAttribute('data-k')] = true;
            api.bad('Chưa đúng cặp rồi. Thử lại nhé!', b); EC.flash(sel, 'fx-bad');
            sel.classList.remove('sel'); sel.setAttribute('aria-pressed', 'false'); sel = null;
          }
        });
      });
    }
    show();
  });

  /* ================= 4. NHÀ PHA MÀU TÀI BA (kéo lọ màu vào bình) ================= */
  EC.gameType('mixlab', function (stage, game, api) {
    var bases = game.bases || [], recs = game.recipes || [], orders = EC.shuffle(recs).slice(0, Math.min(+game.count || 6, recs.length));
    need(orders.length && bases.length >= 2, 'Chưa có công thức pha màu');
    var i = 0, picks = [], tries = 0, busy = false;
    api.setMax(orders.length * api.pts);
    function base(id) { return bases.filter(function (b) { return b.id === id; })[0] || { id: id, name: id, hex: '#999999' }; }
    function find(a, b) { return recs.filter(function (r) { return (r.a === a && r.b === b) || (r.a === b && r.b === a); })[0]; }
    stage.innerHTML = '<div class="mixlab">' +
      '<div class="mx-order sheet" id="mx-order"></div>' +
      '<div class="mx-bench sheet"><div class="pots" role="group" aria-label="Lọ màu">' + bases.map(function (b) { return '<button class="pot-btn" type="button" data-id="' + esc(b.id) + '" aria-label="Lọ màu ' + esc(b.name) + '">' + A.pot(b.hex) + '<span>' + esc(b.name) + '</span></button>'; }).join('') + '</div>' +
        '<div class="mx-beaker" id="mx-beaker">' + A.beaker() + '<div class="mx-slots" id="mx-slots"></div></div></div>' +
      '<div class="mx-result" id="mx-result" aria-live="polite"></div></div>';
    var beaker = $('#mx-beaker', stage), svgB = $('.beaker', beaker);
    function setLiquid(hex) { svgB.style.setProperty('--lab', hex || 'rgba(255,255,255,0)'); }
    function slots() {
      $('#mx-slots', stage).innerHTML = [0, 1].map(function (k) { var b = picks[k] ? base(picks[k]) : null; return b ? '<span class="mx-chip" style="--sw:' + b.hex + '">' + esc(b.name) + '</span>' : '<span class="mx-chip empty">?</span>'; }).join('<b>+</b>');
    }
    function showOrder() {
      var o = orders[i]; picks = []; tries = 0; busy = false; setLiquid(null); slots();
      $('#mx-order', stage).innerHTML = '<span class="sw big" style="background:' + o.hex + '"></span><div class="stack" style="gap:2px;min-width:0"><p class="eyebrow">Đơn pha màu ' + (i + 1) + '/' + orders.length + '</p><p class="g-q">Giáo sư cần màu <b>' + esc(o.name.toLowerCase()) + '</b></p><p class="small muted">Kéo hai lọ màu vào bình, hoặc chạm vào lọ màu.</p></div>';
      $('#mx-result', stage).innerHTML = '';
      api.progress(i, orders.length);
      api.say('Pha màu ' + o.name.toLowerCase() + ' thế nào nhỉ? Chọn hai lọ màu nhé!', 'think');
    }
    function add(id) {
      if (busy || picks.length >= 2) return;
      picks.push(id); S.play('pop'); slots(); EC.flash(beaker, 'pour');
      if (picks.length === 1) { setLiquid(base(id).hex); return; }
      check();
    }
    function check() {
      busy = true;
      var o = orders[i], a = picks[0], b = picks[1], rec = find(a, b);
      setLiquid(rec ? rec.hex : (a === b ? base(a).hex : mix(base(a).hex, base(b).hex, 0.5))); EC.flash(beaker, 'bubble');
      var ok = (o.a === a && o.b === b) || (o.a === b && o.b === a);
      setTimeout(function () {
        var expr = base(a).name + ' + ' + base(b).name.toLowerCase() + ' = ';
        if (ok) {
          api.add(ptsFor(tries, api.pts));
          api.good('Đúng rồi! ' + expr + o.name.toLowerCase() + '!', beaker);
          $('#mx-result', stage).innerHTML = '<div class="note"><b>' + esc(expr + o.name) + '.</b> ' + esc(o.ex || '') + '</div>' + nextBtn(i < orders.length - 1 ? 'Đơn tiếp theo' : 'Xem kết quả');
          onNext(stage, function () { i++; if (i < orders.length) showOrder(); else api.finish(); });
        } else {
          tries++;
          var got = rec ? rec.name.toLowerCase() : (a === b ? base(a).name.toLowerCase() : 'một màu khác');
          var hint = tries >= 2 ? ' Gợi ý: dùng màu ' + base(o.a).name.toLowerCase() + '.' : ' Thử lại nhé!';
          api.bad(expr + got + ', chưa phải màu ' + o.name.toLowerCase() + '.' + hint, beaker);
          $('#mx-result', stage).innerHTML = '<p class="note note-safe">' + esc(expr + got + '.') + (rec && rec.ex ? ' ' + esc(rec.ex) : '') + '</p>';
          setTimeout(function () { picks = []; busy = false; setLiquid(null); slots(); }, 1500);
        }
      }, 650);
    }
    $$('.pot-btn', stage).forEach(function (el) {
      EC.dragSource(el, { targetSel: '#mx-beaker', onDrop: function (e) { add(e.getAttribute('data-id')); }, onTap: function (e) { add(e.getAttribute('data-id')); } });
    });
    showOrder();
  });

  /* ================= 5. SĂN TÌM MÀU SẮC ================= */
  EC.gameType('hunt', function (stage, game, api) {
    var items = game.items || [];
    var plan = (game.rounds || []).map(function (R) {
      var fam = col(R.color).fam;
      var yes = EC.shuffle(items.filter(function (x) { return col(x.color).fam === fam; })).slice(0, +R.n || 3);
      var no = EC.shuffle(items.filter(function (x) { return col(x.color).fam !== fam; })).slice(0, (+R.size || 9) - yes.length);
      return { color: R.color, yes: yes, cells: EC.shuffle(yes.concat(no)) };
    }).filter(function (p) { return p.yes.length; });
    need(plan.length, 'Chưa có vòng chơi');
    var total = plan.reduce(function (s, p) { return s + p.yes.length; }, 0), found = 0, r = 0;
    api.setMax(total * api.pts);
    function show() {
      var R = plan[r], c = col(R.color), got = 0;
      stage.innerHTML = '<div class="hunt-ask sheet"><span class="sw big" style="background:' + c.hex + '"></span><div class="stack" style="gap:2px;min-width:0"><p class="eyebrow">Vòng ' + (r + 1) + '/' + plan.length + '</p><p class="g-q">Tìm tất cả đồ vật màu <b>' + esc(c.name.toLowerCase()) + '</b>!</p></div><span class="score" id="hu-left">0/' + R.yes.length + '</span></div>' +
        '<div class="huntgrid">' + R.cells.map(function (x, k) { return '<button class="hitem" type="button" data-k="' + k + '">' + EC.pic(x.art, '', x.name) + '<span>' + esc(x.name) + '</span></button>'; }).join('') + '</div>';
      api.say('Giáo sư cần đồ vật màu ' + c.name.toLowerCase() + '. Bé tìm giúp nhé!', 'happy');
      $$('.hitem', stage).forEach(function (b) {
        b.addEventListener('click', function () {
          if (b.classList.contains('is-yes')) return;
          var x = R.cells[+b.getAttribute('data-k')];
          if (R.yes.indexOf(x) >= 0) {
            b.classList.add('is-yes'); b.disabled = true; got++; found++; api.add(api.pts); api.progress(found, total);
            $('#hu-left', stage).textContent = got + '/' + R.yes.length;
            if (got === R.yes.length) {
              $$('.hitem', stage).forEach(function (y) { y.disabled = true; });
              api.good('Tìm đủ rồi! Giỏi quá!', b);
              setTimeout(function () { r++; if (r < plan.length) show(); else api.finish(); }, 1200);
            } else api.good('Đúng rồi! ' + x.name + ' màu ' + c.name.toLowerCase() + '.', b);
          } else {
            api.add(-Math.round(api.pts / 2));
            api.bad(x.name + ' màu ' + col(x.color).name.toLowerCase() + ', chưa phải màu ' + c.name.toLowerCase() + '.', b);
          }
        });
      });
    }
    show();
  });

  /* ================= 6. HỌA SĨ NHÍ TÀI BA (tô màu, lưu vào bộ sưu tập) ================= */
  EC.gameType('paint', function (stage, game, api) {
    api.setMax(100);
    api.say('Chọn một bức tranh, chọn màu rồi chạm vào từng vùng để tô nhé!', 'happy');
    EC.mountStudio(stage, {
      game: true, pages: game.pages,
      onChange: function (filled, needN) { api.progress(filled, needN); },
      onFinish: function (res) {
        api.add(res.score);
        api.finish({ extraHTML: res.saved
          ? '<p class="note">Tranh <b>' + esc(res.title) + '</b> đã được lưu vào <a href="#bo-suu-tap">Bộ sưu tập</a>.</p>'
          : '<p class="note note-safe">Trình duyệt này chưa cho lưu tranh. Bé vẫn được tính điểm nhé.</p>' });
      }
    });
  });

  /* ================= 7. CỨU NHÀ MÁY TÁI CHẾ (kéo rác vào thùng) ================= */
  var BIN_HINT = { giay: 'làm từ giấy', nhua: 'làm bằng nhựa', kimloai: 'làm bằng kim loại', huuco: 'là rác hữu cơ' };
  EC.gameType('sort', function (stage, game, api) {
    var per = +game.perBin || 3, src = game.items && game.items.length ? game.items : EC.WASTE, items = [];
    EC.BINS.forEach(function (b) { items = items.concat(EC.shuffle(src.filter(function (w) { return w.bin === b.id; })).slice(0, per)); });
    items = EC.shuffle(items);
    need(items.length, 'Chưa có rác để phân loại');
    var total = items.length, done = 0, missed = {}, sel = null;
    api.setMax(total * api.pts);
    stage.innerHTML = '<div class="factory-wrap sheet"><div class="factory" id="fac">' + A.factoryScene(0) + '</div><p class="fac-cap" id="fac-cap">Nhà máy đang ngừng chạy…</p></div>' +
      '<div class="tray" id="tray" aria-label="Rác cần phân loại"></div>' +
      '<div class="bins">' + EC.BINS.map(function (b) { return '<button class="binbox" type="button" data-bin="' + b.id + '">' + A.bin(b) + '<span>' + b.name + '</span><small>' + esc(b.tip) + '</small></button>'; }).join('') + '</div>';
    var tray = $('#tray', stage);
    function refill() {
      while ($$('.witem:not(.gone)', tray).length < 3 && items.length) {
        var w = items.shift(), el = document.createElement('button');
        el.type = 'button'; el.className = 'witem'; el.setAttribute('data-id', w.id); el.innerHTML = EC.pic(w.art || w.id) + '<span>' + esc(w.name) + '</span>';
        el._w = w; tray.appendChild(el);
        EC.dragSource(el, { targetSel: '.binbox', onDrop: drop, onTap: select, canDrag: function (x) { return !x.classList.contains('gone'); } });
      }
    }
    function select(el) {
      if (el.classList.contains('gone')) return;
      $$('.witem.sel', tray).forEach(function (x) { x.classList.remove('sel'); });
      sel = el; el.classList.add('sel'); S.play('pop'); api.say(el._w.name + ': bỏ vào thùng nào nhỉ?', 'think');
    }
    function drop(el, binEl) {
      if (el.classList.contains('gone')) return;
      var w = el._w, bin = binEl.getAttribute('data-bin');
      if (w.bin === bin) {
        api.add(missed[w.id] ? Math.round(api.pts / 2) : api.pts); done++;
        el.classList.remove('sel'); el.classList.add('gone'); sel = null;
        var pct = done / total;
        $('#fac', stage).innerHTML = A.factoryScene(pct);
        $('#fac-cap', stage).textContent = pct >= 1 ? 'Nhà máy chạy lại rồi! Cảm ơn bé!' : 'Nhà máy đang hồi phục: ' + Math.round(pct * 100) + '%';
        api.progress(done, total);
        api.good('Đúng rồi! ' + (w.tip || ''), binEl);
        setTimeout(function () { el.remove(); refill(); if (done === total) api.finish(); }, 380);
      } else {
        missed[w.id] = true;
        api.bad('Chưa đúng! ' + w.name + ' ' + (BIN_HINT[w.bin] || '') + '.', binEl);
        EC.flash(binEl, 'shake');
      }
    }
    $$('.binbox', stage).forEach(function (b) {
      b.addEventListener('click', function () { if (sel && !sel.classList.contains('gone')) drop(sel, b); else api.say('Chọn một món rác trước nhé.', 'think'); });
    });
    api.say('Kéo rác vào đúng thùng, hoặc chạm vào rác rồi chạm vào thùng.', 'happy');
    refill();
  });

  /* ================= 8. NHÀ PHÁT MINH TÍ HON (kết hợp vật liệu) ================= */
  EC.gameType('invent', function (stage, game, api) {
    var mats = game.materials || [], recs = game.recipes || [], orders = EC.shuffle(recs).slice(0, Math.min(+game.count || 6, recs.length));
    need(orders.length && mats.length >= 2, 'Chưa có công thức phát minh');
    var i = 0, picks = [], tries = 0, busy = false;
    api.setMax(orders.length * api.pts);
    function mat(id) { return mats.filter(function (m) { return m.id === id; })[0] || { id: id, name: EC.artName(id) || id }; }
    function find(a, b) { return recs.filter(function (r) { return (r.a === a && r.b === b) || (r.a === b && r.b === a); })[0]; }
    stage.innerHTML = '<div class="invent">' +
      '<div class="inv-order sheet" id="inv-order"></div>' +
      '<div class="inv-bench sheet"><p class="eyebrow">Bàn chế tạo</p><div class="inv-slots" id="inv-slots"></div><button class="btn btn-big c-ca-rot" type="button" id="inv-make" disabled>Chế tạo!</button></div>' +
      '<div class="shelf sheet" role="group" aria-label="Vật liệu cũ">' + mats.map(function (m) { return '<button class="mat" type="button" data-id="' + esc(m.id) + '" aria-pressed="false">' + EC.pic(m.art || m.id, '', m.name) + '<span>' + esc(m.name) + '</span></button>'; }).join('') + '</div>' +
      '<div id="inv-out" aria-live="polite"></div></div>';
    function paintPicks() {
      $('#inv-slots', stage).innerHTML = [0, 1].map(function (k) { var m = picks[k] ? mat(picks[k]) : null; return m ? '<span class="inv-slot">' + EC.pic(m.art || m.id) + '<small>' + esc(m.name) + '</small></span>' : '<span class="inv-slot empty">?</span>'; }).join('<b class="plus">+</b>');
      $$('.mat', stage).forEach(function (b) { var on = picks.indexOf(b.getAttribute('data-id')) >= 0; b.classList.toggle('picked', on); b.setAttribute('aria-pressed', String(on)); });
      $('#inv-make', stage).disabled = picks.length < 2 || busy;
    }
    function showOrder() {
      var o = orders[i]; picks = []; tries = 0; busy = false;
      $('#inv-order', stage).innerHTML = '<div class="inv-sil" id="inv-sil">' + EC.pic(o.art, '', o.name) + '</div><div class="stack" style="gap:4px;min-width:0"><p class="eyebrow">Phát minh ' + (i + 1) + '/' + orders.length + '</p><p class="g-q">' + esc(o.name) + '</p><p class="muted">' + esc(o.need || '') + '</p></div>';
      $('#inv-out', stage).innerHTML = '';
      $$('.mat', stage).forEach(function (b) { b.classList.remove('hint'); });
      paintPicks(); api.progress(i, orders.length);
      api.say('Bé chọn hai vật liệu cũ để làm ' + o.name.toLowerCase() + ' nhé!', 'think');
    }
    $$('.mat', stage).forEach(function (b) {
      b.addEventListener('click', function () {
        if (busy) return;
        var id = b.getAttribute('data-id'), k = picks.indexOf(id);
        if (k >= 0) picks.splice(k, 1); else { if (picks.length >= 2) picks.shift(); picks.push(id); }
        S.play('pop'); paintPicks();
      });
    });
    $('#inv-make', stage).addEventListener('click', function () {
      if (picks.length < 2 || busy) return;
      var o = orders[i], rec = find(picks[0], picks[1]); busy = true; paintPicks();
      EC.flash($('.inv-bench', stage), 'working');
      setTimeout(function () {
        if (rec) { var prog = P.data; if (!prog.inventions[rec.art]) { prog.inventions[rec.art] = Date.now(); P.save(); } }
        if (rec === o) {
          api.add(ptsFor(tries, api.pts));
          $('#inv-sil', stage).classList.add('made');
          api.good('Chế tạo thành công: ' + o.name + '!', $('#inv-order', stage));
          $('#inv-out', stage).innerHTML = '<div class="note"><b>' + esc(mat(o.a).name + ' + ' + mat(o.b).name.toLowerCase() + ' = ' + o.name) + '.</b> ' + esc(o.ex || '') + ' <span class="small">Đã cất vào Phòng trưng bày trong Bộ sưu tập.</span></div>' +
            nextBtn(i < orders.length - 1 ? 'Phát minh tiếp' : 'Xem kết quả');
          onNext(stage, function () { i++; if (i < orders.length) showOrder(); else api.finish(); });
        } else {
          tries++; busy = false;
          if (rec) {
            api.bad('Bé vừa làm ra ' + rec.name.toLowerCase() + '! Hay quá, nhưng lần này cần ' + o.name.toLowerCase() + '.');
            $('#inv-out', stage).innerHTML = '<div class="note inv-bonus">' + EC.pic(rec.art) + '<span><b>' + esc(rec.name) + '</b> đã được cất vào Phòng trưng bày.</span></div>';
          } else api.bad('Hai vật liệu này chưa ghép thành món đồ nào. Thử cách khác nhé!');
          if (tries >= 2) { var hb = $('.mat[data-id="' + o.a + '"]', stage); if (hb) hb.classList.add('hint'); }
          picks = []; paintPicks();
        }
      }, 700);
    });
    showOrder();
  });

  /* ================= 9, 12, thử thách: ĐÚNG/SAI, SIÊU ANH HÙNG, TRẮC NGHIỆM ================= */
  function questionGame(stage, game, api, variant) {
    var bank = (game.questions || []).filter(function (q) { return q && q.q && q.a && q.a.length >= 2; });
    var qs = EC.shuffle(bank).slice(0, Math.min(+game.count || 8, bank.length)).map(function (q) {
      var tf = variant === 'tf' || q.tf;
      var opts = q.a.map(function (t, k) { return { t: t, ok: k === (+q.ok || 0), pic: q.pics ? q.pics[k] : '' }; });
      return { q: q.q, ex: q.ex || '', art: q.art || '', opts: tf ? opts : EC.shuffle(opts) };
    });
    need(qs.length, 'Chưa có câu hỏi');
    var i = 0, right = 0, res = [];
    api.setMax(qs.length * api.pts);
    function bar() { return '<div class="qprogress" aria-hidden="true">' + qs.map(function (_, k) { return '<span class="' + (k < res.length ? (res[k] ? 'ok' : 'no') : k === i ? 'now' : '') + '"></span>'; }).join('') + '</div>'; }
    function heroTop() {
      if (variant !== 'hero') return '';
      var p = Math.round(right / qs.length * 100);
      return '<div class="hero-top sheet">' + A.character('hero', right ? 'wow' : 'happy') + '<div class="stack" style="gap:6px;flex:1;min-width:0"><b>Năng lượng xanh của siêu anh hùng</b><div class="meter energy" role="progressbar" aria-label="Năng lượng xanh" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + p + '%"></span></div></div></div>';
    }
    function show() {
      var q = qs[i], hasPics = q.opts.some(function (o) { return o.pic; });
      api.progress(i, qs.length);
      stage.innerHTML = heroTop() + '<div class="quiz sheet' + (variant === 'tf' ? ' quiz-tf' : '') + '">' + bar() +
        '<div class="qcard' + (q.art ? '' : ' noart') + '">' + (q.art ? EC.pic(q.art) : '') +
        '<p class="qtext"><span>' + (variant === 'hero' ? '<small class="eyebrow">Tình huống ' + (i + 1) + '/' + qs.length + '</small> ' : '') + esc(q.q) + '</span>' + EC.sayBtn(q.q) + '</p></div>' +
        (variant === 'tf'
          ? '<div class="tfopts"><button class="btn tfbtn tf-yes" type="button" data-k="0">Đúng</button><button class="btn tfbtn tf-no" type="button" data-k="1">Sai</button></div>'
          : '<div class="qopts' + (hasPics ? ' qpics' : '') + '">' + q.opts.map(function (o, k) { return '<button class="btn qopt" type="button" data-k="' + k + '"><span class="k">' + 'ABCD'[k] + '</span>' + (o.pic ? EC.pic(o.pic, '', o.t) : '') + '<span>' + esc(o.t) + '</span></button>'; }).join('') + '</div>') +
        '<div class="qexp" id="qexp" aria-live="polite"></div></div>';
      api.say(variant === 'hero' ? 'Siêu anh hùng nhí sẽ làm gì?' : variant === 'tf' ? 'Câu này đúng hay sai nhỉ?' : 'Bé chọn đáp án đúng nhé!', 'think');
      V.autoSay(q.q);
      $$('[data-k]', stage).forEach(function (b) { b.addEventListener('click', function () { answer(+b.getAttribute('data-k')); }); });
    }
    function answer(k) {
      var q = qs[i], ok = q.opts[k].ok;
      $$('[data-k]', stage).forEach(function (b, n) { b.disabled = true; if (q.opts[n].ok) b.classList.add('right'); else if (n === k) b.classList.add('wrong'); });
      res.push(ok); if (ok) { right++; api.add(api.pts); }
      var text = (ok ? 'Đúng rồi! ' : 'Chưa đúng. ') + q.ex;
      if (ok) api.good(text); else api.bad(text);
      $('#qexp', stage).innerHTML = '<p class="note' + (ok ? '' : ' note-safe') + '">' + esc(text) + '</p>' + nextBtn(i < qs.length - 1 ? 'Câu tiếp' : 'Xem kết quả');
      var m = $('.energy span', stage); if (m) m.style.width = Math.round(right / qs.length * 100) + '%';
      onNext(stage, function () { i++; if (i < qs.length) show(); else api.finish(); });
    }
    show();
  }
  EC.gameType('quiz', function (s, g, a) { questionGame(s, g, a, 'quiz'); });
  EC.gameType('tf', function (s, g, a) { questionGame(s, g, a, 'tf'); });
  EC.gameType('hero', function (s, g, a) { questionGame(s, g, a, 'hero'); });

  /* ================= 10. GIẢI CỨU ĐẠI DƯƠNG ================= */
  var SPOTS = [[10, 18], [30, 12], [52, 20], [74, 14], [90, 30], [18, 44], [40, 40], [62, 46], [84, 56], [8, 70], [28, 68], [50, 72], [70, 78], [90, 80]];
  EC.gameType('ocean', function (stage, game, api) {
    var trash = EC.shuffle(game.trash || []).slice(0, +game.trashCount || 6), an = game.animals || [];
    var trapped = EC.shuffle(an.filter(function (a) { return a.trapped; })).slice(0, 2), free = EC.shuffle(an.filter(function (a) { return !a.trapped; })).slice(0, 2);
    var list = trash.map(function (t) { return { kind: 'trash', d: t }; }).concat(trapped.map(function (a) { return { kind: 'trapped', d: a }; }), free.map(function (a) { return { kind: 'free', d: a }; }));
    var spots = EC.shuffle(SPOTS).slice(0, list.length), needN = trash.length + trapped.length, got = 0, gotT = 0, gotA = 0;
    need(needN, 'Chưa có rác trong biển');
    api.setMax(needN * api.pts);
    stage.innerHTML = '<div class="ocean" id="ocean">' + A.seabed() + list.map(function (x, k) {
      var lbl = x.kind === 'trapped' ? x.d.name + ' bị mắc lưới' : x.d.name;
      return '<button class="oc oc-' + x.kind + '" type="button" data-k="' + k + '" style="left:' + spots[k][0] + '%;top:' + spots[k][1] + '%;--d:' + ((k % 5) * 0.4) + 's" aria-label="' + esc(lbl) + '">' + EC.pic(x.d.art) + (x.kind === 'trapped' ? '<span class="trap" aria-hidden="true">' + A.thing('net') + '</span>' : '') + '</button>';
    }).join('') + '</div>' +
      '<div class="row ocean-legend"><span class="chip">Rác đã nhặt: <b id="oc-t">0/' + trash.length + '</b></span><span class="chip">Bạn được cứu: <b id="oc-a">0/' + trapped.length + '</b></span></div>';
    var ocean = $('#ocean', stage);
    function water() { ocean.style.backgroundColor = mix('#6E8C7A', '#3A8DD8', got / needN); }
    water();
    api.say('Biển có nhiều rác quá! Chạm vào rác để nhặt, chạm vào bạn bị mắc lưới để giải cứu nhé.', 'think');
    $$('.oc', stage).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.classList.contains('done')) return;
        var x = list[+b.getAttribute('data-k')];
        if (x.kind === 'trash') {
          b.classList.add('done', 'collected'); b.disabled = true; got++; gotT++; api.add(api.pts);
          api.good('Nhặt được ' + x.d.name.toLowerCase() + '!'); $('#oc-t', stage).textContent = gotT + '/' + trash.length;
        } else if (x.kind === 'trapped') {
          b.classList.add('done', 'freed'); got++; gotA++; api.add(api.pts); b.setAttribute('aria-label', x.d.name + ' đã được cứu');
          api.good('Bé đã giải cứu ' + x.d.name.toLowerCase() + '! Cảm ơn bé!'); $('#oc-a', stage).textContent = gotA + '/' + trapped.length;
        } else {
          api.add(-Math.round(api.pts / 2)); api.bad(x.d.name + ' đang bơi vui vẻ, không phải rác đâu!', b); return;
        }
        api.progress(got, needN); water();
        if (got === needN) { ocean.classList.add('clean'); api.say('Đại dương sạch đẹp rồi! Các bạn sinh vật biển cảm ơn bé!', 'wow'); setTimeout(function () { api.finish(); }, 1400); }
      });
    });
  });

  /* ================= 11. XÂY DỰNG KHU RỪNG XANH (đặt vào đúng nơi sống) ================= */
  EC.gameType('forest', function (stage, game, api) {
    var homes = game.homes || { dat: 'Mặt đất', nuoc: 'Ao nước', troi: 'Bầu trời' }, items = (game.items || []).slice(), slots = game.slots || [];
    need(slots.length && items.length, 'Chưa có dữ liệu khu rừng');
    var filled = 0, sel = null, miss = {};
    api.setMax(slots.length * api.pts);
    stage.innerHTML = '<div class="forest" id="forest">' + A.forestBg() + slots.map(function (s, k) {
      return '<button class="slot slot-' + esc(s.home) + '" type="button" data-k="' + k + '" data-home="' + esc(s.home) + '" style="left:' + (+s.x) + '%;top:' + (+s.y) + '%" aria-label="Chỗ trống: ' + esc(homes[s.home] || s.home) + '"><span class="slot-hint" aria-hidden="true">+</span></button>';
    }).join('') + '</div>' +
      '<p class="small muted forest-help">Chọn một bạn bên dưới, rồi kéo (hoặc chạm) vào chỗ trống phù hợp: ' + Object.keys(homes).map(function (h) { return esc(String(homes[h]).toLowerCase()); }).join(', ') + '.</p>' +
      '<div class="palette sheet" id="palette">' + EC.shuffle(items).map(function (it) { return '<button class="pal" type="button" data-art="' + esc(it.art) + '">' + EC.pic(it.art, '', it.name) + '<span>' + esc(it.name) + '</span></button>'; }).join('') + '</div>';
    function itemOf(el) { var a = el.getAttribute('data-art'); return items.filter(function (x) { return x.art === a; })[0]; }
    function select(el) {
      $$('.pal.sel', stage).forEach(function (x) { x.classList.remove('sel'); });
      sel = el; el.classList.add('sel'); S.play('pop'); api.say(itemOf(el).name + ' sống ở đâu nhỉ? Chạm vào chỗ trống phù hợp.', 'think');
    }
    function canContinue() {
      var left = $$('.slot:not(.filled)', stage).map(function (s) { return s.getAttribute('data-home'); });
      return $$('.pal', stage).some(function (p) { return left.indexOf(itemOf(p).home) >= 0; });
    }
    function done() { $('#forest', stage).classList.add('alive'); api.say('Khu rừng có cây, có nước và các con vật rồi. Thật sống động!', 'wow'); setTimeout(function () { api.finish(); }, 1400); }
    function place(el, slotEl) {
      if (!el.parentNode) return;
      if (slotEl.classList.contains('filled')) { api.say('Chỗ này có bạn rồi, chọn chỗ khác nhé.', 'think'); return; }
      var it = itemOf(el), home = slotEl.getAttribute('data-home');
      if (it.home === home) {
        slotEl.classList.add('filled'); slotEl.disabled = true; slotEl.innerHTML = EC.pic(it.art, '', it.name); slotEl.setAttribute('aria-label', it.name);
        el.remove(); sel = null; filled++;
        api.add(miss[it.art] ? Math.round(api.pts / 2) : api.pts); api.progress(filled, slots.length);
        api.good('Đúng rồi! ' + (it.why || ''), slotEl);
        if (filled === slots.length || !canContinue()) done();
      } else {
        miss[it.art] = true;
        api.bad(it.name + ' không sống ở ' + String(homes[home] || '').toLowerCase() + '. ' + (it.why || ''), slotEl);
      }
    }
    $$('.pal', stage).forEach(function (el) { EC.dragSource(el, { targetSel: '.slot', onDrop: place, onTap: select }); });
    $$('.slot', stage).forEach(function (s) { s.addEventListener('click', function () { if (sel && sel.parentNode) place(sel, s); else api.say('Chọn một bạn ở bên dưới trước nhé.', 'think'); }); });
    api.say('Khu rừng còn trống trơn. Bé giúp đặt cây, hoa và các con vật vào đúng chỗ nhé!', 'happy');
  });
})();
