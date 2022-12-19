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
			$context['show'] = '<template>' . $content . '</template>';
			return '<template>' . $content . '</template>';
		}
		$context['show'] = $content;
		return $content;
	}
}