import { store } from '../../src/runtime/store';

store({
	state: {
		newValue: true,
	},
	actions: {
		toggleNewValue: ({ state }) => {
			state.newValue = !state.newValue;
		},
	},
});
