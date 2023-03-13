<?php

require_once __DIR__ . '/../class-wp-directive-processor.php';

function process_wp_each( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$prefixed_attributes = $tags->get_attribute_names_with_prefix( 'wp-each:' );
	if ( 0 === count( $prefixed_attributes ) ) {
		return;
	}
	$attribute_name = $prefixed_attributes[0];

	list( , $iterator_name ) = explode( ':', $attribute_name );

	$value = $tags->get_attribute( $attribute_name );
	if ( null === $value ) {
		// No wp-each directive.
		return;
	}

	$loop_array = evaluate( $value, $context->get_context() );
	// TODO: Error handling.

	$loop_inner_html = '';
	foreach ( $loop_array as $iteration_item ) {
		$context->set_context( array( 'item' => $iteration_item ) );

		$inner_html       = $tags->get_inner_html();
		$inner_tags       = new WP_Directive_Processor( $inner_html );
		$inner_tags       = wp_process_directives( $inner_tags, $context );
		$loop_inner_html .= $inner_tags->get_inner_html();

		$context->rewind_context();
	}
	$tags->set_inner_html( $loop_inner_html );
	$tags->next_balanced_closer();
}
