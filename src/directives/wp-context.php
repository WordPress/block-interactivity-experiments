<?php

// TODO: I think we need to clear context once we encounter the closing tag.
function process_wp_context( $content, $directive_content, &$context ) {
	$new_context = json_decode( $directive_content, true );
	// TODO: Error handling.
	$context = array_replace_recursive( $context, $new_context );

	return $content;
}