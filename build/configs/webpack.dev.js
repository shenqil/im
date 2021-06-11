const { merge } = require('webpack-merge')

const common = require('./webpack.common.js')
const { resolve } = require('../utils/common')

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: resolve('.webpack/renderer/main_window'),
        // 启动gzip 压缩
        compress: true,
        // 端口号
        port: 8080,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
    ],
});