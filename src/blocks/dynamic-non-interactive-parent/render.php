<?php
$post = get_post();
$inner_blocks_html = '';
foreach ($block->inner_blocks as $inner_block) {
    $inner_blocks_html .= $inner_block->render();
}
?>

<div <?= get_block_wrapper_attributes() ?>>
    <h2>Post Title: <?= $post->post_title ?></h2>
    <h2>Block Title : <?= $attributes['blockTitle'] ?></h2>
    <div>
        <?= $inner_blocks_html ?>
    </div>
</div>