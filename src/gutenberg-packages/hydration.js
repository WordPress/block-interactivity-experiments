import { Consumer, createProvider } from './react-context';
import { createGlobal, matcherFromSource } from './utils';
import { EnvContext, hydrate } from './wordpress-element';
import { unmountComponentAtNode } from 'react-dom';

const blockViews = createGlobal('blockViews', new Map());
const elementsToHydrate = createGlobal('elementsToHydrate', new Map());

const Children = ({ value }) => (
	<wp-inner-blocks
		suppressHydrationWarning={true}
		dangerouslySetInnerHTML={{ __html: value }}
	/>
);
Children.shouldComponentUpdate = () => false;

const Wrappers = ({ wrappers, children }) => {
	let result = children;
	wrappers.forEach((wrapper) => {
		result = wrapper({ children: result });
	});
	return result;
};

class WpBlock extends HTMLElement {
	#blockType = null;
	#hydration = false;
	#attributes = {};
	#blockContext = {};

	hydrate() {
		const Providers = [];

		// Get the block type, block props (class and style), inner blocks,
		// frontend component and options.
		const innerBlocks = this.querySelector('wp-inner-blocks');
		const { Component, options } = blockViews.get(this.#blockType);
		const { class: className, style } = JSON.parse(
			this.getAttribute('data-wp-block-props')
		);
		// Temporary element to translate style strings to style objects.
		const el = document.createElement('div');
		el.style.cssText = style;
		const blockProps = { className, style: el.style };
		el.remove();

		// Get the React Context from their parents.
		options?.usesContext?.forEach((context) => {
			const event = new CustomEvent('wp-react-context', {
				detail: { context },
				bubbles: true,
				cancelable: true,
			});
			this.dispatchEvent(event);
			if (typeof event.detail.Provider === 'function') {
				Providers.push(event.detail.Provider);
			}
		});

		// Share the React Context with their children.
		if (options?.providesContext?.length > 0) {
			this.addEventListener('wp-react-context', (event) => {
				for (const context of options.providesContext) {
					// We compare the provided context with the received context.
					if (event.detail.context === context) {
						// If there's a match, we stop propagation.
						event.stopPropagation();

						// We return a Provider that is subscribed to the parent Provider.
						event.detail.Provider = createProvider({
							element: this,
							context,
						});

						// We can stop the iteration.
						break;
					}
				}
			});
		}

		const media = this.getAttribute('data-wp-block-hydration-media');

		hydrate(
			<EnvContext.Provider value="view">
				{/* Wrap the component with all the React Providers */}
				<Wrappers wrappers={Providers}>
					<Component
						attributes={this.#attributes}
						blockProps={blockProps}
						context={this.#blockContext}
					>
						{/* Update the value each time one of the React Contexts changes */}
						{options?.providesContext?.map((context, index) => (
							<Consumer
								key={index}
								element={this}
								context={context}
							/>
						))}

						{/* Render the inner blocks */}
						{innerBlocks && (
							<Children
								value={innerBlocks.innerHTML}
								suppressHydrationWarning={true}
							/>
						)}
					</Component>
				</Wrappers>

				<template
					className="wp-inner-blocks"
					suppressHydrationWarning={true}
				/>
			</EnvContext.Provider>,
			this,
			{ technique: this.#hydration, media }
		);
	}

	connectedCallback() {
		this.#blockType = this.getAttribute('data-wp-block-type');

		// When connectedCallback is triggered, the children nodes have not been
		// created yet, so we need a setTimeout to be able to access the sourced
		// attributes and the inner blocks.
		setTimeout(() => {
			// Get the block attributes.
			this.#attributes = JSON.parse(
				this.getAttribute('data-wp-block-attributes')
			);

			// Add the sourced attributes to the attributes object.
			const sourcedAttributes = JSON.parse(
				this.getAttribute('data-wp-block-sourced-attributes')
			);
			for (const attr in sourcedAttributes) {
				this.#attributes[attr] = matcherFromSource(
					sourcedAttributes[attr]
				)(this);
			}

			// Get the Block Context from their parents.
			const usesBlockContext = JSON.parse(
				this.getAttribute('data-wp-block-uses-block-context')
			);
			if (usesBlockContext) {
				const event = new CustomEvent('wp-block-context', {
					detail: { context: {} },
					bubbles: true,
					cancelable: true,
				});
				this.dispatchEvent(event);

				// Select only the parts of the context that the block declared in the
				// `usesContext` of its block.json.
				usesBlockContext.forEach(
					(key) =>
						(this.#blockContext[key] = event.detail.context[key])
				);
			}

			// Share the Block Context with their children.
			const providesBlockContext = JSON.parse(
				this.getAttribute('data-wp-block-provides-block-context')
			);
			if (providesBlockContext) {
				this.addEventListener('wp-block-context', (event) => {
					// Select only the parts of the context that the block declared in
					// the `providesContext` of its block.json.
					Object.entries(providesBlockContext).forEach(
						([key, attribute]) => {
							if (!event.detail.context[key]) {
								event.detail.context[key] =
									this.#attributes[attribute];
							}
						}
					);
				});
			}

			// Hydrate the interactive blocks.
			this.#hydration = this.getAttribute('data-wp-block-hydration');

			if (this.#hydration) {
				// Check if a View has been registered for this block type before. If
				// not, we add it to the list of elements that need hydration so when
				// the View finally comes, the hydration happens.
				if (!blockViews.has(this.#blockType)) {
					if (!elementsToHydrate.has(this.#blockType)) {
						elementsToHydrate.set(this.#blockType, [this]);
					} else {
						elementsToHydrate.get(this.#blockType).push(this);
					}
					return;
				}

				this.hydrate();
			}
		});
	}

	disconnectedCallback() {
		// Unmount the React component, running callbacks and cleaning up its state.
		unmountComponentAtNode(this);
	}
}

// We need to ensure that the component registration code is only run once
// because it throws if you try to register an element with the same name twice.
// This should not happen in the Gutenberg version because this file should only
// be enqueued/bundled once.
if (customElements.get('wp-block') === undefined) {
	customElements.define('wp-block', WpBlock);
}
