import { createElement as h } from 'preact/compat'; 
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

	props.children = [
		h(Component, { context, attributes, blockProps, children }),
	];
});
