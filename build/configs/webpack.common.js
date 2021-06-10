const { merge } = require('webpack-merge');

const { resolve } = require('../utils/common')
const rendererCfg = require('../utils/rendererCfg')
const base = require('./webpack.base')

const CopyPlugin = require("copy-webpack-plugin");

module.exports = merge(base, {
    // target: `electron${packageInfo.electronVersion}-renderer`, 
    entry: rendererCfg.entry,
    output: {
        filename: '[name]/index.[contenthash:10].js',
        path: resolve('.webpack/renderer'),
    },
    plugins: [
        ...rendererCfg.plugins,
        new CopyPlugin({
            patterns: [
                { from: resolve('./src/renderer/static'), to: resolve('.webpack/renderer/static') },
            ],
        }),
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
        alias: {
            "@renderer": resolve('./src/renderer')
        }
    },

});