<?php
$wrapper_attributes = get_block_wrapper_attributes();

$inner_blocks_html = '';
foreach ( $block->inner_blocks as $inner_block ) {
	$inner_blocks_html .= $inner_block->render();
}
?>

<div <?php echo $wrapper_attributes; ?>>
	<h3>Regular block</h3>
	<wp-show when="state.show"><?php echo $inner_blocks_html; ?></wp-show>
	<wp-show when="state.dontShow"><div>I should not be shown</div></wp-show>
</div>
