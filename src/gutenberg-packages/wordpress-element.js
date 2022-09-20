import {
	createContext,
	useContext as usePreactContext,
	useEffect as usePreactEffect,
	useState as usePreactState,
} from 'preact/compat';

import { useErrorBoundary as usePreactErrorBoundary } from 'preact/hooks';

export const EnvContext = createContext('view');

/**
 * A React hook that returns the name of the environment.
 *
 * Based on the workaround used for the Island Hydration approach, but only to differentiate between
 * Save and View, so this function and related hooks cannot be used inside Edit.
 *
 * Note that the other approach was a bit hacky; this is a bit more hacky.
 *
 * @returns {"save" | "view"}
 */
export const useBlockEnvironment = () => {
	try {
		// This will fail if the hook runs inside something that's not a Preact component.
		return usePreactContext(EnvContext);
	} catch (e) {
		return 'save';
	}
};

const noop = () => {};

export const useState = (init) =>
	useBlockEnvironment() !== 'save' ? usePreactState(init) : [init, noop];

export const useEffect = (...args) =>
	useBlockEnvironment() !== 'save' ? usePreactEffect(...args) : noop;

export const useContext = (Context) =>
	useBlockEnvironment() !== 'save'
		? usePreactContext(Context)
		: Context._currentValue;

export const useErrorBoundary = (cb) =>
	useBlockEnvironment() !== 'save'
		? usePreactErrorBoundary(cb)
		: [false, noop];
