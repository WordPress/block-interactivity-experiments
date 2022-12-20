<?php

require_once __DIR__ . '/utils.php';

function process_wp_bind( &$tags, &$context ) {
	$prefixed_attributes = $tags->get_attributes_by_prefix( 'wp-bind:' );

	foreach( $prefixed_attributes as $name => $expr ) {
		$attr_parts = explode( ':', $name );
		if ( count( $attr_parts ) < 2 ) {
			continue;
		}
		$bound_attr = $attr_parts[1];

		// TODO: Properly parse $value.
		$value = get_from_context( $expr, $context );
		$tags->set_attribute( $bound_attr, $value );
	}
}