import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { useContext } from '../../gutenberg-packages/wordpress-element';

const Frontend = ({ blockProps, context }) => {
	const theme = useContext(ThemeContext);
	const counter = useContext(CounterContext);

	return (
		<div {...blockProps}>
			<p>Child block</p>
			<p>Block Context - "bhe/title": {context['bhe/title']}</p>
			<p>React Context - "counter": {counter}</p>
			<p>React Context - "theme": {theme}</p>
		</div>
	);
};

export default Frontend;
