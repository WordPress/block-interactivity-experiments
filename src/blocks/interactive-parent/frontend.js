import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { registerBlockTypeFrontend } from '../../gutenberg-packages/frontend';
import View from './view';

registerBlockTypeFrontend('bhe/interactive-parent', View, {
	providesContext: [ThemeContext, CounterContext],
});
