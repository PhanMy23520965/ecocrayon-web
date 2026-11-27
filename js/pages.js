/* ECOCRAYON – trang Hướng dẫn, Chính sách bảo mật, Điều khoản sử dụng. */
(function () {
  'use strict';
  var $ = EC.$, $$ = EC.$$, esc = EC.esc, A = EC.art;

  function contactHTML() {
    var c = EC.content().settings.contact, out = [];
    out.push('<b>' + esc(c.org || 'Nhóm dự án ECOCRAYON') + '</b>');
    if (c.email) out.push('Email: <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>');
    if (c.phone) out.push('Điện thoại: ' + esc(c.phone));
    if (c.address) out.push(esc(c.address));
    if (!c.email && !c.phone) out.push('Thông tin liên hệ đang được cập nhật. Phụ huynh có thể liên hệ qua giáo viên hoặc nơi mua sản phẩm.');
    return out.join('<br>');
  }

  /* ================= HƯỚNG DẪN ================= */
  EC.route('huong-dan', function (view) {
    var C = EC.content(), S2 = C.settings, zs = EC.zones();
    var codes = [['KHAMPHA', 'Bản đồ 4 vùng đất']].concat(zs.map(function (z) { return [EC.zoneCode(z.id), z.name]; }).filter(function (x) { return x[0]; }))
      .concat(EC.COLORS.map(function (c) { return [c.code, 'Trang màu ' + c.color.toLowerCase() + ' – ' + c.name]; }))
      .concat([['TAICHE', 'Góc tái chế'], ['TOMAU', 'Sổ tô màu']]);
    var SEC = [
      { ico: 'k-crayon', t: 'ECOCRAYON là gì?', b: '<p>ECOCRAYON là bộ bút sáp lấy màu từ rau củ, đựng trong hộp giấy tái chế, kèm sổ tô màu và thẻ màu có mã QR. Mã QR mở ra <b>thế giới khám phá</b> trên trang web này: 4 vùng đất, 12 trò chơi và hộ chiếu ghi lại thành tích của bé.</p><p><a href="#ve-ecocrayon">Xem giới thiệu sản phẩm ›</a></p>' },
      { ico: 'k-qr', t: 'Cách quét mã QR', b: '<ol><li>Mở ứng dụng máy ảnh trên điện thoại hoặc máy tính bảng.</li><li>Hướng máy vào mã QR trên hộp bút hoặc trên thẻ màu, giữ yên 1–2 giây.</li><li>Chạm vào đường dẫn hiện ra trên màn hình. Trang mở đúng vùng đất hoặc màu sáp của thẻ đó.</li><li>Không quét được: gõ <b>mã chữ</b> in trên thẻ vào ô “Nhập mã trên thẻ” ở cuối trang.</li></ol>' +
        '<div class="tablebox"><table class="mattable"><thead><tr><th>Mã chữ</th><th>Mở trang</th></tr></thead><tbody>' + codes.map(function (c) { return '<tr><td><b>' + c[0] + '</b></td><td>' + esc(c[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>' },
      { ico: 'i-map', t: 'Cách vào thế giới khám phá', b: '<ol><li>Ở trang chủ, bấm <b>Bắt đầu khám phá</b> (hoặc mục Khám phá trên thanh menu).</li><li>Bản đồ hiện ra 4 vùng đất. <b>Vùng nào cũng mở sẵn</b>, bé chọn chủ đề mình thích, không cần theo thứ tự.</li><li>Trong mỗi vùng đất có: câu chuyện, nhân vật dẫn đường, bài học ngắn, 3 trò chơi và 1 thử thách tổng kết.</li></ol>' +
        '<div class="row">' + zs.map(function (z) { return '<a class="chip c-' + z.color + '" href="#vung/' + z.id + '">' + esc(z.name) + '</a>'; }).join('') + '</div>' },
      { ico: 'i-passport', t: 'Cách tạo tài khoản', b: '<p>Bé chơi thử được ngay. Muốn lưu sao, huy hiệu và mở Hộ chiếu, phụ huynh hoặc thầy cô giúp bé tạo hồ sơ:</p><ol><li>Bấm <b>Đăng nhập / Đăng ký</b> ở góc trên, chọn <b>Tạo hồ sơ mới</b>.</li><li>Điền <b>tên hiển thị</b> (biệt danh, không cần tên thật), chọn ảnh đại diện.</li><li>Chọn <b>tên đăng nhập</b> và <b>mật khẩu</b> (ít nhất 4 ký tự). Người lớn nên ghi nhớ giúp bé.</li><li>Người lớn đánh dấu ô <b>đồng ý</b> rồi bấm Tạo hồ sơ. Tiến trình chơi thử được chuyển vào hồ sơ mới.</li></ol><p class="note">Máy dùng chung ở lớp: mỗi bé một hồ sơ, không chọn “Ghi nhớ đăng nhập” và bấm Đăng xuất khi xong lượt.</p><p><a class="btn btn-sm" href="#dang-ky">Tạo hồ sơ ngay</a></p>' },
      { ico: 'b-cards', t: 'Cách chơi trò chơi', b: '<ul><li>Mỗi vùng đất có 3 trò chơi và 1 thử thách tổng kết. Mỗi trò ngắn, <b>không tính giờ</b>.</li><li>Nhân vật dẫn đường (Mầm Xanh, Giáo sư ECO, Rô-bốt Tái Chế, Bạn Trái Đất) gợi ý và giải thích sau mỗi câu trả lời.</li><li>Bé chạm để chọn. Trò kéo thả (phân loại rác, pha màu, xây khu rừng) cũng chơi được bằng cách chạm vật rồi chạm chỗ cần đặt.</li><li>Nút loa cạnh lời nhân vật đọc to nội dung (khi máy có giọng tiếng Việt). Nút loa ở góc trên bật/tắt nhạc.</li><li>Thanh tiến trình phía trên cho biết bé đã đi được bao xa.</li></ul><p><a href="#tro-choi">Xem tất cả trò chơi ›</a></p>' },
      { ico: 'b-star', t: 'Cách nhận điểm và sao', b: '<ul><li>Mỗi câu hoặc mỗi lượt đúng được <b>' + 10 + ' điểm</b>. Đúng ở lần thử thứ hai được nửa số điểm.</li><li>Hết trò, bé nhận sao theo phần trăm điểm:</li></ul>' +
        '<table class="star-rule"><tr><td>' + EC.starsHTML(1) + '</td><td>dưới ' + S2.stars[0] + '%</td></tr><tr><td>' + EC.starsHTML(2) + '</td><td>từ ' + S2.stars[0] + '% đến dưới ' + S2.stars[1] + '%</td></tr><tr><td>' + EC.starsHTML(3) + '</td><td>từ ' + S2.stars[1] + '% trở lên</td></tr></table>' +
        '<ul><li><b>Điểm kinh nghiệm (XP)</b>: xem một bài học mới +' + S2.xpLesson + ' XP, trả lời đúng câu hỏi nhỏ +' + S2.xpLessonQuiz + ' XP, mỗi lượt chơi +' + S2.xpPlay + ' XP (' + S2.xpPlayLimit + ' lượt đầu của mỗi trò), cộng thêm phần điểm vượt kỷ lục cũ.</li><li>Chơi lại bao nhiêu lần cũng được. Hệ thống giữ <b>số sao cao nhất</b>.</li></ul>' },
      { ico: 'i-passport', t: 'Cách sử dụng hộ chiếu', b: '<ul><li>Hộ chiếu ghi tên, ảnh đại diện, cấp độ, tổng XP, tổng sao, số huy hiệu và số khu vực đã hoàn thành.</li><li><b>Huy hiệu</b>: hoàn thành ' + S2.badgeGames + ' trò chơi và vượt qua thử thách tổng kết (từ ' + S2.badgeChallengeStars + ' sao) của một vùng đất.</li></ul>' +
        '<div class="tablebox"><table class="mattable"><thead><tr><th>Vùng đất</th><th>Huy hiệu</th></tr></thead><tbody>' + zs.map(function (z) { return '<tr><td>' + esc(z.name) + '</td><td><b>' + esc(z.badge.name) + '</b></td></tr>'; }).join('') + '</tbody></table></div>' +
        '<div class="tablebox"><table class="mattable"><thead><tr><th>Cấp độ</th><th>Cần có</th></tr></thead><tbody>' + C.levels.map(function (l, i) { return '<tr><td><b>Cấp ' + (i + 1) + ':</b> ' + esc(l.name) + '</td><td>' + l.xp + ' XP</td></tr>'; }).join('') + '</tbody></table></div>' +
        '<p>Nhận đủ ' + zs.length + ' huy hiệu, bé trở thành <b>NHÀ KHÁM PHÁ ECOCRAYON</b> và tải được chứng nhận điện tử.</p><p><a href="#ho-chieu">Mở hộ chiếu ›</a></p>' },
      { ico: 'b-story', t: 'Cách xem thành tích', b: '<ul><li><b>Hộ chiếu</b>: huy hiệu, cấp độ, phần trăm hoàn thành từng vùng đất, cây của bé.</li><li><b>Hồ sơ</b>: tiến trình từng vùng đất, lịch sử 30 lượt chơi gần nhất (điểm, số sao).</li><li><b>Bộ sưu tập</b>: tranh, đồ phát minh, thẻ nhân vật, vật phẩm mở khóa (nhân vật, khung ảnh, trang trí hộ chiếu, trang trí bản đồ).</li><li>Thầy cô xem tiến độ cả lớp trên cùng một máy ở trang <a href="#quan-tri">Quản trị</a>.</li></ul>' },
      { ico: 'b-crayon', t: 'Cách lưu tranh', b: '<ol><li>Vào trò <a href="#choi/hoa-si-nhi">Họa sĩ nhí tài ba</a> (Phòng thí nghiệm phép thuật) hoặc trang <a href="#to-mau">Tô màu tự do</a>.</li><li>Chọn tranh, chọn màu, chạm vào từng vùng để tô. Nút <b>Hoàn tác</b> và <b>Làm lại</b> giúp sửa tranh.</li><li>Bấm <b>Hoàn thành &amp; lưu tranh</b> (hoặc <b>Lưu vào bộ sưu tập</b>).</li><li>Vào <a href="#bo-suu-tap">Bộ sưu tập</a> để xem tranh, đặt tên, xem ngày vẽ, tải về hoặc xóa.</li></ol>' }
    ];
    view.innerHTML = '<section class="section"><div class="wrap stack" style="gap:20px">' +
      EC.head({ title: 'Hướng dẫn', lead: 'Dành cho bé và phụ huynh: từ quét mã QR đến nhận danh hiệu Nhà khám phá.', sc: '--c-la-dua', side: '<a class="btn btn-sm btn-ghost" href="#phu-huynh">Góc phụ huynh &amp; giáo viên</a>' }) +
      EC.mascotLine('Chạm vào từng mục để xem cách làm nhé!', 'happy', 'guide-m') +
      '<nav class="row guide-nav" aria-label="Các mục hướng dẫn">' + SEC.map(function (s, i) { return '<a class="chip" href="#huong-dan" data-go="' + i + '">' + (i + 1) + '. ' + esc(s.t) + '</a>'; }).join('') + '</nav>' +
      '<div class="guide">' + SEC.map(function (s, i) {
        return '<details class="guide-item sheet" id="hd-' + i + '"' + (i === 0 ? ' open' : '') + '><summary><span class="g-n">' + (i + 1) + '</span>' + A.thing(s.ico) + '<h2 class="h3">' + esc(s.t) + '</h2></summary><div class="guide-body prose">' + s.b + '</div></details>';
      }).join('') + '</div></div></section>';
    $$('[data-go]', view).forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); var d = $('#hd-' + a.getAttribute('data-go')); d.open = true; d.scrollIntoView({ behavior: 'smooth', block: 'start' }); $('summary', d).focus({ preventScroll: true }); });
    });
  }, 'Hướng dẫn');

  /* ================= CHÍNH SÁCH BẢO MẬT ================= */
  EC.route('bao-mat', function (view) {
    var rows = [
      ['Tên hiển thị', 'Bắt buộc. Là biệt danh, không cần tên thật.'],
      ['Tên của bé', 'Không bắt buộc. Chỉ dùng để in trên chứng nhận.'],
      ['Nhóm tuổi', 'Không bắt buộc. Giúp thầy cô chọn hoạt động phù hợp.'],
      ['Ảnh đại diện', 'Chọn từ hình vẽ sẵn. Trang không xin và không lưu ảnh thật của bé.'],
      ['Tên đăng nhập, mật khẩu', 'Mật khẩu được băm một chiều (SHA-256 kèm chuỗi ngẫu nhiên), không lưu mật khẩu gốc.'],
      ['Tiến trình', 'Điểm, sao, XP, huy hiệu, bài học đã xem, lịch sử chơi, vật phẩm đã mở khóa.'],
      ['Tranh của bé', 'Ảnh tranh bé lưu vào Bộ sưu tập.'],
      ['Thống kê chung', 'Chỉ đếm số: lượt truy cập, lượt quét mã QR, lượt chơi từng trò. Không gắn với tên bé.']
    ];
    view.innerHTML = '<section class="section"><div class="wrap stack prose-page" style="gap:20px">' +
      EC.head({ title: 'Chính sách bảo mật', lead: 'ECOCRAYON được làm cho trẻ em nên thu thập ít thông tin nhất có thể.', sc: '--c-dau-biec' }) +
      '<div class="sheet prose"><h2 class="h3">Tóm tắt</h2><ul class="ticks">' +
        '<li>Mọi dữ liệu chỉ nằm trong trình duyệt của máy đang dùng. Trang <b>không gửi dữ liệu của bé lên máy chủ</b>.</li>' +
        '<li>Không quảng cáo, không công cụ theo dõi, không bán hay chia sẻ dữ liệu với bên thứ ba.</li>' +
        '<li>Không có bảng xếp hạng công khai. Thành tích của bé chỉ hiện trong hồ sơ của bé.</li>' +
        '<li>Tạo hồ sơ cần <b>phụ huynh hoặc giáo viên đồng ý</b>.</li></ul></div>' +
      '<div class="sheet prose"><h2 class="h3">Thông tin được lưu</h2><div class="tablebox"><table class="mattable"><thead><tr><th>Thông tin</th><th>Ghi chú</th></tr></thead><tbody>' +
        rows.map(function (r) { return '<tr><td><b>' + r[0] + '</b></td><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="sheet prose"><h2 class="h3">Lưu ở đâu, trong bao lâu</h2><p>Dữ liệu lưu bằng bộ nhớ của trình duyệt (localStorage và IndexedDB) trên chính máy đó, cho tới khi phụ huynh xóa hồ sơ hoặc xóa dữ liệu duyệt web. Đổi sang máy khác thì máy mới không có dữ liệu cũ.</p>' +
        '<p>Riêng phông chữ của trang được tải từ dịch vụ Google Fonts; khi đó máy chủ của Google nhận được địa chỉ IP của thiết bị như mọi lần tải trang web. Nếu chặn phông chữ này, trang vẫn chạy bằng phông có sẵn của máy.</p></div>' +
      '<div class="sheet prose"><h2 class="h3">Quyền của phụ huynh</h2><ul><li><b>Xem</b>: trang Hồ sơ và Hộ chiếu hiển thị toàn bộ thông tin và tiến trình của bé.</li><li><b>Tải về</b>: nút “Tải dữ liệu của bé” trong trang Hồ sơ.</li><li><b>Sửa</b>: nút “Sửa thông tin” trong trang Hồ sơ.</li><li><b>Xóa</b>: nút “Xóa hồ sơ này” xóa vĩnh viễn hồ sơ, điểm, huy hiệu và tranh. Có thể xóa mọi thứ bằng cách xóa dữ liệu trang web trong cài đặt trình duyệt.</li></ul></div>' +
      '<div class="sheet prose"><h2 class="h3">Máy dùng chung và trang Quản trị</h2><p>Ở lớp học, nhiều bé có thể dùng chung một máy. Giáo viên quản lý các hồ sơ trên máy đó ở trang Quản trị (có mật khẩu riêng): xem tiến độ, khóa hoặc xóa hồ sơ, xuất bản sao lưu. Bé nên đăng xuất sau mỗi lượt.</p></div>' +
      '<div class="sheet prose"><h2 class="h3">Liên hệ</h2><p>' + contactHTML() + '</p><p class="small muted">Cập nhật lần cuối: tháng 11/2026.</p></div>' +
      '</div></section>';
  }, 'Chính sách bảo mật');

  /* ================= ĐIỀU KHOẢN SỬ DỤNG ================= */
  EC.route('dieu-khoan', function (view) {
    var T = [
      ['Mục đích', 'Trang web ECOCRAYON là học liệu đi kèm bộ bút sáp, giúp trẻ học về màu sắc thiên nhiên, tái chế và bảo vệ môi trường qua bài học và trò chơi. Trang miễn phí sử dụng.'],
      ['Người dùng', 'Trẻ em sử dụng cùng hoặc dưới sự hướng dẫn của phụ huynh, giáo viên. Người lớn tạo hồ sơ cho trẻ và chịu trách nhiệm giữ mật khẩu.'],
      ['Hồ sơ', 'Mỗi bé dùng một hồ sơ. Không dùng tên hay hình ảnh của người khác để tạo hồ sơ. Quản trị viên có thể khóa hồ sơ khi dùng sai mục đích.'],
      ['Nội dung học tập', 'Kiến thức được viết ngắn gọn, đơn giản cho trẻ nhỏ. Nội dung có thể được nhóm cập nhật, sửa đổi.'],
      ['Sản phẩm mẫu thử', 'Bộ bút ECOCRAYON đang ở giai đoạn mẫu thử. Bút sáp chỉ để vẽ, không ăn được. Trẻ nhỏ dùng bút khi có người lớn bên cạnh. Xem thêm mục An toàn ở trang Phụ huynh & giáo viên.'],
      ['Hoạt động ngoài đời', 'Thử thách xanh và thí nghiệm ở nhà là hoạt động thêm, không bắt buộc để nhận huy hiệu. Các bước cần dao, kéo, đun nấu do người lớn làm.'],
      ['Phần thưởng trong trò chơi', 'Điểm, sao, huy hiệu và vật phẩm là phần thưởng ảo để khích lệ trẻ, không có giá trị tiền, không mua bán hay trao đổi.'],
      ['Tranh của bé', 'Tranh bé tô thuộc về bé và gia đình, được lưu trên máy đang dùng.'],
      ['Thay đổi', 'Điều khoản có thể được cập nhật. Ngày cập nhật ghi ở cuối trang.']
    ];
    view.innerHTML = '<section class="section"><div class="wrap stack prose-page" style="gap:16px">' +
      EC.head({ title: 'Điều khoản sử dụng', sc: '--c-ca-rot' }) +
      T.map(function (t, i) { return '<div class="sheet prose"><h2 class="h3">' + (i + 1) + '. ' + t[0] + '</h2><p>' + t[1] + '</p></div>'; }).join('') +
      '<div class="sheet prose"><h2 class="h3">Liên hệ</h2><p>' + contactHTML() + '</p><p class="small muted">Cập nhật lần cuối: tháng 11/2026. Xem thêm <a href="#bao-mat">Chính sách bảo mật</a>.</p></div>' +
      '</div></section>';
  }, 'Điều khoản sử dụng');
})();
