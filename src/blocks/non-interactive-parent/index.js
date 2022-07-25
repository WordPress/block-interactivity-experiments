import { registerBlockType } from '../../gutenberg-packages/wordpress-blocks';
import metadata from './block.json';
import edit from './edit';
import frontend from './frontend';
import './style.scss';

const { name } = metadata;

registerBlockType(name, { edit, frontend });
