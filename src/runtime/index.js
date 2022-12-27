import registerDirectives from './directives';
import registerComponents from './components';
import { init } from './router';
export { wpx } from './hooks';

/**
 * Initialize the initial vDOM.
 */
document.addEventListener('DOMContentLoaded', async () => {
	registerDirectives();
	registerComponents();
	await init();
	console.log('hydrated!');
});
