# Block Hydration Experiments

A repository to explore possible frontend solutions for Gutenberg.

Feel free to inspect the code, open issues, submit PRs, ask questions...

## Current Experiments

- [x] Hydrate Frontend components.
- [x] Make sure Frontend components are automatically rehydrated if they appear in the DOM at any point (not only on page load).
- [x] Support partial hydration with Inner blocks (children raw HTML).
- [x] Use `children` instead of `<InnerBlocks.Content />` in Save component to be able to reuse the same component in the Frontend.
- [x] Serialize attributes and pass them down to the Frontend component.
- [x] Wrapperless hydration: https://github.com/luisherranz/block-hydration-experiments/pull/3.
- [x] Reuse the same `RichText` component across the different environments (Edit, Save and Frontend): https://github.com/luisherranz/block-hydration-experiments/pull/2.
- [ ] Support `useState` and `useEffect` hook in the Save component to be able to reuse the same component in the Frontend: https://github.com/luisherranz/block-hydration-experiments/pull/3.
- [ ] Support the rest of the hooks in the Save component to be able to reuse the same component in the Frontend.
- [ ] Support for the Context API between different blocks.
- [ ] Support for Block Supports (wrapper only):https://github.com/luisherranz/block-hydration-experiments/pull/3.
- [ ] Avoid the need to populate the `blockProps` (`useBlockProps`).
- [ ] Support initially hidden Inner blocks.
- [ ] Avoid using `wp` globals in the Frontend.
- [ ] Avoid bundling unnecessary code (like the Save serializer or lodash) in the Frontend.
- [ ] Bundle Preact compat instead of React in the Frontend (up for discussion).
