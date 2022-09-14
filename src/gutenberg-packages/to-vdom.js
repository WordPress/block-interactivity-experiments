import { h } from 'preact';

// Callbacks to run after node -> vNode tranform.
const hooks = {};

// Expose function to add hooks.
export const addHook = (name, cb) => {
	hooks[name] = cb;
}

// Recursive function that transfoms a DOM tree into vDOM.
export default function toVdom(n) {
	if (n.nodeType === 3) return n.data;
	if (n.nodeType !== 1) return null;
	
	// Get the node type.
	const type = String(n.nodeName).toLowerCase();

	if (type === 'script') return null;

	// Extract props from node attributes.
	const props = {};
	for (const { name, value } of n.attributes) {
		props[name] = value;
	}

	// Walk child nodes and return vDOM children.
	const children = [].map.call(n.childNodes, toVdom).filter(exists)

	// Create vNode.
	const vNode = h( type, props, children );

	// Run toVdom hooks, passing node and vNode.
	for (const name in hooks) {
		hooks[name](vNode, n);
	}

	return vNode;
}

const exists = (x) => x;
