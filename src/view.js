import Frontend from './frontend';
import { registerBlockType } from './gutenberg-packages/frontend';

registerBlockType( 'luisherranz/block-hydration-experiments', Frontend );
