const HtmlWebpackPlugin = require('html-webpack-plugin');

const { resolve, packageInfo } = require('../utils/common')

module.exports = {
    // target: `electron${packageInfo.electronVersion}-renderer`, 
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