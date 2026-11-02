<?php
/* Hàm dùng chung cho các layout menu của template mmt. */
defined('_JEXEC') or die;

if (!function_exists('mmtMenuState')) {
    /** Trả về [current, active] của một mục menu. */
    function mmtMenuState($item, $active_id, array $path): array
    {
        $p       = $item->getParams();
        $aliasTo = $item->type === 'alias' ? (int) $p->get('aliasoptions') : 0;
        $current = $item->id == $active_id || ($aliasTo && $aliasTo == $active_id);
        $active  = $current || in_array($item->id, $path) || ($aliasTo && in_array($aliasTo, $path));
        return [$current, $active];
    }

    /** Thẻ <a> của một mục menu. */
    function mmtMenuLink($item, bool $current, string $class = '', string $extra = '', string $inner = ''): string
    {
        $href  = htmlspecialchars($item->flink, ENT_COMPAT, 'UTF-8', false);
        $attrs = $class !== '' ? ' class="' . $class . '"' : '';
        if ((int) $item->browserNav === 1 || (int) $item->browserNav === 2) {
            $attrs .= ' target="_blank" rel="noopener"';
        }
        if ($current) {
            $attrs .= ' aria-current="page"';
        }
        $title = htmlspecialchars($item->title, ENT_COMPAT, 'UTF-8', false);
        return '<a' . $attrs . ' href="' . $href . '"' . $extra . '>' . $title . $inner . '</a>';
    }
}
