import { h } from 'preact';
import { directivePrefix as p } from './constants';

const ignoreAttr = `${p}ignore`;
const islandAttr = `${p}island`;
const directiveParser = new RegExp(`${p}([^.]+)\.?(.*)$`);

export const hydratedIslands = new WeakSet();

// Recursive function that transfoms a DOM tree into vDOM.
export function toVdom(node) {
	const treeWalker = document.createTreeWalker(
		node,
		// 205
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
			return null;
		}

		const props = {};
		const children = [];
		const directives = {};
		let hasDirectives = false;
		let ignore = false;
		let island = false;

		for (let i = 0; i < attributes.length; i++) {
			const n = attributes[i].name;
			if (n[p.length] && n.slice(0, p.length) === p) {
				if (n === ignoreAttr) {
					ignore = true;
				} else if (n === islandAttr) {
					island = true;
				} else {
					hasDirectives = true;
					let val = attributes[i].value;
					try {
						val = JSON.parse(val);
					} catch (e) {}
					const [, prefix, suffix] = directiveParser.exec(n);
					directives[prefix] = directives[prefix] || {};
					directives[prefix][suffix || 'default'] = val;
				}
			} else if (n === 'ref') {
				continue;
			} else {
				props[n] = attributes[i].value;
			}
		}

		if (ignore && !island)
			return h(node.localName, {
				...props,
				innerHTML: node.innerHTML,
				directives: { ignore: true },
			});
		if (island) hydratedIslands.add(node);

		if (hasDirectives) props.directives = directives;

		let child = treeWalker.firstChild();
		if (child) {
			while (child) {
				const vnode = walk(child);
				if (vnode) {
					children.push(vnode);
					child = treeWalker.nextSibling();
				} else {
					const prevChild = child;
					child = treeWalker.nextSibling();
					prevChild.remove();
				}
			}
			treeWalker.parentNode();
		}

		return h(node.localName, props, children);
	}

	return walk(treeWalker.currentNode);
}
