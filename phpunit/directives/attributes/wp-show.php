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

	public function test_directive_wraps_complex_content_in_template_if_when_is_false() {
		$markup = <<<END
			<ul>
				<li
					data-wp-class.wpmovies-active-tab="context.wpmovies.isImagesTab"
					class="wpmovies-tabs-title"
				>
					Images
				</li>
			</ul>

			<div data-wp-show="context.wpmovies.isImagesTab" class="abc">
				Images Tab
			</div>

			<div data-wp-show="context.wpmovies.isVideosTab" class="abc">
				Videos Tab
			</div>
END;

		$tags = new WP_Directive_Processor( $markup );
		$context_before = new WP_Directive_Context(
			array(
				'myblock' => array( 'open' => false ),
				'wpmovies' => array(
					'isImagesTab' => true,
					'isVideosTab' => false,
				),
			)
		);
		$context        = clone $context_before;

		$tags->next_tag( array( 'class_name' => 'wpmovies-tabs-title' ) );
		process_wp_class( $tags, $context );

		$tags->next_tag( array( 'class_name' => 'abc' ) );
		process_wp_show( $tags, $context );

		//$tags->next_tag( array( 'tag_closers' => 'visit' ) );
		$tags->next_tag( array( 'class_name' => 'abc' ) );
		process_wp_show( $tags, $context );

		$updated_markup = <<<END
			<ul>
				<li
					data-wp-class.wpmovies-active-tab="context.wpmovies.isImagesTab"
					class="wpmovies-tabs-title wpmovies-active-tab"
				>
					Images
				</li>
			</ul>

			<div data-wp-show="context.wpmovies.isImagesTab" class="abc">
				Images Tab
			</div>

			<template data-wp-show="context.wpmovies.isVideosTab"><div  class="abc">
				Videos Tab
			</div></template>
END;

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
}
