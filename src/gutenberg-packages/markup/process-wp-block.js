export default function processWpBlock(node, map) {
	const blockType = node.props['data-wp-block-type'];
	const Component = map[blockType];

	if (!Component) return node;

	node.type = Component;
	node.props = {
		// ...node.props,
		attributes: {},
		context: {},
		blockProps: getBlockProps(node),
		children: getChildren(node),
	};
}

function getBlockProps(node) {
	const { class: className, style } = JSON.parse(
		node.props['data-wp-block-props']
	);
	return { className, style: getStyleProp(style) };
}

function getChildren(node) {
	return getChildrenFromWrapper(node.props.children) || node.props.children;
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