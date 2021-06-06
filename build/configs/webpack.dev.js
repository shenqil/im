const { merge } = require('webpack-merge');
const { spawn } = require('child_process');

const common = require('./webpack.common.js');
const { resolve } = require('../utils/common')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: resolve('.webpack/renderer/main_window'),
        // 启动gzip 压缩
        compress: true,
        // 端口号
        port: 8080,
        hot: true,
        after: function () {
            console.log('Starting Main Process...---------------------------------------------');
        },
    },
    module: {
        rules: []
    },
});