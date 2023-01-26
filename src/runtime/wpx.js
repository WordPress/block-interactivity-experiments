import { deepSignal, peek } from 'deepsignal';

const isObject = (item) =>
	item && typeof item === 'object' && !Array.isArray(item);

export const deepMerge = (target, source) => {
	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) Object.assign(target, { [key]: {} });
				deepMerge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}
};

export const mergeDeepSignals = (target, source) => {
	for (const k in source) {
		if (typeof peek(target, k) === 'undefined') {
			target[`$${k}`] = source[`$${k}`];
		} else if (isObject(peek(target, k)) && isObject(peek(source, k))) {
			mergeDeepSignals(target[`$${k}`].peek(), source[`$${k}`].peek());
		}
	}
};

const rawState = {};
export const store = { state: deepSignal(rawState) };

if (typeof window !== 'undefined') window.wpx = store;

export const wpx = ({ state, ...block }) => {
	deepMerge(store, block);
	deepMerge(rawState, state);
};
