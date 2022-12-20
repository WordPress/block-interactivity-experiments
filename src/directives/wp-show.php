<?php

function process_wp_show( $content, &$context, $value, $name ) {
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
			return '<template>' . $content . '</template>';
		}
		return $content;
	}
}