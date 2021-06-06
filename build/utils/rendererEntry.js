const fs = require('fs')

const { resolve } = require('../utils/common')

/**
 * 读取指定位置的文件路径
 * */
function readDirName(dirPath) {
    let dirNames = []
    if (fs.existsSync(dirPath)) {
        const dirs = fs.readdirSync(dirPath);
        console.log(dirs)
        // dirs.forEach((dir) => {
        //     let curPath = path.join(filePath, file);
        //     if (fs.statSync(curPath).isDirectory()) {
        //         deleteFolder(curPath);
        //     } else {
        //         fs.unlinkSync(curPath);
        //     }
        // });
    }

    return dirNames
}


readDirName('D:/work/electron/my-new-app/src/renderer')