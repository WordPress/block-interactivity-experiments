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
		$markup = <<<EOF
			<wp-show when="context.myblock.open">
				<div>I should be shown!</div>
			</wp-show>
EOF;
		$tags = new WP_HTML_Processor( $markup );
		$tags->next_tag();

		$context_before = array( 'myblock' => array( 'open' => true ) );
		$context = $context_before;
		process_wp_show( $tags, $context );

		// TODO:
		// $content = trim ( $tags->get_content_inside_balanced_tags() );
		// $this->assertSame( '<div>I should be shown!</div>', $content );
		$this->assertSame( $context_before, $context, 'wp-show directive changed context' );
	}

	public function test_directive_wraps_content_in_template_if_when_is_false() {
		$markup = <<<EOF
			<wp-show when="context.myblock.open">
				<div>I should be shown!</div>
			</wp-show>
EOF;
		$tags = new WP_HTML_Processor( $markup );
		$tags->next_tag();

		$context_before = array( 'myblock' => array( 'open' => false ) );
		$context = $context_before;
		process_wp_show( $tags, $context );

		// TODO:
		// $content = trim( $tags->get_content_inside_balanced_tags() );
		// $this->assertSame( '<template><div>I should be shown!</div></template>', $content );
		$this->assertSame( $context_before, $context, 'wp-show directive changed context' );
	}
}
