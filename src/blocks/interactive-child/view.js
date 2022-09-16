import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { useContext, useState } from '../../gutenberg-packages/wordpress-element';

const View = ({ blockProps, context }) => {
	const theme = useContext(ThemeContext);
	const counter = useContext(CounterContext);

	const [shouldThrow, setShouldThrow] = useState(false);

	if (shouldThrow) throw Error('Interactive Child: block broken');

	return (
		<div {...blockProps}>
			<button onClick={() => setShouldThrow(true)}>Throw error</button>
			<p>
				Block Context from interactive parent - "bhe/interactive-title":{' '}
				{context['bhe/interactive-title']}
			</p>
			<p>
				Block Context from non-interactive parent -
				"bhe/non-interactive-title":{' '}
				{context['bhe/non-interactive-title']}
			</p>
			<div className="animation"></div>
			<p>React Context - "counter": {counter}</p>
			<p>React Context - "theme": {theme}</p>
		</div>
	);
};

export default View;
