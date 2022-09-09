import { matcherFromSource } from '../utils';

export default function processWpBlock({ vNode, domNode, map }) {
	const blockType = vNode.props['data-wp-block-type'];
	const Component = map[blockType];

	if (!Component) return vNode;

	vNode.type = Component;
	vNode.props = {
		// ...vNode.props,
		attributes: getAttributes(vNode, domNode),
		context: {},
		blockProps: getBlockProps(vNode),
		children: getChildren(vNode),
	};
}

function getBlockProps(vNode) {
	const { class: className, style } = JSON.parse(
		vNode.props['data-wp-block-props']
	);
	return { className, style: getStyleProp(style) };
}

function getAttributes(vNode, domNode) {
	// Get the block attributes.
	const attributes = JSON.parse(
		vNode.props['data-wp-block-attributes']
	);

	// Add the sourced attributes to the attributes object.
	const sourcedAttributes = JSON.parse(
		vNode.props['data-wp-block-sourced-attributes']
	);
	for (const attr in sourcedAttributes) {
		attributes[attr] = matcherFromSource(sourcedAttributes[attr])(
			domNode
		);
	}

    return attributes;
}

function getChildren(vNode) {
	return getChildrenFromWrapper(vNode.props.children) || vNode.props.children;
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

function isChildrenWrapper(vNode) {
	return vNode.type === 'wp-inner-blocks';
}

function toCamelCase(name) {
	return name.replace(/-(.)/g, (match, letter) => letter.toUpperCase());
}

export function getStyleProp(cssText) {
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
}