# Block Hydration Experiments

This repository aims to explore block hydration patterns with the goal of absorbing as much complexity as possible from the final developers.

_It's not a goal to do an in-depth analysis of the patterns, only to experiment with them in a controlled environment to assess their potential and then test them in [the Gutenberg repository](https://github.com/WordPress/gutenberg), where we will see if they are a good fit or not._

## Project structure

Ideally, the Save component should be derived from the View implementation, and developers should be able to share as much code as possible between the Edit and Save/View components.

Blocks are structured using this folders/files:

-   `edit`: User code exclusive to the `Edit` component.
-   `view`: User code exclusive to the `View` component. It's also used as the `Save` component.
-   `shared`: User code shared between `Edit` and `View` components.
-   `gutenberg-packages`: Framework code that should be absorbed by Gutenberg packages.
-   `webpack`: Bundling configuration that should be absorbed by `@wordpress/scripts` (doesn't exist yet).

## Tracking issue and current status

[You can follow the ongoing tasks an video updates of the current status on the Tracking issue.](https://github.com/WordPress/block-hydration-experiments/issues/39)

## Collaborate!

Feel free to clone this repository and inspect the code, open issues, submit PRs, suggest features or ask questions!

And if you are doing any other frontend related work, please leave a comment in this [Make Core post](https://make.wordpress.org/core/2022/04/27/exploration-to-enable-better-developer-and-visitor-experiences-with-blocks/).
