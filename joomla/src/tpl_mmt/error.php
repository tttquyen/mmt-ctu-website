<?php
/* Trang lỗi (404, 500…) theo giao diện khoa. */
defined('_JEXEC') or die;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Router\Route;
use Joomla\CMS\Uri\Uri;

/** @var \Joomla\CMS\Document\ErrorDocument $this */
$app   = Factory::getApplication();
$code  = (int) $this->error->getCode();
$media = Uri::root(true) . '/media/templates/site/mmt/';
$home  = $app->getMenu()->getDefault($app->getLanguage()->getTag());
$url   = $home ? Route::_('index.php?Itemid=' . $home->id) : Uri::root(true) . '/';
$title = $code === 404 ? Text::_('TPL_MMT_ERROR_TITLE') : htmlspecialchars($this->error->getMessage(), ENT_QUOTES, 'UTF-8');
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex">
	<title><?php echo $code . ' — ' . $title; ?></title>
	<link rel="icon" href="<?php echo $media; ?>images/favicon.ico">
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=K2D:wght@600;700&amp;family=Readex+Pro:wght@400;500&amp;display=swap">
	<link rel="stylesheet" href="<?php echo $media; ?>css/main.css">
</head>
<body>
<main id="main">
	<section class="page-head">
		<div class="container page-head__inner">
			<h1><?php echo $code; ?> — <?php echo $title; ?></h1>
			<p><?php echo Text::_('TPL_MMT_ERROR_TEXT'); ?></p>
		</div>
	</section>
	<section class="section">
		<div class="container">
			<p><a class="btn btn--brand" href="<?php echo $url; ?>"><?php echo Text::_('TPL_MMT_ERROR_HOME'); ?></a></p>
			<?php if ($app->get('debug')) : ?><pre><?php echo htmlspecialchars($this->error->getTraceAsString(), ENT_QUOTES, 'UTF-8'); ?></pre><?php endif; ?>
		</div>
	</section>
</main>
</body>
</html>
