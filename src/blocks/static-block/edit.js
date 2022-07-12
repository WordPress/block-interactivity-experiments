import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { RichText } from '../../gutenberg-packages/wordpress-blockeditor';

const Edit = ( { attributes, setAttributes } ) => {
	const blockProps = useBlockProps();
	return (
		<div {...blockProps}>
			<RichText
				tagName='h4'
				className='content'
				onChange={( val ) => setAttributes( { content: val } )}
				placeholder='This will be passed through context to child blocks'
				value={attributes.content}
			>
				{attributes.content}
			</RichText>
			<InnerBlocks />
		</div>
	);
};

export default Edit;
