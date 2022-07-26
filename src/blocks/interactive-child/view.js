import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { useContext } from '../../gutenberg-packages/wordpress-element';

const View = ({ blockProps, context }) => {
	const theme = useContext(ThemeContext);
	const counter = useContext(CounterContext);

	return (
		<div {...blockProps}>
			<p>
				Block Context from interactive parent - "bhe/interactive-title":{' '}
				{context['bhe/interactive-title']}
			</p>
			<p>
				Block Context from non-interactive parent -
				"bhe/non-interactive-title":{' '}
				{context['bhe/non-interactive-title']}
			</p>
			<p>React Context - "counter": {counter}</p>
			<p>React Context - "theme": {theme}</p>
		</div>
	);
};

export default View;
