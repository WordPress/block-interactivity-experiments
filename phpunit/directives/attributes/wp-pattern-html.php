<?php
/**
 * data-wp-pattern-html tag directive test.
 */

require_once __DIR__ . '/../../../src/directives/attributes/wp-pattern-html.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';
require_once __DIR__ . '/../../../src/directives/class-wp-directive-processor.php';

require_once __DIR__ . '/../../../src/directives/wp-html.php';

/**
 * Tests for the data-wp-pattern-html tag directive.
 *
 * @group  directives
 * @covers process_wp_pattern_html
 */
class Tests_Directives_WpPatternHtml extends WP_UnitTestCase {

	// The pattern as it gets registered on the site. It can come from the theme, plugin, or Pattern Directory.
	const PATTERN = <<<HTML
<!-- wp:group {"align":"full","style":{"color":{"text":"#000000","background":"#ffffff"}}} -->
<div class="wp-block-group alignfull has-text-color has-background" style="background-color:#ffffff;color:#000000">
	<!-- wp:spacer {"height":64} -->
	<div style="height:64px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->

	<!-- wp:paragraph {"align":"center","style":{"typography":{"lineHeight":".9"}},"fontSize":"small"} -->
	<p data-wp-pattern-html="context.paragraph.content" class="has-text-align-center has-small-font-size" style="line-height:.9"><strong>GET IN TOUCH</strong></p>
		<!-- /wp:paragraph -->

	<!-- wp:heading {"textAlign":"center","style":{"typography":{"fontSize":59,"lineHeight":"1.15"}}} -->
	<h2 data-wp-pattern-html="context.heading.content" class="has-text-align-center" id="schedule-a-visit" style="font-size:59px;line-height:1.15"><strong>Schedule a Visit</strong></h2>
	<!-- /wp:heading -->

	<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center","orientation":"horizontal"}} -->
	<div class="wp-block-buttons">
		<!-- wp:button {"width":50,"style":{"color":{"background":"#000000","text":"#ffffff"},"border":{"radius":"50px"}}} -->
		<div class="wp-block-button has-custom-width wp-block-button__width-50"><a class="wp-block-button__link has-text-color has-background" style="border-radius:50px;background-color:#000000;color:#ffffff">Contact us</a></div>
		<!-- /wp:button -->
	</div>
	<!-- /wp:buttons -->

	<!-- wp:spacer {"height":64} -->
	<div style="height:64px" aria-hidden="true" class="wp-block-spacer"></div>
	<!-- /wp:spacer -->
</div>
<!-- /wp:group -->
HTML;

	public function test_directive_replaces_content_in_the_pattern() {
		// I assumed that the pattern is going to be processed the same way as in the Pattern block.
		$tags = new WP_Directive_Processor( do_blocks( self::PATTERN ) );
		// The content structure would be read from the block attributes.
		$pattern_content = array(
			'paragraph' => array( 'content' => '<em>Updated paragraph</em>' ),
			'heading'   => array( 'content' => '<em>Updated heading</em>' ),
		);
		// This should be also a custom directive, but I reused the context for simplicity.
		$context_before = new WP_Directive_Context( $pattern_content );
		$context        = clone $context_before;
		while ( $tags->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
			process_wp_pattern_html( $tags, $context );
		}

		// This should not be necessary, but otherwise it only replaces the last occurrence of the directive.
		// I went with a simple quick fix for now that run the same processing for the second occurrence.
		$tags = new WP_Directive_Processor( $tags->get_updated_html() );
		while ( $tags->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
			process_wp_pattern_html( $tags, $context );
		}

		// Checking whether the content was correctly replaced in the pattern.
		$this->assertStringContainsString(
			'<p  class="has-text-align-center has-small-font-size" style="line-height:.9"><em>Updated paragraph</em></p>',
			$tags->get_updated_html()
		);
		$this->assertStringContainsString(
			'<h2  class="has-text-align-center wp-block-heading" id="schedule-a-visit" style="font-size:59px;line-height:1.15"><em>Updated heading</em></h2>',
			$tags->get_updated_html()
		);
		$this->assertSame( $context_before->get_context(), $context->get_context(), 'data-wp-html directive changed context' );
	}
}
