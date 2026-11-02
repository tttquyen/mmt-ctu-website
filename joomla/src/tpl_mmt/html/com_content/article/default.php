<?php
/*
 * Bài viết hiển thị toàn khổ: nội dung bài (các <section>) tự chứa tiêu đề trang,
 * đường dẫn (breadcrumb) và khung .container — giống hệt website tĩnh.
 */
defined('_JEXEC') or die;

/** @var \Joomla\Component\Content\Site\View\Article\HtmlView $this */
?>
<div class="mmt-article">
	<?php echo $this->item->event->beforeDisplayContent; ?>
	<?php echo $this->item->text; ?>
	<?php echo $this->item->event->afterDisplayContent; ?>
</div>
