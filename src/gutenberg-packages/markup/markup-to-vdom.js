import parseMarkup from 'preact-markup/src/parse-markup';
import toVdom from './to-vdom';
import processWpBlock from './process-wp-block';

const EMPTY_OBJ = {};

/** Convert markup into a virtual DOM.
 *	@param {String} markup		HTML or XML markup (indicate via `type`)
 *	@param {String} [type=xml]	A type to use when parsing `markup`. Either `xml` or `html`.
 *	@param {Function} reviver	The JSX/hyperscript reviver (`h` function) to use. For example, Preact's `h` or `ReactDOM.createElement`.
 *	@param {Object} [map]		Optional map of custom element names to Components or variant element names.
 */
export default function markupToVdom(markup, type, reviver, map, options) {
	let dom = type === 'dom' ? markup : parseMarkup(markup, type);

	if (dom && dom.error) {
		throw new Error(dom.error);
	}

	let body = (dom && dom.body) || dom;
	visitor.map = map || EMPTY_OBJ;
	let vdom = body && toVdom(body, visitor, reviver, options);
	visitor.map = null;

	return (vdom && vdom.props && vdom.props.children) || null;
}

function toCamelCase(name) {
	return name.replace(/-(.)/g, (match, letter) => letter.toUpperCase());
}

function visitor(vNode, domNode) {
	let name = (vNode.type || '').toLowerCase(),
		map = visitor.map;

	// eslint-disable-next-line no-prototype-builtins
	if (name === 'wp-block' && map) {
		processWpBlock({ vNode, domNode, map });
		// vNode.type = WpBlock;
		vNode.props = Object.keys(vNode.props || {}).reduce((attrs, attrName) => {
			const key = !attrName.startsWith('data-')
				? toCamelCase(attrName)
				: attrName;
			attrs[key] = vNode.props[attrName];
			return attrs;
		}, {});
	} else {
		vNode.type = name.replace(/[^a-z0-9-]/i, '');
	}
}
