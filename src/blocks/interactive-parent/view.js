import { useState } from '../../gutenberg-packages/wordpress-element';
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
			<button onClick={() => setShow(!show)}>Show</button>
			<button onClick={() => setBold(!bold)}>Bold</button>
			<button onClick={() => setCounter(counter + 1)}>{counter}</button>
			{show && children}
		</div>
	);
};

export default View;
