import Counter from '../../../context/counter';
import { useState } from '../../../gutenberg-packages/wordpress-element';
import Button from '../shared/button';
import Title from '../shared/title';

const Frontend = (
	{ blockProps, attributes: { counter: initialCounter, message }, children },
) => {
	const [ show, setShow ] = useState( false );
	const [ counter, setCounter ] = useState( initialCounter );
	return (
		<Counter.Provider value={[ counter, setCounter ]}>
			<div {...blockProps}>
				<Title message={message} />
				<Button handler={() => setShow( !show )} />

				<Counter.Consumer>
					{/* how I pass this value to a parent Provider */}
					{( [ count, setCount ] ) => (
						<button onClick={() => setCount( count + 1 )}>{count}</button>
					)}
				</Counter.Consumer>
				{show && children}
			</div>
		</Counter.Provider>
	);
};

export default Frontend;
