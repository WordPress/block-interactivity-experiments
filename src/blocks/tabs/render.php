<?php
$wrapper_attributes = get_block_wrapper_attributes(); ?>

<div <?php echo $wrapper_attributes; ?>>
	<h3>The tabs!</h3>
	<wp-show when="state.show"><div>I should be shown</div></wp-show>
	<wp-show when="state.dontShow"><div>I should not be shown</div></wp-show>
</div>
