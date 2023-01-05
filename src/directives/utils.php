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

function set_style( $style, $name, $value ) {
	$style_assignments = explode( ';', $style );
	$modified          = false;
	foreach ( $style_assignments as $style_assignment ) {
		list( $style_name ) = explode( ':', $style_assignment );
		if ( trim( $style_name ) === $name ) {
			// TODO: Retain surrounding whitespace from $style_value, if any.
			$style_assignment = $style_name . ': ' . $value;
			$modified         = true;
			break;
		}
	}

	if ( ! $modified ) {
		$new_style_assignment = $name . ': ' . $value;
		// If the last element is empty or whitespace-only, we insert
		// the new "key: value" pair before it.
		if ( empty( trim( end( $style_assignments ) ) ) ) {
			array_splice( $style_assignments, - 1, 0, $new_style_assignment );
		} else {
			array_push( $style_assignments, $new_style_assignment );
		}
	}
	return implode( ';', $style_assignments );
}
