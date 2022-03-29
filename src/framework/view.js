import { createElement } from "@wordpress/element";
import { hydrate } from "react-dom";

const Children = ({ value }) => {
  if (!value) return null;
  return createElement("gutenberg-inner-blocks", {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: value },
  });
};
Children.shouldComponentUpdate = () => false;

const view = (Comp) => {
  window.addEventListener("load", (event) => {
    document
      .querySelectorAll(".wp-block-luisherranz-block-hydration-experiments")
      .forEach((block) => {
        const attributes = JSON.parse(block.dataset["gutenbergAttributes"]);
        const innerBlocks = block.querySelector("gutenberg-inner-blocks");
        debugger;
        const el = createElement(
          Comp,
          { attributes, suppressHydrationWarning: true },
          innerBlocks !== null &&
            createElement(Children, {
              value: innerBlocks.innerHTML,
              suppressHydrationWarning: true,
            })
        );
        hydrate(el, block);
      });
  });
};

export default view;
