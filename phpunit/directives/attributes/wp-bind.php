<?php
/**
 * wp-bind directive test.
 */

require_once __DIR__ . '/../../../src/directives/attributes/wp-bind.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';

require_once __DIR__ . '/../../../src/directives/wp-html.php';

/**
 * Tests for the wp-bind directive.
 *
 * @group  directives
 * @covers process_wp_bind
 */
class Tests_Directives_WpBind extends WP_UnitTestCase {
	public function test_directive_sets_attribute() {
		$markup = '<img wp-bind:src="context.myblock.imageSource" />';
		$tags   = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'imageSource' => './wordpress.png' ) ) );
		$context        = $context_before;
		process_wp_bind( $tags, $context );

		$this->assertSame(
			'<img src="./wordpress.png" wp-bind:src="context.myblock.imageSource" />',
			$tags->get_updated_html()
		);
		$this->assertSame( './wordpress.png', $tags->get_attribute( 'src' ) );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-bind directive changed context' );
	}

	public function test_directive_ignores_empty_bound_attribute() {
		$markup = '<img wp-bind:="context.myblock.imageSource" />';
		$tags   = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'imageSource' => './wordpress.png' ) ) );
		$context        = $context_before;
		process_wp_bind( $tags, $context );

		$this->assertSame( $markup, $tags->get_updated_html() );
		$this->assertNull( $tags->get_attribute( 'src' ) );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-bind directive changed context' );
	}
}
