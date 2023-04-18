import { hydrate } from 'preact';
import { toVdom, hydratedIslands } from './vdom';
import { createRootFragment } from './utils';
import { directivePrefix } from './constants';

// Initialize the router with the initial DOM.
export const init = async () => {
	document.querySelectorAll(`[${directivePrefix}island]`).forEach((node) => {
		if (!hydratedIslands.has(node)) {
			const fragment = createRootFragment(node.parentNode, node);
			const vdom = toVdom(node);
			hydrate(vdom, fragment);
		}
	});
};
