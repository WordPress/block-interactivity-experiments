import Counter from '../../context/counter';
import Theme from '../../context/theme';
import { useState } from '../../gutenberg-packages/wordpress-element';
import Button from './shared/button';
import Title from './shared/title';

const Frontend = ({
	blockProps: {
		className,
		style: { fontWeight, ...style },
	},
	attributes: { counter: initialCounter, title },
	children,
}) => {
	const [show, setShow] = useState(true);
	const [bold, setBold] = useState(true);
	const [counter, setCounter] = useState(initialCounter);

	return (
		<Counter.Provider value={counter}>
			<Theme.Provider value="cool theme">
				<div
					className={`${className} ${show ? 'show' : 'hide'}`}
					style={{
						...style,
						fontWeight: bold ? 900 : fontWeight,
					}}
				>
					<Title>{title}</Title>
					<Button handler={() => setShow(!show)}>Show</Button>
					<Button handler={() => setBold(!bold)}>Bold</Button>
					<button onClick={() => setCounter(counter + 1)}>
						{counter}
					</button>
					{show && children}
				</div>
			</Theme.Provider>
		</Counter.Provider>
	);
};

export default Frontend;
