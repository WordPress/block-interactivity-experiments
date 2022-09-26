import { h, options } from 'preact';

// WordPress Directives.
const directives = {};

// Expose function to add directives.
export const directive = (name, cb) => {
	directives[name] = cb;
};

const WpDirective = (props) => {
	for (const directive in props.wp) {
		directives[directive]?.(props);
	}
	props._wrapped = true;
	const { wp, tag, children, ...rest } = props;
	return h(tag, rest, children);
};

const old = options.vnode;
options.vnode = (vnode) => {
	let hasWpDirectives = false;

	// If it's not a static vnode, we need to extract the WordPress Directives.
	if (!vnode.props._static) {
		const wpDirectives = {};
		const keys = Object.keys(vnode.props);

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			if (key.startsWith('wp-')) {
				hasWpDirectives = true;
				let value = vnode.props[key];
				try {
					value = JSON.parse(value);
				} catch (e) {}
				wpDirectives[rename(key)] = value;
				delete vnode.props[key];
			}
		}

		if (hasWpDirectives) vnode.props.wp = wpDirectives;
	} else {
		if (!!vnode.props.wp) hasWpDirectives = true;
		delete vnode.props._static;
	}

	if (hasWpDirectives) {
		if (!vnode.props._wrapped) {
			vnode.props.tag = vnode.type;
			vnode.type = WpDirective;
		} else {
			delete vnode.props._wrapped;
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
