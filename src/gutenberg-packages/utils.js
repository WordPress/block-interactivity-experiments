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
		// add its value to the frontendAttributes object.
		if ( value?.frontend && attributes[key] !== undefined ) {
			frontendAttributes[key] = attributes[key];
		}
	}

	return frontendAttributes;
};
