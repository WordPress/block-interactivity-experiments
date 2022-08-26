<?php

function render_block_dynamic_non_interactive_parent_bhe($attributes, $content, $block)
{
    $post = get_post();
    $title   = $post->post_title;
    $wrapper_attributes = get_block_wrapper_attributes(array('class' => $align_class_name));
    $inner_blocks = $block->inner_blocks;
    $inner_blocks_html = '';
    foreach ($inner_blocks as $inner_block) {
        $inner_blocks_html .= $inner_block->render();
    }

    return sprintf(
        '<div
            %1$s
        >
            <h2>Post Title: %2$s</h2>
            <div>
                %3$s
            </div>
        </div>',
        $wrapper_attributes,
        $title,
        $inner_blocks_html
    );
}
