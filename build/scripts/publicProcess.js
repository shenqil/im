const fs = require("fs");
const path = require("path");

const { deleteFolder, resolve, packageInfo } = require("../utils/common");

// 1.清空缓存文件
deleteFolder(resolve("./.webpack"));
// 2.创建生产环境打包文件
createPackage(packageInfo.tatget);

/**
 * 创建生产版本package.json
 * */
function createPackage(packageInfoStr) {
  const dirName = resolve("./.webpack");

  try {
    const stat = fs.statSync(dirName);
    if (!stat.isDirectory(dirName)) {
      throw new Error(`${dirName} 不是文件夹`);
    }
  } catch {
    fs.mkdirSync(dirName);
  }

  const packageInfo = JSON.parse(packageInfoStr);

  packageInfo.main = "main.built.js";
  packageInfo.scripts = {};
  packageInfo.devDependencies = {};
  packageInfo.dependencies = {};

  fs.writeFileSync(
    path.join(dirName, "package.json"),
    JSON.stringify(packageInfo),
    {
      encoding: "utf-8",
    }
  );
}
