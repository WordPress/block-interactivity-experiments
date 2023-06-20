import registerDirectives from './directives';
import { init } from './router';
export { store } from './store';
export { navigate } from './router';
export { directive } from './hooks';
export * from 'preact/hooks';

/**
 * Initialize the Interactivity API.
 */
document.addEventListener('DOMContentLoaded', async () => {
	registerDirectives();
	await init();
	// eslint-disable-next-line no-console
	console.log('Interactivity API started');
});
