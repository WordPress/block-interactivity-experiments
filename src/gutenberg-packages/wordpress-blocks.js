import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { registerBlockType as gutenbergRegisterBlockType } from "@wordpress/blocks";

const save =
  (name, Comp) =>
  ({ attributes }) => {
    const blockProps = useBlockProps.save();
    return (
      <gutenberg-interactive-block
        data-gutenberg-block-type={name}
        data-gutenberg-attributes={JSON.stringify(attributes)}
        data-gutenberg-block-props={JSON.stringify(blockProps)}
        data-gutenberg-hydrate="view"
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
