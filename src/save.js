import { useBlockProps } from "@wordpress/block-editor";
import InnerBlocks from "./inner-blocks";
import Block from "./components/block";

const Save = ({ attributes }) => (
  <div
    {...useBlockProps.save()}
    data-gutenberg-attributes={JSON.stringify(attributes)}
  >
    <Block attributes={attributes}>
      <InnerBlocks />
    </Block>
  </div>
);

export default Save;
