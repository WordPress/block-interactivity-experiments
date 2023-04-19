import { store } from '../../src/runtime/store';

store({
	state: {
		url: '/some-url',
		checked: true,
	},
	actions: {
		toggle: ({ state }) => {
			state.url = '/some-other-url';
			state.checked = !state.checked;
		},
	},
});
