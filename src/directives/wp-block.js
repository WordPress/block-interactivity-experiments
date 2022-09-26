import { useMemo } from 'preact/hooks';
import { createGlobal, matcherFromSource } from '../gutenberg-packages/utils';
import { directive } from '../gutenberg-packages/directives';

const blockViews = createGlobal('blockViews', new Map());

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

const toCamelCase = (str) =>
	str.replace(/-(.)/g, (_, initial) => initial.toUpperCase());

// Handle block components.
directive('blockType', (props) => {
	const {
		blockType,
		blockAttributes,
		blockSourcedAttributes,
		context = {},
		blockProps,
		innerBlocks: children,
		ref,
	} = props.wp;

	props.blockProps = useMemo(
		() => ({
			style: cssObject(blockProps.style),
			className: blockProps.class,
		}),
		[blockProps.class, blockProps.style]
	);

	props.attributes = blockAttributes;
	useMemo(() => {
		for (const attr in blockSourcedAttributes) {
			props.attributes[attr] = matcherFromSource(
				blockSourcedAttributes[attr]
			)(ref);
		}
	}, [blockSourcedAttributes]);

	// Do nothing if there's no component for this block.
	if (!blockViews.has(blockType)) return;

	const { Component } = blockViews.get(blockType);

	// The `tag` prop is used as the new component.
	props.tag = Component;

	// Set component properties.
	props.context = context;
	props.children = children;
});
