import {
	createContext,
	useContext as useReactContext,
	useEffect as useReactEffect,
	useState as useReactState,
} from '@wordpress/element';
import { hydrate as ReactHydrate } from 'react-dom';

export const EnvContext = createContext(null);

/**
 * A React hook that returns the name of the environment.
 *
 * This is still a bit hacky. Ideally, Save components should support React
 * hooks and all the environments (Edit, Save and View) should populate a
 * normal context. Also, more environments could be added in the future.
 *
 * @returns {"edit" | "save" | "view"}
 */
export const useBlockEnvironment = () => {
	try {
		const env = useReactContext(EnvContext);
		if (env === 'view') {
			return 'view';
		}
		return 'edit';
	} catch (e) {
		return 'save';
	}
};

const noop = () => {};

export const useState = (init) =>
	useBlockEnvironment() !== 'save' ? useReactState(init) : [init, noop];

export const useEffect = (...args) =>
	useBlockEnvironment() !== 'save' ? useReactEffect(...args) : noop;

export const useContext = (Context) =>
	useBlockEnvironment() !== 'save'
		? useReactContext(Context)
		: Context._currentValue;

export const hydrate = (element, container, hydrationOptions) => {
	const { technique, media } = hydrationOptions || {};

	const cb = () => {
		ReactHydrate(element, container);
	};

	switch (technique) {
		case 'media':
			if (media) {
				const mql = matchMedia(media);
				if (mql.matches) {
					cb();
				} else {
					mql.addEventListener('change', cb, { once: true });
				}
			}
			break;

		// Hydrate the element when is visible in the viewport.
		// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

		case 'view':
			try {
				const io = new IntersectionObserver((entries) => {
					for (const entry of entries) {
						if (!entry.isIntersecting) {
							continue;
						}
						// As soon as we hydrate, disconnect this IntersectionObserver.
						io.disconnect();
						cb();
						break; // Break loop on first match.
					}
				});
				io.observe(container.children[0]);
			} catch (e) {
				cb();
			}
			break;

		case 'idle':
			// Safari does not support requestIdleCalback, we use a timeout instead.
			// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
			if ('requestIdleCallback' in window) {
				window.requestIdleCallback(cb);
			} else {
				setTimeout(cb, 200);
			}
			break;

		// Hydrate this component immediately.

		default:
			cb();
	}
};
