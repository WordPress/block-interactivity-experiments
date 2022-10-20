import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import './style.scss';

registerBlockType('bhe/post-favorite', {
	edit: Edit,
	save: () => null,
});
