<?php

function process_wp_show( &$tags, &$context ) {
	if ( 'WP-SHOW' === $tags->get_tag() ) {
		$value = $tags->get_attribute( 'when' );
	} else {
		$value = $tags->get_attribute( 'wp-data' );
	}

	if ( null !== $value ) {
		// TODO: Properly parse $value.
		$path = explode( '.', $value );
		if ( count( $path ) > 0 && 'context' === $path[0] ) {
			array_shift( $path );
			$show = $context;
			foreach( $path as $key ) {
				$show = $show[$key];
			}
		}

		if( ! $show ) {
			// $content = $tags->get_content_inside_balanced_tags()
			// $tags->set_content_inside_balanced_tags( '<template>' . $content . '</template>' );
		}
	}
}