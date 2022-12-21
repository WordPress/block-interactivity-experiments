import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

const Edit = () => {
	return (
		<div {...useBlockProps()}>
			<h3>Regular block</h3>
			<wp-show when="state.show">
				<InnerBlocks />
			</wp-show>
			<wp-show when="state.dontShow">
				<div>I should not be shown</div>
			</wp-show>
		</div>
	);
};

registerBlockType('bhe/regular', {
	edit: Edit,
	save: () => <InnerBlocks.Content />,
});
