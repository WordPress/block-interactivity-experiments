<?php
/**
 * Plugin Name:       block-hydration-experiments
 * Version:           0.1.0
 * Requires at least: 5.9
 * Requires PHP:      7.0
 * Author:            Gutenberg Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       block-hydration-experiments
 */
function block_hydration_experiments_init() {
	register_block_type( plugin_dir_path( __FILE__ ) . 'build/blocks/interactive-child/' );
	register_block_type( plugin_dir_path( __FILE__ ) . 'build/blocks/interactive-parent/' );
	register_block_type( plugin_dir_path( __FILE__ ) . 'build/blocks/non-interactive-parent/' );
}
add_action( 'init', 'block_hydration_experiments_init' );

function bhe_block_wrapper( $block_content, $block, $instance ) {
	// We might want to use a flag from block.json as the criterion here.
	if ( ! in_array(
		$block['blockName'],
		array(
			'bhe/interactive-parent',
			'bhe/interactive-child'
		),
		true
	) ) {
		return $block_content;
	}

	$block_type = $instance->block_type;
	$attr_definitions = $block_type->attributes;

	$attributes = array();
	$sourced_attributes = array();
	foreach( $attr_definitions as $attr => $definition ) {
		if ( ! empty( $definition['frontend'] ) ) {
			if ( ! empty( $definition['source'] ) ) {
				$sourced_attributes[ $attr ] = array(
					"selector" => $definition['selector'], // TODO: Guard against unset.
					"source" => $definition['source']
				);
			} else {
				if ( array_key_exists ( $attr, $block['attrs'] ) ) {
					$attributes[ $attr ] = $block['attrs'][$attr];
				} else if ( isset( $definition['default'] ) ) {
					$attributes[ $attr ] = $definition['default'];
				}
			}
		}
	}

	$block_wrapper = sprintf(
		'<gutenberg-interactive-block ' .
		'data-gutenberg-block-type="%1$s" ' .
		'data-gutenberg-uses-block-context="%2$s" ' .
		'data-gutenberg-provides-block-context="%3$s" ' .
		'data-gutenberg-attributes="%4$s" ' .
		'data-gutenberg-sourced-attributes="%5$s" ' .
		'data-gutenberg-hydrate="idle">',
		esc_attr( $block['blockName'] ),
		esc_attr( json_encode( $block_type->uses_context ) ),
		esc_attr( json_encode( $block_type->provides_context ) ),
		esc_attr( json_encode( $attributes ) ),
		esc_attr( json_encode( $sourced_attributes ) )
	) . '%1$s</gutenberg-interactive-block>';

	$template_wrapper = '<template class="gutenberg-inner-blocks">%1$s</template>';

	$empty_template = sprintf( $template_wrapper, '' );
	$template       = sprintf( $template_wrapper, sprintf( $block_wrapper, $block_content . $empty_template ) );
	return sprintf( $block_wrapper, $block_content );
}

add_filter( 'render_block', 'bhe_block_wrapper', 10, 3 );