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

	$tag_stack = array();
	while ( $tags->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
		$tag_name = strtolower( $tags->get_tag() );

		// Is this a tag that closes the latest opening tag?
		if ( $tags->is_tag_closer() ) {
			if ( 0 === count( $tag_stack ) ) {
				continue;
			}

			list( $latest_opening_tag_name, $attributes ) = end( $tag_stack );
			if ( $latest_opening_tag_name === $tag_name ) {
				array_pop( $tag_stack );

				// If the matching opening tag didn't have any attribute directives,
				// we move on.
				if ( 0 === count( $attributes ) ) {
					continue;
				}
			}
		} else {
			// Helper that removes the part after the double hyphen before looking for
			// the directive processor inside `$attribute_directives`.
			$get_directive_type = function ( $attr ) {
				return explode( '--', $attr )[0];
			};

			$attributes = $tags->get_attribute_names_with_prefix( $prefix );
			$attributes = array_map( $get_directive_type, $attributes );
			$attributes = array_intersect( $attributes, array_keys( $directives ) );

			// If this is an open tag, and if it either has attribute directives,
			// or if we're inside a tag that does, take note of this tag and its attribute
			// directives so we can call its directive processor once we encounter the
			// matching closing tag.
			if (
				! WP_Directive_Processor::is_html_void_element( $tags->get_tag() ) &&
				( 0 !== count( $attributes ) || 0 !== count( $tag_stack ) )
			) {
				$tag_stack[] = array( $tag_name, $attributes );
			}
		}

		foreach ( $attributes as $attribute ) {
			call_user_func( $directives[ $attribute ], $tags, $context );
		}
	}

	return $tags;
}

