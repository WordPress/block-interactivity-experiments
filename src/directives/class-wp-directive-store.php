<?php
/**
 * WP_Directive_Store class.
 *
 * @package wp-directives
 */

/**
 * Static class to manipulate and render store data.
 */
class WP_Directive_Store {

	/**
	 * Store.
	 *
	 * @var array
	 */
	private static $store = array();

	/**
	 * Get store data.
	 *
	 * @return array
	 */
	static function get_data() {
		return self::$store;
	}

	/**
	 * Merge data.
	 *
	 * @param array $data Data to merge.
	 */
	static function merge_data( $data ) {
		self::$store = array_replace_recursive( self::$store, $data );
	}

	/**
	 * Serialize store data to JSON.
	 *
	 * @return string|false Serialized JSON data.
	 */
	static function serialize() {
		return wp_json_encode( self::$store );
	}

	/**
	 * Reset static variable.
	 */
	static function reset() {
		self::$store = array();
	}

	/**
	 * Render the store data.
	 */
	static function render() {
		if ( empty( self::$store ) ) {
			return;
		}

		// TODO: find a better ID for the script tag.
		$id    = 'store';
		$store = self::serialize();
		echo "<script id=\"$id\" type=\"application/json\">$store</script>";
	}
}
