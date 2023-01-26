<?php

require_once __DIR__ . '../utils.php';

function process_wp_bind( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$prefixed_attributes = $tags->get_attribute_names_with_prefix( 'wp-bind:' );

	foreach ( $prefixed_attributes as $attr ) {
		list( , $bound_attr ) = explode( ':', $attr );
		if ( empty( $bound_attr ) ) {
			continue;
		}

		// TODO: Properly parse $value.
		$expr  = $tags->get_attribute( $attr );
		$value = get_from_context( $expr, $context->get_context() );
		$tags->set_attribute( $bound_attr, $value );
	}
}
