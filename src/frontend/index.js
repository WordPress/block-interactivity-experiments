import { useState } from '../gutenberg-packages/wordpress-element';
import Title from '../shared/title';
import Button from './button';

const Block = ( { blockProps, attributes, children } ) => {
	const [ show, setShow ] = useState( false );
	const [ counter, setCounter ] = useState( 0 );

	return (
		<div {...blockProps}>
			<Title message={attributes.message} />
			<Button handler={() => setShow( !show )} />
			<button onClick={() => setCounter( counter + 1 )}>{counter}</button>
			{show && children}
		</div>
	);
};

export default Block;
