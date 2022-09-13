import Counter from '../../context/counter';
import Theme from '../../context/theme';
import { useState } from '../../gutenberg-packages/wordpress-element';

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
		<Counter.Provider value={counter}>
			<Theme.Provider value="cool theme">
				<div
					className={`${className} ${show ? 'show' : 'hide'}`}
					style={{
						...style,
						fontWeight: bold ? 900 : fontWeight,
					}}
				>
					<h2 className="title">{title}</h2>
					<button onClick={() => setShow(!show)}>Show</button>
					<button onClick={() => setBold(!bold)}>Bold</button>
					<button onClick={() => setCounter(counter + 1)}>
						{counter}
					</button>
					{show && children}
				</div>
			</Theme.Provider>
		</Counter.Provider>
	);
};

export default View;
