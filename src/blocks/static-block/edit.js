import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { RichText } from '../../gutenberg-packages/wordpress-blockeditor';

const Edit = ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<div>
				We can use the "content" field below to change the value of the context
			</div>
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
