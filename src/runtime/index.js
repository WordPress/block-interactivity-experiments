import registerDirectives from './directives';
import registerComponents from './components';
import { init } from './router';

/**
 * Initialize the initial vDOM.
 */
document.addEventListener('DOMContentLoaded', async () => {
	registerDirectives();
	registerComponents();

	// Do this manually to test it out.
	document
		.querySelectorAll('a')
		.forEach((node) => node.setAttribute('wp-link', '{"prefetch": true }'));

	await init();
	console.log('hydrated!');
});
