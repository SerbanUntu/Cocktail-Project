const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		main: './src/index.ts',
		cocktails: './src/scripts/cocktails.ts',
		config: './src/scripts/config.ts',
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
			favicon: './assets/images/cocktail.png',
			chunks: ['main'],
		}),
		new HtmlWebpackPlugin({
			filename: 'cocktails.html',
			template: './src/cocktails.html',
			favicon: './assets/images/cocktail.png',
			chunks: ['cocktails'],
		}),
		new HtmlWebpackPlugin({
			filename: 'config.html',
			template: './src/config.html',
			favicon: './assets/images/cocktail.png',
			chunks: ['config'],
		}),
	],
}
