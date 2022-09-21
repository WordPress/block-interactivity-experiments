import { createGlobal } from '../gutenberg-packages/utils';
import { directive } from '../gutenberg-packages/directives';

const blockViews = createGlobal('blockViews', new Map());

// Handle block components.
directive('type', (props) => {
	const {
		type,
		attributes,
		context = {},
		props: blockProps,
		innerBlocks: children,
	} = props.wpBlock;

	// Do nothing if there's no component for this block.
	if (!blockViews.has(type)) return;

	const { Component } = blockViews.get(type);

	// The `tag` prop is used as the new component.
	props.tag = Component;

	// Set component properties.
	props.context = context;
	props.attributes = attributes;
	props.blockProps = blockProps;
	props.children = children;
});
