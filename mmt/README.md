# Website Khoa Mạng máy tính & Truyền thông (CTU — CICT)

Website tĩnh song ngữ (HTML/CSS/JS thuần), không cần PHP, database hay công cụ
build. Chỉ cần chép hai thư mục `mmt/` và `enmmt/` lên máy chủ là chạy.

Giao diện tham chiếu phong cách trang **csd.ctu.edu.vn** (Khoa Khoa học máy tính):
banner xanh công nghệ với logo ĐHCT + tên đơn vị bên trái, bảng menu vát chéo bên
phải, bên dưới là dải tin nhanh kèm ô tìm kiếm.

## Cấu trúc

```
site_cnc/
├─ mmt/                     BẢN TIẾNG VIỆT + tài nguyên dùng chung
│  ├─ index.html            → chuyển hướng sang mmt.html
│  ├─ mmt.html              → Trang chủ / Giới thiệu
│  ├─ ctdt.html             → Đào tạo (tổng quan)
│  │  ├─ ctdtmmt.html       → KS Mạng máy tính & Truyền thông dữ liệu
│  │  ├─ ctdtmmtclc.html    → KS MMT & TTDL — Chất lượng cao
│  │  └─ ctdtattt.html      → KS An toàn thông tin
│  │  ├─ cdr.html           → Mục tiêu & Chuẩn đầu ra        ★ AUN-QA TC1
│  │  ├─ dayhoc.html        → Dạy, học và đánh giá           ★ AUN-QA TC3+4
│  │  └─ ketqua.html        → Kết quả đào tạo                ★ AUN-QA TC8
│  ├─ ts.html               → Tuyển sinh
│  ├─ nckh.html             → Nghiên cứu khoa học
│  ├─ ptn.html              → Phòng thí nghiệm (tổng quan)
│  │  ├─ ptnmmt.html        → PTN MMT, TTDĐ & Dữ liệu lớn
│  │  └─ ptnattt.html       → PTN An toàn thông tin
│  ├─ sv.html               → Dành cho sinh viên             ★ AUN-QA TC6
│  ├─ gv.html               → Nhân sự
│  ├─ docs/                 → CTĐT chính thức (PDF) của 3 ngành
│  ├─ sitemap.xml           → sơ đồ site nộp cho Google Search Console
│  ├─ assets/
│  │  ├─ css/main.css       → TOÀN BỘ giao diện của CẢ HAI ngôn ngữ
│  │  └─ js/site.js         → Menu, tìm kiếm, chân trang — CẢ HAI ngôn ngữ
│  ├─ imgs/                 → Hình ảnh dùng chung cho cả hai bản
│  ├─ cv/                   → Lý lịch khoa học (PDF)
│  └─ legacy/               → Bản cũ (HTML + 23 tệp CSS cũ), có thể xoá
│
└─ enmmt/                   BẢN TIẾNG ANH
   ├─ index.html            → chuyển hướng sang enmmt.html
   ├─ enmmt.html            → Introduction
   ├─ enctdt.html           → Academic programmes
   │  ├─ enctdtmmt.html     → Engineer in CN & Data Communication
   │  ├─ enctdtmmtclc.html  → High-quality Programme
   │  └─ enctdtattt.html    → Engineer in Information Security
   │  ├─ encdr.html         → Objectives & Learning Outcomes
   │  ├─ endayhoc.html      → Teaching, learning and assessment
   │  └─ enketqua.html      → Programme outcomes
   ├─ ents.html             → Admissions
   ├─ ennckh.html           → Research
   ├─ enptn.html            → Laboratories
   │  ├─ enptnmmt.html      → Networks, Mobile Comm. & Big Data Lab
   │  └─ enptnattt.html     → Information Security Lab
   ├─ ensv.html             → For Students
   ├─ engv.html             → People
   ├─ imgs/                 → (không còn dùng, có thể xoá)
   └─ legacy/               → Bản cũ, có thể xoá
```

> **Quan trọng:** bản tiếng Anh dùng chung `mmt/assets/` và `mmt/imgs/`. Hai thư
> mục `mmt/` và `enmmt/` phải nằm cạnh nhau trên máy chủ (như hiện tại:
> `cit.ctu.edu.vn/mmt/` và `cit.ctu.edu.vn/enmmt/`).

## Sửa nội dung ở đâu?

| Muốn sửa | Sửa tệp |
|---|---|
| Menu chính, menu con (cả 2 ngôn ngữ) | `mmt/assets/js/site.js` → `CONFIG.vi.menu` / `CONFIG.en.menu` |
| Thanh liên kết trên cùng | `site.js` → `CONFIG.<lang>.topbar` |
| Dải tin nhanh (Nổi bật / Highlights) | `site.js` → `CONFIG.<lang>.newsLinks` |
| Điện thoại, email, fanpage | `site.js` → `COMMON` |
| Bật Google Analytics | `site.js` → `COMMON.analyticsId` |
| Bật liên kết góp ý ở chân trang | `site.js` → `COMMON.feedbackForm` |
| Ban lãnh đạo ở chân trang | `site.js` → `CONFIG.<lang>.leaders` |
| Màu sắc, phông chữ, khoảng cách | `mmt/assets/css/main.css` → mục **1. Design tokens** |
| Banner / logo / dải menu vát chéo | `main.css` → mục **4. Masthead** |
| Nội dung từng trang | tệp `.html` tương ứng |

Header và footer được sinh bằng JavaScript từ **một nguồn duy nhất** là
`site.js`. Sửa một lần là cả 30 trang của hai ngôn ngữ cùng đổi.

### Sau khi sửa CSS hoặc JS

Tăng số phiên bản trong đường dẫn của **tất cả** các trang để trình duyệt người
dùng tải lại tệp mới (nếu không họ sẽ thấy bản cũ trong bộ nhớ đệm):

Phiên bản hiện tại là `v=20260831`. Thay `<phiên bản mới>` bằng ngày sửa
(ví dụ `20260901`) rồi chạy:

```bash
grep -rl "v=20260831" mmt enmmt --include=*.html | xargs sed -i "s/v=20260831/v=<phiên bản mới>/g"
```

## Tìm kiếm

Ô tìm kiếm ở dải tin nhanh hoạt động hoàn toàn phía trình duyệt: lần tìm đầu tiên
nó tải nội dung các trang cùng ngôn ngữ rồi giữ trong bộ nhớ. Không cần máy chủ,
không cần tạo chỉ mục — nội dung mới thêm vào trang là tìm được ngay. Tìm kiếm
không phân biệt dấu tiếng Việt (gõ “an toan thong tin” vẫn ra kết quả).

Khi thêm trang mới, nhớ bổ sung tên tệp vào `CONFIG.<lang>.pages` trong `site.js`.

## Nhận diện thương hiệu Đại học Cần Thơ

Website tuân thủ [Sổ tay thương hiệu Đại học Cần Thơ](https://www.ctu.edu.vn/branding.html).

### Màu sắc

| Vai trò | Mã màu | RGB | CMYK | Biến CSS |
|---|---|---|---|---|
| Màu chính | `#1f5ca9` | 30, 90, 170 | 90, 70, 0, 0 | `--brand-600` |
| Màu phụ | `#00afef` | 0, 175, 240 | 70, 15, 0, 0 | `--accent` |

Các sắc độ `--brand-50` … `--brand-950` đều pha từ màu chính. **Không thêm màu
nhận diện mới.** Hai màu tiện ích `--util-amber` và `--success` chỉ dùng báo
trạng thái giao diện (học phần tự chọn, khối "đang cập nhật"), không phải màu
thương hiệu.

### Kiểu chữ

| Vai trò | Font | Biến CSS |
|---|---|---|
| Font chữ chính — tiêu đề | **K2D** | `--font-head` |
| Font chữ phụ — nội dung | **Readex Pro** | `--font-sans` |

Cả hai tải từ Google Fonts và đều có bộ ký tự tiếng Việt.

### Logo

`imgs/ctu-logo.png` là logo chính thức tải từ trang thương hiệu ĐHCT
(bản gốc 3840px, đã thu về 320px). Quy cách đang áp dụng:

- Logo bên trái, tên đơn vị bên phải — đúng mẫu "Logo các đơn vị thành viên".
- Tên tiếng Việt ở trên, tên tiếng Anh ở dưới (bản tiếng Anh đảo lại để phục vụ
  người đọc — đây là điểm khác có chủ ý so với Sổ tay).
- **Khoảng cách an toàn quanh logo = 1/4 kích thước logo**, cài bằng biến
  `--logo-clear` trong `main.css` nên luôn đúng tỉ lệ ở mọi cỡ màn hình.
- Giữ tỉ lệ 1:1, không thêm viền, không đổi màu, không đặt logo bên phải chữ.

Khẩu hiệu "Cộng đồng · Toàn diện · Ưu việt" (EN: Community · Totality ·
Uniqueness) đặt ở chân trang, sửa tại `site.js` → `CONFIG.<lang>.slogan`.

## Các trang phục vụ kiểm định AUN-QA

Bốn trang dưới đây được dựng theo 8 tiêu chí của **AUN-QA Programme Level v4.0**.
Khung trang đã xong; phần số liệu để trống, đánh dấu “Đang cập nhật”. Trong mỗi
tệp có một khối ghi chú HTML nói rõ cần điền gì và lấy dữ liệu từ đâu.

| Trang | Tiêu chí AUN-QA | Cần điền |
|---|---|---|
| `cdr.html` / `encdr.html` | 1 — Expected Learning Outcomes | ✅ Đã có PEO + PLO của 3 ngành. Còn thiếu ma trận PLO ↔ học phần |
| `dayhoc.html` / `endayhoc.html` | 3 — Teaching and Learning · 4 — Student Assessment | Triết lý giáo dục, trọng số đánh giá, thang điểm, rubric, phúc khảo |
| `ketqua.html` / `enketqua.html` | 8 — Output and Outcomes | ✅ Đã có số liệu NCKH. Còn thiếu tỉ lệ tốt nghiệp, việc làm, khảo sát nhà tuyển dụng |
| `sv.html` / `ensv.html` | 6 — Student Support Services | Cố vấn học tập, học bổng, câu lạc bộ, biểu mẫu |

Cách điền: mở tệp, tìm chữ `Đang cập nhật` (hoặc `Being updated` ở bản tiếng Anh),
thay bằng nội dung thật, rồi **xoá khối `<div class="callout callout--warm">`**
tương ứng. Với các bảng, thêm/bớt dòng `<tr>` theo số liệu thực tế.

### Nguồn số liệu nghiên cứu khoa học

Toàn bộ số liệu trên `nckh.html` (131 công bố, 09 đề tài giảng viên, 06 đề tài
sinh viên, danh mục tạp chí, 5 hướng nghiên cứu) trích từ **Báo cáo kết quả hoạt
động NCKH của Khoa MMT & TT giai đoạn 2022–2026** và bảng danh mục công bố kèm
theo. Số liệu năm 2026 tính đến tháng 8/2026.

Bảng công bố nhúng từ Google Sheets đã được **gỡ bỏ** — bản xuất bản của bảng đó
rỗng, không có dòng dữ liệu nào. Thay bằng bảng HTML tĩnh nên ô tìm kiếm của
website tìm được nội dung, và trang hiển thị được cả khi không vào được Google.

Khi có số liệu năm mới: cập nhật bảng trong mục *Công bố khoa học* của
`nckh.html` và `ennckh.html`, chỉnh chiều cao cột biểu đồ theo tỉ lệ
(cột cao nhất = 170px), rồi cập nhật bảng tương ứng trong `ketqua.html`.

### Nguồn dữ liệu chuẩn đầu ra

PEO và PLO trên `cdr.html` được trích nguyên văn từ ba chương trình đào tạo ban
hành theo **Quyết định số 3268/QĐ-ĐHCT ngày 23/6/2026**. Bản PDF gốc lưu tại
`mmt/docs/` và được liên kết trực tiếp từ trang chuẩn đầu ra lẫn trang từng ngành:

| Ngành | Mã | Tín chỉ | Số PLO | Tệp |
|---|---|---|---|---|
| MMT & Truyền thông dữ liệu | 7480102 | 161 (116 BB / 45 TC) | 10 | `docs/ctdt-mmt-ttdl.pdf` |
| MMT & TTDL — Chất lượng cao | 7480102 | 168 (140 BB / 28 TC) | 10 | `docs/ctdt-mmt-ttdl-clc.pdf` |
| An toàn thông tin | 7480202 | 161 (121 BB / 40 TC) | 15 | `docs/ctdt-attt.pdf` |

Khi Trường ban hành CTĐT mới: thay tệp PDF trong `docs/` (giữ nguyên tên), rồi
cập nhật PEO/PLO và bảng tín chỉ trong `cdr.html`, `encdr.html` và 6 trang ngành.

Tiêu chí còn lại cần bổ sung:

- **Tiêu chí 7** — bổ sung danh mục thiết bị, sức chứa, phần mềm vào
  `ptnmmt.html` và `ptnattt.html`.

## Tối ưu tìm kiếm (SEO)

Mỗi trang đã có sẵn: thẻ `canonical`, `hreflang` liên kết bản Việt ↔ Anh, bộ thẻ
Open Graph (hiển thị đúng khi chia sẻ lên Facebook, Zalo) và dữ liệu có cấu trúc
JSON-LD (`CollegeOrDepartment` ở trang chủ, `Course` ở ba trang chương trình).

Khối này nằm giữa hai dấu `<!-- seo:auto -->` trong phần `<head>`. Nếu sửa
`<title>` hoặc `<meta name="description">` thì nhớ sửa `og:title` / `og:description`
tương ứng.

`mmt/sitemap.xml` liệt kê 30 trang của cả hai ngôn ngữ. Nộp trực tiếp đường dẫn
`https://cit.ctu.edu.vn/mmt/sitemap.xml` trong Google Search Console.

> Không tạo `robots.txt` vì tệp này chỉ có tác dụng khi đặt ở gốc tên miền
> (`cit.ctu.edu.vn/robots.txt`) — thư mục của Khoa không đặt được. Nộp sitemap
> trực tiếp trong Search Console là đủ.

### Bật Google Analytics

Mở `assets/js/site.js`, điền mã đo lường GA4 vào `COMMON.analyticsId`:

```js
analyticsId: 'G-XXXXXXXXXX',
```

Để trống thì website hoàn toàn không tải Analytics.

### Bật liên kết góp ý

Tạo một Google Form dành cho sinh viên, cựu sinh viên và nhà tuyển dụng, rồi dán
đường dẫn vào `COMMON.feedbackForm`. Liên kết sẽ tự hiện ở cột “Liên kết hữu ích”
của chân trang, cả hai ngôn ngữ. Đây là minh chứng cho vòng phản hồi các bên liên
quan mà AUN-QA v4.0 yêu cầu.

## Cập nhật danh mục công trình đã công bố

Bảng công trình ở trang **Nghiên cứu khoa học** (`nckh.html` và `ennckh.html`)
**không nằm trong mã nguồn website**. Đó là một Google Sheet đã được "Xuất bản
lên web" và nhúng vào trang bằng thẻ `<iframe>`.

### Cách thường dùng: chỉ cần sửa bảng tính gốc

1. Mở bảng tính gốc trên Google Drive (tài khoản Google của Khoa đang giữ tệp
   này — người nào tạo bảng lần đầu thì có quyền, có thể chia sẻ quyền
   *Trình chỉnh sửa* cho người khác).
2. Thêm dòng mới / sửa dòng cũ như dùng Excel bình thường, rồi đóng lại
   (Google Sheets tự lưu).
3. Xong. Trang web tự hiển thị nội dung mới sau vài phút — **không cần sửa tệp
   HTML, không cần tải gì lên máy chủ**.

> Google lưu bản xuất bản trong bộ nhớ đệm khoảng **5 phút**. Nếu chưa thấy thay
> đổi, đợi một lát rồi tải lại trang bằng `Ctrl + F5`.

### Nếu muốn dùng một bảng tính khác

1. Tạo/mở bảng tính trên Google Sheets. Nên để **dòng đầu tiên là tiêu đề cột**,
   ví dụ: `STT | Tác giả | Tên công trình | Nơi công bố | Năm | DOI/Liên kết`.
2. Vào **Tệp → Chia sẻ → Xuất bản lên web**
   (*File → Share → Publish to web*).
3. Thẻ **Liên kết**: chọn đúng trang tính cần đăng (hoặc *Toàn bộ tài liệu*),
   định dạng để **Trang web**, tích **Tự động xuất bản lại khi có thay đổi**,
   rồi bấm **Xuất bản**.
4. Sao chép đường dẫn nhận được, dạng:

   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-.../pubhtml?gid=0&single=true
   ```

5. Thêm `&widget=true&headers=false` vào cuối để bỏ thanh công cụ của Google:

   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-.../pubhtml?gid=0&single=true&widget=true&headers=false
   ```

6. Thay đường dẫn đó vào thuộc tính `src` của `<iframe class="embed-sheet">`
   trong **cả hai** tệp `mmt/nckh.html` và `enmmt/ennckh.html`.
   Trong HTML nhớ viết `&amp;` thay cho `&`:

   ```html
   <iframe class="embed-sheet" loading="lazy"
           title="Danh mục công trình nghiên cứu khoa học của Khoa MMT &amp; TT"
           src="https://docs.google.com/spreadsheets/d/e/2PACX-.../pubhtml?gid=0&amp;single=true&amp;widget=true&amp;headers=false"></iframe>
   ```

### Lưu ý

- Bảng tính đã xuất bản là **công khai với bất kỳ ai có đường dẫn** — không đưa
  thông tin nội bộ, số điện thoại cá nhân… vào các cột hiển thị.
- Chiều cao khung bảng đặt ở `main.css`, lớp `.embed-sheet` (mặc định `520px`).
- Muốn đổi số cột hiển thị thì ẩn/hiện cột ngay trong Google Sheets, trang web
  sẽ theo đúng như vậy.
- Bảng nằm trong `<iframe>` nên **ô tìm kiếm của website không tìm được nội dung
  bên trong bảng**. Nếu cần tìm được, phải chuyển danh mục thành bảng HTML tĩnh
  trong trang — báo tôi nếu Khoa muốn làm theo hướng này.

## Thêm một trang mới

1. Chép một tệp `.html` có sẵn (ví dụ `ptn.html`) làm khuôn.
2. Đổi `<title>`, `<meta name="description">`, breadcrumb và nội dung.
3. Đặt `data-page="ma-trang"` trên thẻ `<body>`.
   Trang tiếng Anh cần thêm `data-lang="en" data-base="../mmt/"`.
4. Thêm mục tương ứng vào `menu` trong `site.js` với `id` trùng `ma-trang`
   (để menu tự sáng đúng mục) và thêm tên tệp vào `pages`.

## Các lớp CSS hay dùng

| Lớp | Công dụng |
|---|---|
| `.section`, `.section--soft`, `.section--tight` | Khối nội dung, nền xám nhạt, khối hẹp |
| `.container`, `.container--narrow` | Khung căn giữa |
| `.layout-aside` + `.layout-aside__side` | Bố cục nội dung + cột phụ dính (sticky) |
| `.grid.grid--2/3/4` | Lưới 2/3/4 cột, tự xuống dòng trên di động |
| `.card` | Thẻ có ảnh + nội dung |
| `.person` | Thẻ giảng viên |
| `.stat`, `.stats` | Ô số liệu |
| `.tile`, `.tiles` | Ô thông tin ngắn |
| `.accordion` | Khung chương trình theo năm (đóng/mở) |
| `.rule`, `.section-head > h2` | Tiêu đề chữ hoa, gạch chân + vạch nhấn cam |
| `.callout`, `.callout--warm` | Khối ghi chú |
| `.figure`, `.gallery` | Ảnh có chú thích, thư viện ảnh |
| `.pub-list` | Danh sách đánh số tròn (công bố, giáo trình) |
| `.btn btn--primary/brand/outline/ghost` | Nút bấm |
| `data-reveal` | Thêm hiệu ứng hiện dần khi cuộn |

## Ảnh

- Ảnh đã được nén và giới hạn cạnh dài **1800 px** (ảnh chân dung 480 px).
  Thư mục `mmt/imgs/` giảm từ ~240 MB xuống ~42 MB.
- Khi thêm ảnh mới: xuất ở chiều rộng ≤ 1800 px, JPEG chất lượng ~82.
- Luôn thêm `loading="lazy"` và `alt="..."` cho ảnh trong nội dung.
- `imgs/logo-cict.png` là logo CICT nền trong suốt, dùng cho masthead.

## Kiểm tra tại chỗ

```bash
python -m http.server 8123
```

Mở `http://localhost:8123/mmt/mmt.html` và `http://localhost:8123/enmmt/enmmt.html`.

## Việc còn lại

- `ptnattt.html` / `enptnattt.html`: trang gốc chưa có nội dung mô tả — xem ghi
  chú trong tệp.
- Xác nhận email của TS. Nguyễn Hữu Vân Long (bản cũ ghi lệch giữa `nhvlong@` và
  `nhvlongn@`; hiện đang dùng `nhvlong@cit.ctu.edu.vn`).
- Có thể xoá `mmt/legacy/`, `enmmt/legacy/` và `enmmt/imgs/` khi website mới đã
  chạy ổn định.
- Điền số liệu vào 3 trang AUN-QA còn trống: `ketqua.html`, `dayhoc.html`, `sv.html`.
- Bổ sung ma trận PLO ↔ học phần vào `cdr.html` (phần duy nhất còn thiếu ở tiêu chí 1).
- Thêm ảnh và thông tin cho ThS. Đoàn Minh Quý và KS. Vũ Xuân Lộc
  (đang dùng ảnh tạm `imgs/person-placeholder.png`).
- Chưa làm: trang tin tức, câu chuyện cựu sinh viên, hợp tác doanh nghiệp,
  kho tài liệu tải về, hồ sơ riêng từng giảng viên.
