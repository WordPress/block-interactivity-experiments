import Text from './text';

const Title = ({ message, ...props }) => <Text tagName="h2" className="title" value={message} {...props} />;

export default Title;
