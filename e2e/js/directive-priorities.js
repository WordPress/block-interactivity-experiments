import { useEffect, useContext } from 'preact/hooks';
import { deepSignal } from 'deepsignal';

import { store } from '../../src/runtime/store';
import { directive } from '../../src/runtime/hooks';

/**
 * Util to check that render calls happen in order.
 */
const executionProof = (n) => {
	const el = document.querySelector('[data-testid="execution order"]');
	if (!el.textContent) el.textContent = n;
	else el.textContent += `, ${n}`;
};

/**
 * Simple context directive, just for testing purposes. It provides a deep
 * signal with these two properties:
 * - attribute: 'from context'
 * - text: 'from context'
 */
directive(
	'test-context',
	({ context: { Provider }, props: { children } }) => {
		executionProof('context');
		const value = deepSignal({
			attribute: 'from context',
			text: 'from context',
		});
		return <Provider value={value}>{children}</Provider>;
	},
	{ priority: 8 }
);

/**
 * Simple attribute directive, for testing purposes. It reads the value of
 * `attribute` from context and populates `data-attribute` with it.
 */
directive('test-attribute', ({ context, evaluate, element }) => {
	executionProof('attribute');
	const contextValue = useContext(context);
	const attributeValue = evaluate('context.attribute', {
		context: contextValue,
	});
	useEffect(() => {
		element.ref.current.setAttribute('data-attribute', attributeValue);
	}, []);
	element.props['data-attribute'] = attributeValue;
});

/**
 * Simple text directive, for testing purposes. It reads the value of
 * `text` from context and populates `children` with it.
 */
directive(
	'test-text',
	({ context, evaluate, element }) => {
		executionProof('text');
		const contextValue = useContext(context);
		const textValue = evaluate('context.text', {
			context: contextValue,
		});
		element.props.children = <p data-testid="text">{textValue}</p>;
	},
	{ priority: 12 }
);

/**
 * Children directive, for testing purposes. It adds a wrapper around
 * `children`, including two buttons to modify `text` and `attribute values from
 * the received context.
 */
directive(
	'test-children',
	({ context, evaluate, element }) => {
		executionProof('children');
		const contextValue = useContext(context);
		const updateAttribute = () => {
			evaluate('actions.updateAttribute', { context: contextValue });
		};
		const updateText = () => {
			evaluate('actions.updateText', { context: contextValue });
		};
		element.props.children = (
			<div>
				{element.props.children}
				<button onClick={updateAttribute}>Update attribute</button>
				<button onClick={updateText}>Update text</button>
			</div>
		);
	},
	{ priority: 14 }
);

store({
	actions: {
		updateText({ context }) {
			context.text = 'updated';
		},
		updateAttribute({ context }) {
			context.attribute = 'updated';
		},
	},
});
