<?php
/* Menu chính (masthead) — dựng đúng cấu trúc nav__menu của website tĩnh. */
defined('_JEXEC') or die;
require __DIR__ . '/_mmt.php';
?>
<ul class="nav__menu" id="nav-menu">
<?php foreach ($list as $item) :
    [$current, $active] = mmtMenuState($item, $active_id, $path);
    if ($item->level == 1) {
        echo '<li class="nav__item' . ($active ? ' nav__item--active' : '') . '">';
        if ($item->deeper) {
            echo mmtMenuLink($item, $current, 'nav__link', ' aria-haspopup="true" aria-expanded="false"',
                '<span class="nav__caret" aria-hidden="true"></span>');
        } else {
            echo mmtMenuLink($item, $current, 'nav__link');
        }
    } else {
        echo '<li>' . mmtMenuLink($item, $current);
    }

    if ($item->deeper) {
        echo '<ul class="nav__submenu">';
    } elseif ($item->shallower) {
        echo '</li>' . str_repeat('</ul></li>', $item->level_diff);
    } else {
        echo '</li>';
    }
endforeach; ?>
</ul>
