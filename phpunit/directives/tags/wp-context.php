<?php
/**
 * wp-context tag directive test.
 */

require_once __DIR__ . '/../../../src/directives/tags/wp-context.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';

require_once __DIR__ . '/../../../src/directives/wp-html.php';

/**
 * Tests for the wp-context tag directive.
 *
 * @group  directives
 * @covers process_wp_context_tag
 */
class Tests_Directives_Tags_WpContext extends WP_UnitTestCase {
	public function test_directive_merges_context_correctly_upon_opening_wp_context_tag() {
		$context = new WP_Directive_Context(
			array(
				'myblock'    => array( 'open' => false ),
				'otherblock' => array( 'somekey' => 'somevalue' ),
			)
		);

		$markup = '<wp-context data=\'{ "myblock": { "open": true } }\'>';
		$tags   = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		process_wp_context_tag( $tags, $context );

		$this->assertSame(
			array(
				'myblock'    => array( 'open' => true ),
				'otherblock' => array( 'somekey' => 'somevalue' ),
			),
			$context->get_context()
		);
	}

	public function test_directive_resets_context_correctly_upon_closing_wp_context_tag() {
		$context = new WP_Directive_Context(
			array( 'my-key' => 'original-value' )
		);

		$context->set_context(
			array( 'my-key' => 'new-value' )
		);

		$markup = '</wp-context>';
		$tags   = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag( array( 'tag_closers' => 'visit' ) );

		process_wp_context_tag( $tags, $context );

		$this->assertSame(
			array( 'my-key' => 'original-value' ),
			$context->get_context()
		);
	}
}
