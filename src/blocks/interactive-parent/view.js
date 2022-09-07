import { createContext, useState } from 'preact/compat';
import Button from './shared/button';
import Title from './shared/title';

const Counter = createContext(null);
const Theme = createContext(null);

const View = ({ children }) => {
	const [show, setShow] = useState(true);
	const [bold, setBold] = useState(true);
	const [counter, setCounter] = useState(0);

	return (
		<Counter.Provider value={counter}>
			<Theme.Provider value="cool theme">
				<div
					className={`${className} ${show ? 'show' : 'hide'}`}
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

export default View;
