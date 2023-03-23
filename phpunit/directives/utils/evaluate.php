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
		wp_store(
			array(
				'state' => array(
					'core' => array(
						'number' => 1,
						'bool'   => true,
						'nested' => array(
							'string' => 'hi',
						),
					),
				),
			)
		);
		$this->assertSame( 1, evaluate( 'state.core.number' ) );
		$this->assertTrue( evaluate( 'state.core.bool' ) );
		$this->assertSame( 'hi', evaluate( 'state.core.nested.string' ) );
	}
	public function test_evaluate_function_should_access_passed_context() {
		$context = array(
			'local' => array(
				'number' => 2,
				'bool'   => false,
				'nested' => array(
					'string' => 'bye',
				),
			),
		);
		$this->assertSame( 2, evaluate( 'context.local.number', $context ) );
		$this->assertFalse( evaluate( 'context.local.bool', $context ) );
		$this->assertSame( 'bye', evaluate( 'context.local.nested.string', $context ) );
		// Previous defined state is also accessible.
		$this->assertSame( 1, evaluate( 'state.core.number' ) );
		$this->assertTrue( evaluate( 'state.core.bool' ) );
		$this->assertSame( 'hi', evaluate( 'state.core.nested.string' ) );
	}

	public function test_evaluate_function_should_return_null_for_unresolved_paths() {
		$this->assertNull( evaluate( 'this.property.doesnt.exist' ) );
	}
}
