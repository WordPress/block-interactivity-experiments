import 'preact/debug';
import { hydrate } from 'preact/compat';
import toVdom from './to-vdom';
import '../directives/wp-block';
import '../directives/wp-block-context';

const dom = document.querySelector('.wp-site-blocks');
const vdom = toVdom(dom).props.children;

setTimeout(() => console.log('hydrated', hydrate(vdom, dom)), 3000);
