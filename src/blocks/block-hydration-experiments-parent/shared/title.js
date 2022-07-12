import { RichText } from '../../../gutenberg-packages/wordpress-blockeditor';

const Title = ( { message, ...props } ) => (
	<RichText tagName='h4' className='title' {...props}>{message}</RichText>
);

export default Title;
