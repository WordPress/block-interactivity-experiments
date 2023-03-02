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

		$this->release_bookmark( 'start' );
		$this->release_bookmark( 'end' );

		return substr( $this->html, $start, $end - $start );
	}

	public function set_inner_html( $new_html ) {
		$this->set_bookmark( 'start' );
		if ( ! $this->next_balanced_closer() ) {
			$this->release_bookmark( 'start' );
			return false;
		}
		$this->set_bookmark( 'end' );

		$start = $this->bookmarks['start']->end + 1;
		$end   = $this->bookmarks['end']->start;

		$this->release_bookmark( 'start' );
		$this->release_bookmark( 'end' );

		$this->lexical_updates[] = new WP_HTML_Text_Replacement( $start, $end, $new_html );
		return true;
	}

	public function get_outer_html( $new_html ) {
		$this->set_bookmark( 'start' );
		if ( ! $this->next_balanced_closer() ) {
			$this->release_bookmark( 'start' );
			return false;
		}
		$this->set_bookmark( 'end' );

		$start = $this->bookmarks['start']->start;
		$end   = $this->bookmarks['end']->end + 1;

		$this->release_bookmark( 'start' );
		$this->release_bookmark( 'end' );

		// For consistency with set_outer_html:
		$this->next_tag();
		return substr( $this->html, $start, $end - $start );
	}

	public function set_outer_html( $new_html ) {
		$this->set_bookmark( 'start' );
		if ( ! $this->next_balanced_closer() ) {
			$this->release_bookmark( 'start' );
			return false;
		}
		$this->set_bookmark( 'end' );

		$start = $this->bookmarks['start']->start;
		$end   = $this->bookmarks['end']->end + 1;

		$this->release_bookmark( 'start' );
		$this->release_bookmark( 'end' );

		$this->next_tag();
		$this->set_bookmark( 'next' );
		$this->lexical_updates[] = new WP_HTML_Text_Replacement( $start, $end, $new_html );
		// updates before the current position are not supported well and we end
		// up at an invalid combination of copied bytes and parsed bytes index. 
		// bookmarks are updated correctly, though, so seek() makes it right again.
		$this->seek('next');
		$this->release_bookmark( 'next' );
		return true;
	}
	
}
