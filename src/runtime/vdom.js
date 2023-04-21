import { h } from 'preact';
import { directivePrefix as p } from './constants';

const ignoreAttr = `${p}ignore`;
const islandAttr = `${p}island`;
const directiveParser = new RegExp(`${p}([^.]+)\.?(.*)$`);

export const hydratedIslands = new WeakSet();

// Recursive function that transforms a DOM tree into vDOM.
export function toVdom(root) {
	let treeWalker = document.createTreeWalker(
		root,
		205 // ELEMENT + TEXT + COMMENT + CDATA_SECTION + PROCESSING_INSTRUCTION
	);

	function walk(node) {
		const { attributes, nodeType, localName } = node;
		const isTemplate = localName === 'template';

		if (nodeType === 3) return [node.data];
		if (nodeType === 4) {
			const next = treeWalker.nextSibling();
			node.replaceWith(new Text(node.nodeValue));
			return [node.nodeValue, next];
		}
		if (nodeType === 8 || nodeType === 7) {
			const next = treeWalker.nextSibling();
			node.remove();
			return [null, next];
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
			}
			props[n] = attributes[i].value;
		}

		if (ignore && !island)
			return [
				h(node.localName, {
					...props,
					innerHTML: node.innerHTML,
					__directives: { ignore: true },
				}),
			];
		if (island) hydratedIslands.add(node);

		if (hasDirectives) props.__directives = directives;

		if (!isTemplate) {
			let child = treeWalker.firstChild();
			if (child) {
				while (child) {
					const [vnode, nextChild] = walk(child);
					if (vnode) children.push(vnode);
					child = nextChild || treeWalker.nextSibling();
				}
				treeWalker.parentNode();
			}
		} else {
			const parentTreeWalker = treeWalker;
			treeWalker = document.createTreeWalker(node.content, 205);
			let child = treeWalker.firstChild();
			while (child) {
				const [vnode, nextChild] = walk(child);
				if (vnode) children.push(vnode);
				child = nextChild || treeWalker.nextSibling();
			}
			treeWalker = parentTreeWalker;
			return [h(localName, { ...props, templateChildren: children })];
		}

		return [h(node.localName, props, children)];
	}

	return walk(treeWalker.currentNode);
}
