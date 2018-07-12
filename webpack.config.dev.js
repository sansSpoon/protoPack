const path = require('path');
const webpack = require('webpack');

// Set dev because webpack has too many cooks
process.env.NODE_ENV = 'development';

// Set a global public path, used for sub-domains
const publicPath = '';

module.exports = {
	devtool: 'inline-source-map',
	target: 'web', // 'node' | 'web'
	mode: 'development',
	entry: './_src/index.js',
	output: {
		filename: 'assets/js/[name].js',
		pathinfo: true,
		path: path.resolve(__dirname, '_build'),
		publicPath: publicPath,
	},
	devServer: {
		contentBase: path.join(__dirname, '_build/_static'),
		// hot: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: 'pre',
				use: [
					{
						loader: 'eslint-loader',
						options: {
							fix: false,
							cache: false, // true './node_modules/.cache'
							quiet: false, // Loader will process and report errors only and ignore warnings if this option is set to true
							emitWarning: false, // Enable for HMR in dev
							failOnWarning: false,
							emitError: true,
							failOnError: false,
						},
					}
				]
			},
		],
	},
}