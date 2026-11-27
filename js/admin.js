/* ECOCRAYON – trang Quản trị (#quan-tri).
   Quản lý người chơi trên máy này, 4 vùng đất, bài học, trò chơi và câu hỏi, huy hiệu, cấp độ, phần thưởng,
   tác phẩm, thống kê; sao lưu dữ liệu và xuất file nội dung để đăng cho mọi máy. */
(function () {
  'use strict';
  var $ = EC.$, $$ = EC.$$, esc = EC.esc, A = EC.art, DB = EC.db;
  var draft = null, ui = { tab: 'thong-ke', zone: null, lesson: null, game: null, q: null, search: '', artOwner: '' };
  function D() { if (!draft) draft = EC.clone(EC.content()); return draft; }
  function saveDraft(msg) {
    if (!EC.saveContent(D())) { EC.toast('Không lưu được: bộ nhớ trình duyệt đã đầy.'); return false; }
    draft = EC.clone(EC.content()); EC.toast(msg || 'Đã lưu'); return true;
  }
  function slug(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'muc';
  }
  function uniqueId(base, taken) { var id = base, n = 2; while (taken.indexOf(id) >= 0) id = base + '-' + n++; return id; }
  function allIds() { var ids = []; D().zones.forEach(function (z) { ids.push(z.id); (z.lessons || []).forEach(function (l) { ids.push(l.id); }); (z.games || []).forEach(function (g) { ids.push(g.id); }); if (z.challenge) ids.push(z.challenge.id); }); return ids; }
  function inp(id, label, val, o) {
    o = o || {};
    var ctl;
    if (o.area) ctl = '<textarea id="' + id + '" rows="' + (o.rows || 3) + '"' + (o.mono ? ' class="mono"' : '') + '>' + esc(val == null ? '' : val) + '</textarea>';
    else if (o.select) ctl = '<select id="' + id + '">' + o.select.map(function (x) { return '<option value="' + esc(x[0]) + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + esc(x[1]) + '</option>'; }).join('') + '</select>';
    else if (o.check) return '<label class="check"><input type="checkbox" id="' + id + '"' + (val ? ' checked' : '') + '> ' + label + '</label>';
    else ctl = '<input id="' + id + '" type="' + (o.type || 'text') + '" value="' + esc(val == null ? '' : val) + '"' + (o.list ? ' list="' + o.list + '"' : '') + (o.attrs || '') + '>';
    return '<label class="field"><span class="f-lbl">' + label + '</span>' + ctl + (o.hint ? '<span class="f-hint">' + o.hint + '</span>' : '') + '</label>';
  }
  function v(id) { var e = document.getElementById(id); return e ? e.value : ''; }
  function on(id) { var e = document.getElementById(id); return !!(e && e.checked); }
  function lines(s) { return String(s || '').split('\n').map(function (x) { return x.trim(); }).filter(Boolean); }
  function num(id, d) { var n = parseFloat(v(id)); return isNaN(n) ? d : n; }
  function click(sel, fn, root) { $$(sel, root || document).forEach(function (b) { b.addEventListener('click', function (e) { fn(b, e); }); }); }
  var COLORS = [['la-dua', 'Xanh lá'], ['bap-cai', 'Tím'], ['ca-rot', 'Cam'], ['dau-biec', 'Xanh dương'], ['den', 'Đỏ hồng'], ['nghe', 'Vàng']];
  var CHARS = [['besap', 'Bé Sáp'], ['mam', 'Mầm Xanh'], ['eco', 'Giáo sư ECO'], ['robo', 'Rô-bốt Tái Chế'], ['earth', 'Bạn Trái Đất'], ['hero', 'Bé Sáp siêu anh hùng']];
  var TABS = [['thong-ke', 'Thống kê'], ['nguoi-choi', 'Người chơi'], ['vung-dat', 'Vùng đất & bài học'], ['tro-choi', 'Trò chơi & câu hỏi'], ['thanh-tich', 'Thành tích'], ['tac-pham', 'Tác phẩm'], ['du-lieu', 'Dữ liệu']];

  /* ================= CỔNG VÀO ================= */
  EC.route('quan-tri', function (view) {
    draft = null;
    if (!EC.adminAuth.ok()) { gate(view); return; }
    shell(view);
  }, 'Quản trị');

  function gate(view) {
    var first = !EC.adminAuth.hasPin();
    view.innerHTML = '<section class="section"><div class="wrap auth-wrap"><form class="sheet auth-card form stack" id="ad-gate" novalidate>' +
      '<h1 class="h2">Trang quản trị</h1>' +
      (first ? '<p>Máy này chưa có mật khẩu quản trị. Tạo mật khẩu (ít nhất 6 ký tự) để bắt đầu. Chỉ người lớn (giáo viên, nhóm dự án) dùng trang này.</p>' +
        inp('ad-p1', 'Mật khẩu quản trị mới', '', { type: 'password', attrs: ' autocomplete="new-password"' }) + inp('ad-p2', 'Nhập lại', '', { type: 'password', attrs: ' autocomplete="new-password"' })
        : '<p>Nhập mật khẩu quản trị của máy này.</p>' + inp('ad-p1', 'Mật khẩu quản trị', '', { type: 'password', attrs: ' autocomplete="current-password"' })) +
      '<p class="form-msg" id="ad-msg" role="alert"></p><div class="row"><button class="btn" type="submit">' + (first ? 'Tạo mật khẩu' : 'Vào trang quản trị') + '</button><a class="btn btn-ghost" href="#trang-chu">Về trang chủ</a></div>' +
      '<p class="small muted">Tài khoản người chơi được cấp quyền “Quản trị” cũng vào được trang này khi đã đăng nhập.</p></form></div></section>';
    $('#ad-gate').addEventListener('submit', function (e) {
      e.preventDefault();
      if (first) {
        if (v('ad-p1').length < 6) { $('#ad-msg').textContent = 'Mật khẩu cần ít nhất 6 ký tự.'; return; }
        if (v('ad-p1') !== v('ad-p2')) { $('#ad-msg').textContent = 'Hai lần nhập chưa giống nhau.'; return; }
        EC.adminAuth.setPin(v('ad-p1'));
      } else if (!EC.adminAuth.check(v('ad-p1'))) { $('#ad-msg').textContent = 'Mật khẩu chưa đúng.'; return; }
      EC.rerender();
    });
  }

  function shell(view) {
    view.innerHTML = '<section class="section admin"><div class="wrap stack" style="gap:16px">' +
      EC.head({ title: 'Trang quản trị', lead: 'Dữ liệu người chơi trong trang này là dữ liệu trên máy đang dùng. Nội dung sửa ở đây áp dụng ngay trên máy này; muốn mọi máy thấy thì xuất file nội dung ở mục Dữ liệu.', sc: '--c-ca-rot',
        side: '<button class="btn btn-sm btn-ghost" type="button" id="ad-out">Thoát quản trị</button>' }) +
      (EC.contentIsLocal() ? '<p class="note">Máy này đang dùng nội dung đã chỉnh sửa (chưa xuất file). <a href="#quan-tri" data-goto="du-lieu">Xuất file nội dung</a> khi đã ưng ý.</p>' : '') +
      '<div class="ptabs" role="tablist">' + TABS.map(function (t) { return '<button type="button" role="tab" data-t="' + t[0] + '" aria-selected="' + (ui.tab === t[0]) + '">' + t[1] + '</button>'; }).join('') + '</div>' +
      '<div id="ad-body" role="tabpanel"></div>' +
      '<datalist id="art-ids">' + A.ids().concat(A.CHARS).map(function (id) { return '<option value="' + id + '">'; }).join('') + '</datalist>' +
      '</div></section>';
    $('#ad-out').addEventListener('click', function () { EC.adminAuth.logout(); EC.go('trang-chu'); });
    click('.ptabs button', function (b) { ui.tab = b.getAttribute('data-t'); shell(view); });
    click('[data-goto]', function (b, e) { e.preventDefault(); ui.tab = b.getAttribute('data-goto'); shell(view); });
    var body = $('#ad-body');
    var R = { 'thong-ke': tabStats, 'nguoi-choi': tabPlayers, 'vung-dat': tabZones, 'tro-choi': tabGames, 'thanh-tich': tabAchieve, 'tac-pham': tabArt, 'du-lieu': tabData };
    R[ui.tab](body, function () { shell(view); });
  }

  /* ================= THỐNG KÊ ================= */
  function tiles(list) { return '<div class="tiles">' + list.map(function (t) { return '<div class="tile sheet"><span class="tile-lbl">' + t[0] + '</span><span class="tile-val">' + t[1] + '</span>' + (t[2] ? '<span class="tile-sub">' + t[2] + '</span>' : '') + '</div>'; }).join('') + '</div>'; }
  function tableView(head, rows) { return '<details class="tableview"><summary>Xem dạng bảng</summary><div class="tablebox"><table class="mattable"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div></details>'; }
  /* Biểu đồ thanh ngang một chuỗi: thanh ≤ 24px, đầu bo 4px, giá trị ở đầu thanh, rê chuột/tab để xem chi tiết */
  function hbars(title, sub, rows, unit) {
    var max = Math.max.apply(null, [1].concat(rows.map(function (r) { return r.value; })));
    var body = rows.some(function (r) { return r.value; })
      ? '<div class="hbars">' + rows.map(function (r) {
          return '<div class="hb-row" tabindex="0" data-tip="' + esc(r.label + ': ' + r.value + ' ' + unit + (r.tip ? ' · ' + r.tip : '')) + '"><span class="hb-lbl">' + esc(r.label) + '</span><span class="hb-track"><span class="hb-bar" style="width:' + (r.value / max * 100).toFixed(1) + '%"></span><span class="hb-val">' + r.value + '</span></span></div>';
        }).join('') + '</div>'
      : '<p class="muted small">Chưa có dữ liệu.</p>';
    return '<figure class="chart sheet"><figcaption><h3 class="h3">' + title + '</h3>' + (sub ? '<p class="small muted">' + sub + '</p>' : '') + '</figcaption>' + body +
      tableView(['Mục', unit], rows.map(function (r) { return [esc(r.label), r.value]; })) + '</figure>';
  }
  /* Biểu đồ cột theo ngày: chỉ ghi số ở cột cao nhất và ngày cuối */
  function columns(title, sub, rows, unit) {
    var max = Math.max.apply(null, [1].concat(rows.map(function (r) { return r.value; }))), iMax = -1, best = -1;
    rows.forEach(function (r, i) { if (r.value > best) { best = r.value; iMax = i; } });
    var nice = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
    return '<figure class="chart sheet"><figcaption><h3 class="h3">' + title + '</h3>' + (sub ? '<p class="small muted">' + sub + '</p>' : '') + '</figcaption>' +
      '<div class="colchart"><div class="col-axis"><span>' + nice + '</span><span>' + Math.round(nice / 2) + '</span><span>0</span></div><div class="cols">' + rows.map(function (r, i) {
        var showVal = r.value > 0 && (i === iMax || i === rows.length - 1);
        return '<div class="col" tabindex="0" data-tip="' + esc(r.full + ': ' + r.value + ' ' + unit) + '"><span class="col-plot"><span class="col-bar" style="height:' + (r.value / nice * 100).toFixed(1) + '%">' + (showVal ? '<span class="col-val">' + r.value + '</span>' : '') + '</span></span><span class="col-x">' + esc(r.label) + '</span></div>';
      }).join('') + '</div></div>' +
      tableView(['Ngày', unit], rows.map(function (r) { return [esc(r.full), r.value]; })) + '</figure>';
  }
  function tabStats(box) {
    var U = DB.users(), uids = Object.keys(U), att = DB.attempts(), st = DB.stats(), qr = DB.qr(), C = D();
    var starts = 0; Object.keys(st.starts).forEach(function (k) { starts += st.starts[k]; });
    var all = DB.progressAll(), badges = 0; Object.keys(all).forEach(function (k) { badges += Object.keys(all[k].badges || {}).length; });
    var games = []; C.zones.forEach(function (z) { (z.games || []).concat(z.challenge ? [z.challenge] : []).forEach(function (g) { games.push({ g: g, z: z }); }); });
    var byGame = {}; att.forEach(function (a) { var x = byGame[a.gameId] = byGame[a.gameId] || { n: 0, sum: 0, three: 0 }; x.n++; x.sum += a.pct || 0; if (a.stars === 3) x.three++; });
    var gameRows = games.map(function (x) { return { label: x.g.title, value: (byGame[x.g.id] || { n: 0 }).n, tip: x.z.name }; }).sort(function (a, b) { return b.value - a.value; });
    var zoneRows = C.zones.map(function (z) { return { label: z.name, value: st.zoneVisits[z.id] || 0, tip: att.filter(function (a) { return a.zoneId === z.id; }).length + ' lượt chơi' }; });
    var days = []; for (var i = 13; i >= 0; i--) { var t = Date.now() - i * 864e5, key = EC.today(t), d = new Date(t); days.push({ label: d.getDate() + '/' + (d.getMonth() + 1), full: EC.fmtDate(t), value: st.days[key] || 0 }); }
    var qrBy = {}; qr.forEach(function (q) { qrBy[q.code] = (qrBy[q.code] || 0) + 1; });
    box.innerHTML = '<div class="stack" style="gap:18px">' +
      tiles([['Tổng số người chơi', uids.length, 'hồ sơ trên máy này'], ['Tổng lượt truy cập', st.visits, 'mỗi phiên mở trang tính 1 lượt'], ['Lượt vào bằng mã QR', qr.length],
        ['Tổng lượt chơi', att.length, 'lượt chơi đến hết'], ['Tỷ lệ hoàn thành trò chơi', starts ? Math.round(att.length / starts * 100) + '%' : '–', att.length + ' hoàn thành / ' + starts + ' lượt mở'], ['Huy hiệu đã trao', badges]]) +
      '<div class="chart-grid">' +
        hbars('Trò chơi phổ biến', 'Số lượt chơi đến hết, mọi người chơi trên máy này', gameRows.slice(0, 10), 'lượt chơi') +
        hbars('Khu vực được yêu thích', 'Số lượt mở trang vùng đất', zoneRows, 'lượt mở') +
      '</div>' +
      columns('Lượt truy cập 14 ngày gần nhất', 'Mỗi phiên mở trang tính một lượt', days, 'lượt') +
      '<div class="sheet"><h3 class="h3">Tỷ lệ hoàn thành và kết quả theo trò chơi</h3><div class="tablebox"><table class="mattable"><thead><tr><th>Trò chơi</th><th>Vùng đất</th><th>Lượt mở</th><th>Lượt hoàn thành</th><th>Tỷ lệ hoàn thành</th><th>Điểm trung bình</th><th>Đạt 3 sao</th></tr></thead><tbody>' +
        games.map(function (x) { var b = byGame[x.g.id] || { n: 0, sum: 0, three: 0 }, s = st.starts[x.g.id] || 0; return '<tr><td><b>' + esc(x.g.title) + '</b></td><td>' + esc(x.z.name) + '</td><td class="n">' + s + '</td><td class="n">' + b.n + '</td><td class="n">' + (s ? Math.min(100, Math.round(b.n / s * 100)) + '%' : '–') + '</td><td class="n">' + (b.n ? Math.round(b.sum / b.n) + '%' : '–') + '</td><td class="n">' + (b.n ? Math.round(b.three / b.n * 100) + '%' : '–') + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>' +
      '<div class="sheet"><h3 class="h3">Lượt vào bằng mã QR theo mã</h3>' + (qr.length ? '<div class="tablebox"><table class="mattable"><thead><tr><th>Mã</th><th>Số lượt</th><th>Lần gần nhất</th></tr></thead><tbody>' +
        Object.keys(qrBy).sort(function (a, b) { return qrBy[b] - qrBy[a]; }).map(function (k) { var last = qr.filter(function (q) { return q.code === k; }).pop(); return '<tr><td><b>' + esc(k) + '</b></td><td class="n">' + qrBy[k] + '</td><td>' + EC.fmtDate(last.at, true) + '</td></tr>'; }).join('') +
        '</tbody></table></div>' : '<p class="muted small">Chưa có lượt quét. Mã QR in từ trang <a href="#ma-qr">In thẻ mã QR</a> có gắn mã để đếm.</p>') + '</div>' +
      '</div>';
  }

  /* ================= NGƯỜI CHƠI ================= */
  function playerRows() {
    var U = DB.users(), Pf = DB.profiles();
    return Object.keys(U).map(function (id) {
      var u = U[id], p = Pf[id] || { displayName: u.username }, prog = DB.progress(id), T = EC.totals(prog), lv = EC.levelOf(prog.xp);
      return { u: u, p: p, prog: prog, T: T, lv: lv };
    }).sort(function (a, b) { return (b.u.lastLogin || 0) - (a.u.lastLogin || 0); });
  }
  function tabPlayers(box, re) {
    var rows = playerRows(), q = ui.search.trim().toLowerCase();
    var shown = q ? rows.filter(function (r) { return (r.p.displayName + ' ' + r.u.username + ' ' + (r.p.playerName || '')).toLowerCase().indexOf(q) >= 0; }) : rows;
    box.innerHTML = '<div class="stack" style="gap:14px"><div class="row"><label class="field" style="flex:1;min-width:220px"><span class="f-lbl">Tìm người chơi</span><input id="pl-q" value="' + esc(ui.search) + '" placeholder="Tên hiển thị, tên đăng nhập..."></label><span class="score">' + shown.length + '/' + rows.length + ' hồ sơ</span></div>' +
      (rows.length ? '<div class="tablebox"><table class="mattable ptable"><thead><tr><th>Người chơi</th><th>Tên đăng nhập</th><th>Cấp · XP</th><th>Sao</th><th>Huy hiệu</th><th>Đăng nhập gần nhất</th><th>Trạng thái</th><th>Quyền</th><th>Thao tác</th></tr></thead><tbody>' +
        shown.map(function (r) {
          return '<tr data-uid="' + r.u.id + '"><td><span class="pcell">' + EC.avatarHTML(r.p, 36) + '<b>' + esc(r.p.displayName) + '</b></span>' + (r.p.ageGroup ? '<span class="small muted">' + esc(r.p.ageGroup) + '</span>' : '') + '</td><td>' + esc(r.u.username) + '</td>' +
            '<td>' + (r.lv.idx + 1) + ' · ' + r.prog.xp + '</td><td class="n">' + r.T.stars + '</td><td class="n">' + r.T.badges + '/' + r.T.zones + '</td><td>' + EC.fmtDate(r.u.lastLogin, true) + '</td>' +
            '<td>' + (r.u.locked ? '<span class="chip chip-lock">Đang khóa</span>' : '<span class="chip chip-done">Hoạt động</span>') + '</td>' +
            '<td><select data-role aria-label="Quyền của ' + esc(r.p.displayName) + '"><option value="player"' + (r.u.role !== 'admin' ? ' selected' : '') + '>Người chơi</option><option value="admin"' + (r.u.role === 'admin' ? ' selected' : '') + '>Quản trị</option></select></td>' +
            '<td class="acts"><button class="btn btn-sm" type="button" data-view>Xem</button><button class="btn btn-sm btn-ghost" type="button" data-lock>' + (r.u.locked ? 'Mở khóa' : 'Khóa') + '</button><button class="btn btn-sm btn-ghost" type="button" data-pw>Đặt lại mật khẩu</button><button class="btn btn-sm btn-ghost" type="button" data-reset>Xóa tiến trình</button><button class="btn btn-sm c-den" type="button" data-del>Xóa</button></td></tr>';
        }).join('') + '</tbody></table></div>' : '<p class="muted">Chưa có hồ sơ nào trên máy này.</p>') + '</div>';
    var qi = $('#pl-q'); qi.addEventListener('input', function () { ui.search = qi.value; var pos = qi.selectionStart; re(); var n = $('#pl-q'); n.focus(); try { n.setSelectionRange(pos, pos); } catch (e) { /* bỏ qua */ } });
    function rowOf(b) { var uid = b.closest('tr').getAttribute('data-uid'); return rows.filter(function (r) { return r.u.id === uid; })[0]; }
    click('[data-view]', function (b) { viewPlayer(rowOf(b)); }, box);
    click('[data-lock]', function (b) { var r = rowOf(b); EC.auth.setLocked(r.u.id, !r.u.locked); EC.toast(r.u.locked ? 'Đã mở khóa' : 'Đã khóa hồ sơ'); re(); }, box);
    $$('[data-role]', box).forEach(function (s) { s.addEventListener('change', function () { var r = rowOf(s); r.u.role = s.value; DB.save('users'); EC.toast('Đã đổi quyền của ' + r.p.displayName); }); });
    click('[data-pw]', function (b) {
      var r = rowOf(b);
      EC.modal('<h2 id="modal-title">Đặt lại mật khẩu</h2><p>Cho hồ sơ <b>' + esc(r.p.displayName) + '</b> (' + esc(r.u.username) + ')</p><form id="pw-reset" class="stack">' + inp('pw-n', 'Mật khẩu mới (ít nhất 4 ký tự)', '', { type: 'text', attrs: ' autocomplete="off"' }) +
        '<p class="form-msg" id="pw-m" role="alert"></p><div class="row"><button class="btn" type="submit">Lưu</button><button class="btn btn-ghost" type="button" data-close>Hủy</button></div></form>');
      $('#pw-reset').addEventListener('submit', function (e) { e.preventDefault(); if (v('pw-n').length < 4) { $('#pw-m').textContent = 'Cần ít nhất 4 ký tự.'; return; } EC.auth.setPassword(r.u.id, v('pw-n')); EC.closeModal(); EC.toast('Đã đặt lại mật khẩu'); });
    }, box);
    click('[data-reset]', function (b) {
      if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn?'; return; }
      var r = rowOf(b); DB.progressAll()[r.u.id] = DB.newProgress(); DB.save('progress'); EC.toast('Đã xóa tiến trình của ' + r.p.displayName); re();
    }, box);
    click('[data-del]', function (b) {
      if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Xóa vĩnh viễn?'; return; }
      var r = rowOf(b); EC.auth.deleteAccount(r.u.id); EC.toast('Đã xóa hồ sơ ' + r.p.displayName); re();
    }, box);
  }
  function viewPlayer(r) {
    var hist = DB.attemptsOf(r.u.id).slice(-10).reverse();
    EC.modal('<div class="pview">' + EC.avatarHTML(r.p, 80) + '<h2 id="modal-title">' + esc(r.p.displayName) + '</h2><p class="small muted">' + esc(r.u.username) + (r.p.playerName ? ' · ' + esc(r.p.playerName) : '') + (r.p.ageGroup ? ' · ' + esc(r.p.ageGroup) : '') + ' · tạo ngày ' + EC.fmtDate(r.u.createdAt) + '</p>' +
      '<p><b>Cấp ' + (r.lv.idx + 1) + '</b> ' + esc(r.lv.name) + ' · ' + r.prog.xp + ' XP · ' + r.T.stars + ' sao · ' + r.T.badges + ' huy hiệu</p>' +
      '<div class="tablebox"><table class="mattable"><thead><tr><th>Vùng đất</th><th>%</th><th>Bài học</th><th>Trò chơi</th><th>Huy hiệu</th></tr></thead><tbody>' + EC.zones().map(function (z) { var s = EC.zoneStats(z, r.prog); return '<tr><td>' + esc(z.name) + '</td><td class="n">' + s.pct + '%</td><td class="n">' + s.lessonsDone + '/' + s.lessonsTotal + '</td><td class="n">' + s.gamesDone + '/' + s.gamesTotal + '</td><td>' + (s.badge ? '✓' : '–') + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<h3 class="h3" style="margin-top:12px">10 lượt chơi gần nhất</h3>' + (hist.length ? '<div class="tablebox"><table class="mattable"><tbody>' + hist.map(function (a) { var f = EC.gameById(a.gameId); return '<tr><td>' + EC.fmtDate(a.at, true) + '</td><td>' + esc(f ? f.game.title : a.gameId) + '</td><td class="n">' + a.score + '/' + a.max + '</td><td>' + EC.starsHTML(a.stars) + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="muted small">Chưa chơi.</p>') +
      '<div class="row"><button class="btn" type="button" data-close>Đóng</button></div></div>');
  }

  /* ================= VÙNG ĐẤT & BÀI HỌC ================= */
  function tabZones(box, re) {
    var C = D(), z = C.zones.filter(function (x) { return x.id === ui.zone; })[0] || C.zones[0];
    if (!z) { box.innerHTML = '<p>Chưa có vùng đất.</p><button class="btn" id="z-add">+ Thêm khu vực</button>'; $('#z-add').addEventListener('click', addZone); return; }
    ui.zone = z.id;
    var L = z.lessons || (z.lessons = []), le = L.filter(function (l) { return l.id === ui.lesson; })[0];
    box.innerHTML = '<div class="stack" style="gap:16px">' +
      '<div class="row">' + C.zones.map(function (x) { return '<button class="chip c-' + x.color + (x.id === z.id ? ' on' : '') + '" type="button" data-z="' + x.id + '">' + esc(x.name) + (x.hidden ? ' (ẩn)' : '') + '</button>'; }).join('') + '<button class="btn btn-sm" type="button" id="z-add">+ Thêm khu vực</button></div>' +
      '<form class="sheet form stack" id="z-form" novalidate><div class="row" style="justify-content:space-between"><h2 class="h3">Thông tin vùng đất</h2><span class="small muted">Mã: ' + esc(z.id) + '</span></div>' +
        '<div class="fgrid">' + inp('z-name', 'Tên vùng đất', z.name) + inp('z-place', 'Biểu tượng / địa điểm', z.place) +
          inp('z-color', 'Màu nhận diện', z.color, { select: COLORS }) + inp('z-char', 'Nhân vật hướng dẫn', z.char, { select: CHARS }) +
          inp('z-cname', 'Tên nhân vật', z.charName) + inp('z-crole', 'Vai trò nhân vật', z.charRole) +
          inp('z-bname', 'Tên huy hiệu', z.badge.name) + inp('z-bicon', 'Hình huy hiệu (mã hình)', z.badge.icon, { list: 'art-ids' }) + '</div>' +
        inp('z-short', 'Mô tả ngắn', z.short, { area: true, rows: 2 }) + inp('z-hello', 'Lời chào của nhân vật', z.hello, { area: true, rows: 2 }) +
        inp('z-story', 'Cốt truyện (mỗi dòng một đoạn)', (z.story || []).join('\n'), { area: true, rows: 3 }) +
        inp('z-learn', 'Bé sẽ khám phá (mỗi dòng một ý)', (z.learn || []).join('\n'), { area: true, rows: 3 }) +
        inp('z-hidden', 'Ẩn vùng đất này với người chơi', z.hidden, { check: true }) +
        '<div class="row"><button class="btn" type="submit">Lưu vùng đất</button>' + (z.custom ? '<button class="btn btn-sm c-den" type="button" id="z-del">Xóa vùng đất</button>' : '') + '<a class="btn btn-sm btn-ghost" href="#vung/' + z.id + '" target="_blank">Xem thử</a></div></form>' +
      '<div class="sheet stack"><div class="row" style="justify-content:space-between"><h2 class="h3">Bài học (' + L.length + ')</h2><button class="btn btn-sm" type="button" id="l-add">+ Thêm bài học</button></div>' +
        (L.length ? '<ol class="adlist">' + L.map(function (l, i) { return '<li class="' + (le === l ? 'on' : '') + '"><span class="adl-art">' + (Array.isArray(l.vis) ? EC.pic(l.vis[0]) : l.img ? EC.pic(l.img) : A.thing('b-story')) + '</span><b>' + esc(l.title) + '</b><span class="row" style="gap:4px"><button class="btn btn-sm btn-ghost" type="button" data-up="' + i + '" aria-label="Lên">↑</button><button class="btn btn-sm btn-ghost" type="button" data-down="' + i + '" aria-label="Xuống">↓</button><button class="btn btn-sm" type="button" data-edit="' + l.id + '">Sửa</button><button class="btn btn-sm btn-ghost" type="button" data-ldel="' + i + '">Xóa</button></span></li>'; }).join('') + '</ol>' : '<p class="muted small">Chưa có bài học.</p>') +
        (le ? lessonForm(le) : '') +
      '</div></div>';
    click('[data-z]', function (b) { ui.zone = b.getAttribute('data-z'); ui.lesson = null; re(); }, box);
    $('#z-add').addEventListener('click', addZone);
    $('#z-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!v('z-name').trim()) { EC.toast('Tên vùng đất không được trống'); return; }
      z.name = v('z-name').trim(); z.place = v('z-place').trim(); z.color = v('z-color'); z.char = v('z-char'); z.charName = v('z-cname').trim(); z.charRole = v('z-crole').trim();
      z.badge = { name: v('z-bname').trim() || 'Huy hiệu ' + z.name, icon: v('z-bicon').trim() || 'b-star' };
      z.short = v('z-short').trim(); z.hello = v('z-hello').trim(); z.story = lines(v('z-story')); z.learn = lines(v('z-learn')); z.hidden = on('z-hidden');
      if (saveDraft('Đã lưu vùng đất')) re();
    });
    if ($('#z-del')) $('#z-del').addEventListener('click', function () {
      var b = $('#z-del'); if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Xóa cả bài học, trò chơi?'; return; }
      C.zones.splice(C.zones.indexOf(z), 1); ui.zone = null; if (saveDraft('Đã xóa vùng đất')) re();
    });
    $('#l-add').addEventListener('click', function () {
      var id = uniqueId(slug(z.id) + '-bai-' + (L.length + 1), allIds());
      L.push({ id: id, title: 'Bài học mới', vis: ['leaf'], text: 'Nội dung bài học.', quiz: { q: 'Câu hỏi?', a: ['Đáp án đúng', 'Đáp án sai'], ok: 0, ex: '' } });
      ui.lesson = id; if (saveDraft('Đã thêm bài học')) re();
    });
    click('[data-edit]', function (b) { ui.lesson = ui.lesson === b.getAttribute('data-edit') ? null : b.getAttribute('data-edit'); re(); }, box);
    click('[data-up]', function (b) { var i = +b.getAttribute('data-up'); if (i > 0) { L.splice(i - 1, 0, L.splice(i, 1)[0]); if (saveDraft('Đã đổi thứ tự')) re(); } }, box);
    click('[data-down]', function (b) { var i = +b.getAttribute('data-down'); if (i < L.length - 1) { L.splice(i + 1, 0, L.splice(i, 1)[0]); if (saveDraft('Đã đổi thứ tự')) re(); } }, box);
    click('[data-ldel]', function (b) { if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn?'; return; } L.splice(+b.getAttribute('data-ldel'), 1); ui.lesson = null; if (saveDraft('Đã xóa bài học')) re(); }, box);
    if (le) $('#l-form').addEventListener('submit', function (e) {
      e.preventDefault();
      le.title = v('l-title').trim() || 'Bài học'; le.text = v('l-text').trim();
      var vis = v('l-vis').trim(); le.vis = A.hasVis(vis) ? vis : vis.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
      le.img = v('l-img').trim() || undefined; le.audio = v('l-audio').trim() || undefined;
      le.link = v('l-lhref').trim() ? { href: v('l-lhref').trim(), label: v('l-llabel').trim() || 'Xem thêm' } : undefined;
      var ans = lines(v('l-qa'));
      le.quiz = v('l-q').trim() && ans.length >= 2 ? { q: v('l-q').trim(), a: ans, ok: Math.min(ans.length - 1, Math.max(0, num('l-qok', 1) - 1)), ex: v('l-qex').trim() } : undefined;
      if (saveDraft('Đã lưu bài học')) re();
    });
    function addZone() {
      var name = 'Vùng đất mới', id = uniqueId('vung-moi', allIds());
      C.zones.push({ id: id, custom: true, name: name, color: 'nghe', place: 'Vùng đất mới', char: 'besap', charName: 'Bé Sáp', charRole: 'Người dẫn đường',
        short: 'Mô tả ngắn về vùng đất.', learn: [], hello: 'Chào bé!', story: [], badge: { name: 'Huy hiệu ' + name, icon: 'b-star' }, lessons: [], games: [],
        challenge: { id: uniqueId('tong-ket-' + id, allIds()), type: 'quiz', title: 'Thử thách: ' + name, desc: 'Trả lời các câu hỏi.', pts: 10, count: 5, questions: [] } });
      ui.zone = id; ui.lesson = null; if (saveDraft('Đã thêm vùng đất. Nhớ thêm bài học và câu hỏi thử thách.')) re();
    }
  }
  function lessonForm(l) {
    var q = l.quiz || { q: '', a: [], ok: 0, ex: '' };
    return '<form class="sheet-flat form stack" id="l-form" novalidate><h3 class="h3">Sửa bài học: ' + esc(l.title) + '</h3>' +
      inp('l-title', 'Tên bài học', l.title) +
      inp('l-text', 'Nội dung giải thích ngắn', l.text, { area: true, rows: 4, hint: 'Câu ngắn, dễ hiểu. Nút loa sẽ đọc to nội dung này.' }) +
      '<div class="fgrid">' + inp('l-vis', 'Hình minh họa', Array.isArray(l.vis) ? l.vis.join(', ') : (l.vis || ''), { hint: 'Mã hình cách nhau dấu phẩy (VD: tomato, leaf) hoặc một hình bài học: ' + A.VIS_KEYS.join(', ') }) +
        inp('l-img', 'Hoặc đường dẫn ảnh riêng', l.img || '', { hint: 'VD: images/bai1.png (chép ảnh vào thư mục images/)' }) +
        inp('l-audio', 'Âm thanh đọc bài (không bắt buộc)', l.audio || '', { hint: 'VD: audio/bai1.mp3. Không có thì dùng giọng đọc của máy.' }) +
        inp('l-lhref', 'Liên kết thêm (không bắt buộc)', l.link ? l.link.href : '', { hint: 'VD: #vuon-mau' }) + inp('l-llabel', 'Chữ trên nút liên kết', l.link ? l.link.label : '') + '</div>' +
      '<fieldset class="adfs"><legend>Câu hỏi nhỏ kiểm tra kiến thức</legend>' + inp('l-q', 'Câu hỏi', q.q) + inp('l-qa', 'Các đáp án (mỗi dòng một đáp án)', (q.a || []).join('\n'), { area: true, rows: 3 }) +
        '<div class="fgrid">' + inp('l-qok', 'Đáp án đúng là dòng số', (q.ok || 0) + 1, { type: 'number', attrs: ' min="1" max="6"' }) + inp('l-qex', 'Giải thích', q.ex) + '</div></fieldset>' +
      '<div class="row"><button class="btn" type="submit">Lưu bài học</button><a class="btn btn-sm btn-ghost" href="#bai-hoc/' + l.id + '" target="_blank">Xem thử</a></div></form>';
  }

  /* ================= TRÒ CHƠI & CÂU HỎI ================= */
  var COMMON = ['id', 'type', 'title', 'desc', 'icon', 'pts', 'count', 'enabled', 'custom', 'questions', 'perBin'];
  function defaultGame(id) {
    var zs = EC.DEFAULT_CONTENT.zones;
    for (var i = 0; i < zs.length; i++) {
      var g = (zs[i].games || []).filter(function (x) { return x.id === id; })[0]; if (g) return g;
      if (zs[i].challenge && zs[i].challenge.id === id) return zs[i].challenge;
    }
    return null;
  }
  function tabGames(box, re) {
    var C = D(), z = C.zones.filter(function (x) { return x.id === ui.zone; })[0] || C.zones[0];
    if (!z) { box.innerHTML = '<p>Chưa có vùng đất.</p>'; return; }
    ui.zone = z.id;
    var list = (z.games || []).concat(z.challenge ? [z.challenge] : []), g = list.filter(function (x) { return x.id === ui.game; })[0] || null;
    var isQ = g && EC.QUESTION_TYPES.indexOf(g.type) >= 0, isCh = g && g === z.challenge;
    var S2 = C.settings;
    box.innerHTML = '<div class="stack" style="gap:16px">' +
      '<div class="row">' + C.zones.map(function (x) { return '<button class="chip c-' + x.color + (x.id === z.id ? ' on' : '') + '" type="button" data-z="' + x.id + '">' + esc(x.name) + '</button>'; }).join('') + '</div>' +
      '<div class="sheet stack"><div class="row" style="justify-content:space-between"><h2 class="h3">Trò chơi của ' + esc(z.name) + '</h2><span class="small muted">Sao: dưới ' + S2.stars[0] + '% → 1 sao · ' + S2.stars[0] + '–' + S2.stars[1] + '% → 2 sao · từ ' + S2.stars[1] + '% → 3 sao (sửa ở tab Thành tích)</span></div>' +
        '<ol class="adlist">' + list.map(function (x) {
          return '<li class="' + (x === g ? 'on' : '') + '"><span class="adl-art">' + EC.pic(x.icon || (x === z.challenge ? 'b-star' : 'b-quiz')) + '</span><span class="stack" style="gap:2px;min-width:0"><b>' + esc(x.title) + (x.enabled === false ? ' (đang tắt)' : '') + '</b><span class="small muted">' + (x === z.challenge ? 'Thử thách tổng kết · ' : '') + esc(EC.GAME_TYPE_NAMES[x.type] || x.type) + ' · ' + (x.pts || 10) + ' điểm/câu' + (x.questions ? ' · ' + x.questions.length + ' câu hỏi' : '') + '</span></span>' +
            '<span class="row" style="gap:4px"><button class="btn btn-sm" type="button" data-g="' + x.id + '">Sửa</button><a class="btn btn-sm btn-ghost" href="#choi/' + x.id + '" target="_blank">Chơi thử</a></span></li>';
        }).join('') + '</ol>' +
        '<form class="row add-game" id="g-add"><span class="f-lbl">Thêm trò chơi mới:</span><select id="g-type" aria-label="Kiểu trò chơi"><option value="quiz">Trắc nghiệm</option><option value="tf">Đúng / Sai</option><option value="hero">Tình huống</option></select><input id="g-title" placeholder="Tên trò chơi" aria-label="Tên trò chơi"><button class="btn btn-sm" type="submit">+ Thêm</button></form>' +
      '</div>' +
      (g ? gameForm(g, isQ, isCh) : '<p class="muted">Chọn một trò chơi để sửa câu hỏi, đáp án, điểm.</p>') +
      '</div>';
    click('[data-z]', function (b) { ui.zone = b.getAttribute('data-z'); ui.game = null; ui.q = null; re(); }, box);
    click('[data-g]', function (b) { ui.game = ui.game === b.getAttribute('data-g') ? null : b.getAttribute('data-g'); ui.q = null; re(); }, box);
    $('#g-add').addEventListener('submit', function (e) {
      e.preventDefault();
      var t = v('g-title').trim(); if (!t) { EC.toast('Nhập tên trò chơi'); return; }
      var id = uniqueId(slug(t), allIds());
      (z.games = z.games || []).push({ id: id, custom: true, type: v('g-type'), title: t, desc: 'Mô tả trò chơi.', icon: 'b-quiz', pts: 10, count: 8, questions: [] });
      ui.game = id; if (saveDraft('Đã thêm trò chơi. Thêm câu hỏi ở bên dưới nhé.')) re();
    });
    if (!g) return;
    $('#gf').addEventListener('submit', function (e) {
      e.preventDefault();
      g.title = v('gf-title').trim() || g.title; g.desc = v('gf-desc').trim(); g.icon = v('gf-icon').trim() || g.icon;
      g.pts = Math.max(1, Math.round(num('gf-pts', 10)));
      if ($('#gf-count')) g.count = Math.max(1, Math.round(num('gf-count', g.count || 8)));
      if ($('#gf-per')) g.perBin = Math.max(1, Math.min(4, Math.round(num('gf-per', 3))));
      if (!isCh) g.enabled = on('gf-on');
      if (saveDraft('Đã lưu trò chơi')) re();
    });
    if ($('#gf-del')) $('#gf-del').addEventListener('click', function () {
      var b = $('#gf-del'); if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn xóa?'; return; }
      z.games.splice(z.games.indexOf(g), 1); ui.game = null; if (saveDraft('Đã xóa trò chơi')) re();
    });
    if (isQ) {
      var Q = g.questions = g.questions || [], qe = ui.q != null ? Q[ui.q] : null;
      $('#q-add').addEventListener('click', function () {
        Q.push(g.type === 'tf' ? { q: 'Câu khẳng định mới.', a: ['Đúng', 'Sai'], ok: 0, ex: '', tf: true } : { q: 'Câu hỏi mới?', a: ['Đáp án đúng', 'Đáp án sai', 'Đáp án sai'], ok: 0, ex: '' });
        ui.q = Q.length - 1; if (saveDraft('Đã thêm câu hỏi')) re();
      });
      click('[data-q]', function (b) { var i = +b.getAttribute('data-q'); ui.q = ui.q === i ? null : i; re(); }, box);
      click('[data-qdel]', function (b) { if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn?'; return; } Q.splice(+b.getAttribute('data-qdel'), 1); ui.q = null; if (saveDraft('Đã xóa câu hỏi')) re(); }, box);
      if (qe) $('#qf').addEventListener('submit', function (e) {
        e.preventDefault();
        var tf = g.type === 'tf' || qe.tf, ans = tf ? ['Đúng', 'Sai'] : lines(v('qf-a'));
        if (!v('qf-q').trim() || ans.length < 2) { EC.toast('Cần câu hỏi và ít nhất 2 đáp án'); return; }
        qe.q = v('qf-q').trim(); qe.a = ans; qe.ok = tf ? (v('qf-tf') === 'sai' ? 1 : 0) : Math.min(ans.length - 1, Math.max(0, num('qf-ok', 1) - 1));
        qe.ex = v('qf-ex').trim(); qe.art = v('qf-art').trim() || undefined;
        var pics = v('qf-pics').split(',').map(function (s) { return s.trim(); }).filter(Boolean); qe.pics = !tf && pics.length === ans.length ? pics : undefined;
        if (tf) qe.tf = true;
        if (saveDraft('Đã lưu câu hỏi')) re();
      });
    } else {
      $('#gj-save').addEventListener('click', function () {
        var obj; try { obj = JSON.parse(v('gj')); } catch (err) { $('#gj-msg').textContent = 'Dữ liệu chưa đúng định dạng JSON: ' + err.message; return; }
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) { $('#gj-msg').textContent = 'Dữ liệu phải là một đối tượng { ... }.'; return; }
        Object.keys(g).forEach(function (k) { if (COMMON.indexOf(k) < 0) delete g[k]; });
        Object.keys(obj).forEach(function (k) { if (COMMON.indexOf(k) < 0) g[k] = obj[k]; });
        if (saveDraft('Đã lưu dữ liệu trò chơi')) re();
      });
      $('#gj-reset').addEventListener('click', function () {
        var d0 = defaultGame(g.id); if (!d0) { EC.toast('Trò này không có dữ liệu gốc'); return; }
        Object.keys(g).forEach(function (k) { if (COMMON.indexOf(k) < 0) delete g[k]; });
        Object.keys(d0).forEach(function (k) { if (COMMON.indexOf(k) < 0) g[k] = EC.clone(d0[k]); });
        if (saveDraft('Đã khôi phục dữ liệu gốc')) re();
      });
    }
  }
  function gameForm(g, isQ, isCh) {
    var hasCount = ['rescue', 'hide', 'mixlab', 'invent', 'tf', 'hero', 'quiz'].indexOf(g.type) >= 0;
    var out = '<form class="sheet form stack" id="gf" novalidate><div class="row" style="justify-content:space-between"><h2 class="h3">' + esc(g.title) + '</h2><span class="small muted">' + esc(EC.GAME_TYPE_NAMES[g.type] || g.type) + ' · mã ' + esc(g.id) + '</span></div>' +
      '<div class="fgrid">' + inp('gf-title', 'Tên trò chơi', g.title) + inp('gf-icon', 'Hình đại diện (mã hình)', g.icon || '', { list: 'art-ids' }) +
        inp('gf-pts', 'Điểm cho mỗi câu / lượt đúng', g.pts || 10, { type: 'number', attrs: ' min="1" max="100"' }) +
        (hasCount ? inp('gf-count', 'Số câu / lượt mỗi lần chơi', g.count || 8, { type: 'number', attrs: ' min="1" max="30"' }) : '') +
        (g.type === 'sort' ? inp('gf-per', 'Số món rác mỗi thùng', g.perBin || 3, { type: 'number', attrs: ' min="1" max="4"' }) : '') + '</div>' +
      inp('gf-desc', 'Mô tả / hướng dẫn ngắn', g.desc, { area: true, rows: 2 }) +
      (isCh ? '<p class="small muted">Thử thách tổng kết luôn bật. Bé cần đạt số sao tối thiểu (tab Thành tích) để được tính là vượt qua.</p>' : inp('gf-on', 'Bật trò chơi này', g.enabled !== false, { check: true })) +
      '<div class="row"><button class="btn" type="submit">Lưu</button>' + (g.custom ? '<button class="btn btn-sm c-den" type="button" id="gf-del">Xóa trò chơi</button>' : '') + '</div></form>';
    if (isQ) {
      var Q = g.questions || [], qe = ui.q != null ? Q[ui.q] : null;
      out += '<div class="sheet stack"><div class="row" style="justify-content:space-between"><h3 class="h3">Câu hỏi (' + Q.length + ')</h3><button class="btn btn-sm" type="button" id="q-add">+ Thêm câu hỏi</button></div>' +
        (Q.length ? '<ol class="adlist qlist">' + Q.map(function (q, i) { return '<li class="' + (qe === q ? 'on' : '') + '"><span class="stack" style="gap:2px;min-width:0"><b>' + esc(q.q) + '</b><span class="small muted">Đúng: ' + esc(q.a[q.ok || 0]) + ' · ' + q.a.length + ' đáp án</span></span><span class="row" style="gap:4px"><button class="btn btn-sm" type="button" data-q="' + i + '">Sửa</button><button class="btn btn-sm btn-ghost" type="button" data-qdel="' + i + '">Xóa</button></span></li>'; }).join('') + '</ol>' : '<p class="muted small">Chưa có câu hỏi.</p>') +
        (qe ? questionForm(g, qe) : '') + '</div>';
    } else {
      var data = {}; Object.keys(g).forEach(function (k) { if (COMMON.indexOf(k) < 0) data[k] = g[k]; });
      out += '<div class="sheet stack"><h3 class="h3">Dữ liệu trò chơi</h3><p class="small muted">Danh sách vật thể, đáp án đúng và cấu hình riêng của trò này (định dạng JSON). Mã hình xem ở ô gợi ý của các trường “mã hình”. Sửa cẩn thận rồi bấm Kiểm tra &amp; lưu.</p>' +
        '<textarea id="gj" class="mono" rows="16" spellcheck="false" aria-label="Dữ liệu trò chơi">' + esc(JSON.stringify(data, null, 2)) + '</textarea>' +
        '<p class="form-msg" id="gj-msg" role="alert"></p><div class="row"><button class="btn" type="button" id="gj-save">Kiểm tra &amp; lưu</button><button class="btn btn-sm btn-ghost" type="button" id="gj-reset">Khôi phục dữ liệu gốc</button></div></div>';
    }
    return out;
  }
  function questionForm(g, q) {
    var tf = g.type === 'tf' || q.tf;
    return '<form class="sheet-flat form stack" id="qf" novalidate>' + inp('qf-q', tf ? 'Câu khẳng định' : g.type === 'hero' ? 'Tình huống' : 'Câu hỏi', q.q, { area: true, rows: 2 }) +
      (tf ? inp('qf-tf', 'Câu này', q.ok === 1 ? 'sai' : 'dung', { select: [['dung', 'Đúng'], ['sai', 'Sai']] })
        : inp('qf-a', 'Các đáp án (mỗi dòng một đáp án)', q.a.join('\n'), { area: true, rows: 4 }) + '<div class="fgrid">' + inp('qf-ok', 'Đáp án đúng là dòng số', (q.ok || 0) + 1, { type: 'number', attrs: ' min="1" max="6"' }) +
          inp('qf-pics', 'Hình cho từng đáp án (không bắt buộc)', (q.pics || []).join(', '), { hint: 'Mã hình cách nhau dấu phẩy, đủ số đáp án.' }) + '</div>') +
      '<div class="fgrid">' + inp('qf-ex', 'Giải thích đáp án', q.ex) + inp('qf-art', 'Hình minh họa câu hỏi (không bắt buộc)', q.art || '', { list: 'art-ids' }) + '</div>' +
      '<div class="row"><button class="btn" type="submit">Lưu câu hỏi</button></div></form>';
  }

  /* ================= THÀNH TÍCH ================= */
  function tabAchieve(box, re) {
    var C = D(), S2 = C.settings;
    var RT = [['free', 'Có sẵn'], ['stars', 'Đạt số sao'], ['xp', 'Đạt số XP'], ['level', 'Lên cấp'], ['badge', 'Nhận huy hiệu vùng'], ['badges', 'Nhận số huy hiệu'], ['game', 'Hoàn thành trò chơi'], ['title', 'Danh hiệu cuối cùng']];
    var KINDS = [['char', 'Nhân vật'], ['frame', 'Khung ảnh'], ['theme', 'Trang trí hộ chiếu'], ['deco', 'Trang trí bản đồ']];
    function ruleVal(r) { return r.t === 'badge' ? r.zone : r.t === 'game' ? r.id + (r.stars ? ':' + r.stars : '') : r.n != null ? r.n : ''; }
    var players = playerRows();
    box.innerHTML = '<div class="stack" style="gap:16px">' +
      '<form class="sheet form stack" id="sc-form" novalidate><h2 class="h3">Điểm, sao và điều kiện huy hiệu</h2><div class="fgrid">' +
        inp('sc-s2', '% tối thiểu để đạt 2 sao', S2.stars[0], { type: 'number', attrs: ' min="1" max="99"' }) + inp('sc-s3', '% tối thiểu để đạt 3 sao', S2.stars[1], { type: 'number', attrs: ' min="2" max="100"' }) +
        inp('sc-xl', 'XP khi xem bài học mới', S2.xpLesson, { type: 'number', attrs: ' min="0"' }) + inp('sc-xq', 'XP khi đúng câu hỏi nhỏ', S2.xpLessonQuiz, { type: 'number', attrs: ' min="0"' }) +
        inp('sc-xp', 'XP thưởng mỗi lượt chơi', S2.xpPlay, { type: 'number', attrs: ' min="0"' }) + inp('sc-xpl', 'Số lượt được thưởng mỗi trò', S2.xpPlayLimit, { type: 'number', attrs: ' min="0"' }) +
        inp('sc-bg', 'Số trò chơi cần hoàn thành để nhận huy hiệu', S2.badgeGames, { type: 'number', attrs: ' min="0" max="10"' }) + inp('sc-bc', 'Số sao tối thiểu ở thử thách tổng kết', S2.badgeChallengeStars, { type: 'number', attrs: ' min="1" max="3"' }) +
      '</div><p class="small muted">XP của một lượt chơi = phần điểm vượt kỷ lục cũ + XP thưởng mỗi lượt. Tên và hình huy hiệu sửa ở tab Vùng đất.</p><div class="row"><button class="btn" type="submit">Lưu quy tắc</button></div></form>' +
      '<form class="sheet form stack" id="lv-form" novalidate><h2 class="h3">Cấp độ người chơi</h2><div class="tablebox"><table class="mattable"><thead><tr><th>Cấp</th><th>Tên cấp độ</th><th>XP cần có</th><th></th></tr></thead><tbody>' +
        C.levels.map(function (l, i) { return '<tr><td class="n">' + (i + 1) + '</td><td><input id="lv-n' + i + '" value="' + esc(l.name) + '" aria-label="Tên cấp ' + (i + 1) + '"></td><td><input id="lv-x' + i + '" type="number" min="0" value="' + l.xp + '"' + (i === 0 ? ' disabled' : '') + ' aria-label="XP cấp ' + (i + 1) + '"></td><td>' + (i > 0 && C.levels.length > 2 ? '<button class="btn btn-sm btn-ghost" type="button" data-lvdel="' + i + '">Xóa</button>' : '') + '</td></tr>'; }).join('') +
      '</tbody></table></div><div class="row"><button class="btn" type="submit">Lưu cấp độ</button><button class="btn btn-sm btn-ghost" type="button" id="lv-add">+ Thêm cấp</button></div></form>' +
      '<form class="sheet form stack" id="rw-form" novalidate><h2 class="h3">Vật phẩm mở khóa</h2><p class="small muted">Giá trị điều kiện: số (sao, XP, cấp, số huy hiệu), mã vùng đất (VD: sac-mau), hoặc mã trò chơi (VD: giai-cuu-mau, thêm :3 nếu cần 3 sao).</p><div class="tablebox"><table class="mattable rwtable"><thead><tr><th></th><th>Tên</th><th>Loại</th><th>Mã hình</th><th>Điều kiện</th><th>Giá trị</th><th></th></tr></thead><tbody>' +
        C.rewards.map(function (r, i) {
          return '<tr><td>' + EC.rewardArt(r) + '</td><td><input id="rw-n' + i + '" value="' + esc(r.name) + '" aria-label="Tên vật phẩm"></td><td><select id="rw-k' + i + '" aria-label="Loại">' + KINDS.map(function (k) { return '<option value="' + k[0] + '"' + (k[0] === r.kind ? ' selected' : '') + '>' + k[1] + '</option>'; }).join('') + '</select></td>' +
            '<td><input id="rw-a' + i + '" value="' + esc(r.art || '') + '" list="art-ids" aria-label="Mã hình"></td><td><select id="rw-t' + i + '" aria-label="Điều kiện">' + RT.map(function (t) { return '<option value="' + t[0] + '"' + (t[0] === r.rule.t ? ' selected' : '') + '>' + t[1] + '</option>'; }).join('') + '</select></td>' +
            '<td><input id="rw-v' + i + '" value="' + esc(ruleVal(r.rule)) + '" aria-label="Giá trị điều kiện"></td><td><button class="btn btn-sm btn-ghost" type="button" data-rwdel="' + i + '">Xóa</button></td></tr>';
        }).join('') + '</tbody></table></div><div class="row"><button class="btn" type="submit">Lưu vật phẩm</button><button class="btn btn-sm btn-ghost" type="button" id="rw-add">+ Thêm vật phẩm</button></div></form>' +
      '<div class="sheet"><h2 class="h3">Theo dõi tiến độ người chơi</h2>' + (players.length ? '<div class="tablebox"><table class="mattable"><thead><tr><th>Người chơi</th><th>Cấp</th><th>XP</th><th>Sao</th>' + EC.zones().map(function (z) { return '<th>' + esc(z.name) + '</th>'; }).join('') + '<th>Danh hiệu</th></tr></thead><tbody>' +
        players.map(function (r) { return '<tr><td><b>' + esc(r.p.displayName) + '</b></td><td class="n">' + (r.lv.idx + 1) + '</td><td class="n">' + r.prog.xp + '</td><td class="n">' + r.T.stars + '</td>' + EC.zones().map(function (z) { var s = EC.zoneStats(z, r.prog); return '<td class="n">' + s.pct + '%' + (s.badge ? ' ✓' : '') + '</td>'; }).join('') + '<td>' + (r.prog.title ? '✓' : '–') + '</td></tr>'; }).join('') +
        '</tbody></table></div>' : '<p class="muted small">Chưa có hồ sơ nào.</p>') + '</div>' +
      '</div>';
    $('#sc-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var s2 = Math.round(num('sc-s2', 50)), s3 = Math.round(num('sc-s3', 80));
      if (!(s2 > 0 && s2 < s3 && s3 <= 100)) { EC.toast('Cần: 0 < % 2 sao < % 3 sao ≤ 100'); return; }
      S2.stars = [s2, s3]; S2.xpLesson = num('sc-xl', 5); S2.xpLessonQuiz = num('sc-xq', 5); S2.xpPlay = num('sc-xp', 2); S2.xpPlayLimit = num('sc-xpl', 5);
      S2.badgeGames = Math.round(num('sc-bg', 3)); S2.badgeChallengeStars = Math.min(3, Math.max(1, Math.round(num('sc-bc', 2))));
      if (saveDraft('Đã lưu quy tắc')) re();
    });
    function readLevels() { C.levels.forEach(function (l, i) { l.name = v('lv-n' + i).trim() || l.name; l.xp = i === 0 ? 0 : Math.max(0, Math.round(num('lv-x' + i, l.xp))); }); }
    $('#lv-form').addEventListener('submit', function (e) {
      e.preventDefault(); readLevels();
      for (var i = 1; i < C.levels.length; i++) if (C.levels[i].xp <= C.levels[i - 1].xp) { EC.toast('XP của mỗi cấp phải lớn hơn cấp trước'); return; }
      if (saveDraft('Đã lưu cấp độ')) re();
    });
    $('#lv-add').addEventListener('click', function () { readLevels(); var last = C.levels[C.levels.length - 1]; C.levels.push({ name: 'Cấp mới', xp: last.xp + 500 }); if (saveDraft('Đã thêm cấp')) re(); });
    click('[data-lvdel]', function (b) { readLevels(); C.levels.splice(+b.getAttribute('data-lvdel'), 1); if (saveDraft('Đã xóa cấp')) re(); }, box);
    function readRewards() {
      C.rewards.forEach(function (r, i) {
        r.name = v('rw-n' + i).trim() || r.name; r.kind = v('rw-k' + i); r.art = v('rw-a' + i).trim();
        var t = v('rw-t' + i), val = v('rw-v' + i).trim(), rule = { t: t };
        if (t === 'badge') rule.zone = val; else if (t === 'game') { var p2 = val.split(':'); rule.id = p2[0]; if (p2[1]) rule.stars = +p2[1]; } else if (t !== 'free' && t !== 'title') rule.n = +val || 1;
        r.rule = rule;
      });
    }
    $('#rw-form').addEventListener('submit', function (e) { e.preventDefault(); readRewards(); if (saveDraft('Đã lưu vật phẩm')) re(); });
    $('#rw-add').addEventListener('click', function () { readRewards(); C.rewards.push({ id: uniqueId('vat-pham', C.rewards.map(function (r) { return r.id; })), kind: 'deco', art: 'b-star', name: 'Vật phẩm mới', rule: { t: 'stars', n: 10 } }); if (saveDraft('Đã thêm vật phẩm')) re(); });
    click('[data-rwdel]', function (b) { readRewards(); C.rewards.splice(+b.getAttribute('data-rwdel'), 1); if (saveDraft('Đã xóa vật phẩm')) re(); }, box);
  }

  /* ================= TÁC PHẨM ================= */
  function tabArt(box, re) {
    box.innerHTML = '<p class="muted">Đang tải tranh…</p>';
    var Pf = DB.profiles();
    EC.gallery.list().then(function (L) {
      var owners = {}; L.forEach(function (a) { owners[a.owner] = (owners[a.owner] || 0) + 1; });
      var shown = ui.artOwner ? L.filter(function (a) { return a.owner === ui.artOwner; }) : L;
      function who(id) { return id === 'guest' ? 'Chơi thử' : (Pf[id] ? Pf[id].displayName : 'Hồ sơ đã xóa'); }
      box.innerHTML = '<div class="stack" style="gap:14px"><div class="row"><label class="field"><span class="f-lbl">Lọc theo người chơi</span><select id="ar-own"><option value="">Tất cả (' + L.length + ')</option>' +
        Object.keys(owners).map(function (o) { return '<option value="' + esc(o) + '"' + (o === ui.artOwner ? ' selected' : '') + '>' + esc(who(o)) + ' (' + owners[o] + ')</option>'; }).join('') + '</select></label></div>' +
        (shown.length ? '<div class="artgrid">' + shown.map(function (a) {
          return '<figure class="artcard sheet"><img src="' + esc(a.thumb || a.img) + '" alt="' + esc(a.title) + '"><figcaption class="stack" style="gap:4px"><b>' + esc(a.title) + '</b><span class="small muted">' + esc(who(a.owner)) + ' · ' + EC.fmtDate(a.createdAt, true) + '</span><button class="btn btn-sm btn-ghost" type="button" data-adel="' + esc(a.id) + '">Xóa</button></figcaption></figure>';
        }).join('') + '</div>' : '<p class="muted">Chưa có tranh nào.</p>') + '</div>';
      $('#ar-own').addEventListener('change', function () { ui.artOwner = v('ar-own'); re(); });
      click('[data-adel]', function (b) { if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn?'; return; } EC.gallery.remove(b.getAttribute('data-adel')).then(function () { EC.toast('Đã xóa tranh'); re(); }); }, box);
    });
  }

  /* ================= DỮ LIỆU ================= */
  function tabData(box, re) {
    var C = D(), U = DB.users(), all = DB.progressAll(), att = DB.attempts();
    var lessons = 0, games = 0, questions = 0, answers = 0, pBadges = 0, pRewards = 0;
    C.zones.forEach(function (z) {
      lessons += (z.lessons || []).length;
      (z.games || []).concat(z.challenge ? [z.challenge] : []).forEach(function (g) { games++; (g.questions || []).forEach(function (q) { questions++; answers += (q.a || []).length; }); });
      (z.lessons || []).forEach(function (l) { if (l.quiz) { questions++; answers += l.quiz.a.length; } });
    });
    Object.keys(all).forEach(function (k) { pBadges += Object.keys(all[k].badges || {}).length; pRewards += Object.keys(all[k].rewards || {}).length; });
    var TB = [
      ['Users', 'Thông tin tài khoản: tên đăng nhập, mật khẩu đã băm, quyền, khóa/mở', 'localStorage · db.users', Object.keys(U).length],
      ['PlayerProfiles', 'Hồ sơ người chơi: tên hiển thị, nhóm tuổi, ảnh đại diện, khung, trang trí', 'localStorage · db.profiles', Object.keys(DB.profiles()).length],
      ['Zones', 'Thông tin vùng đất, nhân vật, cốt truyện', 'Nội dung · zones', C.zones.length],
      ['Lessons', 'Nội dung bài học', 'Nội dung · zones[].lessons', lessons],
      ['Games', 'Trò chơi và thử thách tổng kết', 'Nội dung · zones[].games, challenge', games],
      ['Questions', 'Câu hỏi trò chơi và câu hỏi nhỏ trong bài học', 'Nội dung · questions, quiz', questions],
      ['Answers', 'Các đáp án (kèm đáp án đúng)', 'Nội dung · questions[].a, ok', answers],
      ['GameAttempts', 'Lịch sử chơi: điểm, sao, thời gian từng lượt', 'localStorage · db.attempts', att.length],
      ['PlayerProgress', 'Tiến độ: XP, bài học đã xem, kết quả tốt nhất từng trò', 'localStorage · db.progress', Object.keys(all).length],
      ['Badges', 'Danh sách huy hiệu (mỗi vùng đất một huy hiệu)', 'Nội dung · zones[].badge', C.zones.length],
      ['PlayerBadges', 'Huy hiệu người chơi đã nhận', 'localStorage · db.progress[].badges', pBadges],
      ['Rewards', 'Vật phẩm: nhân vật, khung ảnh, trang trí', 'Nội dung · rewards', C.rewards.length],
      ['PlayerRewards', 'Vật phẩm người chơi đã mở khóa', 'localStorage · db.progress[].rewards', pRewards],
      ['Artwork', 'Tranh trẻ đã tạo', 'IndexedDB · ecocrayon/artworks', '<span id="art-count">…</span>'],
      ['QRAccess', 'Lượt vào trang bằng mã QR', 'localStorage · db.qr', DB.qr().length]
    ];
    var c = C.settings.contact;
    box.innerHTML = '<div class="stack" style="gap:16px">' +
      '<div class="sheet"><h2 class="h3">Cơ sở dữ liệu</h2><p class="small muted">Trang là web tĩnh nên dữ liệu lưu trong trình duyệt. Tên bảng giữ đúng thiết kế để sau này chuyển sang máy chủ (VD: Firebase, Supabase) dễ dàng.</p><div class="tablebox"><table class="mattable"><thead><tr><th>Bảng</th><th>Chức năng</th><th>Nơi lưu</th><th>Số bản ghi</th></tr></thead><tbody>' +
        TB.map(function (t) { return '<tr><td><b>' + t[0] + '</b></td><td>' + t[1] + '</td><td class="small">' + t[2] + '</td><td class="n">' + t[3] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
        '<p class="small"><b>Quan hệ:</b> một vùng đất có nhiều bài học và nhiều trò chơi · một trò chơi có nhiều câu hỏi · một người chơi có một hồ sơ tiến độ, nhiều lượt chơi, nhiều huy hiệu, nhiều tác phẩm.</p></div>' +
      '<div class="sheet stack"><h2 class="h3">Xuất bản nội dung cho mọi máy</h2><p>' + (EC.contentIsLocal() ? 'Máy này đang dùng <b>nội dung đã chỉnh sửa</b>.' : 'Máy này đang dùng nội dung gốc' + (EC.CONTENT_FILE ? ' từ file js/content.js.' : '.')) + ' Muốn mọi người dùng thấy nội dung mới: bấm <b>Xuất file nội dung</b>, chép file <code>content.js</code> tải về đè lên <code>js/content.js</code> trong thư mục trang web rồi đăng lại.</p>' +
        '<div class="row"><button class="btn" type="button" id="d-pub">Xuất file nội dung (content.js)</button><button class="btn btn-sm btn-ghost" type="button" id="d-reset">Bỏ chỉnh sửa trên máy này</button></div></div>' +
      '<form class="sheet form stack" id="ct-form" novalidate><h2 class="h3">Thông tin liên hệ (chân trang)</h2><div class="fgrid">' +
        inp('ct-org', 'Tên nhóm / đơn vị', c.org) + inp('ct-email', 'Email', c.email, { type: 'email' }) + inp('ct-phone', 'Điện thoại', c.phone) + inp('ct-addr', 'Địa chỉ', c.address) + inp('ct-fb', 'Trang mạng xã hội (https://...)', c.facebook, { type: 'url' }) +
        '</div><div class="row"><button class="btn" type="submit">Lưu liên hệ</button></div></form>' +
      '<div class="sheet stack"><h2 class="h3">Sao lưu và khôi phục</h2><p class="small muted">Bản sao lưu gồm tài khoản, hồ sơ, tiến trình, lịch sử chơi, thống kê và nội dung đã chỉnh (chưa gồm ảnh tranh). Dùng để chuyển dữ liệu sang máy khác.</p>' +
        '<div class="row"><button class="btn" type="button" id="d-bak">Tải bản sao lưu</button><label class="btn btn-ghost btn-sm file-btn">Khôi phục từ file…<input type="file" id="d-imp" accept="application/json,.json" hidden></label></div></div>' +
      '<form class="sheet form stack" id="ap-form" novalidate><h2 class="h3">Đổi mật khẩu quản trị</h2><div class="fgrid">' + inp('ap-1', 'Mật khẩu mới (ít nhất 6 ký tự)', '', { type: 'password', attrs: ' autocomplete="new-password"' }) + inp('ap-2', 'Nhập lại', '', { type: 'password', attrs: ' autocomplete="new-password"' }) + '</div><div class="row"><button class="btn" type="submit">Đổi mật khẩu</button></div></form>' +
      '<div class="sheet stack danger"><h2 class="h3">Xóa toàn bộ dữ liệu người chơi</h2><p>Xóa mọi hồ sơ, tiến trình, lịch sử chơi và thống kê trên máy này. Không thể hoàn tác. Nên tải bản sao lưu trước.</p><div class="row"><input id="wipe-c" placeholder="Gõ XOA để xác nhận" aria-label="Gõ XOA để xác nhận"><button class="btn btn-sm c-den" type="button" id="d-wipe">Xóa toàn bộ</button></div></div>' +
      '</div>';
    EC.gallery.list().then(function (L) { var e = $('#art-count'); if (e) e.textContent = L.length; });
    $('#d-pub').addEventListener('click', function () {
      var txt = '/* ECOCRAYON – nội dung xuất từ trang Quản trị ngày ' + EC.fmtDate(Date.now(), true) + '.\n   Chép file này đè lên js/content.js rồi đăng lại trang web. */\nwindow.EC = window.EC || {};\nEC.CONTENT_FILE = ' + JSON.stringify(EC.content(), null, 1) + ';\n';
      EC.download('content.js', new Blob([txt], { type: 'text/javascript;charset=utf-8' }));
    });
    $('#d-reset').addEventListener('click', function () {
      var b = $('#d-reset'); if (!b.getAttribute('data-sure')) { b.setAttribute('data-sure', '1'); b.textContent = 'Chắc chắn bỏ mọi chỉnh sửa?'; return; }
      EC.resetContent(); draft = null; EC.toast('Đã trở về nội dung gốc'); re();
    });
    $('#ct-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var fb = v('ct-fb').trim(); if (fb && !/^https?:\/\//.test(fb)) { EC.toast('Địa chỉ mạng xã hội cần bắt đầu bằng https://'); return; }
      C.settings.contact = { org: v('ct-org').trim(), email: v('ct-email').trim(), phone: v('ct-phone').trim(), address: v('ct-addr').trim(), facebook: fb };
      if (saveDraft('Đã lưu thông tin liên hệ')) re();
    });
    $('#d-bak').addEventListener('click', function () { EC.download('ecocrayon-sao-luu-' + EC.today() + '.json', new Blob([JSON.stringify(DB.exportAll(), null, 1)], { type: 'application/json' })); });
    $('#d-imp').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try { DB.importAll(JSON.parse(rd.result)); draft = null; EC.toast('Đã khôi phục dữ liệu'); EC.renderChrome(); re(); }
        catch (err) { EC.toast('Không khôi phục được: ' + err.message); }
      };
      rd.readAsText(f);
    });
    $('#ap-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (v('ap-1').length < 6) { EC.toast('Mật khẩu cần ít nhất 6 ký tự'); return; }
      if (v('ap-1') !== v('ap-2')) { EC.toast('Hai lần nhập chưa giống nhau'); return; }
      EC.adminAuth.setPin(v('ap-1')); EC.toast('Đã đổi mật khẩu quản trị'); re();
    });
    $('#d-wipe').addEventListener('click', function () {
      if (v('wipe-c').trim().toUpperCase() !== 'XOA') { EC.toast('Gõ XOA để xác nhận'); return; }
      DB.wipePlayers(); EC.gallery.list().then(function (L) { return Promise.all(L.map(function (a) { return EC.gallery.remove(a.id); })); });
      EC.toast('Đã xóa toàn bộ dữ liệu người chơi'); EC.renderChrome(); re();
    });
  }
})();
