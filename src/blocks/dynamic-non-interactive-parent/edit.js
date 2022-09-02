// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { RichText } from '../../gutenberg-packages/wordpress-blockeditor';

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
            <RichText
                tagName="h4"
                className="dynamic-non-interactive-parent-block-title"
                onChange={(val) => setAttributes({ blockTitle: val })}
                placeholder="This will be passed through context to child blocks"
                value={attributes.blockTitle}
            >
                {attributes.blockTitle}
            </RichText>
            <InnerBlocks />
        </div>
    )
};

export default Edit;