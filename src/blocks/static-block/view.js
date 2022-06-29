import { registerBlockType } from '../../gutenberg-packages/frontend';
import save from './save';

registerBlockType( 'bhe/static-block', save );
