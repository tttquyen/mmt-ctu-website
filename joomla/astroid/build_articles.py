#!/usr/bin/env python3
"""
Sinh nội dung để đưa website Khoa lên Joomla có sẵn (template Astroid, host cnc.ctu.edu.vn)
khi tài khoản chỉ có quyền Administrator (không cài được template, không dùng được API).

    python joomla/astroid/build_articles.py

Kết quả trong joomla/astroid/:
  bai-viet/<bí danh>.html   nội dung từng bài viết (dán vào Content › Articles, trình soạn thảo mã)
  danh-sach-trang.csv       tiêu đề, bí danh (alias) của bài viết và mục menu cần tạo
  custom-code-head.html     dán vào Astroid › Custom Code › Before </head>
  custom-code-body.html     dán vào Astroid › Custom Code › Before </body>

Giao diện (main.css, site.js), ảnh, CSV, PDF vẫn lấy từ bản tĩnh trên GitHub Pages (BASE);
site.js chạy ở "chế độ nhúng" (xem window.MMT_EMBED trong site.js).
"""
import csv
import html
import json
import os
import re
import sys

BASE = 'https://tttquyen.github.io/mmt-ctu-website/mmt/'   # bản tĩnh: assets/, imgs/, data/, docs/
PREFIX = '/index.php/'                                     # Joomla: SEF bật, không bật URL rewrite
HOME = '/'                                                 # mục menu của mmt.html đặt làm Trang chủ

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = os.path.join(HERE, 'bai-viet')


def version():
    s = open(os.path.join(REPO, 'mmt', 'mmt.html'), encoding='utf-8').read()
    m = re.search(r'site\.js\?v=(\d+)', s)
    return m.group(1) if m else '1'


def iframe_placeholder(m):
    """<iframe ...></iframe> -> <div data-mmt-iframe='{...}'></div> (bộ lọc Joomla có thể xoá iframe)."""
    raw = m.group(1)
    attrs = dict((k, html.unescape(v)) for k, v in re.findall(r'([a-zA-Z-]+)="([^"]*)"', raw))
    for k in re.findall(r'(?:^|\s)([a-zA-Z-]+)(?=\s|$)', re.sub(r'[a-zA-Z-]+="[^"]*"', ' ', raw)):
        attrs[k] = ''                                                       # thuộc tính không giá trị (allowfullscreen)
    return "<div class=\"media-frame\" data-mmt-iframe='%s'></div>" % html.escape(json.dumps(attrs, ensure_ascii=False), quote=False).replace("'", '&#39;')


def page(path):
    s = open(path, encoding='utf-8').read()
    body_attrs = re.search(r'<body([^>]*)>', s).group(1)
    pid = re.search(r'data-page="([^"]*)"', body_attrs).group(1)
    lang = 'en' if 'data-lang="en"' in body_attrs else 'vi'
    title = html.unescape(re.search(r'<title>(.*?)</title>', s, re.S).group(1)).split(' — ')[0].strip()
    main = re.search(r'<main[^>]*>(.*)</main>', s, re.S).group(1)
    main = re.sub(r'<!--.*?-->', '', main, flags=re.S)                       # ghi chú biên tập
    main = re.sub(r'<iframe([^>]*)>\s*</iframe>', iframe_placeholder, main)
    main = re.sub(r'\n\s*\n+', '\n', main).strip()
    content = '<div id="mmt-content" data-page="%s" data-lang="%s">\n%s\n</div>\n' % (pid, lang, main)
    return pid, lang, title, content


def main():
    os.makedirs(OUT, exist_ok=True)
    rows = []
    for folder in ('mmt', 'enmmt'):
        for name in sorted(os.listdir(os.path.join(REPO, folder))):
            if not name.endswith('.html') or name == 'index.html':
                continue
            alias = name[:-5]
            pid, lang, title, content = page(os.path.join(REPO, folder, name))
            open(os.path.join(OUT, alias + '.html'), 'w', encoding='utf-8', newline='\n').write(content)
            home = alias == 'mmt'
            rows.append([len(rows) + 1, title, alias, 'bai-viet/%s.html' % alias,
                         'Tiếng Việt' if lang == 'vi' else 'English',
                         HOME if home else PREFIX + alias,
                         'Đặt làm Trang chủ (Home)' if home else ''])
    with open(os.path.join(HERE, 'danh-sach-trang.csv'), 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f)
        w.writerow(['STT', 'Tiêu đề bài viết / mục menu', 'Bí danh (Alias)', 'Tệp nội dung', 'Ngôn ngữ', 'Địa chỉ sau khi tạo', 'Ghi chú'])
        w.writerows(rows)

    v = version()
    head = '''<!-- Khoa MMT&TT — dán vào Astroid › Custom Code › Before </head>
     Giao diện lấy từ bản tĩnh trên GitHub Pages. Khi cập nhật giao diện, đổi số ?v= cho trình duyệt tải lại. -->
<script>document.documentElement.className += ' js mmt-embed';</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=K2D:wght@400;500;600;700;800&amp;family=Readex+Pro:wght@300;400;500;600;700&amp;display=swap">
<link rel="stylesheet" href="%sassets/css/main.css?v=%s">
''' % (BASE, v)
    body = '''<!-- Khoa MMT&TT — dán vào Astroid › Custom Code › Before </body> -->
<script>
window.MMT_EMBED = {
  base: '%s',
  prefix: '%s',
  home: '%s'
};
</script>
<script src="%sassets/js/site.js?v=%s" defer></script>
''' % (BASE, PREFIX, HOME, BASE, v)
    open(os.path.join(HERE, 'custom-code-head.html'), 'w', encoding='utf-8', newline='\n').write(head)
    open(os.path.join(HERE, 'custom-code-body.html'), 'w', encoding='utf-8', newline='\n').write(body)
    print('%d bài viết -> %s' % (len(rows), OUT))


if __name__ == '__main__':
    sys.exit(main())
