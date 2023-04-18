import { store } from '../../src/runtime/store';

store({
	state: {
		trueValue: true,
		falseValue: false,
		text: 'Text 1',
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
		toggleStateText: ({ state }) => {
			state.text === 'Text 1'
				? (state.text = 'Text 2')
				: (state.text = 'Text 1');
		},
		toggleContextText: ({ context }) => {
			context.text === 'Text 1'
				? (context.text = 'Text 2')
				: (context.text = 'Text 1');
		},
	},
});

// State for the store hydration tests.
store({
	state: {
		counter: {
			// TODO: replace this with a getter.
			// `value` is defined in the server.
			double: ({ state }) => state.counter.value * 2,
			clicks: 0,
		},
	},
	actions: {
		counter: {
			increment: ({ state }) => {
				state.counter.value += 1;
				state.counter.clicks += 1;
			},
		},
	},
});
