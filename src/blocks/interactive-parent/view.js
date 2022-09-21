import Counter from '../../context/counter';
import Theme from '../../context/theme';
import {
	useState,
	useErrorBoundary,
} from '../../gutenberg-packages/wordpress-element';

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

	const [error, resetError] = useErrorBoundary();

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
					{!error && show && children}
					{error && (
						<div>
							<p>{error.toString()}</p>
							<button onClick={resetError}>
								Attempt recovery
							</button>
						</div>
					)}
				</div>
			</Theme.Provider>
		</Counter.Provider>
	);
};

export default View;
