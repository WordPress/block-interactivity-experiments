import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import './style.scss';

registerBlockType('bhe/tabs', {
	edit: Edit,
	save: () => null,
});
