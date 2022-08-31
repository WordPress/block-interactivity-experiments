import CounterContext from '../../context/counter';
import ThemeContext from '../../context/theme';
import { useContext } from '../../gutenberg-packages/wordpress-element';

const View = ({ blockProps, attributes, context }) => {
    const theme = useContext(ThemeContext);
    const counter = useContext(CounterContext);
    const { date } = JSON.parse(attributes.state);

    return (
        <div {...blockProps}>
            <p>
                Block Context from interactive parent - "bhe/interactive-title":{' '}
                {context['bhe/dynamic-interactive-title']}
            </p>
            <p>
                Block Context from non-interactive parent -
                "bhe/non-interactive-title":{' '}
                {context['bhe/dynamic-non-interactive-title']}
            </p>
            <p>React Context - "counter": {counter}</p>
            <p>React Context - "theme": {theme}</p>
            <p>Post Date: {date}</p>
        </div>
    );
};

export default View;
