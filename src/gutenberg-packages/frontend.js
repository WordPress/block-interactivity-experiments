import { EnvContext, hydrate } from "./wordpress-element";

const blockTypes = new Map();

document.addEventListener("gutenberg-context", (e) => {
  e.detail.context = { value: "x" };
});

export const registerBlockType = (name, Comp) => {
  blockTypes.set(name, Comp);
};

const Children = ({ value }) => {
  if (!value) return null;
  return (
    <gutenberg-inner-blocks
      suppressHydrationWarning={true}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
Children.shouldComponentUpdate = () => false;

class GutenbergBlock extends HTMLElement {
  connectedCallback() {
    const event = new CustomEvent("gutenberg-context", {
      detail: {},
      bubbles: true,
      cancelable: true,
    });
    this.dispatchEvent(event);
    const context = event.detail.context;
    console.log(context);

    setTimeout(() => {
      const blockType = this.getAttribute("data-gutenberg-block-type");
      const attributes = JSON.parse(
        this.getAttribute("data-gutenberg-attributes"),
      );
      const blockProps = JSON.parse(
        this.getAttribute("data-gutenberg-block-props"),
      );
      const innerBlocks = this.querySelector("template.gutenberg-inner-blocks");
      const Comp = blockTypes.get(blockType);
      const technique = this.getAttribute("data-gutenberg-hydrate");
      const media = this.getAttribute("data-gutenberg-media");
      const hydrationOptions = {
        technique,
        media,
      };
      hydrate(
        <EnvContext.Provider value="frontend">
          <Comp
            attributes={attributes}
            blockProps={blockProps}
            suppressHydrationWarning={true}
          >
            <Children
              value={innerBlocks && innerBlocks.innerHTML}
              suppressHydrationWarning={true}
            />
          </Comp>
          <template
            className="gutenberg-inner-blocks"
            suppressHydrationWarning={true}
          />
        </EnvContext.Provider>,
        this,
        hydrationOptions,
      );
    });
  }
}

customElements.define("gutenberg-interactive-block", GutenbergBlock);
