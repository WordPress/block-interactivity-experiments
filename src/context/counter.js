import { createContext } from 'preact/compat';

if (typeof window.counterContext === 'undefined') {
	window.counterContext = window.wp.element
		? window.wp.element.createContext(null)
		: createContext(null);

	window.counterContext.displayName = 'CounterContext';
}

export default window.counterContext;
