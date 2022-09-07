import {
	createContext,
	useContext as useReactContext,
	useEffect as useReactEffect,
	useState as useReactState,
} from '@wordpress/element';

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
