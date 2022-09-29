import BlockViews from '../gutenberg-packages/block-views';

// These functions need to be included in each block bundle because block
// bundles must not have any hard dependency.
const createGlobal = (name, initialValue) => {
	['wp', 'view', name].reduce((obj, name, i) => {
		if (typeof obj[name] === 'undefined')
			obj[name] = i === 2 ? initialValue : {};
		return obj[name];
	}, window);
	return window.wp.view[name];
};

const blockViews = createGlobal('blockViews', new BlockViews());

export default (name, Component) => {
	setTimeout(() => {
		blockViews.set(name, Component);
		console.log('registered view', name);
	}, 5000);
};
