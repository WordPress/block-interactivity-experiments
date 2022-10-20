<?php
$post = get_post();
$wrapper_attributes = get_block_wrapper_attributes();
?>

<wp-context data='{"post": {"id": <?php echo $post->ID; ?>}}'>
    <img
        <?php echo $wrapper_attributes; ?>
        wp-on:click="actions.favorites.togglePost"
        draggable="false"
        role="img"
        class="emoji"
        alt=":heart:"
        wp-bind:src="actions.favorites.isPostIncluded"
    />
</wp-context>