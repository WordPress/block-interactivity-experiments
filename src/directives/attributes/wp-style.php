<?php

require_once __DIR__ . '/../utils.php';

function process_wp_style( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$prefixed_attributes = $tags->get_attribute_names_with_prefix( 'wp-style:' );

	foreach ( $prefixed_attributes as $attr ) {
		list( , $style_name ) = explode( ':', $attr );
		if ( empty( $style_name ) ) {
			continue;
		}

		// TODO: Properly parse $value.
		$expr        = $tags->get_attribute( $attr );
		$style_value = get_from_context( $expr, $context->get_context() );
		if ( $style_value ) {
			$style_attr = $tags->get_attribute( 'style' );
			$style_attr = set_style( $style_attr, $style_name, $style_value );
			$tags->set_attribute( 'style', $style_attr );
		} else {
			// TODO: Do we want to unset styles if they're null?
			// $tags->remove_class( $style_name );
		}
	}
}

