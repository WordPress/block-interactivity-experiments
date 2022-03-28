import { createElement } from "@wordpress/element";
import { hydrate } from "react-dom";
import Block from "./components/block";
import Children from "./children";

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
