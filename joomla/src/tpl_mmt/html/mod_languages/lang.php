<?php
/* Nút chuyển ngôn ngữ ở đầu trang: hiển thị mã ngôn ngữ còn lại (EN / VI). */
defined('_JEXEC') or die;

use Joomla\CMS\Language\Text;

foreach ($list as $language) :
    if ($language->active) {
        continue;
    }
    $title = str_starts_with($language->lang_code, 'en') ? 'English version' : 'Phiên bản tiếng Việt';
    ?>
	<a class="topbar__lang" href="<?php echo htmlspecialchars($language->link, ENT_COMPAT, 'UTF-8', false); ?>" hreflang="<?php echo $language->lang_code; ?>" lang="<?php echo $language->lang_code; ?>" title="<?php echo $title; ?>"><?php echo strtoupper($language->sef); ?></a>
<?php endforeach;
