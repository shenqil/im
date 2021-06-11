const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

const common = require('./webpack.common.js');

module.exports = merge(common, {
    module: {
        rules: [
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../../',
                        },
                    },
                    // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
                    "css-loader",
                    'sass-loader'
                ],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:10].css',
            chunkFilename: '[id].css',
        }),
    ],
});