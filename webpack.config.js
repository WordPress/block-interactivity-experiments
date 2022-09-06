const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
	...defaultConfig,
	entry: {
		...defaultConfig.entry(),
		'gutenberg-packages/hydration': './src/gutenberg-packages/hydration.js',
	},
};
