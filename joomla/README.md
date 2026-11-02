# Phiên bản Joomla của website Khoa MMT&TT

Bản Joomla 5.4 song ngữ Việt–Anh, giữ nguyên giao diện website tĩnh (`mmt/`, `enmmt/`).
Nội dung 34 trang thành bài viết sửa được trong trang quản trị.

## Đưa lên host

**Yêu cầu:** PHP 8.1 trở lên (khuyên dùng 8.3), MySQL 8 hoặc MariaDB 10.4 trở lên, khoảng 150 MB dung lượng.
Máy chủ Apache có mod_rewrite thì dùng được URL gọn (`/nhan-su`), nếu không thì URL có dạng `/index.php/nhan-su`.

1. Trong cPanel (hoặc trình quản lý host), tạo một **CSDL MySQL trống** và một **tài khoản CSDL** có toàn quyền trên CSDL đó.
2. Tải tệp `mmt-joomla-YYYYMMDD.zip` lên thư mục web (`public_html/` hoặc thư mục con) rồi **giải nén** tại chỗ.
3. Mở tên miền bằng trình duyệt: website tự chuyển tới trang **Cài đặt** (`installation/`).
4. Nhập thông tin CSDL, tên đăng nhập, email và mật khẩu quản trị (ít nhất 12 ký tự), rồi bấm **Cài đặt**.
   - Chọn "URL gọn" nếu host dùng Apache. Tuỳ chọn này cũng bật chuyển hướng 301 từ địa chỉ cũ
     `/mmt/*.html`, `/enmmt/*.html` sang trang mới, nên các liên kết cũ vẫn dùng được nếu website đặt tại gốc tên miền.
   - Chọn "Bắt buộc HTTPS" khi tên miền đã có chứng chỉ SSL.
5. Trình cài tự xoá thư mục `installation/`. Nếu nó báo không xoá được, hãy xoá thủ công.
6. Đăng nhập trang quản trị tại `/administrator/`.

## Sửa nội dung ở đâu

| Muốn sửa | Vào |
|---|---|
| Nội dung một trang | Content › Articles (mỗi trang có bản Việt và bản Anh, liên kết qua tab *Associations*) |
| Menu chính, menu con | Menus › Menu tiếng Việt / English menu |
| Liên kết đầu trang, dải "Nổi bật" | Menus › Đầu trang VI/EN, Nổi bật VI/EN |
| Chân trang (liên hệ, ban lãnh đạo, liên kết hữu ích) | Content › Site Modules, vị trí `footer` |
| Số điện thoại đầu trang, Google Analytics, ẩn mục "Đang cập nhật" | System › Site Template Styles › mmt - Mặc định › Advanced |
| Tên khoa trên đầu trang, chữ nút tìm kiếm | System › Language Overrides (khoá `TPL_MMT_…`) |
| **Số liệu báo cáo, biểu đồ, tin tức sinh viên** | Các tệp Google Sheets trong thư mục Drive *Website Khoa MMT&TT – Số liệu* (xem `mmt/README.md`, mục Google Sheets). Ô cấu hình: Template Styles › mmt › Advanced |
| **Nhân sự, cố vấn học tập, các bảng khác** | Content › Media › `images/mmt/data/` — tải lên đè tệp CSV cùng tên |
| Ảnh, PDF (CTĐT, sổ tay sinh viên) | Content › Media › `images/mmt/imgs/`, `images/mmt/docs/` |

Các bảng và thẻ nhân sự đọc từ tệp CSV giống website tĩnh, nên chỉ cần sửa CSV
(cách ghi xem `mmt/README.md`) rồi tải lên lại. Không phải sửa bài viết.

Trình soạn thảo mặc định là **CodeMirror** (sửa mã HTML) để không làm vỡ bố cục của các trang.
Muốn soạn kiểu Word cho bài mới thì chọn TinyMCE trong *User Menu › Edit Account › Basic Settings*.

## Dựng lại gói từ mã nguồn

Sau khi sửa website tĩnh (`mmt/`, `enmmt/`), chạy lệnh sau trên máy Linux có PHP 8.1+, MariaDB, python3 và zip:

```bash
sudo bash joomla/build/build.sh      # -> joomla/dist/mmt-joomla-YYYYMMDD.zip
```

Script làm các bước: tải Joomla, cài vào CSDL tạm, cài template và gói tiếng Việt, nạp nội dung
qua Web Services API, đóng gói kèm trình cài đặt.

| Thư mục | Nội dung |
|---|---|
| `src/tpl_mmt/` | Template `mmt`: `main.css`, `site.js`, các layout menu, chân trang, trang lỗi |
| `src/lang_vi-VN/` | Gói ngôn ngữ tiếng Việt tối giản (chuỗi chưa dịch dùng tiếng Anh) |
| `build/import_content.py` | Chuyển trang tĩnh thành bài viết, menu, module, chuyển hướng URL cũ |
| `build/build.sh`, `build/router.php` | Dựng gói; `router.php` chỉ dùng cho máy chủ thử `php -S` |
| `installer/index.php` | Trình cài đặt trên host (thành `installation/index.php` trong gói) |

## Ghi chú

- Joomla 5.4 nhận bản vá bảo mật đến 12/10/2027. Khi host có PHP 8.3, có thể nâng lên Joomla 6 bằng
  System › Joomla Update.
- Gói tiếng Việt là bản tối giản. Gói vi-VN đầy đủ cài được qua System › Install › Languages (cần host có kết nối Internet).
- Thay đổi trên Joomla không tự cập nhật ngược về website tĩnh. Nên chọn một bản làm bản chính.
