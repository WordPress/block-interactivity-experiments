import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { RichText } from '../../gutenberg-packages/wordpress-blockeditor';

const Edit = ({ attributes, setAttributes }) => (
	<div {...useBlockProps()}>
		<RichText
			tagName="h4"
			className="title"
			onChange={(val) => setAttributes({ title: val })}
			placeholder="This will be passed through context to child blocks"
			value={attributes.title}
		>
			{attributes.title}
		</RichText>
		<InnerBlocks />
	</div>
);
export default Edit;
