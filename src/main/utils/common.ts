import path from 'path'

/**
 * 拼接完整路径
 * */ 
export function joinDirname(fileName:string){
    return path.normalize(`${__dirname}/${fileName.replace(/.ts$/i,'.built.js')}`)
}