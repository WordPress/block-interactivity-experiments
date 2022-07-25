import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const save = ({ attributes }) => (
	<div {...useBlockProps.save()}>
		<p className="title">{attributes.title}</p>
		<InnerBlocks.Content />
	</div>
);

export default save;
