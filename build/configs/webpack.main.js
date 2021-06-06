const { resolve, packageInfo, isProduction } = require('../utils/common')

module.exports = {
    target: `electron${packageInfo.electronVersion}-main`,
    entry: resolve('src/main/main.ts'),
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    output: {
        filename: '[name].built.js',
        path: resolve('.webpack/main'),
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