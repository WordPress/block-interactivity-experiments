<?php

function render_block_dynamic_interactive_parent_bhe($attributes, $content, $block)
{
    wp_enqueue_script('bhe-dynamic-interactive-parent-view-script');

    $post = get_post();
    $title   = $post->post_title;
    $counter = $attributes['counter'];
    $wrapper_attributes = get_block_wrapper_attributes(array('class' => $align_class_name));
    $inner_blocks = $block->inner_blocks;
    $inner_blocks_html = '';
    foreach ($inner_blocks as $inner_block) {
        $inner_blocks_html .= $inner_block->render();
    }

    return sprintf(
        '<div %1$s>
            <h2>Post Title: %2$s</h2>
            <button>Show</button>
            <button>Bold</button>
            <button>%3$s</button>
            <wp-inner-blocks>
                %4$s
            </wp-inner-blocks>
        </div>',
        $wrapper_attributes,
        $title,
        $counter,
        $inner_blocks_html
    );
}
