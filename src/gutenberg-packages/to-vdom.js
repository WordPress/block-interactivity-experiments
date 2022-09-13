export default function toVdom(node, visitor, h) {
	walk.visitor = visitor;
	walk.h = h;
	return walk(node);
}

function walk(n) {
	if (n.nodeType === 3) return n.data;
	if (n.nodeType !== 1) return null;
	let nodeName = String(n.nodeName).toLowerCase();

	// Do not allow script tags (for now).
	if (nodeName === 'script') return null;

	let out = walk.h(
		nodeName,
		getProps(n.attributes),
		walkChildren(n.childNodes)
	);
	if (walk.visitor) walk.visitor(out, n);

	return out;
}

function getProps(attrs) {
	let len = attrs && attrs.length;
	if (!len) return null;
	let props = {};
	for (let i = 0; i < len; i++) {
		let { name, value } = attrs[i];
		props[name] = value;
	}
	return props;
}

function walkChildren(children) {
	let c = children && Array.prototype.map.call(children, walk).filter(exists);
	return c && c.length ? c : null;
}

let exists = (x) => x;
