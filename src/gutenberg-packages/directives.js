import { h, options } from 'preact';

// WordPress Directives.
const directives = {};

// Expose function to add directives.
export const directive = (name, cb) => {
	directives[name] = cb;
};

const WpDirective = ({ type, wp, props: originalProps, vnode }) => {
	const element = h(type, { ...originalProps, _wrapped: true });
	const props = { ...originalProps, children: element };

	for (const d in wp) {
		const wrapper = directives[d]?.(wp, props, { element, vnode });
		if (wrapper !== undefined) props.children = wrapper;
	}

	return props.children;
};

const old = options.vnode;
options.vnode = (vnode) => {
	const props = vnode.props;
	let wp = props.wp;
	let hasWpDirectives = false;

	// If it's not a static vnode, we need to extract the WordPress Directives.
	if (!props._static) {
		wp = {};
		const keys = Object.keys(props);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key.startsWith('wp-')) {
				hasWpDirectives = true;
				let value = props[key];
				try {
					value = JSON.parse(value);
				} catch (e) {}
				wp[rename(key)] = value;
				delete props[key];
			}
		}
	} else {
		if (wp) {
			hasWpDirectives = true;
			delete props.wp;
		}
		delete props._static;
	}

	if (hasWpDirectives) {
		if (!props._wrapped) {
			vnode.props = { type: vnode.type, wp, props, vnode };
			vnode.type = WpDirective;
		} else {
			delete props._wrapped;
		}
	}

	if (old) old(vnode);
};

// Rename WordPress Directives from `wp-some-directive` to `someDirective`.
export const rename = (s) =>
	s
		.toLowerCase()
		.replace(/^wp-/, '')
		.replace(/-(.)/g, (_, chr) => chr.toUpperCase());
