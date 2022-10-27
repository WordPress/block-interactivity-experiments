// This file should not be used directly. It is used by the hydration benchmark
// which uses the webpack-bundled version of this file.

import { hydrate } from 'preact';
import toVdom from '../src/runtime/vdom';
import { createRootFragment } from '../src/runtime/utils';

function runHydration() {
	// Create the root fragment to hydrate everything.
	rootFragment = createRootFragment(document.documentElement, document.body);
	const body = toVdom(document.body);
	hydrate(body, rootFragment);
}

window.__runHydration = runHydration;
