<?php

class WP_Directive_Context {
	protected $stack = array( array() );

	function __construct( $context = array() ) {
		$this->set_context( $context );
	}

	public function get_context() {
		return end( $this->stack );
	}

	public function set_context( $context ) {
		array_push( $this->stack, array_replace_recursive( $this->get_context(), $context ) );
	}

	public function rewind_context() {
		array_pop( $this->stack );
	}
}

function process_wp_context( $tags, $context ) {
	if ( 'WP-CONTEXT' === $tags->get_tag() ) {
		if ( $tags->is_tag_closer() ) {
			$context->rewind_context();
			return;
		}
		$value = $tags->get_attribute( 'data' );
	} else {
		// TODO: Implement rewinding context upon matching closing tag.
		$value = $tags->get_attribute( 'wp-context' );
	}

	if ( null === $value ) {
		// No wp-context directive.
		return;
	}

	$new_context = json_decode( $value, true );
	// TODO: Error handling.

	$context->set_context( $new_context );
}
