<?php
/**
 * Process wp-html directive attribute.
 *
 * @package wp-directives
 */

/** Utility functions */
require_once __DIR__ . '/../utils.php';

/**
 * Process wp-html directive attribute.
 *
 * @param WP_Directive_Processor $tags Tags.
 * @param WP_Directive_Context   $context Directive context.
 */
function process_wp_html( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$value = $tags->get_attribute( 'data-wp-html' );
	if ( null === $value ) {
		return;
	}

	$text = evaluate( $value, $context->get_context() );
	$tags->set_inner_html( $text );
}
