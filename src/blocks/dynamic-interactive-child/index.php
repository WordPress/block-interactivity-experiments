<?php

function render_block_dynamic_interactive_child_bhe($attributes, $content, $block)
{
    wp_enqueue_script('bhe-dynamic-interactive-child-view-script');

    $post = get_post();
    $date   = $post->post_date;
    $wrapper_attributes = get_block_wrapper_attributes(array('class' => $align_class_name, 'statePatata' => $state));

    return sprintf(
        '<div %1$s>
            <p>Post Date: <span class="dynamic-child-block-date">%2$s</span></p>
            <p>Counter: </p>
        </div>',
        $wrapper_attributes,
        $date
    );
}
