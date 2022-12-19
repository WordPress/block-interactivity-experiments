<?php
/**
 * wp-context directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-context.php';

/**
 * Tests for the wp-context directive.
 *
 * @group directives
 */
class Tests_Directives_WpContext extends WP_UnitTestCase {
	public function test_directive() {
		$attributes    = array();
		$content = <<<EOF
			<wp-show when="context.myblock.open">
				<div>I should be shown!</div>
			</wp-show>
EOF;
		$directive_content = '{ "myblock": { "open": true } }';
		$context = array();
		$actual = process_wp_context( $content, $directive_content, $context );

		$this->assertSame( $content, $actual, 'wp-context directive changed markup' );
		$this->assertSame( array( 'myblock' => array( 'open' => true ) ), $context );
	}
}
