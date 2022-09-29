import { h } from 'preact';
import { rename } from './directives';

// Reference to the last set of inner blocks found.
let innerBlocksFound = null;

// Recursive function that transfoms a DOM tree into vDOM.
export default function toVdom(node) {
	const props = { _static: true }; // Mark vnode as static.
	const attributes = node.attributes;
	const wpDirectives = { initialRef: node }; // Pass down original static node.
	let hasWpDirectives = false;

	if (node.nodeType === 3) return node.data;
	if (node.nodeType === 8) return null;
	if (node.localName === 'script') return h('script');

	for (let i = 0; i < attributes.length; i++) {
		const name = attributes[i].name;
		if (name.startsWith('wp-')) {
			hasWpDirectives = true;
			let value = attributes[i].value;
			try {
				value = JSON.parse(value);
			} catch (e) {}
			wpDirectives[rename(name)] = value;
		} else {
			props[name] = attributes[i].value;
		}
	}

	// Walk child nodes and return vDOM children.
	const children = [].map.call(node.childNodes, toVdom).filter(exists);

	// Create an array of inner blocks if they are found in children. All nodes in
	// between (e.g., line breaks, white spaces, etc.) are preserved in order to
	// prevent hydration failure.
	if (children.some(isInnerBlock)) {
		const first = children.findIndex(isInnerBlock);
		const last = children.findLastIndex(isInnerBlock);
		innerBlocksFound = children.slice(first, last + 1);
	}

	// Add a reference to the inner blocks vnode.
	if (hasWpDirectives && wpDirectives.blockType && innerBlocksFound) {
		wpDirectives.innerBlocks = innerBlocksFound;
		innerBlocksFound = null;
	}

	if (hasWpDirectives) props.wp = wpDirectives;

	return h(node.localName, props, children);
}

// Filter existing items.
const exists = (x) => x;

// Check for inner blocks attribute in a vnode.
// TODO: Avoid traversing the vnode props so many times.
const isInnerBlock = ({ props }) => props?.wp && 'innerBlock' in props.wp;
