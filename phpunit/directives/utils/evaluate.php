<?php
/**
 * `evaluate` function test.
 */

require_once __DIR__ . '/../../../src/directives/utils.php';

/**
 * Tests for the `evaluate` function.
 *
 * @group  utils
 * @covers evaluate
 */
class Tests_Utils_Evaluate extends WP_UnitTestCase {
	public function test_evaluate_function_should_access_state() {
		// Init a simple store.
		store(
			array(
				'state' => array(
					'core' => array(
						'a'      => 1,
						'b'      => 2,
						'nested' => array(
							'c' => 3,
						),
					),
				),
			)
		);
		$this->assertSame( 1, evaluate( 'state.core.a' ) );
		$this->assertSame( 2, evaluate( 'state.core.b' ) );
		$this->assertSame( 3, evaluate( 'state.core.nested.c' ) );
	}
	public function test_evaluate_function_should_access_passed_context() {
		$context = array(
			'core' => array(
				'a'      => 1,
				'b'      => 2,
				'nested' => array(
					'c' => 3,
				),
			),
		);

		$this->assertSame( 1, evaluate( 'context.core.a', $context ) );
		$this->assertSame( 2, evaluate( 'context.core.b', $context ) );
		$this->assertSame( 3, evaluate( 'context.core.nested.c', $context ) );
	}

	public function test_evaluate_function_should_return_null_for_unresolved_paths() {
		$this->assertNull( evaluate( 'this.property.doesnt.exist' ) );
	}
}
