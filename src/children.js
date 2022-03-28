import { createElement } from "@wordpress/element";

const Children = ({ value }) => {
  if (!value) return null;
  return createElement("gutenberg-inner-blocks", {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: value },
  });
};
Children.shouldComponentUpdate = () => false;

export default Children;
