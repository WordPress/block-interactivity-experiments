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

const view = (name, Comp) => {
  customElements.define(
    name.replace("/", "_"),
    class extends HTMLDivElement {
      connectedCallback() {
        setTimeout(() => {
          const attributes = JSON.parse(this.dataset["gutenbergAttributes"]);
          const innerBlocks = this.querySelector("gutenberg-inner-blocks");
          const el = createElement(
            Comp,
            { attributes, suppressHydrationWarning: true },
            createElement(Children, {
              value: innerBlocks && innerBlocks.innerHTML,
              suppressHydrationWarning: true,
            })
          );
          hydrate(el, this);
        });
      }
    },
    { extends: "div" }
  );
};

export default view;
