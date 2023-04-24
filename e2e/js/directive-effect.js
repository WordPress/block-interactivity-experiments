import { store } from '../../src/runtime/store';
import { directive } from '../../src/runtime/hooks';
import { useContext, useMemo } from 'preact/hooks';

// Fake `data-wp-fakeshow` directive to test when things are removed from the DOM.
// Replace with `data-wp-show` when it's ready.
directive(
	'fakeshow',
	({
		directives: {
			fakeshow: { default: fakeshow },
		},
		element,
		evaluate,
		context,
	}) => {
		const contextValue = useContext(context);
		const children = useMemo(
			() =>
				element.type === 'template'
					? element.props.templateChildren
					: element,
			[]
		);
		if (!evaluate(fakeshow, { context: contextValue })) return null;
		return children;
	}
);

store({
	state: {
		isOpen: true,
		isElementInTheDOM: false,
	},
	selectors: {
		elementInTheDOM: ({ state }) =>
			state.isElementInTheDOM
				? 'element is in the DOM'
				: 'element is not in the DOM',
	},
	actions: {
		toggle({ state }) {
			state.isOpen = !state.isOpen;
		},
	},
	effects: {
		elementAddedToTheDOM: ({ state }) => {
			state.isElementInTheDOM = true;

			return () => {
				state.isElementInTheDOM = false;
			};
		},
		changeFocus: ({ state }) => {
			if (state.isOpen) {
				document.querySelector("[data-testid='input']").focus();
			}
		},
	},
});
