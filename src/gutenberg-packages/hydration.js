import { createGlobal } from './utils';
import { h } from 'preact';

const blockViews = createGlobal('blockViews', new Map());

const Comp = () => <div className="hola">hi</div>;

console.log(Comp());

console.log(h('div', { class: 'hola' }, 'hi'));
