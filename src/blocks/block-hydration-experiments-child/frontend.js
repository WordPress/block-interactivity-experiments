import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { useContext } from '../../gutenberg-packages/wordpress-element';

const Frontend = ( { blockProps, context } ) => {
	const theme = useContext( ThemeContext );
	const value = useContext( CounterContext );

	return (
		<div {...blockProps}>
			<p>Child element</p>
			<p>Block Context: {context?.message}</p>
			<p>React Context: {value}</p>
			<p>Theme: {theme}</p>
		</div>
	);
};

export default Frontend;
