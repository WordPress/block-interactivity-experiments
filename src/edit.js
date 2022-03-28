import { TextControl } from "@wordpress/components";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  return (
    <>
      <div {...blockProps}>
        <TextControl
          placeholder="Enter the title"
          value={attributes.message}
          onChange={(val) => setAttributes({ message: val })}
        />
        <InnerBlocks />
      </div>
    </>
  );
}
