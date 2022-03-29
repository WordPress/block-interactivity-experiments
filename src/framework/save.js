import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const save = (Comp) => ({ attributes }) => (
  <div
    {...useBlockProps.save()}
    data-gutenberg-attributes={JSON.stringify(attributes)}
  >
    <Comp attributes={attributes}>
      <gutenberg-inner-blocks>
        <InnerBlocks.Content />
      </gutenberg-inner-blocks>
    </Comp>
  </div>
);

export default save;
