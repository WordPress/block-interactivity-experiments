<?php

function process_wp_context( $tags, $context ) {
	if ( 'WP-CONTEXT' === $tags->get_tag() ) {
		if ( $tags->is_tag_closer() ) {
			$context->rewind_context();
			return;
		}
		$value = $tags->get_attribute( 'data' );
	} else {
		// TODO: Implement rewinding context upon matching closing tag.
		$value = $tags->get_attribute( 'wp-context' );
	}

	if ( null === $value ) {
		// No wp-context directive.
		return;
	}

	$new_context = json_decode( $value, true );
	// TODO: Error handling.

	$context->set_context( $new_context );
}
