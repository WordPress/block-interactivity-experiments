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
 * @param WP_Directive_Context   $context Directive context.
 * @return WP_Directive_Processor
 */
function wp_process_directives( $tags, $prefix, $directives, $context = null ) {
	if ( ! $context ) {
		$context = new WP_Directive_Context;
	}

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
			// Helper that removes the part after the dot before looking
			// for the directive processor inside `$attribute_directives`.
			$get_directive_type = function ( $attr ) {
				return strtok( $attr, '.' );
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
			// Call opener processor.
			$directive_opener_processor = $directives[ $attribute ];
			if ( is_callable( $directives[ $attribute ] ) ) {
				$directive_opener_processor = $directives[ $attribute ];
			} elseif (
				is_array( $directives[ $attribute ] ) &&
				isset( $directives[ $attribute ][0] ) &&
				is_callable( $directives[ $attribute ][0] )
			) {
				$directive_opener_processor = $directives[ $attribute ][0];
			}
			call_user_func( $directive_opener_processor, $tags, $context );

			// Get inner HTML. Create new tag processor for it and run on it.
			$inner_html  = $tags->get_inner_html();
			$inner_tags  = new WP_Directive_Processor( $inner_html );
			$inner_tags  = wp_process_directives( $inner_tags, 'data-wp-', $directives, $context ); // Needs context!!!
			$inner_html .= $inner_tags->get_updated_html();
			$tags->set_inner_html( $inner_html );

			// Call closer processor.
			if (
				is_array( $directives[ $attribute ] ) &&
				count( $directives[ $attribute ] ) > 1 &&
				isset( $directives[ $attribute ][1] ) &&
				is_callable( $directives[ $attribute ][1] )
			) {
				$directive_closer_processor = $directives[ $attribute ][1];
				call_user_func( $directive_closer_processor, $tags, $context );
			}
		}
	}

	return $tags;
}

