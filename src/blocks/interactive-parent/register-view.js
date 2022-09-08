import 'preact/debug';

import registerBlockView from '../../gutenberg-packages/register-block-view';
import View from './view';

registerBlockView('bhe/interactive-parent', View);
