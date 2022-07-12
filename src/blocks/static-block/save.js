import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const save = ( { attributes } ) => (
	<div {...useBlockProps.save()}>
		<p className='content'>{attributes?.content}</p>
		<InnerBlocks.Content />
	</div>
);

export default save;
