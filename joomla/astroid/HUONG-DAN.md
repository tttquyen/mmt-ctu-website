# Đưa website Khoa lên host cnc.ctu.edu.vn (Joomla 6 + template Astroid có sẵn)

Dùng khi tài khoản chỉ có quyền **Administrator**: không cài được template, không dùng được API.
Template Astroid (*tz_amanus*) vẫn chạy bên dưới, nhưng khung của nó được ẩn; giao diện, menu,
chân trang của Khoa do `site.js` dựng lại. Giao diện, ảnh, CSV, PDF lấy từ bản tĩnh trên
GitHub Pages, nên **sửa trên GitHub là website Joomla cũng đổi theo**.

Các tệp trong thư mục này:

| Tệp | Dùng để |
|---|---|
| `custom-code-head.html` | Dán vào Astroid › Custom Code › **Before `</head>`** |
| `custom-code-body.html` | Dán vào Astroid › Custom Code › **Before `</body>`** |
| `bai-viet/<bí danh>.html` | Nội dung từng bài viết (32 trang: 16 tiếng Việt, 16 tiếng Anh) |
| `danh-sach-trang.csv` | Tiêu đề, bí danh của bài viết và mục menu cần tạo |
| `build_articles.py` | Sinh lại các tệp trên sau khi sửa bản tĩnh: `python joomla/astroid/build_articles.py` |

## Bước 1 — Chọn trình soạn thảo mã

*User Menu › Edit Account › Basic Settings › Editor* → **Editor - CodeMirror** (hoặc *Editor - None*).
TinyMCE sẽ sửa lại mã HTML và làm vỡ bố cục.

## Bước 2 — Tạo bài viết

1. *Content › Categories › New*: tạo danh mục **Trang Khoa**.
2. Với mỗi dòng trong `danh-sach-trang.csv`: *Content › Articles › New*
   - **Title**: cột *Tiêu đề*; **Alias**: cột *Bí danh* (viết đúng, không dấu); **Category**: Trang Khoa.
   - Nội dung: mở tệp `bai-viet/<bí danh>.html` bằng Notepad, chọn tất cả, dán vào ô soạn thảo.
   - *Save & Close*.
3. Mở lại một bài vừa lưu, kiểm tra mã còn nguyên (`<section class=...>`, `data-...`).
   Nếu bị cắt mất thẻ: bộ lọc nội dung của nhóm Administrator đang bật — nhờ Trung tâm đặt
   *Global Configuration › Text Filters* của nhóm này là **No Filtering**.

## Bước 3 — Tạo menu ẩn (để mỗi trang có địa chỉ)

1. *Menus › Manage › New*: Title **Trang Khoa**, Menu Type `trang-khoa`. **Không** tạo module cho menu này.
2. Với mỗi bài viết: *Menus › Trang Khoa › New* → Menu Item Type *Articles › Single Article*,
   chọn bài viết, **Alias** giống bí danh của bài. Địa chỉ trang sẽ là `/index.php/<bí danh>`.
3. Chưa đặt Trang chủ ở bước này.

Menu hiển thị trên website do `site.js` dựng (sửa trong `mmt/assets/js/site.js`, mục CONFIG),
nên menu Joomla chỉ cần có mục cho từng bài, thứ tự không quan trọng.

## Bước 4 — Gắn giao diện cho style thử nghiệm

1. *System › Site Template Styles* → **tz_amanus - Default (2)** (ID 16) → **Template Options**
   → *Custom Code*: dán `custom-code-head.html` vào *Before `</head>`*, `custom-code-body.html`
   vào *Before `</body>`* → **Save**.
2. Trở lại trang sửa style (ID 16) → tab **Menu Assignment** → chọn tất cả mục của menu
   **Trang Khoa** → Save. Không bấm Default.
3. Mở `https://cnc.ctu.edu.vn/index.php/ctdt`, `.../index.php/gv`, `.../index.php/enmmt` để xem.
   Trang chủ hiện tại của host chưa bị ảnh hưởng.

## Bước 5 — Đưa vào sử dụng

1. *Menus › Trang Khoa* → mục **mmt** → bấm ngôi sao (*Home*) để thành Trang chủ.
2. *System › Site Template Styles* → chọn **tz_amanus - Default (2)** → **Default**.
3. Gỡ (Unpublish) các bài, menu mẫu du thuyền (*blog-default*, *contact-us*...) nếu không dùng.

## Cập nhật về sau

| Muốn sửa | Làm ở đâu |
|---|---|
| Số liệu, biểu đồ, tin tức, nhân sự, cố vấn học tập | Google Sheets / tệp CSV trong `mmt/data/` (như bản tĩnh) — Joomla tự cập nhật |
| Menu, chân trang, màu sắc | `site.js`, `main.css` trên GitHub; đổi số `?v=` trong Custom Code để trình duyệt tải bản mới |
| Chữ trong một trang | Sửa bài viết trong Joomla; hoặc sửa bản tĩnh, chạy `build_articles.py`, dán lại bài viết |

Khi Trung tâm nâng tài khoản lên Super User, có thể chuyển sang template riêng `tpl_mmt`
(thư mục `joomla/src/`) — bài viết đã tạo vẫn dùng lại được.
