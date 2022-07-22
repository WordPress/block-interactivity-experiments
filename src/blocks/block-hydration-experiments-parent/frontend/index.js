import Counter from '../../../context/counter';
import Theme from '../../../context/theme';
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
			<Theme.Provider value='cool theme'>
				<div {...blockProps}>
					<Title message={message} />
					<Button handler={() => setShow( !show )} />
					<button onClick={() => setCounter( counter + 1 )}>{counter}</button>
					{show && children}
				</div>
			</Theme.Provider>
		</Counter.Provider>
	);
};

export default Frontend;
