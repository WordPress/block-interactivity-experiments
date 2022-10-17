import { hydrate } from 'preact';
import registerDirectives from './directives';
import registerComponents from './components';
import toVdom from './vdom';
import { createRootFragment } from './utils';

/**
 * Initialize the initial vDOM.
 */
document.addEventListener('DOMContentLoaded', async () => {
	registerDirectives();
	registerComponents();

	// Create the root fragment to hydrate everything.
	const rootFragment = createRootFragment(
		document.documentElement,
		document.body
	);

	const vdom = toVdom(document.body);
	hydrate(vdom, rootFragment);

	console.log('hydrated!');
});
