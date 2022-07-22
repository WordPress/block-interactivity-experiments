import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import {
  getBlockType,
  registerBlockType as gutenbergRegisterBlockType,
} from "@wordpress/blocks";

const save = (Comp) => ({ attributes }) => {
  const blockProps = useBlockProps.save();
  const innerBlocksProps = useInnerBlocksProps.save();

  return (
    <>
      <Comp blockProps={blockProps} attributes={attributes} context={{}}>
        <gutenberg-inner-blocks {...innerBlocksProps} />
      </Comp>
      {/* Render InnerBlocks inside a template, to avoid losing them
            if Comp doesn't render them. */}
      <template class="gutenberg-inner-blocks" {...innerBlocksProps} />
    </>
  );
};

const saveWithStaticContext = (name, BlockSave) => ({ attributes }) => {
  const blockType = getBlockType(name);

  // TODO: This should probably be optimized when merged into gutenberg so
  // that we don't run this check for EVERY save() of every block.
  const hasFrontendAttributes = Object.values(blockType?.attributes).some(
    (attribute) => attribute?.frontend
  );

  // Only add the attributes that are explicitly declared with `frontend: true`
  if (hasFrontendAttributes) {
    let frontendAttributes = {};
    for (const [key, value] of Object.entries(blockType?.attributes)) {
      if (
        value?.frontend &&
        Object.values(blockType?.providesContext).includes(key)
      ) {
        frontendAttributes[key] = attributes[key];
      }
    }

    // Pick the attributes that are explicitly declared in the block's
    // `providesContext`.
    const providedContext = {};
    Object.entries(blockType.providesContext).forEach(([key, attribute]) => {
      providedContext[key] = frontendAttributes[attribute];
    });

    return (
      <static-context context={JSON.stringify(providedContext)}>
        <BlockSave attributes={attributes} />
      </static-context>
    );
  }

  return <BlockSave attributes={attributes} />;
};

export const registerBlockType = (
  name,
  { frontend, save: BlockSave, edit, ...rest }
) => {
  gutenbergRegisterBlockType(name, {
    edit,
    save: BlockSave ? saveWithStaticContext(name, BlockSave) : save(frontend),
    ...rest,
  });
};
