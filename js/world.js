/* ECOCRAYON – Thế giới khám phá:
   bản đồ 4 vùng đất, trang vùng đất, bài học, khung trò chơi dùng chung,
   chấm điểm → sao → XP → huy hiệu, cấp độ, vật phẩm, danh hiệu cuối cùng. */
(function () {
  'use strict';
  var $ = EC.$, $$ = EC.$$, esc = EC.esc, A = EC.art, S = EC.sfx, V = EC.voice, P = EC.progress;

  /* ================= MẨU DÙNG CHUNG ================= */
  EC.isImgRef = function (r) { return /^(https?:\/\/|data:image\/|\.{0,2}\/|images\/)/.test(r) || /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i.test(r); };
  EC.safeHref = function (h) { h = String(h || ''); return /^(#|https?:\/\/)/.test(h) ? h : '#'; };
  EC.safeSrc = function (h) { h = String(h || ''); return /^(https?:\/\/|\.{0,2}\/|[a-z0-9_-]+\/)/i.test(h) && !/^javascript:/i.test(h) ? h : ''; };
  /* Một hình: id hình vẽ sẵn, nhân vật, hoặc đường dẫn ảnh (admin có thể dùng ảnh riêng) */
  EC.pic = function (ref, cls, label) {
    ref = String(ref || '');
    if (!ref) return '';
    if (EC.isImgRef(ref)) { var src = EC.safeSrc(ref); return src ? '<img class="pic ' + (cls || '') + '" src="' + esc(src) + '" alt="' + esc(label || '') + '" loading="lazy">' : ''; }
    if (A.isChar(ref)) return A.character(ref, 'happy', cls);
    return A.thing(ref, cls, label) || '';
  };
  EC.artName = function (ref) {
    var w = EC.WASTE.filter(function (x) { return x.id === ref; })[0];
    return EC.ART_NAMES[ref] || EC.NATURE[ref] || (w ? w.name : '');
  };
  EC.starsHTML = function (n, max) {
    max = max || 3; n = n || 0;
    var s = '<span class="stars" role="img" aria-label="' + n + ' trên ' + max + ' sao">';
    for (var i = 1; i <= max; i++) s += '<span class="st' + (i <= n ? ' on' : '') + '">' + A.star() + '</span>';
    return s + '</span>';
  };
  EC.avatarHTML = function (prof, size) {
    prof = prof || {}; var a = prof.avatar || 'besap';
    var inner = A.isChar(a) ? A.character(a, 'happy', '', true) : EC.pic(a);
    return '<span class="avatar' + (prof.frame ? ' f-' + esc(prof.frame) : '') + '" style="--av:' + (size || 48) + 'px"><span class="avatar-in">' + inner + '</span></span>';
  };
  EC.rewardArt = function (r) {
    if (r.kind === 'char') return '<span class="rw-art">' + A.character(r.art, 'happy', '', true) + '</span>';
    if (r.kind === 'frame') return '<span class="rw-art">' + EC.avatarHTML({ avatar: 'besap', frame: r.id }, 64) + '</span>';
    if (r.kind === 'theme') return '<span class="rw-art rw-theme pp-' + esc(r.id) + '">' + EC.pic(r.art) + '</span>';
    return '<span class="rw-art">' + EC.pic(r.art) + '</span>';
  };
  function notFound(view, msg) {
    view.innerHTML = '<section class="section"><div class="wrap stack">' + EC.mascotLine(msg || 'Không tìm thấy trang này.', 'think') +
      '<div class="row"><a class="btn" href="#kham-pha">Về bản đồ</a><a class="btn btn-ghost" href="#trang-chu">Trang chủ</a></div></div></section>';
  }
  EC.notFound = notFound;

  /* ================= ĐIỂM, SAO, CẤP ĐỘ, HUY HIỆU ================= */
  /* Quy tắc sao: dưới 50% → 1 sao, 50% đến dưới 80% → 2 sao, từ 80% → 3 sao (sửa được trong Quản trị) */
  EC.calcStars = function (pct) { var t = EC.content().settings.stars; return pct >= t[1] ? 3 : pct >= t[0] ? 2 : 1; };
  EC.levelOf = function (xp) {
    var L = EC.content().levels, idx = 0;
    L.forEach(function (l, i) { if (xp >= l.xp) idx = i; });
    var cur = L[idx], next = L[idx + 1];
    return { idx: idx, name: cur.name, cur: cur.xp, next: next ? next.xp : null, nextName: next ? next.name : '', pct: next ? Math.max(0, Math.min(100, Math.round((xp - cur.xp) / (next.xp - cur.xp) * 100))) : 100 };
  };
  EC.zoneStats = function (z, prog) {
    prog = prog || P.data;
    var S2 = EC.content().settings, games = EC.gamesOf(z), L = z.lessons || [];
    var lessonsDone = L.filter(function (l) { return prog.lessons[l.id]; }).length;
    var gamesDone = games.filter(function (g) { var r = prog.games[g.id]; return r && r.done; }).length;
    var ch = z.challenge ? prog.games[z.challenge.id] : null, chStars = ch ? ch.stars || 0 : 0;
    var chPassed = z.challenge ? !!(ch && chStars >= S2.badgeChallengeStars) : true;
    var stars = games.reduce(function (s, g) { var r = prog.games[g.id]; return s + (r ? r.stars || 0 : 0); }, 0) + chStars;
    var total = L.length + games.length + (z.challenge ? 1 : 0);
    var doneN = lessonsDone + gamesDone + (z.challenge && chPassed ? 1 : 0);
    var needGames = Math.min(S2.badgeGames, games.length);
    return {
      lessonsDone: lessonsDone, lessonsTotal: L.length, gamesDone: gamesDone, gamesTotal: games.length, needGames: needGames,
      chStars: chStars, chPlayed: !!ch, chPassed: chPassed, stars: stars, starsMax: (games.length + (z.challenge ? 1 : 0)) * 3,
      pct: total ? Math.round(doneN / total * 100) : 0, badgeReady: gamesDone >= needGames && chPassed,
      badge: !!prog.badges[z.id], visited: !!prog.visited[z.id]
    };
  };
  EC.totals = function (prog) {
    prog = prog || P.data;
    var zs = EC.zones(), t = { stars: 0, starsMax: 0, badges: 0, zones: zs.length, zonesDone: 0, lessons: 0, lessonsTotal: 0, games: 0, gamesTotal: 0, challenges: 0, challengesTotal: 0, xp: prog.xp };
    zs.forEach(function (z) {
      var s = EC.zoneStats(z, prog);
      t.stars += s.stars; t.starsMax += s.starsMax; t.badges += prog.badges[z.id] ? 1 : 0; t.zonesDone += s.pct >= 100 ? 1 : 0;
      t.lessons += s.lessonsDone; t.lessonsTotal += s.lessonsTotal; t.games += s.gamesDone; t.gamesTotal += s.gamesTotal;
      if (z.challenge) { t.challengesTotal++; if (s.chPassed) t.challenges++; }
    });
    return t;
  };
  EC.ruleOk = function (rule, prog) {
    prog = prog || P.data; rule = rule || { t: 'free' };
    switch (rule.t) {
      case 'free': return true;
      case 'stars': return EC.totals(prog).stars >= (+rule.n || 0);
      case 'xp': return prog.xp >= (+rule.n || 0);
      case 'level': return EC.levelOf(prog.xp).idx + 1 >= (+rule.n || 1);
      case 'badge': return !!prog.badges[rule.zone];
      case 'badges': return Object.keys(prog.badges).length >= (+rule.n || 1);
      case 'game': var r = prog.games[rule.id]; return !!(r && r.done && (r.stars || 0) >= (+rule.stars || 1));
      case 'title': return !!prog.title;
    }
    return false;
  };
  EC.ruleText = function (rule) {
    rule = rule || { t: 'free' };
    switch (rule.t) {
      case 'free': return 'Có sẵn';
      case 'stars': return 'Đạt ' + rule.n + ' sao';
      case 'xp': return 'Đạt ' + rule.n + ' XP';
      case 'level': return 'Lên cấp ' + rule.n;
      case 'badge': var z = EC.zoneById(rule.zone); return 'Nhận huy hiệu ' + (z ? z.badge.name : '');
      case 'badges': return 'Nhận ' + rule.n + ' huy hiệu';
      case 'game': var f = EC.gameById(rule.id); return 'Hoàn thành trò ' + (f ? f.game.title : rule.id) + ((+rule.stars || 1) > 1 ? ' đạt ' + rule.stars + ' sao' : '');
      case 'title': return 'Trở thành Nhà khám phá ECOCRAYON';
    }
    return '';
  };
  /* Kiểm tra mở khóa sau mỗi lần nhận điểm: huy hiệu vùng đất, danh hiệu, cấp độ, vật phẩm */
  EC.checkUnlocks = function () {
    var prog = P.data, changed = false, items = [], zs = EC.zones();
    zs.forEach(function (z) {
      if (!prog.badges[z.id] && EC.zoneStats(z, prog).badgeReady) { prog.badges[z.id] = Date.now(); changed = true; EC.queueAward({ badge: z.id }); }
    });
    if (!prog.title && zs.length && zs.every(function (z) { return prog.badges[z.id]; })) { prog.title = Date.now(); changed = true; EC.queueAward({ title: true }); }
    var lv = EC.levelOf(prog.xp).idx;
    if (lv > (prog.level || 0)) { prog.level = lv; changed = true; EC.queueAward({ level: lv }); }
    EC.content().rewards.forEach(function (r) {
      if (!prog.rewards[r.id] && EC.ruleOk(r.rule, prog)) { prog.rewards[r.id] = Date.now(); changed = true; if (r.rule.t !== 'free') items.push(r.id); }
    });
    if (items.length) EC.queueAward({ items: items });
    if (changed) P.save();
  };
  EC.addXP = function (n, why) { if (n > 0) { P.data.xp += n; P.save(); EC.pulsePill(); if (why) EC.toast('+' + n + ' XP · ' + why); } };

  /* ================= THẺ VÙNG ĐẤT (trang chủ, bản đồ) ================= */
  EC.zoneCard = function (z) {
    var s = EC.zoneStats(z), st = s.badge ? '✓ Hoàn thành' : s.pct > 0 ? 'Đang khám phá · ' + s.pct + '%' : 'Đã mở khóa';
    return '<article class="zonecard c-' + z.color + (s.badge ? ' is-done' : '') + '">' +
      '<div class="zc-top"><div class="zc-char">' + A.character(z.char, 'happy') + '</div>' +
        '<div class="stack zc-head"><span class="chip zc-status">' + st + '</span><h3>' + esc(z.name) + '</h3><p class="zc-place">' + esc(z.place) + ' · ' + esc(z.charName) + '</p></div></div>' +
      '<p class="zc-short">' + esc(z.short) + '</p>' +
      '<div><p class="zc-label">Bé sẽ khám phá:</p><ul class="zc-learn">' + (z.learn || []).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="meter" role="progressbar" aria-label="Tiến độ ' + esc(z.name) + '" aria-valuenow="' + s.pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + s.pct + '%"></span></div>' +
      '<div class="zc-foot"><span class="zc-stars">' + A.star() + s.stars + '/' + s.starsMax + '</span>' + (s.badge ? '<span class="zc-medal" title="' + esc(z.badge.name) + '">' + A.medal(z.badge.icon, 'var(--t-' + z.color + ')', true) + '</span>' : '') +
        '<a class="btn" href="#vung/' + z.id + '">Khám phá ngay</a></div>' +
      '</article>';
  };

  /* ================= KÉO – THẢ (chuột, ngón tay; chạm để chọn cũng được) ================= */
  EC.dragSource = function (el, o) {
    var d = null;
    el.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || (o.canDrag && !o.canDrag(el))) return;
      d = { x: e.clientX, y: e.clientY, moved: false, ghost: null };
      try { el.setPointerCapture(e.pointerId); } catch (er) { /* bỏ qua */ }
    });
    el.addEventListener('pointermove', function (e) {
      if (!d) return;
      if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8) {
        d.moved = true;
        var r = el.getBoundingClientRect(), gh = el.cloneNode(true);
        gh.classList.add('drag-ghost'); gh.removeAttribute('id'); gh.style.width = r.width + 'px'; gh.style.height = r.height + 'px';
        document.body.appendChild(gh); d.ghost = gh; d.dx = e.clientX - r.left; d.dy = e.clientY - r.top; el.classList.add('drag-src');
      }
      if (d.moved) {
        d.ghost.style.left = (e.clientX - d.dx) + 'px'; d.ghost.style.top = (e.clientY - d.dy) + 'px';
        $$('.drop-hover').forEach(function (t) { t.classList.remove('drop-hover'); });
        var t = targetAt(e); if (t) t.classList.add('drop-hover');
      }
    });
    function targetAt(e) { var h = document.elementFromPoint(e.clientX, e.clientY); return h && h.closest ? h.closest(o.targetSel) : null; }
    function end(e, cancel) {
      if (!d) return;
      var dd = d; d = null;
      $$('.drop-hover').forEach(function (t) { t.classList.remove('drop-hover'); });
      el.classList.remove('drag-src');
      if (dd.moved) {
        dd.ghost.remove();
        var t = cancel ? null : targetAt(e);
        if (t && o.onDrop) o.onDrop(el, t);
        el.dataset.skipClick = '1';
      } else if (!cancel) { el.dataset.skipClick = '1'; if (o.onTap) o.onTap(el); }
    }
    el.addEventListener('pointerup', function (e) { end(e, false); });
    el.addEventListener('pointercancel', function (e) { end(e, true); });
    el.addEventListener('click', function () {
      if (el.dataset.skipClick) { delete el.dataset.skipClick; return; }
      if (o.onTap) o.onTap(el);   /* bàn phím: Enter/Space */
    });
  };
  EC.flash = function (el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  /* ================= BẢN ĐỒ KHÁM PHÁ ================= */
  EC.route('kham-pha', function (view) {
    var prog = P.data, T = EC.totals(), prof = EC.auth.profile(), lv = EC.levelOf(prog.xp), decos = {};
    EC.content().rewards.forEach(function (r) { if (r.kind === 'deco' && prog.rewards[r.id]) decos[r.id] = true; });
    var mz = EC.zones().map(function (z) {
      var s = EC.zoneStats(z);
      return { id: z.id, name: z.name, href: '#vung/' + z.id, sub: s.badge ? 'Đã hoàn thành · ' + s.stars + '/' + s.starsMax + ' sao' : s.stars + '/' + s.starsMax + ' sao · ' + s.pct + '%', done: s.badge, fresh: !s.visited };
    });
    view.innerHTML = '<section class="section-tight"><div class="wrap stack" style="gap:18px">' +
      '<a class="back" href="#trang-chu">‹ Trang chủ</a>' +
      EC.head({ title: 'Bản đồ khám phá', lead: 'Chọn vùng đất bé thích. Vùng nào cũng mở sẵn, không cần đi theo thứ tự!', sc: '--c-dau-biec' }) +
      '<div class="mapbar sheet">' + EC.avatarHTML(prof, 52) +
        '<div class="stack mapbar-name"><b>' + esc(prof.displayName) + '</b><span class="small muted">Cấp ' + (lv.idx + 1) + ' · ' + esc(lv.name) + '</span></div>' +
        '<div class="mapstats"><span>' + A.star() + '<b>' + T.stars + '</b>/' + T.starsMax + ' sao</span><span><b>' + T.badges + '</b>/' + T.zones + ' huy hiệu</span><span><b>' + T.xp + '</b> XP</span></div>' +
        (EC.auth.isGuest() ? '<a class="btn btn-sm" href="#dang-ky">Tạo hồ sơ</a>' : '<a class="btn btn-sm btn-ghost" href="#ho-chieu">Hộ chiếu</a>') +
      '</div>' +
      '<div class="mapwrap">' + A.worldMap({ zones: mz, decos: decos }) + '</div>' +
      '<div class="zonecards">' + EC.zones().map(EC.zoneCard).join('') + '</div>' +
      '<div class="row map-more"><a class="btn btn-ghost btn-sm" href="#tro-choi">Tất cả trò chơi</a><a class="btn btn-ghost btn-sm" href="#vuon-mau">6 bạn màu sáp</a><a class="btn btn-ghost btn-sm" href="#to-mau">Tô màu tự do</a><a class="btn btn-ghost btn-sm" href="#thu-thach">Thử thách xanh ở nhà</a></div>' +
      '</div></section>';
    $$('.mz', view).forEach(function (a) { a.addEventListener('mouseenter', function () { S.play('pop'); }); });
  }, 'Bản đồ khám phá');

  /* ================= TRANG VÙNG ĐẤT ================= */
  function lessonThumb(l) {
    if (l.img) return EC.pic(l.img, '', l.title);
    if (Array.isArray(l.vis)) return EC.pic(l.vis[0]);
    if (A.hasVis(l.vis)) return A.lessonVis(l.vis);
    return A.thing('b-story');
  }
  function showUnlock(z) {
    var fx = document.createElement('div');
    fx.className = 'unlock-fx c-' + z.color; fx.setAttribute('role', 'status');
    fx.innerHTML = '<div class="unlock-door l"></div><div class="unlock-door r"></div><div class="unlock-card">' + A.character(z.char, 'wow') +
      '<p class="eyebrow">Mở khóa vùng đất</p><h2>' + esc(z.name) + '</h2></div>';
    document.body.appendChild(fx); S.play('win');
    var gone = function () { if (fx.parentNode) fx.remove(); };
    fx.addEventListener('click', gone); setTimeout(gone, 2600); EC.onLeave(gone);
  }
  EC.route('vung/', function (view, name, zid) {
    var z = EC.zoneById(zid);
    if (!z || z.hidden) { notFound(view, 'Không tìm thấy vùng đất này.'); return; }
    EC.stats.zone(z.id);
    var prog = P.data, S2 = EC.content().settings, first = !prog.visited[z.id];
    if (first) { prog.visited[z.id] = Date.now(); P.save(); }
    var s = EC.zoneStats(z), games = EC.gamesOf(z), ch = z.challenge, chr = ch ? prog.games[ch.id] : null;
    var others = EC.zones().filter(function (x) { return x.id !== z.id; });
    view.innerHTML =
      '<div class="zband c-' + z.color + '"><div class="wrap zband-in">' +
        '<div class="stack zband-copy"><a class="back" href="#kham-pha">‹ Bản đồ</a>' +
          '<p class="eyebrow">Vùng đất · ' + esc(z.place) + '</p><h1 class="h1">' + esc(z.name) + '</h1><p class="lead">' + esc(z.short) + '</p>' +
          '<div class="row zband-stats"><span class="chip">' + (s.badge ? '✓ Đã hoàn thành' : s.pct + '% đã khám phá') + '</span><span class="chip">' + A.star() + s.stars + '/' + s.starsMax + ' sao</span></div>' +
          '<div class="meter" role="progressbar" aria-label="Tiến độ vùng đất" aria-valuenow="' + s.pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + s.pct + '%"></span></div>' +
        '</div>' +
        '<div class="zband-guide">' + EC.mascotLine(z.hello, 'happy', 'z-guide', z.char) + '<p class="zchar-name"><b>' + esc(z.charName) + '</b> · ' + esc(z.charRole) + '</p></div>' +
      '</div></div>' +

      '<section class="section-tight c-' + z.color + '"><div class="wrap"><div class="storybook sheet">' +
        '<div class="sec-head" style="margin:0 0 10px"><h2 class="h3">Câu chuyện</h2>' + EC.sayBtn((z.story || []).join(' ')) + '</div>' +
        '<ol class="story-panels">' + (z.story || []).map(function (t, i) { return '<li><span class="sp-n">' + (i + 1) + '</span><p>' + esc(t) + '</p></li>'; }).join('') + '</ol>' +
      '</div></div></section>' +

      '<section class="section-tight c-' + z.color + '"><div class="wrap">' +
        EC.head({ title: 'Khám phá kiến thức', lead: 'Những bài học ngắn có hình, có tiếng đọc và một câu hỏi nhỏ.', sc: '--c', side: '<span class="score">' + s.lessonsDone + '/' + s.lessonsTotal + ' bài</span>' }) +
        '<div class="lessoncards">' + (z.lessons || []).map(function (l, i) {
          var seen = !!prog.lessons[l.id];
          return '<a class="lessoncard' + (seen ? ' seen' : '') + '" href="#bai-hoc/' + l.id + '"><span class="lc-n">' + (i + 1) + '</span><span class="lc-art">' + lessonThumb(l) + '</span><b>' + esc(l.title) + '</b><span class="lc-seen' + (seen ? '' : ' new') + '">' + (seen ? '✓ Đã xem' : 'Chưa xem') + '</span></a>';
        }).join('') + '</div>' +
      '</div></section>' +

      '<section class="section-tight c-' + z.color + '"><div class="wrap">' +
        EC.head({ title: 'Trò chơi', lead: 'Mỗi trò chơi ngắn, không tính giờ. Chơi lại để đạt 3 sao!', sc: '--c', side: '<span class="score">' + s.gamesDone + '/' + s.gamesTotal + ' trò</span>' }) +
        '<div class="gamecards">' + games.map(function (g, i) {
          var r = prog.games[g.id];
          return '<a class="gamecard c-' + z.color + '" href="#choi/' + g.id + '"><div class="gc-art">' + EC.pic(g.icon || 'b-quiz') + '</div><div style="min-width:0"><p class="eyebrow">Trò chơi ' + (i + 1) + '</p><h3>' + esc(g.title) + '</h3><p>' + esc(g.desc) + '</p>' +
            '<div class="row gc-meta">' + EC.starsHTML(r ? r.stars : 0) + '<span class="small muted">' + (r ? 'Kỷ lục ' + r.best + '/' + r.max + ' điểm' : 'Chưa chơi') + '</span></div></div></a>';
        }).join('') + '</div>' +
      '</div></section>' +

      (ch ? '<section class="section-tight c-' + z.color + '"><div class="wrap"><div class="challenge sheet">' +
        '<div class="ch-ico">' + A.thing('b-star') + '</div>' +
        '<div class="stack ch-copy"><p class="eyebrow">Thử thách tổng kết</p><h2 class="h3">' + esc(ch.title) + '</h2><p>' + esc(ch.desc) + ' ' + (ch.count || 10) + ' câu hỏi. Đạt từ ' + S2.stars[0] + '% để vượt qua.</p>' +
          '<div class="row">' + EC.starsHTML(chr ? chr.stars : 0) + (chr ? (s.chPassed ? '<span class="chip chip-done">Đã vượt qua</span>' : '<span class="chip">Chưa vượt qua</span>') : '') + '</div></div>' +
        '<a class="btn btn-big" href="#choi/' + ch.id + '">' + (chr ? 'Làm lại' : 'Bắt đầu') + '</a>' +
      '</div></div></section>' : '') +

      '<section class="section c-' + z.color + '"><div class="wrap"><div class="zreward sheet">' +
        '<div class="zr-medal">' + A.medal(z.badge.icon, 'var(--t-' + z.color + ')', s.badge, 'Huy hiệu ' + z.badge.name + (s.badge ? ', đã nhận' : ', chưa mở khóa')) + '</div>' +
        '<div class="stack" style="gap:8px;min-width:0"><p class="eyebrow">Phần thưởng của vùng đất</p><h2 class="h3">Huy hiệu ' + esc(z.badge.name) + '</h2>' +
          '<ul class="checklist">' +
            '<li class="' + (s.gamesDone >= s.needGames ? 'ok' : '') + '">Hoàn thành ' + s.needGames + ' trò chơi (' + Math.min(s.gamesDone, s.needGames) + '/' + s.needGames + ')</li>' +
            (ch ? '<li class="' + (s.chPassed ? 'ok' : '') + '">Vượt qua thử thách tổng kết (từ ' + S2.badgeChallengeStars + ' sao)</li>' : '') +
            '<li class="' + (s.lessonsDone >= s.lessonsTotal ? 'ok' : '') + ' opt">Xem hết bài học – không bắt buộc (' + s.lessonsDone + '/' + s.lessonsTotal + ')</li>' +
          '</ul>' +
          '<p class="small muted">Mỗi lần chơi bé nhận điểm kinh nghiệm (XP) và sao. Huy hiệu được ghi vào Hộ chiếu khám phá.</p>' +
          (s.badge ? '<a class="btn btn-sm btn-ghost" href="#ho-chieu" style="align-self:flex-start">Xem trong hộ chiếu</a>' : '') +
        '</div></div>' +
        (others.length ? '<nav class="row other-zones" aria-label="Vùng đất khác"><span class="small muted">Vùng đất khác:</span>' + others.map(function (o) { return '<a class="chip c-' + o.color + '" href="#vung/' + o.id + '">' + esc(o.name) + '</a>'; }).join('') + '</nav>' : '') +
      '</div></section>';
    if (first) showUnlock(z);
    V.autoSay(z.hello);
  }, function (n, zid) { var z = EC.zoneById(zid); return z ? z.name : 'Vùng đất'; });

  /* ================= BÀI HỌC ================= */
  EC.route('bai-hoc/', function (view, name, lid) {
    var f = EC.lessonById(lid);
    if (!f) { notFound(view, 'Không tìm thấy bài học này.'); return; }
    var z = f.zone, l = f.lesson, L = z.lessons, i = f.idx, prog = P.data, S2 = EC.content().settings;
    EC.stats.lesson(l.id);
    var firstView = !prog.lessons[l.id];
    if (firstView) { prog.lessons[l.id] = Date.now(); P.save(); }
    var vis = l.img ? EC.pic(l.img, 'lesson-img', l.title)
      : Array.isArray(l.vis) ? '<div class="lvis-row">' + l.vis.map(function (v) { return '<span>' + EC.pic(v, '', EC.artName(v)) + '</span>'; }).join('') + '</div>'
      : A.hasVis(l.vis) ? A.lessonVis(l.vis) : '';
    var prev = L[i - 1], next = L[i + 1], audio = l.audio ? EC.safeSrc(l.audio) : '';
    view.innerHTML = '<section class="section c-' + z.color + '"><div class="wrap lesson-wrap stack" style="gap:18px">' +
      '<nav class="crumbs" aria-label="Đường dẫn"><a href="#kham-pha">Bản đồ</a><span>›</span><a href="#vung/' + z.id + '">' + esc(z.name) + '</a><span>›</span><span>Bài ' + (i + 1) + '</span></nav>' +
      '<article class="lessonpage sheet">' +
        '<div class="row lp-head"><span class="chip">Bài ' + (i + 1) + '/' + L.length + '</span>' + (firstView ? '<span class="chip chip-xp">+' + S2.xpLesson + ' XP</span>' : '<span class="chip chip-done">✓ Đã xem</span>') + '</div>' +
        '<h1 class="h2">' + esc(l.title) + '</h1>' +
        (vis ? '<div class="lp-vis">' + vis + '</div>' : '') +
        '<div class="lp-text"><p>' + esc(l.text) + '</p>' + EC.sayBtn(l.title + '. ' + l.text) + '</div>' +
        (audio ? '<audio class="lp-audio" controls preload="none" src="' + esc(audio) + '"></audio>' : '') +
        (l.link ? '<a class="btn btn-sm btn-ghost" href="' + esc(EC.safeHref(l.link.href)) + '" style="align-self:flex-start">' + esc(l.link.label) + ' ›</a>' : '') +
        (l.quiz ? '<div class="lp-quiz" id="lp-quiz"></div>' : '') +
      '</article>' +
      EC.mascotLine(l.quiz ? 'Đọc xong rồi trả lời câu hỏi nhỏ nhé!' : 'Bé đọc xong rồi! Sang bài tiếp theo nào.', 'happy', 'lp-guide', z.char) +
      '<div class="prevnext">' + (prev ? '<a class="btn btn-ghost btn-sm" href="#bai-hoc/' + prev.id + '">‹ ' + esc(prev.title) + '</a>' : '<span></span>') +
        (next ? '<a class="btn btn-sm" href="#bai-hoc/' + next.id + '">' + esc(next.title) + ' ›</a>' : '<a class="btn btn-sm" href="#vung/' + z.id + '">Chơi trò chơi ›</a>') + '</div>' +
      '</div></section>';
    if (firstView) { EC.addXP(S2.xpLesson, 'Bài học mới'); EC.checkUnlocks(); }
    if (l.quiz) lessonQuiz($('#lp-quiz', view), l, z, S2);
  }, function (n, lid) { var f = EC.lessonById(lid); return f ? f.lesson.title : 'Bài học'; });

  function lessonQuiz(box, l, z, S2) {
    var q = l.quiz, opts = EC.shuffle((q.a || []).map(function (t, k) { return { t: t, ok: k === (q.ok || 0) }; }));
    box.innerHTML = '<p class="eyebrow">Câu hỏi nhỏ</p><p class="qtext"><span>' + esc(q.q) + '</span>' + EC.sayBtn(q.q) + '</p>' +
      '<div class="qopts">' + opts.map(function (o, k) { return '<button class="btn qopt" type="button" data-k="' + k + '"><span class="k">' + 'ABCD'[k] + '</span><span>' + esc(o.t) + '</span></button>'; }).join('') + '</div>' +
      '<div class="qexp" aria-live="polite"></div>';
    $$('.qopt', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var k = +b.getAttribute('data-k'), ok = opts[k].ok, guide = $('#lp-guide');
        if (ok) {
          $$('.qopt', box).forEach(function (x, n) { x.disabled = true; if (opts[n].ok) x.classList.add('right'); });
          S.play('good'); EC.setBubble(guide, 'Đúng rồi! ' + (q.ex || ''), 'wow');
          $('.qexp', box).innerHTML = '<p class="note">' + esc(q.ex || 'Chính xác!') + '</p>';
          var prog = P.data;
          if (!prog.quiz[l.id]) { prog.quiz[l.id] = Date.now(); P.save(); EC.addXP(S2.xpLessonQuiz, 'Trả lời đúng'); EC.checkUnlocks(); }
        } else {
          b.disabled = true; b.classList.add('wrong'); S.play('bad');
          EC.setBubble(guide, 'Chưa đúng. Đọc lại bài rồi thử đáp án khác nhé!', 'think');
        }
      });
    });
  }

  /* ================= KHUNG TRÒ CHƠI DÙNG CHUNG ================= */
  var TYPES = {};
  EC.gameType = function (type, fn) { TYPES[type] = fn; };
  EC.GAME_TYPE_NAMES = {
    rescue: 'Chọn màu (Giải cứu màu sắc)', hide: 'Tìm theo gợi ý', match: 'Ghép đôi', mixlab: 'Pha màu (kéo thả)', hunt: 'Tìm kiếm theo màu',
    paint: 'Tô màu', sort: 'Kéo thả phân loại', invent: 'Sáng tạo (kết hợp vật liệu)', tf: 'Đúng / Sai', ocean: 'Nhặt rác – giải cứu',
    forest: 'Xây dựng (sắp xếp)', hero: 'Tình huống', quiz: 'Trắc nghiệm'
  };
  EC.QUESTION_TYPES = ['tf', 'hero', 'quiz'];

  EC.route('choi/', function (view, name, gid) {
    var f = EC.gameById(gid);
    if (!f || (f.game.enabled === false) || f.zone.hidden) { notFound(view, 'Trò chơi này chưa mở. Bé chọn trò khác nhé!'); return; }
    var z = f.zone, game = f.game, impl = TYPES[game.type], rec = P.data.games[game.id];
    if (!impl) { notFound(view, 'Trò chơi này chưa sẵn sàng.'); return; }
    EC.stats.start(game.id);
    view.innerHTML =
      '<div class="gameband c-' + z.color + '"><div class="wrap gameband-in">' +
        '<a class="back" href="#vung/' + z.id + '">‹ ' + esc(z.name) + '</a>' +
        '<div class="row" style="justify-content:space-between;align-items:flex-end;gap:10px"><div class="stack" style="gap:4px;min-width:0">' +
          '<p class="eyebrow">' + (f.isChallenge ? 'Thử thách tổng kết' : 'Trò chơi') + '</p><h1 class="h2">' + esc(game.title) + '</h1></div>' +
          (rec ? '<span class="chip">Tốt nhất ' + EC.starsHTML(rec.stars) + '</span>' : '') + '</div>' +
        '<p class="gameband-desc">' + esc(game.desc) + '</p>' +
      '</div></div>' +
      '<section class="section-tight c-' + z.color + '"><div class="wrap gshell">' +
        '<div class="gtop"><div class="gbar" role="progressbar" aria-label="Tiến trình trò chơi" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><span class="score gscore" id="g-score" aria-live="polite">0 điểm</span></div>' +
        EC.mascotLine(game.desc, 'happy', 'g-guide', z.char) +
        '<div class="gstage" id="gstage"></div>' +
      '</div></section>';
    var api = makeApi(view, z, game, f.isChallenge);
    try { impl(api.stage, game, api); }
    catch (e) { api.stage.innerHTML = '<p class="note note-safe">Trò chơi gặp lỗi dữ liệu. Thầy cô kiểm tra lại nội dung trò này trong trang Quản trị nhé.</p>'; if (window.console) console.error(e); }
  }, function (n, gid) { var f = EC.gameById(gid); return f ? f.game.title : 'Trò chơi'; });

  function makeApi(view, z, game, isCh) {
    var score = 0, max = 0, over = false, t0 = Date.now();
    var guide = $('#g-guide', view), bar = $('.gbar', view), scoreEl = $('#g-score', view);
    function paint() { scoreEl.textContent = score + (max ? ' / ' + max : '') + ' điểm'; }
    var api = {
      stage: $('#gstage', view), zone: z, game: game, isChallenge: isCh, pts: +game.pts || 10,
      setMax: function (m) { max = Math.max(0, Math.round(m)); paint(); },
      add: function (n) { score = Math.max(0, score + Math.round(n)); paint(); if (n > 0) EC.flash(scoreEl, 'bump'); },
      score: function () { return score; },
      progress: function (d, t) { var p = t ? Math.round(Math.min(1, d / t) * 100) : 0; bar.firstChild.style.width = p + '%'; bar.setAttribute('aria-valuenow', p); },
      say: function (text, mood) { EC.setBubble(guide, text, mood || 'happy'); },
      good: function (text, el) { S.play('good'); api.say(text, 'wow'); if (el) EC.flash(el, 'fx-good'); },
      bad: function (text, el) { S.play('bad'); api.say(text, 'think'); if (el) EC.flash(el, 'fx-bad'); },
      onLeave: EC.onLeave,
      finish: function (opt) { if (over) return; over = true; api.progress(1, 1); finishGame(api, score, max, Date.now() - t0, opt || {}); },
      restart: function () { EC.go('choi/' + game.id); }
    };
    paint();
    return api;
  }

  function nextGameOf(z, game) {
    var list = EC.gamesOf(z).concat(z.challenge ? [z.challenge] : []), i = list.indexOf(game);
    var prog = P.data;
    for (var k = 1; k <= list.length; k++) { var g = list[(i + k) % list.length]; if (g !== game && !(prog.games[g.id] && prog.games[g.id].done)) return g; }
    return i >= 0 && i < list.length - 1 ? list[i + 1] : null;
  }

  function finishGame(api, score, max, dur, opt) {
    var game = api.game, z = api.zone, prog = P.data, S2 = EC.content().settings;
    max = Math.max(1, max); score = Math.max(0, Math.min(score, max));
    var pct = Math.round(score / max * 100), stars = EC.calcStars(pct);
    var rec = prog.games[game.id] || { best: 0, stars: 0, plays: 0, done: false };
    var prevBest = rec.best || 0, prevStars = rec.stars || 0, firstTime = !rec.plays;
    var xp = Math.max(0, score - prevBest) + ((rec.plays || 0) < S2.xpPlayLimit ? S2.xpPlay : 0);
    rec.plays = (rec.plays || 0) + 1; rec.best = Math.max(prevBest, score); rec.max = max; rec.stars = Math.max(prevStars, stars);
    rec.done = true; rec.lastAt = Date.now(); rec.lastScore = score; rec.lastStars = stars;
    prog.games[game.id] = rec; prog.xp += xp;
    EC.db.addAttempt({ id: EC.db.uid('a'), playerId: EC.auth.pid(), gameId: game.id, zoneId: z.id, score: score, max: max, pct: pct, stars: stars, dur: Math.round(dur / 1000), at: Date.now() });
    P.save(); EC.pulsePill();
    S.play('win'); if (stars === 3) EC.confetti();
    var msg = stars === 3 ? 'Tuyệt vời! Bé đạt 3 sao!' : stars === 2 ? 'Giỏi lắm! Chơi lại để lấy đủ 3 sao nhé!' : 'Bé đã hoàn thành rồi! Thử lại, lần sau sẽ giỏi hơn!';
    if (api.isChallenge) msg = stars >= S2.badgeChallengeStars ? 'Bé đã vượt qua thử thách tổng kết!' : 'Cần đạt từ ' + S2.stars[0] + '% để vượt qua. Ôn lại bài học rồi thử lại nhé!';
    api.say(msg, stars >= 2 ? 'wow' : 'happy'); V.autoSay(msg);
    var next = nextGameOf(z, game), newBest = !firstTime && score > prevBest;
    api.stage.innerHTML = '<div class="result sheet" role="region" aria-label="Kết quả">' +
      '<div class="result-stars" role="img" aria-label="Đạt ' + stars + ' trên 3 sao">' + [1, 2, 3].map(function (i) { return '<span class="rstar' + (i <= stars ? ' on' : '') + '" style="--d:' + i + '">' + A.star() + '</span>'; }).join('') + '</div>' +
      '<h2 class="h2">' + (stars === 3 ? 'Xuất sắc!' : stars === 2 ? 'Hoàn thành tốt!' : 'Hoàn thành!') + '</h2>' +
      '<p class="result-score"><b>' + score + '</b> / ' + max + ' điểm · ' + pct + '%</p>' +
      '<div class="row result-chips">' + (xp > 0 ? '<span class="chip chip-xp">+' + xp + ' XP</span>' : '') +
        (newBest ? '<span class="chip chip-best">Kỷ lục mới!</span>' : '') +
        (prevStars > stars ? '<span class="chip">Tốt nhất: ' + prevStars + ' sao</span>' : '') + '</div>' +
      (opt.extraHTML || '') +
      '<table class="star-rule"><tr><td>' + EC.starsHTML(1) + '</td><td>dưới ' + S2.stars[0] + '%</td></tr><tr><td>' + EC.starsHTML(2) + '</td><td>từ ' + S2.stars[0] + '% đến dưới ' + S2.stars[1] + '%</td></tr><tr><td>' + EC.starsHTML(3) + '</td><td>từ ' + S2.stars[1] + '% trở lên</td></tr></table>' +
      '<div class="row result-actions"><button class="btn" type="button" id="r-again">Chơi lại</button>' +
        (next ? '<a class="btn c-' + z.color + '" href="#choi/' + next.id + '">' + esc(next.title) + ' ›</a>' : '') +
        '<a class="btn btn-ghost" href="#vung/' + z.id + '">Về ' + esc(z.name) + '</a></div>' +
      '</div>';
    $('#r-again', api.stage).addEventListener('click', api.restart);
    try { api.stage.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { /* bỏ qua */ }
    EC.checkUnlocks();
  }
})();
