<?php
$wrapper_attributes = get_block_wrapper_attributes();

$inner_blocks_html = '';
foreach ($block->inner_blocks as $inner_block) {
	$inner_blocks_html .= $inner_block->render();
}
?>

<div <?= $wrapper_attributes ?>>
	<h3>The tabs!</h3>
	<wp-show when="state.show"><?= $inner_blocks_html ?></wp-show>
	<wp-show when="state.dontShow"><div>I should not be shown</div></wp-show>
</div>
