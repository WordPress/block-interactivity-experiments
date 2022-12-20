<?php

function wp_directives_register_settings()
{
	// Register a new setting for the plugin
	register_setting(
		'wp_directives',
		'wp_directives_plugin_settings',
		'wp_directives_options_validate'
	);

	// Add a new section to the plugin's settings page
	add_settings_section(
		'wp_directives_section_client',
		__('Client-side transitions', 'wp-directives'),
		'wp_directives_section_client_cb',
		'wp_directives'
	);

	// Add a field to the new section to toggle client-side transitions
	add_settings_field(
		'wp_directives_field_client_transitions',
		__('Client-side transitions', 'wp-directives'),
		'wp_directives_field_client_transitions_cb',
		'wp_directives',
		'wp_directives_section_client'
	);
}
add_action('admin_init', 'wp_directives_register_settings');

function wp_directives_section_client_cb()
{
	echo '<p>' .
		__(
			'Configure the client-side transitions for the plugin.',
			'wp-directives'
		) .
		'</p>';
}

function wp_directives_field_client_transitions_cb()
{
	$options = get_option('wp_directives_plugin_settings');
	$value = isset($options['client_side_transitions'])
		? $options['client_side_transitions']
		: 0;
	echo '<label for="wp_directives_field_client_transitions">';
	echo '<input type="checkbox" id="wp_directives_field_client_transitions" name="wp_directives_plugin_settings[client_side_transitions]" value="1" ' .
		checked(1, $value, false) .
		'>';
	echo ' ' . __('Activate client-side transitions', 'wp-directives');
	echo '</label>';
}

function wp_directives_options_page()
{
	// Check that the user has the necessary permissions
	if (!current_user_can('manage_options')) {
		wp_die(
			__(
				'You do not have sufficient permissions to access this page.',
				'wp-directives'
			)
		);
	}// Output the HTML for the settings page
	?>
	<div class="wrap">
			<h1><?php _e('WP Directives Options', 'wp-directives'); ?></h1>
			<form action="options.php" method="post">
					<?php
     // Output the hidden fields and settings sections
     settings_fields('wp_directives');
     do_settings_sections('wp_directives');
     // Output the submit button
     submit_button();?>
			</form>
	</div>
	<?php
}

function wp_directives_add_options_page()
{
	add_options_page(
		__('WP Directives Options', 'wp-directives'),
		__('WP Directives', 'wp-directives'),
		'manage_options',
		'wp_directives',
		'wp_directives_options_page'
	);
}
add_action('admin_menu', 'wp_directives_add_options_page');
