import { useBlockProps } from '@wordpress/block-editor';
import { registerBlockType } from '@wordpress/blocks';
import './style.scss';

const Edit = () => {
	return <div {...useBlockProps()}>I'm a tab</div>;
};

registerBlockType('bhe/tabs', {
	edit: Edit,
	save: () => null,
});
