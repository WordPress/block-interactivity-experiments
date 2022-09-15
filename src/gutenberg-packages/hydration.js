import { hydrate, createElement } from 'preact/compat';
import { createGlobal } from './utils';
import toVdom from './to-vdom';
import { directive } from './directives';

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
		createElement(Component, { context, attributes, blockProps, children }),
	];
});

const dom = document.querySelector('.wp-site-blocks');
const vdom = toVdom(dom).props.children;

setTimeout(() => console.log('hydrated', hydrate(vdom, dom)), 3000);
