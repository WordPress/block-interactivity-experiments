<?php
/**
 * wp-show directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-show.php';

/**
 * Tests for the wp-show directive.
 *
 * @group  directives
 * @covers process_wp_show
 */
class Tests_Directives_WpShow extends WP_UnitTestCase {
	public function test_directive_leaves_content_unchanged_if_when_is_true() {
		$content = '<div>I should be shown!</div>';
		$directive_content = 'context.myblock.open';
		$context = array( 'myblock' => array( 'open' => true ) );
		$actual = process_wp_show( $content, $directive_content, $context );

		$this->assertSame( $content, $actual );
	}

	public function test_directive_wraps_content_in_template_if_when_is_false() {
		$content = '<div>I should not be shown!</div>';
		$directive_content = 'context.myblock.open';
		$context = array( 'myblock' => array( 'open' => false ) );
		$actual = process_wp_show( $content, $directive_content, $context );

		$this->assertSame( '<template>' . $content . '</template>', $actual );
	}
}
