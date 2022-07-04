import { useState } from '../../../gutenberg-packages/wordpress-element';
import Button from '../shared/button';
import Title from '../shared/title';

const Frontend = (
	{
		blockProps: { className },
		attributes: { counter: initialCounter, message },
		children,
	},
) => {
	const [ show, setShow ] = useState( false );
	const [ counter, setCounter ] = useState( initialCounter );

	return (
		<div className={`${className} ${show ? 'show' : 'hide'}`}>
			<Title message={message} />
			<Button handler={() => setShow( !show )} />
			<button onClick={() => setCounter( counter + 1 )}>{counter}</button>
			{show && children}
		</div>
	);
};

export default Frontend;
