import { matcherFromSource, pickKeys } from './utils';
import { EnvContext, hydrate } from './wordpress-element';

// We assign `blockTypes` to window to make sure it's a global singleton.
//
// Have to do this because of the way we are currently bundling the code
// in this repo, each block gets its own copy of this file.
//
// We COULD fix this by doing some webpack magic to spit out the code in
// `gutenberg-packages` to a shared chunk but assigning `blockTypes` to window
// is a cheap hack for now that will be fixed once we can merge this code into Gutenberg.
if ( typeof window.blockTypes === 'undefined' ) {
	window.blockTypes = new Map();
}

export const registerBlockType = ( name, Comp ) => {
	window.blockTypes.set( name, Comp );
};

const Children = ( { value, providedContext } ) => {
	if ( !value ) {
		return null;
	}
	return (
		<gutenberg-inner-blocks
			ref={( el ) => {
				if ( el !== null ) {
					// listen for the ping from the child
					el.addEventListener( 'gutenberg-context', ( event ) => {
						event.stopPropagation();
						event.detail.context = providedContext;
					} );
				}
			}}
			suppressHydrationWarning={true}
			dangerouslySetInnerHTML={{ __html: value }}
		/>
	);
};
Children.shouldComponentUpdate = () => false;

class GutenbergBlock extends HTMLElement {
	connectedCallback() {
		setTimeout( () => {
			// ping the parent for the context
			const event = new CustomEvent( 'gutenberg-context', {
				detail: {},
				bubbles: true,
				cancelable: true,
			} );
			this.dispatchEvent( event );

			const usesContext = JSON.parse(
				this.getAttribute( 'data-gutenberg-context-used' ),
			);
			const providesContext = JSON.parse(
				this.getAttribute( 'data-gutenberg-context-provided' ),
			);
			const attributes = JSON.parse(
				this.getAttribute( 'data-gutenberg-attributes' ),
			);
			const sourcedAttributes = JSON.parse(
				this.getAttribute( 'data-gutenberg-sourced-attributes' ),
			);

			for ( const attr in sourcedAttributes ) {
				attributes[attr] = matcherFromSource( sourcedAttributes[attr] )( this );
			}

			// pass the context to children if needed
			const providedContext = pickKeys(
				attributes,
				Object.keys( providesContext ),
			);

			// select only the parts of the context that the block declared in
			// the `usesContext` of its block.json
			const context = pickKeys( event.detail.context, usesContext );

			const blockType = this.getAttribute( 'data-gutenberg-block-type' );
			const blockProps = {
				className: this.children[0].className,
				//style: this.children[0].style?.cssText // FIXME
			};

			const innerBlocks = this.querySelector(
				'template.gutenberg-inner-blocks',
			);
			const Comp = window.blockTypes.get( blockType );
			const technique = this.getAttribute( 'data-gutenberg-hydrate' );
			const media = this.getAttribute( 'data-gutenberg-media' );
			const hydrationOptions = { technique, media };
			hydrate(
				<EnvContext.Provider value='frontend'>
					<Comp
						attributes={attributes}
						blockProps={blockProps}
						suppressHydrationWarning={true}
						context={context}
					>
						<Children
							value={innerBlocks && innerBlocks.innerHTML}
							suppressHydrationWarning={true}
							providedContext={providedContext}
						/>
					</Comp>
					<template
						className='gutenberg-inner-blocks'
						suppressHydrationWarning={true}
					/>
				</EnvContext.Provider>,
				this,
				hydrationOptions,
			);
		} );
	}
}

// We need to wrap the element registration code in a conditional for the same
// reason we assing `blockTypes` to window (see top of the file).
//
// We need to ensure that the component registration code is only run once
// because it throws if you try to register an element with the same name twice.
if ( customElements.get( 'gutenberg-interactive-block' ) === undefined ) {
	customElements.define( 'gutenberg-interactive-block', GutenbergBlock );
}
