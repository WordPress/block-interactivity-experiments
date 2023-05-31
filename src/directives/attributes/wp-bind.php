<?php
/**
 * Process wp-bind directive attribute.
 *
 * @package wp-directives
 */

/** Utility functions */
require_once __DIR__ . '/../utils.php';

/**
 * Process wp-bind directive attribute.
 *
 * @param WP_Directive_Processor $tags Tags.
 * @param WP_Directive_Context   $context Directive context.
 */
function process_wp_bind( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$prefixed_attributes = $tags->get_attribute_names_with_prefix( 'data-wp-bind--' );

	foreach ( $prefixed_attributes as $attr ) {
		list( , $bound_attr ) = explode( '--', $attr );
		if ( empty( $bound_attr ) ) {
			continue;
		}

		$expr  = $tags->get_attribute( $attr );
		$value = evaluate( $expr, $context->get_context() );
		$tags->set_attribute( $bound_attr, $value );
	}
}
