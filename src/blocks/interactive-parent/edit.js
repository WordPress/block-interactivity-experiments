// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import Button from './shared/button';
import Title from './shared/title';

const Edit = ({ attributes: { counter, title }, setAttributes }) => (
	<>
		<div {...useBlockProps()}>
			<Title
				onChange={(val) => setAttributes({ title: val })}
				placeholder="This will be passed through context to child blocks"
			>
				{title}
			</Title>
			<Button />
			<button onClick={() => setAttributes({ counter: counter + 1 })}>
				{counter}
			</button>
			<InnerBlocks />
		</div>
	</>
);

export default Edit;
