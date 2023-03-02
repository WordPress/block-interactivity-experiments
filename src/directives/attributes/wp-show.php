<?php

require_once __DIR__ . '/../utils.php';

function process_wp_show( $tags, $context ) {
	if ( ! $tags->is_tag_closer() ) { // TODO: Exclude void and self-closing!
		set_bookmark_for_directive( $tags, 'wp-show' );
		return;
	}

	$end = 'wp-show-closer';
	$tags->set_bookmark( 'wp-show-closer' );
	$start = seek_bookmark_for_directive( $tags, 'wp-show' );

	$value = $tags->get_attribute( 'wp-show' );
	if ( null !== $value ) {
		$show = evaluate( $value, $context->get_context() );

		if ( ! $show ) {
			$content = $tags->get_content_inside_bookmarks( $start, $end );
			$tags->set_content_inside_bookmarks( $start, $end, '<template>' . $content . '</template>' );
		}
	}
	$tags->seek( $end );
	$tags->release_bookmark( $start );
	$tags->release_bookmark( $end );
}
