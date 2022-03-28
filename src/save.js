import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import Title from "./components/title";
import Button from "./components/button";

const Save = ({ attributes }) => (
  <gutenberg-root
    {...useBlockProps.save()}
    data-gutenberg-attributes={JSON.stringify(attributes)}
  >
    <Title message={attributes.message} />
    <Button />
    <gutenberg-inner-blocks>
      <InnerBlocks.Content />
    </gutenberg-inner-blocks>
  </gutenberg-root>
);

export default Save;
