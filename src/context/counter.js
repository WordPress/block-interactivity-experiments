import { createContext } from '@wordpress/element';

if ( typeof window.reactContext === 'undefined' ) {
	window.reactContext = createContext( null );
}

export default window.reactContext;
