<?php
/**
 * wp_process_directives test.
 */

require_once __DIR__ . '/../../src/directives/wp-process-directives.php';

require_once __DIR__ . '/../../../gutenberg/lib/experimental/html/wp-html.php';

class Helper_Class {
	function process_foo_test( $tags, $context ) {
	}
}

/**
 * Tests for the wp_process_directives function.
 *
 * @group  directives
 * @covers wp_process_directives
 */
class Tests_Directives_WpProcessDirectives extends WP_UnitTestCase {
	public function test_correctly_call_attribute_directive_processor_on_closing_tag() {

		// PHPUnit cannot stub functions, only classes.
		$test_helper = $this->createMock( Helper_Class::class );

		$test_helper->expects( $this->exactly( 2 ) )
					->method( 'process_foo_test' )
					->with(
						$this->callback(
							function( $p ) {
								return 'DIV' === $p->get_tag() && (
									// Either this is a closing tag...
									$p->is_tag_closer() ||
									// ...or it is an open tag, and has the directive attribute set.
									( ! $p->is_tag_closer() && 'abc' === $p->get_attribute( 'foo-test' ) )
								);
							}
						)
					);

		$attribute_directives = array(
			'foo-test' => array( $test_helper, 'process_foo_test' ),
		);

		$markup = '<div>Example: <div foo-test="abc"><img><span>This is a test></span><div>Here is a nested div</div></div></div>';
		$tags   = new WP_HTML_Tag_Processor( $markup );
		wp_process_directives( $tags, 'foo-', array(), $attribute_directives );
	}
}
