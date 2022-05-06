const defaultConfig = require("@wordpress/scripts/config/webpack.config");

module.exports = {
  ...defaultConfig,
  plugins: [
    ...defaultConfig.plugins,
    require("unplugin-auto-import/webpack")({
      /* options */
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      ],
      // global imports to register
      imports: [
        // WordPress dependencies
        {
          "@wordpress/block-editor": [
            // named imports
            "InnerBlocks",
            "useBlockProps", // import { useBlockProps } from '@wordpress/block-editor',
          ],
          "@wordpress/blocks": [
            ["registerBlockType", "gutenbergRegisterBlockType"], // import { registerBlockType as gutenbergRegisterBlockType } from '@wordpress/blocks',
          ],
          "@wordpress/element": [
            "createContext", // import { createContext } from '@wordpress/element',
            ["useContext", "useReactContext"],
            ["useEffect", "useReactEffect"],
            ["useState", "useReactState"],
          ],
        },
      ],
    }),
  ],
};
