import { registerBlockType as gutenbergRegisterBlockType } from "@wordpress/blocks";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

const save = (name, Comp) => ({ attributes }) => {
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

export const registerBlockType = (name, { frontend, edit, ...rest }) => {
  gutenbergRegisterBlockType(name, {
    edit,
    save: save(name, frontend),
    ...rest,
  });
};
