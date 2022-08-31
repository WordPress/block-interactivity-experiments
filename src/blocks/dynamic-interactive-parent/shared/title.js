import { RichText } from '../../../gutenberg-packages/wordpress-blockeditor';

const Title = ({ children, ...props }) => (
	<RichText tagName="h2" className="title" {...props}>
		{children}
	</RichText>
);

export default Title;
