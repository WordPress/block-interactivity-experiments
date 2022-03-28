import { createElement } from "@wordpress/element";
import { hydrate } from "react-dom";
import Title from "./components/title";
import Button from "./components/button";
import Children from "./children";

const Block = ({ attributes, children }) => (
  <>
    <Title message={attributes.message} />
    <Button />
    {children}
  </>
);

window.addEventListener("load", (event) => {
  document
    .querySelectorAll(".wp-block-luisherranz-block-hydration-experiments")
    .forEach((block) => {
      const attributes = JSON.parse(block.dataset["gutenbergAttributes"]);
      const innerBlocks = block.querySelector("gutenberg-inner-blocks");
      const el = createElement(
        Block,
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
