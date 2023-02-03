<?php

class WP_Directive_Store {
	private static array $store = array();

	static function get_data() {
		return self::$store;
	}

	static function merge_data( $data ) {
		self::$store = array_merge_recursive( self::$store, $data );
	}

	static function serialize() {
		return json_enconde( self::$store );
	}

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
