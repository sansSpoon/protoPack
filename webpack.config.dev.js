const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

// Set NODE_ENV because webpack has too many cooks
process.env.NODE_ENV = 'development';

// Set a global public path, used for setting site root
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
							quiet: false, // report errors only, ignore warnings
							emitWarning: false, // Enable for HMR in dev
							failOnWarning: false,
							emitError: true,
							failOnError: false,
						},
					}
				]
			},
			{
				// Using oneOf array (as per create-react-app) to handle
				// fallback to file-loader for static assets
				oneOf: [
					{
						test: /\.js$/,
						loader: 'babel-loader',
						exclude: /node_modules/,
						options: {
							babelrc: true,
							cacheDirectory: true,
						}
					},
					{
						test: /\.scss$/,
						use: [
							{
								loader: 'style-loader',
							},
							{
								loader: 'css-loader',
								options: {
									// sourceMap: true,
									importLoaders: 2,
								},
							},
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss',
									plugins: () => [
										// require('autoprefixer')(),
										// require('cssnano')(),
									],
								},
							},
							{
								loader: 'sass-loader',
								options: {
									// sourceMap: true,
								},
							}
						],
					},
					{
						test: /\.(png|svg|jpg|gif)$/,
						use: [
							{
								loader: 'url-loader',
								options: {
									name: 'assets/chrome/[name].[ext]',
									limit: 1024, // 8192
									// fallback: 'responsive-loader',
								},
							},
						]
					},
					{
						// If none of the above match, this will copy files to media
						loader: require.resolve('file-loader'),
						exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
						options: {
							name: 'assets/media/[name].[ext]',
						}
					}
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, '_build/_static/index.html'),
		}),
		new StyleLintPlugin({
			configFile: './.stylelintrc.json',
			context: '_src',
			files: '**/*.scss', // '**/*.s?(a|c)ss'
			emitErrors: false,
			failOnError: false,
		}),
	],
}