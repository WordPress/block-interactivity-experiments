import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { registerBlockType } from '../../gutenberg-packages/frontend';
import View from './view';

registerBlockType('bhe/interactive-child', View, {
	usesContext: [ThemeContext, CounterContext],
});
