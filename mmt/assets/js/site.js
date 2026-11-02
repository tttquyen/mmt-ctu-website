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
    ],

    /* An tat ca cac khoi danh dau data-pending ("Dang cap nhat").
       true  = an (khi hoi dong danh gia xem trang)
       false = hien lai de biet con thieu noi dung gi. */
    hidePending: true,


    /* ------------------------------------------------------------------
       DU LIEU DONG — cac bang co thuoc tinh data-table="ten" / data-people="ten"
       doc du lieu tu tep mmt/data/<ten>.csv.
       Muon cap nhat bang Google Sheets: mo trang tinh > Tep > Chia se >
       Cong bo len web > chon tab > dinh dang CSV > Cong bo, roi dan URL vao
       dong tuong ung ben duoi. De trong = dung tep CSV trong thu muc data/.
       ------------------------------------------------------------------ */
    /* ------------------------------------------------------------------
       GOOGLE SHEETS — mỗi bộ số liệu là một tệp Google Sheets riêng trong
       thư mục Drive "Website Khoa MMT&TT – Số liệu" (tên tệp = tên CSV).
       Cách A: chia sẻ cả thư mục "Bất kỳ ai có đường liên kết — Người xem"
               → dùng sheetFiles (ID tệp, đã điền sẵn).
       Cách B: mở từng tệp > Tệp > Chia sẻ > Xuất bản lên web > Xuất bản
               → dán chuỗi 2PACX-... của tệp vào sheetPub.
       Thêm bộ số liệu mới: tạo tệp cùng tên với CSV rồi thêm vào sheetFiles.
       Không tải được Google Sheets thì website tự dùng tệp CSV trong data/.
       ------------------------------------------------------------------ */
    sheetFiles: {
      'tot-nghiep': '1TPdntYX8MyyEUP47KTQhi4huajsiyNQporDXHsHCdDY',
      'viec-lam': '10lfKR2efG_rizTqLI7VMcGrzMqY42v6y_WAGYPdv4Ig',
      'viec-lam-chi-tiet': '1ADnCowk7zeB2R4q9tOf5AkWAmw0eRA7PyUEw6UNvBW8',
      'dat-cdr': '1NKKKdh4Rwq3FygMmTqlwTbCyWxb4qg0nRDQks99OqaQ',
      'hai-long': '1bsdD_3WKtUzsW5elkQARcWv9qp48uRAjfOBPTNismGI',
      'nhan-su-thong-ke': '1aCWBf0T_ZvwjbQDEqqLPPNQ6CGePXaCc05OO-SK2BPA',
      'cong-bo': '1zLGDwNSWtUQ_OYC-kFXfvlmP1ZInQYBc0TOixufCHdE',
      'tuyen-sinh': '1ngIspvsTq64SFJeubZoW-YxX4-NqvHAzHcRhnQegnyg',
      'tin-tuc': '1hThAFggh0_nn2Lwd9AtLRn1n427VC6ohLjmgdZHZt8s'
    },
    sheetPub: {},

    dataSources: {
      'tot-nghiep': '',
      'viec-lam': '',
      'viec-lam-chi-tiet': '',
      'dat-cdr': '',
      'hai-long': '',
      'cong-bo': '',
      'de-tai-gv': '',
      'de-tai-sv': '',
      'nhan-su': '',
      'nhan-su-thong-ke': '',
      'tuyen-sinh': '',
      'cac-khoa': '',
      'matran-mmt': '',
      'matran-attt': '',
      'ke-hoach-mmt': '',
      'ke-hoach-attt': '',
      'khuyen-nghi-aun': '',
      'doi-tac': '',
      'matran-clc': '',
      'ke-hoach-clc': '',
      'de-cuong': '',
      'co-van': '',
      'bieu-mau': '',
      'tin-tuc': ''
    }
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
        {
          id: 'gioi-thieu', label: 'Giới thiệu', url: 'mmt.html',
          children: [
            { id: 'gioi-thieu', label: 'Tổng quan về Khoa', url: 'mmt.html' },
            { id: 'gt', label: 'Sứ mạng, tầm nhìn & cơ cấu tổ chức', url: 'gt.html' },
            { id: 'dbcl', label: 'Đảm bảo chất lượng', url: 'dbcl.html' }
          ]
        },
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
        {
          id: 'sinh-vien', label: 'Sinh viên', url: 'sv.html',
          children: [
            { id: 'sv', label: 'Dành cho sinh viên', url: 'sv.html' },
            { id: 'tintuc', label: 'Tin tức & hình ảnh', url: 'tintuc.html' }
          ]
        },
        { id: 'gv', label: 'Nhân sự', url: 'gv.html' },
        { id: 'ts', label: 'Tuyển sinh', url: 'ts.html' }
      ],

      newsFlag: 'Nổi bật',
      newsLinks: [
        { label: 'Tuyển sinh', url: 'ts.html' },
        { label: 'Chuẩn đầu ra', url: 'cdr.html' },
        { label: 'Kết quả đào tạo', url: 'ketqua.html' },
        { label: 'Dành cho sinh viên', url: 'sv.html' },
        { label: 'Tin tức sinh viên', url: 'tintuc.html' }
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
      syllabusTitle: 'Đề cương chi tiết học phần (PDF)',
      openLink: 'Xem',
      dataError: 'Chưa tải được dữ liệu. Vui lòng tải lại trang hoặc xem tệp gốc',
      peopleResearch: 'Hướng NC',
      peopleTeaching: 'Môn GD',
      chartLabel: 'Biểu đồ số công bố khoa học theo năm',
      chartIntl: 'Công bố quốc tế',
      chartDom: 'Công bố trong nước',
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
        { role: 'Trưởng khoa', name: 'PGS. TS. Phan Thượng Cang', email: 'ptcang@ctu.edu.vn' },
        { role: 'Phó trưởng khoa', name: 'TS. Trần Thị Tố Quyên', email: 'tttquyen@ctu.edu.vn' },
        { role: 'Phó trưởng khoa', name: 'TS. Triệu Thanh Ngoan', email: 'ttngoan@cit.ctu.edu.vn' }
      ],

      pages: ['mmt.html', 'ctdt.html', 'ctdtmmt.html', 'ctdtmmtclc.html', 'ctdtattt.html',
              'cdr.html', 'dayhoc.html', 'ketqua.html', 'ts.html', 'nckh.html',
              'ptn.html', 'ptnmmt.html', 'ptnattt.html', 'sv.html', 'tintuc.html', 'gv.html', 'gt.html', 'dbcl.html']
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
        {
          id: 'gioi-thieu', label: 'Introduction', url: 'enmmt.html',
          children: [
            { id: 'gioi-thieu', label: 'About the Faculty', url: 'enmmt.html' },
            { id: 'gt', label: 'Mission, vision & organisation', url: 'engt.html' },
            { id: 'dbcl', label: 'Quality assurance', url: 'endbcl.html' }
          ]
        },
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
        {
          id: 'sinh-vien', label: 'Students', url: 'ensv.html',
          children: [
            { id: 'sv', label: 'Student support', url: 'ensv.html' },
            { id: 'tintuc', label: 'News & photos', url: 'entintuc.html' }
          ]
        },
        { id: 'gv', label: 'People', url: 'engv.html' },
        { id: 'ts', label: 'Admissions', url: 'ents.html' }
      ],

      newsFlag: 'Highlights',
      newsLinks: [
        { label: 'Admissions', url: 'ents.html' },
        { label: 'Learning outcomes', url: 'encdr.html' },
        { label: 'Programme outcomes', url: 'enketqua.html' },
        { label: 'For students', url: 'ensv.html' },
        { label: 'Student news', url: 'entintuc.html' }
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
      syllabusTitle: 'Course syllabus (PDF)',
      openLink: 'Open',
      dataError: 'The data could not be loaded. Please reload the page or open the source file',
      peopleResearch: 'Research',
      peopleTeaching: 'Teaching',
      chartLabel: 'Publications per year',
      chartIntl: 'International publications',
      chartDom: 'Domestic publications',
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
              'enptn.html', 'enptnmmt.html', 'enptnattt.html', 'ensv.html', 'entintuc.html', 'engv.html', 'engt.html', 'endbcl.html']
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
          /* Bảng dữ liệu động chưa có trong HTML gốc: đọc thêm tệp CSV của trang */
          var names = [];
          main.querySelectorAll('[data-table],[data-people]').forEach(function (el) {
            var n = el.getAttribute('data-table') || el.getAttribute('data-people');
            if (names.indexOf(n) < 0) names.push(n);
          });
          return Promise.all(names.map(function (n) {
            return loadData(n).then(function (rows) {
              return rows.filter(function (r) { return !/^#(?!#)/.test(r[0].trim()); })
                .map(function (r) { return r.map(function (c) { return pick(c.replace(/^##|^=/, '')); }).join(' '); }).join(' ');
            }).catch(function () { return ''; });
          })).then(function (extra) {
            var text = ((main.textContent || '') + ' ' + extra.join(' ')).replace(/\s+/g, ' ').trim();
            return {
              url: url,
              title: (h1 && h1.textContent.trim()) || doc.title,
              text: text,
              norm: deaccent(text)
            };
          });
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

  /* =====================================================================
     9. Dữ liệu động (CSV / Google Sheets)
     ---------------------------------------------------------------------
     Quy ước tệp CSV (một tệp dùng chung cho cả hai ngôn ngữ):
       - Dòng đầu tiên (không bắt đầu bằng #) là tiêu đề cột.
       - Ô song ngữ viết "Tiếng Việt | English"; ô chỉ có một vế dùng cho cả hai.
       - Dòng bắt đầu bằng "#"  : ghi chú, bỏ qua.
       - Dòng bắt đầu bằng "##" : dòng nhóm, kéo dài hết bảng (vd. "## Học kỳ 1 | Semester 1").
       - Dòng bắt đầu bằng "="  : dòng tổng ở chân bảng (vd. "=Tổng cộng | Total").
       - Số thập phân viết bằng dấu chấm (70.71%); bản tiếng Việt tự đổi sang dấu phẩy.
     Thuộc tính trên phần tử chứa bảng:
       data-table="ten"         tên tệp / nguồn dữ liệu
       data-class="table-num"   lớp CSS cho <table>
       data-syllabus="1"        cột (đếm từ 0) chứa mã học phần; mã nào có URL trong de-cuong.csv
                                thì được gắn link đề cương, mã chưa có URL hiển thị chữ thường
       data-irm                 tô màu ô I / R / M (ma trận chuẩn đầu ra)
       data-caption="..."       chú thích ẩn cho trình đọc màn hình
     ===================================================================== */
  var dataCache = {};

  function parseCSV(text) {
    var rows = [], row = [], cell = '', q = false;
    text = text.replace(/^﻿/, '');
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (x) { return x.trim() !== ''; }); });
  }

  /* Địa chỉ CSV của một bộ số liệu trên Google Sheets (mỗi bộ một tệp, xem COMMON.sheetFiles) */
  function sheetUrl(name) {
    var pub = (COMMON.sheetPub || {})[name], id = (COMMON.sheetFiles || {})[name];
    if (pub) {                                                   /* Cách B: tệp đã Xuất bản lên web */
      return 'https://docs.google.com/spreadsheets/d/e/' + encodeURIComponent(pub) + '/pub?output=csv';
    }
    if (id) {                                                    /* Cách A: tệp chia sẻ bằng liên kết */
      return 'https://docs.google.com/spreadsheets/d/' + encodeURIComponent(id) + '/gviz/tq?tqx=out:csv&headers=0';
    }
    return '';
  }

  /* Khung nhúng Google Sheets / biểu đồ đã xuất bản: <div class="embed-frame" data-embed="URL" data-title="..."></div> */
  function renderEmbeds() {
    document.querySelectorAll('[data-embed]').forEach(function (host) {
      var url = host.getAttribute('data-embed');
      if (!/^https:\/\/docs\.google\.com\//.test(url)) return;
      host.innerHTML = '<iframe src="' + esc(url) + '" title="' + esc(host.getAttribute('data-title') || 'Google Sheets') +
        '" loading="lazy" referrerpolicy="no-referrer"></iframe>';
    });
  }

  function loadData(name) {
    if (dataCache[name]) return dataCache[name];
    var local = BASE + 'data/' + name + '.csv';
    var remote = (COMMON.dataSources || {})[name] || sheetUrl(name);
    var get = function (url) {
      return fetch(url, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
      }).then(function (t) {
        if (/^\s*</.test(t)) throw new Error('not csv');   /* trang đăng nhập Google = chưa chia sẻ công khai */
        return t;
      });
    };
    dataCache[name] = (remote ? get(remote).catch(function () { return get(local); }) : get(local)).then(parseCSV);
    return dataCache[name];
  }

  /* Chọn vế ngôn ngữ trong ô "VI | EN" */
  function pick(s) {
    s = (s || '').trim();
    var parts = s.split(' | ');
    return (LANG === 'en' && parts.length > 1 ? parts[1] : parts[0]).trim();
  }
  function fmtNum(s) {
    if (LANG === 'vi' && /^-?\d+\.\d+%?$/.test(s)) return s.replace('.', ',');
    return s;
  }
  function cellHTML(raw, col, opt) {
    var v = fmtNum(pick(raw));
    if (opt.syllabus === col && opt.syllabi && opt.syllabi[v]) {
      return '<a href="' + esc(opt.syllabi[v]) + '" target="_blank" rel="noopener" title="' +
        esc(T.syllabusTitle) + '">' + esc(v) + '</a>';
    }
    if (/^https?:\/\//.test(v)) {
      return '<a href="' + esc(v) + '" target="_blank" rel="noopener">' + esc(T.openLink) + '</a>';
    }
    var m = v.match(/^\[(.+)\]\((https?:\/\/[^)]+|[\w./#-]+)\)$/);   /* [chữ](link) */
    if (m) {
      var href = /^(docs|imgs|cv|data)\//.test(m[2]) ? BASE + m[2] : m[2];   /* tệp dùng chung */
      return '<a href="' + esc(href) + '"' + ext(href) + '>' + esc(m[1]) + '</a>';
    }
    return esc(v);
  }

  /* de-cuong.csv: Mã HP, Tên học phần, URL đề cương -> { MÃ: URL } */
  function syllabusMap(rows) {
    var map = {};
    rows.forEach(function (r) {
      var code = (r[0] || '').trim(), url = (r[2] || '').trim();
      if (/^[A-Z]{2}\d{3}[A-Z]{0,2}$/.test(code) && /^https?:\/\//.test(url)) map[code] = url;
    });
    return map;
  }

  function renderTable(host, rows, syllabi) {
    var opt = {
      syllabi: syllabi,
      syllabus: host.hasAttribute('data-syllabus') ? +host.getAttribute('data-syllabus') : -1,
      irm: host.hasAttribute('data-irm')
    };
    rows = rows.filter(function (r) { return !/^#(?!#)/.test(r[0].trim()); });
    if (!rows.length) return;
    var head = rows.shift();
    var n = head.length;
    var body = [], foot = [];
    rows.forEach(function (r) {
      var first = r[0].trim();
      if (first.indexOf('##') === 0) {
        body.push('<tr class="row-group"><th colspan="' + n + '" scope="colgroup">' +
          esc(pick(first.slice(2))) + '</th></tr>');
        return;
      }
      var isFoot = first.indexOf('=') === 0;
      var cells = [];
      for (var i = 0; i < n; i++) {
        var raw = i === 0 && isFoot ? first.slice(1) : (r[i] || '');
        var val = pick(raw);
        var cls = opt.irm && /^[IRM]$/.test(val) ? ' class="irm irm--' + val.toLowerCase() + '"' : '';
        cells.push('<td' + cls + '>' + cellHTML(raw, i, opt) + '</td>');
      }
      (isFoot ? foot : body).push('<tr>' + cells.join('') + '</tr>');
    });
    if (!body.length && host.getAttribute('data-empty')) {
      body.push('<tr><td colspan="' + n + '" class="text-muted">' + esc(host.getAttribute('data-empty')) + '</td></tr>');
    }
    var cap = host.getAttribute('data-caption');
    host.innerHTML = '<table' + (host.getAttribute('data-class') ? ' class="' + esc(host.getAttribute('data-class')) + '"' : '') + '>' +
      (cap ? '<caption class="visually-hidden">' + esc(cap) + '</caption>' : '') +
      '<thead><tr>' + head.map(function (h) { return '<th scope="col">' + esc(pick(h)) + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + body.join('') + '</tbody>' +
      (foot.length ? '<tfoot>' + foot.join('') + '</tfoot>' : '') + '</table>';
  }

  /* Thẻ nhân sự: cột nhom, ho_ten, chuc_vu, email, anh, lien_ket_ten, huong_nc, mon_gd, lien_ket
     lien_ket dạng "Google Scholar=https://...; DBLP=https://..." */
  function renderPeople(host, rows) {
    rows = rows.filter(function (r) { return !/^#/.test(r[0].trim()); });
    var head = rows.shift().map(function (h) { return h.trim(); });
    var group = host.getAttribute('data-group');
    var col = function (r, k) { var i = head.indexOf(k); return i < 0 ? '' : pick(r[i] || ''); };
    host.innerHTML = rows.filter(function (r) { return !group || col(r, 'nhom') === group; }).map(function (r) {
      var name = col(r, 'ho_ten'), link = col(r, 'lien_ket_ten'), photo = col(r, 'anh') || 'imgs/person-placeholder.png';
      if (!/^https?:/.test(photo)) photo = BASE + photo;
      if (link && !/^https?:/.test(link)) link = BASE + link;
      var meta = function (label, v) { return v ? '<p class="person__meta"><strong>' + label + ':</strong> ' + esc(v) + '</p>' : ''; };
      var links = col(r, 'lien_ket').split(';').map(function (x) {
        var i = x.indexOf('='); if (i < 0) return '';
        var u = x.slice(i + 1).trim();
        return '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(x.slice(0, i).trim()) + '</a>';
      }).join('');
      var email = col(r, 'email');
      return '<article class="person">' +
        '<img class="person__photo" src="' + esc(photo) + '" alt="' + esc(name) + '" loading="lazy">' +
        '<div>' +
          '<p class="person__name">' + (link ? '<a href="' + esc(link) + '"' + ext(link) + '>' + esc(name) + '</a>' : esc(name)) + '</p>' +
          (col(r, 'chuc_vu') ? '<p class="person__role">' + esc(col(r, 'chuc_vu')) + '</p>' : '') +
          (email ? '<p class="person__meta">' + (email.indexOf('@') > 0 ? '<a href="mailto:' + esc(email) + '">' + esc(email) + '</a>'
            : '<strong>Email:</strong> <span class="text-muted">' + esc(email) + '</span>') + '</p>' : '') +
          meta(T.peopleResearch, col(r, 'huong_nc')) +
          meta(T.peopleTeaching, col(r, 'mon_gd')) +
          (links ? '<div class="person__links">' + links + '</div>' : '') +
        '</div></article>';
    }).join('');
  }

  /* Biểu đồ cột chồng công bố khoa học từ cong-bo.csv:
     cột 1–2 = quốc tế (tạp chí, hội nghị), cột 3–4 = trong nước; bỏ qua dòng tổng (=) */
  function renderChart(host, rows) {
    rows = rows.filter(function (r) { return !/^#/.test(r[0].trim()) && r[0].trim().indexOf('=') !== 0; });
    rows.shift();
    var num = function (x) { return parseFloat(x) || 0; };
    var data = rows.map(function (r) {
      return { label: pick(r[0]).replace(/\s*\(\*\)/, '*'), intl: num(r[1]) + num(r[2]), dom: num(r[3]) + num(r[4]) };
    });
    var max = Math.max.apply(null, data.map(function (d) { return d.intl + d.dom; })) || 1;
    var px = function (v) { return Math.round(v / max * 170); };
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label', T.chartLabel + ': ' + data.map(function (d) { return d.label + ': ' + (d.intl + d.dom); }).join(', '));
    host.innerHTML =
      '<div class="chart__plot">' + data.map(function (d) {
        return '<div class="chart__col"><span class="chart__val">' + (d.intl + d.dom) + '</span>' +
          '<div class="chart__stack" style="height:' + px(d.intl + d.dom) + 'px">' +
          '<div class="chart__seg chart__seg--dom" style="height:' + px(d.dom) + 'px"></div>' +
          '<div class="chart__seg chart__seg--intl" style="height:' + px(d.intl) + 'px"></div></div></div>';
      }).join('') + '</div>' +
      '<div class="chart__x">' + data.map(function (d) { return '<span>' + esc(d.label) + '</span>'; }).join('') + '</div>' +
      '<div class="chart__key"><span><i style="background:var(--brand-600)"></i> ' + esc(T.chartIntl) + '</span>' +
      '<span><i style="background:var(--accent)"></i> ' + esc(T.chartDom) + '</span></div>' +
      (host.getAttribute('data-note') ? '<p class="chart__note">' + esc(host.getAttribute('data-note')) + '</p>' : '');
  }

  /* =====================================================================
     10. Biểu đồ cột từ dữ liệu bảng (CSV / Google Sheets)
     ---------------------------------------------------------------------
     <figure class="vchart" data-bars="ten" data-x="0" data-y="2,3,4" data-type="stack"></figure>
       data-bars       tên nguồn dữ liệu (giống data-table)
       data-x          cột nhãn trục ngang; nhiều cột nối bằng dấu phẩy ("0,1")
       data-y          các cột số liệu (mỗi cột một chuỗi màu)
       data-type       "stack" (cột chồng) hoặc "group" (cột cạnh nhau, mặc định)
       data-transpose  mỗi DÒNG là một chuỗi, các cột từ data-y là trục ngang
       data-unit       đơn vị hiển thị ("%"); data-max: giá trị lớn nhất trục dọc
       data-total      cột ghi tổng phía trên cột chồng
       data-label      ghi chú dưới biểu đồ
     Bảng số liệu gốc luôn đặt ngay dưới biểu đồ (phương án thay thế cho
     người dùng trình đọc màn hình và khi in).
     ===================================================================== */
  var SERIES = ['#1f5ca9', '#00afef', '#e8833a', '#7a4fb5'];

  function num(v) {
    v = String(v || '').replace('%', '').replace(',', '.').trim();
    return v === '' || isNaN(+v) ? null : +v;
  }
  function fmtVal(v, unit) {
    var s = (Math.round(v * 100) / 100).toString();
    if (LANG === 'vi') s = s.replace('.', ',');
    return s + (unit || '');
  }

  function renderBars(host, rows) {
    rows = rows.filter(function (r) { return !/^#/.test(r[0].trim()) && r[0].trim().indexOf('=') !== 0; });
    var head = rows.shift();
    var xs = (host.getAttribute('data-x') || '0').split(',').map(Number);
    var ys = (host.getAttribute('data-y') || '1').split(',').map(Number);
    var stack = host.getAttribute('data-type') === 'stack';
    var unit = host.getAttribute('data-unit') || '';
    var totalCol = host.hasAttribute('data-total') ? +host.getAttribute('data-total') : -1;
    var cats, series;
    if (host.hasAttribute('data-transpose')) {
      cats = ys.map(function (c) { return pick(head[c]); });
      series = rows.map(function (r) {
        return { name: pick(r[0]), vals: ys.map(function (c) { return num(r[c]); }) };
      });
    } else {
      cats = rows.map(function (r) { return xs.map(function (c) { return pick(r[c]); }).join(' · '); });
      series = ys.map(function (c) {
        return { name: pick(head[c]), vals: rows.map(function (r) { return num(r[c]); }) };
      });
    }
    var totals = cats.map(function (_, i) {
      if (totalCol >= 0 && !host.hasAttribute('data-transpose')) return num(rows[i][totalCol]);
      return series.reduce(function (s, se) { return s + (se.vals[i] || 0); }, 0);
    });
    var peak = stack ? Math.max.apply(null, totals)
      : Math.max.apply(null, series.map(function (s) { return Math.max.apply(null, s.vals.map(function (v) { return v || 0; })); }));
    var step = niceStep((+host.getAttribute('data-max') || peak) / 4);
    var max = +host.getAttribute('data-max') || Math.max(step, Math.ceil(peak / step) * step);
    var ticks = Math.round(max / step);

    /* Vẽ theo bề rộng thật của khung để chữ không bị thu nhỏ trên điện thoại */
    var L = 44, R = 8, T = 22;
    /* mỗi nhóm cột rộng tối thiểu ~78px; hẹp hơn thì khung cho vuốt ngang */
    var W = Math.max(300, (host.clientWidth || 720) - 34, L + R + cats.length * 78);
    var band = (W - L - R) / cats.length;
    var perLine = Math.max(6, Math.floor(band / 6.6));
    var wrap = function (t) {                       /* xuống dòng nhãn trục ngang, tối đa 3 dòng */
      var out = [''], words = t.split(' ');
      words.forEach(function (w) {
        var cur = out[out.length - 1];
        if (cur && (cur + ' ' + w).length > perLine && out.length < 3) out.push(w);
        else out[out.length - 1] = cur ? cur + ' ' + w : w;
      });
      return out;
    };
    var labels = cats.map(wrap);
    var lines = Math.max.apply(null, labels.map(function (l) { return l.length; }));
    var B = 24 + lines * 14, H = (W < 500 ? 230 : 260) + (lines - 1) * 14;
    var pw = W - L - R, ph = H - T - B;
    var n = series.length, gap = 2;
    var barW = stack ? Math.min(56, band * 0.56) : Math.min(28, (band * 0.74 - gap * (n - 1)) / n);
    var y = function (v) { return T + ph - (v / max) * ph; };
    var svg = [];
    for (var t = 0; t <= ticks; t++) {                  /* lưới ngang mờ */
      var tv = step * t, ty = y(tv);
      svg.push('<line x1="' + L + '" x2="' + (W - R) + '" y1="' + ty + '" y2="' + ty + '" class="vchart__grid"/>' +
        '<text x="' + (L - 6) + '" y="' + (ty + 4) + '" class="vchart__tick" text-anchor="end">' + fmtVal(tv, unit) + '</text>');
    }
    cats.forEach(function (cat, i) {
      var cx = L + band * i + band / 2;
      var acc = 0;
      series.forEach(function (se, k) {
        var v = se.vals[i];
        if (v === null) return;
        var x = stack ? cx - barW / 2 : cx - (n * barW + (n - 1) * gap) / 2 + k * (barW + gap);
        var y0 = stack ? y(acc + v) : y(v), hgt = (v / max) * ph;
        if (stack && k < n - 1 && hgt > gap) hgt -= gap;          /* khe 2px giữa các đoạn chồng */
        svg.push('<rect class="vchart__bar" x="' + x.toFixed(1) + '" y="' + y0.toFixed(1) + '" width="' + barW.toFixed(1) +
          '" height="' + Math.max(hgt, 0).toFixed(1) + '" rx="3" fill="' + SERIES[k % SERIES.length] + '" tabindex="0" ' +
          'data-tip="' + esc(cat + ' — ' + se.name + ': ' + fmtVal(v, unit)) + '"/>');
        if (!stack && cats.length * n <= 12 && barW >= 22) {
          svg.push('<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y0 - 5).toFixed(1) + '" class="vchart__val" text-anchor="middle">' + fmtVal(v, unit) + '</text>');
        }
        acc += v;
      });
      if (stack && totals[i] !== null) {
        svg.push('<text x="' + cx + '" y="' + (y(acc) - 6) + '" class="vchart__val" text-anchor="middle">' + fmtVal(totals[i], unit) + '</text>');
      }
      svg.push('<text x="' + cx + '" y="' + (H - B + 17) + '" class="vchart__cat" text-anchor="middle">' +
        labels[i].map(function (l, j) { return j ? '<tspan x="' + cx + '" dy="14">' + esc(l) + '</tspan>' : esc(l); }).join('') + '</text>');
    });
    svg.push('<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(0) + '" y2="' + y(0) + '" class="vchart__axis"/>');

    var legend = series.length > 1 ? '<ul class="vchart__legend">' + series.map(function (se, k) {
      return '<li><i style="background:' + SERIES[k % SERIES.length] + '"></i>' + esc(se.name) + '</li>';
    }).join('') + '</ul>' : '';
    var label = host.getAttribute('aria-label') || '';
    host.innerHTML = legend +
      '<div class="vchart__plot"><svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="img" aria-label="' + esc(label) + '">' + svg.join('') + '</svg>' +
      '<div class="vchart__tip" hidden></div></div>' +
      (host.getAttribute('data-label') ? '<figcaption>' + esc(host.getAttribute('data-label')) + '</figcaption>' : '');

    var tip = host.querySelector('.vchart__tip'), plot = host.querySelector('.vchart__plot');
    var show = function (el) {
      tip.textContent = el.getAttribute('data-tip'); tip.hidden = false;
      var pr = plot.getBoundingClientRect(), br = el.getBoundingClientRect();
      tip.style.left = Math.min(Math.max(br.left - pr.left + br.width / 2, 70), pr.width - 70) + 'px';
      tip.style.top = (br.top - pr.top - 8) + 'px';
    };
    host.querySelectorAll('.vchart__bar').forEach(function (b) {
      b.addEventListener('mouseenter', function () { show(b); });
      b.addEventListener('focus', function () { show(b); });
      b.addEventListener('mouseleave', function () { tip.hidden = true; });
      b.addEventListener('blur', function () { tip.hidden = true; });
    });
  }
  function niceStep(v) {
    if (!v) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v))), m = v / p;
    return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
  }

  /* =====================================================================
     11. Tin tức & hình ảnh sinh viên (data-news="tin-tuc")
     Cột: ngay, nhom (dau-vao | hoat-dong | dau-ra), tieu_de, tom_tat, anh, lien_ket
       data-limit="3"  chỉ hiện N tin mới nhất, không có nút lọc (dùng ở trang chủ)
     ===================================================================== */
  var NEWS_GROUPS = {
    vi: { all: 'Tất cả', 'dau-vao': 'Chào đón tân sinh viên', 'hoat-dong': 'Hoạt động sinh viên', 'dau-ra': 'Sinh viên tốt nghiệp',
          more: 'Xem chi tiết', empty: 'Đang cập nhật tin và hình ảnh cho mục này.', photos: 'ảnh' },
    en: { all: 'All', 'dau-vao': 'Welcoming new students', 'hoat-dong': 'Student activities', 'dau-ra': 'Graduates',
          more: 'Read more', empty: 'News and photos for this section are being updated.', photos: 'photos' }
  };
  function assetUrl(u) {
    u = (u || '').trim();
    return /^(https?:|\/)/.test(u) ? u : BASE + u;
  }
  function renderNews(host, rows) {
    var G = NEWS_GROUPS[LANG];
    rows = rows.filter(function (r) { return !/^#/.test(r[0].trim()); });
    var head = rows.shift().map(function (h) { return h.trim(); });
    var col = function (r, k) { var i = head.indexOf(k); return i < 0 ? '' : (r[i] || '').trim(); };
    var items = rows.filter(function (r) { return col(r, 'tieu_de'); });
    var limit = +host.getAttribute('data-limit') || 0;
    if (limit) items = items.slice(0, limit);

    var card = function (r) {
      var grp = col(r, 'nhom'), imgs = col(r, 'anh').split(';').map(function (s) { return s.trim(); }).filter(Boolean);
      var link = col(r, 'lien_ket'), title = pick(col(r, 'tieu_de'));
      var href = link ? assetUrl(link) : (imgs[0] ? assetUrl(imgs[0]) : '');
      var cover = imgs[0] ? '<a class="news__cover" href="' + esc(href) + '"' + (link ? ext(href) : ' target="_blank" rel="noopener"') + '>' +
        '<img src="' + esc(assetUrl(imgs[0])) + '" alt="' + esc(title) + '" loading="lazy">' +
        (imgs.length > 1 ? '<span class="news__count">' + imgs.length + ' ' + G.photos + '</span>' : '') + '</a>' : '';
      var thumbs = imgs.length > 1 ? '<div class="news__thumbs">' + imgs.slice(1, 5).map(function (u) {
        return '<a href="' + esc(assetUrl(u)) + '" target="_blank" rel="noopener"><img src="' + esc(assetUrl(u)) + '" alt="" loading="lazy"></a>';
      }).join('') + '</div>' : '';
      return '<article class="news__item" data-group="' + esc(grp) + '">' + cover +
        '<div class="news__body"><p class="news__meta"><span class="badge news__badge news__badge--' + esc(grp) + '">' + esc(G[grp] || grp) + '</span>' +
        (col(r, 'ngay') ? '<time>' + esc(col(r, 'ngay')) + '</time>' : '') + '</p>' +
        '<h3>' + esc(title) + '</h3>' +
        (col(r, 'tom_tat') ? '<p>' + esc(pick(col(r, 'tom_tat'))) + '</p>' : '') + thumbs +
        (link ? '<a class="link-arrow" href="' + esc(assetUrl(link)) + '"' + ext(assetUrl(link)) + '>' + G.more + '</a>' : '') +
        '</div></article>';
    };

    var tabs = limit ? '' : '<div class="news__tabs" role="tablist">' + ['all', 'dau-vao', 'hoat-dong', 'dau-ra'].map(function (g) {
      return '<button type="button" role="tab" data-filter="' + g + '" aria-selected="false">' + G[g] + '</button>';
    }).join('') + '</div>';
    host.innerHTML = tabs + '<div class="news__grid">' + items.map(card).join('') + '</div>' +
      '<p class="news__empty text-muted" hidden>' + G.empty + '</p>';
    if (limit) return;

    var apply = function (g) {
      var shown = 0;
      host.querySelectorAll('.news__item').forEach(function (a) {
        var on = g === 'all' || a.getAttribute('data-group') === g;
        a.hidden = !on; if (on) shown++;
      });
      host.querySelectorAll('[data-filter]').forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-filter') === g ? 'true' : 'false'); });
      host.querySelector('.news__empty').hidden = shown > 0;
    };
    host.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.getAttribute('data-filter'));
        if (history.replaceState) history.replaceState(null, '', b.getAttribute('data-filter') === 'all' ? location.pathname : '#' + b.getAttribute('data-filter'));
      });
    });
    var h = location.hash.slice(1);
    apply(G[h] && h !== 'more' && h !== 'empty' && h !== 'photos' ? h : 'all');
  }

  function renderData() {
    document.querySelectorAll('[data-chart]').forEach(function (host) {
      loadData(host.getAttribute('data-chart')).then(function (rows) { renderChart(host, rows); }).catch(function () {});
    });
    var fail = function (host, name) {
      return function () {
        host.innerHTML = '<p class="text-muted">' + esc(T.dataError) + ' (<a href="' + esc(BASE + 'data/' + name + '.csv') + '">' + esc(name) + '.csv</a>)</p>';
      };
    };
    document.querySelectorAll('[data-table]').forEach(function (host) {
      var name = host.getAttribute('data-table');
      var syl = host.hasAttribute('data-syllabus') ? loadData('de-cuong').then(syllabusMap, function () { return {}; }) : Promise.resolve(null);
      Promise.all([loadData(name), syl]).then(function (res) { renderTable(host, res[0], res[1]); }).catch(fail(host, name));
    });
    document.querySelectorAll('[data-people]').forEach(function (host) {
      var name = host.getAttribute('data-people');
      loadData(name).then(function (rows) { renderPeople(host, rows); }).catch(fail(host, name));
    });
    document.querySelectorAll('[data-bars]').forEach(function (host) {
      loadData(host.getAttribute('data-bars')).then(function (rows) {
        var draw = function () { renderBars(host, rows.map(function (r) { return r.slice(); })); };
        draw();
        var w = host.clientWidth, timer;
        window.addEventListener('resize', function () {
          clearTimeout(timer);
          timer = setTimeout(function () { if (Math.abs(host.clientWidth - w) > 40) { w = host.clientWidth; draw(); } }, 200);
        });
      }).catch(function () { host.hidden = true; });
    });
    document.querySelectorAll('[data-news]').forEach(function (host) {
      var name = host.getAttribute('data-news');
      loadData(name).then(function (rows) { renderNews(host, rows); }).catch(fail(host, name));
    });
  }

  function init() {
    if (COMMON.hidePending) document.documentElement.classList.add('hide-pending');
    buildHeader();
    buildFooter();
    renderData();
    renderEmbeds();
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
