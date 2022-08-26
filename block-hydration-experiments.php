<?php

/**
 * Plugin Name:       block-hydration-experiments
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      5.6
 * Author:            Gutenberg Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       block-hydration-experiments
 */
function block_hydration_experiments_init()
{
	register_block_type(
		plugin_dir_path(__FILE__) . 'build/blocks/interactive-child/'
	);
	register_block_type(
		plugin_dir_path(__FILE__) . 'build/blocks/interactive-parent/'
	);
	register_block_type(
		plugin_dir_path(__FILE__) . 'build/blocks/non-interactive-parent/'
	);
	// Dynamic blocks
	require_once __DIR__ . '/src/blocks/dynamic-interactive-parent/index.php';
	register_block_type(
		plugin_dir_path(__FILE__) . 'build/blocks/dynamic-interactive-parent/',
		array(
			'render_callback' => 'render_block_dynamic_interactive_parent_bhe'
		)
	);
	require_once __DIR__ . '/src/blocks/dynamic-interactive-child/index.php';
	register_block_type(
		plugin_dir_path(__FILE__) . 'build/blocks/dynamic-interactive-child/',
		array(
			'render_callback' => 'render_block_dynamic_interactive_child_bhe'
		)
	);
	require_once __DIR__ . '/src/blocks/dynamic-non-interactive-parent/index.php';
	register_block_type(
		plugin_dir_path(__FILE__) . 'build/blocks/dynamic-non-interactive-parent/',
		array(
			'render_callback' => 'render_block_dynamic_non_interactive_parent_bhe'
		)
	);
}
add_action('init', 'block_hydration_experiments_init');

function bhe_block_wrapper($block_content, $block, $instance)
{
	$block_type = $instance->block_type;

	if (!block_has_support($block_type, ['view'])) {
		return $block_content;
	}

	$attr_definitions = $block_type->attributes;

	$attributes = [];
	$sourced_attributes = [];
	foreach ($attr_definitions as $attr => $definition) {
		if (!empty($definition['public'])) {
			if (!empty($definition['source'])) {
				$sourced_attributes[$attr] = [
					'selector' => $definition['selector'], // TODO: Guard against unset.
					'source' => $definition['source'],
				];
			} else {
				if (array_key_exists($attr, $block['attrs'])) {
					$attributes[$attr] = $block['attrs'][$attr];
				} elseif (isset($definition['default'])) {
					$attributes[$attr] = $definition['default'];
				}
			}
		}
	}

	// We might want to use a flag from block.json as the criterion here.
	$hydration_technique = $block_type->supports['view']['hydration'] ?? 'idle';

	// The following is a bit hacky. If we stick with this technique, we might
	// want to change apply_block_supports() to accepts a block as its argument.
	$previous_block_to_render = WP_Block_Supports::$block_to_render;
	WP_Block_Supports::$block_to_render = $block;
	$block_props = WP_Block_Supports::get_instance()->apply_block_supports();
	WP_Block_Supports::$block_to_render = $previous_block_to_render;

	$block_wrapper =
		sprintf(
			'<wp-block ' .
				'data-wp-block-type="%1$s" ' .
				'data-wp-block-uses-block-context="%2$s" ' .
				'data-wp-block-provides-block-context="%3$s" ' .
				'data-wp-block-attributes="%4$s" ' .
				'data-wp-block-sourced-attributes="%5$s" ' .
				'data-wp-block-props="%6$s" ' .
				'data-wp-block-hydration="%7$s">',
			esc_attr($block['blockName']),
			esc_attr(json_encode($block_type->uses_context)),
			esc_attr(json_encode($block_type->provides_context)),
			esc_attr(json_encode($attributes)),
			esc_attr(json_encode($sourced_attributes)),
			esc_attr(json_encode($block_props)),
			esc_attr($hydration_technique)
		) . '%1$s</wp-block>';

	$template_wrapper = '<template class="wp-inner-blocks">%1$s</template>';

	$empty_template = sprintf($template_wrapper, '');
	$template = sprintf(
		$template_wrapper,
		sprintf($block_wrapper, $block_content . $empty_template)
	);
	return sprintf($block_wrapper, $block_content);
}

add_filter('render_block', 'bhe_block_wrapper', 10, 3);
