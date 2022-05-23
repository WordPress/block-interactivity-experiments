import Text from '../../frontend/text';
import { registerBlockType } from '../../gutenberg-packages/wordpress-blocks';
import Edit from './edit';
import './style.scss';

registerBlockType( 'bhe/block-hydration-experiments-child', {
	edit: Edit,
	// The Save component is derived from the Frontend component.
	frontend: Text,
} );
