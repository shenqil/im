const webpack = require('webpack');
const { spawnSync } = require('child_process');

const { getProgramArgv } = require('../utils/common')

const webpackMainCfg = require('../configs/webpack.main')
const webpackPreloadCfg = require('../configs/webpack.preload')
const webpackRenderCfg = require('../configs/webpack.prod')

// 获取命令行参数
const electronProgramArgv = getProgramArgv()

require('./publicProcess')

// webpack 进行打包
webpack([
    webpackMainCfg,
    webpackPreloadCfg,
    webpackRenderCfg
], (err, stats) => {
    if (stats.hasErrors()) {
        console.error(stats.toString())
        return
    }

    electronBuild()
})

/**
 * 开始electron打包
 * */
function electronBuild() {
    spawnSync('npx electron-builder', [...electronProgramArgv], {
        shell: true,
        env: process.env,
        stdio: 'inherit',
    })
}
