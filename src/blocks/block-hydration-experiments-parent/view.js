import CounterContext from '../../context/counter';
import { registerBlockType } from '../../gutenberg-packages/frontend';
import Frontend from './frontend';

registerBlockType( 'bhe/block-hydration-experiments-parent', Frontend, {
	providesContext: [ CounterContext ],
} );
