<?php
wp_enqueue_script('bhe-dynamic-interactive-parent-view-script');
$post = get_post();
$inner_blocks_html = '';
foreach ($block->inner_blocks as $inner_block) {
    $inner_blocks_html .= $inner_block->render();
}
var_dump($attributes);
?>

<div <?= get_block_wrapper_attributes() ?>>
    <h2>Post Title: <?= $post->post_title ?></h2>
    <h2><?= $attributes['blockTitle'] ?></h2>
    <button>Show</button>
    <button>Bold</button>
    <button><?= $attributes['counter'] ?></button>
    <wp-inner-blocks>
        <?= $inner_blocks_html ?>
    </wp-inner-blocks>
</div>