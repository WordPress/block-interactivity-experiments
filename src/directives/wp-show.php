<?php

require_once __DIR__ . '/utils.php';

function process_wp_show( &$tags, &$context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	if ( 'WP-SHOW' === $tags->get_tag() ) {
		$value = $tags->get_attribute( 'when' );
	} else {
		$value = $tags->get_attribute( 'wp-data' );
	}

	if ( null === $value ) {
		return;
	}

	// TODO: Properly parse $value.
	$show = get_from_context( $value, $context->get_context() );

	if ( ! $show ) {
		// $content = $tags->get_content_inside_balanced_tags()
		// $tags->set_content_inside_balanced_tags( '<template>' . $content . '</template>' );
	}
}
