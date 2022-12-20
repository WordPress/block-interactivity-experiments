<?php

// TODO: I think we need to clear context once we encounter the closing tag.
function process_wp_context( $content, &$context, $value, $name, ) {
	$new_context = json_decode( $value, true );
	// TODO: Error handling.
	$context = array_replace_recursive( $context, $new_context );

	return $content;
}