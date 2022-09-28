import { h } from 'preact';
import { rename } from './directives';

// Reference to the last <wp-inner-blocks> wrapper found.
let innerBlocksFound = null;

// Recursive function that transfoms a DOM tree into vDOM.
export default function toVdom(node) {
	const props = { _static: true }; // Mark vnode as static.
	const attributes = node.attributes;
	const type = node.localName;
	const wpDirectives = { initialRef: node }; // Pass down original static node.

	let hasWpDirectives = false;

	if (node.nodeType === 3) return node.data;
	if (node.nodeType === 8) return null;
	if (type === 'script') return h('script');

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

	const children = [].map.call(node.childNodes, toVdom).filter(exists);

	// Add a reference to the inner blocks vnode.
	if (hasWpDirectives && wpDirectives.blockType && innerBlocksFound) {
		wpDirectives.innerBlocks = innerBlocksFound;
		innerBlocksFound = null;
	}

	if (hasWpDirectives) props.wp = wpDirectives;

	const vnode = h(type, props, children);

	// Save a reference to this vnode if it's an <wp-inner-blocks>` wrapper.
	if (type === 'wp-inner-blocks') {
		innerBlocksFound = vnode;
	}

	return vnode;
}

// Filter existing items.
const exists = (x) => x;
