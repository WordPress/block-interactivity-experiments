import { createContext } from '@wordpress/element';

if (typeof window.themeReactContext === 'undefined') {
	window.themeReactContext = createContext(null);
}
window.themeReactContext.displayName = 'ThemeContext';
export default window.themeReactContext;
