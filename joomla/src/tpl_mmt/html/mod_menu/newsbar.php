<?php
/* Dải "Nổi bật": tiêu đề module là nhãn. Chỉ hiện cấp 1. */
defined('_JEXEC') or die;
require __DIR__ . '/_mmt.php';
?>
<ul class="newsbar__links">
	<li><span class="newsbar__flag"><?php echo htmlspecialchars($module->title, ENT_COMPAT, 'UTF-8'); ?></span></li>
<?php foreach ($list as $item) : if ($item->level != 1) continue;
    [$current] = mmtMenuState($item, $active_id, $path); ?>
	<li><?php echo mmtMenuLink($item, $current); ?></li>
<?php endforeach; ?>
</ul>
