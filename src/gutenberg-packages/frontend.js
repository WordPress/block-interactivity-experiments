import { matcherFromSource, pickKeys } from './utils';
import { EnvContext, hydrate, useEffect, useState } from './wordpress-element';

// We assign `blockTypes` to window to make sure it's a global singleton.
//
// Have to do this because of the way we are currently bundling the code
// in this repo, each block gets its own copy of this file.
//
// We COULD fix this by doing some webpack magic to spit out the code in
// `gutenberg-packages` to a shared chunk but assigning `blockTypes` to window
// is a cheap hack for now that will be fixed once we can merge this code into Gutenberg.

// We create a variable for weakmap just to have a quick switch for testing,
// but we can update it later on Gutenberg or other projects.
const createGlobalMap = ( { mapName, weakmap = false } ) => {
	if ( typeof window[mapName] === 'undefined' ) {
		window[mapName] = weakmap ? new WeakMap() : new Map();
	}
};
createGlobalMap( { mapName: 'blockTypes' } );

export const registerBlockType = ( name, Comp, options ) => {
	window.blockTypes.set( name, { Component: Comp, options } );
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

const ConditionalWrapper = ( { condition, wrapper, children } ) =>
	condition ? wrapper( children ) : children;

// We assign `subscribers` to window to not duplicate its creation.
createGlobalMap( { mapName: 'subscribers', weakmap: true } );
createGlobalMap( { mapName: 'initialContextValues', weakmap: true } );

const subscribers = window.subscribers;
const initialContextValues = window.initialContextValues;

const subscribeProvider = ( Context, setValue, block ) => {
	if ( !subscribers.has( Context ) ) {
		subscribers.set( Context, new Set() );
	}
	subscribers.get( Context ).add( { setValue, block } );
};

const updateProviders = ( Context, value, block ) => {
	initialContextValues.set( Context, value );
	if ( subscribers.has( Context ) ) {
		// This setTimeout prevents a React warning about calling setState in a render() function.
		setTimeout( () => {
			subscribers.get( Context ).forEach(
				( { setValue, block: subscriberBlock } ) => {
					if ( subscriberBlock === block ) {
						return setValue( value );
					}
				},
			);
		} );
	}
};

class GutenbergBlock extends HTMLElement {
	connectedCallback() {
		setTimeout( () => {
			let Provider;
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
			const providedContext = providesContext &&
				pickKeys( attributes, Object.keys( providesContext ) );

			// select only the parts of the context that the block declared in
			// the `usesContext` of its block.json
			const context = pickKeys( event.detail.context, usesContext );

			const blockType = this.getAttribute( 'data-gutenberg-block-type' );
			const blockProps = {
				className: this.children[0].className,
				style: this.children[0].style,
			};

			const innerBlocks = this.querySelector( 'gutenberg-inner-blocks' );
			const { Component, options } = window.blockTypes.get( blockType );
			if ( options?.providesContext?.length > 0 ) {
				options?.providesContext.forEach( ( providedContext ) => {
					this.addEventListener( 'react-context', ( event ) => {
						// we compare provided and used context
						if ( event.detail.context === providedContext ) {
							const Context = providedContext;
							const Provider = ( { children } ) => {
								const [ value, setValue ] = useState(
									initialContextValues.get( Context ),
								);
								useEffect( () => {
									subscribeProvider( Context, setValue, this );
								}, [] );
								return (
									<Context.Provider value={value}>{children}</Context.Provider>
								);
							};
							event.detail.Provider = Provider;
							event.stopPropagation();
						}
					} );
				} );
			}
			if ( options?.usesContext?.length > 0 ) {
				options?.usesContext.forEach( ( usesContext ) => {
					const contextEvent = new CustomEvent( 'react-context', {
						detail: { context: usesContext },
						bubbles: true,
						cancelable: true,
					} );
					this.dispatchEvent( contextEvent );
					Provider = contextEvent.detail.Provider;
				} );
			}
			const technique = this.getAttribute( 'data-gutenberg-hydrate' );
			const media = this.getAttribute( 'data-gutenberg-media' );
			const hydrationOptions = { technique, media };
			hydrate(
				<EnvContext.Provider value='frontend'>
					<ConditionalWrapper
						condition={Provider !== undefined}
						wrapper={children => <Provider>{children}</Provider>}
					>
						<Component
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
							{options?.providesContext?.length > 0 &&
								options.providesContext.map(( Context, index ) => (
									<Context.Consumer key={index}>
										{value => updateProviders( Context, value, this )}
									</Context.Consumer>
								))}
						</Component>
					</ConditionalWrapper>
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
