import { useState } from '../../gutenberg-packages/wordpress-element';
import Button from './shared/button';
import Title from './shared/title';

const View = ({
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
			<button onClick={() => setCounter(counter + 1)}>{counter}</button>
			{show && children}
		</div>
	);
};

export default View;
