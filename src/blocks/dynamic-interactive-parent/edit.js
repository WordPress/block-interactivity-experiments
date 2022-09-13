// This import is needed to ensure that the `wp.blockEditor` global is available
// by the time this component gets loaded. The `Title` component consumes the
// global but cannot import it because it shouldn't be loaded on the frontend of
// the site.
import '@wordpress/block-editor';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';

import Button from './shared/button';
import Title from './shared/title';

const Edit = ({ attributes, setAttributes, context }) => {
    const { counter, blockTitle, secret } = attributes;
    const { postType, postId, queryId } = context;

    const [rawTitle = '', setTitle, fullTitle] = useEntityProp(
        'postType',
        postType,
        'title',
        postId
    );

    return (
        <div {...useBlockProps()}>
            <h2>Post Title: {fullTitle?.rendered}</h2>
            <Title
                value={blockTitle}
                onChange={(val) => setAttributes({ blockTitle: val })}
                placeholder="This will be passed through context to child blocks"
                className="dynamic-interactive-parent-block-title"
            >
                {blockTitle}
            </Title>
            <Button>Show</Button>
            <button onClick={() => setAttributes({ counter: counter + 1 })}>
                {counter}
            </button>
            <blockquote style={{ fontSize: '10px' }}>
                This is a secret attribute that should not be serialized:{' '}
                {secret}
            </blockquote>
            <InnerBlocks />
        </div>
    )
};

export default Edit;