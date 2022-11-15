import registerDirectives from './directives';
import registerComponents from './components';
import { init } from './router';

/**
 * Initialize the initial vDOM.
 */
document.addEventListener('DOMContentLoaded', async () => {
	const t0 = performance.now();
	registerDirectives();
	registerComponents();
	await init();
	const t1 = performance.now();
	console.log(`hydrated in ${t1 - t0} ms`);
});
