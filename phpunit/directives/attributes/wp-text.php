<?php
/**
 * wp-text tag directive test.
 */

require_once __DIR__ . '/../../../src/directives/attributes/wp-text.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';
require_once __DIR__ . '/../../../src/directives/class-wp-directive-processor.php';

require_once __DIR__ . '/../../../src/directives/wp-html.php';

/**
 * Tests for the wp-text tag directive.
 *
 * @group  directives
 * @covers process_wp_text
 */
class Tests_Directives_WpText extends WP_UnitTestCase {
	public function test_directive_sets_inner_html_based_on_attribute_value_and_escapes_html() {
		$markup = '<div wp-text="context.myblock.someText"></div>';

		$tags = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'someText' => 'The HTML tag <br> produces a line break.' ) ) );
		$context        = clone $context_before;
		process_wp_text( $tags, $context );

		$expected_markup = '<div wp-text="context.myblock.someText">The HTML tag &lt;br&gt; produces a line break.</div>';
		$this->assertSame( $expected_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-text directive changed context' );
	}

	public function test_directive_overwrites_inner_html_based_on_attribute_value() {
		$markup = '<div wp-text="context.myblock.someText">Lorem ipsum dolor sit.</div>';

		$tags = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'someText' => 'Honi soit qui mal y pense.' ) ) );
		$context        = clone $context_before;
		process_wp_text( $tags, $context );

		$expected_markup = '<div wp-text="context.myblock.someText">Honi soit qui mal y pense.</div>';
		$this->assertSame( $expected_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-text directive changed context' );
	}
}
