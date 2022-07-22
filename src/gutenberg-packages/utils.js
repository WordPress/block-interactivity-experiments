import { text } from 'hpq';

// See https://github.com/WordPress/gutenberg/blob/trunk/packages/blocks/src/api/parser/get-block-attributes.js#L185
export const matcherFromSource = (sourceConfig) => {
	switch (sourceConfig.source) {
		// TODO: Add cases for other source types.
		case 'text':
			return text(sourceConfig.selector);
	}
};

// We have to do this because of the way we are currently bundling the code in
// this repo, each block gets its own copy of this file, but this won't happen
// if/when we do this in Gutenberg.
export const createGlobal = (name, initialValue) => {
	if (typeof window[name] === 'undefined') {
		window[name] = initialValue;
	}
	return window[name];
};
