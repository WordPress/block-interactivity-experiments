import 'preact/debug';
import { hydrate } from 'preact/compat';
import { createGlobal } from './utils';
import Markup from './markup';

// const blockViews = createGlobal('blockViews', new Map());
const blockViews = createGlobal('blockViewsHacked', {});
const container = document.querySelector('.wp-site-blocks');

console.log(`Before render:`, blockViews);


hydrate(
	<Markup
		markup={container}
		type="dom"
		wrap={false}
		trim={false}
		components={blockViews}
	/>,
	container
);
