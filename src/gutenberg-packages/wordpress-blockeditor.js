import '@wordpress/block-editor';
import { useBlockEnvironment } from './wordpress-element';

export const RichText = ({ tagName: Tag, children, ...props }) => {
	return useBlockEnvironment() === 'edit' ? (
		<window.wp.blockEditor.RichText
			value={children}
			tagName={Tag}
			{...props}
		/>
	) : (
		<Tag {...props} dangerouslySetInnerHTML={{ __html: children }} />
	);
};
