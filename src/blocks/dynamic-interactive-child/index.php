<?php

function render_block_dynamic_interactive_child_bhe($attributes, $content, $block)
{
    wp_enqueue_script('bhe-dynamic-interactive-child-view-script');

    $post = get_post();
    $date   = $post->post_date;
    $counter = 5;
    $wrapper_attributes = get_block_wrapper_attributes(array('class' => $align_class_name));
    $state = [
        "date" => $date,
        "counter" => $counter
    ];

    return sprintf(
        '<div %1$s>
            <p>Post Date: %2$s</p>
            <p>Counter: %3$s</p>
            <script class="dynamic-child-block-state" type="application/json">%4$s</script>
        </div>',
        $wrapper_attributes,
        $date,
        $counter,
        wp_json_encode($state)
    );
}
