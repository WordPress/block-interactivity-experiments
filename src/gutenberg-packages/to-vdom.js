import { h } from 'preact';
import { matcherFromSource } from './utils';

// Callbacks to run after node -> vNode tranform.
const hooks = {};

// Expose function to add hooks.
export const addHook = (name, cb) => {
	hooks[name] = cb;
}

// Prefix used by WP directives.
const prefix = 'data-wp-block-';

// Reference to the last <inner-blocks> wrapper found.
let innerBlocksFound = null;

// Recursive function that transfoms a DOM tree into vDOM.
export default function toVdom(n) {
	if (n.nodeType === 3) return n.data;
	if (n.nodeType !== 1) return null;

	// Get the node type.
	const type = String(n.nodeName).toLowerCase();

	if (type === 'script') return null;

	// Extract props from node attributes.
	const props = {};
	const wpBlock = {};
	for (const { name, value } of n.attributes) {
		// Store block directives in `wpBlock`.
		if (name.startsWith(prefix)) {
			const propName = getWpBlockPropName(name);
			try {
				wpBlock[propName] = JSON.parse(value);
			} catch (e) {
				wpBlock[propName] = value;
			}
		}
		// Add the original property, and the rest of them.
		props[name] = value;
	}

	// Include wpBlock prop if needed.
	if (Object.keys(wpBlock).length) {
		props.wpBlock = wpBlock;
	}

	// Find and get sourced attributes.
	handleSourcedAttributes(props, n);

	// Walk child nodes and return vDOM children.
	const children = [].map.call(n.childNodes, toVdom).filter(exists);

	// Add inner blocks.
	if (type === 'wp-block' && innerBlocksFound) {
		wpBlock.innerBlocks = innerBlocksFound;
		props.wpBlock = wpBlock;
	}
	
	// Create vNode. Note that all `wpBlock` props should exist now to make directives work.
	const vNode = h(type, props, children);

	// Save a renference to this vNode if it's an <inner-blocks>` wrapper.
	innerBlocksFound = vNode;

	// TODO: remove this call and use directives (Option Hooks).
	for (const name in hooks) hooks[name](vNode, n);

	return vNode;
}

// Get sourced attributes and place them in `attributes`.
const handleSourcedAttributes = ({ wpBlock }, domNode) => {
	if (wpBlock && wpBlock.sourcedAttributes) {
		const { sourcedAttributes, attributes = {} } = wpBlock;
		for (const attr in sourcedAttributes) {
			attributes[attr] = matcherFromSource(sourcedAttributes[attr])(
				domNode
			);
		}
		wpBlock.attributes = attributes;
	}
};

const getWpBlockPropName = (name) =>
	name
		.replace(prefix, '')
		.replace(/-(.)/g, (_, initial) => initial.toUpperCase());

const exists = (x) => x;