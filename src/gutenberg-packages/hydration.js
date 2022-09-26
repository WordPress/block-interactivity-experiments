import 'preact/debug';
import { hydrate } from 'preact';
import toVdom from './to-vdom';
import '../directives/wp-block';
import '../directives/wp-block-context';
import '../directives/wp-log';

const dom = document.querySelector('.wp-site-blocks');
const vdom = toVdom(dom).props.children;

setTimeout(() => {
	hydrate(vdom, dom);
	console.log('hydrated');
}, 3000);
