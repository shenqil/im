const webpack = require('webpack');
const path = require('path')
const { spawnSync } = require('child_process');

const { deleteFolder, resolve, getProgramArgv } = require('../utils/common')

const webpackMainCfg = require('../configs/webpack.main')
const webpackRenderCfg = require('../configs/webpack.prod')

// 清空所有缓存文件
deleteFolder(resolve('./.webpack'))

// 获取命令行参数
const electronProgramArgv = getProgramArgv()

// webpack 进行打包
webpack([
    webpackMainCfg,
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
