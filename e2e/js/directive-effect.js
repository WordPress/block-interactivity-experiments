import { store } from '../../src/runtime/store';

store({
	effects: {
		writeToWindow: () => {
			window.effect = true;
		},
	},
});
