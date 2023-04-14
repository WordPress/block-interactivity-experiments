<?php
/**
 * Utility functions.
 *
 * @package wp-directives
 */

/** Include WP_Directives_Store class */
require_once  __DIR__ . '/class-wp-directive-store.php';

/**
 * Add data to the store.
 *
 * @param array $data Data.
 */
function wp_store( $data ) {
	WP_Directive_Store::merge_data( $data );
}

/**
 * Obtain data from store and context from the provided path.
 *
 * @todo Implement evaluation of complex logical expressions.
 *
 * @param string $path Path.
 * @param array  $context Context data.
 * @return mixed
 */
function evaluate( $path, array $context = array() ) {
	$current = array_merge(
		WP_Directive_Store::get_data(),
		array( 'context' => $context )
	);

	if ( strpos( $path, '!' ) === 0 ) {
		$path                  = substr( $path, 1 );
		$has_negation_operator = true;
	}

	$array = explode( '.', $path );

	foreach ( $array as $p ) {
		if ( isset( $current[ $p ] ) ) {
			$current = $current[ $p ];
		} else {
			return null;
		}
	}

	return isset( $has_negation_operator ) ? ! $current : $current;
}


/**
 * Set style.
 *
 * @param string $style Existing style to amend.
 * @param string $name  Style property name.
 * @param string $value Style property value.
 * @return string Amended styles.
 */
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
