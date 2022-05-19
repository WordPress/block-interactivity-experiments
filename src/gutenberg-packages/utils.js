import { getBlockType } from '@wordpress/blocks';

/**
 * Get attributes that should be present in the frontend.
 * @param {string} blockName
 */
export const getFrontendAttributes = ( blockName ) => {
	const blockType = getBlockType( blockName );

	const frontendAttributes = {};
	for ( const [ key, value ] of Object.entries( blockType.attributes ) ) {
		if ( value.frontend ) {
			// We can delete the key from the object because its self-evident that
			// those attributes are "frontend" attributes
			delete value.frontend;
			frontendAttributes[key] = value;
		}
	}

	return frontendAttributes;
};
