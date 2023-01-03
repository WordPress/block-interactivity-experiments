<?php
/**
 * wp-bind directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-bind.php';
require_once __DIR__ . '/../../src/directives/wp-context.php';

require_once __DIR__ . '/../../../gutenberg/lib/experimental/html/index.php';

/**
 * Tests for the wp-bind directive.
 *
 * @group  directives
 * @covers process_wp_bind
 */
class Tests_Directives_WpBind extends WP_UnitTestCase {
	public function test_directive() {
		$markup = '<img wp-bind:src="context.myblock.imageSource" />';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'imageSource' => './wordpress.png' ) ) );
		$context = $context_before;
		process_wp_bind( $tags, $context );

		$this->assertSame(
			'<img src="./wordpress.png" wp-bind:src="context.myblock.imageSource" />',
			$tags->get_updated_html()
		);
		// $this->assertSame( './wordpress.png', $tags->get_attribute( 'src' ) ); // FIXME: Broken; will be fixed by https://github.com/WordPress/gutenberg/pull/46598.
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-bind directive changed context' );
	}
}
