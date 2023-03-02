<?php
/**
 * wp-each attribute directive test.
 */

require_once __DIR__ . '/../../../src/directives/attributes/wp-each.php';

require_once __DIR__ . '/../../../src/directives/class-wp-directive-context.php';

require_once __DIR__ . '/../../../src/class-wp-directive-processor.php';

/**
 * Tests for the wp-context attribute directive.
 *
 * @group  directives
 * @covers process_wp_each
 */
class Tests_Directives_Attributes_WpEach extends WP_UnitTestCase {
	public function test_directive_expands_correctly() {
		$context = new WP_Directive_Context(
			array(
				'data' => array(
					array(
						'id'    => 123,
						'label' => 'foo',
					),
					array(
						'id'    => 456,
						'label' => 'bar',
					),
					array(
						'id'    => 789,
						'label' => 'foobar',
					),
				),
			)
		);

		$markup = <<<EOF
            <table class="table table-hover table-striped test-data">
                <tbody wp-each:item="context.data" wp-key="id">
                    <tr class="" wp-class:danger="state.isSelected">
                    <td class="col-md-1" wp-text="context.item.id"></td>
                    <td class="col-md-4">
                        <a wp-on:click="actions.select" wp-text="context.item.label"></a>
                    </td>
                    <td class="col-md-1">
                        <a wp-on:click="actions.remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
                    </td>
                    <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
EOF;
		$tags   = new WP_Directive_Processor( $markup );
		$tags->next_tag(); // table
		$tags->next_tag(); // tbody

		process_wp_each( $tags, $context );

		$updated_markup = <<<EOF
            <table class="table table-hover table-striped test-data">
                <tbody wp-each:item="context.data" wp-key="id">
                    <tr class="" wp-class:danger="state.isSelected">
                    <td class="col-md-1" wp-text="context.item.id">123</td>
                    <td class="col-md-4">
                        <a wp-on:click="actions.select" wp-text="context.item.label">foo</a>
                    </td>
                    <td class="col-md-1">
                        <a wp-on:click="actions.remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
                    </td>
                    <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-hover table-striped test-data">
                <tbody wp-each:item="context.data" wp-key="id">
                    <tr class="" wp-class:danger="state.isSelected">
                    <td class="col-md-1" wp-text="context.item.id">456</td>
                    <td class="col-md-4">
                        <a wp-on:click="actions.select" wp-text="context.item.label">bar</a>
                    </td>
                    <td class="col-md-1">
                        <a wp-on:click="actions.remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
                    </td>
                    <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
            <table class="table table-hover table-striped test-data">
                <tbody wp-each:item="context.data" wp-key="id">
                    <tr class="" wp-class:danger="state.isSelected">
                    <td class="col-md-1" wp-text="context.item.id">789</td>
                    <td class="col-md-4">
                        <a wp-on:click="actions.select" wp-text="context.item.label">foobar</a>
                    </td>
                    <td class="col-md-1">
                        <a wp-on:click="actions.remove"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
                    </td>
                    <td class="col-md-6"></td>
                    </tr>
                </tbody>
            </table>
EOF;

		$this->assertSame( $updated_markup, $tags->get_updated_html() );
	}
}
