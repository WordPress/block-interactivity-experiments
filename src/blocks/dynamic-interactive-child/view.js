import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { useContext } from '../../gutenberg-packages/wordpress-element';

const View = ({ blockProps, attributes }) => {
    const counter = useContext(CounterContext);

    return (
        <div {...blockProps}>
            <p>Post Date: {attributes.date}</p>
            <p>Counter: {counter}</p>
        </div>
    );
};

export default View;