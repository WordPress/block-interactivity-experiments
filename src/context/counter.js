import { createContext } from '@wordpress/element';

if (typeof window.reactContext === 'undefined') {
	window.reactContext = createContext(null);
}
window.reactContext.displayName = 'CounterContext';
export default window.reactContext;
