// a simple shim of the RichText.Content component for the frontend
function RichTextContent({ value, tagName: Tag, ...props }) {
    return <Tag {...props}>{value}</Tag>;
}

const Text = ({ value, tagName = p, onChange, ...props }) => {

    // detect whether should output the content as editable or not
    const isEditable = typeof onChange === 'function';

    // the `window.wp.blockEditor.RichText` is only available in the editor
    const Tag = isEditable ? window.wp.blockEditor.RichText : RichTextContent;

    return <Tag
        tagName={tagName}
        value={value}
        onChange={isEditable ? onChange : undefined}
        {...props}
    />;
};

export default Text;