/* ==========================================================================
   Khoa Mạng máy tính & Truyền thông — site.js  (song ngữ Việt / English)
   --------------------------------------------------------------------------
   Tệp này dựng Masthead (banner + menu), dải tin nhanh + ô tìm kiếm, và
   Footer cho TẤT CẢ các trang của cả hai ngôn ngữ. Muốn sửa menu / thông tin
   liên hệ / chân trang thì chỉ cần sửa DUY NHẤT ở tệp này.

   Mỗi trang HTML cần:
     <body data-page="ma-trang" data-lang="vi">              (bản tiếng Việt)
     <body data-page="ma-trang" data-lang="en" data-base="../mmt/">  (bản EN)
     <div id="site-header"></div>   ngay đầu body
     <div id="site-footer"></div>   cuối body
     <script src="assets/js/site.js" defer></script>
   `data-base` là đường dẫn tới thư mục chứa `imgs/` dùng chung (mặc định "").
   ========================================================================== */
(function () {
  'use strict';

  /* =====================================================================
     1. CẤU HÌNH — sửa nội dung ở đây
     ===================================================================== */

  var COMMON = {
    phone: '0292 3734 720',
    phoneHref: 'tel:02923734720',
    email: 'lt_mmt_tt@cit.ctu.edu.vn',

    /* Ma do luong Google Analytics 4 (dang "G-XXXXXXXXXX").
       De trong thi website khong tai Analytics. */
    analyticsId: '',

    /* Duong dan Google Form gop y danh cho sinh vien, cuu sinh vien va nha
       tuyen dung. De trong thi khong hien lien ket o chan trang. */
    feedbackForm: '',

    facebook: [
      { label: 'Fanpage Khoa MMT & TT', url: 'https://www.facebook.com/profile.php?id=61593548133901' }
    ]
  };

  var CONFIG = {

    /* ---------------------------- TIẾNG VIỆT ---------------------------- */
    vi: {
      htmlLang: 'vi',
      deptName: 'Khoa Mạng máy tính và Truyền thông',
      deptTitle: 'Khoa Mạng máy tính và Truyền thông',
      /* Dòng dưới tên đơn vị — quy cách logo đơn vị thành viên của Sổ tay
         thương hiệu ĐHCT: tên tiếng Việt ở trên, tiếng Anh ở dưới. */
      deptTitleAlt: 'Faculty of Computer Networks and Communications',
      slogan: 'Cộng đồng · Toàn diện · Ưu việt',
      parentLine: 'Trường Công nghệ Thông tin và Truyền thông — Đại học Cần Thơ',
      parentShort: 'Trường Công nghệ Thông tin và Truyền thông',
      address: 'Khu 2, đường 3/2, Phường Ninh Kiều, TP. Cần Thơ, Việt Nam',
      home: 'mmt.html',
      altLang: { label: 'EN', url: '../enmmt/enmmt.html', title: 'English version' },

      topbar: [
        { label: 'Đại học Cần Thơ', url: 'https://www.ctu.edu.vn/' },
        { label: 'Trường CNTT & TT', url: 'https://cit.ctu.edu.vn/' },
        { label: 'Elearning', url: 'https://elearning.ctu.edu.vn/' },
        { label: 'Thư viện', url: 'https://lrc.ctu.edu.vn/' }
      ],

      menu: [
        { id: 'gioi-thieu', label: 'Giới thiệu', url: 'mmt.html' },
        {
          id: 'dao-tao', label: 'Đào tạo', url: 'ctdt.html',
          children: [
            { id: 'ctdt', label: 'Tổng quan chương trình đào tạo', url: 'ctdt.html' },
            { id: 'ctdtmmt', label: 'KS Mạng máy tính & TTDL', url: 'ctdtmmt.html' },
            { id: 'ctdtmmtclc', label: 'KS MMT & TTDL — Chất lượng cao', url: 'ctdtmmtclc.html' },
            { id: 'ctdtattt', label: 'KS An toàn thông tin', url: 'ctdtattt.html' },
            { id: 'cdr', label: 'Mục tiêu & Chuẩn đầu ra', url: 'cdr.html' },
            { id: 'dayhoc', label: 'Dạy, học và đánh giá', url: 'dayhoc.html' },
            { id: 'ketqua', label: 'Kết quả đào tạo', url: 'ketqua.html' }
          ]
        },
        {
          id: 'nghien-cuu', label: 'Nghiên cứu', url: 'nckh.html',
          children: [
            { id: 'nckh', label: 'Hoạt động nghiên cứu khoa học', url: 'nckh.html' },
            { id: 'ptn-tongquan', label: 'Phòng thí nghiệm', url: 'ptn.html' },
            { id: 'ptnmmt', label: 'PTN MMT, TTDĐ & Dữ liệu lớn', url: 'ptnmmt.html' },
            { id: 'ptnattt', label: 'PTN An toàn thông tin', url: 'ptnattt.html' }
          ]
        },
        { id: 'sv', label: 'Sinh viên', url: 'sv.html' },
        { id: 'gv', label: 'Nhân sự', url: 'gv.html' },
        { id: 'ts', label: 'Tuyển sinh', url: 'ts.html' }
      ],

      newsFlag: 'Nổi bật',
      newsLinks: [
        { label: 'Tuyển sinh', url: 'ts.html' },
        { label: 'Chuẩn đầu ra', url: 'cdr.html' },
        { label: 'Kết quả đào tạo', url: 'ketqua.html' },
        { label: 'Dành cho sinh viên', url: 'sv.html' }
      ],

      searchPlaceholder: 'Nhập từ khoá cần tìm…',
      searchBtn: 'Tìm kiếm',
      searchLabel: 'Tìm kiếm trong website',
      searchHeading: 'Kết quả tìm kiếm',
      searchClose: 'Đóng kết quả tìm kiếm',
      searchSearching: 'Đang tìm…',
      searchNone: 'Không tìm thấy nội dung nào phù hợp với từ khoá',
      searchCount: function (n, q) { return 'Tìm thấy ' + n + ' trang có chứa “' + q + '”'; },

      skip: 'Bỏ qua và tới nội dung chính',
      menuBtn: 'Menu',
      navLabel: 'Điều hướng chính',
      toTop: 'Lên đầu trang',

      footQuick: 'Liên kết nhanh',
      footLeaders: 'Ban lãnh đạo khoa',
      footUseful: 'Liên kết hữu ích',
      footFeedback: 'Góp ý cho Khoa',
      footAddress: 'Địa chỉ:',
      footPhone: 'Điện thoại:',
      footEmail: 'Email:',
      footCredit: 'Khoa Mạng máy tính & Truyền thông — Đại học Cần Thơ.',

      usefulLinks: [
        { label: 'Cổng tuyển sinh ĐHCT', url: 'https://tuyensinh.ctu.edu.vn/' },
        { label: 'Chương trình đào tạo ĐHCT', url: 'https://www.ctu.edu.vn/dao-tao/ctdt-dai-hoc.html' },
        { label: 'Đám mây CIT', url: 'https://cloud.cit.ctu.edu.vn/horizon' },
        { label: 'Trung tâm Học liệu', url: 'https://lrc.ctu.edu.vn/' }
      ],

      leaders: [
        { role: 'Trưởng khoa', name: 'PGS. TS. GVCC. Phan Thượng Cang', email: 'ptcang@ctu.edu.vn' },
        { role: 'Phó trưởng khoa', name: 'TS. GVC. Trần Thị Tố Quyên', email: 'tttquyen@ctu.edu.vn' },
        { role: 'Phó trưởng khoa', name: 'TS. Triệu Thanh Ngoan', email: 'ttngoan@cit.ctu.edu.vn' }
      ],

      pages: ['mmt.html', 'ctdt.html', 'ctdtmmt.html', 'ctdtmmtclc.html', 'ctdtattt.html',
              'cdr.html', 'dayhoc.html', 'ketqua.html', 'ts.html', 'nckh.html',
              'ptn.html', 'ptnmmt.html', 'ptnattt.html', 'sv.html', 'gv.html']
    },

    /* ------------------------------ ENGLISH ------------------------------ */
    en: {
      htmlLang: 'en',
      deptName: 'Faculty of Computer Networks and Communications',
      deptTitle: 'Faculty of Computer Networks &amp; Communications',
      deptTitleAlt: 'Khoa Mạng máy tính và Truyền thông',
      slogan: 'Community · Totality · Uniqueness',
      parentLine: 'College of Information and Communication Technology — Can Tho University',
      parentShort: 'College of Information &amp; Communication Technology',
      address: 'Campus 2, 3/2 Street, Ninh Kieu Ward, Can Tho City, Vietnam',
      home: 'enmmt.html',
      altLang: { label: 'VI', url: '../mmt/mmt.html', title: 'Phiên bản tiếng Việt' },

      topbar: [
        { label: 'Can Tho University', url: 'https://www.ctu.edu.vn/en/' },
        { label: 'College of ICT', url: 'https://cit.ctu.edu.vn/' },
        { label: 'Elearning', url: 'https://elearning.ctu.edu.vn/' },
        { label: 'Learning Resource Center', url: 'https://lrc.ctu.edu.vn/' }
      ],

      menu: [
        { id: 'gioi-thieu', label: 'Introduction', url: 'enmmt.html' },
        {
          id: 'dao-tao', label: 'Academics', url: 'enctdt.html',
          children: [
            { id: 'ctdt', label: 'Programmes overview', url: 'enctdt.html' },
            { id: 'ctdtmmt', label: 'Engineer in CN & Data Communication', url: 'enctdtmmt.html' },
            { id: 'ctdtmmtclc', label: 'Engineer in CN & DC — High-quality', url: 'enctdtmmtclc.html' },
            { id: 'ctdtattt', label: 'Engineer in Information Security', url: 'enctdtattt.html' },
            { id: 'cdr', label: 'Objectives & Learning Outcomes', url: 'encdr.html' },
            { id: 'dayhoc', label: 'Teaching, learning and assessment', url: 'endayhoc.html' },
            { id: 'ketqua', label: 'Programme outcomes', url: 'enketqua.html' }
          ]
        },
        {
          id: 'nghien-cuu', label: 'Research', url: 'ennckh.html',
          children: [
            { id: 'nckh', label: 'Research activities', url: 'ennckh.html' },
            { id: 'ptn-tongquan', label: 'Laboratories', url: 'enptn.html' },
            { id: 'ptnmmt', label: 'Networks, Mobile Comm. & Big Data Lab', url: 'enptnmmt.html' },
            { id: 'ptnattt', label: 'Information Security Lab', url: 'enptnattt.html' }
          ]
        },
        { id: 'sv', label: 'Students', url: 'ensv.html' },
        { id: 'gv', label: 'People', url: 'engv.html' },
        { id: 'ts', label: 'Admissions', url: 'ents.html' }
      ],

      newsFlag: 'Highlights',
      newsLinks: [
        { label: 'Admissions', url: 'ents.html' },
        { label: 'Learning outcomes', url: 'encdr.html' },
        { label: 'Programme outcomes', url: 'enketqua.html' },
        { label: 'For students', url: 'ensv.html' }
      ],

      searchPlaceholder: 'Enter a keyword…',
      searchBtn: 'Search',
      searchLabel: 'Search this website',
      searchHeading: 'Search results',
      searchClose: 'Close search results',
      searchSearching: 'Searching…',
      searchNone: 'No page matches the keyword',
      searchCount: function (n, q) { return n + ' page(s) contain “' + q + '”'; },

      skip: 'Skip to main content',
      menuBtn: 'Menu',
      navLabel: 'Main navigation',
      toTop: 'Back to top',

      footQuick: 'Quick links',
      footLeaders: 'Faculty board',
      footUseful: 'Useful links',
      footFeedback: 'Send us your feedback',
      footAddress: 'Address:',
      footPhone: 'Phone:',
      footEmail: 'Email:',
      footCredit: 'Faculty of Computer Networks and Communications — Can Tho University.',

      usefulLinks: [
        { label: 'CTU Admissions portal', url: 'https://tuyensinh.ctu.edu.vn/' },
        { label: 'CTU curricula', url: 'https://www.ctu.edu.vn/dao-tao/ctdt-dai-hoc.html' },
        { label: 'CIT private cloud', url: 'https://cloud.cit.ctu.edu.vn/horizon' },
        { label: 'Learning Resource Center', url: 'https://lrc.ctu.edu.vn/' }
      ],

      leaders: [
        { role: 'Dean', name: 'Assoc. Prof. Dr. Phan Thuong Cang', email: 'ptcang@ctu.edu.vn' },
        { role: 'Vice Dean', name: 'Dr. Tran Thi To Quyen', email: 'tttquyen@ctu.edu.vn' },
        { role: 'Vice Dean', name: 'Dr. Trieu Thanh Ngoan', email: 'ttngoan@cit.ctu.edu.vn' }
      ],

      pages: ['enmmt.html', 'enctdt.html', 'enctdtmmt.html', 'enctdtmmtclc.html', 'enctdtattt.html',
              'encdr.html', 'endayhoc.html', 'enketqua.html', 'ents.html', 'ennckh.html',
              'enptn.html', 'enptnmmt.html', 'enptnattt.html', 'ensv.html', 'engv.html']
    }
  };

  /* =====================================================================
     2. Tiện ích
     ===================================================================== */
  var body = document.body;
  var LANG = body.getAttribute('data-lang') === 'en' ? 'en' : 'vi';
  var T = CONFIG[LANG];
  var BASE = body.getAttribute('data-base') || '';
  var page = body.getAttribute('data-page') || '';

  function esc(s) {
    return String(s).replace(/&(?![a-z]+;|#\d+;)/gi, '&amp;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function ext(url) { return /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : ''; }

  /* Bỏ dấu tiếng Việt, giữ nguyên độ dài chuỗi (1 ký tự -> 1 ký tự) */
  function deaccent(str) {
    var out = '';
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i);
      var n = c.normalize ? c.normalize('NFD').replace(/[̀-ͯ]/g, '') : c;
      if (!n) n = c;
      n = n.charAt(0).toLowerCase();
      if (n === 'đ') n = 'd';
      out += n;
    }
    return out;
  }

  /* =====================================================================
     3. Masthead + dải tin nhanh
     ===================================================================== */
  function buildHeader() {
    var host = document.getElementById('site-header');
    if (!host) return;

    var topLinks = T.topbar.map(function (l) {
      return '<li><a href="' + esc(l.url) + '"' + ext(l.url) + '>' + l.label + '</a></li>';
    }).join('');

    var items = T.menu.map(function (item) {
      var active = item.id === page || (item.children || []).some(function (c) { return c.id === page; });
      var cls = 'nav__item' + (active ? ' nav__item--active' : '');

      if (!item.children) {
        return '<li class="' + cls + '"><a class="nav__link" href="' + esc(item.url) + '"' +
          (item.id === page ? ' aria-current="page"' : '') + '>' + item.label + '</a></li>';
      }
      var sub = item.children.map(function (c) {
        return '<li><a href="' + esc(c.url) + '"' +
          (c.id === page ? ' aria-current="page"' : '') + '>' + c.label + '</a></li>';
      }).join('');
      return '<li class="' + cls + '">' +
        '<a class="nav__link" href="' + esc(item.url) + '" aria-haspopup="true" aria-expanded="false"' +
        (item.id === page ? ' aria-current="page"' : '') + '>' +
        item.label + '<span class="nav__caret" aria-hidden="true"></span></a>' +
        '<ul class="nav__submenu">' + sub + '</ul></li>';
    }).join('');

    var newsLinks = T.newsLinks.map(function (l) {
      return '<li><a href="' + esc(l.url) + '"' + ext(l.url) + '>' + l.label + '</a></li>';
    }).join('');

    host.innerHTML =
      '<a class="skip-link" href="#main">' + T.skip + '</a>' +

      '<div class="topbar"><div class="container topbar__inner">' +
        '<ul class="topbar__links">' + topLinks + '</ul>' +
        '<div class="topbar__meta">' +
          '<a href="' + COMMON.phoneHref + '">' + COMMON.phone + '</a>' +
          '<a class="topbar__lang" href="' + esc(T.altLang.url) + '" title="' + esc(T.altLang.title) + '">' +
            T.altLang.label + '</a>' +
        '</div>' +
      '</div></div>' +

      '<div class="masthead" id="masthead"><div class="container masthead__inner">' +
        '<a class="masthead__brand" href="' + esc(T.home) + '">' +
          '<img class="masthead__logo" src="' + BASE + 'imgs/ctu-logo.png" width="320" height="320" ' +
            'alt="Logo Đại học Cần Thơ">' +
          '<span><span class="masthead__title">' + T.deptTitle + '</span>' +
          '<small class="masthead__sub">' + T.deptTitleAlt + '</small></span>' +
        '</a>' +
        '<div class="masthead__navwrap">' +
          '<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu">' +
            '<span class="nav__toggle-bars" aria-hidden="true"></span>' + T.menuBtn + '</button>' +
          '<nav aria-label="' + esc(T.navLabel) + '">' +
            '<ul class="nav__menu" id="nav-menu">' + items + '</ul>' +
          '</nav>' +
        '</div>' +
      '</div></div>' +

      '<div class="newsbar"><div class="container newsbar__inner">' +
        '<ul class="newsbar__links">' +
          '<li><span class="newsbar__flag">' + T.newsFlag + '</span></li>' + newsLinks +
        '</ul>' +
        '<form class="search" role="search" id="site-search">' +
          '<label class="visually-hidden" for="site-search-input">' + esc(T.searchLabel) + '</label>' +
          '<input class="search__input" id="site-search-input" type="search" autocomplete="off" ' +
            'placeholder="' + esc(T.searchPlaceholder) + '">' +
          '<button class="search__btn" type="submit">' + T.searchBtn + '</button>' +
        '</form>' +
      '</div></div>' +

      '<section class="search-results" id="search-results" hidden aria-live="polite">' +
        '<div class="container search-results__inner">' +
          '<div class="search-results__head">' +
            '<h2>' + T.searchHeading + '</h2>' +
            '<button class="search-results__close" type="button" title="' + esc(T.searchClose) + '" ' +
              'aria-label="' + esc(T.searchClose) + '">&times;</button>' +
          '</div>' +
          '<div id="search-results-body"></div>' +
        '</div>' +
      '</section>';

    wireNav();
    wireSearch();
  }

  function wireNav() {
    var mast = document.getElementById('masthead');
    if (!mast) return;
    var toggle = mast.querySelector('.nav__toggle');
    var desktop = function () { return window.matchMedia('(min-width: 1100px)').matches; };

    toggle.addEventListener('click', function () {
      var open = mast.classList.toggle('nav--open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    mast.querySelectorAll('.nav__item').forEach(function (li) {
      var link = li.querySelector('.nav__link');
      var sub = li.querySelector('.nav__submenu');
      if (!sub) return;

      link.addEventListener('click', function (e) {
        if (desktop()) return;                     /* desktop: mở bằng hover */
        e.preventDefault();
        var open = li.classList.toggle('nav__item--open');
        link.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      li.addEventListener('mouseenter', function () {
        if (desktop()) link.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', function () {
        if (desktop()) link.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mast.classList.contains('nav--open')) {
        mast.classList.remove('nav--open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* =====================================================================
     4. Tìm kiếm phía trình duyệt (không cần máy chủ)
     Lần tìm đầu tiên sẽ tải nội dung các trang rồi giữ lại trong bộ nhớ,
     nên chỉ số tìm kiếm luôn khớp với nội dung hiện tại của website.
     ===================================================================== */
  var index = null;

  function buildIndex() {
    if (index) return Promise.resolve(index);
    return Promise.all(T.pages.map(function (url) {
      return fetch(url).then(function (r) { return r.ok ? r.text() : ''; })
        .then(function (html) {
          if (!html) return null;
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var main = doc.getElementById('main') || doc.body;
          var h1 = doc.querySelector('h1');
          var text = (main.textContent || '').replace(/\s+/g, ' ').trim();
          return {
            url: url,
            title: (h1 && h1.textContent.trim()) || doc.title,
            text: text,
            norm: deaccent(text)
          };
        }).catch(function () { return null; });
    })).then(function (list) {
      index = list.filter(Boolean);
      return index;
    });
  }

  function runSearch(query) {
    var box = document.getElementById('search-results');
    var out = document.getElementById('search-results-body');
    var q = query.trim();
    if (!q) { box.hidden = true; return; }

    box.hidden = false;
    out.innerHTML = '<p>' + T.searchSearching + '</p>';

    buildIndex().then(function (list) {
      var nq = deaccent(q);
      var hits = [];
      list.forEach(function (p) {
        var pos = p.norm.indexOf(nq);
        if (pos < 0) return;
        var count = 0, i = pos;
        while (i >= 0) { count++; i = p.norm.indexOf(nq, i + nq.length); }
        var from = Math.max(0, pos - 90);
        var to = Math.min(p.text.length, pos + nq.length + 130);
        hits.push({
          url: p.url, title: p.title, count: count,
          before: (from > 0 ? '… ' : '') + p.text.slice(from, pos),
          match: p.text.slice(pos, pos + nq.length),
          after: p.text.slice(pos + nq.length, to) + (to < p.text.length ? ' …' : '')
        });
      });
      hits.sort(function (a, b) { return b.count - a.count; });

      if (!hits.length) {
        out.innerHTML = '<p>' + T.searchNone + ' “' + esc(q) + '”.</p>';
        return;
      }
      out.innerHTML = '<p class="text-muted">' + esc(T.searchCount(hits.length, q)) + '</p><ol>' +
        hits.map(function (h) {
          return '<li><a href="' + esc(h.url) + '">' + esc(h.title) + '</a>' +
            '<p>' + esc(h.before) + '<mark>' + esc(h.match) + '</mark>' + esc(h.after) + '</p></li>';
        }).join('') + '</ol>';
    });
  }

  function wireSearch() {
    var form = document.getElementById('site-search');
    var input = document.getElementById('site-search-input');
    var box = document.getElementById('search-results');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      runSearch(input.value);
      box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    box.querySelector('.search-results__close').addEventListener('click', function () {
      box.hidden = true;
      input.value = '';
      input.focus();
    });
  }

  /* =====================================================================
     5. Chân trang
     ===================================================================== */
  function buildFooter() {
    var host = document.getElementById('site-footer');
    if (!host) return;

    var quick = T.menu.map(function (m) {
      return '<li><a href="' + esc(m.url) + '">' + m.label + '</a></li>';
    }).join('');

    var leaders = T.leaders.map(function (l) {
      return '<li><div>' + l.role + '<br><strong>' + l.name + '</strong><br>' +
        '<a href="mailto:' + esc(l.email) + '">' + l.email + '</a></div></li>';
    }).join('');

    var useful = T.usefulLinks.map(function (l) {
      return '<li><a href="' + esc(l.url) + '"' + ext(l.url) + '>' + l.label + '</a></li>';
    }).join('');
    if (COMMON.feedbackForm) {
      useful += '<li><a href="' + esc(COMMON.feedbackForm) + '" target="_blank" rel="noopener">' +
        esc(T.footFeedback) + '</a></li>';
    }
    useful += '<li><a href="' + esc(T.altLang.url) + '">' + esc(T.altLang.title) + '</a></li>';

    var social = COMMON.facebook.map(function (f) {
      return '<a href="' + esc(f.url) + '" target="_blank" rel="noopener" title="' + esc(f.label) +
        '" aria-label="' + esc(f.label) + '">f</a>';
    }).join('');

    host.innerHTML =
      '<footer class="footer"><div class="container">' +
        '<div class="footer__grid">' +
          '<div>' +
            '<div class="footer__brand">' + T.deptName + '</div>' +
            '<p class="footer__slogan">' + T.slogan + '</p>' +
            '<p>' + T.parentLine + '</p>' +
            '<ul class="footer__contact">' +
              '<li><span>' + T.footAddress + '</span><span>' + T.address + '</span></li>' +
              '<li><span>' + T.footPhone + '</span><a href="' + COMMON.phoneHref + '">' + COMMON.phone + '</a></li>' +
              '<li><span>' + T.footEmail + '</span><a href="mailto:' + COMMON.email + '">' + COMMON.email + '</a></li>' +
            '</ul>' +
            '<div class="footer__social">' + social + '</div>' +
          '</div>' +
          '<div><h4>' + T.footQuick + '</h4><ul>' + quick + '</ul></div>' +
          '<div><h4>' + T.footLeaders + '</h4><ul class="footer__contact">' + leaders + '</ul></div>' +
          '<div><h4>' + T.footUseful + '</h4><ul>' + useful + '</ul></div>' +
        '</div>' +
        '<div class="footer__bottom">' +
          '<span>&copy; ' + new Date().getFullYear() + ' ' + T.footCredit + '</span>' +
          '<span>CTU &middot; CICT</span>' +
        '</div>' +
      '</div></footer>' +
      '<button class="to-top" type="button" aria-label="' + esc(T.toTop) + '" title="' + esc(T.toTop) + '">&uarr;</button>';

    var toTop = host.querySelector('.to-top');
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
  }

  /* =====================================================================
     6. Accordion (khung chương trình)
     ===================================================================== */
  function wireAccordions() {
    document.querySelectorAll('.accordion__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (panel) panel.hidden = open;
      });
    });
  }

  /* =====================================================================
     7. Hiệu ứng xuất hiện khi cuộn
     ===================================================================== */
  function wireReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(function (el) { io.observe(el); });

    /* Lưới an toàn: nếu sau 3 giây vẫn chưa có khối nào hiện ra thì hiển thị hết */
    window.setTimeout(function () {
      if (!document.querySelector('[data-reveal].is-visible')) {
        els.forEach(function (el) { el.classList.add('is-visible'); });
      }
    }, 3000);
  }

  /* =====================================================================
     8. Khởi động
     ===================================================================== */
  /* =====================================================================
     Google Analytics 4 — chỉ tải khi đã điền COMMON.analyticsId
     ===================================================================== */
  function loadAnalytics() {
    var id = COMMON.analyticsId;
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) return;
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(tag);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', id, { anonymize_ip: true });
  }

  function init() {
    buildHeader();
    buildFooter();
    wireAccordions();
    wireReveal();
    loadAnalytics();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
