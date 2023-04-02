<?php
/**
 * Function wp_process_directives.
 *
 * @package wp-directives
 */

/** WP_Directive_Context class */
require_once __DIR__ . '/class-wp-directive-context.php';

/** WP_Directive_Processor class */
require_once __DIR__ . '/class-wp-directive-processor.php';

/**
 * Process directives.
 *
 * @param WP_Directive_Processor $tags Tag processor.
 * @param string                 $prefix Attribute prefix.
 * @param string[]               $directives Directives.
 * @return WP_Directive_Processor
 */
function wp_process_directives( $tags, $prefix, $directives ) {
	$context = new WP_Directive_Context;

	while ( $tags->next_directive() ) {
		$directive_attributes = $tags->get_directive_names();
		$attributes           = array_intersect( $directive_attributes, array_keys( $directives ) );

		foreach ( $attributes as $attribute ) {
			call_user_func( $directives[ $attribute ], $tags, $context );
		}
	}

	return $tags;
}

