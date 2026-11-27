/* ECOCRAYON – nội dung "Thế giới khám phá": 4 vùng đất, bài học, 12 trò chơi, 4 thử thách tổng kết,
   cấp độ, huy hiệu và vật phẩm.
   Nhóm có thể sửa trực tiếp file này, hoặc sửa trong trang Quản trị (#quan-tri) rồi bấm
   "Xuất file nội dung" để có file js/content.js dùng chung cho mọi máy. */
window.EC = window.EC || {};

/* Bảng màu dùng trong trò chơi (tên màu bé học) */
EC.COLORSET = {
  do: { name: 'Đỏ', hex: '#D7263D', fam: 'do' },
  hong: { name: 'Đỏ hồng', hex: '#B8336A', fam: 'do' },
  cam: { name: 'Cam', hex: '#E2702A', fam: 'cam' },
  vang: { name: 'Vàng', hex: '#F2C230', fam: 'vang' },
  xanhla: { name: 'Xanh lá', hex: '#4C9A3B', fam: 'xanhla' },
  xanhduong: { name: 'Xanh dương', hex: '#2F62B0', fam: 'xanhduong' },
  tim: { name: 'Tím', hex: '#6E3C8F', fam: 'tim' },
  nau: { name: 'Nâu', hex: '#8B5A2B', fam: 'nau' },
  trang: { name: 'Trắng', hex: '#FFFFFF', fam: 'trang' },
  den: { name: 'Đen', hex: '#2B2722', fam: 'den' }
};

/* Ảnh đại diện có sẵn (nhân vật vùng đất mở khóa thêm qua Bộ sưu tập) */
EC.AVATARS = [
  { id: 'besap', name: 'Bé Sáp' }, { id: 'ing-den', name: 'Củ Dền' }, { id: 'ing-nghe', name: 'Nghệ' },
  { id: 'ing-la-dua', name: 'Lá Dứa' }, { id: 'ing-dau-biec', name: 'Đậu Biếc' }, { id: 'ing-bap-cai', name: 'Bắp Cải' },
  { id: 'ing-ca-rot', name: 'Cà Rốt' }, { id: 'rabbit', name: 'Thỏ' }, { id: 'fish', name: 'Cá' },
  { id: 'bird', name: 'Chim' }, { id: 'turtle', name: 'Rùa' }, { id: 'frog', name: 'Ếch' }
];
EC.AGE_GROUPS = ['Dưới 5 tuổi', '5–6 tuổi', '6–8 tuổi', '8–11 tuổi', 'Trên 11 tuổi'];

(function () {
  /* Câu Đúng/Sai: ok = true nghĩa là câu đó đúng */
  function tf(q, ok, ex) { return { q: q, a: ['Đúng', 'Sai'], ok: ok ? 0 : 1, ex: ex || (ok ? 'Câu này đúng.' : 'Câu này sai.'), tf: true }; }
  function mc(q, a, ex, extra) { var o = { q: q, a: a, ok: 0, ex: ex || '' }; if (extra) for (var k in extra) o[k] = extra[k]; return o; }

  EC.DEFAULT_CONTENT = {
    settings: {
      stars: [50, 80],          /* % để đạt 2 sao và 3 sao (dưới mức đầu là 1 sao) */
      xpLesson: 5,              /* XP khi xem một bài học lần đầu */
      xpLessonQuiz: 5,          /* XP khi trả lời đúng câu hỏi nhỏ lần đầu */
      xpPlay: 2,                /* XP thưởng mỗi lượt chơi (tối đa xpPlayLimit lượt mỗi trò) */
      xpPlayLimit: 5,
      badgeGames: 3,            /* số trò chơi của vùng cần hoàn thành để nhận huy hiệu */
      badgeChallengeStars: 2,   /* số sao tối thiểu ở thử thách tổng kết */
      contact: { org: 'Nhóm dự án ECOCRAYON', email: '', phone: '', address: '', facebook: '' }
    },

    levels: [
      { name: 'Người mới khám phá', xp: 0 },
      { name: 'Nhà khám phá nhí', xp: 200 },
      { name: 'Nhà khám phá tài năng', xp: 600 },
      { name: 'Siêu nhà khám phá', xp: 1100 }
    ],

    zones: [
      /* ================= VÙNG 1 ================= */
      {
        id: 'sac-mau', name: 'Vương quốc sắc màu', color: 'la-dua', place: 'Khu vườn kỳ diệu',
        char: 'mam', charName: 'Mầm Xanh', charRole: 'Người bạn thực vật',
        short: 'Khu vườn kỳ diệu, nơi rau củ, hoa lá cho ta những màu sắc tự nhiên.',
        learn: ['Màu sắc trong tự nhiên', 'Màu của rau củ, hoa lá', 'Màu sáp làm từ thực vật'],
        hello: 'Chào bé! Mình là Mầm Xanh. Cùng mình tìm lại màu cho khu vườn nhé!',
        story: ['Ngày xưa, khu vườn kỳ diệu rực rỡ đủ màu.', 'Một sáng, cơn gió xám thổi qua làm rau củ mất hết màu!', 'Mầm Xanh cần bé giúp trả lại màu cho khu vườn.'],
        badge: { name: 'Nhà thám hiểm thiên nhiên', icon: 'b-rainbow' },
        lessons: [
          { id: 'sm1', title: 'Màu sắc trong tự nhiên', vis: ['sky', 'leaf', 'sunflower', 'tomato'],
            text: 'Nhìn quanh mình nhé! Bầu trời màu xanh dương, lá cây màu xanh lá, hoa hướng dương màu vàng, quả cà chua màu đỏ. Thiên nhiên là một hộp màu khổng lồ!',
            quiz: mc('Lá cây thường có màu gì?', ['Xanh lá', 'Tím', 'Đen'], 'Lá cây có diệp lục nên có màu xanh lá.') },
          { id: 'sm2', title: 'Màu của rau củ', vis: ['ing-ca-rot', 'ing-den', 'eggplant', 'corn'],
            text: 'Mỗi loại rau củ có một màu riêng: cà rốt màu cam, củ dền màu đỏ hồng, cà tím màu tím, bắp ngô màu vàng. Ăn đủ các màu giúp bé khỏe mạnh!',
            quiz: mc('Cà rốt có màu gì?', ['Cam', 'Xanh dương', 'Trắng'], 'Cà rốt màu cam nhờ chất beta-carotene.') },
          { id: 'sm3', title: 'Màu của hoa và lá', vis: ['ing-dau-biec', 'flower', 'leaf', 'lakho'],
            text: 'Hoa có nhiều màu để mời ong bướm đến chơi: hoa đậu biếc màu xanh dương, hoa hướng dương màu vàng. Lá non màu xanh, lá già chuyển vàng, nâu rồi rụng xuống.',
            quiz: mc('Vì sao hoa có màu sặc sỡ?', ['Để mời ong bướm đến', 'Để dọa con mèo', 'Vì được sơn'], 'Màu hoa giúp ong bướm tìm đến lấy mật và giúp cây ra quả.') },
          { id: 'sm4', title: 'Cây có những phần nào?', vis: 'plantparts',
            text: 'Một cái cây có rễ hút nước dưới đất, thân nâng cây đứng thẳng, lá đón nắng, hoa nở rồi thành quả. Củ nghệ là thân mọc dưới đất, còn củ dền và cà rốt là rễ củ.',
            quiz: mc('Phần nào của cây hút nước từ đất?', ['Rễ', 'Hoa', 'Lá'], 'Rễ nằm dưới đất và hút nước nuôi cây.') },
          { id: 'sm5', title: 'Từ thực vật đến bút sáp', vis: ['ing-nghe', 'arrow', 'b-crayon'],
            text: 'Người lớn rửa, giã, lọc nước màu từ rau củ rồi làm khô thành bột màu. Bột màu trộn vào sáp ấm, đổ khuôn là thành bút sáp ECOCRAYON!',
            link: { href: '#vuon-mau', label: 'Gặp 6 bạn màu sáp' },
            quiz: mc('Bút sáp màu vàng ECOCRAYON lấy màu từ đâu?', ['Củ nghệ', 'Lá dứa', 'Bắp cải tím'], 'Củ nghệ có chất curcumin màu vàng.') }
        ],
        games: [
          { id: 'giai-cuu-mau', type: 'rescue', title: 'Giải cứu màu sắc', icon: 'b-rainbow', pts: 10, count: 8,
            desc: 'Rau củ bị mất màu! Chọn đúng màu để trả lại cho bạn ấy.',
            items: [
              { art: 'tomato', name: 'Cà chua', color: 'do' }, { art: 'ing-ca-rot', name: 'Cà rốt', color: 'cam' },
              { art: 'corn', name: 'Bắp ngô', color: 'vang' }, { art: 'cucumber', name: 'Dưa leo', color: 'xanhla' },
              { art: 'eggplant', name: 'Cà tím', color: 'tim' }, { art: 'ing-dau-biec', name: 'Hoa đậu biếc', color: 'xanhduong' },
              { art: 'banana', name: 'Quả chuối', color: 'vang' }, { art: 'broccoli', name: 'Bông cải xanh', color: 'xanhla' },
              { art: 'pumpkin', name: 'Bí đỏ', color: 'cam' }, { art: 'grapes', name: 'Chùm nho', color: 'tim' },
              { art: 'strawberry', name: 'Dâu tây', color: 'do' }, { art: 'ing-den', name: 'Củ dền', color: 'hong' },
              { art: 'ing-bap-cai', name: 'Bắp cải tím', color: 'tim' }, { art: 'ing-la-dua', name: 'Lá dứa', color: 'xanhla' }
            ] },
          { id: 'khu-vuon-bi-an', type: 'hide', title: 'Ai đang trốn trong khu vườn?', icon: 'bush', pts: 10, count: 6,
            desc: 'Nghe gợi ý rồi tìm bạn rau củ đang trốn sau bụi cây.',
            items: [
              { art: 'ing-ca-rot', name: 'Cà rốt', clue: 'Mình màu cam, thân dài, mọc dưới đất. Bạn thỏ rất thích mình!', fact: 'Cà rốt có nhiều vitamin A, tốt cho đôi mắt.' },
              { art: 'ing-den', name: 'Củ dền', clue: 'Mình tròn tròn, màu đỏ hồng. Cắt mình ra, tay bé sẽ hồng lên!', fact: 'Lá củ dền cũng ăn được đấy.' },
              { art: 'corn', name: 'Bắp ngô', clue: 'Mình có rất nhiều hạt vàng xếp hàng, mặc áo lá xanh.', fact: 'Một bắp ngô có thể có tới vài trăm hạt.' },
              { art: 'eggplant', name: 'Cà tím', clue: 'Mình màu tím bóng, đội chiếc mũ xanh trên đầu.', fact: 'Cà tím thật ra là một loại quả.' },
              { art: 'ing-bap-cai', name: 'Bắp cải tím', clue: 'Lá của mình cuộn tròn thành bắp và có màu tím.', fact: 'Nước bắp cải tím đổi màu khi gặp chanh.' },
              { art: 'ing-nghe', name: 'Củ nghệ', clue: 'Mình là họ hàng của gừng. Bên trong mình vàng như nắng.', fact: 'Nghệ làm cà ri và xôi có màu vàng.' },
              { art: 'pumpkin', name: 'Bí đỏ', clue: 'Mình to tròn, màu cam, có nhiều múi.', fact: 'Hạt bí rang lên ăn rất bùi.' },
              { art: 'cucumber', name: 'Dưa leo', clue: 'Mình dài, vỏ xanh, ăn vào mát và giòn.', fact: 'Dưa leo có rất nhiều nước.' },
              { art: 'ing-la-dua', name: 'Lá dứa', clue: 'Mình là những chiếc lá dài, thơm như cơm mới nấu.', fact: 'Lá dứa cho màu xanh để làm bánh.' },
              { art: 'tomato', name: 'Cà chua', clue: 'Mình tròn, đỏ mọng, hay có mặt trong món canh chua.', fact: 'Cà chua chín dần từ xanh sang đỏ.' }
            ] },
          { id: 'ghep-doi', type: 'match', title: 'Ghép đôi thiên nhiên', icon: 'b-cards', pts: 10,
            desc: 'Nối mỗi hình với bạn của nó: màu sắc, tên gọi và những cặp có liên quan.',
            rounds: [
              { title: 'Rau củ nào màu gì?', pairs: [
                { l: 'tomato', r: 'c:do', ex: 'Cà chua chín màu đỏ.' }, { l: 'ing-ca-rot', r: 'c:cam', ex: 'Cà rốt màu cam.' },
                { l: 'corn', r: 'c:vang', ex: 'Bắp ngô màu vàng.' }, { l: 'eggplant', r: 'c:tim', ex: 'Cà tím màu tím.' } ] },
              { title: 'Hình nào tên gì?', hideNames: true, pairs: [
                { l: 'broccoli', r: 't:Bông cải xanh', ex: 'Đó là bông cải xanh.' }, { l: 'strawberry', r: 't:Dâu tây', ex: 'Đó là quả dâu tây.' },
                { l: 'sunflower', r: 't:Hoa hướng dương', ex: 'Hoa hướng dương luôn quay về phía mặt trời.' }, { l: 'ing-dau-biec', r: 't:Hoa đậu biếc', ex: 'Hoa đậu biếc cho màu xanh dương.' } ] },
              { title: 'Ai là bạn của ai?', pairs: [
                { l: 'rabbit', r: 'ing-ca-rot', ex: 'Bạn thỏ rất thích ăn cà rốt.' }, { l: 'bee', r: 'sunflower', ex: 'Ong hút mật từ hoa.' },
                { l: 'seed', r: 'sprout', ex: 'Hạt giống nảy mầm thành cây con.' }, { l: 'cloudrain', r: 'tree', ex: 'Mưa tưới nước cho cây lớn.' } ] }
            ] }
        ],
        challenge: { id: 'tong-ket-sac-mau', type: 'quiz', title: 'Thử thách: Vương quốc sắc màu', pts: 10, count: 10,
          desc: 'Trả lời các câu hỏi về màu sắc của thiên nhiên.',
          questions: [
            mc('Củ nghệ thường có màu gì?', ['Vàng', 'Xanh dương', 'Tím'], 'Bên trong củ nghệ vàng như nắng.', { art: 'ing-nghe' }),
            mc('Lá cây thường có màu gì?', ['Xanh lá', 'Đỏ', 'Đen'], 'Lá cây có diệp lục nên màu xanh lá.', { art: 'leaf' }),
            mc('Loại thực vật nào có màu đỏ tím?', ['Củ dền', 'Dưa leo', 'Bắp ngô'], 'Củ dền có màu đỏ tím nhờ chất betanin.', { pics: ['ing-den', 'cucumber', 'corn'] }),
            mc('Hoa đậu biếc cho màu gì?', ['Xanh dương', 'Vàng', 'Cam'], 'Ngâm hoa đậu biếc, nước có màu xanh dương.', { art: 'ing-dau-biec' }),
            mc('Phần nào của cây đón nắng?', ['Lá', 'Rễ', 'Hạt'], 'Lá cây đón nắng để làm thức ăn cho cây.'),
            tf('Cà rốt mọc dưới đất.', true, 'Củ cà rốt nằm dưới đất, lá ở trên.'),
            tf('Bút sáp làm từ rau củ nên ăn được.', false, 'Bút sáp chỉ để vẽ, không cho vào miệng nhé!'),
            mc('Quả nào màu vàng?', ['Chuối', 'Cà chua', 'Nho'], 'Quả chuối chín màu vàng.', { pics: ['banana', 'tomato', 'grapes'] }),
            mc('Vì sao lá cây có màu xanh?', ['Nhờ có diệp lục', 'Vì được sơn', 'Vì uống nước xanh'], 'Diệp lục làm lá cây xanh.'),
            mc('Cà tím có màu gì?', ['Tím', 'Trắng', 'Xanh dương'], 'Cà tím có vỏ màu tím bóng.', { art: 'eggplant' }),
            tf('Lá cây già có thể chuyển sang màu vàng, nâu.', true, 'Lá già đổi màu rồi rụng xuống.'),
            mc('Bắp cải tím có màu gì?', ['Tím', 'Cam', 'Vàng'], 'Bắp cải tím có lá màu tím.', { art: 'ing-bap-cai' })
          ] }
      },

      /* ================= VÙNG 2 ================= */
      {
        id: 'phep-thuat', name: 'Phòng thí nghiệm phép thuật', color: 'bap-cai', place: 'Phòng thí nghiệm',
        char: 'eco', charName: 'Giáo sư ECO', charRole: 'Nhà khoa học màu sắc',
        short: 'Nơi pha trộn, khám phá và sáng tạo màu sắc như một nhà khoa học.',
        learn: ['Màu cơ bản, màu nóng và màu lạnh', 'Pha màu, sắc độ đậm nhạt', 'Vẽ tranh thật đẹp'],
        hello: 'Xin chào trợ lý nhí! Ta là Giáo sư ECO. Hôm nay mình cùng pha màu nhé!',
        story: ['Giáo sư ECO có một chiếc bình thần kỳ.', 'Chỉ cần trộn đúng màu, bình sẽ phát sáng và vẽ nên cầu vồng.', 'Bé hãy làm trợ lý của Giáo sư nhé!'],
        badge: { name: 'Nhà khoa học màu sắc', icon: 'b-beaker' },
        lessons: [
          { id: 'pt1', title: 'Ba màu cơ bản', vis: 'primaries',
            text: 'Đỏ, vàng và xanh dương là ba màu cơ bản. Từ ba màu này, ta pha ra được rất nhiều màu khác!',
            quiz: mc('Màu nào là màu cơ bản?', ['Đỏ', 'Cam', 'Tím'], 'Đỏ, vàng, xanh dương là ba màu cơ bản.') },
          { id: 'pt2', title: 'Màu nóng và màu lạnh', vis: 'warmcool',
            text: 'Đỏ, cam, vàng là màu nóng, gợi nhớ mặt trời và ngọn lửa. Xanh dương, xanh lá, tím là màu lạnh, gợi nhớ biển xanh và rừng cây.',
            quiz: mc('Màu nào là màu nóng?', ['Cam', 'Xanh dương', 'Tím'], 'Cam là màu nóng, như ánh nắng chiều.') },
          { id: 'pt3', title: 'Các cặp màu kết hợp', vis: 'pairs',
            text: 'Có những cặp màu đứng cạnh nhau rất nổi bật: đỏ và xanh lá, xanh dương và cam, vàng và tím. Họa sĩ gọi đó là cặp màu bổ túc.',
            quiz: mc('Màu nào đi cùng màu tím thành cặp nổi bật?', ['Vàng', 'Tím nhạt', 'Đen'], 'Vàng và tím là một cặp màu bổ túc.') },
          { id: 'pt4', title: 'Pha trộn màu sắc', vis: 'mixes',
            text: 'Đỏ + vàng = cam. Vàng + xanh dương = xanh lá. Đỏ + xanh dương = tím. Hai màu cơ bản trộn lại tạo ra một màu mới.',
            quiz: mc('Vàng trộn với xanh dương ra màu gì?', ['Xanh lá', 'Đỏ', 'Nâu'], 'Vàng + xanh dương = xanh lá.') },
          { id: 'pt5', title: 'Sắc độ đậm và nhạt', vis: 'shades',
            text: 'Thêm màu trắng, màu sẽ nhạt đi. Thêm màu đen, màu sẽ đậm hơn. Với bút sáp, tô nhẹ tay thì nhạt, tô mạnh tay thì đậm.',
            quiz: mc('Muốn màu đỏ nhạt thành màu hồng, ta thêm màu gì?', ['Trắng', 'Đen', 'Xanh lá'], 'Thêm trắng làm màu nhạt đi.') },
          { id: 'pt6', title: 'Màu sắc trong hội họa', vis: 'painting',
            text: 'Họa sĩ dùng màu để kể chuyện: màu nóng cho bức tranh vui tươi, ấm áp; màu lạnh cho bức tranh yên bình, mát mẻ. Bé cũng có thể làm họa sĩ!',
            link: { href: '#to-mau', label: 'Mở sổ tô màu' },
            quiz: mc('Muốn vẽ biển mát lạnh, bé dùng nhiều màu gì?', ['Xanh dương', 'Đỏ', 'Cam'], 'Xanh dương là màu lạnh, giống màu biển.') }
        ],
        games: [
          { id: 'pha-mau-tai-ba', type: 'mixlab', title: 'Nhà pha màu tài ba', icon: 'b-beaker', pts: 10, count: 6,
            desc: 'Kéo hai lọ màu vào bình thí nghiệm để pha ra màu Giáo sư cần.',
            bases: [
              { id: 'do', name: 'Đỏ', hex: '#D7263D' }, { id: 'vang', name: 'Vàng', hex: '#F2C230' }, { id: 'xanh', name: 'Xanh dương', hex: '#2F62B0' },
              { id: 'trang', name: 'Trắng', hex: '#FFFFFF' }, { id: 'den', name: 'Đen', hex: '#2B2722' }
            ],
            recipes: [
              { a: 'do', b: 'vang', name: 'Cam', hex: '#EA7A22', ex: 'Đỏ và vàng là hai màu nóng, trộn lại ra màu cam rực rỡ.' },
              { a: 'vang', b: 'xanh', name: 'Xanh lá', hex: '#4C9A3B', ex: 'Vàng gặp xanh dương thành xanh lá, màu của cây cối.' },
              { a: 'do', b: 'xanh', name: 'Tím', hex: '#6E3C8F', ex: 'Đỏ trộn với xanh dương cho ra màu tím.' },
              { a: 'do', b: 'trang', name: 'Hồng', hex: '#F08AA0', ex: 'Thêm trắng làm màu đỏ nhạt đi thành màu hồng.' },
              { a: 'xanh', b: 'trang', name: 'Xanh da trời', hex: '#8DB4EA', ex: 'Xanh dương thêm trắng thành xanh da trời nhạt.' },
              { a: 'xanh', b: 'den', name: 'Xanh đậm', hex: '#1C3563', ex: 'Thêm đen làm màu xanh dương đậm hơn.' }
            ] },
          { id: 'san-tim-mau', type: 'hunt', title: 'Săn tìm màu sắc', icon: 'b-quiz', pts: 10,
            desc: 'Tìm tất cả đồ vật có màu Giáo sư yêu cầu.',
            rounds: [{ color: 'do' }, { color: 'vang' }, { color: 'xanhla' }, { color: 'tim' }],
            items: [
              { art: 'tomato', name: 'Cà chua', color: 'do' }, { art: 'strawberry', name: 'Dâu tây', color: 'do' }, { art: 'chili', name: 'Ớt đỏ', color: 'do' },
              { art: 'lon', name: 'Lon nước đỏ', color: 'do' }, { art: 'nap', name: 'Nắp chai đỏ', color: 'do' }, { art: 'mushroom', name: 'Nấm đỏ', color: 'do' },
              { art: 'banana', name: 'Quả chuối', color: 'vang' }, { art: 'corn', name: 'Bắp ngô', color: 'vang' }, { art: 'sunflower', name: 'Hoa hướng dương', color: 'vang' },
              { art: 'sun', name: 'Ông mặt trời', color: 'vang' }, { art: 'b-star', name: 'Ngôi sao', color: 'vang' }, { art: 'bulb', name: 'Bóng đèn', color: 'vang' },
              { art: 'cucumber', name: 'Dưa leo', color: 'xanhla' }, { art: 'broccoli', name: 'Bông cải xanh', color: 'xanhla' }, { art: 'leaf', name: 'Chiếc lá', color: 'xanhla' },
              { art: 'lime', name: 'Quả chanh', color: 'xanhla' }, { art: 'frog', name: 'Chú ếch', color: 'xanhla' }, { art: 'tree', name: 'Cây xanh', color: 'xanhla' },
              { art: 'eggplant', name: 'Cà tím', color: 'tim' }, { art: 'grapes', name: 'Chùm nho', color: 'tim' }, { art: 'sweetpotato', name: 'Khoai lang tím', color: 'tim' },
              { art: 'ing-bap-cai', name: 'Bắp cải tím', color: 'tim' }, { art: 'daugoi', name: 'Chai dầu gội tím', color: 'tim' },
              { art: 'sky', name: 'Bầu trời', color: 'xanhduong' }, { art: 'wave', name: 'Sóng biển', color: 'xanhduong' }, { art: 'vo', name: 'Quyển vở xanh', color: 'xanhduong' },
              { art: 'orange', name: 'Quả cam', color: 'cam' }, { art: 'pumpkin', name: 'Bí đỏ', color: 'cam' }, { art: 'fish', name: 'Cá cam', color: 'cam' }
            ] },
          { id: 'hoa-si-nhi', type: 'paint', title: 'Họa sĩ nhí tài ba', icon: 'b-crayon', pts: 10,
            desc: 'Chọn màu, chạm vào từng vùng để tô. Tô xong lưu tranh vào bộ sưu tập.',
            pages: ['vuon', 'dongvat', 'bien'] }
        ],
        challenge: { id: 'tong-ket-phep-thuat', type: 'quiz', title: 'Thử thách: Phòng thí nghiệm', pts: 10, count: 10,
          desc: 'Nhận biết màu sắc, màu nóng – lạnh và cách pha màu.',
          questions: [
            mc('Đâu là ba màu cơ bản?', ['Đỏ, vàng, xanh dương', 'Cam, tím, xanh lá', 'Đen, trắng, nâu'], 'Đỏ, vàng, xanh dương là ba màu cơ bản.'),
            mc('Đỏ trộn với vàng ra màu gì?', ['Cam', 'Tím', 'Xanh lá'], 'Đỏ + vàng = cam.'),
            mc('Màu nào là màu lạnh?', ['Xanh dương', 'Cam', 'Đỏ'], 'Xanh dương là màu lạnh, như nước biển.'),
            tf('Màu vàng là màu nóng.', true, 'Vàng là màu nóng, như ánh nắng.'),
            mc('Muốn màu xanh dương đậm hơn, ta thêm màu gì?', ['Đen', 'Trắng', 'Vàng'], 'Thêm đen làm màu đậm hơn.'),
            mc('Đỏ trộn với xanh dương ra màu gì?', ['Tím', 'Cam', 'Vàng'], 'Đỏ + xanh dương = tím.'),
            mc('Đồ vật nào màu xanh lá?', ['Chiếc lá', 'Cà chua', 'Quả chuối'], 'Chiếc lá màu xanh lá.', { pics: ['leaf', 'tomato', 'banana'] }),
            tf('Thêm màu trắng làm màu nhạt hơn.', true, 'Thêm trắng, màu sẽ nhạt đi.'),
            mc('Màu nào đi cặp nổi bật với màu đỏ?', ['Xanh lá', 'Hồng', 'Đỏ sẫm'], 'Đỏ và xanh lá là cặp màu bổ túc.'),
            mc('Đồ vật nào màu tím?', ['Chùm nho', 'Bắp ngô', 'Quả cam'], 'Chùm nho màu tím.', { pics: ['grapes', 'corn', 'orange'] }),
            tf('Trộn vàng với xanh dương sẽ ra màu đỏ.', false, 'Vàng + xanh dương = xanh lá.'),
            mc('Vẽ ông mặt trời ấm áp, bé chọn màu gì?', ['Vàng cam', 'Xanh dương', 'Tím'], 'Mặt trời ấm áp hợp với màu nóng.', { art: 'sun' })
          ] }
      },

      /* ================= VÙNG 3 ================= */
      {
        id: 'tai-che', name: 'Thành phố tái chế', color: 'ca-rot', place: 'Nhà máy tái chế',
        char: 'robo', charName: 'Rô-bốt Tái Chế', charRole: 'Kỹ sư tái chế',
        short: 'Thành phố nơi rác được phân loại đúng cách và biến thành đồ dùng mới.',
        learn: ['Phân loại giấy, nhựa, kim loại, hữu cơ', 'Quy trình tái chế', 'Tái sử dụng và giảm rác'],
        hello: 'Bíp bíp! Chào bé! Mình là Rô-bốt Tái Chế. Cùng làm sạch thành phố nhé!',
        story: ['Nhà máy tái chế của thành phố bỗng ngừng chạy.', 'Rác bị trộn lẫn lung tung, máy móc không phân loại kịp!', 'Rô-bốt Tái Chế cần bé giúp sắp xếp lại.'],
        badge: { name: 'Chiến binh tái chế', icon: 'b-recycle' },
        lessons: [
          { id: 'tc1', title: 'Rác thải là gì?', vis: ['chainhua', 'vochuoi', 'bao', 'lon'],
            text: 'Rác thải là những thứ ta không dùng nữa và bỏ đi: vỏ trái cây, giấy cũ, chai nhựa, lon nước... Mỗi ngày, nhà nào cũng có rác.',
            quiz: mc('Thứ nào là rác thải?', ['Vỏ chuối đã ăn xong', 'Quyển sách đang đọc', 'Đôi giày đang đi'], 'Vỏ chuối không dùng nữa nên là rác.') },
          { id: 'tc2', title: 'Vì sao phải phân loại rác?', vis: 'bins',
            text: 'Phân loại là chia rác vào đúng thùng. Rác được phân loại đúng thì dễ tái chế hơn, ít phải chôn lấp hay đốt bỏ.',
            quiz: mc('Phân loại rác giúp gì?', ['Tái chế dễ hơn', 'Rác nhiều hơn', 'Không giúp gì'], 'Rác đúng thùng thì tái chế dễ hơn.') },
          { id: 'tc3', title: 'Giấy, nhựa và kim loại', vis: ['carton', 'chainhua', 'lon'],
            text: 'Giấy: báo, vở, hộp carton. Nhựa: chai, hộp, nắp nhựa. Kim loại: lon nhôm, hộp thiếc. Ba loại này tái chế được nếu sạch và khô.',
            quiz: mc('Lon nước ngọt làm bằng gì?', ['Kim loại', 'Giấy', 'Nhựa'], 'Lon nước ngọt làm bằng nhôm, là kim loại.') },
          { id: 'tc4', title: 'Rác hữu cơ', vis: ['vochuoi', 'votrung', 'lakho', 'raucu'],
            text: 'Rác hữu cơ là vỏ trái cây, rau thừa, lá khô, vỏ trứng. Chúng tự phân hủy và có thể ủ thành phân bón cho cây.',
            quiz: mc('Rác hữu cơ có thể biến thành gì?', ['Phân bón', 'Chai nhựa', 'Lon nhôm'], 'Rác hữu cơ ủ thành phân bón.') },
          { id: 'tc5', title: 'Rác được tái chế thế nào?', vis: 'process',
            text: 'Thu gom, phân loại, làm sạch và nghiền nhỏ, rồi làm thành đồ mới. Chai nhựa cũ có thể thành áo, thành ghế; giấy cũ thành giấy mới.',
            quiz: mc('Bước đầu tiên của tái chế là gì?', ['Thu gom rác', 'Làm đồ mới', 'Đem đi chơi'], 'Phải thu gom rác trước đã.') },
          { id: 'tc6', title: 'Tái sử dụng đồ cũ', vis: ['loigiay', 'arrow', 'p-penholder'],
            text: 'Tái sử dụng là dùng lại đồ cũ vào việc mới: lõi giấy thành ống cắm bút, hộp sữa chua thành chậu cây, hộp carton thành hộp đựng đồ chơi.',
            link: { href: '#thu-thach', label: 'Xem đồ tái chế tự làm' },
            quiz: mc('Hộp sữa chua đã rửa sạch có thể làm gì?', ['Chậu trồng cây nhỏ', 'Ném xuống ao', 'Đốt đi'], 'Hộp sữa chua làm chậu ươm cây rất xinh.') },
          { id: 'tc7', title: 'Giảm rác thải', vis: ['k-bag', 'p-bag', 'drop'],
            text: 'Cách tốt nhất là tạo ra ít rác: mang túi vải đi chợ, dùng bình nước riêng, viết giấy cả hai mặt. Nhớ 3 việc: giảm bớt, dùng lại, tái chế!',
            quiz: mc('Đi chợ, mang gì để bớt túi nilon?', ['Túi vải', 'Thêm túi nilon', 'Hộp xốp'], 'Túi vải dùng được rất nhiều lần.') }
        ],
        games: [
          { id: 'nha-may-tai-che', type: 'sort', title: 'Cứu nhà máy tái chế', icon: 'factory', pts: 10, perBin: 3,
            desc: 'Kéo rác vào đúng thùng để nhà máy chạy lại.' },
          { id: 'nha-phat-minh', type: 'invent', title: 'Nhà phát minh tí hon', icon: 'p-car', pts: 10, count: 6,
            desc: 'Chọn hai vật liệu cũ để chế tạo đồ dùng mới.',
            materials: [
              { id: 'loigiay', name: 'Lõi giấy' }, { id: 'carton', name: 'Hộp carton' }, { id: 'chainhua', name: 'Chai nhựa' },
              { id: 'nap', name: 'Nắp chai' }, { id: 'lon', name: 'Lon nhôm' }, { id: 'vaivun', name: 'Vải vụn' },
              { id: 'day', name: 'Sợi dây' }, { id: 'seed', name: 'Hạt giống' }, { id: 'b-crayon', name: 'Bút sáp' }, { id: 'hopsua', name: 'Hộp sữa chua' }
            ],
            recipes: [
              { a: 'loigiay', b: 'b-crayon', name: 'Ống cắm bút', art: 'p-penholder', need: 'Một món giúp cắm bút cho gọn gàng.', ex: 'Tô màu lõi giấy rồi cắm bút vào. Lõi giấy có việc làm mới!' },
              { a: 'chainhua', b: 'seed', name: 'Chậu cây mini', art: 'p-pot', need: 'Một chiếc chậu nhỏ để trồng cây.', ex: 'Cắt đôi chai nhựa, cho đất vào rồi gieo hạt. Chai cũ thành chậu cây!' },
              { a: 'carton', b: 'nap', name: 'Ô tô đồ chơi', art: 'p-car', need: 'Một chiếc xe đồ chơi có bánh tròn.', ex: 'Hộp carton làm thân xe, nắp chai làm bánh xe.' },
              { a: 'lon', b: 'day', name: 'Điện thoại lon', art: 'p-phone', need: 'Một món đồ để nói chuyện với bạn ở xa.', ex: 'Nối hai lon bằng sợi dây căng, nói thầm bạn vẫn nghe thấy!' },
              { a: 'vaivun', b: 'day', name: 'Túi vải xinh', art: 'p-bag', need: 'Một chiếc túi đi chợ thay cho túi nilon.', ex: 'Vải vụn may thành túi, sợi dây làm quai.' },
              { a: 'hopsua', b: 'seed', name: 'Chậu ươm mầm', art: 'p-sprout', need: 'Một chiếc cốc nhỏ để hạt nảy mầm.', ex: 'Hộp sữa chua rửa sạch, đục lỗ, gieo hạt là có chậu ươm mầm.' }
            ] },
          { id: 'dung-sai-tai-che', type: 'tf', title: 'Đúng hay sai về tái chế?', icon: 'b-quiz', pts: 10, count: 8,
            desc: 'Đọc câu rồi chọn Đúng hoặc Sai.',
            questions: [
              tf('Chai nhựa nên được rửa sạch trước khi bỏ vào thùng tái chế.', true, 'Chai sạch thì nhà máy tái chế dễ hơn.'),
              tf('Vỏ chuối bỏ vào thùng kim loại.', false, 'Vỏ chuối là rác hữu cơ.'),
              tf('Hộp carton nên gấp dẹp trước khi bỏ.', true, 'Gấp dẹp cho gọn, thùng chứa được nhiều hơn.'),
              tf('Pin cũ có thể bỏ chung với rác thường.', false, 'Pin có chất độc, cần bỏ ở điểm thu gom riêng.'),
              tf('Giấy cũ có thể tái chế thành giấy mới.', true, 'Giấy cũ được nghiền thành bột để làm giấy mới.'),
              tf('Lon nhôm chỉ tái chế được một lần.', false, 'Lon nhôm tái chế được rất nhiều lần.'),
              tf('Rác hữu cơ có thể ủ thành phân bón.', true, 'Vỏ rau củ, lá khô ủ thành phân bón cho cây.'),
              tf('Túi vải dùng được nhiều lần nên tốt hơn túi nilon.', true, 'Túi vải giúp bớt rác nhựa.'),
              tf('Vứt rác xuống sông thì rác sẽ tự biến mất.', false, 'Rác trôi ra biển, làm hại cá và rùa.'),
              tf('Lõi giấy vệ sinh có thể làm ống cắm bút.', true, 'Đó là tái sử dụng đồ cũ.'),
              tf('Hộp sữa chua còn đầy sữa vẫn bỏ được vào thùng tái chế.', false, 'Cần rửa sạch hộp trước khi bỏ.'),
              tf('Dùng ít đồ nhựa một lần giúp bớt rác.', true, 'Bớt dùng đồ một lần là bớt rác.')
            ] }
        ],
        challenge: { id: 'tong-ket-tai-che', type: 'quiz', title: 'Thử thách: Thành phố tái chế', pts: 10, count: 10,
          desc: 'Nhận biết các loại rác, phân loại và tái sử dụng.',
          questions: [
            mc('Hộp carton bỏ vào thùng nào?', ['Giấy', 'Nhựa', 'Hữu cơ'], 'Carton làm từ giấy.', { art: 'carton' }),
            mc('Chai dầu gội là loại rác gì?', ['Nhựa', 'Kim loại', 'Giấy'], 'Chai dầu gội làm bằng nhựa.', { art: 'daugoi' }),
            mc('Thứ nào là rác hữu cơ?', ['Vỏ trứng', 'Lon nước', 'Chai nhựa'], 'Vỏ trứng là rác hữu cơ.', { pics: ['votrung', 'lon', 'chainhua'] }),
            tf('Lon nhôm tái chế được nhiều lần.', true, 'Lon nhôm tái chế mãi mà vẫn tốt.'),
            mc('Lõi giấy có thể tái sử dụng làm gì?', ['Ống cắm bút', 'Đồ ăn', 'Nước uống'], 'Lõi giấy trang trí thành ống cắm bút.'),
            mc('Việc nào giúp giảm rác?', ['Mang bình nước riêng', 'Mua nước chai mỗi ngày', 'Dùng thật nhiều ống hút nhựa'], 'Bình nước riêng dùng được rất lâu.'),
            tf('Rác nên rửa sạch, để khô trước khi bỏ vào thùng tái chế.', true, 'Rác sạch thì tái chế dễ hơn.'),
            mc('Hộp cá (hộp thiếc) bỏ vào thùng nào?', ['Kim loại', 'Giấy', 'Hữu cơ'], 'Hộp thiếc là kim loại.', { art: 'hopca' }),
            mc('Thứ nào làm bằng giấy?', ['Báo cũ', 'Nắp chai', 'Lon nước'], 'Báo cũ làm bằng giấy.', { pics: ['bao', 'nap', 'lon'] }),
            mc('Pin cũ nên bỏ ở đâu?', ['Điểm thu gom pin riêng', 'Thùng hữu cơ', 'Xuống ao'], 'Pin cần được thu gom riêng.'),
            tf('Vỏ trứng là rác nhựa.', false, 'Vỏ trứng là rác hữu cơ.'),
            mc('Việc nào làm trước?', ['Phân loại rác', 'Làm thành đồ mới'], 'Phải phân loại rồi mới tái chế được.')
          ] }
      },

      /* ================= VÙNG 4 ================= */
      {
        id: 'hanh-tinh', name: 'Hành tinh xanh', color: 'dau-biec', place: 'Trái Đất',
        char: 'earth', charName: 'Bạn Trái Đất', charRole: 'Người bảo vệ hành tinh',
        short: 'Khám phá rừng, biển, động vật và cách bảo vệ ngôi nhà chung Trái Đất.',
        learn: ['Cây xanh, động vật, hệ sinh thái', 'Nguồn nước và ô nhiễm', 'Tiết kiệm năng lượng'],
        hello: 'Chào bé! Mình là Trái Đất. Cùng mình làm cho hành tinh xanh hơn nhé!',
        story: ['Bạn Trái Đất đang hơi mệt: biển có rác, rừng thiếu cây.', 'Bạn ấy cần những siêu anh hùng nhí.', 'Bé sẵn sàng bảo vệ hành tinh xanh chưa?'],
        badge: { name: 'Sứ giả bảo vệ Trái Đất', icon: 'earth' },
        lessons: [
          { id: 'ht1', title: 'Trái Đất của chúng ta', vis: ['earth'],
            text: 'Trái Đất là ngôi nhà chung của con người, cây cối và muôn loài. Nhìn từ vũ trụ, Trái Đất có màu xanh dương của biển và xanh lá của rừng.',
            quiz: mc('Vì sao Trái Đất nhìn từ xa có nhiều màu xanh dương?', ['Vì có nhiều biển', 'Vì được sơn', 'Vì trời mưa'], 'Biển chiếm phần lớn Trái Đất.') },
          { id: 'ht2', title: 'Cây xanh rất quan trọng', vis: ['tree', 'sun', 'drop'],
            text: 'Cây xanh tạo ra khí ô-xi để chúng ta thở, cho bóng mát, cho quả ngọt và là nhà của nhiều loài chim, sóc, côn trùng.',
            quiz: mc('Cây xanh tạo ra khí gì giúp ta thở?', ['Ô-xi', 'Khói', 'Bụi'], 'Cây xanh tạo ra khí ô-xi.') },
          { id: 'ht3', title: 'Các hệ sinh thái', vis: 'ecos',
            text: 'Hệ sinh thái là nơi cây cối, động vật, đất và nước sống cùng nhau, cần nhau: rừng xanh, đại dương, ao hồ, đồng cỏ...',
            quiz: mc('Đâu là một hệ sinh thái?', ['Khu rừng', 'Cái bàn', 'Chiếc xe'], 'Khu rừng có cây, con vật, đất, nước sống cùng nhau.') },
          { id: 'ht4', title: 'Động vật và nơi ở', vis: ['fish', 'bird', 'rabbit'],
            text: 'Mỗi con vật có nơi ở phù hợp: cá sống dưới nước, chim làm tổ trên cây, thỏ đào hang dưới đất. Giữ môi trường sạch là giữ nhà cho các con vật.',
            quiz: mc('Cá sống ở đâu?', ['Dưới nước', 'Trên cây', 'Trong hang đất'], 'Cá sống dưới nước.') },
          { id: 'ht5', title: 'Ô nhiễm môi trường', vis: ['factory', 'bag', 'chainhua'],
            text: 'Khói bụi, rác thải, nước bẩn làm không khí, đất và nước bị ô nhiễm. Ô nhiễm làm người và động vật dễ bị ốm.',
            quiz: mc('Việc nào làm nước sông bị ô nhiễm?', ['Vứt rác xuống sông', 'Trồng cây ven sông', 'Nhặt rác'], 'Rác làm bẩn nước sông.') },
          { id: 'ht6', title: 'Bảo vệ nguồn nước', vis: ['drop', 'wave', 'fish'],
            text: 'Nước sạch rất quý. Khóa vòi khi chải răng, không vứt rác xuống ao hồ, dùng nước vo gạo để tưới cây.',
            quiz: mc('Khi chải răng, bé nên làm gì?', ['Khóa vòi nước', 'Mở vòi suốt', 'Xả thật nhiều nước'], 'Khóa vòi khi chải răng để tiết kiệm nước.') },
          { id: 'ht7', title: 'Tiết kiệm năng lượng', vis: ['bulb', 'sun'],
            text: 'Điện làm sáng đèn, chạy quạt, tủ lạnh. Tắt đèn và quạt khi ra khỏi phòng, tận dụng ánh nắng ban ngày là tiết kiệm năng lượng.',
            quiz: mc('Ra khỏi phòng, bé nhớ làm gì?', ['Tắt đèn, tắt quạt', 'Bật thêm đèn', 'Mở tủ lạnh'], 'Tắt đèn, quạt là tiết kiệm điện.') },
          { id: 'ht8', title: 'Hành động xanh mỗi ngày', vis: ['sprout', 'k-bag', 'b-recycle'],
            text: 'Trồng cây, phân loại rác, mang túi vải, đi bộ hoặc đạp xe khi đi gần. Những việc nhỏ mỗi ngày giúp Trái Đất khỏe hơn!',
            link: { href: '#thu-thach', label: 'Xem thử thách xanh ở nhà' },
            quiz: mc('Việc nào là hành động xanh?', ['Trồng thêm cây', 'Vứt rác bừa bãi', 'Bẻ cành cây'], 'Trồng cây giúp Trái Đất xanh hơn.') }
        ],
        games: [
          { id: 'giai-cuu-dai-duong', type: 'ocean', title: 'Giải cứu đại dương', icon: 'turtle', pts: 10,
            desc: 'Nhặt rác trong biển và giải cứu các bạn sinh vật biển bị mắc lưới.',
            trash: [
              { art: 'chainhua', name: 'Chai nhựa' }, { art: 'bag', name: 'Túi nilon' }, { art: 'lon', name: 'Lon nước' },
              { art: 'hopsua', name: 'Hộp nhựa' }, { art: 'nap', name: 'Nắp chai' }, { art: 'daugoi', name: 'Chai dầu gội' }, { art: 'carton', name: 'Hộp giấy' }
            ],
            animals: [
              { art: 'turtle', name: 'Rùa biển', trapped: true }, { art: 'fish', name: 'Cá nhỏ', trapped: true },
              { art: 'crab', name: 'Bạn cua', trapped: false }, { art: 'jelly', name: 'Bạn sứa', trapped: false }
            ] },
          { id: 'khu-rung-xanh', type: 'forest', title: 'Xây dựng khu rừng xanh', icon: 'tree', pts: 10,
            desc: 'Đặt cây, hoa và con vật vào đúng nơi để khu rừng sống động.',
            homes: { dat: 'Mặt đất', nuoc: 'Ao nước', troi: 'Bầu trời' },
            items: [
              { art: 'tree', name: 'Cây xanh', home: 'dat', why: 'Cây cần đất để mọc rễ.' },
              { art: 'flower', name: 'Bông hoa', home: 'dat', why: 'Hoa mọc lên từ đất.' },
              { art: 'rabbit', name: 'Thỏ', home: 'dat', why: 'Thỏ chạy nhảy và đào hang trên mặt đất.' },
              { art: 'mushroom', name: 'Cây nấm', home: 'dat', why: 'Nấm mọc dưới tán cây, trên đất ẩm.' },
              { art: 'fish', name: 'Cá', home: 'nuoc', why: 'Cá cần nước để thở và bơi.' },
              { art: 'frog', name: 'Ếch', home: 'nuoc', why: 'Ếch sống ở ao, đẻ trứng dưới nước.' },
              { art: 'bird', name: 'Chim', home: 'troi', why: 'Chim bay trên bầu trời.' },
              { art: 'butterfly', name: 'Bướm', home: 'troi', why: 'Bướm bay lượn tìm hoa.' },
              { art: 'bee', name: 'Ong', home: 'troi', why: 'Ong bay đi tìm mật hoa.' }
            ],
            slots: [
              { home: 'troi', x: 22, y: 18 }, { home: 'troi', x: 50, y: 12 },
              { home: 'dat', x: 10, y: 64 }, { home: 'dat', x: 29, y: 76 }, { home: 'dat', x: 46, y: 62 }, { home: 'dat', x: 44, y: 88 },
              { home: 'nuoc', x: 72, y: 82 }, { home: 'nuoc', x: 89, y: 82 }
            ] },
          { id: 'sieu-anh-hung', type: 'hero', title: 'Siêu anh hùng bảo vệ Trái Đất', icon: 'b-star', pts: 10, count: 8,
            desc: 'Chọn cách xử lý đúng trong mỗi tình huống.',
            questions: [
              mc('Bé thấy vòi nước ở trường chảy mãi.', ['Khóa vòi lại hoặc báo cô giáo', 'Kệ nó', 'Mở to thêm'], 'Khóa vòi giúp tiết kiệm nước sạch.'),
              mc('Ăn kẹo xong, bé còn vỏ kẹo trong tay.', ['Bỏ vào thùng rác', 'Vứt xuống sân', 'Nhét vào bụi cây'], 'Rác phải bỏ vào thùng.'),
              mc('Cả nhà ra khỏi phòng mà đèn vẫn sáng.', ['Tắt đèn trước khi đi', 'Để đèn sáng cả ngày', 'Bật thêm quạt'], 'Tắt đèn là tiết kiệm điện.'),
              mc('Bạn rủ bé bẻ cành cây trong công viên.', ['Khuyên bạn không bẻ cây', 'Cùng bẻ thật nhiều', 'Dẫm lên bồn hoa'], 'Cây xanh cần được bảo vệ.'),
              mc('Đi biển, bé thấy chai nhựa trên bãi cát.', ['Nhờ người lớn nhặt bỏ vào thùng rác', 'Đá chai xuống biển', 'Vùi chai vào cát'], 'Nhặt rác giúp biển sạch, bảo vệ rùa và cá.'),
              mc('Mẹ đi chợ, bé nhắc mẹ mang gì?', ['Túi vải', 'Thật nhiều túi nilon', 'Hộp xốp'], 'Túi vải dùng được nhiều lần.'),
              mc('Nhà còn chai nhựa rỗng.', ['Rửa sạch, bỏ vào thùng tái chế', 'Đốt đi', 'Vứt ra đường'], 'Chai nhựa sạch tái chế được.'),
              mc('Trường tổ chức trồng cây.', ['Hăng hái tham gia, tưới cây', 'Ở nhà xem ti vi', 'Nhổ cây non'], 'Trồng cây giúp không khí trong lành.'),
              mc('Trời nắng đẹp, phòng học rất sáng.', ['Tắt bớt đèn, kéo rèm đón nắng', 'Bật hết đèn', 'Đóng kín cửa rồi bật đèn'], 'Dùng ánh nắng là tiết kiệm điện.'),
              mc('Bé thấy chú chim non rơi khỏi tổ.', ['Báo người lớn để giúp chim', 'Bắt chim về nhốt', 'Ném đá vào chim'], 'Người lớn sẽ giúp chim về tổ an toàn.'),
              mc('Đi chơi gần nhà, cả nhà nên đi bằng gì?', ['Đi bộ hoặc đạp xe', 'Đi ô tô dù rất gần'], 'Đi bộ, đạp xe không thải khói.'),
              mc('Ăn trưa xong còn thừa cơm, rau.', ['Bỏ vào thùng rác hữu cơ', 'Đổ xuống cống', 'Vứt chung với chai nhựa'], 'Thức ăn thừa là rác hữu cơ.')
            ] }
        ],
        challenge: { id: 'tong-ket-hanh-tinh', type: 'quiz', title: 'Thử thách: Hành tinh xanh', pts: 10, count: 10,
          desc: 'Cây xanh, động vật, nguồn nước, ô nhiễm và tiết kiệm năng lượng.',
          questions: [
            mc('Cây xanh cho chúng ta điều gì?', ['Khí ô-xi và bóng mát', 'Khói bụi', 'Rác thải'], 'Cây xanh cho ô-xi và bóng mát.', { art: 'tree' }),
            mc('Con vật nào sống dưới nước?', ['Cá', 'Thỏ', 'Chim'], 'Cá sống dưới nước.', { pics: ['fish', 'rabbit', 'bird'] }),
            tf('Vứt rác xuống biển làm hại rùa và cá.', true, 'Rác nhựa làm rùa và cá bị thương.'),
            mc('Cách nào giúp tiết kiệm điện?', ['Tắt đèn khi ra khỏi phòng', 'Mở tủ lạnh thật lâu', 'Bật đèn ban ngày'], 'Tắt đèn khi không dùng.', { art: 'bulb' }),
            mc('Điều gì gây ô nhiễm không khí?', ['Khói xe và khói nhà máy', 'Cây xanh', 'Gió mát'], 'Khói làm bẩn không khí.'),
            tf('Nước sạch còn rất nhiều nên dùng thoải mái.', false, 'Nước sạch rất quý, cần tiết kiệm.'),
            mc('Việc nào bảo vệ môi trường?', ['Trồng cây', 'Bẻ cành', 'Vứt rác'], 'Trồng cây giúp Trái Đất xanh hơn.'),
            mc('Hệ sinh thái rừng gồm những gì?', ['Cây cối, động vật, đất, nước', 'Chỉ có nhà cửa', 'Chỉ có xe cộ'], 'Rừng là nơi cây, con vật, đất, nước sống cùng nhau.'),
            mc('Chim thường làm tổ ở đâu?', ['Trên cây', 'Dưới nước', 'Trong tủ lạnh'], 'Chim làm tổ trên cây.', { art: 'bird' }),
            tf('Đi bộ khi đến nơi gần giúp không khí sạch hơn.', true, 'Đi bộ không thải khói.'),
            mc('Khi chải răng, ta nên làm gì?', ['Khóa vòi nước', 'Mở vòi suốt'], 'Khóa vòi để tiết kiệm nước.', { art: 'drop' }),
            mc('Con vật nào hay bị mắc túi nilon dưới biển?', ['Rùa biển', 'Thỏ', 'Ong'], 'Rùa biển tưởng túi nilon là sứa nên ăn phải.', { pics: ['turtle', 'rabbit', 'bee'] })
          ] }
      }
    ],

    /* Vật phẩm mở khóa khi chơi (không mua bằng tiền).
       rule.t: free | stars (n) | level (n) | badge (zone) | badges (n) | game (id, stars?) | title | xp (n) */
    rewards: [
      { id: 'nv-mam', kind: 'char', art: 'mam', name: 'Nhân vật Mầm Xanh', rule: { t: 'badge', zone: 'sac-mau' } },
      { id: 'nv-eco', kind: 'char', art: 'eco', name: 'Nhân vật Giáo sư ECO', rule: { t: 'badge', zone: 'phep-thuat' } },
      { id: 'nv-robo', kind: 'char', art: 'robo', name: 'Nhân vật Rô-bốt Tái Chế', rule: { t: 'badge', zone: 'tai-che' } },
      { id: 'nv-earth', kind: 'char', art: 'earth', name: 'Nhân vật Bạn Trái Đất', rule: { t: 'badge', zone: 'hanh-tinh' } },
      { id: 'nv-hero', kind: 'char', art: 'hero', name: 'Bé Sáp siêu anh hùng', rule: { t: 'game', id: 'sieu-anh-hung', stars: 3 } },
      { id: 'khung-la', kind: 'frame', art: 'leaf', name: 'Khung lá xanh', rule: { t: 'stars', n: 6 } },
      { id: 'khung-sao', kind: 'frame', art: 'b-star', name: 'Khung ngôi sao', rule: { t: 'stars', n: 20 } },
      { id: 'khung-cau-vong', kind: 'frame', art: 'b-rainbow', name: 'Khung cầu vồng', rule: { t: 'level', n: 3 } },
      { id: 'khung-vang', kind: 'frame', art: 'i-passport', name: 'Khung vàng Nhà khám phá', rule: { t: 'title' } },
      { id: 'ho-chieu-bien', kind: 'theme', art: 'wave', name: 'Hộ chiếu Biển xanh', rule: { t: 'level', n: 2 } },
      { id: 'ho-chieu-rung', kind: 'theme', art: 'tree', name: 'Hộ chiếu Rừng xanh', rule: { t: 'badges', n: 2 } },
      { id: 'ho-chieu-cau-vong', kind: 'theme', art: 'b-rainbow', name: 'Hộ chiếu Cầu vồng', rule: { t: 'level', n: 4 } },
      { id: 'deco-cau-vong', kind: 'deco', art: 'b-rainbow', name: 'Cầu vồng trên bản đồ', rule: { t: 'game', id: 'giai-cuu-mau' } },
      { id: 'deco-khinh-khi-cau', kind: 'deco', art: 'b-star', name: 'Khinh khí cầu trên bản đồ', rule: { t: 'stars', n: 12 } },
      { id: 'deco-coi-xay-gio', kind: 'deco', art: 'factory', name: 'Cối xay gió trên bản đồ', rule: { t: 'game', id: 'nha-may-tai-che' } },
      { id: 'deco-thuyen', kind: 'deco', art: 'boat', name: 'Thuyền buồm trên bản đồ', rule: { t: 'game', id: 'giai-cuu-dai-duong' } },
      { id: 'deco-dan-chim', kind: 'deco', art: 'bird', name: 'Đàn chim trên bản đồ', rule: { t: 'game', id: 'khu-rung-xanh' } }
    ]
  };
})();
