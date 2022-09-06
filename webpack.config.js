const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = [
	defaultConfig,
	{
		...defaultConfig,
		resolve: {
			alias: {
				'@wordpress/element': 'preact/compat',
				react: 'preact/compat',
				'react-dom/test-utils': 'preact/test-utils',
				'react-dom': 'preact/compat', // Must be below test-utils
				'react/jsx-runtime': 'preact/jsx-runtime',
			},
		},
		entry: {
			'gutenberg-packages/hydration':
				'./src/gutenberg-packages/hydration.js',
			'blocks/interactive-child/register-view':
				'./src/blocks/interactive-child/register-view.js',
			'blocks/interactive-parent/register-view':
				'./src/blocks/interactive-parent/register-view.js',
		},
		module: {
			rules: [
				...defaultConfig.module.rules,
				{
					test: /\.(j|t)sx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: require.resolve('babel-loader'),
							options: {
								cacheDirectory:
									process.env.BABEL_CACHE_DIRECTORY || true,
								babelrc: false,
								configFile: false,
								presets: [
									[
										'@babel/preset-react',
										{
											runtime: 'automatic',
											importSource: 'preact',
										},
									],
								],
							},
						},
					],
				},
			],
		},
	},
];
