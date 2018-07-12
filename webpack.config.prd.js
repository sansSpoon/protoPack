const path = require('path');
const webpack = require('webpack');

// Set dev because webpack has too many cooks
process.env.NODE_ENV = 'production';

// Set a global public path, used for sub-domains
const publicPath = '';

module.exports = {
	devtool: 'source-map',
	target: 'web', // 'node' | 'web'
	mode: 'production',
	entry: './_src/index.js',
	output: {
		filename: 'assets/js/[name].js',
		path: path.resolve(__dirname, 'public'),
		publicPath: publicPath,
	},
}