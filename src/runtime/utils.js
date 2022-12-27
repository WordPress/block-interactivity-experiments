// For wrapperless hydration of document.body.
// See https://gist.github.com/developit/f4c67a2ede71dc2fab7f357f39cff28c
export const createRootFragment = (parent, replaceNode) => {
	replaceNode = [].concat(replaceNode);
	const s = replaceNode[replaceNode.length - 1].nextSibling;
	function insert(c, r) {
		parent.insertBefore(c, r || s);
	}
	return (parent.__k = {
		nodeType: 1,
		parentNode: parent,
		firstChild: replaceNode[0],
		childNodes: replaceNode,
		insertBefore: insert,
		appendChild: insert,
		removeChild(c) {
			parent.removeChild(c);
		},
	});
};

// Deep Merge
const isObject = (item) =>
	item && typeof item === 'object' && !Array.isArray(item);

export const deepMerge = (target, source) => {
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
};
