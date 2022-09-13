import Counter from '../../context/counter';
import Theme from '../../context/theme';
import { useState } from '../../gutenberg-packages/wordpress-element';
import Button from './shared/button';
import Title from './shared/title';

const View = ({
    blockProps: {
        className,
        style: { fontWeight, ...style },
    },
    attributes: { counter: initialCounter, blockTitle, state },
    children,
}) => {
    const [show, setShow] = useState(true);
    const [bold, setBold] = useState(false);
    const [counter, setCounter] = useState(initialCounter);
    const { title } = JSON.parse(state);

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
                    <h2>Post Title: {title}</h2>
                    <Title>Block Title: {blockTitle}</Title>
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
