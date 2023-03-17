# Block Interactivity Experiments

This repository aims to explore block interactivity patterns with the goal of absorbing as much complexity as possible from the final developers.

_It's not a goal to do an in-depth analysis of the patterns, only to experiment with them in a controlled environment to assess their potential and then test them in [the Gutenberg repository](https://github.com/WordPress/gutenberg), where we will see if they are a good fit or not._

## Current Experiments

- 🎨 **WordPress Directives Plugin**

  - Main branch: `main-wp-directives-plugin` 
  - Tracking Issue: [Tracking issue: WordPress Directives Plugin 🎨](https://github.com/WordPress/block-interactivity-experiments/issues/80)

  An installable plugin that adds a set of basic directives and client-side navigation.

- 🧩 **Custom Elements Hydration**

  - Main branch: `main-custom-elements-hydration`
  - Tracking Issue: [Tracking issue: Custom Elements Hydration 🧩](https://github.com/WordPress/block-interactivity-experiments/issues/39)

  This hydration method is based on custom elements (`<wp-block>`) that hydrates isolated islands. It interconnects those islands through synchronized bridges for APIs like `context`, `Suspense` or `ErrorBoundary`.

- ⚛️ **Directives Hydration**

  - Main branch: `main-directives-hydration`
  - Tracking Issue: [Tracking issue: Directives Hydration ⚛](https://github.com/WordPress/block-interactivity-experiments/issues/64)

  This hydration method is based on the creation of a static virtual DOM from the root, where only the interactive islands are replaced by P/React components. It behaves like a single P/React application.

## Block Requirements

If you want to use these experiments on your blocks, they will need:

- To have a `block.json` file.
- To be registered on the server.
- A single node wrapper.

## Collaborate!

Feel free to clone this repository and inspect the code, open issues, submit PRs, suggest features or ask questions!

And if you are doing any other frontend-related work, please leave a comment in this [Make Core post](https://make.wordpress.org/core/2022/04/27/exploration-to-enable-better-developer-and-visitor-experiences-with-blocks/).
