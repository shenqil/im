const path = require('path')
const { spawnSync } = require('child_process');

/**
 * 根据项目相对路劲转换为绝对路径
 * */
function resolve(p) {
    return path.resolve(__dirname, '../../', p)
}

/**
 * 提取package 里面的信息
 * */
function parsePackage() {
    const packageInfo = require(resolve("package.json"))

    // 解析使用的electron版本
    let electronVersion = packageInfo?.devDependencies?.electron ?? ""
    if (electronVersion) {
        electronVersion = electronVersion.slice(1).split('.').slice(0, 2).join('.')
    }
    packageInfo.electronVersion = electronVersion

    return packageInfo
}
const packageInfo = parsePackage()

/**
 * 判断是否为生产环境
 * */
function isProduction() {
    return process.env.NODE_ENV === 'production'
}

/**
 * 杀掉进程
 * */
function taskKill(pid) {
    // windows 结束进程
    spawnSync('TASKKILL /PID', [pid, '-t  -f'], {
        shell: true,
    })
}

module.exports = {
    resolve,
    packageInfo,
    isProduction,
    taskKill
}