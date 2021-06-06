const { resolve, packageInfo, isProduction } = require('../utils/common')

module.exports = {
    target: `electron${packageInfo.electronVersion}-preload`,
    entry: {
        preload: resolve('src/preload/preload.ts')
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    output: {
        filename: '[name].built.js',
        path: resolve('.webpack/preload'),
    },
    module: {
        rules: require('./webpack.rules'),
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json']
    },
    watchOptions: {
        ignored: '**/node_modules',
    },
};