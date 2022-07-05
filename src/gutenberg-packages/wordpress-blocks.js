import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import {
	getBlockType,
	registerBlockType as gutenbergRegisterBlockType,
} from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';
import { pickKeys } from './utils';

const save = ( name, Comp ) =>
	( { attributes } ) => {
		const blockProps = useBlockProps.save();
		const innerBlocksProps = useInnerBlocksProps.save();

		return (
			<Fragment>
				<Comp blockProps={blockProps} attributes={attributes}>
					<gutenberg-inner-blocks {...innerBlocksProps} />
				</Comp>
				{
					/* Render InnerBlocks inside a template, to avoid losing them
            if Comp doesn't render them. */
				}
				<template class='gutenberg-inner-blocks' {...innerBlocksProps} />
			</Fragment>
		);
	};

const saveWithStaticContext = ( name, blockSave ) =>
	( { attributes } ) => {
		const blockProps = useBlockProps.save();
		const innerBlocksProps = useInnerBlocksProps.save();
		const blockType = getBlockType( name );

		// We use the presence of any attribute with `frontend: true` as a signal
		// here that the block should pass some context on the frontend as well.
		//
		// TODO: This should probably be optimized when merged into gutenberg so
		// that we don't run this check for EVERY save() of every block.
		const hasFrontendAttributes = Object.values( blockType?.attributes ).some(
			attribute => attribute?.frontend
		);

		if ( !attributes?.hydrate && hasFrontendAttributes ) {
			// Only add the attributes that are explicitly declared with `frontend: true`
			let frontendAttributes = {};
			for ( const [ key, value ] of Object.entries( blockType?.attributes ) ) {
				if (
					value?.frontend && Object
						.values( blockType?.providesContext )
						.includes( key )
				) {
					frontendAttributes[key] = attributes[key];
				}
			}

			// Pick the attributes that are explicitly declared in the block's `providesContext`.
			let context = blockType?.providesContext &&
				pickKeys(
					frontendAttributes,
					Object.values( blockType?.providesContext ),
				);

			// Rename the attributes to match the context names.
			for ( const value of Object.keys( context ) ) {
				const key = Object.keys( blockType?.providesContext ).find(key =>
					blockType?.providesContext[key] === value
				);
				if ( key ) {
					context[key] = context[value];
					delete context[value];
				}
			}

			return (
				<static-context context={JSON.stringify( context )}>
					<div {...blockProps}>
						<div {...innerBlocksProps} />
					</div>
				</static-context>
			);
		}

		return (
			<div {...blockProps}>
				<div {...innerBlocksProps} />
			</div>
		);
	};

export const registerBlockType = (
	name,
	{ frontend, save: blockSave, edit, ...rest },
) => {
	gutenbergRegisterBlockType( name, {
		edit,
		save: blockSave ?
			saveWithStaticContext( name, blockSave ) :
			save( name, frontend ),
		...rest,
	} );
};
