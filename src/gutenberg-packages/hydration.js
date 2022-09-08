import { render } from 'preact';
import { useState } from 'preact/hooks';
import { createGlobal } from './utils';

// const blockViews = createGlobal('blockViews', new Map());
const blockViews = createGlobal('blockViewsHacked', {});
const container = document.querySelector('.wp-site-blocks');

console.log(`Before render:`, blockViews);

const Comp = () => {
	const [c, sC] = useState(0);
	return <div onClick={() => sC(c + 1)}>hydrate: {c}</div>;
};
const Comp2 = blockViews['Comp'];

render(<div>hi?</div>, container);
