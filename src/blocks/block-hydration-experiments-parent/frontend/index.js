import { useState } from '../../../gutenberg-packages/wordpress-element';
import Button from '../shared/button';
import Title from '../shared/title';

const Frontend = (
	{ blockProps, attributes: { counter: initialCounter, message }, children },
) => {
	const [ show, setShow ] = useState( false );
	const [ counter, setCounter ] = useState( initialCounter );

	return (
		<div {...blockProps}>
			<Title message={message} />
			<Button handler={() => setShow( !show )} />
			<button onClick={() => setCounter( counter + 1 )}>{counter}</button>
			{show && children}
		</div>
	);
};

export default Frontend;
