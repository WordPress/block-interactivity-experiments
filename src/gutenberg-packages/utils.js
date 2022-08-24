import { text } from 'hpq';

// See https://github.com/WordPress/gutenberg/blob/trunk/packages/blocks/src/api/parser/get-block-attributes.js#L185
export const matcherFromSource = (sourceConfig) => {
	switch (sourceConfig.source) {
		// TODO: Add cases for other source types.
		case 'text':
			return text(sourceConfig.selector);
	}
};

export const createGlobal = (name, initialValue) => {
	['wp', 'view', name].reduce((obj, name, i) => {
		if (typeof obj[name] === 'undefined')
			obj[name] = i === 2 ? initialValue : {};
		return obj[name];
	}, window);
	return window.wp.view[name];
};
