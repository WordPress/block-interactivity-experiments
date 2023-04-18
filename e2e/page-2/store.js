import { store } from '../../src/runtime/store';
import { navigate } from '../../src/runtime/router';

store({
	state: {
		newValue: true,
	},
	actions: {
		toggleNewValue: ({ state }) => {
			state.newValue = !state.newValue;
		},
		replaceWithPage3: () => {
			navigate('/csn-page-3.html', { replace: true });
		},
	},
});
