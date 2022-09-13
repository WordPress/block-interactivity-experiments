// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';

import { InnerBlocks, useBlockProps, RichText } from '@wordpress/block-editor';

const Edit = ({
	attributes: { counter = 0, title, secret },
	setAttributes,
}) => (
	<>
		<div {...useBlockProps()}>
			<RichText
				tagName="h2"
				className="title"
				value={title}
				onChange={(val) => setAttributes({ title: val })}
				placeholder="This will be passed through context to child blocks"
			/>
			<button>Show</button>
			<button onClick={() => setAttributes({ counter: counter + 1 })}>
				{counter}
			</button>
			<blockquote style={{ fontSize: '10px' }}>
				This is a secret attribute that should not be serialized:{' '}
				{secret}
			</blockquote>
			<InnerBlocks />
		</div>
	</>
);

export default Edit;
