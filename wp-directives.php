<?php
/**
 * Plugin Name:       wp-directives
 * Version:           0.1.26
 * Requires at least: 6.0
 * Requires PHP:      5.6
 * Author:            Gutenberg Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-directives
 *
 * @package block-interactivity-experiments
 */

// Check if Gutenberg plugin is active.
if ( ! function_exists( 'is_plugin_active' ) ) {
	include_once ABSPATH . 'wp-admin/includes/plugin.php';
}

if ( ! is_plugin_active( 'gutenberg/gutenberg.php' ) ) {
	// Show an error message.
	add_action(
		'admin_notices',
		function () {
			echo sprintf(
				'<div class="error"><p>%s</p></div>',
				__(
					'This plugin requires the Gutenberg plugin to be installed and activated.',
					'wp-directives'
				)
			);
		}
	);

	// Deactivate the plugin.
	deactivate_plugins( plugin_basename( __FILE__ ) );
	return;
}

require_once __DIR__ . '/src/directives/wp-html.php';

require_once __DIR__ . '/src/directives/class-wp-directive-context.php';
require_once __DIR__ . '/src/directives/class-wp-directive-store.php';
require_once __DIR__ . '/src/directives/wp-process-directives.php';

require_once __DIR__ . '/src/directives/attributes/wp-bind.php';
require_once __DIR__ . '/src/directives/attributes/wp-context.php';
require_once __DIR__ . '/src/directives/attributes/wp-class.php';
require_once __DIR__ . '/src/directives/attributes/wp-html.php';
require_once __DIR__ . '/src/directives/attributes/wp-style.php';
require_once __DIR__ . '/src/directives/attributes/wp-text.php';

/**
 * Load includes.
 */
function wp_directives_loader() {
	// Load the Admin page.
	require_once plugin_dir_path( __FILE__ ) . '/src/admin/admin-page.php';
}
add_action( 'plugins_loaded', 'wp_directives_loader' );

/**
 * Add default settings upon activation.
 */
function wp_directives_activate() {
	add_option(
		'wp_directives_plugin_settings',
		array(
			'client_side_navigation' => false,
		)
	);
}
register_activation_hook( __FILE__, 'wp_directives_activate' );

/**
 * Delete settings on uninstall.
 */
function wp_directives_uninstall() {
	delete_option( 'wp_directives_plugin_settings' );
}
register_uninstall_hook( __FILE__, 'wp_directives_uninstall' );

/**
 * Register the scripts
 */
function wp_directives_register_scripts() {
	wp_register_script(
		'wp-directive-vendors',
		plugins_url( 'build/vendors.js', __FILE__ ),
		array(),
		'1.0.0',
		true
	);
	wp_register_script(
		'wp-directive-runtime',
		plugins_url( 'build/runtime.js', __FILE__ ),
		array( 'wp-directive-vendors' ),
		'1.0.0',
		true
	);

	// For now we can always enqueue the runtime. We'll figure out how to
	// conditionally enqueue directives later.
	wp_enqueue_script( 'wp-directive-runtime' );
}
add_action( 'wp_enqueue_scripts', 'wp_directives_register_scripts' );

/**
 * Add data-wp-link attribute.
 *
 * @param string $block_content Block content.
 * @return string Filtered block content.
 */
function wp_directives_add_wp_link_attribute( $block_content ) {
	$site_url = parse_url( get_site_url() );
	$w        = new WP_HTML_Tag_Processor( $block_content );
	while ( $w->next_tag( 'a' ) ) {
		if ( $w->get_attribute( 'target' ) === '_blank' ) {
			break;
		}

		$link = parse_url( $w->get_attribute( 'href' ) );
		if ( ! isset( $link['host'] ) || $link['host'] === $site_url['host'] ) {
			$classes = $w->get_attribute( 'class' );
			if (
				str_contains( $classes, 'query-pagination' ) ||
				str_contains( $classes, 'page-numbers' )
			) {
				$w->set_attribute(
					'data-wp-link',
					'{ "prefetch": true, "scroll": false }'
				);
			} else {
				$w->set_attribute( 'data-wp-link', '{ "prefetch": true }' );
			}
		}
	}
	return (string) $w;
}
// We go only through the Query Loops and the template parts until we find a better solution.
add_filter(
	'render_block_core/query',
	'wp_directives_add_wp_link_attribute',
	10,
	1
);
add_filter(
	'render_block_core/template-part',
	'wp_directives_add_wp_link_attribute',
	10,
	1
);

/**
 * Check whether client-side navigation has been opted into.
 *
 * @return bool Whether client-side navigation is enabled.
 */
function wp_directives_get_client_side_navigation() {
	static $client_side_navigation = null;
	if ( is_null( $client_side_navigation ) ) {
		$client_side_navigation = (bool) apply_filters( 'client_side_navigation', false );
	}
	return $client_side_navigation;
}

/**
 * Print client-side navigation meta tag if enabled.
 */
function wp_directives_add_client_side_navigation_meta_tag() {
	if ( wp_directives_get_client_side_navigation() ) {
		echo '<meta itemprop="wp-client-side-navigation" content="active">';
	}
}
add_action( 'wp_head', 'wp_directives_add_client_side_navigation_meta_tag' );

/**
 * Obtain client-side navigation option.
 *
 * @return bool Whether client-side navigation is enabled.
 */
function wp_directives_client_site_navigation_option() {
	$options = get_option( 'wp_directives_plugin_settings' );
	return (bool) $options['client_side_navigation'];
}
add_filter(
	'client_side_navigation',
	'wp_directives_client_site_navigation_option',
	9
);

/**
 * Mark interactive blocks if client-side navigation is enabled.
 *
 * @param string   $block_content Block content.
 * @param array    $block Block.
 * @param WP_Block $instance Block instance.
 * @return string Filtered block.
 */
function wp_directives_mark_interactive_blocks( $block_content, $block, $instance ) {
	if ( wp_directives_get_client_side_navigation() ) {
		return $block_content;
	}

	// Append the `data-wp-ignore` attribute for inner blocks of interactive blocks.
	if ( isset( $instance->parsed_block['isolated'] ) ) {
		$w = new WP_HTML_Tag_Processor( $block_content );
		$w->next_tag();
		$w->set_attribute( 'data-wp-ignore', '' );
		$block_content = (string) $w;
	}

	// Return if it's not interactive.
	if ( ! block_has_support( $instance->block_type, array( 'interactivity' ) ) ) {
		return $block_content;
	}

	// Add the `data-wp-interactive` attribute if it's interactive.
	$w = new WP_HTML_Tag_Processor( $block_content );
	$w->next_tag();
	$w->set_attribute( 'data-wp-interactive', '' );

	return (string) $w;
}
add_filter( 'render_block', 'wp_directives_mark_interactive_blocks', 10, 3 );

/**
 * Add a flag to mark inner blocks of isolated interactive blocks.
 *
 * @param array         $parsed_block Parsed block.
 * @param array         $source_block Source block.
 * @param WP_Block|null $parent_block Parent block.
 */
function wp_directives_inner_blocks( $parsed_block, $source_block, $parent_block ) {
	if (
		isset( $parent_block ) &&
		block_has_support(
			$parent_block->block_type,
			array(
				'interactivity',
				'isolated',
			)
		)
	) {
		$parsed_block['isolated'] = true;
	}
	return $parsed_block;
}
add_filter( 'render_block_data', 'wp_directives_inner_blocks', 10, 3 );

/**
 * Process directives in block.
 *
 * @param string $block_content Block content.
 * @return string Filtered block content.
 */
function process_directives_in_block( $block_content ) {
	// TODO: Add some directive/components registration mechanism.
	$directives = array(
		'data-wp-context' => 'process_wp_context',
		'data-wp-bind'    => 'process_wp_bind',
		'data-wp-class'   => 'process_wp_class',
		'data-wp-html'    => 'process_wp_html',
		'data-wp-style'   => 'process_wp_style',
		'data-wp-text'    => 'process_wp_text',
	);

	$tags = new WP_Directive_Processor( $block_content );
	$tags = wp_process_directives( $tags, 'data-wp-', $directives );
	return $tags->get_updated_html();
}
add_filter(
	'render_block',
	'process_directives_in_block',
	10,
	1
);

// TODO: check if priority 9 is enough.
// TODO: check if `wp_footer` is the most appropriate hook.
add_action( 'wp_footer', array( 'WP_Directive_Store', 'render' ), 9 );
