import { registerBlockType } from '../../gutenberg-packages/wordpress-blocks';
import Edit from './edit';
import View from './view';
import './style.scss';

registerBlockType('bhe/interactive-parent', {
	edit: Edit,
	view: View, // The Save component is derived from the View component.
});
