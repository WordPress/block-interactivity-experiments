import { createContext, h } from 'preact';
import { useContext, useMemo } from 'preact/hooks';
import { directive } from '../gutenberg-packages/directives';

// Single context reused by all providers.
const blockContexts = createContext({});
blockContexts.displayName = 'blockContexts';

/**
 * Wrapper that provides the specified attributes. If there are ancestor that are also providers, it
 * merges all context together.
 *
 * @param {*} props            Component props.
 * @param {*} props.provides   Map of context names and block attributes.
 * @param {*} props.attributes Block attributes.
 *
 * @returns Block context provider.
 */
const BlockContextProvider = ({ provides, attributes, children }) => {
	// Get previous context.
	const allContexts = useContext(blockContexts);

	// Get provided context from attributes.
	const context = {};
	for (const key in provides) {
		context[key] = attributes[provides[key]];
	}

	// Provide merged contexts.
	return (
		<blockContexts.Provider value={{ ...allContexts, ...context }}>
			{children}
		</blockContexts.Provider>
	);
};

/**
 * HOC that injects only the required attributes from `blockContexts` value.
 *
 * @param {*} Comp         Component.
 * @param {*} options      Options.
 * @param {*} options.uses Array of required contexts.
 *
 * @returns HOC function.
 */
const withBlockContext = (Comp, { uses }) => {
	const hoc = (props) => {
		const allContexts = useContext(blockContexts);

		// Memoize only those attributes that are needed.
		const context = useMemo(
			() =>
				uses.reduce((acc, attribute) => {
					acc[attribute] = allContexts[attribute];
					return acc;
				}, {}),
			uses.map((attribute) => allContexts[attribute])
		);

		// Inject context.
		return <Comp {...props} context={context} />;
	};

	hoc.displayName = 'withBlockContext';
	return hoc;
};

directive('blockProvidesBlockContext', (props) => {
	const { blockProvidesBlockContext: provides, blockAttributes: attributes } =
		props.wp;

	// The property `provides` can be null...
	if (!provides || !Object.keys(provides).length) return;

	props.children = h(
		BlockContextProvider,
		{ provides, attributes },
		props.children
	);
});

directive('blockUsesBlockContext', (props) => {
	const { blockUsesBlockContext: uses } = props.wp;

	if (!uses.length) return;

	props.tag = withBlockContext(props.tag, { uses });
});
