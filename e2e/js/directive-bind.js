import { store } from '../../src/runtime/store';

store({
	state: {
		url: '/some-url',
		checked: true,
		width: 1,
	},
	foo: {
		bar: 1,
	},
	actions: {
		toggle: ({ state, foo }) => {
			state.url = '/some-other-url';
			state.checked = !state.checked;
			state.width += foo.bar;
		},
	},
});
