# Website Khoa Mạng máy tính và Truyền thông — Đại học Cần Thơ

Website tĩnh song ngữ của Khoa MMT & TT, Trường Công nghệ Thông tin và Truyền
thông, Đại học Cần Thơ. Thuần HTML/CSS/JS — không cần PHP, cơ sở dữ liệu hay
công cụ build.

| | |
|---|---|
| Bản tiếng Việt | [`mmt/mmt.html`](mmt/mmt.html) |
| Bản tiếng Anh | [`enmmt/enmmt.html`](enmmt/enmmt.html) |
| Tài liệu vận hành | [`mmt/README.md`](mmt/README.md) |
| Chạy chính thức tại | `https://cit.ctu.edu.vn/mmt/` và `/enmmt/` |

## Cấu trúc kho

```
.
├─ index.html      Trang chọn ngôn ngữ — CHỈ dùng cho bản thử trên GitHub Pages
├─ .nojekyll       Tắt Jekyll của GitHub Pages
├─ mmt/            Bản tiếng Việt + toàn bộ tài nguyên dùng chung
│  ├─ assets/      main.css và site.js — dùng chung cho CẢ HAI ngôn ngữ
│  ├─ imgs/        Ảnh dùng chung cho cả hai ngôn ngữ
│  ├─ docs/        CTĐT chính thức (PDF) và bảng thống kê NCKH (Excel)
│  └─ legacy/      Bản website cũ, giữ để đối chiếu
└─ enmmt/          Bản tiếng Anh (dùng chung assets và ảnh của mmt/)
```

> **Quan trọng:** `mmt/` và `enmmt/` phải luôn nằm cạnh nhau. Bản tiếng Anh trỏ
> tới `../mmt/assets/` và `../mmt/imgs/` bằng đường dẫn tương đối.

## Chạy thử trên máy

```powershell
cd C:\Users\tttquyen\Documents\project\site_cnc
python -m http.server 8123
```

Mở `http://localhost:8123/` — hoặc vào thẳng `http://localhost:8123/mmt/mmt.html`.

## Triển khai lên máy chủ chính thức

Chép **nội dung bên trong** `mmt/` lên thư mục `mmt` của máy chủ, và `enmmt/` lên
thư mục `enmmt`. Không cần chép `index.html`, `.nojekyll`, `.gitignore` và
`README.md` ở thư mục gốc — đó là tệp phục vụ kho mã và bản thử nghiệm.

Có thể bỏ qua `mmt/legacy/` và `enmmt/legacy/` (bản website cũ).

## Sau khi sửa CSS hoặc JavaScript

Tăng số phiên bản trong đường dẫn tài nguyên của **tất cả** các trang, nếu không
người dùng cũ sẽ thấy bản cũ trong bộ nhớ đệm trình duyệt. Xem hướng dẫn chi tiết
trong [`mmt/README.md`](mmt/README.md).

## Ghi chú về SEO khi chạy thử

Mọi trang đều khai báo `canonical` trỏ về `cit.ctu.edu.vn`, nên bản thử trên
GitHub Pages không bị Google lập chỉ mục trùng với bản chính thức. Trang
`index.html` ở gốc còn đặt thêm `noindex`.
