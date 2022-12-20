<?php

// TODO: I think we need to clear context once we encounter the closing tag.
function process_wp_context( &$tags, &$context ) {
	if ( 'WP-CONTEXT' === $tags->get_tag() ) {
		$value = $tags->get_attribute( 'data' );
	} else {
		$value = $tags->get_attribute( 'wp-context' );
	}

	$new_context = json_decode( $value, true );
	// TODO: Error handling.
	$context = array_replace_recursive( $context, $new_context );
}