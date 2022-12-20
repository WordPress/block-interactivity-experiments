<?php
/**
 * wp-bind directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-bind.php';

require_once __DIR__ . '/../../src/html/index.php';

/**
 * Tests for the wp-bind directive.
 *
 * @group  directives
 * @covers process_wp_bind
 */
class Tests_Directives_WpBind extends WP_UnitTestCase {
	public function test_directive() {
		$markup = '<img wp-bind:src="context.myblock.imageSource" />';
		$tags = new WP_HTML_Processor( $markup );
		$tags->next_tag();

		$context_before = array( 'myblock' => array( 'imageSource' => './wordpress.png' ) );
		$context = $context_before;
		process_wp_bind( $tags, $context );

		$this->assertSame(
			'<img src="./wordpress.png" wp-bind:src="context.myblock.imageSource" />',
			$tags->get_updated_html()
		);
		// $this->assertSame( './wordpress.png', $tags->get_attribute( 'src' ) ); // FIXME: Doesn't currently work.
		$this->assertSame( $context_before, $context, 'wp-bind directive changed context' );
	}
}
