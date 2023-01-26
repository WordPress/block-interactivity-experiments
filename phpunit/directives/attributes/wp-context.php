<?php
/**
 * wp-context directive test.
 */

require_once __DIR__ . '/../../../src/directives/wp-context.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';

require_once __DIR__ . '/../../../../gutenberg/lib/experimental/html/index.php';

/**
 * Tests for the wp-context directive.
 *
 * @group  directives
 * @covers process_wp_context
 */
class Tests_Directives_WpContext_Attribute extends WP_UnitTestCase {
	public function test_directive_merges_context_correctly_upon_wp_context_attribute_on_opening_tag() {
		$this->markTestSkipped( 'Need to implement the wp-context attribute directive processor first.' );

		$context = new WP_Directive_Context(
			array(
				'myblock'    => array( 'open' => false ),
				'otherblock' => array( 'somekey' => 'somevalue' ),
			)
		);

		$markup = '<div wp-context=\'{ "myblock": { "open": true } }\'>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		process_wp_context( $tags, $context );

		$this->assertSame(
			array(
				'myblock'    => array( 'open' => true ),
				'otherblock' => array( 'somekey' => 'somevalue' ),
			),
			$context->get_context()
		);
	}
}
