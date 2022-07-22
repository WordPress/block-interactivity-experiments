import { createGlobal } from './utils';
import { useEffect, useState } from './wordpress-element';

const subscribers = createGlobal('reactContextSubscribers', new WeakMap());
const values = createGlobal('reactContextValues', new WeakMap());

const updateValue = ({ element, context, value }) => {
	if (!values.has(element)) {
		values.set(element, new WeakMap());
	}
	values.get(element).set(context, value);
};

const getValue = ({ element, context }) => {
	if (values.has(element)) {
		return values.get(element).get(context);
	}
};

const subscribe = ({ element, context, callback }) => {
	if (!subscribers.has(element)) {
		subscribers.set(element, new WeakMap());
	}
	if (!subscribers.get(element).has(context)) {
		subscribers.get(element).set(context, new Set());
	}
	subscribers.get(element).get(context).add(callback);
};

const unsubscribe = ({ element, context, callback }) => {
	subscribers.get(element).get(context).delete(callback);
};

const updateProvider = ({ element, context, value }) => {
	updateValue({ element, context, value });

	if (subscribers.has(element) && subscribers.get(element).has(context)) {
		// This setTimeout prevents a React warning about calling setState inside a
		// render() function, which is misleading because the render() function
		// belongs to a different React application. It may not happen in React 18.
		setTimeout(() => {
			subscribers
				.get(element)
				.get(context)
				.forEach((callback) => callback(value));
		});
	}
};

export const createProvider =
	({ element, context }) =>
	({ children }) => {
		const [value, setValue] = useState(getValue({ element, context }));

		useEffect(() => {
			subscribe({ element, context, callback: setValue });
			return () => unsubscribe({ element, context, callback: setValue });
		}, []);

		return <context.Provider value={value}>{children}</context.Provider>;
	};

export const Consumer = ({ element, context }) => (
	<context.Consumer>
		{(value) => updateProvider({ element, context, value })}
	</context.Consumer>
);
