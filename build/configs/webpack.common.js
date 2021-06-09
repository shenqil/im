const HtmlWebpackPlugin = require('html-webpack-plugin');

const { resolve, packageInfo } = require('../utils/common')
const rendererCfg = require('../utils/rendererCfg')

module.exports = {
    // target: `electron${packageInfo.electronVersion}-renderer`, 
    entry: rendererCfg.entry,
    output: {
        filename: '[name]/index.[contenthash:10].js',
        path: resolve('.webpack/renderer'),
    },
    plugins: [
        new HtmlWebpackPlugin({ template: resolve('./index.html'), filename: '[name].html' }),
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