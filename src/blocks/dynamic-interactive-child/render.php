<?php
wp_enqueue_script('bhe-dynamic-interactive-child-view-script');
$post = get_post();
$date = $post->post_date;
$state = [
    "date" => $date
];
?>

<div <?= get_block_wrapper_attributes() ?>>
    <p>
        Block Context from interactive parent - "bhe/interactive-title": <?= $block->context['bhe/dynamic-interactive-title'] ?>
    </p>
    <p>
        Block Context from non-interactive parent - "bhe/non-interactive-title": <?= $block->context['bhe/dynamic-non-interactive-title'] ?>
    </p>
    <p>React Context - "counter":</p>
    <p>React Context - "theme":</p>
    <p>Post Date: <?= $date ?></p>
    <script class="dynamic-child-block-state" type="application/json">
        <?= wp_json_encode($state) ?>
    </script>
</div>