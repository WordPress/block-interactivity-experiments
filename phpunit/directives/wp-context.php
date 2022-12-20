<?php
/**
 * wp-context directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-context.php';

require_once __DIR__ . '/../../src/html/index.php';

/**
 * Tests for the wp-context directive.
 *
 * @group  directives
 * @covers process_wp_context
 */
class Tests_Directives_WpContext extends WP_UnitTestCase {
	public function test_directive_updates_context() {
		$markup = <<<EOF
			<div wp-context='{ "myblock": { "open": true } }'>
				<wp-show when="context.myblock.open">
					<div>I should be shown!</div>
				</wp-show>
			</div>
EOF;
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context = array( 'myblock' => array( 'open' => false ) );
		process_wp_context( $tags, $context );

		$this->assertSame( array( 'myblock' => array( 'open' => true ) ), $context );
		// TODO: Verify that markup is unchanged?
	}
}
