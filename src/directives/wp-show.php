<?php

function process_wp_show( $content, $directive_content, &$context ) {
	if ( null !== $directive_content ) {
		// TODO: Properly parse $directive_content.
		$path = explode( '.', $directive_content );
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