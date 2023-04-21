import { store } from '../../src/runtime/store';

store({
	state: {
		isOpen: true,
	},
	actions: {
		toggle({ state }) {
			state.isOpen = !state.isOpen;
		},
	},
	effects: {
		writeToWindow: () => {
			window.effect = 'effect added';

			return () => {
				window.effect = 'effect removed';
			};
		},
		changeFocus: ({ state }) => {
			if (state.isOpen) {
				document.querySelector("[data-testid='input']").focus();
			}
		},
	},
});
