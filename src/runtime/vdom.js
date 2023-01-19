import { h } from 'preact';

export const hydratedIslands = new WeakSet();

// Recursive function that transfoms a DOM tree into vDOM.
export function toVdom(node) {
	const treeWalker = document.createTreeWalker(
		node,
		NodeFilter.SHOW_ELEMENT +
			NodeFilter.SHOW_TEXT +
			NodeFilter.SHOW_COMMENT +
			NodeFilter.SHOW_CDATA_SECTION +
			NodeFilter.SHOW_PROCESSING_INSTRUCTION
	);

	function walk(node) {
		const { attributes, nodeType } = node;

		if (nodeType === 3) return node.data;
		if (nodeType === 4) {
			node.replaceWith(new Text(node.nodeValue));
			return node.nodeValue;
		}
		if (nodeType === 8 || nodeType === 7) {
			node.remove();
			return null;
		}

		const props = {};
		const children = [];
		const wpDirectives = {};
		let hasWpDirectives = false;
		let ignore = false;
		let island = false;

		for (let i = 0; i < attributes.length; i++) {
			const n = attributes[i].name;
			if (n[0] === 'w' && n[1] === 'p' && n[2] === '-' && n[3]) {
				if (n === 'wp-ignore') {
					ignore = true;
				} else if (n === 'wp-island') {
					island = true;
				} else {
					hasWpDirectives = true;
					let val = attributes[i].value;
					try {
						val = JSON.parse(val);
					} catch (e) {}
					const [, prefix, suffix] = /wp-([^:]+):?(.*)$/.exec(n);
					wpDirectives[prefix] = wpDirectives[prefix] || {};
					wpDirectives[prefix][suffix || 'default'] = val;
				}
			} else if (n === 'ref') {
				continue;
			} else {
				props[n] = attributes[i].value;
			}
		}

		if (ignore && !island)
			return h(node.localName, {
				dangerouslySetInnerHTML: { __html: node.innerHTML },
			});
		if (island) hydratedIslands.add(node);

		if (hasWpDirectives) props.wp = wpDirectives;

		let child = treeWalker.firstChild();
		if (child) {
			while (child) {
				const vnode = walk(child);
				if (vnode) children.push(vnode);
				child = treeWalker.nextSibling();
			}
			treeWalker.parentNode();
		}

		return h(node.localName, props, children);
	}

	return walk(treeWalker.currentNode);
}
