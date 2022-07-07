import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { RichText } from '../../gutenberg-packages/wordpress-blockeditor';

const Edit = ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<RichText
				tagName='h3'
				className='content'
				onChange={( val ) => setAttributes( { content: val } )}
				placeholder='Enter the content'
				value={attributes.content}
			>
				{attributes.content}
			</RichText>
			<InnerBlocks />
		</div>
	);
};

export default Edit;
