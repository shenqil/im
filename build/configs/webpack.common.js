const HtmlWebpackPlugin = require('html-webpack-plugin');

const { resolve } = require('../utils/common')

module.exports = {
    entry: resolve('src/renderer/main_window/index.ts'),
    output: {
        filename: '[name].[contenthash:10].js',
        path: resolve('.webpack/renderer/main_window'),
    },
    plugins: [
        new HtmlWebpackPlugin({ template: resolve('./index.html') }),
    ],
    module: {
        rules: [
            ...require('./webpack.rules'),
            {
                test: /\.html$/i,
                // 处理html文件的img图片(负责引入img,从而能被url-loader进行处理)
                loader: 'html-loader',
            }
        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    resolve: {
        // 配置省略文件路径的后缀名
        extensions: ['.tsx', '.ts', '.js'],
    },
};