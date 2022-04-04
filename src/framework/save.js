import { name } from "../block.json";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const save = (Comp) => ({ attributes }) => {
  const blockProps = useBlockProps.save();
  return (
    <gutenberg-interactive-block
      data-gutenberg-block-type={name}
      data-gutenberg-attributes={JSON.stringify(attributes)}
      data-gutenberg-block-props={JSON.stringify(blockProps)}
    >
      <Comp blockProps={blockProps} attributes={attributes}>
        <gutenberg-inner-blocks>
          <InnerBlocks.Content />
        </gutenberg-inner-blocks>
      </Comp>
    </gutenberg-interactive-block>
  );
};

export default save;
