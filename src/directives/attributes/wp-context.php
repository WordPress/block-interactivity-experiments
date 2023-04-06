<?php
/**
 * Process wp-context directive attribute.
 *
 * @package wp-directives
 */

/**
 * Process wp-context directive attribute on tag opener.
 *
 * @param WP_Directive_Processor $tags Tags.
 * @param WP_Directive_Context   $context Directive context.
 */
function process_wp_context_opener( $tags, $context ) {
	$value = $tags->get_attribute( 'data-wp-context' );
	if ( null === $value ) {
		// No data-wp-context directive.
		return;
	}

	$new_context = json_decode( $value, true );
	// TODO: Error handling.

	$context->set_context( $new_context );
}

/**
 * Process tag closer matching opener with wp-context directive attribute.
 *
 * @param WP_Directive_Processor $tags Tags.
 * @param WP_Directive_Context   $context Directive context.
 */
function process_wp_context_closer( $tags, $context ) {
	$context->rewind_context();
}
