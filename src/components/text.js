import { RichText } from '@wordpress/block-editor';

const Text = ({ value, tagName = p, onChange, ...props }) => {
    
    // detect whether should output the content as editable or not
    const isEditable = typeof onChange === 'function';

    const Tag = isEditable ? RichText : RichText.Content;

    return <Tag
        tagName={tagName}
        value={value}
        onChange={ isEditable ? onChange : undefined }
        {...props}
    />;
};

export default Text;