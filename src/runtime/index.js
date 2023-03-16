import registerDirectives from './directives';
import registerComponents from './components';
import { init } from './router';
import { rawStore } from './store';
export { store } from './store';
export { navigate } from './router';

/**
 * Initialize the initial vDOM.
 */
document.addEventListener('DOMContentLoaded', async () => {
	if (window.__REDUX_DEVTOOLS_EXTENSION__) {
		window.__interactivity_devtools =
			window.__REDUX_DEVTOOLS_EXTENSION__.connect({
				name: 'Interactivity API',
				serialize: {
					options: {
						undefined: true,
						// When serializing functions, only send the function name.
						function: function (fn) {
							return 'function';
						},
					},
				},
			});
		window.__interactivity_devtools.init(rawStore);
	}

	registerDirectives();
	registerComponents();
	await init();
	console.log('hydrated!');
});
