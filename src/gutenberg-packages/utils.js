import { getBlockType } from "@wordpress/blocks";

/**
 * Get attributes that should be present in the frontend.
 * @param {string} blockName
 */
export const getFrontendAttributes = (blockName, attributes) => {
  const blockType = getBlockType(blockName);

  const frontendAttributes = {};

  // Iterate over all attributes of the block.
  for (const [key, value] of Object.entries(blockType.attributes)) {
    // If the attribute is marked as frontend in block.json,
    // add its value to the frontendAttributes object.
    if (value?.frontend && attributes[key] !== undefined) {
      frontendAttributes[key] = attributes[key];
    }
  }

  return frontendAttributes;
};

export const getBlockContext = (blockName) => {
  const blockType = getBlockType(blockName);
  const { usesContext, providesContext } = blockType;
  return { usesContext, providesContext };
};

/**
 * Pick the keys of an object that are present in the provided array.
 * @param {Object} obj
 * @param {Array} arr
 */
export const pickKeys = (obj, arr) => {
  if (obj === undefined) return;

  const result = {};
  for (const key of arr) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
};
