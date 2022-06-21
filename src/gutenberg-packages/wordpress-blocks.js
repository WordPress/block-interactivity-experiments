import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { registerBlockType as gutenbergRegisterBlockType } from '@wordpress/blocks';
import { Fragment } from '@wordpress/element';

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

export const registerBlockType = ( name, { frontend, edit, ...rest } ) => {
	gutenbergRegisterBlockType( name, {
		edit,
		save: save( name, frontend ),
		...rest,
	} );
};
