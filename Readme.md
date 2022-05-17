# Block Hydration Experiments

A repository to explore patterns related to block hydration with the goal of absorbing as much complexity as possible from the final developers.

_It's not a goal to do an in-depth analysis of the patterns, only to experiment with them in a controlled environment to assess their potential and then test them in [the Gutenberg repository](https://github.com/WordPress/gutenberg), where we will see if they are a good fit or not._

Ideally, the Save component should be derived from the Frontend implementation, and developers should be able to share as much code as possible between the Edit and Save/Frontend components.

There are some folders in this repository:

- `edit`: User code exclusive to the Edit component.
- `frontend`: User code exclusive to the Frontend component. The Save component is also derived from this.
- `shared`: User code shared between `edit` and `frontend` components.
- `gutenberg-packages`: Framwork code that could be absorbed by Gutenberg packages.
- `webpack`: Bundling configuration that could be absorbed by `@wordpress/scripts` (not existing yet).

Feel free to inspect the code, open issues, submit PRs, ask questions...

## Current Status

[You can see a video with the explanation of the current status on this issue.](https://github.com/luisherranz/block-hydration-experiments/issues/6)

## Current Experiments

- [x] Hydrate Frontend components.
- [x] Make sure Frontend components are automatically rehydrated if they appear in the DOM at any point (not only on page load).
- [ ] Make sure Frontend components are automatically hydrated even if their component is registered after the connectedCallback execution.
- [x] Support partial hydration with Inner blocks (children raw HTML).
  - [x] Support initially hidden Inner blocks: https://github.com/luisherranz/block-hydration-experiments/pull/8
- [x] Use `children` instead of `<InnerBlocks.Content />` in Save component to be able to reuse the same component in the Frontend.
- [x] Serialize attributes and pass them down to the Frontend component.
- [x] Support definition of public frontend attributes and only serialize those: https://github.com/luisherranz/block-hydration-experiments/pull/15.
- [ ] Support attribute sourcing (up for discussion)
- [x] Wrapperless hydration: https://github.com/luisherranz/block-hydration-experiments/pull/3.
- [x] Reuse the same `RichText` component across the different environments (Edit, Save, and Frontend): https://github.com/luisherranz/block-hydration-experiments/pull/2.
- [x] Support `useState` and `useEffect` hook in the Save component to be able to reuse the same component in the Frontend: https://github.com/luisherranz/block-hydration-experiments/pull/3.
- [ ] Support the rest of the hooks in the Save component to be able to reuse the same component in the Frontend.
- [ ] Support the BlockContext between different blocks: https://github.com/luisherranz/block-hydration-experiments/pull/7.
  - [ ] Support "static" (not hydrated) BlockContext parents
- [ ] Support for the Context API between different blocks.
- [ ] Support for Suspense and Error boundaries between different blocks.
- [ ] Support for Block Supports (wrapper only):https://github.com/luisherranz/block-hydration-experiments/pull/3.
- [ ] Avoid the need to populate the `blockProps` (`useBlockProps`).
- [ ] Avoid using `wp` globals in the Frontend.
- [ ] Avoid bundling unnecessary code (like the Save serializer or lodash) in the Frontend.
- [ ] Pattern to export different code depending on the context (Edit, Save, or Frontend).
- [ ] Bundle Preact (compat) instead of React in the Frontend (up for discussion).
- [x] Implement different hydration techniques:https://github.com/luisherranz/block-hydration-experiments/pull/14.
  - [x] Load
  - [x] Idle
  - [x] View
  - [x] Media
- [ ] Change hydration technique based on block attributes.
- [ ] Experiment ways to not hydrate the entire block, only the "client components".
