import { hydrate, createElement } from 'preact/compat';
import { createGlobal } from './utils';
import toVdom from './to-vdom';
import visitor from './visitor';

const blockViews = createGlobal('blockViews', new Map());

const components = Object.fromEntries(
	[...blockViews.entries()].map(([k, v]) => [k, v.Component])
);

visitor.map = components;

const dom = document.querySelector('.wp-site-blocks');
const vdom = toVdom(dom, visitor, createElement, {}).props.children;

setTimeout(() => console.log('hydrated', hydrate(vdom, dom)), 3000);
