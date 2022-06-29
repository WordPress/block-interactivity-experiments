import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const save = () => (
	<div {...useBlockProps.save()}>
		<p>static block</p>
		<InnerBlocks.Content />
	</div>
);

export default save;
