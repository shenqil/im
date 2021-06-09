const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { resolve } = require('../utils/common')

let entryNames = [];
/**
 * 获取所有窗口名称
 * */
function getAllWindowName() {
    const dirPath = resolve('src/renderer')

    if (!fs.existsSync(dirPath)) {
        throw new Error('渲染窗口路径不存在')
    }

    entryNames = fs.readdirSync(dirPath)
}

/**
 * 获取窗口html模板
 * */
const defaultTemplate = resolve('./index.html')
function htmlTemplate(name) {
    let templatePath = resolve(`src/renderer/${name}/index.html`)
    if (fs.existsSync(templatePath)) {
        return { template: templatePath }
    }
    return { template: defaultTemplate }
}

getAllWindowName()

let entry = {}
let plugins = []
entryNames.forEach(name => {
    // 填充所有入口
    entry[name] = resolve(`src/renderer/${name}/index.ts`)

    // 填充所有渲染窗口
    if ('main_window' == name) {
        plugins.push(new HtmlWebpackPlugin({
            ...htmlTemplate(name),
            filename: `${name}.html`,
            chunks: [name],
        }))
    }

})

module.exports = {
    entry,
    plugins
}