import { store } from '../../src/runtime/store';

store({
	selectors: {
		active: ({ state }) => {
			return state.active;
		},
	},
	state: {
		active: false,
	},
	actions: {
		toggle: ({ state }) => {
			state.active = !state.active;
		},
	},
});
