<?php
/* Khung module chân trang: mỗi module là một cột của footer__grid. */
defined('_JEXEC') or die;

$module = $displayData['module'];

if ((string) $module->content === '') {
    return;
}
?>
<div>
	<?php if ($module->showtitle) : ?><h4><?php echo htmlspecialchars($module->title, ENT_COMPAT, 'UTF-8'); ?></h4><?php endif; ?>
	<?php echo $module->content; ?>
</div>
