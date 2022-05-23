import Frontend from './frontend';
import { registerBlockType } from './gutenberg-packages/frontend';

registerBlockType( 'bhe/block-hydration-experiments', Frontend );
