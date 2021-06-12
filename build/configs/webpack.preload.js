const { merge } = require('webpack-merge');
const { resolve, packageInfo } = require('../utils/common')
const preloadCfg = require('../utils/preloadCfg')
const base = require('./webpack.base')
module.exports = merge(base, {
    target: `electron${packageInfo.electronVersion}-preload`,
    entry: preloadCfg.entry,
    output: {
        path: resolve('.webpack/preload'),
    },
});