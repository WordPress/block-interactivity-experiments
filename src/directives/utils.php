<?php

function get_from_context( $expr, $context ) {
	$path = explode( '.', $expr );
	if ( count( $path ) > 0 && 'context' === $path[0] ) {
		array_shift( $path );
		$result = $context;
		foreach ( $path as $key ) {
			$result = $result[ $key ];
		}
	}
	return $result;
}
