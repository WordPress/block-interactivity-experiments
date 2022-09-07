import { hydrate } from 'preact';
import { createGlobal } from './utils';
import Markup from './markup';

const blockViews = createGlobal('blockViews', new Map());
const container = document.querySelector('.wp-site-blocks');

console.log(`Before render:`, blockViews);

hydrate(
	<Markup
		markup={container.innerHTML}
		type="html"
		wrap={false}
		trim={false}
		components={Object.fromEntries(
			[...blockViews.entries()].map(([key, value]) => [key, value.Component])
		)}
	/>,
	container
);
