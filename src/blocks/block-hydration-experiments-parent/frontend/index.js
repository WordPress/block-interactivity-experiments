import Counter from '../../../context/counter';
import { useState } from '../../../gutenberg-packages/wordpress-element';
import Button from '../shared/button';
import Title from '../shared/title';

const Frontend = (
	{ blockProps, attributes: { counter: initialCounter, message }, children },
) => {
	const [ show, setShow ] = useState( true );
	const [ counter, setCounter ] = useState( initialCounter );
	return (
		<Counter.Provider value={counter}>
			<div {...blockProps}>
				<Title message={message} />
				<Button handler={() => setShow( !show )} />
				<button onClick={() => setCounter( counter + 1 )}>{counter}</button>
				{show && children}
			</div>
		</Counter.Provider>
	);
};

export default Frontend;
