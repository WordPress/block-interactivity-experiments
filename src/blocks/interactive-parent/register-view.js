import 'preact/debug';
import { useState } from 'preact/compat';
import { createGlobal } from '../../gutenberg-packages/utils';
import registerBlockView from '../../gutenberg-packages/register-block-view';
import View from './view';

registerBlockView('bhe/interactive-parent', View);

const WpBlock = ({ children, ...props }) => {
	const [count, setCount] = useState(0);
	const onClick = () => {
		console.log('hola');
		setCount(count + 1);
	};
	return (
		<wp-block {...props} onClick={onClick}>
			{children}
		</wp-block>
	);
};

const blockViews = createGlobal('blockViewsHacked', {});

blockViews['wp-block'] = WpBlock;
