const fs = require("fs");

const { resolve } = require("../utils/common");

let entryNames = [];
/**
 * 获取所有预加载文件名车
 * */
function getPreloadName() {
  const dirPath = resolve("src/preload");

  if (!fs.statSync(dirPath).isDirectory()) {
    throw new Error("预加载文件路径不存在");
  }

  entryNames = fs.readdirSync(dirPath);
}
getPreloadName();

let entry = {};
entryNames.forEach((name) => {
  const entryPath = resolve(`src/preload/${name}`);
  try {
    if (!fs.statSync(entryPath).isFile()) {
      return;
    }
  } catch {
    return;
  }

  // 填充入口
  entry[name.replace(/.ts$/i, "")] = entryPath;
});

module.exports = {
  entry,
};
