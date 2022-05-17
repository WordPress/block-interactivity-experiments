import { useBlockEnvironment } from "./wordpress-element";

export const RichText = ( { tagName: Tag, children, ...props } ) => {
  return useBlockEnvironment(  ) === "edit"
    ? (
      <window.wp.blockEditor.RichText
        value={children}
        tagName={Tag}
        {...props}
      />
    )
    : <Tag {...props}>{children}</Tag>;
};
