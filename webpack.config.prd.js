const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// Set NODE_ENV because webpack has too many cooks
process.env.NODE_ENV = 'production';

// Set a global public path, used for setting site root
const publicPath = '/';

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
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				sourceMap: true,
				extractComments: true,
				uglifyOptions: {
					ecma: 8,
					warnings: false,
					safari10: true,
					parse: {},
					compress: {},
					mangle: {
						safari10: true,
					},
					output: {
						comments: false,
						beautify: false,
					},
					sourceMap: {},
				},
			})
		],
		splitChunks: {
			chunks: 'all',
		}
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
							compact: true,
						}
					},
					{
						test: /\.scss$/,
						use: [
							{
								loader: MiniCssExtractPlugin.loader,
							},
							{
								loader: 'css-loader',
								options: {
									// sourceMap: true,
									importLoaders: 1,
								},
							},
							{
								loader: 'postcss-loader',
								options: {
									ident: 'postcss',
									plugins: () => [
										require('autoprefixer')(),
										require('cssnano')(),
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
		new CleanWebpackPlugin(['public']),
		new MiniCssExtractPlugin({
			filename: "assets/css/[name].css",
			chunkFilename: "[id].css",
		}),
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, '_build/_static/index.html'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true,
			},
		}),
	],
}