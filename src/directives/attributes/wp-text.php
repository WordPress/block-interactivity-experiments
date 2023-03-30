<?php
/**
 * Process wp-text directive attribute.
 *
 * @package wp-directives
 */

/** Utility functions */
require_once __DIR__ . '/../utils.php';

/**
 * Process wp-text directive attribute.
 *
 * @param WP_Directive_Processor $tags Tags.
 * @param WP_Directive_Context   $context Directive context.
 */
function process_wp_text( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$value = $tags->get_attribute( 'data-wp-text' );
	if ( null === $value ) {
		return;
	}

	$text = evaluate( $value, $context->get_context() );
	$tags->set_inner_html( esc_html( $text ) );
}
