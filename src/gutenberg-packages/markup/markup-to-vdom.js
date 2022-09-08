import parseMarkup from 'preact-markup/src/parse-markup';
import toVdom from 'preact-markup/src/to-vdom';

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

function visitor(node) {
	let name = (node.type || '').toLowerCase(),
		map = visitor.map;

	// eslint-disable-next-line no-prototype-builtins
	if (name === 'wp-block' && map) {
		processWpBlock(node, map);
		// node.type = WpBlock;
		node.props = Object.keys(node.props || {}).reduce((attrs, attrName) => {
			const key = !attrName.startsWith('data-')
				? toCamelCase(attrName)
				: attrName;
			attrs[key] = node.props[attrName];
			return attrs;
		}, {});
	} else {
		node.type = name.replace(/[^a-z0-9-]/i, '');
	}
}

function processWpBlock(node, map) {
	// const componentName = node.props['data-wp-block-type'];
	// const attributes = JSON.parse(node.props['data-wp-block-attributes']) || {};
	// const blockProps = JSON.parse(node.props['data-wp-block-props']) || {};

	const Component = map['wp-block'];

	if (!Component) return node;

	node.type = Component;
	// node.props = {
	// 	...node.props,
	// 	attributes,
	// 	blockProps,
	// 	context: {},
	// };

	// // Get component children from wrapper.
	// const children = getChildrenFromWrapper(node.props.children);
	// if (children) {
	// 	console.log(children);
	// 	node.props.children = children;
	// }
}

function getChildrenFromWrapper(children) {
	if (!children?.length) return null;

	for (const child of children) {
		if (isChildrenWrapper(child)) return child.props?.children || [];
	}

	// Try with the next nesting level.
	return getChildrenFromWrapper(
		[].concat(...children.map((child) => child?.props?.children || []))
	);
}

function isChildrenWrapper(node) {
	return node.type === 'wp-inner-blocks';
}
