import { hydrate } from "react-dom";

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

const view = (name, Comp) => {
  customElements.define(
    name.replace("/", "_"),
    class extends HTMLDivElement {
      connectedCallback() {
        setTimeout(() => {
          const attributes = JSON.parse(this.dataset["gutenbergAttributes"]);
          const innerBlocks = this.querySelector("gutenberg-inner-blocks");
          hydrate(
            <Comp
              isView={true}
              attributes={attributes}
              suppressHydrationWarning={true}
            >
              <Children
                value={innerBlocks && innerBlocks.innerHTML}
                suppressHydrationWarning={true}
              />
            </Comp>,
            this
          );
        });
      }
    },
    { extends: "div" }
  );
};

export default view;
