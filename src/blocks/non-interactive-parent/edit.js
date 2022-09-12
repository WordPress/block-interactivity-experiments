import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';

const Edit = ({ attributes, setAttributes }) => (
	<div {...useBlockProps()}>
		<RichText
			tagName="h4"
			className="title"
			onChange={(val) => setAttributes({ title: val })}
			placeholder="This will be passed through context to child blocks"
			value={attributes.title}
		/>
		<InnerBlocks />
	</div>
);
export default Edit;
