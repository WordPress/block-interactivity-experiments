<?php
wpx([
	'state' => [
		'show' => true,
		'dontShow' => false,
	],
]); ?>

<h3>The tabs!</h3>
<div wp-context='{ "myblock": { "open": false } }'>
	<div wp-context='{ "myblock": { "open": true } }'>
		<wp-show when="context.myblock.open">
			<div>I should be shown!</div>
		</wp-show>
	</div>

	<wp-show when="context.myblock.open">
		<div>I should not be shown!</div>
	</wp-show>
</div>