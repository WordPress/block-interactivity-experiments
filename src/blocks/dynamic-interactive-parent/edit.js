// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';

const Edit = ({ attributes, setAttributes, context }) => {
    const blockProps = useBlockProps();
    const { postType, postId, queryId } = context;

    const [rawTitle = '', setTitle, fullTitle] = useEntityProp(
        'postType',
        postType,
        'title',
        postId
    );

    return (
        <div {...blockProps}>
            <h2>Post Title: {fullTitle?.rendered}</h2>
            <button onClick={() => setAttributes({ counter: attributes.counter + 1 })}>
                {attributes.counter}
            </button>
            <InnerBlocks />
        </div>
    )
};

export default Edit;