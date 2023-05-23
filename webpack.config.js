const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
	defaultConfig,
	{
		...defaultConfig,
		entry: {
			runtime: './src/runtime',
			'e2e/page-1': './e2e/page-1',
			'e2e/page-2': './e2e/page-2',
			'e2e/directive-priorities': './e2e/js/directive-priorities',
			'e2e/directive-bind': './e2e/js/directive-bind',
			'e2e/directive-effect': './e2e/js/directive-effect',
			'e2e/negation-operator': './e2e/js/negation-operator',
		},
		output: {
			filename: '[name].js',
			path: resolve(process.cwd(), 'build'),
			library: {
				name: '__experimentalInteractivity',
				type: 'window',
			},
		},
		optimization: {
			runtimeChunk: {
				name: 'vendors',
			},
			splitChunks: {
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendors',
						minSize: 0,
						chunks: 'all',
					},
				},
			},
		},
		module: {
			rules: [
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
				{
					test: /\.css$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader'],
				},
			],
		},
		plugins: [new MiniCssExtractPlugin()],
	},
];
