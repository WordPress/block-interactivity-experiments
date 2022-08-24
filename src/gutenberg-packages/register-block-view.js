// We are importing manually the hydration code here, but this should not be
// included on each block bundle, it should be sent only once.
import './hydration';

// These functions need to be included in each block bundle because block
// bundles must not have any hard dependency.
const createGlobal = (name, initialValue) => {
	['wp', 'view', name].reduce((obj, name, i) => {
		if (typeof obj[name] === 'undefined')
			obj[name] = i === 2 ? initialValue : {};
		return obj[name];
	}, window);
	return window.wp.view[name];
};

const blockViews = createGlobal('blockViews', new Map());
const elementsToHydrate = createGlobal('elementsToHydrate', new Map());

export default (name, Component, options) => {
	blockViews.set(name, { Component, options });

	if (elementsToHydrate.has(name)) {
		for (const element of elementsToHydrate.get(name)) {
			element.hydrate();
		}
	}
};
