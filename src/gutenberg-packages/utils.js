import { text } from 'hpq';

/**
 * Pick the keys of an object that are present in the provided array.
 * @param {Object} obj
 * @param {Array} arr
 */
export const pickKeys = ( obj, arr ) => {
	if ( obj === undefined ) {
		return;
	}

	const result = {};
	for ( const key of arr ) {
		if ( obj[key] !== undefined ) {
			result[key] = obj[key];
		}
	}
	return result;
};

// See https://github.com/WordPress/gutenberg/blob/trunk/packages/blocks/src/api/parser/get-block-attributes.js#L185
export const matcherFromSource = ( sourceConfig ) => {
	switch ( sourceConfig.source ) {
		// TODO: Add cases for other source types.
		case 'text':
			return text( sourceConfig.selector );
	}
};
