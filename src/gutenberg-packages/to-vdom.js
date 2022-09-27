import { h } from 'preact';
import { matcherFromSource } from './utils';

// Prefix used by WP directives.
const prefix = 'data-wp-block-';

// Reference to the last <wp-inner-blocks> wrapper found.
let innerBlocksFound = null;

// Recursive function that transfoms a DOM tree into vDOM.
export default function toVdom(n) {
	if (n.nodeType === 3) return n.data;
	if (n.nodeType !== 1) return null;

	// Get the node type.
	const type = String(n.nodeName).toLowerCase();

	if (type === 'script') return h('script');

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

		// Handle special cases with wpBlock props.
		handleSourcedAttributes(props, n);
		handleBlockProps(props);
	}

	// Walk child nodes and return vDOM children.
	const children = [].map.call(n.childNodes, toVdom).filter(exists);

	// Create an array of inner blocks if they are found in children.
	const isInnerBlock = ({ props }) => props && 'wp-inner-block' in props;
	if (children.some(isInnerBlock)) {
		innerBlocksFound = children.filter(isInnerBlock);
	}

	// Add inner blocks.
	if (wpBlock.type && innerBlocksFound) {
		wpBlock.innerBlocks = innerBlocksFound;
		innerBlocksFound = null;

		// Set wpBlock prop again, just in case it's missing.
		props.wpBlock = wpBlock;
	}

	// Create vNode. Note that all `wpBlock` props should exist now to make directives work.
	const vNode = h(type, props, children);

	return vNode;
}

const getWpBlockPropName = (name) => toCamelCase(name.replace(prefix, ''));

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

// Adapt block props to React/Preact format.
const handleBlockProps = ({ wpBlock }) => {
	if (!wpBlock.props) return;

	const { class: className, style } = wpBlock.props;
	wpBlock.props = { className, style: cssObject(style) };
};

// Return an object of camelCased CSS properties.
const cssObject = (cssText) => {
	if (!cssText) return {};

	const el = document.createElement('div');
	const { style } = el;
	style.cssText = cssText;

	const output = {};
	for (let i = 0; i < style.length; i += 1) {
		const key = style.item(0);
		output[toCamelCase(key)] = style.getPropertyValue(key);
	}

	el.remove();
	return output;
};

const exists = (x) => x;

const toCamelCase = (str) =>
	str.replace(/-(.)/g, (_, initial) => initial.toUpperCase());
