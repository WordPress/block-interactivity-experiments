const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { DefinePlugin } = require('webpack');
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const sharedConfig = {
	...defaultConfig,
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
};

module.exports = [
	defaultConfig,
	{
		...sharedConfig,
		entry: {
			runtime: './src/runtime',
		},
		output: {
			...sharedConfig.output,
			filename: '[name].min.js',
		},
		plugins: [
			...sharedConfig.plugins,
			new DefinePlugin({
				SCRIPT_DEBUG: false,
			}),
		],
	},
	{
		...sharedConfig,
		entry: {
			runtime: './src/runtime',
		},
		plugins: [
			...sharedConfig.plugins,
			new DefinePlugin({
				SCRIPT_DEBUG: true,
			}),
		],
	},
	{
		...sharedConfig,
		entry: {
			'e2e/page-1': './e2e/page-1',
			'e2e/page-2': './e2e/page-2',
			'e2e/html/directive-bind': './e2e/html/directive-bind',
		},
	},
];
