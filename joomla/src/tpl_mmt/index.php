<?php
/**
 * Template "mmt" — Khoa Mạng máy tính và Truyền thông, Đại học Cần Thơ.
 *
 * Giữ nguyên giao diện website tĩnh (main.css). Các phần sửa được trong
 * trang quản trị:
 *   - Menu chính, liên kết đầu trang, dải "Nổi bật": Menus
 *   - Chân trang (thông tin liên hệ, ban lãnh đạo, liên kết): Modules, vị trí "footer"
 *   - Điện thoại, Google Analytics, ẩn/hiện mục "Đang cập nhật": Template Styles > mmt
 *   - Bảng dữ liệu / thẻ nhân sự: tệp CSV trong images/mmt/data (Media)
 *
 * @license GNU General Public License version 2 or later
 */

defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;

/** @var \Joomla\CMS\Document\HtmlDocument $this */

$app    = Factory::getApplication();
$tag    = $app->getLanguage()->getTag();
$isEn   = str_starts_with($tag, 'en');
$menu   = $app->getMenu();
$active = $menu->getActive();
$home   = $menu->getDefault($tag);
$params = $this->params;

$homeUrl  = $home ? Route::_('index.php?Itemid=' . $home->id) : Uri::base(true) . '/';
$dataBase = Uri::root(true) . '/' . trim($params->get('dataFolder', 'images/mmt/'), '/') . '/';
$media    = Uri::root(true) . '/media/templates/site/mmt/';
$phone    = trim($params->get('phone', '0292 3734 720'));
$phoneTel = 'tel:' . preg_replace('/[^0-9+]/', '', $phone);

/* Danh sách trang cho ô tìm kiếm phía trình duyệt: mọi mục menu bài viết của ngôn ngữ hiện tại */
$pages = [];
foreach ($menu->getItems(['language', 'access'], [[$tag, '*'], $app->getIdentity()->getAuthorisedViewLevels()]) as $item) {
    if ($item->type === 'component' && $item->component === 'com_content' && ($item->query['view'] ?? '') === 'article') {
        $pages[Route::_('index.php?Itemid=' . $item->id)] = true;
    }
}

$wa = $this->getWebAssetManager();
$wa->useStyle('template.mmt')->useScript('template.mmt');
$wa->addInlineScript(
    'window.MMT=' . json_encode([
        'lang'        => $isEn ? 'en' : 'vi',
        'base'        => $dataBase,
        'pages'       => array_keys($pages),
        'hidePending' => (bool) $params->get('hidePending', 1),
        'analyticsId' => trim($params->get('analyticsId', '')),
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . ';',
    ['position' => 'before'],
    [],
    ['template.mmt']
);

$this->setMetaData('viewport', 'width=device-width, initial-scale=1');
$this->addFavicon($media . 'images/favicon.ico');
$this->setGenerator('');

$pageClass = $active ? ($active->alias ?: 'home') : 'page';
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<script>document.documentElement.className="js";</script>
	<jdoc:include type="metas" />
	<jdoc:include type="styles" />
	<jdoc:include type="scripts" />
</head>

<body data-page="<?php echo htmlspecialchars($pageClass); ?>">
<a class="skip-link" href="#main"><?php echo Text::_('TPL_MMT_SKIP'); ?></a>

<div class="topbar"><div class="container topbar__inner">
	<jdoc:include type="modules" name="topbar" style="none" />
	<div class="topbar__meta">
		<?php if ($phone) : ?><a href="<?php echo $phoneTel; ?>"><?php echo htmlspecialchars($phone); ?></a><?php endif; ?>
		<jdoc:include type="modules" name="language" style="none" />
	</div>
</div></div>

<div class="masthead" id="masthead"><div class="container masthead__inner">
	<a class="masthead__brand" href="<?php echo $homeUrl; ?>">
		<img class="masthead__logo" src="<?php echo $dataBase; ?>imgs/ctu-logo.png" width="320" height="320" alt="<?php echo Text::_('TPL_MMT_LOGO_ALT'); ?>">
		<span><span class="masthead__title"><?php echo Text::_('TPL_MMT_DEPT_TITLE'); ?></span>
		<small class="masthead__sub"><?php echo Text::_('TPL_MMT_DEPT_TITLE_ALT'); ?></small></span>
	</a>
	<div class="masthead__navwrap">
		<button class="nav__toggle" type="button" aria-expanded="false" aria-controls="nav-menu">
			<span class="nav__toggle-bars" aria-hidden="true"></span><?php echo Text::_('TPL_MMT_MENU'); ?>
		</button>
		<nav aria-label="<?php echo Text::_('TPL_MMT_NAV_LABEL'); ?>">
			<jdoc:include type="modules" name="menu" style="none" />
		</nav>
	</div>
</div></div>

<div class="newsbar"><div class="container newsbar__inner">
	<jdoc:include type="modules" name="newsbar" style="none" />
	<form class="search" role="search" id="site-search">
		<label class="visually-hidden" for="site-search-input"><?php echo Text::_('TPL_MMT_SEARCH_LABEL'); ?></label>
		<input class="search__input" id="site-search-input" type="search" autocomplete="off" placeholder="<?php echo Text::_('TPL_MMT_SEARCH_PLACEHOLDER'); ?>">
		<button class="search__btn" type="submit"><?php echo Text::_('TPL_MMT_SEARCH_BTN'); ?></button>
	</form>
</div></div>

<section class="search-results" id="search-results" hidden aria-live="polite">
	<div class="container search-results__inner">
		<div class="search-results__head">
			<h2><?php echo Text::_('TPL_MMT_SEARCH_HEADING'); ?></h2>
			<button class="search-results__close" type="button" title="<?php echo Text::_('TPL_MMT_SEARCH_CLOSE'); ?>" aria-label="<?php echo Text::_('TPL_MMT_SEARCH_CLOSE'); ?>">&times;</button>
		</div>
		<div id="search-results-body"></div>
	</div>
</section>

<main id="main">
	<div class="container"><jdoc:include type="message" /></div>
	<jdoc:include type="component" />
</main>

<footer class="footer"><div class="container">
	<div class="footer__grid">
		<jdoc:include type="modules" name="footer" style="mmtfooter" />
	</div>
	<div class="footer__bottom">
		<span>&copy; <?php echo date('Y'); ?> <?php echo Text::_('TPL_MMT_FOOT_CREDIT'); ?></span>
		<span>CTU &middot; CICT</span>
	</div>
</div></footer>
<button class="to-top" type="button" aria-label="<?php echo Text::_('TPL_MMT_TO_TOP'); ?>" title="<?php echo Text::_('TPL_MMT_TO_TOP'); ?>">&uarr;</button>
</body>
</html>
