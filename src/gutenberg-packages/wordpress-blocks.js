import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { registerBlockType as gutenbergRegisterBlockType } from '@wordpress/blocks';

const save = ( Comp ) =>
	( { attributes } ) => {
		const blockProps = useBlockProps.save();
		const innerBlocksProps = useInnerBlocksProps.save();

		return (
			<>
				<Comp blockProps={blockProps} attributes={attributes} context={{}}>
					<gutenberg-inner-blocks {...innerBlocksProps} />
				</Comp>
				{
					/* Render InnerBlocks inside a template, to avoid losing them
            if Comp doesn't render them. */
				}
				<template class='gutenberg-inner-blocks' {...innerBlocksProps} />
			</>
		);
	};

export const registerBlockType = ( name, { frontend, edit, ...rest } ) => {
	gutenbergRegisterBlockType( name, { edit, save: save( frontend ), ...rest } );
};
