import CounterContext from '../../context/counter';
import { useContext } from '../../gutenberg-packages/wordpress-element';

const Frontend = ( { blockProps, context } ) => {
	const value = useContext( CounterContext );

	return (
		<div {...blockProps}>
			<p>Child element</p>
			<p>Block Context: {context?.message}</p>
			<p>React Context: {value}</p>
		</div>
	);
};

export default Frontend;
