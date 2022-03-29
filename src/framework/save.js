import { name } from "../block.json";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const save = (Comp) => ({ attributes }) => (
  <div
    is={name.replace("/", "_")}
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
