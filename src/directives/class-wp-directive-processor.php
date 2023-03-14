<?php

class WP_Directive_Processor extends WP_HTML_Tag_Processor {
	/**
	 * Find the matching closing tag for an opening tag.
	 *
	 * When called while on an open tag, traverse the HTML until we find
	 * the matching closing tag, respecting any in-between content, including
	 * nested tags of the same name. Return false when called on a closing or
	 * void tag, or if no matching closing tag was found.
	 *
	 * @return bool True if a matching closing tag was found.
	 */
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

	/**
	 * Return the content between two balanced tags.
	 *
	 * When called on an opening tag, return the HTML content found between
	 * that opening tag and its matching closing tag.
	 *
	 * @return string The content between the current opening and its matching closing tag.
	 */
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

	/**
	 * Set the content between two balanced tags.
	 *
	 * When called on an opening tag, set the HTML content found between
	 * that opening tag and its matching closing tag.
	 *
	 * @param string $new_html The string to replace the content between the matching tags with.
	 * @return bool            Whether the content was successfully replaced.
	 */
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

	/**
	 * Whether a given HTML element is void (e.g. <br>).
	 *
	 * @param string $tag_name The element in question.
	 * @return bool True if the element is void.
	 *
	 * @see https://html.spec.whatwg.org/#elements-2
	 */
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