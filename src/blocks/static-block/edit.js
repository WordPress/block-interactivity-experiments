import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

const Edit = ( { attributes } ) => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<p>static block</p>
			<InnerBlocks />
		</div>
	);
};

export default Edit;
