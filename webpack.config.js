const { resolve } = require('path');

module.exports = [
	{
		entry: {
			runtime: './src/runtime',
		},
		output: {
			filename: '[name].js',
			path: resolve(process.cwd(), 'build'),
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
			],
		},
	},
	{
		entry: {
			hydrationScriptForTesting: './benchmark/hydrationScript.js',
		},
		output: {
			filename: '[name].js',
			path: resolve(process.cwd(), 'build'),
		},
		devtool: 'inline-source-map',
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
										'@babel/preset-env',
										{
											targets: {
												esmodules: true,
											},
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
