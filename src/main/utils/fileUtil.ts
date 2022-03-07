import fs from 'fs';
import path from 'path';

/**
 * 获取文件路径信息
 * */
export function getStat(p:string):Promise<fs.Stats> {
  return new Promise((resolve, reject) => {
    fs.stat(p, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
}

/**
 * 创建路径
 * */
export function mkdir(dir:string) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(dir);
      }
    });
  });
}

/**
 * 路径是否存在，不存在则创建
 * */
export async function dirExists(dir:string):Promise<unknown> {
  try {
    const stats = await getStat(dir);
    if (stats.isDirectory()) {
      return;
    }
    throw new Error(`${dir}路径存在,但是是文件`);
  } catch (err) {
    if ((err as Error)?.message.indexOf('路径存在,但是是文件') !== -1) {
      throw err;
    }

    const preDir = path.parse(dir).dir;
    await dirExists(preDir);
    await mkdir(dir);
  }
}

export default {};
