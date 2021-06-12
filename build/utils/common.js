const path = require('path')
const fs = require('fs')
const { spawnSync } = require('child_process');

/**
 * 根据项目相对路劲转换为绝对路径
 * */
function resolve(p) {
    return path.resolve(__dirname, '../../', p)
}

/**
 * 创建生产版本package.json
 * */
function createPackage(packageInfoStr) {
    const dirName = resolve('./.webpack')

    try {
        const stat = fs.statSync(dirName)
        if (!stat.isDirectory(dirName)) {
            throw new Error(`${dirName} 不是文件夹`)
        }
    } catch {
        fs.mkdirSync(dirName)
    }

    const packageInfo = JSON.parse(packageInfoStr)

    packageInfo.main = 'main.built.js'
    packageInfo.scripts = {}
    packageInfo.devDependencies = {}
    packageInfo.dependencies = {}

    fs.writeFileSync(path.join(dirName, 'package.json'), JSON.stringify(packageInfo), {
        encoding: 'utf-8'
    })
}

/**
 * 提取package 里面的信息
 * */
function parsePackage() {
    const packageInfo = require(resolve("package.json"))
    createPackage(JSON.stringify(packageInfo))

    // 解析使用的electron版本
    let electronVersion = packageInfo?.devDependencies?.electron ?? ""
    if (electronVersion) {
        electronVersion = electronVersion.slice(1).split('.').slice(0, 2).join('.')
    }

    packageInfo.electronVersion = electronVersion
    return packageInfo
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

/**
 * 删除指定路径的所有文件
 * @param path
 */
function deleteFolder(filePath) {
    let files = [];
    if (fs.existsSync(filePath)) {
        files = fs.readdirSync(filePath);
        files.forEach((file) => {
            let curPath = path.join(filePath, file);
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(filePath);
    }
}

/**
 * 解析所有参数
 * */
function getProgramArgv() {
    return process.argv.slice(2)
}


// 清空主进程缓存文件
deleteFolder(resolve('./.webpack'))
/**
 * 得到package里面的信息
 * */
const packageInfo = parsePackage()
/**
 * 判断是否为生产环境
 * */
const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    resolve,
    packageInfo,
    isProduction,
    taskKill,
    deleteFolder,
    getProgramArgv
}