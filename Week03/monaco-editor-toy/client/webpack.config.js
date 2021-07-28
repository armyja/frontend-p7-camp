const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		app: './src/index.tsx',
		'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
		'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
		'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
		'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
		'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
	},
	resolve: {
		alias: {
			"@": path.resolve("src")
		},
		extensions: ['.ts', '.tsx', '.js', '.json']
	},
	output: {
		globalObject: 'self',
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [["@babel/plugin-transform-react-jsx", { pragma: "createElement" }]]
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.ts?$/,
                use: "babel-loader",
                exclude: /node_modules/,
            },
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			title: 'Monaco Editor Sample',
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
		port:3000
	},
};
