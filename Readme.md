# Block Hydration Experiments

This repository aims to explore block hydration patterns with the goal of absorbing as much complexity as possible from the final developers.

_It's not a goal to do an in-depth analysis of the patterns, only to experiment with them in a controlled environment to assess their potential and then test them in [the Gutenberg repository](https://github.com/WordPress/gutenberg), where we will see if they are a good fit or not._

## Current Experiments

- 🏝 **Island Hydration**

  - Main branch: `main-island-hydration`
  - Tracking Issue: [Tracking issue: Island Hydration 🏝](https://github.com/WordPress/block-hydration-experiments/issues/39)

  This hydration method is based on custom elements (`<wp-block>`) that hydrates isolated islands. It interconnects those islands through synchronized bridges for APIs like `context`, `Suspense` or `ErrorBoundary`.

- ⚛️ **Full vDOM Hydration**

  - Main branch: `main-full-vdom-hydration`
  - Tracking Issue: [Tracking issue: Full vDOM Hydration ⚛](https://github.com/WordPress/block-hydration-experiments/issues/64)

  This hydration method is based on the creation of a static virtual DOM from the root, where only the interactive components are replaced by P/React components. It behaves like a single P/React application.

## Project structure

Blocks are structured using these folders/files:

- `edit`: User code exclusive to the `Edit` component.
- `view`: User code exclusive to the `View` component.
- `shared`: User code shared between `Edit` and `View` components.
- `gutenberg-packages`: Framework code that should be absorbed by Gutenberg packages.
- `webpack`: Bundling configuration that should be absorbed by `@wordpress/scripts`.

## Block Requirements

If you want to use these experiments on your blocks, they will need:

- To have a `block.json` file.
- To be registered on the server.

## Collaborate!

Feel free to clone this repository and inspect the code, open issues, submit PRs, suggest features or ask questions!

And if you are doing any other frontend-related work, please leave a comment in this [Make Core post](https://make.wordpress.org/core/2022/04/27/exploration-to-enable-better-developer-and-visitor-experiences-with-blocks/).
