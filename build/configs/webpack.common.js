const { merge } = require('webpack-merge');

const { resolve } = require('../utils/common')
const rendererCfg = require('../utils/rendererCfg')
const base = require('./webpack.base')

module.exports = merge(base, {
    // target: `electron${packageInfo.electronVersion}-renderer`, 
    entry: rendererCfg.entry,
    output: {
        filename: '[name]/index.[contenthash:10].js',
        path: resolve('.webpack/renderer'),
    },
    plugins: [
        ...rendererCfg.plugins
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            }
        ],
    },
    resolve: {
        // 配置省略文件路径的后缀名
        extensions: ['.tsx', '.ts', '.js'],
    },
});