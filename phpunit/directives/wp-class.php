<?php
/**
 * wp-class directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-class.php';
require_once __DIR__ . '/../../src/directives/wp-context.php';

require_once __DIR__ . '/../../../gutenberg/lib/experimental/html/index.php';

/**
 * Tests for the wp-class directive.
 *
 * @group  directives
 * @covers process_wp_class
 */
class Tests_Directives_WpClass extends WP_UnitTestCase {
	public function test_directive_adds_class() {
		$markup = '<div wp-class:red="context.myblock.isRed" class="blue">Test</div>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'isRed' => true ) ) );
		$context = $context_before;
		process_wp_class( $tags, $context );

		$this->assertSame(
			'<div wp-class:red="context.myblock.isRed" class="blue red">Test</div>',
			$tags->get_updated_html()
		);
		// $this->assertSame( './wordpress.png', $tags->get_attribute( 'src' ) ); // FIXME: Broken; will be fixed by https://github.com/WordPress/gutenberg/pull/46598.
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-class directive changed context' );
	}

	public function test_directive_removes_class() {
		$markup = '<div wp-class:blue="context.myblock.isBlue" class="red blue">Test</div>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'isBlue' => false ) ) );
		$context = $context_before;
		process_wp_class( $tags, $context );

		$this->assertSame(
			'<div wp-class:blue="context.myblock.isBlue" class="red">Test</div>',
			$tags->get_updated_html()
		);
		// $this->assertSame( './wordpress.png', $tags->get_attribute( 'src' ) ); // FIXME: Broken; will be fixed by https://github.com/WordPress/gutenberg/pull/46598.
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-class directive changed context' );
	}

	public function test_directive_removes_empty_class_attribute() {
		$markup = '<div wp-class:blue="context.myblock.isBlue" class="blue">Test</div>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'isBlue' => false ) ) );
		$context = $context_before;
		process_wp_class( $tags, $context );

		$this->assertSame(
			// WP_HTML_Tag_Processor has a TODO note to prune whitespace after classname removal.
			'<div wp-class:blue="context.myblock.isBlue" >Test</div>',
			$tags->get_updated_html()
		);
		// $this->assertSame( './wordpress.png', $tags->get_attribute( 'src' ) ); // FIXME: Broken; will be fixed by https://github.com/WordPress/gutenberg/pull/46598.
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-class directive changed context' );
	}

	public function test_directive_does_not_remove_non_existant_class() {
		$markup = '<div wp-class:blue="context.myblock.isBlue" class="green red">Test</div>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'isBlue' => false ) ) );
		$context = $context_before;
		process_wp_class( $tags, $context );

		$this->assertSame(
			'<div wp-class:blue="context.myblock.isBlue" class="green red">Test</div>',
			$tags->get_updated_html()
		);
		// $this->assertSame( './wordpress.png', $tags->get_attribute( 'src' ) ); // FIXME: Broken; will be fixed by https://github.com/WordPress/gutenberg/pull/46598.
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'wp-class directive changed context' );
	}
}
