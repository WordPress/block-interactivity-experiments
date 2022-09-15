import { hydrate } from 'preact/compat';
import toVdom from './to-vdom';

import '../directives/wp-block';

const dom = document.querySelector('.wp-site-blocks');
const vdom = toVdom(dom).props.children;

setTimeout(() => console.log('hydrated', hydrate(vdom, dom)), 3000);
