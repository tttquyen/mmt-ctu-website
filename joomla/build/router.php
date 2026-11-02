<?php
/* Bộ định tuyến cho máy chủ thử nghiệm `php -S` (chỉ dùng khi build, không đưa lên host).
   Sửa SCRIPT_NAME/PHP_SELF để Joomla tính đúng đường dẫn gốc khi URL có dạng index.php/xxx. */
$root = $_SERVER['DOCUMENT_ROOT'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
foreach (['/api/index.php', '/administrator/index.php', '/index.php'] as $script) {
    if ($path === $script || str_starts_with($path, $script . '/')) {
        $_SERVER['SCRIPT_NAME']     = $script;
        $_SERVER['PHP_SELF']        = $path;
        $_SERVER['SCRIPT_FILENAME'] = $root . $script;
        $_SERVER['PATH_INFO']       = substr($path, strlen($script));
        chdir(dirname($root . $script));
        require $root . $script;
        return true;
    }
}
if ($path === '/' ) {
    $_SERVER['SCRIPT_NAME'] = '/index.php'; $_SERVER['PHP_SELF'] = '/index.php';
    $_SERVER['SCRIPT_FILENAME'] = $root . '/index.php';
    chdir($root); require $root . '/index.php'; return true;
}
/* Giả lập .htaccess của Joomla: tệp không tồn tại -> index.php (để thử chuyển hướng URL cũ) */
if (!is_file($root . $path) && !is_dir($root . $path)) {
    $_SERVER['SCRIPT_NAME'] = '/index.php'; $_SERVER['PHP_SELF'] = '/index.php';
    $_SERVER['SCRIPT_FILENAME'] = $root . '/index.php';
    chdir($root); require $root . '/index.php'; return true;
}
return false;
