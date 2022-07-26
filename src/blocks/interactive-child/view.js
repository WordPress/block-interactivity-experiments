import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { registerBlockType } from '../../gutenberg-packages/frontend';
import Frontend from './frontend';

registerBlockType('bhe/interactive-child', Frontend, {
	usesContext: [ThemeContext, CounterContext],
});
