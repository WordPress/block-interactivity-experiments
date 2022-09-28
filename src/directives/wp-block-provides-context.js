import blockContext from './block-context';
import { useContext } from 'preact/hooks';
import { directive } from '../gutenberg-packages/directives';

directive(
	'blockProvidesBlockContext',
	({ blockProvidesBlockContext, blockAttributes }, { children }) => {
		// Do nothing if it doesn't provides context.
		if (
			!blockProvidesBlockContext ||
			!Object.keys(blockProvidesBlockContext).length
		)
			return;

		// Get previous context.
		const allContexts = useContext(blockContext);

		// Get provided context from attributes.
		const context = {};
		for (const key in blockProvidesBlockContext) {
			const value = blockAttributes[blockProvidesBlockContext[key]];
			if (value) context[key] = value;
		}

		// Provide merged contexts.
		return (
			<blockContext.Provider value={{ ...allContexts, ...context }}>
				{children}
			</blockContext.Provider>
		);
	}
);
