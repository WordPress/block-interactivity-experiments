<?php
/**
 * WP_Directive_Processor class.
 *
 * @package wp-directives
 */

/**
 * Process WP directives.
 */
class WP_Directive_Processor extends WP_HTML_Tag_Processor {

	/**
	 * The directive prefix.
	 *
	 * @var string
	 */
	protected $prefix;

	/**
	 * The directives found on the current tag.
	 *
	 * @var array
	 */
	protected $directives = array();

	protected $tag_stack = array();

	private $might_have_directives = true;

	public function __construct( $html, $prefix = 'data-wp-' ) {
		parent::__construct( $html );

		$this->prefix = $prefix;

		if ( false === stripos( $html, $this->prefix ) ) {
			$this->might_have_directives = false;
		}
	}

	public function next_directive() {
		if ( false === $this->might_have_directives ) {
			return false;
		}

		while ( $this->next_tag( array( 'tag_closers' => 'visit' ) ) ) {
			$tag_name = strtolower( $this->get_tag() );

			// Is this a tag that closes the latest opening tag?
			if ( $this->is_tag_closer() ) {
				if ( 0 === count( $this->tag_stack ) ) {
					continue;
				}

				list( $latest_opening_tag_name, $attributes ) = end( $this->tag_stack );
				if ( $latest_opening_tag_name === $tag_name ) {
					array_pop( $this->tag_stack );

					// If the matching opening tag didn't have any attribute directives,
					// we move on.
					if ( 0 === count( $attributes ) ) {
						continue;
					}
				}
			} else {
				$attributes = $this->get_attribute_names_with_prefix( $this->prefix );
				$attributes = array_map( array( __CLASS__, 'get_directive_type' ), $attributes );

				// TODO: Filter allowed directives? Pass in constructor?
				// $attributes = array_intersect( $attributes, array_keys( $directives ) );

				// If this is an open tag, and if it either has attribute directives,
				// or if we're inside a tag that does, take note of this tag and its attribute
				// directives so we can call its directive processor once we encounter the
				// matching closing tag.
				if (
					! self::is_html_void_element( $this->get_tag() ) &&
					( 0 !== count( $attributes ) || 0 !== count( $this->tag_stack ) )
				) {
					$this->tag_stack[] = array( $tag_name, $attributes );
				}
			}

			if ( 0 < count( $attributes ) ) {
				$this->directives = $attributes;
				return true;
			}
		}

		return false;
	}

	public function get_directive_names() {
		return $this->directives;
	}

	/**
	 * Given a directive, get its type.
	 *
	 * Removes the part after the dot.
	 *
	 * @param string $attr The attribute directive.
	 * @return string The part before the dot.
	 */
	private static function get_directive_type( $attr ) {
		return strtok( $attr, '.' );
	}

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

		while ( $this->next_tag(
			array(
				'tag_name'    => $tag_name,
				'tag_closers' => 'visit',
			)
		) ) {
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
		$bookmarks = $this->get_balanced_tag_bookmarks();
		if ( ! $bookmarks ) {
			return false;
		}
		list( $start_name, $end_name ) = $bookmarks;

		$start = $this->bookmarks[ $start_name ]->end + 1;
		$end   = $this->bookmarks[ $end_name ]->start;

		$this->seek( $start_name ); // Return to original position.
		$this->release_bookmark( $start_name );
		$this->release_bookmark( $end_name );

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

		$bookmarks = $this->get_balanced_tag_bookmarks();
		if ( ! $bookmarks ) {
			return false;
		}
		list( $start_name, $end_name ) = $bookmarks;

		$start = $this->bookmarks[ $start_name ]->end + 1;
		$end   = $this->bookmarks[ $end_name ]->start;

		$this->seek( $start_name ); // Return to original position.
		$this->release_bookmark( $start_name );
		$this->release_bookmark( $end_name );

		$this->lexical_updates[] = new WP_HTML_Text_Replacement( $start, $end, $new_html );
		return true;
	}

	/**
	 * Return a pair of bookmarks for the current opening tag and the matching closing tag.
	 *
	 * @return array|false A pair of bookmarks, or false if there's no matching closing tag.
	 */
	public function get_balanced_tag_bookmarks() {
		$i = 0;
		while ( array_key_exists( 'start' . $i, $this->bookmarks ) ) {
			++$i;
		}
		$start_name = 'start' . $i;

		$this->set_bookmark( $start_name );
		if ( ! $this->next_balanced_closer() ) {
			$this->release_bookmark( $start_name );
			return false;
		}

		$i = 0;
		while ( array_key_exists( 'end' . $i, $this->bookmarks ) ) {
			++$i;
		}
		$end_name = 'end' . $i;
		$this->set_bookmark( $end_name );

		return array( $start_name, $end_name );
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
