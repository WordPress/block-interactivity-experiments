// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import Button from './shared/button';
import Title from './shared/title';

export default function Edit(
	{ attributes: { counter, message }, setAttributes },
) {
	const blockProps = useBlockProps();
	return (
		<>
			<div {...blockProps}>
				<Title
					value={message}
					onChange={( val ) => setAttributes( { message: val } )}
					placeholder='Enter the Title'
				/>
				<Button />
				<button onClick={() => setAttributes( { counter: counter + 1 } )}>
					{counter}
				</button>
				<InnerBlocks />
			</div>
		</>
	);
}
