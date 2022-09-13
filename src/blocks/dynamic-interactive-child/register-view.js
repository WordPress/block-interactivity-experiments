import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import registerBlockView from '../../gutenberg-packages/register-block-view';
import View from './view';

registerBlockView('bhe/dynamic-interactive-child', View, {
    usesContext: [ThemeContext, CounterContext],
});
