import registerDirectives from './directives';
import { init } from './hydration';

/**
 * Initialize the Interactivity API.
 */
registerDirectives();

document.addEventListener('DOMContentLoaded', async () => {
	await init();
	// eslint-disable-next-line no-console
	console.log('Interactivity API started');
});
