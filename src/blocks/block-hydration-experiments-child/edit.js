// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

const Edit = ( { context } ) => {
	const blockProps = useBlockProps();

	return (
		<div {...blockProps}>
			<p>Child element</p>
			{context?.message}
		</div>
	);
};

export default Edit;
