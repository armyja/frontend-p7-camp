const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		app: '@/index.ts',
	},
	resolve: {
		alias: {
			"@": path.resolve("src")
		},
		extensions: ['.ts', '.tsx', '.js', '.json']
	},
	output: {
		globalObject: 'self',
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			title: 'App Sample',
			template: path.resolve(__dirname, 'public/index.html'),
			inject: false
		}),
		new webpack.BannerPlugin(`Copyright © 1996 - ${new Date().getFullYear()} Armyja. All Rights Reserved`)
	],
	devServer:{
		// 打包后输入的目录
		contentBase:path.resolve(__dirname,'dist'),
		// 启动gizp压缩
		compress:true,
		port:3001
	},
};
