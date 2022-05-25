import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { registerBlockType as gutenbergRegisterBlockType } from '@wordpress/blocks';
import { getBlockContext, getFrontendAttributes, getSourcedFrontendAttributes } from './utils';

const save = ( name, Comp ) =>
	( { attributes } ) => {
		const blockProps = useBlockProps.save();
		const frontendAttributes = getFrontendAttributes( name, attributes );
		const sourcedFrontendAttributes = getSourcedFrontendAttributes( name );
		const { usesContext, providesContext } = getBlockContext( name );
		const innerBlocksProps = useInnerBlocksProps.save();

		return (
			<gutenberg-interactive-block
				data-gutenberg-block-type={name}
				data-gutenberg-context-used={JSON.stringify( usesContext )}
				data-gutenberg-context-provided={JSON.stringify( providesContext )}
				data-gutenberg-attributes={JSON.stringify( frontendAttributes )}
				data-gutenberg-sourced-attributes={JSON.stringify( sourcedFrontendAttributes )}
				data-gutenberg-block-props={JSON.stringify( blockProps )}
				data-gutenberg-hydrate='idle'
			>
				<Comp blockProps={blockProps} attributes={attributes}>
					<gutenberg-inner-blocks {...innerBlocksProps} />
				</Comp>
				{
					/* Render InnerBlocks inside a template, to avoid losing them
            if Comp doesn't render them. */
				}
				<template class='gutenberg-inner-blocks' {...innerBlocksProps} />
			</gutenberg-interactive-block>
		);
	};

export const registerBlockType = ( name, { frontend, edit, ...rest } ) => {
	gutenbergRegisterBlockType( name, {
		edit,
		save: save( name, frontend ),
		...rest,
	} );
};
