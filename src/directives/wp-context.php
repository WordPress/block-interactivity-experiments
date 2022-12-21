<?php

// TODO: I think we need to clear context once we encounter the closing tag.
function process_wp_context( &$tags, &$levels ) {
	if( $tags->is_tag_closer() && 'WP-CONTEXT' === $tags->get_tag() ) {
		array_pop( $levels );
	}

	if ( 'WP-CONTEXT' === $tags->get_tag() ) {
		$value = $tags->get_attribute( 'data' );
		// ...
	} else {
		$value = $tags->get_attribute( 'wp-context' );
	}

	if ( null === $value ) {
		// No wp-context directive.
		return;
	}

	$new_context = json_decode( $value, true );
	// TODO: Error handling.

	$context = end( $levels );
	array_push( $levels, array_replace_recursive( $context, $new_context ) );
}