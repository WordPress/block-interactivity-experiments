import { store } from '../src/runtime';

store({
	state: {
		trueValue: true,
		falseValue: false,
	},
	derived: {
		renderContext: ({ context }) => {
			return JSON.stringify(context, undefined, 2);
		},
	},
	actions: {
		toggleTrueValue: ({ state }) => {
			state.trueValue = !state.trueValue;
		},
		toggleFalseValue: ({ state }) => {
			state.falseValue = !state.falseValue;
		},
		toggleContextFalseValue: ({ context }) => {
			context.falseValue = !context.falseValue;
		},
		updateContext: ({ context, event }) => {
			const { name, value } = event.target;
			const [key, ...path] = name.split('.').reverse();
			const obj = path.reduceRight((o, k) => o[k], context);
			obj[key] = value;
		},
	},
});
