<?php
/**
 * Functions for admin page.
 *
 * @package block-interactivity-experiments
 */

/**
 * Register admin menu.
 */
function wp_directives_register_menu() {
	add_options_page(
		__( 'WP Directives', 'wp-directives' ),
		__( 'WP Directives', 'wp-directives' ),
		'manage_options',
		'wp-directives-plugin',
		'wp_directives_render_admin_page'
	);
}
add_action( 'admin_menu', 'wp_directives_register_menu' );

/**
 * Render admin page.
 */
function wp_directives_render_admin_page() {
	?>
	<div class="wrap">
		<h2>WP Directives</h2>
		<form method="POST" action="options.php">
			<?php
			settings_fields( 'wp_directives_plugin_settings' );
			do_settings_sections( 'wp_directives_plugin_page' );
			?>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

/**
 * Register settings.
 */
function wp_directives_register_settings() {
	register_setting(
		'wp_directives_plugin_settings',
		'wp_directives_plugin_settings',
		array(
			'type'              => 'object',
			'default'           => array(
				'client_side_navigation' => false,
			),
			'sanitize_callback' => 'wp_directives_validate_settings',
		)
	);

	add_settings_section(
		'wp_directives_plugin_section',
		'',
		null, // TODO: This is supposed to be a callable.
		'wp_directives_plugin_page'
	);

	add_settings_field(
		'client_side_navigation',
		__( 'Client Side Navigation', 'wp-directives' ),
		'wp_directives_client_side_navigation_input',
		'wp_directives_plugin_page',
		'wp_directives_plugin_section'
	);
}
add_action( 'admin_init', 'wp_directives_register_settings' );

/**
 * Validate settings.
 *
 * @param array $input Unvalidated setting.
 * @return array Validated setting.
 */
function wp_directives_validate_settings( $input ) {
	$output                           = get_option( 'wp_directives_plugin_settings' );
	$output['client_side_navigation'] = ! empty( $input['client_side_navigation'] );
	return $output;
}

/**
 * Render field for client-side navigation.
 */
function wp_directives_client_side_navigation_input() {
	$options = get_option( 'wp_directives_plugin_settings' );
	?>

	<input type="checkbox"
		name="wp_directives_plugin_settings[client_side_navigation]"
		<?php checked( $options['client_side_navigation'] ); ?>
	>

	<?php
}
