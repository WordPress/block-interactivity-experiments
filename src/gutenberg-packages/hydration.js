import { hydrate } from 'preact/compat';
import { createGlobal } from './utils';
import Markup from './markup';

const blockViews = createGlobal('blockViews', new Map());
const container = document.querySelector('.wp-site-blocks');

const components = Object.fromEntries(
	[...blockViews.entries()].map(([k, v]) => [k, v.Component])
);

hydrate(
	<Markup
		markup={container}
		type="dom"
		wrap={false}
		trim={false}
		components={components}
	/>,
	container
);
