ECOCRAYON – website học mà chơi (bản chạy trên máy)
=====================================================

CÁCH MỞ
- Cách nhanh nhất: bấm đúp vào index.html, trang mở bằng trình duyệt (Chrome hoặc Edge).
- Nếu muốn thử trên điện thoại cùng mạng Wi-Fi: mở cửa sổ lệnh trong thư mục này và chạy
      python -m http.server 8080
  rồi trên điện thoại vào http://<địa-chỉ-IP-của-máy>:8080

Trang chạy được khi không có mạng. Chỉ có phông chữ Mali và Be Vietnam Pro cần mạng;
không có mạng thì trang dùng phông có sẵn của máy.

CÁC TRANG (địa chỉ sau dấu #)
  #trang-chu        Trang chủ, hộp bút 6 màu
  #vuon-mau         Vườn màu: 6 nguyên liệu
  #mau-den ... #mau-ca-rot   Trang từng màu (đích của mã QR trên thẻ màu)
  #tai-che          Góc tái chế (đích của mã QR chủ đề tái chế)
  #tro-choi         Danh sách trò chơi
  #ghep-cap  #phan-loai  #do-vui  #pha-mau   4 trò chơi
  #to-mau           Sổ tô màu điện tử
  #thu-thach        Thử thách xanh + đồ tái chế tự làm
  #so-cua-be        Cây xanh, huy hiệu, giấy khen
  #phu-huynh        Giáo án, độ tuổi, an toàn, phiếu quan sát, hỏi đáp
  #ma-qr            In thẻ mã QR cho nhóm
  #ve-ecocrayon     Giới thiệu sản phẩm, vật liệu, lộ trình, rủi ro
Mã chữ trên thẻ cũng dùng được trực tiếp: index.html#NGHE, #DEN, #LADUA, #BIEC, #BAPCAI, #CAROT, #TAICHE

SỬA NỘI DUNG
- Mọi chữ (lời chào, điều thú vị, câu đố, rác, thử thách, giáo án...) nằm trong js/data.js.
- Muốn gắn video thật cho một màu: thêm  video: 'videos/nghe.mp4'  vào màu đó trong js/data.js
  và chép file video vào thư mục videos/.

IN THẺ QR
- Đăng thư mục này lên một trang web (ví dụ GitHub Pages, Netlify), mở #ma-qr,
  dán địa chỉ thật vào ô "Địa chỉ trang web của nhóm", bấm In thẻ.
- Mã QR tạo khi mở bằng file:// chỉ chạy trên đúng máy đó.

DỮ LIỆU
- Lá, huy hiệu, tranh đang tô và phiếu quan sát chỉ lưu trong trình duyệt của máy đang dùng
  (localStorage). Không có gì được gửi lên mạng.

ĐỌC TO
- Nút loa ở góc trên dùng giọng tiếng Việt có sẵn trên máy. Điện thoại Android, iPhone và
  trình duyệt Edge thường có sẵn; Chrome trên Windows có thể không có, khi đó nút sẽ mờ đi.

Thư viện dùng kèm: js/vendor/qrcode.min.js (qrcode-generator 1.4.4, giấy phép MIT).
