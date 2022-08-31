<?php
wp_enqueue_script('bhe-dynamic-interactive-child-view-script');
$post = get_post();
$date = $post->post_date;
$counter = 5;
$state = [
    "date" => $date,
    "counter" => $counter
];
?>

<div <?= get_block_wrapper_attributes() ?>>
    <p>Post Date: <?= $date ?></p>
    <p>Counter: <?= $counter ?></p>
    <script class="dynamic-child-block-state" type="application/json">
        <?= wp_json_encode($state) ?>
    </script>
</div>