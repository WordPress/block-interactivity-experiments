import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import './style.scss';

registerBlockType('bhe/favorites-number', {
	edit: Edit,
	save: () => null,
});
