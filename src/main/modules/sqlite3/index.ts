import { init } from './base';
import ISQ3 from './interface';

const files = (require as any).context('.', false, /\.ts$/);
const modules: any = {};
files.keys().forEach((key: string) => {
  if (!/(index|interface|base|enum)\.ts$/.test(key)) {
    modules[key.replace(/(.\/|.ts)/g, '')] = files(key).default;
  }
});

/**
 * 初始化数据库，创建好对应的表
 * */
export async function sqlite3Init() {
  // 创建数据库
  await init();

  // 创建所有表
  const list = [];
  for (const key in modules) {
    if (Object.prototype.hasOwnProperty.call(modules, key)) {
      list.push(modules[key].createTable());
    }
  }

  // 等待所有表完成创建
  await Promise.all(list);
}

export default modules as ISQ3;
