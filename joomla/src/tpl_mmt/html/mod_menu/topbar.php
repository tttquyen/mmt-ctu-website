<?php
/* Liên kết đầu trang (topbar). Chỉ hiện cấp 1. */
defined('_JEXEC') or die;
require __DIR__ . '/_mmt.php';
?>
<ul class="topbar__links">
<?php foreach ($list as $item) : if ($item->level != 1) continue;
    [$current] = mmtMenuState($item, $active_id, $path); ?>
	<li><?php echo mmtMenuLink($item, $current); ?></li>
<?php endforeach; ?>
</ul>
