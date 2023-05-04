<?php
/**
 * data-wp-show tag directive test.
 */

require_once __DIR__ . '/../../../src/directives/attributes/wp-show.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';
require_once __DIR__ . '/../../../src/directives/class-wp-directive-processor.php';

require_once __DIR__ . '/../../../src/directives/wp-html.php';

/**
 * Tests for the wp-show tag directive.
 *
 * @group  directives
 * @covers process_wp_show
 */
class Tests_Directives_WpShow extends WP_UnitTestCase {
	public function test_directive_leaves_content_unchanged_if_when_is_true() {
		$markup = '<div data-wp-show="context.myblock.open">I should be shown!</div>';
		$tags   = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'open' => true ) ) );
		$context        = clone $context_before;
		process_wp_show( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		process_wp_show( $tags, $context );

		$this->assertSame( $markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-show directive changed context' );
	}

	public function test_directive_wraps_content_in_template_if_when_is_false() {
		$markup = '<div data-wp-show="context.myblock.open">I should not be shown!</div>';

		$tags = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'open' => false ) ) );
		$context        = clone $context_before;
		process_wp_show( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		process_wp_show( $tags, $context );

		$updated_markup = '<template data-wp-show="context.myblock.open"><div >I should not be shown!</div></template>';

		$this->assertSame( $updated_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-show directive changed context' );
	}

	public function test_directive_does_not_wrap_template_in_template() {
		$markup = '<template data-wp-show="context.myblock.open">I should not be shown!</template>';

		$tags = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'open' => false ) ) );
		$context        = clone $context_before;
		process_wp_show( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		process_wp_show( $tags, $context );

		$this->assertSame( $markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-show directive changed context' );
	}

	public function test_directive_wraps_content_preceded_by_other_html_in_template_if_when_is_false() {
		$markup = '<p>Some text</p><div data-wp-show="context.myblock.open">I should not be shown!</div>';

		$tags = new WP_Directive_Processor( $markup );
		$tags->next_tag( 'div' );

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'open' => false ) ) );
		$context        = clone $context_before;
		process_wp_show( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		process_wp_show( $tags, $context );

		$updated_markup = '<p>Some text</p><template data-wp-show="context.myblock.open"><div >I should not be shown!</div></template>';

		$this->assertSame( $updated_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-show directive changed context' );
	}

	public function test_directive_wraps_void_tag_in_template_if_when_is_false() {
		$markup = '<img data-wp-show="context.myblock.open">';
		$tags   = new WP_Directive_Processor( $markup );
		$tags->next_tag();

		$context_before = new WP_Directive_Context( array( 'myblock' => array( 'open' => false ) ) );
		$context        = clone $context_before;
		process_wp_show( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		process_wp_show( $tags, $context );

		$updated_markup = '<template data-wp-show="context.myblock.open"><img ></template>';

		$this->assertSame( $updated_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-show directive changed context' );
	}

	public function test_nested_directives_within_wp_show_with_truthy_value() {
		$markup = <<<END
			<div data-wp-show="context.myBlock.open">
				I should be shown!
				<div data-wp-show="context.myOtherBlock.open">I should be shown!</div>
				<div data-wp-show="!context.myOtherBlock.open">I should not be shown!</div>
			</div>
END;

		$context_before = new WP_Directive_Context(
			array(
				'myBlock'      => array( 'open' => true ),
				'myOtherBlock' => array( 'open' => true ),
			)
		);
		$context        = clone $context_before;

		$tags = new WP_Directive_Processor( $markup );

		while ( $tags->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
			process_wp_show( $tags, $context );
		}

		$updated_markup = <<<END
			<div data-wp-show="context.myBlock.open">
				I should be shown!
				<div data-wp-show="context.myOtherBlock.open">I should be shown!</div>
				<template data-wp-show="!context.myOtherBlock.open"><div >I should not be shown!</div></template>
			</div>
END;
		$this->assertSame( $updated_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-show directive changed context' );
	}

	public function test_nested_directives_within_wp_show_with_falsy_value() {
		$markup = <<<END
			<div data-wp-show="context.myBlock.open">
				I should be shown!
				<div data-wp-show="context.myOtherBlock.open">I should be shown!</div>
				<div data-wp-show="!context.myOtherBlock.open">I should not be shown!</div>
			</div>
END;

		$context_before = new WP_Directive_Context(
			array(
				'myBlock'      => array( 'open' => false ),
				'myOtherBlock' => array( 'open' => true ),
			)
		);
		$context        = clone $context_before;

		$tags = new WP_Directive_Processor( $markup );

		while ( $tags->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
			process_wp_show( $tags, $context );
		}

		$updated_markup = <<<END
			<template data-wp-show="context.myBlock.open"><div >
				I should be shown!
				<div data-wp-show="context.myOtherBlock.open">I should be shown!</div>
				<template data-wp-show="!context.myOtherBlock.open"><div >I should not be shown!</div></template>
			</div></template>
END;
		$this->assertSame( $updated_markup, $tags->get_updated_html() );
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-show directive changed context' );
	}
}
