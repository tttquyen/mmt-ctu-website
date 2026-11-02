<?php
/* Trang rút gọn (in ấn, cửa sổ bật lên). */
defined('_JEXEC') or die;

/** @var \Joomla\CMS\Document\HtmlDocument $this */
$this->getWebAssetManager()->useStyle('template.mmt');
?>
<!DOCTYPE html>
<html lang="<?php echo $this->language; ?>" dir="<?php echo $this->direction; ?>">
<head>
	<jdoc:include type="metas" />
	<jdoc:include type="styles" />
	<jdoc:include type="scripts" />
</head>
<body class="contentpane">
	<jdoc:include type="message" />
	<jdoc:include type="component" />
</body>
</html>
