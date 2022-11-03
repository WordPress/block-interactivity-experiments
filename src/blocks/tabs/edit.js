import { useBlockProps } from '@wordpress/block-editor';

const Edit = () => {
	return <div {...useBlockProps()}>I'm a tab</div>;
};

export default Edit;
