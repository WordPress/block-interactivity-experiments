/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import { InnerBlocks } from '@wordpress/block-editor';
import './style.scss';

// Register the block
registerBlockType('bhe/dynamic-interactive-parent', {
    edit: Edit,
    // If I don't add this, the InnerBlocks don't seem to work in dynamic blocks.
    save: () => {
        return <InnerBlocks.Content />
    }
});