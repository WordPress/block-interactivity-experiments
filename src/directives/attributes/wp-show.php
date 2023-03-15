<?php

require_once __DIR__ . '/../utils.php';

function process_wp_show( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$value = $tags->get_attribute( 'wp-show' );
	if ( null === $value ) {
		return;
	}

	$show = evaluate( $value, $context->get_context() );
	if ( ! $show ) {
		$tags->wrap_in_tag( 'TEMPLATE' );
	}
}
