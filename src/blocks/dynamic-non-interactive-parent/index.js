/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import { RichText, InnerBlocks } from '@wordpress/block-editor';
import './style.scss';

// Register the block
registerBlockType('bhe/dynamic-non-interactive-parent', {
    edit: Edit,
    // If I don't add this, the InnerBlocks don't seem to work in dynamic blocks.
    save: ({ attributes }) => {
        return (
            <>
                <RichText.Content tagName="h2" className="dynamic-non-interactive-parent-block-title" value={attributes.blockTitle} />
                <InnerBlocks.Content />
            </>
        )
    }
});