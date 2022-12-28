import { wpx } from '../src/runtime';

wpx({
	state: {
		trueValue: true,
		falseValue: false,
	},
	actions: {
		toggleTrueValue: ({ state }) => {
			state.trueValue = !state.trueValue;
		},
		toggleFalseValue: ({ state }) => {
			state.falseValue = !state.falseValue;
		},
	},
});
