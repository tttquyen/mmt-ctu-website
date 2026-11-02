<?php
/* Danh sách liên kết đơn giản (chân trang). Chỉ hiện cấp 1. */
defined('_JEXEC') or die;
require __DIR__ . '/_mmt.php';
?>
<ul>
<?php foreach ($list as $item) : if ($item->level != 1) continue;
    [$current] = mmtMenuState($item, $active_id, $path); ?>
	<li><?php echo mmtMenuLink($item, $current); ?></li>
<?php endforeach; ?>
</ul>
