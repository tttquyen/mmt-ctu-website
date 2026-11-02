/* ==========================================================================
   Khoa Mạng máy tính & Truyền thông — site.js cho template Joomla "mmt"
   --------------------------------------------------------------------------
   Header, menu và chân trang do Joomla dựng (Menus / Modules). Tệp này chỉ:
     - mở/đóng menu trên di động, nút lên đầu trang
     - tìm kiếm phía trình duyệt (không cần máy chủ, bỏ dấu tiếng Việt)
     - dựng bảng / thẻ nhân sự / biểu đồ từ tệp CSV (images/mmt/data/*.csv)
     - accordion, hiệu ứng xuất hiện, Google Analytics
   Template truyền cấu hình qua window.MMT = { lang, base, pages, hidePending, analyticsId }.
   ========================================================================== */
(function () {
  'use strict';

  var MMT = window.MMT || {};

  var COMMON = {
    analyticsId: MMT.analyticsId || '',
    hidePending: MMT.hidePending !== false,

    /* Nguồn Google Sheets (CSV công bố lên web) thay cho tệp CSV cục bộ.
       Để trống = dùng tệp <base>data/<ten>.csv */
    dataSources: {}
  };

  var CONFIG = {
    vi: {
      searchSearching: 'Đang tìm…',
      searchNone: 'Không tìm thấy nội dung nào phù hợp với từ khoá',
      searchCount: function (n, q) { return 'Tìm thấy ' + n + ' trang có chứa “' + q + '”'; },
      syllabusTitle: 'Đề cương chi tiết học phần (PDF)',
      openLink: 'Xem',
      dataError: 'Chưa tải được dữ liệu. Vui lòng tải lại trang hoặc xem tệp gốc',
      peopleResearch: 'Hướng NC',
      peopleTeaching: 'Môn GD',
      chartLabel: 'Biểu đồ số công bố khoa học theo năm',
      chartIntl: 'Công bố quốc tế',
      chartDom: 'Công bố trong nước',
      pages: MMT.pages || []
    },
    en: {
      searchSearching: 'Searching…',
      searchNone: 'No page matches the keyword',
      searchCount: function (n, q) { return n + ' page(s) contain “' + q + '”'; },
      syllabusTitle: 'Course syllabus (PDF)',
      openLink: 'Open',
      dataError: 'The data could not be loaded. Please reload the page or open the source file',
      peopleResearch: 'Research',
      peopleTeaching: 'Teaching',
      chartLabel: 'Publications per year',
      chartIntl: 'International publications',
      chartDom: 'Domestic publications',
      pages: MMT.pages || []
    }
  };

  var LANG = MMT.lang === 'en' ? 'en' : 'vi';
  var T = CONFIG[LANG];
  var BASE = MMT.base || '';

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

  function wireToTop() {
    var toTop = document.querySelector('.to-top');
    if (!toTop) return;
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

  function loadData(name) {
    if (dataCache[name]) return dataCache[name];
    var local = BASE + 'data/' + name + '.csv';
    var remote = (COMMON.dataSources || {})[name];
    var get = function (url) {
      return fetch(url, { cache: 'no-cache' }).then(function (r) {
        if (!r.ok) throw new Error(r.status);
        return r.text();
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
  }

  function init() {
    if (COMMON.hidePending) document.documentElement.classList.add('hide-pending');
    wireNav();
    wireSearch();
    wireToTop();
    renderData();
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
