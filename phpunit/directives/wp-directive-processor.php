<?php
/**
 * `WP_Directive_Processor` class test.
 */
require_once __DIR__ . '/../../src/directives/class-wp-directive-processor.php';

/**
 * @group html-processor
 *
 * @coversDefaultClass WP_Directive_Processor
 */
class WP_Directive_Processor_Test extends WP_UnitTestCase {
	const HTML = '<div>outside</div><section><div><img>inside</div></section>';

	public function test_next_balanced_closer_stays_on_void_tag() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'img' );
		$result = $tags->next_balanced_closer();
		$this->assertSame( 'IMG', $tags->get_tag() );
		$this->assertFalse( $result );
	}

	public function test_next_balanced_closer_proceeds_to_correct_tag() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$tags->next_balanced_closer();
		$this->assertSame( 'SECTION', $tags->get_tag() );
		$this->assertTrue( $tags->is_tag_closer() );
	}

	public function test_next_balanced_closer_proceeds_to_correct_tag_for_nested_tag() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'div' );
		$tags->next_tag( 'div' );
		$tags->next_balanced_closer();
		$this->assertSame( 'DIV', $tags->get_tag() );
		$this->assertTrue( $tags->is_tag_closer() );
	}

	public function test_get_inner_html_returns_correct_result() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$this->assertSame( '<div><img>inside</div>', $tags->get_inner_html() );
	}

	public function test_set_inner_html_on_void_element_has_no_effect() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'img' );
		$content = $tags->set_inner_html( 'This is the new img content' );
		$this->assertFalse( $content );
		$this->assertSame( self::HTML, $tags->get_updated_html() );
	}

	public function test_set_inner_html_sets_content_correctly() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$tags->set_inner_html( 'This is the new section content.' );
		$this->assertSame( '<div>outside</div><section>This is the new section content.</section>', $tags->get_updated_html() );
	}

	public function test_set_inner_html_updates_bookmarks_correctly() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'div' );
		$tags->set_bookmark( 'start' );
		$tags->next_tag( 'img' );
		$this->assertSame( 'IMG', $tags->get_tag() );
		$tags->set_bookmark( 'after' );
		$tags->seek( 'start' );

		$tags->set_inner_html( 'This is the new div content.' );
		$this->assertSame( '<div>This is the new div content.</div><section><div><img>inside</div></section>', $tags->get_updated_html() );
		$tags->seek( 'after' );
		$this->assertSame( 'IMG', $tags->get_tag() );
	}

	public function test_set_inner_html_subsequent_updates_on_the_same_tag_work() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$tags->set_inner_html( 'This is the new section content.' );
		$tags->set_inner_html( 'This is the even newer section content.' );
		$this->assertSame( '<div>outside</div><section>This is the even newer section content.</section>', $tags->get_updated_html() );
	}

	public function test_set_inner_html_followed_by_set_attribute_works() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$tags->set_inner_html( 'This is the new section content.' );
		$tags->set_attribute( 'id', 'thesection' );
		$this->assertSame( '<div>outside</div><section id="thesection">This is the new section content.</section>', $tags->get_updated_html() );
	}

	public function test_set_inner_html_preceded_by_set_attribute_works() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$tags->set_attribute( 'id', 'thesection' );
		$tags->set_inner_html( 'This is the new section content.' );
		$this->assertSame( '<div>outside</div><section id="thesection">This is the new section content.</section>', $tags->get_updated_html() );
	}

	public function test_set_inner_html_invalidates_bookmarks_that_point_to_replaced_content() {
		$this->markTestSkipped( "This requires on bookmark invalidation, which is only in GB's WP 6.3 compat layer." );

		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$tags->set_bookmark( 'start' );
		$tags->next_tag( 'img' );
		$tags->set_bookmark( 'replaced' );
		$tags->seek( 'start' );

		$tags->set_inner_html( 'This is the new section content.' );
		$this->assertSame( '<div>outside</div><section>This is the new section content.</section>', $tags->get_updated_html() );

		$this->expectExceptionMessage( 'Invalid bookmark name' );
		$successful_seek = $tags->seek( 'replaced' );
		$this->assertFalse( $successful_seek );
	}

	public function test_wrap_in_tag_wraps_tag_correctly() {
		$tags = new WP_Directive_Processor( self::HTML );

		$tags->next_tag( 'section' );
		$tags->wrap_in_tag( 'TEMPLATE' );
		$this->assertSame( '<div>outside</div><template><section><div><img>inside</div></section></template>', $tags->get_updated_html() );
	}
}
