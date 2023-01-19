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