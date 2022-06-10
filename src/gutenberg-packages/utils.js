import { text } from 'hpq';

import { getBlockType } from '@wordpress/blocks';

/**
 * Get attributes that should be present in the frontend.
 * @param {string} blockName
 */
export const getFrontendAttributes = ( blockName, attributes ) => {
	const blockType = getBlockType( blockName );

	const frontendAttributes = {};

	// Iterate over all attributes of the block.
	for ( const [ key, value ] of Object.entries( blockType.attributes ) ) {
		// If the attribute is marked as frontend in block.json,
		// and it doesn't have a source property set,
		// add its value to the frontendAttributes object.
		if ( value?.frontend && !value.source ) {
			if ( attributes[key] !== undefined ) {
				frontendAttributes[key] = attributes[key];
			} else if ( value.default !== undefined ) {
				frontendAttributes[key] = value.default;
			}
		}
	}

	return frontendAttributes;
};

export const getSourcedFrontendAttributes = ( blockName ) => {
	const blockType = getBlockType( blockName );

	const sourcedFrontendAttributes = {};

	// Iterate over all attributes of the block.
	for ( const [ key, value ] of Object.entries( blockType.attributes ) ) {
		// If the attribute is marked as frontend in block.json,
		// and it has a source property set, add the its source and
		// selector properties to the sourcedFrontendAttributes.
		if ( value?.frontend && value?.source ) {
			sourcedFrontendAttributes[key] = {
				selector: value?.selector,
				source: value.source,
			};
		}
	}

	return sourcedFrontendAttributes;
};

export const getBlockContext = ( blockName ) => {
	const blockType = getBlockType( blockName );
	const { usesContext, providesContext } = blockType;
	return { usesContext, providesContext };
};

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
