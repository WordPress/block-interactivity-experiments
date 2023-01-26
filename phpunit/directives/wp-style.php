<?php
/**
 * wp-style directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-style.php';

require_once __DIR__ . '/../../src/directives/class-wp-directive-context.php';

require_once __DIR__ . '/../../../gutenberg/lib/experimental/html/index.php';

/**
 * Tests for the wp-style directive.
 *
 * @group  directives
 * @covers process_wp_style
 */
class Tests_Directives_WpStyle extends WP_UnitTestCase {
	public function test_directive_adds_style() {
		$markup = '<div wp-style:color="context.myblock.color" style="background: blue;">Test</div>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'color' => 'green' ) ) );
		$context = $context_before;
		process_wp_style( $tags, $context );

		$this->assertSame(
			'<div wp-style:color="context.myblock.color" style="background: blue;color: green;">Test</div>',
			$tags->get_updated_html()
		);
		$this->assertStringContainsString( 'color: green;', $tags->get_attribute( 'style' ) );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-style directive changed context' );
	}

	public function test_directive_ignores_empty_style() {
		$markup = '<div wp-style:="context.myblock.color" style="background: blue;">Test</div>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'color' => 'green' ) ) );
		$context = $context_before;
		process_wp_style( $tags, $context );

		$this->assertSame( $markup, $tags->get_updated_html() );
		$this->assertStringNotContainsString( 'color: green;', $tags->get_attribute( 'style' ) );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-style directive changed context' );
	}
}
