<?php
/**
 * Process wp-show directive attribute.
 *
 * @package wp-directives
 */

/** Utility functions */
require_once __DIR__ . '/../utils.php';

/**
 * Process wp-show directive attribute.
 *
 * @param WP_Directive_Processor $tags Tags.
 * @param WP_Directive_Context   $context Directive context.
 */
function process_wp_show( $tags, $context ) {
	if ( $tags->is_tag_closer() ) {
		return;
	}

	$value = $tags->get_attribute( 'data-wp-show' );
	if ( null === $value ) {
		return;
	}

	$show = evaluate( $value, $context->get_context() );
	if ( $show ) {
		return;
	}

	if ( 'TEMPLATE' === $tags->get_tag() ) {
		return; // Don't wrap a `<template>` in a `<template>`.
	}

	$wrapper_bookmark = $tags->wrap_in_tag( 'TEMPLATE' );
	$tags->seek( $wrapper_bookmark );
	$tags->set_attribute( 'data-wp-show', $value );
	$tags->next_tag();
	$tags->remove_attribute( 'data-wp-show' );
}
