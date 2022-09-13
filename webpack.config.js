const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = [
	defaultConfig,
	{
		...defaultConfig,
		entry: {
			'gutenberg-packages/hydration':
				'./src/gutenberg-packages/hydration.js',
			'blocks/interactive-child/register-view':
				'./src/blocks/interactive-child/register-view.js',
			'blocks/interactive-parent/register-view':
				'./src/blocks/interactive-parent/register-view.js',
		},
		optimization: {
			runtimeChunk: {
				name: 'vendors',
			},
			splitChunks: {
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						chunks: 'all',
					},
				},
			},
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
