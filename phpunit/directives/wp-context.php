<?php
/**
 * wp-context directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-context.php';

/**
 * Tests for the wp-context directive.
 *
 * @group  directives
 * @covers process_wp_context
 */
class Tests_Directives_WpContext extends WP_UnitTestCase {
	public function test_directive_updates_context() {
		$content = <<<EOF
			<wp-show when="context.myblock.open">
				<div>I should be shown!</div>
			</wp-show>
EOF;
		$value = '{ "myblock": { "open": true } }';
		$context = array( 'myblock' => array( 'open' => false ) );
		$actual = process_wp_context( $content, $context, $value, 'wp-context' );

		$this->assertSame( $content, $actual, 'wp-context directive changed markup' );
		$this->assertSame( array( 'myblock' => array( 'open' => true ) ), $context );
	}
}
