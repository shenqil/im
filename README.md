# 开启一个electron项目

## 1. npm init  -y 创建一个前端工程
+ 修改 main 选项为 `main.js`
```
{
  "name": "electron_demo",
  "version": "1.0.0",
  "description": "electron_demo",
  "main": "main.js",
  "author": "lsq",
  "license": "ISC"
}
```

## 2.安装 `electron`包
```
npm install --save-dev electron
```
+ 修改启动脚本
```
  "scripts": {
    "start": "electron ."
  },
```

## 3.新建一个html，作为页面入口
```
// index.html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.
    <script src="./renderer.js"></script>
  </body>

</html>

```

## 4.新建一个main.js,作为整个应用入口
```
// main.js

const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
```

## 5.编写页面预加载脚本
```
// preload.js

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})
```

## 6.编写页面js
```
// renderer.js

console.log('hello')
```

## 7.运行 `npm run start` 启动整个应用

[源码](https://github.com/fssqLove/electron-exp)
