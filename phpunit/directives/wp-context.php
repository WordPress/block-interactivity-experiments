<?php
/**
 * wp-context directive test.
 */

require_once __DIR__ . '/../../src/directives/wp-context.php';

require_once __DIR__ . '/../../src/directives/class-wp-directive-context.php';

require_once __DIR__ . '/../../../gutenberg/lib/experimental/html/index.php';

/**
 * Tests for the wp-context directive.
 *
 * @group  directives
 * @covers process_wp_context
 */
class Tests_Directives_WpContext extends WP_UnitTestCase {
	public function test_directive_merges_context_correctly_upon_opening_wp_context_tag() {
		$context = new WP_Directive_Context(
			array(
				'myblock'    => array( 'open' => false ),
				'otherblock' => array( 'somekey' => 'somevalue' )
			)
		);

		$markup = '<wp-context data=\'{ "myblock": { "open": true } }\'>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		process_wp_context( $tags, $context );

		$this->assertSame(
			array(
				'myblock'    => array( 'open' => true ),
				'otherblock' => array( 'somekey' => 'somevalue' ),
			),
			$context->get_context()
		);
	}

	public function test_directive_resets_context_correctly_upon_closing_wp_context_tag() {
		$context = new WP_Directive_Context(
			array( 'my-key' => 'original-value' )
		);

		$context->set_context(
			array( 'my-key' => 'new-value' )
		);

		$markup = '</wp-context>';
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag( array( 'tag_closers' => 'visit' ) );

		process_wp_context( $tags, $context );

		$this->assertSame(
			array( 'my-key' => 'original-value' ),
			$context->get_context()
		);
	}


	public function test_directive_updates_context() {
		$context = new WP_Directive_Context( array( 'myblock' => array( 'open' => false ) ) );

		$markup = <<<EOF
			<wp-context data='{ "myblock": { "open": true } }'>
				<wp-context data='{ "myblock": { "open": false } }'>
					<span>blah</span>
				</wp-context>
				<div class="context-true">Should be true again!</div>
			</wp-context>
EOF;
		$tags = new WP_HTML_Tag_Processor( $markup );
		$tags->next_tag();

		process_wp_context( $tags, $context );

		$this->assertSame( array( 'myblock' => array( 'open' => true ) ), $context->get_context() );
		// TODO: Verify that markup is unchanged?

		$tags->next_tag();
		process_wp_context( $tags, $context );

		$this->assertSame( array( 'myblock' => array( 'open' => false ) ), $context->get_context() );

		$tags->next_tag(); // <span>
		process_wp_context( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) ); //  </span>

		$tags->next_tag( array( 'tag_closers' => 'visit' ) ); //  </wp-context> for wp-context

		process_wp_context( $tags, $context );

		$tags->next_tag();
		$this->assertSame( 'context-true', $tags->get_attribute(( 'class' ) ) );
		process_wp_context( $tags, $context );

		$this->assertSame( array( 'myblock' => array( 'open' => true ) ), $context->get_context() );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) ); //  </div>
		process_wp_context( $tags, $context );

		$tags->next_tag( array( 'tag_closers' => 'visit' ) ); //  </wp-context>
		process_wp_context( $tags, $context );

		$this->assertSame( array( 'myblock' => array( 'open' => false ) ), $context->get_context() );
	}
}
