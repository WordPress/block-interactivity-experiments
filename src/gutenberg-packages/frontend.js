import { Consumer, createProvider } from './react-context';
import { createGlobal, matcherFromSource } from './utils';
import { EnvContext, hydrate } from './wordpress-element';

const blockTypes = createGlobal('gutenbergBlockTypes', new Map());

export const registerBlockType = (name, Component, options) => {
	blockTypes.set(name, { Component, options });
};

const Children = ({ value }) => (
	<gutenberg-inner-blocks
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

class GutenbergBlock extends HTMLElement {
	connectedCallback() {
		setTimeout(() => {
			// Get the block attributes.
			const attributes = JSON.parse(
				this.getAttribute('data-gutenberg-attributes')
			);

			// Add the sourced attributes to the attributes object.
			const sourcedAttributes = JSON.parse(
				this.getAttribute('data-gutenberg-sourced-attributes')
			);
			for (const attr in sourcedAttributes) {
				attributes[attr] = matcherFromSource(sourcedAttributes[attr])(
					this
				);
			}

			// Get the Block Context from their parents.
			const blockContext = {};
			const usesBlockContext = JSON.parse(
				this.getAttribute('data-gutenberg-uses-block-context')
			);
			if (usesBlockContext) {
				const event = new CustomEvent('gutenberg-block-context', {
					detail: { context: {} },
					bubbles: true,
					cancelable: true,
				});
				this.dispatchEvent(event);

				// Select only the parts of the context that the block declared in the
				// `usesContext` of its block.json.
				usesBlockContext.forEach(
					(key) => (blockContext[key] = event.detail.context[key])
				);
			}

			// Share the Block Context with their children.
			const providesBlockContext = JSON.parse(
				this.getAttribute('data-gutenberg-provides-block-context')
			);
			if (providesBlockContext) {
				this.addEventListener('gutenberg-block-context', (event) => {
					// Select only the parts of the context that the block declared in
					// the `providesContext` of its block.json.
					Object.entries(providesBlockContext).forEach(
						([key, attribute]) => {
							if (!event.detail.context[key]) {
								event.detail.context[key] =
									attributes[attribute];
							}
						}
					);
				});
			}

			// Hydrate the interactive blocks.
			const hydration = this.getAttribute('data-gutenberg-hydration');

			if (hydration) {
				const Providers = [];

				// Get the block type, block props (class and style), inner blocks,
				// frontend component and options.
				const blockType = this.getAttribute(
					'data-gutenberg-block-type'
				);
				const innerBlocks = this.querySelector(
					'gutenberg-inner-blocks'
				);
				const { Component, options } = blockTypes.get(blockType);
				const { class: className, style } = JSON.parse(
					this.getAttribute('data-gutenberg-block-props')
				);
				// Temporary element to translate style strings to style objects.
				const el = document.createElement('div');
				el.style.cssText = style;
				const blockProps = { className, style: el.style };
				el.remove();

				// Get the React Context from their parents.
				options?.usesContext?.forEach((context) => {
					const event = new CustomEvent('gutenberg-react-context', {
						detail: { context },
						bubbles: true,
						cancelable: true,
					});
					this.dispatchEvent(event);
					Providers.push(event.detail.Provider);
				});

				// Share the React Context with their children.
				if (options?.providesContext?.length > 0) {
					this.addEventListener(
						'gutenberg-react-context',
						(event) => {
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
						}
					);
				}

				const media = this.getAttribute(
					'data-gutenberg-hydration-media'
				);

				hydrate(
					<EnvContext.Provider value="frontend">
						{/* Wrap the component with all the React Providers */}
						<Wrappers wrappers={Providers}>
							<Component
								attributes={attributes}
								blockProps={blockProps}
								context={blockContext}
							>
								{/* Update the value each time one of the React Contexts changes */}
								{options?.providesContext?.map(
									(context, index) => (
										<Consumer
											key={index}
											element={this}
											context={context}
										/>
									)
								)}

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
							className="gutenberg-inner-blocks"
							suppressHydrationWarning={true}
						/>
					</EnvContext.Provider>,
					this,
					{ technique: hydration, media }
				);
			}
		});
	}
}

// We need to wrap the element registration code in a conditional for the same
// reason we assing `blockTypes` to window (see top of the file).
//
// We need to ensure that the component registration code is only run once
// because it throws if you try to register an element with the same name twice.
if (customElements.get('gutenberg-block') === undefined) {
	customElements.define('gutenberg-block', GutenbergBlock);
}
