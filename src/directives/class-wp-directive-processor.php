<?php

class WP_Directive_Processor extends WP_HTML_Tag_Processor {
	const DIRECTIVE_PREFIX = 'WPX-';

	public $html;

	public $might_have_directives = true;

	public function __construct( $html ) {
		parent::__construct( $html );

		if ( false === stripos( self::DIRECTIVE_PREFIX, $html ) ) {
			$this->might_have_directives = false;
		}
	}

	public function next_directive() {
		if ( false === $this->might_have_directives ) {
			return false;
		}

		while ( $this->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
			$tag_name = $this->get_tag();
			if ( 0 === stripos( self::DIRECTIVE_PREFIX, $tag_name ) ) {
				return true;
			}

			$attribute_directives = $this->get_attribute_names_with_prefix( self::DIRECTIVE_PREFIX );
			if ( 0 < count( $attribute_directives ) ) {
				return true;
			}
		}

		return false;
	}

	public function next_balanced_closer() {
		$depth = 0;

		$tag_name = $this->get_tag();

		if ( self::is_html_void_element( $tag_name ) ) {
			return false;
		}

		while ( $this->next_tag( array( 'tag_name' => $tag_name, 'tag_closers' => 'visit' ) ) ) {
			if ( ! $this->is_tag_closer() ) {
				$depth++;
				continue;
			}

			if ( 0 === $depth ) {
				return true;
			}

			$depth--;
		}

		return false;
	}

	public function get_inner_html() {
		$this->set_bookmark( 'start' );
		if ( ! $this->next_balanced_closer() ) {
			$this->release_bookmark( 'start' );
			return false;
		}
		$this->set_bookmark( 'end' );

		$start = $this->bookmarks['start']->end + 1;
		$end   = $this->bookmarks['end']->start;

		$this->seek( 'start' ); // Return to original position.
		$this->release_bookmark( 'start' );
		$this->release_bookmark( 'end' );

		return substr( $this->html, $start, $end - $start );
	}

	public function set_inner_html( $new_html ) {
		$this->get_updated_html(); // Apply potential previous updates.

		$this->set_bookmark( 'start' );
		if ( ! $this->next_balanced_closer() ) {
			$this->release_bookmark( 'start' );
			return false;
		}
		$this->set_bookmark( 'end' );

		$start = $this->bookmarks['start']->end + 1;
		$end   = $this->bookmarks['end']->start;

		$this->seek( 'start' ); // Return to original position.
		$this->release_bookmark( 'start' );
		$this->release_bookmark( 'end' );

		$this->lexical_updates[] = new WP_HTML_Text_Replacement( $start, $end, $new_html );
		return true;
	}

	public static function is_html_void_element( $tag_name ) {
		switch ( $tag_name ) {
			case 'AREA':
			case 'BASE':
			case 'BR':
			case 'COL':
			case 'EMBED':
			case 'HR':
			case 'IMG':
			case 'INPUT':
			case 'LINK':
			case 'META':
			case 'SOURCE':
			case 'TRACK':
			case 'WBR':
				return true;

			default:
				return false;
		}
	}
}