<?php

class WP_Directive_Store {
	private static array $store = array();

	static function get_data() {
		return self::$store;
	}

	static function merge_data( $data ) {
		self::$store = array_merge_recursive( selfs::$store, $data );
	}
}
