#!/usr/bin/env python3
"""
Nạp nội dung website tĩnh (mmt/, enmmt/) vào một site Joomla 5 vừa cài.

Chạy bởi build.sh. Cần:
  - Joomla đã cài, template mmt + gói vi-VN đã cài (build.sh làm việc này)
  - Máy chủ PHP đang phục vụ site tại --url (php -S)
  - Plugin "API Authentication - Basic Auth" đang bật (build.sh bật/tắt)

Script dùng Joomla Web Services API để tạo bài viết, menu, module (Joomla tự
ghi đúng các bảng asset/workflow/association), còn các tham số cấu hình
thì ghi thẳng vào CSDL qua lệnh mysql.
"""
import argparse
import base64
import html
import json
import os
import re
import shutil
import subprocess
import sys
import urllib.error
import urllib.request

ap = argparse.ArgumentParser()
ap.add_argument('--repo', required=True, help='thư mục gốc repo website tĩnh')
ap.add_argument('--site', required=True, help='thư mục site Joomla')
ap.add_argument('--url', required=True, help='URL site Joomla đang chạy, vd. http://127.0.0.1:8090')
ap.add_argument('--user', default='admin')
ap.add_argument('--password', required=True)
ap.add_argument('--db', required=True)
ap.add_argument('--prefix', default='mmt_')
args = ap.parse_args()

REPO, SITE, P = args.repo, args.site, args.prefix
API = args.url.rstrip('/') + '/api/index.php/v1'
AUTH = 'Basic ' + base64.b64encode(f'{args.user}:{args.password}'.encode()).decode()


# --------------------------------------------------------------------------
# Tiện ích
# --------------------------------------------------------------------------
def api(method, path, data=None):
    req = urllib.request.Request(API + path, method=method,
                                 data=json.dumps(data).encode() if data is not None else None,
                                 headers={'Authorization': AUTH, 'Accept': 'application/vnd.api+json',
                                          'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read().decode()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        sys.exit(f'API {method} {path} -> {e.code}: {e.read().decode()[:2000]}\nDATA: {json.dumps(data, ensure_ascii=False)[:800]}')


def new_id(resp):
    return int(resp['data']['id'])


def sql(query):
    out = subprocess.run(['mysql', '-uroot', '--default-character-set=utf8mb4', '-N', '-B', args.db, '-e', query],
                         check=True, capture_output=True, text=True)
    return out.stdout.strip()


def q(s):
    return "'" + s.replace('\\', '\\\\').replace("'", "\\'") + "'"


def set_params(table_where, params):
    """Gộp params JSON vào một dòng (extensions / template_styles / modules)."""
    table, where = table_where
    cur = sql(f'SELECT params FROM {P}{table} WHERE {where}') or '{}'
    data = json.loads(cur or '{}')
    if isinstance(data, list):
        data = {}
    data.update(params)
    sql(f'UPDATE {P}{table} SET params={q(json.dumps(data, ensure_ascii=False))} WHERE {where}')


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


# --------------------------------------------------------------------------
# 1. Cấu trúc trang & menu (khớp với menu trong mmt/assets/js/site.js)
# --------------------------------------------------------------------------
# key, tệp VI, alias VI, tiêu đề menu VI, tệp EN, alias EN, tiêu đề menu EN, cha
PAGES = [
    ('home',       'mmt.html',        'gioi-thieu',            'Giới thiệu',
                   'enmmt.html',      'introduction',          'Introduction', None),
    ('gt',         'gt.html',         'su-menh-tam-nhin',      'Sứ mạng, tầm nhìn & cơ cấu tổ chức',
                   'engt.html',       'mission-vision',        'Mission, vision & organisation', 'home'),
    ('dbcl',       'dbcl.html',       'dam-bao-chat-luong',    'Đảm bảo chất lượng',
                   'endbcl.html',     'quality-assurance',     'Quality assurance', 'home'),
    ('ctdt',       'ctdt.html',       'dao-tao',               'Đào tạo',
                   'enctdt.html',     'academics',             'Academics', None),
    ('ctdtmmt',    'ctdtmmt.html',    'ky-su-mang-may-tinh',   'KS Mạng máy tính & TTDL',
                   'enctdtmmt.html',  'computer-networks',     'Engineer in CN & Data Communication', 'ctdt'),
    ('ctdtmmtclc', 'ctdtmmtclc.html', 'chat-luong-cao',        'KS MMT & TTDL — Chất lượng cao',
                   'enctdtmmtclc.html', 'high-quality',        'Engineer in CN & DC — High-quality', 'ctdt'),
    ('ctdtattt',   'ctdtattt.html',   'an-toan-thong-tin',     'KS An toàn thông tin',
                   'enctdtattt.html', 'information-security',  'Engineer in Information Security', 'ctdt'),
    ('cdr',        'cdr.html',        'chuan-dau-ra',          'Mục tiêu & Chuẩn đầu ra',
                   'encdr.html',      'learning-outcomes',     'Objectives & Learning Outcomes', 'ctdt'),
    ('dayhoc',     'dayhoc.html',     'day-hoc-danh-gia',      'Dạy, học và đánh giá',
                   'endayhoc.html',   'teaching-assessment',   'Teaching, learning and assessment', 'ctdt'),
    ('ketqua',     'ketqua.html',     'ket-qua-dao-tao',       'Kết quả đào tạo',
                   'enketqua.html',   'programme-outcomes',    'Programme outcomes', 'ctdt'),
    ('nckh',       'nckh.html',       'nghien-cuu',            'Nghiên cứu',
                   'ennckh.html',     'research',              'Research', None),
    ('ptn',        'ptn.html',        'phong-thi-nghiem',      'Phòng thí nghiệm',
                   'enptn.html',      'laboratories',          'Laboratories', 'nckh'),
    ('ptnmmt',     'ptnmmt.html',     'ptn-mang-may-tinh',     'PTN MMT, TTDĐ & Dữ liệu lớn',
                   'enptnmmt.html',   'networks-big-data-lab', 'Networks, Mobile Comm. & Big Data Lab', 'nckh'),
    ('ptnattt',    'ptnattt.html',    'ptn-an-toan-thong-tin', 'PTN An toàn thông tin',
                   'enptnattt.html',  'information-security-lab', 'Information Security Lab', 'nckh'),
    ('sv',         'sv.html',         'sinh-vien',             'Sinh viên',
                   'ensv.html',       'students',              'Students', None),
    ('gv',         'gv.html',         'nhan-su',               'Nhân sự',
                   'engv.html',       'people',                'People', None),
    ('ts',         'ts.html',         'tuyen-sinh',            'Tuyển sinh',
                   'ents.html',       'admissions',            'Admissions', None),
    ('tintuc',     'tintuc.html',     'tin-tuc',               'Tin tức',
                   'entintuc.html',   'news',                  'News', None),
]
# Mục "tổng quan" đầu mỗi menu con (trỏ về chính mục cha)
OVERVIEW = {
    'home': ('Tổng quan về Khoa', 'About the Faculty'),
    'ctdt': ('Tổng quan chương trình đào tạo', 'Programmes overview'),
    'nckh': ('Hoạt động nghiên cứu khoa học', 'Research activities'),
}

LANGS = {
    'vi': {'tag': 'vi-VN', 'dir': 'mmt', 'menu': 'mainmenu-vi', 'menu_title': 'Menu tiếng Việt'},
    'en': {'tag': 'en-GB', 'dir': 'enmmt', 'menu': 'mainmenu-en', 'menu_title': 'English menu'},
}
FILE_TO_KEY = {}
for p in PAGES:
    FILE_TO_KEY[p[1]] = p[0]
    FILE_TO_KEY[p[4]] = p[0]


# --------------------------------------------------------------------------
# 2. Tách nội dung từ trang tĩnh
# --------------------------------------------------------------------------
def parse_page(path):
    src = read(path)
    m = re.search(r'<main id="main">(.*)</main>', src, re.S)
    if not m:
        sys.exit(f'Không thấy <main> trong {path}')
    body = m.group(1).strip('\n')
    title = html.unescape(re.search(r'<title>(.*?)</title>', src, re.S).group(1).strip())
    desc = re.search(r'<meta name="description" content="([^"]*)"', src)
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)
    return {
        'body': body,
        'title': title,
        'short': title.split(' — ')[0].strip(),
        'desc': html.unescape(desc.group(1)) if desc else '',
        'h1': re.sub(r'<[^>]+>', '', h1.group(1)).strip() if h1 else '',
    }


def rewrite(body, item_ids):
    """Đổi đường dẫn tương đối của trang tĩnh sang đường dẫn Joomla."""
    # Tài nguyên dùng chung -> images/mmt/...
    body = re.sub(r'(src|href)="(?:\.\./mmt/)?(imgs|docs|cv|data)/', r'\1="images/mmt/\2/', body)

    # Liên kết giữa các trang -> index.php?Itemid=N (plugin SEF của Joomla tự đổi sang URL đẹp)
    def link(m):
        fname, frag = m.group(1), m.group(2) or ''
        key = FILE_TO_KEY.get(fname)
        if not key:
            print('  ! liên kết không rõ:', fname)
            return m.group(0)
        return f'href="index.php?Itemid={item_ids[key]}{frag}"'
    body = re.sub(r'href="(?:\.\./(?:mmt|enmmt)/)?([a-z]+\.html)(#[^"]*)?"', link, body)
    return body


# --------------------------------------------------------------------------
# 3. Cấu hình chung (ghi thẳng CSDL)
# --------------------------------------------------------------------------
def configure():
    print('* Cấu hình ngôn ngữ, template, plugin')
    # Ngôn ngữ nội dung
    sql(f"UPDATE {P}languages SET published=1, ordering=1, image='vi', sef='vi', "
        f"title='Tiếng Việt', title_native='Tiếng Việt', sitename='' WHERE lang_code='vi-VN'")
    sql(f"UPDATE {P}languages SET published=1, ordering=2, image='en_gb', sef='en', "
        f"title='English', title_native='English' WHERE lang_code='en-GB'")
    # Ngôn ngữ mặc định của site
    set_params(('extensions', "element='com_languages'"), {'site': 'vi-VN', 'administrator': 'en-GB'})
    # Bộ lọc ngôn ngữ (bắt buộc cho site đa ngôn ngữ)
    sql(f"UPDATE {P}extensions SET enabled=1 WHERE folder='system' AND element='languagefilter'")
    set_params(('extensions', "folder='system' AND element='languagefilter'"), {
        'detect_browser': '0', 'automatic_change': '1', 'item_associations': '1',
        'alternate_meta': '1', 'xdefault': '1', 'xdefault_language': 'vi-VN',
        'remove_default_prefix': '1', 'lang_cookie': '0'})
    # Chuyển hướng URL cũ (.html) sang trang mới
    sql(f"UPDATE {P}extensions SET enabled=1 WHERE folder='system' AND element='redirect'")
    set_params(('extensions', "folder='system' AND element='redirect'"), {'collect_urls': '0'})

    # Template mặc định
    sql(f"UPDATE {P}template_styles SET home='0' WHERE client_id=0")
    sql(f"UPDATE {P}template_styles SET home='1', title='mmt - Mặc định' WHERE client_id=0 AND template='mmt'")
    set_params(('template_styles', "client_id=0 AND template='mmt'"),
               {'phone': '0292 3734 720', 'hidePending': 1, 'analyticsId': '', 'dataFolder': 'images/mmt/',
                'sheetFiles': 'tot-nghiep=1TPdntYX8MyyEUP47KTQhi4huajsiyNQporDXHsHCdDY\nviec-lam=10lfKR2efG_rizTqLI7VMcGrzMqY42v6y_WAGYPdv4Ig\nviec-lam-chi-tiet=1ADnCowk7zeB2R4q9tOf5AkWAmw0eRA7PyUEw6UNvBW8\ndat-cdr=1NKKKdh4Rwq3FygMmTqlwTbCyWxb4qg0nRDQks99OqaQ\nhai-long=1bsdD_3WKtUzsW5elkQARcWv9qp48uRAjfOBPTNismGI\nnhan-su-thong-ke=1aCWBf0T_ZvwjbQDEqqLPPNQ6CGePXaCc05OO-SK2BPA\ncong-bo=1zLGDwNSWtUQ_OYC-kFXfvlmP1ZInQYBc0TOixufCHdE\ntuyen-sinh=1ngIspvsTq64SFJeubZoW-YxX4-NqvHAzHcRhnQegnyg\ntin-tuc=12u360TwBJa119BBA9FHRGqO2TVImOvLte3-MZVpSdAw', 'sheetPub': ''})

    # Bài viết: ẩn mọi thông tin phụ (tác giả, ngày, lượt xem...) — nội dung tự có tiêu đề trang
    set_params(('extensions', "element='com_content' AND type='component'"), {
        'show_title': '0', 'link_titles': '0', 'show_intro': '1', 'info_block_position': '0',
        'show_category': '0', 'link_category': '0', 'show_parent_category': '0',
        'show_author': '0', 'show_create_date': '0', 'show_modify_date': '0',
        'show_publish_date': '0', 'show_item_navigation': '0', 'show_vote': '0',
        'show_tags': '0', 'show_hits': '0', 'show_noauth': '0', 'show_icons': '0',
        'show_print_icon': '0', 'show_email_icon': '0', 'show_associations': '0',
        'save_history': '1', 'history_limit': 20})

    # Trình soạn thảo mặc định: CodeMirror (giữ nguyên mã HTML của trang).
    # TinyMCE vẫn dùng được, chọn trong hồ sơ người dùng.
    sql(f"UPDATE {P}extensions SET enabled=1 WHERE folder='editors' AND element='codemirror'")

    # Gỡ module mẫu của Cassiopeia khỏi giao diện
    sql(f"UPDATE {P}modules SET published=0 WHERE client_id=0")


# --------------------------------------------------------------------------
# 4. Tài nguyên dùng chung
# --------------------------------------------------------------------------
def copy_assets():
    print('* Chép ảnh, CSV, PDF vào images/mmt/')
    dst = os.path.join(SITE, 'images', 'mmt')
    for d in ('imgs', 'data', 'docs', 'cv'):
        s = os.path.join(REPO, 'mmt', d)
        if os.path.isdir(s):
            shutil.copytree(s, os.path.join(dst, d), dirs_exist_ok=True)
    # index.html trống để không liệt kê thư mục
    for root, _dirs, _files in os.walk(dst):
        open(os.path.join(root, 'index.html'), 'a').close()


# --------------------------------------------------------------------------
# 5. Bài viết, menu, module
# --------------------------------------------------------------------------
def main():
    configure()
    copy_assets()

    content = {lg: {} for lg in LANGS}
    for p in PAGES:
        content['vi'][p[0]] = parse_page(os.path.join(REPO, 'mmt', p[1]))
        content['en'][p[0]] = parse_page(os.path.join(REPO, 'enmmt', p[4]))

    # Bài viết (nội dung tạm, liên kết được ghi lại sau khi có menu)
    print('* Tạo 34 bài viết')
    art = {lg: {} for lg in LANGS}
    for lg, L in LANGS.items():
        for p in PAGES:
            key = p[0]
            c = content[lg][key]
            alias = p[2] if lg == 'vi' else p[5]
            data = {
                'title': c['short'] if key != 'home' else ('Trang chủ' if lg == 'vi' else 'Home'),
                'alias': alias, 'catid': 2, 'language': L['tag'], 'state': 1,
                'articletext': c['body'], 'metadesc': c['desc'], 'access': 1,
            }
            if lg == 'en':
                data['associations'] = {'vi-VN': str(art['vi'][key])}
            art[lg][key] = new_id(api('POST', '/content/articles', data))

    com_content = int(sql(f"SELECT extension_id FROM {P}extensions WHERE element='com_content' AND type='component'"))

    print('* Tạo menu chính VI/EN')
    item = {lg: {} for lg in LANGS}
    for lg, L in LANGS.items():
        api('POST', '/menus/site', {'menutype': L['menu'], 'title': L['menu_title'],
                                    'description': 'Menu chính ' + L['tag']})
        for p in PAGES:
            key, parent = p[0], p[7]
            c = content[lg][key]
            data = {
                'title': p[3] if lg == 'vi' else p[6],
                'alias': p[2] if lg == 'vi' else p[5],
                'menutype': L['menu'], 'type': 'component', 'component_id': com_content,
                'link': f'index.php?option=com_content&view=article&id={art[lg][key]}',
                'request': {'id': str(art[lg][key])},
                'parent_id': item[lg][parent] if parent else 1,
                'language': L['tag'], 'published': 1, 'access': 1, 'browserNav': 0,
                'home': 1 if key == 'home' else 0,
                'params': {'page_title': c['title'], 'show_page_heading': '0',
                           'menu-meta_description': c['desc'], 'menu_show': 1},
            }
            if lg == 'en':
                data['associations'] = {'vi-VN': str(item['vi'][key])}
            item[lg][key] = new_id(api('POST', '/menus/site/items', data))
            # Mục "Tổng quan" đứng đầu menu con
            if key in OVERVIEW:
                api('POST', '/menus/site/items', {
                    'title': OVERVIEW[key][0 if lg == 'vi' else 1],
                    'alias': ('tong-quan-' if lg == 'vi' else 'overview-') + p[2 if lg == 'vi' else 5],
                    'menutype': L['menu'], 'type': 'alias', 'link': 'index.php?Itemid=',
                    'parent_id': item[lg][key], 'language': L['tag'], 'published': 1, 'access': 1,
                    'params': {'aliasoptions': str(item[lg][key]), 'alias_redirect': 0, 'menu_show': 1},
                })

    print('* Ghi nội dung bài viết (đổi liên kết sang Joomla)')
    for lg in LANGS:
        for p in PAGES:
            # (API PATCH không ghi lại articletext nên cập nhật trực tiếp)
            sql(f"UPDATE {P}content SET introtext={q(rewrite(content[lg][p[0]]['body'], item[lg]))} "
                f"WHERE id={art[lg][p[0]]}")

    print('* Menu đầu trang, Nổi bật')
    TOP = {
        'vi': [('Đại học Cần Thơ', 'https://www.ctu.edu.vn/'), ('Trường CNTT & TT', 'https://cit.ctu.edu.vn/'),
               ('Elearning', 'https://elearning.ctu.edu.vn/'), ('Thư viện', 'https://lrc.ctu.edu.vn/')],
        'en': [('Can Tho University', 'https://www.ctu.edu.vn/en/'), ('College of ICT', 'https://cit.ctu.edu.vn/'),
               ('Elearning', 'https://elearning.ctu.edu.vn/'), ('Learning Resource Center', 'https://lrc.ctu.edu.vn/')],
    }
    NEWS = {
        'vi': [('Tuyển sinh', 'ts'), ('Chuẩn đầu ra', 'cdr'), ('Kết quả đào tạo', 'ketqua'), ('Dành cho sinh viên', 'sv'), ('Tin tức', 'tintuc')],
        'en': [('Admissions', 'ts'), ('Learning outcomes', 'cdr'), ('Programme outcomes', 'ketqua'), ('For students', 'sv'), ('News', 'tintuc')],
    }
    for lg, L in LANGS.items():
        mt = 'topbar-' + lg
        api('POST', '/menus/site', {'menutype': mt, 'title': 'Đầu trang ' + lg.upper(), 'description': 'Liên kết đầu trang'})
        for i, (t, u) in enumerate(TOP[lg]):
            api('POST', '/menus/site/items', {'title': t, 'alias': f'{mt}-{i + 1}', 'menutype': mt, 'type': 'url',
                                               'link': u, 'parent_id': 1, 'language': L['tag'], 'published': 1,
                                               'access': 1, 'browserNav': 1, 'params': {'menu_show': 1}})
        mt = 'noibat-' + lg
        api('POST', '/menus/site', {'menutype': mt, 'title': 'Nổi bật ' + lg.upper(), 'description': 'Dải Nổi bật'})
        for i, (t, k) in enumerate(NEWS[lg]):
            api('POST', '/menus/site/items', {'title': t, 'alias': f'{mt}-{i + 1}', 'menutype': mt, 'type': 'alias',
                                               'link': 'index.php?Itemid=', 'parent_id': 1, 'language': L['tag'],
                                               'published': 1, 'access': 1,
                                               'params': {'aliasoptions': str(item[lg][k]), 'menu_show': 1}})

    print('* Module')
    FOOT = footer_html()
    for lg, L in LANGS.items():
        def mod(title, module, position, params, showtitle=0, content=''):
            data = {'title': title, 'module': module, 'position': position, 'published': 1,
                    'language': L['tag'], 'showtitle': showtitle, 'access': 1, 'assignment': '0',
                    'params': params, 'content': content, 'client_id': 0}
            return new_id(api('POST', '/modules/site', data))

        mod('Đầu trang ' + lg.upper(), 'mod_menu', 'topbar',
            {'menutype': 'topbar-' + lg, 'startLevel': 1, 'endLevel': 1, 'layout': 'mmt:topbar'})
        mod('Menu chính ' + lg.upper(), 'mod_menu', 'menu',
            {'menutype': L['menu'], 'startLevel': 1, 'endLevel': 2, 'showAllChildren': 1, 'layout': 'mmt:nav'})
        mod('Nổi bật' if lg == 'vi' else 'Highlights', 'mod_menu', 'newsbar',
            {'menutype': 'noibat-' + lg, 'startLevel': 1, 'endLevel': 1, 'layout': 'mmt:newsbar'})
        f = FOOT[lg]
        mod('Thông tin khoa ' + lg.upper(), 'mod_custom', 'footer', {'prepare_content': 0, 'layout': '_:default'}, 0, f['brand'])
        mod(f['quick'], 'mod_menu', 'footer',
            {'menutype': L['menu'], 'startLevel': 1, 'endLevel': 1, 'layout': 'mmt:list'}, 1)
        mod(f['leaders_t'], 'mod_custom', 'footer', {'prepare_content': 0, 'layout': '_:default'}, 1, f['leaders'])
        mod(f['useful_t'], 'mod_custom', 'footer', {'prepare_content': 0, 'layout': '_:default'}, 1, f['useful'])
    # Nút chuyển ngôn ngữ (dùng chung cho mọi ngôn ngữ)
    api('POST', '/modules/site', {'title': 'Chuyển ngôn ngữ', 'module': 'mod_languages', 'position': 'language',
                                  'published': 1, 'language': '*', 'showtitle': 0, 'access': 1,
                                  'assignment': '0', 'client_id': 0,
                                  'params': {'layout': 'mmt:lang', 'dropdown': 0, 'image': 0, 'full_name': 0,
                                             'show_active': 0, 'inline': 1}})

    # Thứ tự module chân trang theo đúng thứ tự tạo
    sql(f"UPDATE {P}modules SET ordering=id WHERE position='footer'")

    print('* Chuyển hướng địa chỉ cũ (.html)')
    for lg, L in LANGS.items():
        for p in PAGES:
            old = '/' + L['dir'] + '/' + (p[1] if lg == 'vi' else p[4])
            sql(f"INSERT INTO {P}redirect_links (old_url,new_url,referer,comment,hits,published,created_date,modified_date,header) "
                f"VALUES ({q(old)},{q('index.php?Itemid=' + str(item[lg][p[0]]) + '&lang=' + L['tag'])},'','Trang tĩnh cũ',0,1,NOW(),NOW(),301)")
        for old in ('/' + L['dir'] + '/', '/' + L['dir'] + '/index.html'):
            sql(f"INSERT INTO {P}redirect_links (old_url,new_url,referer,comment,hits,published,created_date,modified_date,header) "
                f"VALUES ({q(old)},{q('index.php?Itemid=' + str(item[lg]['home']) + '&lang=' + L['tag'])},'','Trang tĩnh cũ',0,1,NOW(),NOW(),301)")

    json.dump({'articles': art, 'items': item}, open(os.path.join(SITE, 'tmp', 'mmt-ids.json'), 'w'), indent=1)
    print('Xong.')


def footer_html():
    contact = {
        'vi': ('Khoa Mạng máy tính và Truyền thông', 'Cộng đồng · Toàn diện · Ưu việt',
               'Trường Công nghệ Thông tin và Truyền thông — Đại học Cần Thơ',
               'Khu 2, đường 3/2, Phường Ninh Kiều, TP. Cần Thơ, Việt Nam', 'Địa chỉ:', 'Điện thoại:'),
        'en': ('Faculty of Computer Networks and Communications', 'Community · Totality · Uniqueness',
               'College of Information and Communication Technology — Can Tho University',
               'Campus 2, 3/2 Street, Ninh Kieu Ward, Can Tho City, Vietnam', 'Address:', 'Phone:'),
    }
    leaders = {
        'vi': [('Trưởng khoa', 'PGS. TS. Phan Thượng Cang', 'ptcang@ctu.edu.vn'),
               ('Phó trưởng khoa', 'TS. Trần Thị Tố Quyên', 'tttquyen@ctu.edu.vn'),
               ('Phó trưởng khoa', 'TS. Triệu Thanh Ngoan', 'ttngoan@cit.ctu.edu.vn')],
        'en': [('Dean', 'Assoc. Prof. Dr. Phan Thuong Cang', 'ptcang@ctu.edu.vn'),
               ('Vice Dean', 'Dr. Tran Thi To Quyen', 'tttquyen@ctu.edu.vn'),
               ('Vice Dean', 'Dr. Trieu Thanh Ngoan', 'ttngoan@cit.ctu.edu.vn')],
    }
    useful = {
        'vi': [('Cổng tuyển sinh ĐHCT', 'https://tuyensinh.ctu.edu.vn/'),
               ('Chương trình đào tạo ĐHCT', 'https://www.ctu.edu.vn/dao-tao/ctdt-dai-hoc.html'),
               ('Đám mây CIT', 'https://cloud.cit.ctu.edu.vn/horizon'),
               ('Trung tâm Học liệu', 'https://lrc.ctu.edu.vn/')],
        'en': [('CTU Admissions portal', 'https://tuyensinh.ctu.edu.vn/'),
               ('CTU curricula', 'https://www.ctu.edu.vn/dao-tao/ctdt-dai-hoc.html'),
               ('CIT private cloud', 'https://cloud.cit.ctu.edu.vn/horizon'),
               ('Learning Resource Center', 'https://lrc.ctu.edu.vn/')],
    }
    fb = 'https://www.facebook.com/profile.php?id=61593548133901'
    out = {}
    for lg in ('vi', 'en'):
        name, slogan, parent, addr, la, lp = contact[lg]
        brand = (f'<div class="footer__brand">{name}</div>\n<p class="footer__slogan">{slogan}</p>\n<p>{parent}</p>\n'
                 f'<ul class="footer__contact">\n'
                 f'<li><span>{la}</span><span>{addr}</span></li>\n'
                 f'<li><span>{lp}</span><a href="tel:02923734720">0292 3734 720</a></li>\n'
                 f'<li><span>Email:</span><a href="mailto:lt_mmt_tt@cit.ctu.edu.vn">lt_mmt_tt@cit.ctu.edu.vn</a></li>\n'
                 f'</ul>\n<div class="footer__social"><a href="{fb}" target="_blank" rel="noopener" '
                 f'title="Fanpage Khoa MMT &amp; TT" aria-label="Fanpage Khoa MMT &amp; TT">f</a></div>')
        lead = '<ul class="footer__contact">\n' + '\n'.join(
            f'<li><div>{r}<br><strong>{n}</strong><br><a href="mailto:{e}">{e}</a></div></li>'
            for r, n, e in leaders[lg]) + '\n</ul>'
        use = '<ul>\n' + '\n'.join(f'<li><a href="{u}" target="_blank" rel="noopener">{t}</a></li>'
                                   for t, u in useful[lg]) + '\n</ul>'
        out[lg] = {'brand': brand, 'leaders': lead, 'useful': use,
                   'quick': 'Liên kết nhanh' if lg == 'vi' else 'Quick links',
                   'leaders_t': 'Ban lãnh đạo khoa' if lg == 'vi' else 'Faculty board',
                   'useful_t': 'Liên kết hữu ích' if lg == 'vi' else 'Useful links'}
    return out


if __name__ == '__main__':
    main()
