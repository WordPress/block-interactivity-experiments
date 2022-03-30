import { TextControl } from "@wordpress/components";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import Title from "./components/title";

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();
  return (
    <>
      <div {...blockProps}>
        <Title value={attributes.message} onChange={(val) => setAttributes({ message: val })} placeholder="Enter the Title" />
        <InnerBlocks />
      </div>
    </>
  );
}
