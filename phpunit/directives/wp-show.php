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
		$value = 'context.myblock.open';
		$context_before = array( 'myblock' => array( 'open' => true ) );
		$context = $context_before;
		$actual = process_wp_show( $content, $context, $value, 'wp-show' );

		$this->assertSame( $content, $actual );
		$this->assertSame( $context_before, $context, 'wp-show directive changed context' );
	}

	public function test_directive_wraps_content_in_template_if_when_is_false() {
		$content = '<div>I should not be shown!</div>';
		$value = 'context.myblock.open';
		$context_before = array( 'myblock' => array( 'open' => false ) );
		$context = $context_before;
		$actual = process_wp_show( $content, $context, $value, 'wp-show' );

		$this->assertSame( '<template>' . $content . '</template>', $actual );
		$this->assertSame( $context_before, $context, 'wp-show directive changed context' );
	}
}
