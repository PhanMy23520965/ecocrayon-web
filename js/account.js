/* ECOCRAYON – tài khoản và thành tích của bé:
   đăng nhập, đăng ký (có phụ huynh đồng ý), hồ sơ người chơi, hộ chiếu khám phá, chứng nhận, bộ sưu tập. */
(function () {
  'use strict';
  var $ = EC.$, $$ = EC.$$, esc = EC.esc, A = EC.art, S = EC.sfx, P = EC.progress;

  function field(label, input, hint) { return '<label class="field"><span class="f-lbl">' + label + '</span>' + input + (hint ? '<span class="f-hint">' + hint + '</span>' : '') + '</label>'; }
  function pwInput(id, auto) { return '<span class="pw"><input id="' + id + '" type="password" autocomplete="' + auto + '" minlength="4" maxlength="40"><button class="pw-eye" type="button" aria-label="Hiện mật khẩu">Hiện</button></span>'; }
  function bindEyes(root) {
    $$('.pw-eye', root).forEach(function (b) {
      b.addEventListener('click', function () { var i = b.previousElementSibling, show = i.type === 'password'; i.type = show ? 'text' : 'password'; b.textContent = show ? 'Ẩn' : 'Hiện'; b.setAttribute('aria-label', show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'); });
    });
  }
  function ownedChars(prog) {
    return EC.content().rewards.filter(function (r) { return r.kind === 'char' && prog.rewards[r.id]; }).map(function (r) { return { id: r.art, name: r.name.replace(/^Nhân vật /, '') }; });
  }
  function avatarPicker(id, cur, list, locked) {
    return '<div class="avpick" id="' + id + '" role="radiogroup" aria-label="Ảnh đại diện">' + list.map(function (a) {
      return '<button type="button" role="radio" class="avopt" data-av="' + esc(a.id) + '" aria-checked="' + (a.id === cur) + '" title="' + esc(a.name) + '">' + EC.avatarHTML({ avatar: a.id }, 56) + '<span>' + esc(a.name) + '</span></button>';
    }).join('') + (locked || []).map(function (a) {
      return '<span class="avopt locked" title="' + esc(a.how) + '">' + EC.avatarHTML({ avatar: a.id }, 56) + '<span>' + esc(a.name) + '</span></span>';
    }).join('') + '</div>';
  }
  function bindPicker(root, sel, attr) {
    $$(sel + ' [role="radio"]', root).forEach(function (b) {
      b.addEventListener('click', function () { $$(sel + ' [role="radio"]', root).forEach(function (x) { x.setAttribute('aria-checked', String(x === b)); }); S.play('pop'); });
    });
    return function () { var on = $(sel + ' [aria-checked="true"]', root); return on ? on.getAttribute(attr) : ''; };
  }
  function guestGate(title, text) {
    var T = EC.totals();
    return '<section class="section"><div class="wrap"><div class="sheet gate">' + A.thing('i-passport') +
      '<h1 class="h2">' + title + '</h1><p class="lead">' + text + '</p>' +
      (T.stars || T.xp ? '<p class="note">Bé đang có ' + T.stars + ' sao và ' + T.xp + ' XP khi chơi thử. Tạo hồ sơ ngay để giữ lại nhé!</p>' : '') +
      '<div class="row"><a class="btn btn-big" href="#dang-ky">Tạo hồ sơ</a><a class="btn btn-big btn-ghost" href="#dang-nhap">Đăng nhập</a></div>' +
      '<p class="small"><a href="#huong-dan">Xem hướng dẫn tạo hồ sơ</a></p></div></div></section>';
  }

  /* ================= ĐĂNG NHẬP ================= */
  EC.route('dang-nhap', function (view) {
    if (!EC.auth.isGuest()) { location.replace('#ho-so'); return; }
    var U = EC.db.users(), Pf = EC.db.profiles();
    var here = Object.keys(U).map(function (k) { return { u: U[k], p: Pf[k] || {} }; }).filter(function (x) { return !x.u.locked; })
      .sort(function (a, b) { return (b.u.lastLogin || 0) - (a.u.lastLogin || 0); }).slice(0, 12);
    view.innerHTML = '<section class="section"><div class="wrap auth-wrap"><div class="sheet auth-card stack" style="gap:18px">' +
      '<h1 class="h2">Đăng nhập</h1>' +
      EC.mascotLine('Chào bé! Đăng nhập để tiếp tục hành trình nhé!', 'happy', 'auth-m') +
      (here.length ? '<div><p class="eyebrow">Hồ sơ trên máy này – chạm để chọn</p><div class="who-list">' + here.map(function (x) {
        return '<button class="who" type="button" data-user="' + esc(x.u.username) + '">' + EC.avatarHTML(x.p, 56) + '<span>' + esc(x.p.displayName || x.u.username) + '</span></button>';
      }).join('') + '</div></div>' : '') +
      '<form class="form stack" id="login" novalidate>' +
        field('Tên đăng nhập', '<input id="l-user" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20">') +
        field('Mật khẩu', pwInput('l-pass', 'current-password')) +
        '<label class="check"><input type="checkbox" id="l-remember"> Ghi nhớ đăng nhập trên máy này (30 ngày)</label>' +
        '<p class="form-msg" id="l-msg" role="alert"></p>' +
        '<div class="row"><button class="btn btn-big" type="submit">Đăng nhập</button><a class="btn btn-ghost" href="#dang-ky">Tạo hồ sơ mới</a></div>' +
      '</form>' +
      '<p class="small muted">Máy dùng chung (lớp học, thư viện): không chọn “Ghi nhớ” và nhớ bấm Đăng xuất khi xong lượt.</p>' +
      '</div></div></section>';
    bindEyes(view);
    $$('.who', view).forEach(function (b) { b.addEventListener('click', function () { $('#l-user').value = b.getAttribute('data-user'); $('#l-pass').focus(); S.play('pop'); }); });
    $('#login').addEventListener('submit', function (e) {
      e.preventDefault();
      var r = EC.auth.login($('#l-user').value, $('#l-pass').value, $('#l-remember').checked);
      if (r.err) { $('#l-msg').textContent = r.err; S.play('bad'); return; }
      S.play('good'); EC.toast('Chào mừng ' + EC.auth.profile().displayName + ' trở lại!');
      EC.checkUnlocks(); EC.go('kham-pha');
    });
  }, 'Đăng nhập');

  /* ================= ĐĂNG KÝ ================= */
  EC.route('dang-ky', function (view) {
    if (!EC.auth.isGuest()) { location.replace('#ho-so'); return; }
    var T = EC.totals(), hasGuest = EC.auth.guestHasProgress();
    view.innerHTML = '<section class="section"><div class="wrap auth-wrap"><div class="sheet auth-card stack" style="gap:18px">' +
      '<h1 class="h2">Tạo hồ sơ nhà khám phá</h1>' +
      EC.mascotLine('Ba mẹ hoặc thầy cô giúp bé điền nhé. Chỉ cần vài thông tin thôi!', 'happy', 'reg-m') +
      '<form class="form stack" id="reg" novalidate>' +
        field('Tên hiển thị *', '<input id="r-display" maxlength="30" autocomplete="nickname">', 'Biệt danh hiện trong hộ chiếu. Không cần dùng tên thật.') +
        field('Tên của bé (không bắt buộc)', '<input id="r-name" maxlength="40" autocomplete="off">', 'Chỉ in trên chứng nhận. Có thể để trống.') +
        field('Nhóm tuổi (không bắt buộc)', '<select id="r-age"><option value="">Không chọn</option>' + EC.AGE_GROUPS.map(function (a) { return '<option>' + esc(a) + '</option>'; }).join('') + '</select>') +
        '<div class="field"><span class="f-lbl">Ảnh đại diện</span>' + avatarPicker('r-av', 'besap', EC.AVATARS) + '</div>' +
        field('Tên đăng nhập *', '<input id="r-user" maxlength="20" autocomplete="username" autocapitalize="none" spellcheck="false">', '3–20 ký tự: chữ thường không dấu, số, dấu chấm hoặc gạch dưới. VD: be.na hoặc an_2019') +
        field('Mật khẩu *', pwInput('r-pass', 'new-password'), 'Ít nhất 4 ký tự. Người lớn nên giữ giúp bé.') +
        field('Nhập lại mật khẩu *', pwInput('r-pass2', 'new-password')) +
        '<label class="check"><input type="checkbox" id="r-remember"> Ghi nhớ đăng nhập trên máy này</label>' +
        (hasGuest ? '<label class="check"><input type="checkbox" id="r-guest" checked> Chuyển tiến trình chơi thử vào hồ sơ này (' + T.stars + ' sao, ' + T.xp + ' XP)</label>' : '') +
        '<div class="consent"><label class="check"><input type="checkbox" id="r-consent"> <span><b>Tôi là phụ huynh hoặc giáo viên của bé</b> và đồng ý tạo hồ sơ này. Tôi đã đọc <a href="#bao-mat" target="_blank">Chính sách bảo mật</a> và <a href="#dieu-khoan" target="_blank">Điều khoản sử dụng</a>.</span></label>' +
          '<p class="small muted">Hồ sơ chỉ lưu trên trình duyệt của máy này, không gửi lên mạng. ECOCRAYON không có quảng cáo và không công khai bảng xếp hạng.</p></div>' +
        '<p class="form-msg" id="r-msg" role="alert"></p>' +
        '<div class="row"><button class="btn btn-big" type="submit">Tạo hồ sơ</button><a class="btn btn-ghost" href="#dang-nhap">Đã có hồ sơ? Đăng nhập</a></div>' +
      '</form></div></div></section>';
    bindEyes(view);
    var getAv = bindPicker(view, '#r-av', 'data-av');
    var IDS = { displayName: 'r-display', username: 'r-user', password: 'r-pass', password2: 'r-pass2', consent: 'r-consent' };
    $('#reg').addEventListener('submit', function (e) {
      e.preventDefault();
      var g = $('#r-guest');
      var r = EC.auth.register({
        displayName: $('#r-display').value, playerName: $('#r-name').value, ageGroup: $('#r-age').value, avatar: getAv() || 'besap',
        username: $('#r-user').value, password: $('#r-pass').value, password2: $('#r-pass2').value,
        remember: $('#r-remember').checked, consent: $('#r-consent').checked, takeGuest: g ? g.checked : false
      });
      if (r.err) { $('#r-msg').textContent = r.err; S.play('bad'); var f = $('#' + IDS[r.field]); if (f) f.focus(); return; }
      S.play('win'); EC.confetti(); EC.toast('Chào mừng ' + EC.auth.profile().displayName + '! Hộ chiếu đã sẵn sàng.');
      EC.checkUnlocks(); EC.go('ho-chieu');
    });
  }, 'Tạo hồ sơ');

  /* ================= HỘ CHIẾU KHÁM PHÁ ================= */
  EC.route('ho-chieu', function (view) {
    if (EC.auth.isGuest()) { view.innerHTML = guestGate('Hộ chiếu cần hồ sơ của bé', 'Hộ chiếu lưu huy hiệu, cấp độ và tiến trình khám phá của riêng bé. Nhờ ba mẹ hoặc thầy cô tạo hồ sơ (hoặc đăng nhập) nhé!'); return; }
    var prof = EC.auth.profile(), prog = P.data, T = EC.totals(), lv = EC.levelOf(prog.xp), zs = EC.zones(), st = P.stage(), S2 = EC.content().settings;
    var theme = prof.theme && prog.rewards[prof.theme] ? prof.theme : 'kraft';
    view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:20px">' +
      EC.head({ title: 'Hộ chiếu của tôi', sc: '--c-dau-biec', side: '<div class="row"><a class="btn btn-sm btn-ghost" href="#ho-so">Hồ sơ</a><a class="btn btn-sm btn-ghost" href="#bo-suu-tap">Bộ sưu tập</a></div>' }) +
      '<div class="passport pp-' + esc(theme) + '">' +
        '<div class="pp-cover">' +
          '<p class="pp-kicker">Hộ chiếu nhà khám phá</p><p class="pp-brand">ECOCRAYON</p>' + EC.avatarHTML(prof, 124) +
          '<h2 class="h2">' + esc(prof.displayName) + '</h2>' +
          '<p class="pp-level">Cấp ' + (lv.idx + 1) + ' · ' + esc(lv.name) + '</p>' +
          '<div class="meter xp" role="progressbar" aria-label="Điểm kinh nghiệm tới cấp sau" aria-valuenow="' + lv.pct + '" aria-valuemin="0" aria-valuemax="100"><span style="width:' + lv.pct + '%"></span></div>' +
          '<p class="small">' + prog.xp + ' XP' + (lv.next != null ? ' · còn ' + (lv.next - prog.xp) + ' XP để lên cấp ' + (lv.idx + 2) : ' · cấp cao nhất!') + '</p>' +
          (prog.title ? '<p class="pp-title-tag">NHÀ KHÁM PHÁ ECOCRAYON</p>' : '') +
        '</div>' +
        '<div class="pp-stats">' +
          '<div><b>' + prog.xp + '</b><span>Điểm kinh nghiệm</span></div>' +
          '<div><b>' + T.stars + '<small>/' + T.starsMax + '</small></b><span>Sao thưởng</span></div>' +
          '<div><b>' + T.badges + '<small>/' + T.zones + '</small></b><span>Huy hiệu</span></div>' +
          '<div><b>' + T.zonesDone + '<small>/' + T.zones + '</small></b><span>Khu vực hoàn thành</span></div>' +
        '</div>' +
        '<div class="pp-page"><h3 class="h3">Huy hiệu</h3><div class="pp-badges">' + zs.map(function (z) {
          var got = prog.badges[z.id];
          return '<a class="pp-badge' + (got ? ' got' : '') + '" href="#vung/' + z.id + '">' + A.medal(z.badge.icon, 'var(--t-' + z.color + ')', !!got) +
            '<b>' + esc(z.badge.name) + '</b><span>' + (got ? 'Nhận ngày ' + EC.fmtDate(got) : esc(z.name) + ' · chưa mở khóa') + '</span></a>';
        }).join('') + '</div></div>' +
        '<div class="pp-page"><h3 class="h3">Tiến độ khám phá</h3>' +
          '<ul class="pp-totals"><li><b>' + T.lessons + '/' + T.lessonsTotal + '</b> bài học đã xem</li><li><b>' + T.games + '/' + T.gamesTotal + '</b> trò chơi đã hoàn thành</li><li><b>' + T.challenges + '/' + T.challengesTotal + '</b> thử thách đã vượt qua</li><li><b>' + T.stars + '</b> sao đã đạt</li></ul>' +
          '<div class="pp-zones">' + zs.map(function (z) {
            var s = EC.zoneStats(z);
            return '<a class="pp-zone c-' + z.color + '" href="#vung/' + z.id + '"><span class="pz-name">' + esc(z.name) + '</span><div class="meter"><span style="width:' + s.pct + '%"></span></div><span class="pz-pct">' + s.pct + '%</span></a>';
          }).join('') + '</div></div>' +
        '<div class="pp-page pp-tree">' + A.tree(st) + '<div class="stack" style="gap:6px"><h3 class="h3">Cây của bé</h3><p class="big-stat">' + esc(EC.TREE[st].name) + '</p><p class="muted">' + esc(EC.TREE[st].say) + '</p>' +
          (EC.TREE[st + 1] ? '<p class="small muted">Thêm ' + (EC.TREE[st + 1].xp - prog.xp) + ' XP nữa cây sẽ thành ' + esc(EC.TREE[st + 1].name.toLowerCase()) + '.</p>' : '') + '</div></div>' +
        '<div class="pp-page pp-final' + (prog.title ? ' got' : '') + '"><p class="eyebrow">Danh hiệu cuối cùng</p><h3 class="h2">NHÀ KHÁM PHÁ ECOCRAYON</h3>' +
          (prog.title
            ? '<p>Bé đã hoàn thành cả ' + zs.length + ' vùng đất ngày ' + EC.fmtDate(prog.title) + '. Chúc mừng!</p><div class="row"><button class="btn c-nghe" type="button" id="cert-dl">Tải chứng nhận</button><button class="btn btn-ghost" type="button" id="cert-print">In chứng nhận</button></div>'
            : '<p>Nhận đủ ' + zs.length + ' huy hiệu (hoàn thành trò chơi và vượt qua thử thách tổng kết của mỗi vùng đất) để nhận danh hiệu và chứng nhận điện tử.</p><ul class="checklist">' + zs.map(function (z) { return '<li class="' + (prog.badges[z.id] ? 'ok' : '') + '">' + esc(z.badge.name) + ' – ' + esc(z.name) + '</li>'; }).join('') + '</ul>') +
        '</div>' +
      '</div>' +
      '<p class="small muted">Thử thách tổng kết cần đạt từ ' + S2.badgeChallengeStars + ' sao (' + S2.stars[0] + '%) để được tính là vượt qua.</p>' +
      '</div></section>';
    if (prog.title) { $('#cert-dl').addEventListener('click', downloadCert); $('#cert-print').addEventListener('click', printCert); }
  }, 'Hộ chiếu của tôi');

  /* ---------- Chứng nhận NHÀ KHÁM PHÁ ECOCRAYON ---------- */
  function certName() { var p = EC.auth.profile(); return p.playerName || p.displayName || ''; }
  function printCert() {
    var prog = P.data, zs = EC.zones();
    EC.printHTML('<div class="cert"><p class="eyebrow">ECOCRAYON · Tô màu thiên nhiên – Khơi nguồn tri thức xanh</p><h1>Chứng nhận</h1><p style="margin-top:8px">Chứng nhận bạn nhỏ</p>' +
      '<div class="name">' + esc(certName()) + '</div><p>đã hoàn thành ' + zs.length + ' vùng đất và trở thành</p><h2 class="cert-title">NHÀ KHÁM PHÁ ECOCRAYON</h2>' +
      '<div class="cert-medals">' + zs.map(function (z) { return '<div>' + A.medal(z.badge.icon, '#FFFDF7', true) + '<span>' + esc(z.badge.name) + '</span></div>'; }).join('') + '</div>' +
      '<p>Ngày ' + EC.fmtDate(prog.title || Date.now()) + ' · ' + prog.xp + ' XP · ' + EC.totals().stars + ' sao</p>' +
      '<div class="sign"><div>Phụ huynh / Giáo viên<br><br><br>.....................</div><div>Bé Sáp<br><br><br>(ký bằng bút sáp)</div></div></div>');
  }
  function svgImage(svgStr) {
    return new Promise(function (res) {
      var s = svgStr.indexOf('xmlns=') < 0 ? svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"') : svgStr;
      var img = new Image(); img.onload = function () { res(img); }; img.onerror = function () { res(null); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }
  function downloadCert() {
    var prog = P.data, zs = EC.zones(), W = 1600, H = 1131;
    Promise.all(zs.map(function (z) { return svgImage(A.medal(z.badge.icon, '#FFFDF7', true)); })).then(function (imgs) {
      var c = document.createElement('canvas'); c.width = W; c.height = H;
      var x = c.getContext('2d'), F = 'Mali, "Comic Sans MS", sans-serif';
      x.fillStyle = '#FFFBF0'; x.fillRect(0, 0, W, H);
      x.strokeStyle = '#2B2722'; x.lineWidth = 10; x.strokeRect(40, 40, W - 80, H - 80); x.lineWidth = 3; x.strokeRect(62, 62, W - 124, H - 124);
      ['#B8336A', '#E3A21A', '#4C9A3B', '#2F62B0', '#6E3C8F', '#E2702A'].forEach(function (col, i) { x.fillStyle = col; x.fillRect(62 + i * ((W - 124) / 6), 62, (W - 124) / 6, 16); });
      x.textAlign = 'center'; x.fillStyle = '#5F574A'; x.font = '600 30px ' + F; x.fillText('ECOCRAYON · Tô màu thiên nhiên – Khơi nguồn tri thức xanh', W / 2, 150);
      x.fillStyle = '#2B2722'; x.font = '700 92px ' + F; x.fillText('CHỨNG NHẬN', W / 2, 260);
      x.font = '500 34px ' + F; x.fillText('Chứng nhận bạn nhỏ', W / 2, 330);
      x.fillStyle = '#2F62B0'; x.font = '700 70px ' + F; x.fillText(certName(), W / 2, 420);
      x.strokeStyle = '#2B2722'; x.setLineDash([10, 10]); x.lineWidth = 2; x.beginPath(); x.moveTo(W / 2 - 360, 445); x.lineTo(W / 2 + 360, 445); x.stroke(); x.setLineDash([]);
      x.fillStyle = '#2B2722'; x.font = '500 34px ' + F; x.fillText('đã hoàn thành ' + zs.length + ' vùng đất và trở thành', W / 2, 505);
      x.fillStyle = '#4C9A3B'; x.font = '700 64px ' + F; x.fillText('NHÀ KHÁM PHÁ ECOCRAYON', W / 2, 590);
      var gap = (W - 240) / Math.max(1, zs.length);
      zs.forEach(function (z, i) {
        var cx = 120 + gap * i + gap / 2;
        if (imgs[i]) x.drawImage(imgs[i], cx - 70, 630, 140, 163);
        x.fillStyle = '#2B2722'; x.font = '600 24px ' + F; x.fillText(z.badge.name, cx, 830);
      });
      x.font = '500 28px ' + F; x.fillStyle = '#5F574A'; x.fillText('Ngày ' + EC.fmtDate(prog.title || Date.now()) + ' · ' + prog.xp + ' XP · ' + EC.totals().stars + ' sao', W / 2, 900);
      x.fillStyle = '#2B2722'; x.font = '500 26px ' + F;
      x.fillText('Phụ huynh / Giáo viên', W / 2 - 400, 975); x.fillText('Bé Sáp', W / 2 + 400, 975);
      x.fillText('.........................', W / 2 - 400, 1040); x.fillText('(ký bằng bút sáp)', W / 2 + 400, 1040);
      c.toBlob(function (b) { if (b) { EC.download('chung-nhan-nha-kham-pha-ecocrayon.png', b); EC.toast('Đã tải chứng nhận'); } else EC.toast('Không tạo được ảnh. Hãy dùng nút In chứng nhận.'); }, 'image/png');
    });
  }

  /* ================= HỒ SƠ NGƯỜI CHƠI ================= */
  EC.route('ho-so', function (view) {
    if (EC.auth.isGuest()) { view.innerHTML = guestGate('Bé chưa đăng nhập', 'Đăng nhập để xem hồ sơ, điểm kinh nghiệm, huy hiệu và lịch sử trò chơi của bé.'); return; }
    var editing = false;
    function paint() {
      var u = EC.auth.user(), prof = EC.auth.profile(), prog = P.data, T = EC.totals(), lv = EC.levelOf(prog.xp), zs = EC.zones();
      var hist = EC.db.attemptsOf(u.id).slice(-30).reverse();
      var chars = ownedChars(prog), frames = EC.content().rewards.filter(function (r) { return r.kind === 'frame'; }), themes = EC.content().rewards.filter(function (r) { return r.kind === 'theme'; });
      var lockedChars = EC.content().rewards.filter(function (r) { return r.kind === 'char' && !prog.rewards[r.id]; }).map(function (r) { return { id: r.art, name: r.name.replace(/^Nhân vật /, ''), how: EC.ruleText(r.rule) }; });
      view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:20px">' +
        EC.head({ title: 'Hồ sơ của ' + esc(prof.displayName), sc: '--c-ca-rot', side: '<div class="row"><a class="btn btn-sm" href="#ho-chieu">Hộ chiếu</a><button class="btn btn-sm btn-ghost" type="button" data-logout>Đăng xuất</button></div>' }) +
        '<div class="profile-grid">' +
          '<div class="sheet stack prof-card">' + EC.avatarHTML(prof, 110) +
            '<h2 class="h3">' + esc(prof.displayName) + '</h2>' +
            '<dl class="kv"><dt>Tên đăng nhập</dt><dd>' + esc(u.username) + '</dd>' +
              (prof.playerName ? '<dt>Tên của bé</dt><dd>' + esc(prof.playerName) + '</dd>' : '') +
              (prof.ageGroup ? '<dt>Nhóm tuổi</dt><dd>' + esc(prof.ageGroup) + '</dd>' : '') +
              '<dt>Ngày tạo</dt><dd>' + EC.fmtDate(u.createdAt) + '</dd></dl>' +
            '<button class="btn btn-sm" type="button" id="p-edit">' + (editing ? 'Đóng' : 'Sửa thông tin') + '</button>' +
          '</div>' +
          '<div class="sheet stack">' +
            '<h2 class="h3">Thành tích</h2>' +
            '<div class="lvcard"><span class="lv-num">' + (lv.idx + 1) + '</span><div class="stack" style="gap:4px;flex:1;min-width:0"><b>Cấp ' + (lv.idx + 1) + ': ' + esc(lv.name) + '</b>' +
              '<div class="meter"><span style="width:' + lv.pct + '%"></span></div><span class="small muted">' + prog.xp + ' XP' + (lv.next != null ? ' · cấp sau: ' + lv.next + ' XP' : '') + '</span></div></div>' +
            '<div class="pp-stats mini"><div><b>' + T.stars + '</b><span>sao</span></div><div><b>' + T.badges + '/' + T.zones + '</b><span>huy hiệu</span></div><div><b>' + T.games + '/' + T.gamesTotal + '</b><span>trò chơi</span></div><div><b>' + T.lessons + '/' + T.lessonsTotal + '</b><span>bài học</span></div></div>' +
            '<div class="mini-medals">' + zs.map(function (z) { return '<span title="' + esc(z.badge.name) + '">' + A.medal(z.badge.icon, 'var(--t-' + z.color + ')', !!prog.badges[z.id], z.badge.name + (prog.badges[z.id] ? '' : ' (chưa mở khóa)')) + '</span>'; }).join('') + '</div>' +
          '</div>' +
        '</div>' +
        (editing ? '<form class="sheet form stack" id="p-form" novalidate><h2 class="h3">Sửa thông tin</h2>' +
          field('Tên hiển thị *', '<input id="p-display" maxlength="30" value="' + esc(prof.displayName) + '">') +
          field('Tên của bé (in trên chứng nhận)', '<input id="p-name" maxlength="40" value="' + esc(prof.playerName || '') + '">') +
          field('Nhóm tuổi', '<select id="p-age"><option value="">Không chọn</option>' + EC.AGE_GROUPS.map(function (a) { return '<option' + (a === prof.ageGroup ? ' selected' : '') + '>' + esc(a) + '</option>'; }).join('') + '</select>') +
          '<div class="field"><span class="f-lbl">Ảnh đại diện</span>' + avatarPicker('p-av', prof.avatar || 'besap', EC.AVATARS.concat(chars), lockedChars) + '</div>' +
          '<div class="field"><span class="f-lbl">Khung ảnh</span><div class="avpick" id="p-frame" role="radiogroup" aria-label="Khung ảnh"><button type="button" role="radio" class="avopt" data-v="" aria-checked="' + !prof.frame + '">' + EC.avatarHTML({ avatar: prof.avatar }, 56) + '<span>Không khung</span></button>' +
            frames.map(function (r) { var ok = !!prog.rewards[r.id]; return ok ? '<button type="button" role="radio" class="avopt" data-v="' + r.id + '" aria-checked="' + (prof.frame === r.id) + '">' + EC.avatarHTML({ avatar: prof.avatar, frame: r.id }, 56) + '<span>' + esc(r.name) + '</span></button>' : '<span class="avopt locked" title="' + esc(EC.ruleText(r.rule)) + '">' + EC.avatarHTML({ avatar: prof.avatar, frame: r.id }, 56) + '<span>' + esc(r.name) + '</span></span>'; }).join('') + '</div></div>' +
          '<div class="field"><span class="f-lbl">Trang trí hộ chiếu</span><div class="avpick" id="p-theme" role="radiogroup" aria-label="Trang trí hộ chiếu"><button type="button" role="radio" class="avopt" data-v="" aria-checked="' + !prof.theme + '"><span class="rw-art rw-theme pp-kraft">' + A.thing('i-passport') + '</span><span>Giấy kraft</span></button>' +
            themes.map(function (r) { var ok = !!prog.rewards[r.id]; return ok ? '<button type="button" role="radio" class="avopt" data-v="' + r.id + '" aria-checked="' + (prof.theme === r.id) + '">' + EC.rewardArt(r) + '<span>' + esc(r.name) + '</span></button>' : '<span class="avopt locked" title="' + esc(EC.ruleText(r.rule)) + '">' + EC.rewardArt(r) + '<span>' + esc(r.name) + '</span></span>'; }).join('') + '</div></div>' +
          '<p class="small muted">Nhân vật, khung ảnh và trang trí mới mở khóa khi bé chơi. Rê chuột vào món bị khóa để xem cách mở.</p>' +
          '<p class="form-msg" id="p-msg" role="alert"></p><div class="row"><button class="btn" type="submit">Lưu</button><button class="btn btn-ghost" type="button" id="p-cancel">Hủy</button></div></form>' : '') +
        '<div class="sheet"><h2 class="h3">Tiến trình từng vùng đất</h2><div class="tablebox"><table class="mattable ztable"><thead><tr><th>Vùng đất</th><th>Tiến độ</th><th>Bài học</th><th>Trò chơi</th><th>Thử thách</th><th>Sao</th></tr></thead><tbody>' +
          zs.map(function (z) {
            var s = EC.zoneStats(z);
            return '<tr><td><a href="#vung/' + z.id + '"><b>' + esc(z.name) + '</b></a>' + (s.badge ? ' ✓' : '') + '</td><td><div class="meter sm c-' + z.color + '"><span style="width:' + s.pct + '%"></span></div> ' + s.pct + '%</td><td>' + s.lessonsDone + '/' + s.lessonsTotal + '</td><td>' + s.gamesDone + '/' + s.gamesTotal + '</td><td>' + (z.challenge ? EC.starsHTML(s.chStars) : '–') + '</td><td>' + s.stars + '/' + s.starsMax + '</td></tr>';
          }).join('') + '</tbody></table></div></div>' +
        '<div class="sheet"><h2 class="h3">Lịch sử trò chơi</h2>' + (hist.length ? '<div class="tablebox"><table class="mattable"><thead><tr><th>Thời gian</th><th>Trò chơi</th><th>Điểm</th><th>Sao</th></tr></thead><tbody>' +
          hist.map(function (a) { var f = EC.gameById(a.gameId); return '<tr><td>' + EC.fmtDate(a.at, true) + '</td><td>' + esc(f ? f.game.title : a.gameId) + '<br><span class="small muted">' + esc(f ? f.zone.name : '') + '</span></td><td>' + a.score + '/' + a.max + '</td><td>' + EC.starsHTML(a.stars) + '</td></tr>'; }).join('') +
          '</tbody></table></div>' : '<p class="muted">Chưa có lượt chơi nào. <a href="#kham-pha">Vào bản đồ</a> để bắt đầu nhé!</p>') + '</div>' +
        '<div class="sheet stack"><h2 class="h3">Tài khoản (dành cho người lớn)</h2>' +
          '<form class="form row pw-form" id="pw-form" novalidate>' + field('Mật khẩu cũ', pwInput('pw-old', 'current-password')) + field('Mật khẩu mới', pwInput('pw-new', 'new-password')) +
            '<button class="btn btn-sm" type="submit">Đổi mật khẩu</button><p class="form-msg" id="pw-msg" role="alert"></p></form>' +
          '<div class="row"><button class="btn btn-sm btn-ghost" type="button" id="p-export">Tải dữ liệu của bé (JSON)</button><button class="btn btn-sm btn-ghost" type="button" data-logout>Đăng xuất</button></div>' +
          '<div id="del-box"><button class="btn btn-sm c-den" type="button" id="p-del">Xóa hồ sơ này</button></div>' +
        '</div>' +
        '</div></section>';
      bindEyes(view);
      $('#p-edit').addEventListener('click', function () { editing = !editing; paint(); if (editing) $('#p-display').focus(); });
      if (editing) {
        var getAv = bindPicker(view, '#p-av', 'data-av'), getFr = bindPicker(view, '#p-frame', 'data-v'), getTh = bindPicker(view, '#p-theme', 'data-v');
        $('#p-cancel').addEventListener('click', function () { editing = false; paint(); });
        $('#p-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var dn = $('#p-display').value.replace(/\s+/g, ' ').trim().slice(0, 30);
          if (!dn) { $('#p-msg').textContent = 'Tên hiển thị không được để trống.'; return; }
          prof.displayName = dn; prof.playerName = $('#p-name').value.replace(/\s+/g, ' ').trim().slice(0, 40); prof.ageGroup = $('#p-age').value;
          prof.avatar = getAv() || prof.avatar; prof.frame = getFr(); prof.theme = getTh();
          EC.auth.saveProfile(); editing = false; EC.toast('Đã lưu hồ sơ'); paint();
        });
      }
      $('#pw-form').addEventListener('submit', function (e) {
        e.preventDefault();
        var r = EC.auth.changePassword($('#pw-old').value, $('#pw-new').value);
        $('#pw-msg').textContent = r.err || 'Đã đổi mật khẩu.'; if (r.ok) { $('#pw-old').value = ''; $('#pw-new').value = ''; }
      });
      $('#p-export').addEventListener('click', function () {
        var data = { app: 'ECOCRAYON', kind: 'player', exportedAt: new Date().toISOString(), profile: prof, username: u.username, progress: prog, attempts: EC.db.attemptsOf(u.id) };
        EC.download('ecocrayon-' + u.username + '.json', new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      });
      $('#p-del').addEventListener('click', function () {
        $('#del-box').innerHTML = '<p><b>Xóa vĩnh viễn hồ sơ, điểm, huy hiệu và tranh của ' + esc(prof.displayName) + '?</b> Gõ tên đăng nhập <code>' + esc(u.username) + '</code> để xác nhận.</p>' +
          '<div class="row"><input id="del-confirm" class="input" autocomplete="off" aria-label="Gõ tên đăng nhập để xác nhận"><button class="btn btn-sm c-den" type="button" id="del-yes">Xóa</button><button class="btn btn-sm btn-ghost" type="button" id="del-no">Không</button></div>';
        $('#del-no').addEventListener('click', paint);
        $('#del-yes').addEventListener('click', function () {
          if ($('#del-confirm').value.trim().toLowerCase() !== u.username) { EC.toast('Tên đăng nhập chưa khớp.'); return; }
          EC.auth.deleteAccount(u.id); EC.toast('Đã xóa hồ sơ.'); EC.go('trang-chu');
        });
      });
    }
    paint();
  }, 'Hồ sơ người chơi');

  /* ================= BỘ SƯU TẬP ================= */
  function dataURLtoBlob(d) {
    var parts = String(d).split(','), mime = (parts[0].match(/:(.*?);/) || [])[1] || 'image/png', bin = atob(parts[1] || ''), n = bin.length, u8 = new Uint8Array(n);
    while (n--) u8[n] = bin.charCodeAt(n);
    return new Blob([u8], { type: mime });
  }
  EC.route('bo-suu-tap', function (view) {
    var tabs = [['tranh', 'Tranh của bé'], ['phat-minh', 'Phòng trưng bày'], ['the', 'Thẻ nhân vật'], ['vat-pham', 'Vật phẩm'], ['nhan-dan', 'Nhãn dán']];
    var cur = EC.store.get('col-tab', 'tranh'); if (!tabs.some(function (t) { return t[0] === cur; })) cur = 'tranh';
    var guest = EC.auth.isGuest(), prof = EC.auth.profile();
    view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:18px">' +
      EC.head({ title: 'Bộ sưu tập', lead: 'Tranh bé đã tô, đồ tái chế bé phát minh và những vật phẩm mở khóa khi chơi. Tất cả đều nhận được bằng cách chơi, không cần mua.', sc: '--c-bap-cai' }) +
      (guest ? '<p class="note">Bé đang chơi thử. <a href="#dang-ky">Tạo hồ sơ</a> để giữ bộ sưu tập riêng của mình.</p>' : '') +
      '<div class="ptabs" role="tablist">' + tabs.map(function (t) { return '<button type="button" role="tab" id="ct-' + t[0] + '" data-t="' + t[0] + '" aria-selected="' + (t[0] === cur) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="col-body" role="tabpanel"></div></div></section>';
    var body = $('#col-body', view);
    function show(t) {
      cur = t; EC.store.set('col-tab', t);
      $$('.ptabs button', view).forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-t') === t)); });
      body.setAttribute('aria-labelledby', 'ct-' + t);
      TAB[t](body);
    }
    var prog = P.data, C = EC.content();
    var TAB = {
      tranh: function (box) {
        box.innerHTML = '<p class="muted">Đang mở tranh…</p>';
        EC.gallery.list(EC.auth.pid()).then(function (L) {
          if (cur !== 'tranh') return;
          if (!L.length) { box.innerHTML = '<div class="sheet empty-col">' + A.thing('b-crayon') + '<p>Chưa có bức tranh nào. Tô màu trong <a href="#choi/hoa-si-nhi">Họa sĩ nhí tài ba</a> hoặc <a href="#to-mau">Tô màu tự do</a> rồi bấm lưu nhé!</p></div>'; return; }
          box.innerHTML = '<div class="artgrid">' + L.map(function (a) {
            return '<figure class="artcard sheet" data-id="' + esc(a.id) + '"><button class="art-thumb" type="button" data-view aria-label="Xem tranh ' + esc(a.title) + '"><img src="' + esc(a.thumb || a.img) + '" alt=""></button>' +
              '<figcaption class="stack" style="gap:6px"><span class="art-title-row"><input class="art-title" value="' + esc(a.title) + '" maxlength="40" aria-label="Tên tranh"><button class="btn btn-sm btn-ghost" type="button" data-rename>Lưu tên</button></span>' +
              '<span class="small muted">Vẽ ngày ' + EC.fmtDate(a.createdAt, true) + '</span>' +
              '<span class="row" style="gap:6px"><button class="btn btn-sm" type="button" data-dl>Tải về</button><button class="btn btn-sm btn-ghost" type="button" data-del>Xóa</button></span></figcaption></figure>';
          }).join('') + '</div>';
          $$('.artcard', box).forEach(function (card) {
            var id = card.getAttribute('data-id'), a = L.filter(function (x) { return x.id === id; })[0];
            $('[data-view]', card).addEventListener('click', function () { EC.modal('<img class="art-full" src="' + esc(a.img || a.thumb) + '" alt="' + esc(a.title) + '"><h2 id="modal-title">' + esc(a.title) + '</h2><p class="small muted">' + EC.fmtDate(a.createdAt, true) + '</p><div class="row"><button class="btn" type="button" data-close>Đóng</button></div>'); });
            $('[data-rename]', card).addEventListener('click', function () { var t = $('.art-title', card).value.trim().slice(0, 40) || 'Tranh của bé'; a.title = t; EC.gallery.update(id, { title: t }).then(function () { EC.toast('Đã đặt tên tranh'); }); });
            $('[data-dl]', card).addEventListener('click', function () { try { EC.download((a.title || 'tranh').replace(/[^\wÀ-ỹ -]/g, '').trim().replace(/\s+/g, '-') + '.jpg', dataURLtoBlob(a.img || a.thumb)); } catch (e) { EC.toast('Không tải được tranh.'); } });
            $('[data-del]', card).addEventListener('click', function () {
              var b = $('[data-del]', card);
              if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn xóa?'; return; }
              EC.gallery.remove(id).then(function () { EC.toast('Đã xóa tranh'); TAB.tranh(box); });
            });
          });
        });
      },
      'phat-minh': function (box) {
        var recs = []; EC.zones().forEach(function (z) { EC.gamesOf(z).forEach(function (g) { if (g.type === 'invent') recs = recs.concat(g.recipes || []); }); });
        var got = recs.filter(function (r) { return prog.inventions[r.art]; }).length;
        box.innerHTML = '<p class="muted">Đồ tái chế bé đã chế tạo trong trò <a href="#choi/nha-phat-minh">Nhà phát minh tí hon</a>: <b>' + got + '/' + recs.length + '</b></p>' +
          '<div class="itemgrid">' + recs.map(function (r) {
            var ok = !!prog.inventions[r.art];
            return '<div class="itemcard sheet' + (ok ? '' : ' locked') + '">' + EC.pic(r.art) + '<b>' + (ok ? esc(r.name) : '???') + '</b><span class="small muted">' + (ok ? esc(r.ex || '') : 'Chưa chế tạo') + '</span></div>';
          }).join('') + '</div>';
      },
      the: function (box) {
        var cards = []; EC.zones().forEach(function (z) { EC.gamesOf(z).forEach(function (g) { if (g.type === 'hide') cards = cards.concat(g.items || []); }); });
        var got = cards.filter(function (c) { return prog.cards[c.art]; }).length;
        box.innerHTML = '<p class="muted">Thẻ bạn rau củ mở khóa trong trò <a href="#choi/khu-vuon-bi-an">Ai đang trốn trong khu vườn?</a>: <b>' + got + '/' + cards.length + '</b></p>' +
          '<div class="itemgrid">' + cards.map(function (c) {
            var ok = !!prog.cards[c.art];
            return '<div class="itemcard sheet' + (ok ? '' : ' locked') + '">' + EC.pic(c.art) + '<b>' + (ok ? esc(c.name) : '???') + '</b><span class="small muted">' + (ok ? esc(c.fact || '') : 'Tìm bạn này trong khu vườn nhé') + '</span></div>';
          }).join('') + '</div>';
      },
      'vat-pham': function (box) {
        var KIND = { char: 'Nhân vật hoạt hình', frame: 'Khung ảnh đại diện', theme: 'Trang trí hộ chiếu', deco: 'Trang trí bản đồ thế giới ECOCRAYON' };
        box.innerHTML = Object.keys(KIND).map(function (k) {
          var list = C.rewards.filter(function (r) { return r.kind === k; }); if (!list.length) return '';
          return '<h2 class="h3" style="margin:18px 0 10px">' + KIND[k] + '</h2><div class="itemgrid">' + list.map(function (r) {
            var ok = !!prog.rewards[r.id], use = '';
            if (ok && !guest && (k === 'char' || k === 'frame' || k === 'theme')) {
              var active = (k === 'char' && prof.avatar === r.art) || (k === 'frame' && prof.frame === r.id) || (k === 'theme' && prof.theme === r.id);
              use = active ? '<span class="chip chip-done">Đang dùng</span>' : '<button class="btn btn-sm" type="button" data-use="' + r.id + '">Dùng</button>';
            }
            return '<div class="itemcard sheet' + (ok ? '' : ' locked') + '">' + EC.rewardArt(r) + '<b>' + esc(r.name) + '</b><span class="small muted">' + (ok ? '✓ Đã mở khóa' : esc(EC.ruleText(r.rule))) + '</span>' + use + '</div>';
          }).join('') + '</div>';
        }).join('') + '<p class="small muted" style="margin-top:14px">Trang trí bản đồ hiện trên <a href="#kham-pha">Bản đồ khám phá</a> khi mở khóa.</p>';
        $$('[data-use]', box).forEach(function (b) {
          b.addEventListener('click', function () {
            var r = C.rewards.filter(function (x) { return x.id === b.getAttribute('data-use'); })[0];
            if (r.kind === 'char') prof.avatar = r.art; else if (r.kind === 'frame') prof.frame = r.id; else prof.theme = r.id;
            EC.auth.saveProfile(); EC.toast('Đã dùng ' + r.name); TAB['vat-pham'](box);
          });
        });
      },
      'nhan-dan': function (box) {
        var got = Object.keys(prog.stickers).length;
        box.innerHTML = '<p class="muted">Nhãn dán nhận từ trang màu, trò chơi thêm, tô màu và thử thách xanh: <b>' + got + '/' + EC.STICKERS.length + '</b></p><div class="stickers">' +
          EC.STICKERS.map(function (s) { var has = P.has(s.id); return '<div class="sticker' + (has ? ' got' : '') + '" title="' + esc(s.how) + '"><div class="disc">' + A.thing(s.icon) + '</div><b>' + esc(s.name) + '</b><span>' + esc(s.how) + '</span></div>'; }).join('') + '</div>';
      }
    };
    $$('.ptabs button', view).forEach(function (b) { b.addEventListener('click', function () { show(b.getAttribute('data-t')); }); });
    show(cur);
  }, 'Bộ sưu tập');
})();
