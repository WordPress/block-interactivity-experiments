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

### Done

- [x] Hydrate Frontend components
- [x] Make sure Frontend components are automatically rehydrated if they appear in the DOM at any point (not only on page load).
- [x] Support partial hydration with Inner blocks (children raw HTML).
- [x] Use children instead of in Save component to be able to reuse the same component in the Frontend.
- [x] Serialize attributes and pass them down to the Frontend component.
- [x] Support initially hidden Inner blocks – [PR](https://github.com/luisherranz/block-hydration-experiments/pull/8)
- [x] Support definition of public frontend attributes and only serialize those – [PR](https://github.com/luisherranz/block-hydration-experiments/pull/15)
- [x] Wrapperless hydration – [PR](https://github.com/luisherranz/block-hydration-experiments/pull/3)
- [x] Reuse the same RichText component across the different environments (Edit, Save, and Frontend) – [PR](https://github.com/luisherranz/block-hydration-experiments/pull/2)
- [x] Support useState and useEffect hook in the Save component to be able to reuse the same component in the Frontend – [PR](https://github.com/luisherranz/block-hydration-experiments/pull/3)
- [x] Implement different hydration techniques: Idle, View, Media – [PR](https://github.com/luisherranz/block-hydration-experiments/pull/14)

### Up next

- [ ] Support for Block Supports (wrapper only) – [PR in progress](https://github.com/luisherranz/block-hydration-experiments/pull/3)
- [ ] Support the BlockContext between different blocks – [PR in progress](https://github.com/luisherranz/block-hydration-experiments/pull/7)
- [ ] Support “static” (not hydrated) BlockContext parents
- [ ] Support for the Context API between different blocks.
- [ ] Support attribute sourcing.
- [ ] Make sure Frontend components are automatically hydrated even if their component is registered after the connectedCallback execution.
- [ ] Avoid the need to populate the blockProps (useBlockProps).
- [ ] Change hydration technique based on block attributes.
- [ ] Support for Suspense and Error boundaries between different blocks.

### Need discussion

- [ ] Experiment with ways to not hydrate the entire block, only the “client components”.
- [ ] Avoid using wp globals in the Frontend
- [ ] Avoid bundling unnecessary code (like the Save serializer or lodash) in the Frontend.
- [ ] Bundle Preact (compat) instead of React in the Frontend.

### Discarded

- ~~Support the rest of the hooks in the Save component to be able to reuse the same component in the Frontend~~
