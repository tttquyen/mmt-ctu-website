<?php
/**
 * Trình cài đặt website Khoa Mạng máy tính và Truyền thông (Joomla 5).
 *
 * Joomla tự chuyển tới tệp này khi chưa có configuration.php. Trình cài:
 *   1. kiểm tra máy chủ (PHP, MySQL/MariaDB)
 *   2. nạp CSDL (bài viết, menu, module đã dựng sẵn) với tiền tố bảng tuỳ chọn
 *   3. đặt tài khoản quản trị mới, ghi configuration.php
 *   4. tự xoá thư mục installation/
 *
 * @license GNU General Public License version 2 or later
 */

declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '1');
@set_time_limit(300);

const SRC_PREFIX = 'mmt_';
const MIN_PHP    = '8.1.0';

$root    = dirname(__DIR__);
$sqlFile = __DIR__ . '/mmt-joomla.sql';
$cfgDist = __DIR__ . '/configuration.php-dist';

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}

function page(string $title, string $body): never
{
    echo '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<meta name="robots" content="noindex"><title>' . h($title) . '</title><style>'
        . 'body{margin:0;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:#eef4fb;color:#0b203b}'
        . 'header{background:linear-gradient(100deg,#0b203b,#1f5ca9);color:#fff;padding:22px 16px}header h1{margin:0 auto;max-width:760px;font-size:1.3rem}'
        . 'header p{margin:4px auto 0;max-width:760px;color:#9fd8f5;font-size:.9rem}main{max-width:760px;margin:24px auto;padding:0 16px}'
        . '.box{background:#fff;border:1px solid #d5e2f1;border-radius:10px;padding:20px 22px;margin-bottom:18px}'
        . 'h2{font-size:1.05rem;margin:0 0 12px;color:#1f5ca9}label{display:block;font-weight:600;margin:12px 0 4px}'
        . 'input[type=text],input[type=password],input[type=email]{width:100%;box-sizing:border-box;padding:9px 11px;border:1px solid #b9cbe0;border-radius:6px;font:inherit}'
        . '.hint{font-size:.85rem;color:#4b6382;margin:3px 0 0}.row{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}@media(max-width:600px){.row{grid-template-columns:1fr}}'
        . 'button{background:#1f5ca9;color:#fff;border:0;border-radius:6px;padding:11px 22px;font:inherit;font-weight:600;cursor:pointer}button:hover{background:#174a8a}'
        . 'table{border-collapse:collapse;width:100%}td{padding:5px 8px;border-bottom:1px solid #e5edf6}.ok{color:#11804a;font-weight:600}.bad{color:#b42318;font-weight:600}'
        . '.err{background:#fdecea;border-left:4px solid #b42318;padding:12px 16px;border-radius:6px;margin-bottom:18px}.done{background:#e8f6ee;border-left:4px solid #11804a;padding:12px 16px;border-radius:6px}'
        . 'code{background:#eef4fb;padding:1px 5px;border-radius:4px}.chk{font-weight:400;display:flex;gap:8px;align-items:flex-start}'
        . '</style></head><body><header><h1>Cài đặt website Khoa Mạng máy tính và Truyền thông</h1><p>Joomla 5 · Đại học Cần Thơ</p></header><main>'
        . $body . '</main></body></html>';
    exit;
}

/* ----------------------------------------------------------------------
   Chặn chạy lại khi site đã cài
   ---------------------------------------------------------------------- */
if (is_file($root . '/configuration.php') && filesize($root . '/configuration.php') > 10) {
    page('Đã cài đặt', '<div class="box"><p>Website đã được cài đặt (đã có <code>configuration.php</code>).</p>'
        . '<p>Hãy <strong>xoá thư mục <code>installation/</code></strong> trên host để website hoạt động, rồi mở lại trang chủ.</p></div>');
}
if (!is_file($sqlFile) || !is_file($cfgDist)) {
    page('Thiếu tệp', '<div class="err">Thiếu tệp <code>installation/mmt-joomla.sql</code> hoặc <code>installation/configuration.php-dist</code>. Hãy tải lên lại đầy đủ gói cài đặt.</div>');
}

/* ----------------------------------------------------------------------
   Kiểm tra máy chủ
   ---------------------------------------------------------------------- */
$checks = [
    'PHP ' . MIN_PHP . ' trở lên (đang có ' . PHP_VERSION . ')' => version_compare(PHP_VERSION, MIN_PHP, '>='),
    'Tiện ích mysqli'                    => extension_loaded('mysqli'),
    'Tiện ích json, simplexml, dom'      => extension_loaded('json') && extension_loaded('simplexml') && extension_loaded('dom'),
    'Tiện ích mbstring'                  => extension_loaded('mbstring'),
    'Tiện ích gd (xử lý ảnh)'            => extension_loaded('gd'),
    'Tiện ích zip (cài phần mở rộng)'    => class_exists('ZipArchive'),
    'Ghi được vào thư mục gốc website'   => is_writable($root),
    'Ghi được vào tmp/ và administrator/logs/' => is_writable($root . '/tmp') && is_writable($root . '/administrator/logs'),
];
$required = ['Tiện ích mysqli', 'Tiện ích json, simplexml, dom', 'Ghi được vào thư mục gốc website'];
$fatal    = !$checks[array_key_first($checks)];
foreach ($required as $k) {
    $fatal = $fatal || !$checks[$k];
}

$checkHtml = '<div class="box"><h2>1. Kiểm tra máy chủ</h2><table>';
foreach ($checks as $label => $ok) {
    $checkHtml .= '<tr><td>' . h($label) . '</td><td class="' . ($ok ? 'ok">Đạt' : 'bad">Chưa đạt') . '</td></tr>';
}
$checkHtml .= '</table>' . ($fatal ? '<p class="bad">Máy chủ chưa đáp ứng yêu cầu bắt buộc. Liên hệ nhà cung cấp host để nâng cấp PHP (8.1 trở lên) hoặc bật tiện ích còn thiếu.</p>' : '') . '</div>';

if ($fatal) {
    page('Kiểm tra máy chủ', $checkHtml);
}

/* ----------------------------------------------------------------------
   Xử lý cài đặt
   ---------------------------------------------------------------------- */
$v = [
    'db_host' => 'localhost', 'db_name' => '', 'db_user' => '', 'db_pass' => '', 'db_prefix' => SRC_PREFIX,
    'site_name' => 'Khoa Mạng máy tính và Truyền thông', 'admin_name' => 'Quản trị website',
    'admin_user' => '', 'admin_email' => '', 'admin_pass' => '', 'admin_pass2' => '', 'rewrite' => '', 'https' => '',
];
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($v as $k => $_) {
        $v[$k] = trim((string) ($_POST[$k] ?? ''));
    }
    $v['db_pass']    = (string) ($_POST['db_pass'] ?? '');
    $v['admin_pass'] = (string) ($_POST['admin_pass'] ?? '');
    $v['admin_pass2'] = (string) ($_POST['admin_pass2'] ?? '');

    if ($v['db_name'] === '' || $v['db_user'] === '') {
        $errors[] = 'Nhập tên cơ sở dữ liệu và tài khoản cơ sở dữ liệu.';
    }
    if (!preg_match('/^[a-z][a-z0-9]{1,14}_$/', $v['db_prefix'])) {
        $errors[] = 'Tiền tố bảng gồm chữ thường và số, bắt đầu bằng chữ, kết thúc bằng dấu gạch dưới (vd. mmt_).';
    }
    if (!preg_match('/^[\p{L}0-9._@-]{3,100}$/u', $v['admin_user'])) {
        $errors[] = 'Tên đăng nhập quản trị cần 3–100 ký tự, không có khoảng trắng.';
    }
    if (!filter_var($v['admin_email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Email quản trị không hợp lệ.';
    }
    if (mb_strlen($v['admin_pass']) < 12) {
        $errors[] = 'Mật khẩu quản trị cần ít nhất 12 ký tự.';
    } elseif ($v['admin_pass'] !== $v['admin_pass2']) {
        $errors[] = 'Hai lần nhập mật khẩu quản trị không khớp.';
    }

    $db = null;
    if (!$errors) {
        mysqli_report(MYSQLI_REPORT_OFF);
        $host = $v['db_host'];
        $port = null;
        if (preg_match('/^(.+):(\d+)$/', $host, $m)) {
            [$host, $port] = [$m[1], (int) $m[2]];
        }
        $db = @new mysqli($host, $v['db_user'], $v['db_pass'], $v['db_name'], $port);
        if ($db->connect_errno) {
            $errors[] = 'Không kết nối được cơ sở dữ liệu: ' . $db->connect_error;
        } else {
            $db->set_charset('utf8mb4');
            $res = $db->query("SHOW TABLES LIKE '" . $db->real_escape_string($v['db_prefix']) . "%'");
            if ($res && $res->num_rows > 0 && empty($_POST['overwrite'])) {
                $errors[] = 'Cơ sở dữ liệu đã có bảng với tiền tố "' . $v['db_prefix'] . '". Đổi tiền tố khác, hoặc đánh dấu ô "Xoá các bảng cũ" bên dưới.';
            }
        }
    }

    if (!$errors) {
        /* Xoá bảng cũ (nếu được phép) */
        if (!empty($_POST['overwrite'])) {
            $db->query('SET FOREIGN_KEY_CHECKS=0');
            $res = $db->query("SHOW TABLES LIKE '" . $db->real_escape_string($v['db_prefix']) . "%'");
            while ($res && ($row = $res->fetch_row())) {
                $db->query('DROP TABLE `' . str_replace('`', '', $row[0]) . '`');
            }
        }

        /* Nạp CSDL: mỗi câu lệnh kết thúc bằng ";" ở cuối dòng (định dạng mysqldump) */
        $fh   = fopen($sqlFile, 'rb');
        $stmt = '';
        $n    = 0;
        $db->query("SET NAMES utf8mb4");
        $db->query("SET SESSION sql_mode=''");
        while (($line = fgets($fh)) !== false) {
            if ($stmt === '' && (str_starts_with($line, '--') || trim($line) === '')) {
                continue;
            }
            $stmt .= $line;
            if (str_ends_with(rtrim($line), ';')) {
                if ($v['db_prefix'] !== SRC_PREFIX) {
                    $stmt = str_replace('`' . SRC_PREFIX, '`' . $v['db_prefix'], $stmt);
                }
                if (!$db->query($stmt)) {
                    $errors[] = 'Lỗi khi nạp CSDL (câu lệnh ' . ($n + 1) . '): ' . $db->error;
                    break;
                }
                $stmt = '';
                $n++;
            }
        }
        fclose($fh);
    }

    if (!$errors) {
        $p = $db->real_escape_string($v['db_prefix']);

        /* Tài khoản quản trị: thay tài khoản dựng sẵn bằng thông tin mới */
        $hash  = password_hash($v['admin_pass'], PASSWORD_BCRYPT);
        $su    = $db->query("SELECT u.id FROM `{$p}users` u JOIN `{$p}user_usergroup_map` m ON m.user_id=u.id WHERE m.group_id=8 ORDER BY u.id LIMIT 1")->fetch_row();
        $stmtU = $db->prepare("UPDATE `{$p}users` SET name=?, username=?, email=?, password=?, block=0, requireReset=0, lastvisitDate=NULL, registerDate=NOW() WHERE id=?");
        $stmtU->bind_param('ssssi', $v['admin_name'], $v['admin_user'], $v['admin_email'], $hash, $su[0]);
        $stmtU->execute();
        foreach (['session', 'user_keys', 'action_logs'] as $t) {
            $db->query("DELETE FROM `{$p}{$t}`");
        }

        /* configuration.php */
        $cfg = file_get_contents($cfgDist);
        $rep = [
            '{{SITENAME}}' => addcslashes($v['site_name'], "'\\"),
            '{{DBHOST}}'   => addcslashes($v['db_host'], "'\\"),
            '{{DBUSER}}'   => addcslashes($v['db_user'], "'\\"),
            '{{DBPASS}}'   => addcslashes($v['db_pass'], "'\\"),
            '{{DBNAME}}'   => addcslashes($v['db_name'], "'\\"),
            '{{DBPREFIX}}' => $v['db_prefix'],
            '{{SECRET}}'   => bin2hex(random_bytes(16)),
            '{{MAILFROM}}' => addcslashes($v['admin_email'], "'\\"),
            '{{LOGPATH}}'  => addcslashes($root . '/administrator/logs', "'\\"),
            '{{TMPPATH}}'  => addcslashes($root . '/tmp', "'\\"),
            '{{REWRITE}}'  => $v['rewrite'] ? 'true' : 'false',
            '{{FORCESSL}}' => $v['https'] ? '2' : '0',
        ];
        if (file_put_contents($root . '/configuration.php', strtr($cfg, $rep)) === false) {
            $errors[] = 'Không ghi được configuration.php. Cấp quyền ghi cho thư mục gốc website rồi thử lại.';
        } else {
            @chmod($root . '/configuration.php', 0444);
        }
    }

    if (!$errors) {
        $notes = [];
        if ($v['rewrite']) {
            if (is_file($root . '/.htaccess')) {
                $notes[] = 'Đã có tệp .htaccess sẵn trên host, trình cài không ghi đè. Hãy so sánh với htaccess.txt của Joomla.';
            } elseif (!@rename($root . '/htaccess.txt', $root . '/.htaccess')) {
                $notes[] = 'Không đổi tên được htaccess.txt thành .htaccess — hãy đổi tên thủ công.';
            }
        }

        /* Tự xoá thư mục installation/ */
        $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(__DIR__, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($it as $f) {
            $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname());
        }
        @rmdir(__DIR__);
        if (is_dir(__DIR__)) {
            $notes[] = '<strong>Chưa xoá được thư mục <code>installation/</code>. Hãy xoá thư mục này trên host</strong> — website sẽ không chạy khi thư mục còn tồn tại.';
        }

        $base = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/\\');
        page('Cài đặt xong', '<div class="box done"><h2>Cài đặt thành công</h2>'
            . '<p>Trang chủ: <a href="' . h($base . '/') . '">' . h($base . '/') . '</a><br>'
            . 'Trang quản trị: <a href="' . h($base . '/administrator/') . '">' . h($base . '/administrator/') . '</a> — đăng nhập bằng <strong>' . h($v['admin_user']) . '</strong>.</p>'
            . ($notes ? '<ul><li>' . implode('</li><li>', $notes) . '</li></ul>' : '')
            . '</div>');
    }
}

/* ----------------------------------------------------------------------
   Biểu mẫu
   ---------------------------------------------------------------------- */
$err = $errors ? '<div class="err"><strong>Chưa cài được:</strong><ul><li>' . implode('</li><li>', array_map('h', $errors)) . '</li></ul></div>' : '';
$val = fn(string $k) => h($v[$k]);
$chk = fn(string $k) => $v[$k] ? ' checked' : '';

page('Cài đặt', $err . $checkHtml . '<form method="post" autocomplete="off">
<div class="box"><h2>2. Cơ sở dữ liệu</h2>
<p class="hint">Tạo trước một CSDL MySQL/MariaDB trống và tài khoản có toàn quyền trên CSDL đó (trong cPanel: MySQL Databases).</p>
<div class="row">
 <div><label for="db_host">Máy chủ CSDL</label><input type="text" id="db_host" name="db_host" value="' . $val('db_host') . '" required><p class="hint">Thường là localhost</p></div>
 <div><label for="db_name">Tên CSDL</label><input type="text" id="db_name" name="db_name" value="' . $val('db_name') . '" required></div>
 <div><label for="db_user">Tài khoản CSDL</label><input type="text" id="db_user" name="db_user" value="' . $val('db_user') . '" required></div>
 <div><label for="db_pass">Mật khẩu CSDL</label><input type="password" id="db_pass" name="db_pass" value=""></div>
 <div><label for="db_prefix">Tiền tố bảng</label><input type="text" id="db_prefix" name="db_prefix" value="' . $val('db_prefix') . '" required><p class="hint">Giữ mmt_ nếu CSDL trống</p></div>
</div>
<label class="chk"><input type="checkbox" name="overwrite" value="1"> Xoá các bảng cũ có cùng tiền tố (nếu có)</label>
</div>
<div class="box"><h2>3. Website và tài khoản quản trị</h2>
<label for="site_name">Tên website</label><input type="text" id="site_name" name="site_name" value="' . $val('site_name') . '" required>
<div class="row">
 <div><label for="admin_name">Họ tên quản trị</label><input type="text" id="admin_name" name="admin_name" value="' . $val('admin_name') . '" required></div>
 <div><label for="admin_email">Email quản trị</label><input type="email" id="admin_email" name="admin_email" value="' . $val('admin_email') . '" required></div>
 <div><label for="admin_user">Tên đăng nhập</label><input type="text" id="admin_user" name="admin_user" value="' . $val('admin_user') . '" required></div>
 <div></div>
 <div><label for="admin_pass">Mật khẩu (≥ 12 ký tự)</label><input type="password" id="admin_pass" name="admin_pass" required minlength="12"></div>
 <div><label for="admin_pass2">Nhập lại mật khẩu</label><input type="password" id="admin_pass2" name="admin_pass2" required minlength="12"></div>
</div>
</div>
<div class="box"><h2>4. Tuỳ chọn</h2>
<label class="chk"><input type="checkbox" name="rewrite" value="1"' . $chk('rewrite') . '> <span>URL gọn không có <code>index.php</code> (vd. <code>/nhan-su</code>) và chuyển hướng địa chỉ cũ <code>/mmt/*.html</code>.<br><span class="hint">Cần máy chủ Apache có mod_rewrite (đa số host cPanel). Trình cài sẽ đổi htaccess.txt thành .htaccess.</span></span></label>
<label class="chk"><input type="checkbox" name="https" value="1"' . $chk('https') . '> <span>Bắt buộc HTTPS cho toàn site <span class="hint">(chỉ chọn khi tên miền đã có chứng chỉ SSL)</span></span></label>
</div>
<p><button type="submit">Cài đặt</button></p>
</form>');
