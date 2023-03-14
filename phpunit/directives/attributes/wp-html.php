<?php
/**
 * wp-html tag directive test.
 */

require_once __DIR__ . '/../../../src/directives/attributes/wp-html.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';
require_once __DIR__ . '/../../../src/directives/class-wp-directive-processor.php';

require_once __DIR__ . '/../../../src/directives/wp-html.php';

/**
 * Tests for the wp-html tag directive.
 *
 * @group  directives
 * @covers process_wp_html
 */
class Tests_Directives_WpHtml extends WP_UnitTestCase {
	public function test_directive_sets_inner_html_based_on_attribute_value_and_retains_html() {
		$markup = '<div wp-html="context.myblock.someHtml"></div>';

		$tags = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'someHtml' => 'Lorem <em>ipsum</em> dolor sit.' ) ) );
		$context        = clone $context_before;
		process_wp_html( $tags, $context );

		$expected_markup = '<div wp-html="context.myblock.someHtml">Lorem <em>ipsum</em> dolor sit.</div>';
		$this->assertSame( $expected_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-html directive changed context' );
	}

	public function test_directive_overwrites_inner_html_based_on_attribute_value() {
		$markup = '<div wp-html="context.myblock.someHtml">Lorem ipsum dolor sit.</div>';

		$tags = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'someHtml' => 'Honi soit qui mal y pense.' ) ) );
		$context        = clone $context_before;
		process_wp_html( $tags, $context );

		$expected_markup = '<div wp-html="context.myblock.someHtml">Honi soit qui mal y pense.</div>';
		$this->assertSame( $expected_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-html directive changed context' );
	}
}
