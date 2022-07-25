// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';
import { useBlockProps } from '@wordpress/block-editor';

const Edit = ({ context }) => (
	<div {...useBlockProps()}>
		<p>
			Block Context from interactive parent - "bhe/interactive-title":{' '}
			{context['bhe/interactive-title']}
		</p>
		<p>
			Block Context from non-interactive parent -
			"bhe/non-interactive-title": {context['bhe/non-interactive-title']}
		</p>
	</div>
);

export default Edit;
