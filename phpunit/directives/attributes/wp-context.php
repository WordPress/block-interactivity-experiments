<?php
/**
 * wp-context attribute directive test.
 */

// require_once __DIR__ . '/../../../src/directives/attributes/wp-context.php'; // TODO

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';

require_once __DIR__ . '/../../../../gutenberg/lib/experimental/html/index.php';

/**
 * Tests for the wp-context attribute directive.
 *
 * @group  directives
 * @covers process_wp_context_attribute
 */
class Tests_Directives_Attributes_WpContext extends WP_UnitTestCase {
	public function test_directive_merges_context_correctly_upon_wp_context_attribute_on_opening_tag() {
		$this->markTestSkipped( 'Need to implement the wp-context attribute directive processor first.' );

		$context = new WP_Directive_Context(
			array(
				'myblock'    => array( 'open' => false ),
				'otherblock' => array( 'somekey' => 'somevalue' ),
			)
		);

		$markup = '<div wp-context=\'{ "myblock": { "open": true } }\'>';
		$tags   = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		process_wp_context_attribute( $tags, $context );

		$this->assertSame(
			array(
				'myblock'    => array( 'open' => true ),
				'otherblock' => array( 'somekey' => 'somevalue' ),
			),
			$context->get_context()
		);
	}
}
