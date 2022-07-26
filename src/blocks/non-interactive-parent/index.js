import { registerBlockType } from '../../gutenberg-packages/wordpress-blocks';
import metadata from './block.json';
import Edit from './edit';
import View from './view';
import './style.scss';

const { name } = metadata;

registerBlockType(name, {
	edit: Edit,
	view: View, // The Save component is derived from the View component.
});
