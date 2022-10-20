import { registerBlockType } from '@wordpress/blocks';

const Edit = () => <div>hola</div>;

registerBlockType('test/test', {
	edit: Edit,
	save: () => null,
});
