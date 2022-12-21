<?php
/**
 * Plugin Name:       wp-directives
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      5.6
 * Author:            Gutenberg Team
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-directives
 */

require_once __DIR__ . '/src/html/index.php';

require_once __DIR__ . '/src/directives/wp-context.php';
require_once __DIR__ . '/src/directives/wp-show.php';

function wp_directives_loader()
{
	// Load the Admin page.
	require_once plugin_dir_path(__FILE__) . '/src/admin/admin-page.php';
}
add_action('plugins_loaded', 'wp_directives_loader');

/**
 * Add default settings upon activation.
 */
function wp_directives_activate()
{
	add_option('wp_directives_plugin_settings', [
		'client_side_transitions' => false,
	]);
}
register_activation_hook(__FILE__, 'wp_directives_activate');

/**
 * Delete settings on uninstall.
 */
function wp_directives_uninstall()
{
	delete_option('wp_directives_plugin_settings');
}
register_uninstall_hook(__FILE__, 'wp_directives_uninstall');

/**
 * Register the scripts
 */
function wp_directives_register_scripts()
{
	wp_register_script(
		'wp-directive-vendors',
		plugins_url('build/vendors.js', __FILE__),
		[],
		'1.0.0',
		true
	);
	wp_register_script(
		'wp-directive-runtime',
		plugins_url('build/runtime.js', __FILE__),
		['wp-directive-vendors'],
		'1.0.0',
		true
	);

	// For now we can always enqueue the runtime. We'll figure out how to
	// conditionally enqueue directives later.
	wp_enqueue_script('wp-directive-runtime');
}
add_action('wp_enqueue_scripts', 'wp_directives_register_scripts');

function wp_directives_add_wp_link_attribute($block_content)
{
	$site_url = parse_url(get_site_url());
	$w = new WP_HTML_Tag_Processor($block_content);
	while ($w->next_tag('a')) {
		if ($w->get_attribute('target') === '_blank') {
			break;
		}

		$link = parse_url($w->get_attribute('href'));
		if (!isset($link['host']) || $link['host'] === $site_url['host']) {
			$classes = $w->get_attribute('class');
			if (
				str_contains($classes, 'query-pagination') ||
				str_contains($classes, 'page-numbers')
			) {
				$w->set_attribute(
					'wp-link',
					'{ "prefetch": true, "scroll": false }'
				);
			} else {
				$w->set_attribute('wp-link', '{ "prefetch": true }');
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

function wp_directives_client_site_transitions_meta_tag()
{
	if (apply_filters('client_side_transitions', false)) {
		echo '<meta itemprop="wp-client-side-transitions" content="active">';
	}
}
add_action('wp_head', 'wp_directives_client_site_transitions_meta_tag', 10, 0);

/* User code */
function wp_directives_client_site_transitions_option()
{
	$options = get_option('wp_directives_plugin_settings');
	return $options['client_side_transitions'];
}
add_filter(
	'client_side_transitions',
	'wp_directives_client_site_transitions_option'
);

/* Blocks */
add_action('init', function () {
	register_block_type(__DIR__ . '/build/blocks/post-favorite');
	register_block_type(__DIR__ . '/build/blocks/favorites-number');
	register_block_type(__DIR__ . '/build/blocks/tabs');
});

add_filter('render_block_bhe/favorites-number', function ($content) {
	wp_enqueue_script(
		'bhe/favorites-number',
		plugin_dir_url(__FILE__) . 'build/blocks/favorites-number/view.js'
	);
	return $content;
});

/**
 * SSR in PHP
 */

// Utils
$GLOBALS['wpx'] = [];
function wpx($data)
{
	global $wpx;
	$wpx = array_replace_recursive($wpx, $data);
}

add_filter(
	'render_block',
	'wp_process_directives',
	10,
	3
);

function wp_process_directives( $block_content, $block, $instance ) {
	// TODO: Add some directive/components registration mechanism.
	$directives = array(
		'wp-context' => 'process_wp_context',
		'wp-show' => 'process_wp_show',
	);

	$tags = new WP_HTML_Processor( $block_content );

	$context = new WP_Directive_Context;
	while ( $tags->next_tag() ) {
		$tag_name = strtolower( $tags->get_tag() );
		if ( array_key_exists( $tag_name, $directives ) ) {
			call_user_func_array( $directives[$tag_name], array( &$tags, &$context ) );
		} else {
			// Components can't have directives (unless we change our mind about this).
			foreach ( $directives as $directive => $directive_processor ) {
				$attributes = $tags->get_attributes_by_prefix( $directive );
				if ( empty( $attributes ) ) {
					continue;
				}

				call_user_func_array( $directive_processor, array( &$tags, &$context ) );
			}
		}
	}

	if ( ! empty( $context->get_context() ) ) {
		return '<!-- Context: ' . print_r( $context->get_context(), true ) . ' -->' . $block_content;
	}
	return $block_content;
}
