/* ECOCRAYON – xưởng tô màu: tô vùng, vẽ sáp, tẩy, hoàn tác, lưu tranh vào Bộ sưu tập, tải ảnh, in tranh trống.
   EC.mountStudio(host, opts) dùng cho cả trang Tô màu tự do (#to-mau) và trò Họa sĩ nhí tài ba. */
(function () {
  'use strict';
  var $ = EC.$, $$ = EC.$$, esc = EC.esc, A = EC.art, S = EC.sfx;
  var W = 1200, H = 900, NS = 'http://www.w3.org/2000/svg';

  function hexRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function tint(hex, k) { var c = hexRgb(hex); return '#' + c.map(function (v) { return ('0' + Math.round(v + (255 - v) * k).toString(16)).slice(-2); }).join(''); }
  var PALETTE = [];
  EC.COLORS.forEach(function (c) { PALETTE.push({ hex: c.hex, name: c.color + ' (' + c.name.toLowerCase() + ')' }); });
  EC.COLORS.forEach(function (c) { PALETTE.push({ hex: tint(c.hex, 0.55), name: c.color + ' nhạt' }); });

  /* Vân giấy cho màu tô vùng (ảnh PNG nhỏ, tạo một lần) */
  var grainURL = null;
  function grain() {
    if (grainURL) return grainURL;
    var c = document.createElement('canvas'); c.width = c.height = 96;
    var x = c.getContext('2d'), d = x.createImageData(96, 96);
    for (var i = 0; i < d.data.length; i += 4) {
      var r = Math.random();
      d.data[i] = d.data[i + 1] = d.data[i + 2] = 255;
      d.data[i + 3] = r < 0.14 ? 150 + Math.random() * 90 : r < 0.36 ? 30 + Math.random() * 30 : 0;
    }
    x.putImageData(d, 0, 0);
    grainURL = c.toDataURL('image/png');
    return grainURL;
  }
  /* Vân sáp cho nét vẽ tay */
  var crayonCache = {};
  function crayonTile(hex) {
    if (crayonCache[hex]) return crayonCache[hex];
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var x = c.getContext('2d'), d = x.createImageData(64, 64), rgb = hexRgb(hex);
    for (var i = 0; i < d.data.length; i += 4) {
      var r = Math.random();
      d.data[i] = rgb[0]; d.data[i + 1] = rgb[1]; d.data[i + 2] = rgb[2];
      d.data[i + 3] = r < 0.2 ? 30 + Math.random() * 70 : 190 + Math.random() * 65;
    }
    x.putImageData(d, 0, 0);
    crayonCache[hex] = c; return c;
  }
  function drawStroke(ctx, s) {
    if (!s.pts.length) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = s.size;
    if (s.erase) { ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = '#000'; }
    else { ctx.strokeStyle = ctx.createPattern(crayonTile(s.hex), 'repeat'); ctx.globalAlpha = 0.92; }
    ctx.beginPath(); ctx.moveTo(s.pts[0][0], s.pts[0][1]);
    for (var i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i][0], s.pts[i][1]);
    if (s.pts.length === 1) ctx.lineTo(s.pts[0][0] + 0.5, s.pts[0][1] + 0.5);
    ctx.stroke(); ctx.restore();
  }

  var ICON = {
    fill: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l7-7 8 8-7 7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M19 15c1.5 2 2 3 2 4a2 2 0 01-4 0c0-1 .5-2 2-4z" fill="currentColor"/></svg>',
    draw: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19l2-6 9-9 3 3-9 9z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M3 21c3-1 5-1 8 0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
    erase: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 15l8-8 7 7-5 5H7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 20h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
  };

  EC.mountStudio = function (host, opts) {
    opts = opts || {};
    var game = !!opts.game, pid = EC.auth.pid();
    var pages = (opts.pages && opts.pages.length ? opts.pages : EC.PAGES.map(function (p) { return p.id; }))
      .map(function (id) { return EC.PAGES.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    if (!pages.length) pages = EC.PAGES.slice(0, 1);
    var pfx = (game ? 'gst-' : 'st-') + (pid === 'guest' ? '' : pid + '-');
    var pageId = EC.store.get(pfx + 'page', pages[0].id);
    if (!pages.some(function (p) { return p.id === pageId; })) pageId = pages[0].id;
    var mode = pageId === 'trang' ? 'draw' : 'fill', hex = PALETTE[1].hex, size = 20;
    var state = null, undo = [], saveTimer = null, finished = false;

    host.innerHTML = '<div class="studio' + (game ? ' studio-game' : '') + '"><div style="min-width:0">' +
        '<div class="st-pages" role="group" aria-label="Chọn tranh">' + pages.map(function (p) { return '<button class="st-thumb" type="button" data-p="' + p.id + '" aria-pressed="' + (p.id === pageId) + '">' + esc(p.name) + '</button>'; }).join('') + '</div>' +
        '<div class="st-stage"><svg class="st-svg" xmlns="' + NS + '" viewBox="0 0 800 600" aria-label="Tranh tô màu"></svg><canvas class="st-ink" width="' + W + '" height="' + H + '"></canvas><canvas class="st-live live" width="' + W + '" height="' + H + '"></canvas></div>' +
      '</div>' +
      '<div class="st-side">' +
        '<div class="st-box"><div class="tools" role="group" aria-label="Công cụ">' +
          '<button class="tool" type="button" data-mode="fill">' + ICON.fill + 'Tô vùng</button>' +
          '<button class="tool" type="button" data-mode="draw">' + ICON.draw + 'Vẽ sáp</button>' +
          '<button class="tool" type="button" data-mode="erase">' + ICON.erase + 'Tẩy</button></div>' +
          '<div class="sizes" style="margin-top:10px" role="group" aria-label="Cỡ nét">' +
          [10, 20, 36].map(function (s, i) { return '<button type="button" data-size="' + s + '" aria-label="Nét ' + ['nhỏ', 'vừa', 'to'][i] + '"><span style="width:' + (6 + i * 6) + 'px;height:' + (6 + i * 6) + 'px"></span></button>'; }).join('') + '</div></div>' +
        '<div class="st-box"><div class="swatches" role="group" aria-label="Màu">' +
          PALETTE.map(function (p, i) { return '<button class="swatch" type="button" data-i="' + i + '" style="background:' + p.hex + '" aria-label="' + esc(p.name) + '" title="' + esc(p.name) + '"></button>'; }).join('') +
          '</div></div>' +
        (game
          ? '<div class="st-box st-progress" aria-live="polite"></div>' +
            '<div class="st-box"><div class="st-actions">' +
              '<button class="btn btn-sm btn-ghost" type="button" data-act="undo">Hoàn tác</button>' +
              '<button class="btn btn-sm btn-ghost" type="button" data-act="clear">Làm lại</button>' +
              '<button class="btn btn-sm c-la-dua st-wide" type="button" data-act="finish">Hoàn thành &amp; lưu tranh</button></div></div>'
          : '<div class="st-box"><div class="st-actions">' +
              '<button class="btn btn-sm btn-ghost" type="button" data-act="undo">Hoàn tác</button>' +
              '<button class="btn btn-sm btn-ghost" type="button" data-act="clear">Xóa hết</button>' +
              '<button class="btn btn-sm c-la-dua st-wide" type="button" data-act="keep">Lưu vào bộ sưu tập</button>' +
              '<button class="btn btn-sm" type="button" data-act="download">Tải ảnh</button>' +
              '<button class="btn btn-sm c-nghe" type="button" data-act="print">In tranh trống</button></div></div>' +
            '<div class="st-box st-story"></div>') +
      '</div></div>';

    var svg = $('.st-svg', host), ink = $('.st-ink', host), live = $('.st-live', host), stage = $('.st-stage', host);
    var ictx = ink.getContext('2d'), lctx = live.getContext('2d');
    function act(name) { return $('[data-act="' + name + '"]', host); }
    function curPage() { return EC.PAGES.filter(function (p) { return p.id === pageId; })[0]; }
    function key(id) { return pfx + id; }
    function load(id) {
      var s = EC.store.get(key(id), null);
      return { fills: (s && s.fills) || {}, strokes: (s && s.strokes) || [], trash: (s && s.trash) || [] };
    }
    function persistNow() {
      if (finished || !state) return;
      var total = 0; state.strokes.forEach(function (s) { total += s.pts.length; });
      if (total > 60000) return; /* tranh quá nhiều nét: không lưu tạm để tránh đầy bộ nhớ */
      EC.store.set(key(pageId), state);
    }
    function persist() { clearTimeout(saveTimer); saveTimer = setTimeout(persistNow, 500); }
    function patternId(h) { return 'p' + h.replace('#', ''); }
    function ensurePattern(h) {
      var id = patternId(h), defs = $('defs', svg);
      if (!defs.querySelector('#' + id)) {
        var p = document.createElementNS(NS, 'pattern');
        p.setAttribute('id', id); p.setAttribute('patternUnits', 'userSpaceOnUse'); p.setAttribute('width', '96'); p.setAttribute('height', '96');
        p.innerHTML = '<rect width="96" height="96" fill="' + h + '"/><image href="' + grain() + '" width="96" height="96"/>';
        defs.appendChild(p);
      }
      return 'url(#' + id + ')';
    }
    function paintRegion(el, h) { el.setAttribute('fill', h ? ensurePattern(h) : '#FFFFFF'); }
    function regions() { return $$('.f', svg); }

    /* Điểm của trò Họa sĩ nhí: tô khoảng 1/3 số vùng (tối đa 15 vùng) là đạt điểm tối đa */
    function scoreNow() {
      var filled = Object.keys(state.fills).length, total = regions().length || 1, needN = Math.min(15, Math.max(4, Math.round(total * 0.3)));
      var eff = filled + Math.min(state.strokes.length, Math.round(needN * 0.3));
      return { filled: filled, need: needN, eff: eff, score: Math.min(100, Math.round(eff / needN * 100)) };
    }
    function changed() {
      if (!game) { maybeStory(); return; }
      var sc = scoreNow();
      $('.st-progress', host).innerHTML = '<b>Đã tô ' + sc.filled + ' vùng</b><div class="meter"><span style="width:' + Math.min(100, sc.score) + '%"></span></div><p class="small muted">Tô khoảng ' + sc.need + ' vùng là đạt điểm tối đa.</p>';
      if (opts.onChange) opts.onChange(Math.min(sc.eff, sc.need), sc.need);
    }

    function buildPage() {
      svg.innerHTML = '<defs></defs>' + A.pageInner(pageId);
      regions().forEach(function (el, i) { el.setAttribute('data-i', i); });
      Object.keys(state.fills).forEach(function (i) { var el = svg.querySelector('[data-i="' + i + '"]'); if (el) paintRegion(el, state.fills[i]); });
      state.trash.forEach(function (t) { var g = svg.querySelector('[data-trash="' + t + '"]'); if (g) g.style.display = 'none'; });
      redraw(); if (!game) story(); changed();
    }
    function redraw() { ictx.clearRect(0, 0, W, H); state.strokes.forEach(function (s) { drawStroke(ictx, s); }); }

    function setMode(m) {
      mode = m;
      $$('.tool', host).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode') === m)); });
      ink.style.pointerEvents = m === 'fill' ? 'none' : 'auto';
      stage.classList.toggle('mode-draw', m !== 'fill');
      stage.style.touchAction = m === 'fill' ? 'manipulation' : 'none';
    }
    function setColor(i) {
      hex = PALETTE[i].hex;
      $$('.swatch', host).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-i') === i)); });
      if (mode === 'erase') setMode('fill');
    }
    function setSize(s) { size = s; $$('.sizes button', host).forEach(function (b) { b.setAttribute('aria-pressed', String(+b.getAttribute('data-size') === s)); }); }

    function pickTrash(g) {
      var id = g.getAttribute('data-trash');
      if (state.trash.indexOf(id) >= 0) return;
      g.classList.add('picked'); state.trash.push(id); undo.push({ t: 'trash', id: id }); S.play('good');
      setTimeout(function () { g.style.display = 'none'; g.classList.remove('picked'); }, 600);
      var total = $$('.trash', svg).length;
      if (state.trash.length >= total) {
        EC.toast('Cảm ơn bé đã nhặt rác giúp biển!');
        EC.reward({ once: 'trash-bien', leaves: 2, why: 'Nhặt rác giúp biển', sticker: 'giu-bien' });
      } else EC.toast('Nhặt được ' + state.trash.length + ' / ' + total + '. Còn nữa đấy!');
      persist();
    }
    function fillAt(target, h) {
      var i = target.getAttribute('data-i'), prev = state.fills[i] || null;
      if (prev === h) return;
      undo.push({ t: 'fill', i: i, prev: prev });
      if (h) state.fills[i] = h; else delete state.fills[i];
      paintRegion(target, h); S.play('pop'); persist(); changed();
    }
    svg.addEventListener('click', function (e) {
      if (mode !== 'fill') return;
      var tr = e.target.closest('.trash'); if (tr) { pickTrash(tr); return; }
      if (e.target.classList && e.target.classList.contains('f')) fillAt(e.target, hex);
    });

    /* Vẽ tay và tẩy */
    var cur = null;
    function pt(e) { var r = ink.getBoundingClientRect(); return [Math.round((e.clientX - r.left) / r.width * W), Math.round((e.clientY - r.top) / r.height * H)]; }
    ink.addEventListener('pointerdown', function (e) {
      if (mode === 'fill' || (e.button && e.button > 0)) return;
      e.preventDefault(); try { ink.setPointerCapture(e.pointerId); } catch (er) { /* bỏ qua */ }
      cur = { hex: hex, size: mode === 'erase' ? size * 1.6 : size, erase: mode === 'erase', pts: [pt(e)], sx: e.clientX, sy: e.clientY, moved: false };
      if (!cur.erase) drawStroke(lctx, cur);
    });
    ink.addEventListener('pointermove', function (e) {
      if (!cur) return;
      var p = pt(e), last = cur.pts[cur.pts.length - 1];
      if (Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]) < 3) return;
      if (Math.hypot(e.clientX - cur.sx, e.clientY - cur.sy) > 4) cur.moved = true;
      cur.pts.push(p);
      if (cur.erase) drawStroke(ictx, { erase: true, size: cur.size, pts: [last, p] });
      else { lctx.clearRect(0, 0, W, H); drawStroke(lctx, cur); }
    });
    function endStroke(e) {
      if (!cur) return;
      var s = cur; cur = null; lctx.clearRect(0, 0, W, H);
      if (s.erase && !s.moved) {
        /* chạm một cái bằng tẩy: xóa màu của vùng bên dưới */
        ink.style.pointerEvents = 'none';
        var el = document.elementFromPoint(e.clientX, e.clientY);
        ink.style.pointerEvents = 'auto';
        if (el && el.classList && el.classList.contains('f') && state.fills[el.getAttribute('data-i')]) fillAt(el, null);
        return;
      }
      var stroke = { hex: s.hex, size: s.size, erase: s.erase, pts: s.pts };
      state.strokes.push(stroke); undo.push({ t: 'stroke' });
      if (!s.erase) drawStroke(ictx, stroke);
      persist(); changed();
    }
    ink.addEventListener('pointerup', endStroke);
    ink.addEventListener('pointercancel', endStroke);

    /* Hoàn tác, xóa */
    act('undo').addEventListener('click', function () {
      var u = undo.pop(); if (!u) { EC.toast('Không còn gì để hoàn tác'); return; }
      if (u.t === 'fill') { if (u.prev) state.fills[u.i] = u.prev; else delete state.fills[u.i]; paintRegion(svg.querySelector('[data-i="' + u.i + '"]'), u.prev); }
      else if (u.t === 'stroke') { state.strokes.pop(); redraw(); }
      else if (u.t === 'trash') { state.trash.splice(state.trash.indexOf(u.id), 1); var g = svg.querySelector('[data-trash="' + u.id + '"]'); if (g) g.style.display = ''; }
      else if (u.t === 'clear') { state = u.prev; buildPage(); }
      persist(); changed();
    });
    var clearArm = null;
    act('clear').addEventListener('click', function () {
      var b = act('clear'), label = game ? 'Làm lại' : 'Xóa hết';
      if (!clearArm) { b.textContent = 'Bấm lần nữa để xóa'; clearArm = setTimeout(function () { clearArm = null; b.textContent = label; }, 3000); return; }
      clearTimeout(clearArm); clearArm = null; b.textContent = label;
      undo.push({ t: 'clear', prev: JSON.parse(JSON.stringify(state)) });
      state = { fills: {}, strokes: [], trash: [] }; buildPage(); persist(); EC.toast('Đã xóa. Bấm Hoàn tác để lấy lại.');
    });

    /* Ghép tranh (vùng tô + nét sáp) thành ảnh */
    function renderCanvas() {
      return new Promise(function (resolve, reject) {
        var page = curPage(), c = document.createElement('canvas'); c.width = W; c.height = H;
        var x = c.getContext('2d'); x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H);
        var src = new XMLSerializer().serializeToString(svg);
        if (src.indexOf('xmlns=') < 0) src = src.replace('<svg', '<svg xmlns="' + NS + '"');
        var img = new Image();
        img.onload = function () {
          x.drawImage(img, 0, 0, W, H);
          x.globalCompositeOperation = 'multiply'; x.drawImage(ink, 0, 0); x.globalCompositeOperation = 'source-over';
          x.font = '600 24px Mali, "Comic Sans MS", sans-serif'; x.fillStyle = '#5F574A';
          var who = EC.auth.profile().displayName;
          x.fillText('ECOCRAYON · ' + page.name + (who && !EC.auth.isGuest() ? ' · ' + who : ''), 22, H - 22);
          resolve(c);
        };
        img.onerror = function () { reject(new Error('svg')); };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
      });
    }
    function saveToCollection() {
      var page = curPage();
      return renderCanvas().then(function (c) {
        var t = document.createElement('canvas'); t.width = 320; t.height = 240; t.getContext('2d').drawImage(c, 0, 0, 320, 240);
        var rec = { id: EC.db.uid('art'), owner: EC.auth.pid(), title: page.name, pageId: page.id, createdAt: Date.now(),
          img: c.toDataURL('image/jpeg', 0.86), thumb: t.toDataURL('image/jpeg', 0.8), from: game ? 'hoa-si-nhi' : 'to-mau' };
        return EC.gallery.add(rec).then(function () { return rec; });
      });
    }

    if (game) {
      act('finish').addEventListener('click', function () {
        var sc = scoreNow(), b = act('finish');
        if (!sc.filled && !state.strokes.length) { EC.toast('Bé tô vài vùng trước đã nhé!'); return; }
        b.disabled = true; b.textContent = 'Đang lưu…';
        var done = function (rec) {
          finished = true; clearTimeout(saveTimer); EC.store.set(key(pageId), null);
          if (rec) EC.progress.award('hoa-si');
          if (opts.onFinish) opts.onFinish({ score: sc.score, saved: !!rec, title: rec ? rec.title : curPage().name });
        };
        saveToCollection().then(done, function () { done(null); });
      });
    } else {
      act('keep').addEventListener('click', function () {
        var b = act('keep'); b.disabled = true;
        saveToCollection().then(function () {
          EC.toast('Đã lưu vào Bộ sưu tập!');
          EC.reward({ once: 'save-' + pageId, leaves: 2, why: 'Lưu tranh ' + curPage().name, sticker: 'hoa-si' });
        }, function () { EC.toast('Không lưu được tranh trên trình duyệt này. Thử nút Tải ảnh nhé.'); }).then(function () { b.disabled = false; });
      });
      act('download').addEventListener('click', function () {
        renderCanvas().then(function (c) {
          try {
            c.toBlob(function (blob) {
              if (!blob) { EC.toast('Không tạo được ảnh. Thử lại nhé.'); return; }
              EC.download('ecocrayon-' + pageId + '.png', blob);
              EC.toast('Đã tải tranh vào thư mục Tải về');
            }, 'image/png');
          } catch (er) { EC.toast('Trình duyệt chặn lưu ảnh. Hãy mở trang qua máy chủ web (xem README).'); }
        }, function () { EC.toast('Không tạo được ảnh. Thử lại nhé.'); });
      });
      act('print').addEventListener('click', function () {
        var page = curPage();
        EC.printHTML('<div class="pr-page"><p class="pr-title">' + esc(page.name) + ' · ECOCRAYON</p><svg xmlns="' + NS + '" viewBox="0 0 800 600">' + A.pageInner(pageId) + '</svg>' +
          '<p style="font-size:10pt;color:#5F574A;margin-top:4mm">Tô bằng bút sáp ECOCRAYON. Gợi ý: ' + esc(page.story[0]) + '</p></div>');
      });
    }

    /* Kể chuyện từ bức tranh (trang Tô màu tự do) */
    var storyShown = false, tellKey = function () { return 'tell-' + (pid === 'guest' ? '' : pid + '-') + pageId; };
    function story() {
      var page = curPage(), done = EC.progress.isDone('story-' + pageId), box = $('.st-story', host);
      box.innerHTML = '<h3>Kể chuyện</h3><ol class="story-list">' + page.story.map(function (q) { return '<li>' + esc(q) + ' ' + EC.sayBtn(q) + '</li>'; }).join('') + '</ol>' +
        '<label class="sr" for="st-tell">Lời bé kể</label><textarea id="st-tell" placeholder="Ba mẹ ghi lại lời bé kể..."></textarea>' +
        '<button class="btn btn-sm c-den" type="button" id="st-told" style="margin-top:8px"' + (done ? ' disabled' : '') + '>' + (done ? 'Đã kể ✓' : 'Kể xong rồi!') + '</button>';
      $('#st-tell', box).value = EC.store.get(tellKey(), '');
      $('#st-tell', box).addEventListener('input', function (e) { EC.store.set(tellKey(), e.target.value.slice(0, 2000)); });
      $('#st-told', box).addEventListener('click', function () {
        EC.reward({ once: 'story-' + pageId, leaves: 1, why: 'Kể chuyện từ bức tranh', sticker: 'ke-chuyen' });
        story();
      });
    }
    function maybeStory() {
      if (storyShown) return;
      var n = Object.keys(state.fills).length, all = regions().length;
      if (n >= Math.min(12, all) || state.strokes.length >= 6) { storyShown = true; EC.toast('Tranh đẹp quá! Kể chuyện về tranh nhé.'); }
    }

    /* Đổi tranh */
    function openPage(id) {
      if (state) persistNow();
      pageId = id; EC.store.set(pfx + 'page', id); state = load(id); undo = []; storyShown = false;
      $$('.st-thumb', host).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-p') === id)); });
      buildPage();
      setMode(id === 'trang' ? 'draw' : 'fill');
    }
    $$('.st-thumb', host).forEach(function (b) { b.addEventListener('click', function () { openPage(b.getAttribute('data-p')); }); });
    $$('.tool', host).forEach(function (b) { b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); }); });
    $$('.swatch', host).forEach(function (b) { b.addEventListener('click', function () { setColor(+b.getAttribute('data-i')); S.play('pop'); }); });
    $$('.sizes button', host).forEach(function (b) { b.addEventListener('click', function () { setSize(+b.getAttribute('data-size')); }); });
    EC.onLeave(function () { clearTimeout(saveTimer); persistNow(); });

    setColor(1); setSize(20); openPage(pageId);
  };

  EC.route('to-mau', function (view) {
    view.innerHTML = '<section class="section"><div class="wrap">' +
      EC.head({ title: 'Tô màu tự do', lead: 'Tô vùng, vẽ bằng nét sáp, rồi lưu tranh vào Bộ sưu tập.', sc: '--c-nghe', side: '<a class="btn btn-sm btn-ghost" href="#bo-suu-tap">Bộ sưu tập</a>' }) +
      '<div id="studio-host"></div></div></section>';
    EC.mountStudio($('#studio-host', view), {});
  }, 'Tô màu');
})();
