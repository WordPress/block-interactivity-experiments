<?php
/**
 * wp-show tag directive test.
 */

 require_once __DIR__ . '/../../../src/directives/attributes/wp-show.php';

 require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';
 require_once __DIR__ . '/../../../src/directives/class-wp-directive-processor.php';

 require_once __DIR__ . '/../../../src/directives/wp-html.php';

/**
 * Tests for the wp-show tag directive.
 *
 * @group  directives
 * @covers process_wp_show
 */
class Tests_Directives_WpShow extends WP_UnitTestCase {
	public function test_directive_leaves_content_unchanged_if_when_is_true() {
		$markup = <<<EOF
			<div wp-show="context.myblock.open">
				I should be shown!
			</div>
EOF;
		$tags   = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'open' => true ) ) );
		$context        = clone $context_before;
		process_wp_show( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		process_wp_show( $tags, $context );

		$this->assertSame( $markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-show directive changed context' );
	}

	public function test_directive_wraps_content_in_template_if_when_is_false() {
		$markup = <<<EOF
			<div wp-show="context.myblock.open">
				I should be shown!
			</div>
EOF;
		$tags   = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'open' => false ) ) );
		$context        = clone $context_before;
		process_wp_show( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		process_wp_show( $tags, $context );

		$updated_markup = <<<EOF
			<template><div wp-show="context.myblock.open">
				I should be shown!
			</div></template>
EOF;
		$this->assertSame( $updated_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-show directive changed context' );
	}
}
