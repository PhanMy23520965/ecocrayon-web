/* ECOCRAYON – nội dung học tập.
   Toàn bộ chữ trên trang nằm ở file này để nhóm dễ sửa mà không đụng vào code. */
window.EC = window.EC || {};

/* ---------- 6 màu sáp ---------- */
EC.COLORS = [
  {
    id: 'den', hex: '#B8336A', code: 'DEN', name: 'Củ dền', color: 'Đỏ hồng', status: 'core',
    part: 'Rễ củ', pigment: 'Betanin', home: 'Đà Lạt',
    hello: 'Chào bạn! Mình là Củ Dền. Mình cho màu đỏ hồng.',
    facts: ['Lá củ dền cũng ăn được.', 'Cắt củ dền xong, tay sẽ hồng lên!', 'Màu củ dền dễ phai khi gặp nắng.'],
    film: ['Rửa sạch', 'Gọt vỏ, bào nhỏ', 'Ép lấy nước đỏ', 'Sấy thành bột màu', 'Trộn vào sáp ấm', 'Đổ khuôn. Xong!'],
    find: { yes: ['tomato', 'strawberry', 'chili', 'watermelon'], no: ['banana', 'cucumber'] },
    draw: 'Vẽ một đĩa trái cây màu đỏ hồng.',
    task: { id: 'nha-den', text: 'Bỏ vỏ rau củ vào thùng rác hữu cơ.' },
    adult: 'Cắt đôi một củ dền thật cho trẻ xem. Bên trong có các vòng tròn đậm nhạt, giống vân gỗ. Chất màu betanin dễ phai khi gặp nắng và nhiệt cao.'
  },
  {
    id: 'nghe', hex: '#E3A21A', code: 'NGHE', name: 'Nghệ', color: 'Vàng', status: 'core',
    part: 'Thân rễ', pigment: 'Curcumin', home: 'Vườn nhà',
    hello: 'Chào bạn! Mình là Nghệ. Mình cho màu vàng như nắng.',
    facts: ['Nghệ là họ hàng của gừng.', 'Nghệ làm cà ri và xôi có màu vàng.', 'Vết nghệ gặp xà phòng sẽ hóa đỏ!'],
    film: ['Rửa sạch', 'Cạo vỏ, giã nhỏ', 'Lọc lấy nước vàng', 'Phơi thành bột màu', 'Trộn vào sáp ấm', 'Đổ khuôn. Xong!'],
    find: { yes: ['banana', 'corn', 'sunflower', 'mango'], no: ['eggplant', 'leaf'] },
    draw: 'Tìm 3 thứ màu vàng trong nhà rồi vẽ lại.',
    task: { id: 'nha-nghe', text: 'Trời nắng thì tắt bớt đèn.' },
    adult: 'Đặt một lát nghệ tươi lên giấy trắng và miết nhẹ: trẻ sẽ thấy màu vàng đi ra từ củ. Củ nghệ thật ra là thân mọc ngầm dưới đất.'
  },
  {
    id: 'la-dua', hex: '#4C9A3B', code: 'LADUA', name: 'Lá dứa', color: 'Xanh lá', status: 'core',
    part: 'Lá', pigment: 'Diệp lục', home: 'Vườn nhà',
    hello: 'Chào bạn! Mình là Lá Dứa. Mình cho màu xanh lá.',
    facts: ['Lá dứa thơm như cơm mới nấu.', 'Lá xanh nhờ có diệp lục.', 'Lá dứa và quả dứa là hai cây khác nhau!'],
    film: ['Hái lá, rửa sạch', 'Cắt nhỏ', 'Xay, lọc nước xanh', 'Làm khô thành bột', 'Trộn vào sáp ấm', 'Đổ khuôn. Xong!'],
    find: { yes: ['cucumber', 'broccoli', 'leaf', 'lime'], no: ['tomato', 'corn'] },
    draw: 'Vẽ một khu vườn thật nhiều lá.',
    drawLink: { href: '#to-mau', label: 'Tô tranh khu vườn' },
    task: { id: 'nha-la-dua', text: 'Dùng nước vo gạo tưới cây.' },
    adult: 'Cho trẻ vò nát một chiếc lá xanh trên giấy trắng. Vệt xanh để lại chính là diệp lục. Rau ngót, rau muống, cải bó xôi cũng có thể dùng để thử màu xanh.'
  },
  {
    id: 'dau-biec', hex: '#2F62B0', code: 'BIEC', name: 'Hoa đậu biếc', color: 'Xanh dương', status: 'trial',
    part: 'Hoa', pigment: 'Anthocyanin', home: 'Hàng rào',
    hello: 'Chào bạn! Mình là Hoa Đậu Biếc. Mình cho màu xanh dương.',
    facts: ['Hoa đậu biếc nấu xôi xanh rất đẹp.', 'Thêm chanh, nước xanh hóa tím!', 'Cây đậu biếc leo trên hàng rào.'],
    film: ['Hái hoa', 'Phơi khô', 'Ngâm lấy nước xanh', 'Làm khô thành bột', 'Trộn vào sáp ấm', 'Đổ khuôn. Xong!'],
    find: { yes: ['sky', 'wave', 'ing-dau-biec'], no: ['orange', 'banana', 'tomato'] },
    draw: 'Vẽ bầu trời và biển.',
    task: { id: 'nha-dau-biec', text: 'Khóa vòi khi chải răng.' },
    adult: 'Pha nước hoa đậu biếc cùng trẻ rồi vắt vài giọt chanh. Thí nghiệm an toàn, nhưng không cho trẻ uống nước thí nghiệm. Trong tiếng Việt, “xanh” có thể là xanh lá hoặc xanh dương: hãy giúp trẻ phân biệt.',
    lab: 'dau-biec'
  },
  {
    id: 'bap-cai', hex: '#6E3C8F', code: 'BAPCAI', name: 'Bắp cải tím', color: 'Tím', status: 'trial',
    part: 'Lá', pigment: 'Anthocyanin', home: 'Đà Lạt',
    hello: 'Chào bạn! Mình là Bắp Cải Tím. Mình cho màu tím.',
    facts: ['Lá bắp cải cuộn tròn thành bắp.', 'Gặp chanh, nước tím hóa hồng!', 'Gặp muối nở, nước tím hóa xanh!'],
    film: ['Tách lá', 'Thái nhỏ', 'Ngâm lấy nước tím', 'Làm khô thành bột', 'Trộn vào sáp ấm', 'Đổ khuôn. Xong!'],
    find: { yes: ['eggplant', 'grapes', 'sweetpotato'], no: ['corn', 'cucumber', 'orange'] },
    draw: 'Tô đỏ hồng, rồi tô xanh dương chồng lên. Ra màu gì?',
    task: { id: 'nha-bap-cai', text: 'Mang bình nước riêng đi học.' },
    adult: 'Thí nghiệm nước bắp cải tím cần người lớn thái và ngâm. Dùng chanh và muối nở, không dùng hóa chất tẩy rửa. Các nhà khoa học dùng sự đổi màu này để biết một chất chua hay nồng.',
    lab: 'bap-cai'
  },
  {
    id: 'ca-rot', hex: '#E2702A', code: 'CAROT', name: 'Cà rốt', color: 'Cam', status: 'trial',
    part: 'Rễ củ', pigment: 'Beta-carotene', home: 'Đà Lạt',
    hello: 'Chào bạn! Mình là Cà Rốt. Mình cho màu cam.',
    facts: ['Cà rốt tốt cho đôi mắt.', 'Ngày xưa, cà rốt có màu tím!', 'Lá ở trên, củ ở dưới đất.'],
    film: ['Rửa sạch', 'Bào sợi', 'Ép lấy nước cam', 'Sấy thành bột màu', 'Trộn vào sáp ấm', 'Đổ khuôn. Xong!'],
    find: { yes: ['orange', 'pumpkin', 'ing-ca-rot'], no: ['grapes', 'leaf', 'sky'] },
    draw: 'Vẽ chú thỏ đang ăn cà rốt.',
    task: { id: 'nha-ca-rot', text: 'Rửa hộp sữa chua để đựng đồ chơi.' },
    adult: 'Hỏi trẻ: phần nào của cà rốt mọc trên mặt đất, phần nào dưới đất? Beta-carotene được cơ thể chuyển thành vitamin A. Xôi gấc cũng có chất màu cùng họ với cà rốt.'
  }
];
EC.colorById = function (id) { return EC.COLORS.find(function (c) { return c.id === id; }); };

/* Mã in trên thẻ (dự phòng khi không quét được QR) */
EC.CODES = { DEN: 'mau-den', NGHE: 'mau-nghe', LADUA: 'mau-la-dua', BIEC: 'mau-dau-biec', BAPCAI: 'mau-bap-cai', CAROT: 'mau-ca-rot', TAICHE: 'tai-che', TOMAU: 'to-mau', TROCHOI: 'tro-choi' };

/* Đồ vật trong tự nhiên cho hoạt động "Tìm bạn cùng màu" */
EC.NATURE = {
  tomato: 'Cà chua', strawberry: 'Dâu tây', chili: 'Ớt đỏ', watermelon: 'Dưa hấu',
  banana: 'Chuối', corn: 'Bắp ngô', sunflower: 'Hoa hướng dương', mango: 'Xoài chín',
  cucumber: 'Dưa leo', broccoli: 'Bông cải xanh', leaf: 'Lá cây', lime: 'Quả chanh',
  sky: 'Bầu trời', wave: 'Sóng biển', eggplant: 'Cà tím', grapes: 'Chùm nho',
  sweetpotato: 'Khoai lang tím', orange: 'Quả cam', pumpkin: 'Bí đỏ',
  'ing-dau-biec': 'Hoa đậu biếc', 'ing-ca-rot': 'Cà rốt'
};

/* Phòng thí nghiệm đổi màu (anthocyanin) – 5 mức từ rất chua đến nồng */
EC.LAB = {
  steps: [
    { label: 'Rất chua', how: 'nhiều nước chanh' },
    { label: 'Hơi chua', how: 'vài giọt chanh' },
    { label: 'Nước thường', how: 'chưa thêm gì' },
    { label: 'Hơi nồng', how: 'một nhúm muối nở' },
    { label: 'Nồng hơn', how: 'thêm muối nở' }
  ],
  'dau-biec': {
    colors: ['#C2449A', '#8A4DB0', '#2F62B0', '#2B6FA3', '#2C8078'],
    words: ['hồng tím', 'tím', 'xanh dương', 'xanh đậm', 'xanh ngả lục']
  },
  'bap-cai': {
    colors: ['#D42F55', '#B8448C', '#6E3C8F', '#3E62B5', '#2F8C86'],
    words: ['đỏ hồng', 'hồng tím', 'tím', 'xanh dương', 'xanh ngả lục']
  }
};

/* ---------- Phân loại rác ---------- */
EC.BINS = [
  { id: 'giay', name: 'Giấy', color: '#3F7CC0', tip: 'Báo, vở, hộp carton, lõi giấy' },
  { id: 'nhua', name: 'Nhựa', color: '#E3A21A', tip: 'Chai, nắp, hộp nhựa đã rửa sạch' },
  { id: 'kimloai', name: 'Kim loại', color: '#7D8590', tip: 'Lon nhôm, hộp thiếc, nắp kim loại' },
  { id: 'huuco', name: 'Hữu cơ', color: '#4C9A3B', tip: 'Vỏ trái cây, rau củ, lá khô' }
];
EC.WASTE = [
  { id: 'bao', name: 'Báo cũ', bin: 'giay', tip: 'Báo cũ thành giấy mới.' },
  { id: 'carton', name: 'Hộp carton', bin: 'giay', tip: 'Gấp dẹp hộp cho gọn nhé.' },
  { id: 'vo', name: 'Vở cũ', bin: 'giay', tip: 'Vở hết trang thì tái chế.' },
  { id: 'loigiay', name: 'Lõi giấy', bin: 'giay', tip: 'Lõi giấy làm được ống cắm bút!' },
  { id: 'chainhua', name: 'Chai nhựa', bin: 'nhua', tip: 'Nhớ tráng sạch chai nhé.' },
  { id: 'nap', name: 'Nắp chai nhựa', bin: 'nhua', tip: 'Nắp sạch làm đồ chơi được.' },
  { id: 'hopsua', name: 'Hộp sữa chua', bin: 'nhua', tip: 'Rửa sạch hộp nhé.' },
  { id: 'daugoi', name: 'Chai dầu gội', bin: 'nhua', tip: 'Xả sạch chai nhé.' },
  { id: 'lon', name: 'Lon nước ngọt', bin: 'kimloai', tip: 'Lon nhôm tái chế được nhiều lần.' },
  { id: 'hopca', name: 'Hộp cá', bin: 'kimloai', tip: 'Miệng hộp sắc, nhờ người lớn rửa.' },
  { id: 'napkl', name: 'Nắp kim loại', bin: 'kimloai', tip: 'Nắp kim loại vào thùng kim loại.' },
  { id: 'vochuoi', name: 'Vỏ chuối', bin: 'huuco', tip: 'Vỏ chuối ủ thành phân bón.' },
  { id: 'loitao', name: 'Lõi táo', bin: 'huuco', tip: 'Lõi táo tự phân hủy được.' },
  { id: 'votrung', name: 'Vỏ trứng', bin: 'huuco', tip: 'Vỏ trứng bón cây rất tốt.' },
  { id: 'lakho', name: 'Lá khô', bin: 'huuco', tip: 'Lá khô ủ thành phân bón.' },
  { id: 'raucu', name: 'Vỏ rau củ', bin: 'huuco', tip: 'Vỏ rau củ là rác hữu cơ.' }
];

/* ---------- Đố vui ---------- */
EC.QUIZ = [
  { q: 'Bút sáp màu vàng lấy màu từ đâu?', a: ['Củ nghệ', 'Cà chua', 'Lá dứa'], art: 'ing-nghe', ex: 'Nghệ cho màu vàng.' },
  { q: 'Củ dền cho màu gì?', a: ['Đỏ hồng', 'Xanh dương', 'Vàng'], art: 'ing-den', ex: 'Củ dền cho màu đỏ hồng.' },
  { q: 'Lá dứa xanh nhờ chất gì?', a: ['Diệp lục', 'Muối', 'Đường'], art: 'ing-la-dua', ex: 'Diệp lục làm lá xanh.' },
  { q: 'Củ nghệ mọc ở đâu?', a: ['Dưới đất', 'Trên ngọn cây', 'Dưới biển'], art: 'ing-nghe', ex: 'Củ nghệ nằm dưới đất.' },
  { q: 'Ngâm hoa đậu biếc, nước có màu gì?', a: ['Xanh dương', 'Đỏ', 'Đen'], art: 'ing-dau-biec', ex: 'Nước xanh như bầu trời.' },
  { q: 'Vắt chanh vào nước hoa đậu biếc thì sao?', a: ['Hóa tím', 'Hóa đen', 'Không đổi'], art: 'ing-dau-biec', ex: 'Gặp chua, nước hóa tím.' },
  { q: 'Cà rốt màu cam nhờ chất gì?', a: ['Beta-carotene', 'Diệp lục', 'Muối'], art: 'ing-ca-rot', ex: 'Beta-carotene cho màu cam.' },
  { q: 'Tô vàng chồng lên xanh dương ra màu gì?', a: ['Xanh lá', 'Đỏ', 'Đen'], ex: 'Vàng + xanh dương = xanh lá.' },
  { q: 'Tô đỏ chồng lên vàng ra màu gì?', a: ['Cam', 'Tím', 'Xanh dương'], ex: 'Đỏ + vàng = cam.' },
  { q: 'Bút sáp rau củ có ăn được không?', a: ['Không, chỉ để vẽ', 'Có'], ex: 'Bút chỉ để vẽ. Không cho vào miệng nhé!' },
  { q: 'Vì sao lá cây màu xanh?', a: ['Vì có diệp lục', 'Vì được sơn', 'Vì uống nước xanh'], art: 'leaf', ex: 'Diệp lục làm lá xanh.' },
  { q: 'Hộp carton bỏ vào thùng nào?', a: ['Giấy', 'Kim loại', 'Hữu cơ'], art: 'carton', ex: 'Carton làm từ giấy.' },
  { q: 'Lon nước ngọt làm bằng gì?', a: ['Kim loại', 'Giấy', 'Vải'], art: 'lon', ex: 'Lon làm bằng nhôm, là kim loại.' },
  { q: 'Vỏ chuối là rác gì?', a: ['Hữu cơ', 'Nhựa', 'Kim loại'], art: 'vochuoi', ex: 'Vỏ chuối ủ thành phân bón.' },
  { q: 'Trước khi bỏ chai nhựa, bé làm gì?', a: ['Tráng sạch, để khô', 'Đổ thêm nước', 'Ném xuống đất'], art: 'chainhua', ex: 'Chai sạch thì tái chế dễ hơn.' },
  { q: 'Lõi giấy làm được gì?', a: ['Ống cắm bút', 'Đồ ăn', 'Không làm được gì'], art: 'loigiay', ex: 'Trang trí lõi giấy là có ống cắm bút.' },
  { q: 'Hộp bút ECOCRAYON làm từ gì?', a: ['Giấy tái chế', 'Nhựa mới', 'Sắt'], ex: 'Hộp làm từ giấy cũ để bớt rác.' },
  { q: 'Vải vụn làm được gì?', a: ['Túi đựng bút', 'Kẹo', 'Nước uống'], ex: 'Người lớn may thành túi đựng bút.' },
  { q: 'Rác hữu cơ biến thành gì?', a: ['Phân bón', 'Chai nhựa', 'Lon nhôm'], art: 'lakho', ex: 'Rác hữu cơ ủ thành phân bón.' },
  { q: 'Chải răng thế nào cho đỡ tốn nước?', a: ['Khóa vòi lúc chải', 'Mở vòi suốt', 'Dùng thật nhiều nước'], ex: 'Chỉ mở vòi khi súc miệng.' },
  { q: 'Ra khỏi phòng, bé nhớ làm gì?', a: ['Tắt đèn, tắt quạt', 'Bật thêm đèn', 'Mở tủ lạnh'], ex: 'Tắt đèn là tiết kiệm điện.' },
  { q: 'Đi học, bé mang nước bằng gì?', a: ['Bình nước riêng', 'Chai nhựa mới mỗi ngày'], ex: 'Bình nước dùng được rất lâu.' },
  { q: 'Giấy mới vẽ một mặt thì sao?', a: ['Vẽ tiếp mặt sau', 'Vứt đi', 'Vò lại'], ex: 'Dùng 2 mặt giấy là giữ cây xanh.' },
  { q: 'Nước vo gạo dùng để làm gì?', a: ['Tưới cây', 'Uống', 'Đổ đi'], ex: 'Nước vo gạo tưới cây rất tốt.' },
  { q: 'Thứ nào KHÔNG thuộc về biển?', a: ['Chai nhựa', 'Con cá', 'Rong biển'], art: 'wave', ex: 'Rác nhựa làm hại rùa và cá.' },
  { q: 'Để bút ngoài nắng lâu, màu sẽ thế nào?', a: ['Nhạt dần', 'Đậm lên', 'Thành cầu vồng'], ex: 'Cất bút nơi khô mát, tránh nắng.' }
];

/* ---------- Bếp pha màu ---------- */
EC.MIX = [
  { a: 'nghe', b: 'dau-biec', name: 'Xanh lá', hex: '#5C9A3A', use: 'tô lá cây' },
  { a: 'den', b: 'nghe', name: 'Cam', hex: '#E0702E', use: 'tô quả cam' },
  { a: 'den', b: 'dau-biec', name: 'Tím', hex: '#753E8E', use: 'tô chùm nho' },
  { a: 'la-dua', b: 'nghe', name: 'Xanh nõn chuối', hex: '#98B52F', use: 'tô mầm cây non' },
  { a: 'dau-biec', b: 'la-dua', name: 'Xanh ngọc', hex: '#2C847E', use: 'tô biển gần bờ' },
  { a: 'ca-rot', b: 'den', name: 'Đỏ cam', hex: '#CF4A3C', use: 'tô mặt trời lúc hoàng hôn' }
];

/* ---------- Thử thách xanh ---------- */
EC.MISSIONS = [
  { id: 'phan-loai-nha', where: 'Ở nhà', title: 'Phân loại giấy và nhựa', how: 'Đặt 2 thùng: giấy và nhựa. Phân loại cả ngày.', leaves: 3 },
  { id: 'tat-den', where: 'Ở nhà', title: 'Thám tử tắt đèn', how: 'Tắt đèn, quạt ở phòng không có ai.', leaves: 2 },
  { id: 'khoa-voi', where: 'Ở nhà', title: 'Khóa vòi khi chải răng', how: 'Làm 3 ngày liền.', leaves: 2 },
  { id: 'nuoc-vo-gao', where: 'Ở nhà', title: 'Nước vo gạo tưới cây', how: 'Giữ nước vo gạo để tưới cây.', leaves: 2 },
  { id: 'giay-hai-mat', where: 'Ở lớp', title: 'Dùng giấy cả hai mặt', how: 'Vẽ tiếp lên mặt sau tờ giấy cũ.', leaves: 2 },
  { id: 'binh-nuoc', where: 'Ở lớp', title: 'Bình nước của tớ', how: 'Mang bình nước riêng đi học 1 tuần.', leaves: 3 },
  { id: 'nhat-rac', where: 'Ở lớp', title: 'Nhặt 5 mẩu rác', how: 'Đeo găng tay, đi cùng người lớn.', leaves: 3 },
  { id: 'gieo-hat', where: 'Cùng ba mẹ', title: 'Gieo một hạt đậu', how: 'Gieo hạt lên bông ẩm, vẽ cây mầm mỗi ngày.', leaves: 3 },
  { id: 'tui-vai', where: 'Cùng ba mẹ', title: 'Đi chợ với túi vải', how: 'Mang túi vải, không lấy túi nilon.', leaves: 2 }
];

EC.DIY = [
  {
    id: 'ong-cam-but', title: 'Ống cắm bút từ lõi giấy', from: 'Lõi giấy', leaves: 4,
    need: ['3 lõi giấy vệ sinh', '1 miếng carton làm đế', 'Hồ dán', 'Bút sáp'],
    steps: ['Tô màu, vẽ hoa lá lên các lõi giấy.', 'Nhờ người lớn cắt lõi thành ba độ cao khác nhau.', 'Dán các lõi đứng lên miếng carton.', 'Cắm bút sáp vào theo thứ tự cầu vồng.'],
    safe: 'Kéo và dao rọc giấy do người lớn cầm.'
  },
  {
    id: 'khay-nap-chai', title: 'Khay phân loại nắp chai', from: 'Nắp chai sạch', leaves: 3,
    need: ['Nắp chai nhựa đủ màu, đã rửa sạch', '1 khay đựng trứng bằng giấy'],
    steps: ['Rửa sạch nắp chai, phơi khô.', 'Xếp nắp chai cùng màu vào chung một ô.', 'Đếm xem mỗi màu có bao nhiêu nắp.', 'Úp nắp lên giấy, dùng bút sáp đồ theo viền để vẽ hình tròn.'],
    safe: 'Nắp chai nhỏ, trẻ dưới 3 tuổi không được chơi.'
  },
  {
    id: 'hop-carton', title: 'Hộp đựng bút bằng carton', from: 'Carton, giấy báo cũ', leaves: 4,
    need: ['1 hộp carton nhỏ còn sạch', '2 miếng bìa cứng làm vách ngăn', 'Giấy báo cũ', 'Hồ dán'],
    steps: ['Nhờ người lớn cắt bỏ nắp hộp.', 'Xẻ khe giữa hai miếng bìa rồi lồng vào nhau thành hình chữ thập.', 'Đặt vách ngăn vào hộp để chia thành 4 ô.', 'Dán giấy báo bên ngoài và trang trí bằng bút sáp.'],
    safe: 'Kiểm tra hộp không ẩm, không có cạnh sắc.'
  },
  {
    id: 'tui-cuon', title: 'Túi cuộn bút từ vải vụn', from: 'Vải vụn, quần áo cũ', leaves: 4,
    need: ['1 miếng vải cũ khoảng 30 × 20 cm', '1 sợi dây vải hoặc ruy băng', 'Kim chỉ (người lớn dùng)'],
    steps: ['Gấp mép dưới của miếng vải lên khoảng 6 cm để làm túi.', 'Người lớn may các đường dọc, chia túi thành nhiều ô vừa cây bút.', 'Khâu sợi dây vào một đầu.', 'Bỏ bút vào từng ô, cuộn lại và buộc dây.'],
    safe: 'Kim chỉ chỉ dành cho người lớn.'
  },
  {
    id: 'khay-bot-giay', title: 'Khay bột giấy tự làm', from: 'Bột giấy tái chế', leaves: 5,
    need: ['Giấy báo cũ', 'Chậu nước', 'Một ít hồ dán', '1 khay nhựa làm khuôn, lót màng bọc'],
    steps: ['Xé giấy báo thật nhỏ, ngâm nước qua đêm.', 'Vắt bớt nước rồi trộn với chút hồ.', 'Ép bột giấy vào khuôn đã lót màng bọc.', 'Phơi nắng 2 đến 3 ngày cho khô rồi gỡ ra.'],
    safe: 'Rửa tay sau khi nghịch bột giấy.'
  }
];

/* ---------- Huy hiệu ---------- */
EC.STICKERS = [
  { id: 'mau-den', name: 'Bạn của Củ Dền', how: 'Hoàn thành trang màu đỏ hồng', icon: 'ing-den' },
  { id: 'mau-nghe', name: 'Bạn của Nghệ', how: 'Hoàn thành trang màu vàng', icon: 'ing-nghe' },
  { id: 'mau-la-dua', name: 'Bạn của Lá Dứa', how: 'Hoàn thành trang màu xanh lá', icon: 'ing-la-dua' },
  { id: 'mau-dau-biec', name: 'Bạn của Đậu Biếc', how: 'Hoàn thành trang màu xanh dương', icon: 'ing-dau-biec' },
  { id: 'mau-bap-cai', name: 'Bạn của Bắp Cải', how: 'Hoàn thành trang màu tím', icon: 'ing-bap-cai' },
  { id: 'mau-ca-rot', name: 'Bạn của Cà Rốt', how: 'Hoàn thành trang màu cam', icon: 'ing-ca-rot' },
  { id: 'cau-vong', name: 'Khu vườn cầu vồng', how: 'Làm bạn với cả 6 màu', icon: 'b-rainbow' },
  { id: 'ghep-cap', name: 'Trí nhớ siêu đỉnh', how: 'Thắng trò ghép cặp', icon: 'b-cards' },
  { id: 'phan-loai', name: 'Người phân loại tài ba', how: 'Phân loại xong một lượt rác', icon: 'b-bin' },
  { id: 'do-vui', name: 'Nhà thông thái xanh', how: 'Trả lời đúng từ 6 câu đố', icon: 'b-quiz' },
  { id: 'pha-mau', name: 'Đầu bếp màu sắc', how: 'Hoàn thành 6 đơn pha màu', icon: 'b-bowl' },
  { id: 'thi-nghiem', name: 'Nhà khoa học nhí', how: 'Làm nước đổi màu cả chua lẫn nồng', icon: 'b-beaker' },
  { id: 'hoa-si', name: 'Họa sĩ nhí', how: 'Lưu một bức tranh tô màu', icon: 'b-crayon' },
  { id: 'ke-chuyen', name: 'Người kể chuyện', how: 'Kể chuyện về bức tranh của mình', icon: 'b-story' },
  { id: 'giu-bien', name: 'Người giữ biển sạch', how: 'Nhặt rác trong tranh Đại dương xanh', icon: 'b-wave' },
  { id: 'chien-binh', name: 'Chiến binh xanh', how: 'Hoàn thành 3 thử thách xanh', icon: 'b-leaf' },
  { id: 'sieu-anh-hung', name: 'Siêu anh hùng môi trường', how: 'Hoàn thành 6 thử thách xanh', icon: 'b-star' },
  { id: 'kheo-tay', name: 'Thợ tái chế khéo tay', how: 'Làm xong một món đồ tái chế', icon: 'b-recycle' }
];

/* Mốc lớn lên của cây */
EC.TREE = [
  { at: 0, name: 'Hạt giống', say: 'Hạt đang ngủ. Chơi để đánh thức hạt nhé!' },
  { at: 3, name: 'Mầm non', say: 'Hạt nảy mầm rồi!' },
  { at: 8, name: 'Cây con', say: 'Cây con đang lớn.' },
  { at: 16, name: 'Cây nhỏ', say: 'Cây đã có thân chắc khỏe.' },
  { at: 26, name: 'Cây lớn', say: 'Cây lớn rồi! Bé nhận được giấy khen.' },
  { at: 38, name: 'Cây cầu vồng', say: 'Cây ra quả đủ 6 màu!' }
];
EC.CERT_AT = 26;

/* ---------- Tranh tô màu ---------- */
EC.PAGES = [
  { id: 'vuon', name: 'Khu vườn rau củ', story: ['Trong vườn có rau củ nào?', 'Củ nào cho màu đỏ hồng?', 'Bé muốn trồng cây gì?'] },
  { id: 'dongvat', name: 'Động vật quanh em', story: ['Các con vật đang làm gì?', 'Mèo và gà có là bạn không?', 'Đặt tên cho gà con nhé!'] },
  { id: 'bien', name: 'Đại dương xanh', story: ['Bạn rùa bơi đi đâu?', 'Tìm 2 thứ không thuộc về biển!', 'Làm gì để biển sạch?'] },
  { id: 'trang', name: 'Giấy trắng', story: ['Bé vẽ gì vậy?', 'Tranh có những màu nào?', 'Đặt tên cho tranh nhé!'] }
];

/* ---------- Dành cho người lớn ---------- */
EC.KIT = [
  { icon: 'k-crayon', name: 'Bút màu sáp', text: 'Màu lấy từ rau củ. Số lượng màu sẽ chốt sau khi thử nghiệm.' },
  { icon: 'k-box', name: 'Hộp carton tái chế', text: 'Có vách ngăn giữ bút không lăn, không gãy.' },
  { icon: 'k-book', name: 'Sổ tô màu', text: 'Tranh về thiên nhiên và môi trường, kèm nhiệm vụ nhỏ.' },
  { icon: 'k-card', name: 'Thẻ màu', text: 'Mỗi màu một thẻ: nguyên liệu, hình ảnh, điều thú vị.' },
  { icon: 'k-qr', name: 'Mã QR', text: 'Quét để mở trang học, câu đố và trò chơi của màu đó.' },
  { icon: 'k-bag', name: 'Túi vải tái sử dụng', text: 'May từ vải vụn. Có trong phiên bản mở rộng.' }
];

EC.MATERIALS = [
  { m: 'Carton, giấy báo cũ', use: 'Làm hộp đựng, vách ngăn, thẻ màu', role: 'Bao bì và bảo vệ sản phẩm' },
  { m: 'Bột giấy tái chế', use: 'Ép khay hoặc khuôn đựng', role: 'Tạo khay định hình' },
  { m: 'Lõi giấy', use: 'Làm ống đựng hoặc giá cắm bút', role: 'Phụ kiện tái sử dụng' },
  { m: 'Vải vụn, quần áo cũ', use: 'May túi cuộn đựng bút', role: 'Túi đựng dùng nhiều lần' },
  { m: 'Nắp chai sạch', use: 'Làm khay phân loại hoặc đồ chơi học tập', role: 'Học liệu tái chế' }
];

EC.VALUES = [
  { k: 'Thiên nhiên', t: 'Thử nghiệm chất tạo màu từ thực vật thay vì chỉ dùng màu công nghiệp.', c: 'la-dua' },
  { k: 'Tái chế', t: 'Tận dụng giấy, carton và vải cũ cho bao bì, khay và phụ kiện.', c: 'nghe' },
  { k: 'Giáo dục', t: 'Biến giờ tô màu thành giờ học về thực vật, tái chế và môi trường.', c: 'den' },
  { k: 'Công nghệ', t: 'Mã QR nối bộ bút với trang học, nội dung cập nhật được mà không phải in lại.', c: 'dau-biec' },
  { k: 'Trải nghiệm', t: 'Vẽ, đọc, chơi và khám phá trong cùng một bộ sản phẩm.', c: 'ca-rot' }
];

EC.ROADMAP = [
  { stage: 'Giai đoạn 1', name: 'Mã QR trên hộp và thẻ màu', what: 'Quét để xem giới thiệu nguyên liệu, câu đố và hướng dẫn hoạt động.', state: 'now' },
  { stage: 'Giai đoạn 2', name: 'Website trò chơi', what: 'Câu đố, ghép cặp màu với nguyên liệu, phân loại rác. Chính là trang bạn đang dùng.', state: 'now' },
  { stage: 'Giai đoạn 3', name: 'AR – thực tế tăng cường', what: 'Quét tranh đã tô để xem mô hình 3D hoặc hoạt cảnh.', state: 'next' },
  { stage: 'Nghiên cứu sau', name: 'AI nhận diện tranh', what: 'Nhận ra chủ đề bức tranh và gợi ý nội dung học phù hợp.', state: 'later' }
];

EC.PLAN = [
  { t: 'Nghiên cứu', d: 'Tìm hiểu nền sáp, nguyên liệu tạo màu thực vật, cách chiết xuất và yêu cầu an toàn cho sản phẩm trẻ em.' },
  { t: 'Thử nghiệm màu', d: 'Làm mẫu nhỏ từ nguyên liệu dễ tìm. Ghi lại tỷ lệ, màu sắc, độ cứng, độ lên màu và độ ổn định.' },
  { t: 'Làm bao bì', d: 'Thu gom carton sạch, thiết kế hộp, khay và túi. Vật liệu không bẩn, không ẩm, không có cạnh sắc.' },
  { t: 'Tạo học liệu', d: 'Thiết kế sổ tô màu, thẻ kiến thức và câu đố ngắn hợp với độ tuổi.' },
  { t: 'Tạo mã QR', d: 'Đưa nội dung lên trang web, tạo mã QR và quét thử trên nhiều điện thoại.' },
  { t: 'Kiểm thử', d: 'Phụ huynh, giáo viên và nhóm trẻ dùng thử có giám sát. Ghi nhận độ dễ dùng, hứng thú và mức độ dễ hiểu.' },
  { t: 'Hoàn thiện', d: 'Điều chỉnh công thức, thiết kế, nội dung và độ an toàn trước khi nghĩ đến sản xuất.' }
];

EC.RISKS = [
  { r: 'Màu thực vật có thể nhạt hoặc phai', a: 'Thử nhiều tỷ lệ và cách làm, kiểm tra lại sau thời gian bảo quản. Chưa có kết quả thì chưa quảng cáo độ bền.' },
  { r: 'Chất lượng bút chưa đồng đều', a: 'Chuẩn hóa cách cân đo, khuôn đúc và kiểm tra từng mẻ.' },
  { r: 'An toàn cho trẻ em', a: 'Nguyên liệu rõ nguồn gốc, thành phẩm được đánh giá, ghi cảnh báo và độ tuổi. Không tuyên bố “không độc” khi chưa có kiểm nghiệm.' },
  { r: 'Mã QR hoặc trang web không mở được', a: 'Dùng đường dẫn ổn định, quét thử trước khi đóng gói và in kèm mã chữ để nhập tay.' },
  { r: 'Chi phí sản xuất', a: 'Làm mẫu nhỏ, ghi chi phí từng thành phần và khảo sát mức giá khách hàng chấp nhận.' }
];

EC.AGES = [
  { age: '5–6 tuổi', who: 'Mầm non lớn', time: '10–15 phút mỗi hoạt động',
    do: ['Tô theo vùng trong tranh có sẵn', 'Ghép cặp chế độ Dễ (3 cặp)', 'Tìm bạn cùng màu trên trang màu', 'Bấm nút loa nhỏ cạnh lời Bé Sáp để trẻ nghe thay vì tự đọc'],
    tip: 'Ngồi cạnh trẻ và hỏi về hình ảnh. Trẻ chưa cần nhớ tên chất màu.' },
  { age: '6–8 tuổi', who: 'Lớp 1–2', time: '15–20 phút',
    do: ['Đố vui chế độ Bé nhỏ, sau đó lên Bé lớn', 'Phân loại rác', 'Thử thách xanh ở nhà, có ba mẹ xác nhận', 'Kể chuyện từ bức tranh đã tô'],
    tip: 'Cho trẻ tự đọc câu hỏi, người lớn chỉ hỗ trợ từ khó.' },
  { age: '8–11 tuổi', who: 'Lớp 3–5', time: '20–35 phút',
    do: ['Thí nghiệm nước đổi màu (đậu biếc, bắp cải tím)', 'Bếp pha màu, giải thích vì sao ra màu mới', 'Tự làm đồ tái chế', 'Viết một đoạn ngắn về bức tranh'],
    tip: 'Khuyến khích trẻ ghi chép như nhà khoa học: làm gì, thấy gì, vì sao.' }
];

EC.LESSONS = [
  {
    title: 'Cầu vồng từ khu vườn', time: '35 phút', age: '5–8 tuổi',
    goal: 'Trẻ biết mỗi màu sáp đến từ một loại rau củ, gọi đúng tên ít nhất 3 nguyên liệu.',
    prep: 'Bộ bút ECOCRAYON, thẻ màu có QR, 1 điện thoại hoặc máy tính bảng, rau củ thật nếu có (củ dền, nghệ, lá dứa).',
    flow: [
      ['Khởi động', '5 phút', 'Bỏ rau củ vào túi kín. Trẻ sờ và đoán đó là gì.'],
      ['Khám phá', '10 phút', 'Quét QR trên thẻ màu vàng, đỏ hồng, xanh lá. Cả lớp xem phim nhỏ “Màu được làm ra thế nào”.'],
      ['Thực hành', '15 phút', 'Tô tranh “Khu vườn rau củ” trong sổ bằng bút sáp thật.'],
      ['Chia sẻ', '5 phút', 'Từng nhóm giơ tranh, kể tên rau củ và màu mà rau củ đó cho.']
    ],
    ask: ['Củ nào nằm dưới đất? Lá nào mọc trên cao?', 'Nếu muốn có màu cam, mình dùng rau củ nào?']
  },
  {
    title: 'Thám tử phân loại rác', time: '30 phút', age: '6–10 tuổi',
    goal: 'Trẻ phân loại đúng giấy, nhựa, kim loại và rác hữu cơ; biết rửa sạch trước khi bỏ rác tái chế.',
    prep: '4 thùng hoặc hộp có nhãn, một số rác sạch thật (báo, chai nhựa đã rửa, lon, lá khô), máy chiếu hoặc máy tính bảng.',
    flow: [
      ['Khởi động', '5 phút', 'Hỏi trẻ: rác trong nhà mình đi đâu sau khi vứt?'],
      ['Chơi trên web', '10 phút', 'Chơi “Phân loại rác” theo lượt, mỗi trẻ kéo một món.'],
      ['Thực hành', '10 phút', 'Trẻ phân loại rác sạch thật vào 4 thùng. Cả lớp kiểm tra lại.'],
      ['Cam kết', '5 phút', 'Mỗi trẻ chọn một thử thách xanh để làm ở nhà trong tuần.']
    ],
    ask: ['Vì sao phải rửa chai trước khi bỏ vào thùng tái chế?', 'Rác hữu cơ có thể biến thành gì?']
  },
  {
    title: 'Nhà khoa học nhí: nước đổi màu', time: '30 phút', age: '8–11 tuổi',
    goal: 'Trẻ quan sát chất màu anthocyanin đổi màu khi gặp chua hoặc nồng, biết ghi chép kết quả.',
    prep: 'Nước hoa đậu biếc hoặc nước bắp cải tím (người lớn chuẩn bị trước), 3 cốc trong, chanh, muối nở, phiếu ghi chép.',
    flow: [
      ['Dự đoán', '5 phút', 'Trẻ đoán: thêm chanh vào nước tím thì ra màu gì?'],
      ['Thí nghiệm', '15 phút', 'Cốc 1 giữ nguyên, cốc 2 thêm chanh, cốc 3 thêm muối nở. Trẻ tô lại màu từng cốc bằng bút sáp.'],
      ['Đối chiếu', '5 phút', 'Mở “Phòng thí nghiệm đổi màu” trên trang màu tím để so sánh.'],
      ['Kết luận', '5 phút', 'Chất màu thực vật nhạy với môi trường. Vì vậy bút sáp rau củ cũng cần cất nơi khô mát.']
    ],
    ask: ['Màu nào xuất hiện khi thêm chanh? Khi thêm muối nở?', 'Vì sao không nên uống nước thí nghiệm?']
  }
];

EC.SAFETY = [
  'Bút sáp là đồ dùng để vẽ, không ăn được, dù màu lấy từ rau củ. Không để trẻ cho bút vào miệng.',
  'Trẻ nhỏ dùng bút khi có người lớn bên cạnh.',
  'Ngừng dùng nếu da trẻ bị đỏ, ngứa hoặc có dấu hiệu kích ứng.',
  'Cất bút nơi khô, mát, tránh nắng để màu ít bị phai.',
  'Các bước đun, sấy, làm chảy sáp và dùng kéo, dao, kim chỉ đều do người lớn làm.',
  'Vật liệu tái chế phải sạch, khô và không có cạnh sắc.'
];

EC.FAQ = [
  { q: 'Không quét được mã QR thì làm sao?', a: 'Mỗi thẻ có in mã chữ, ví dụ NGHE hoặc DEN. Nhập mã đó vào ô “Nhập mã in trên thẻ” ở trang chủ hoặc cuối trang.' },
  { q: 'Bút có an toàn tuyệt đối không?', a: 'Sản phẩm đang ở giai đoạn mẫu thử. Nhóm chưa có kết quả kiểm nghiệm nên không tuyên bố bút “không độc” hay “an toàn tuyệt đối”. Hãy dùng có giám sát và làm theo hướng dẫn an toàn.' },
  { q: 'Vì sao màu bút không giống hệt màu trên web?', a: 'Màu thực vật đậm nhạt khác nhau tùy cách chiết xuất, tỷ lệ phối trộn và nền sáp. Màu trên màn hình chỉ để minh họa.' },
  { q: 'Tiến trình của bé có bị mất không?', a: 'Lá và huy hiệu được lưu ngay trên trình duyệt của máy đang dùng. Đổi máy, xóa dữ liệu duyệt web hoặc dùng chế độ ẩn danh thì tiến trình sẽ bắt đầu lại.' },
  { q: 'Lớp học dùng chung một máy được không?', a: 'Được. Ở Sổ của bé có nút “Bắt đầu lại” để dọn tiến trình trước khi đến lượt bạn khác.' }
];

/* Phiếu quan sát buổi dùng thử (Bước 6 trong kế hoạch) */
EC.OBS_SCALES = [
  { id: 'de-dung', label: 'Trẻ tự dùng được' },
  { id: 'hung-thu', label: 'Trẻ hứng thú' },
  { id: 'de-hieu', label: 'Nội dung dễ hiểu' },
  { id: 'len-mau', label: 'Bút lên màu tốt' },
  { id: 'do-cung', label: 'Bút cứng, ít gãy' }
];
EC.OBS_ACTS = ['Trang màu (QR)', 'Ghép cặp', 'Phân loại rác', 'Đố vui', 'Bếp pha màu', 'Thí nghiệm đổi màu', 'Tô màu', 'Thử thách xanh', 'Đồ tái chế'];
