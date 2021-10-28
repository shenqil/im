const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { resolve, isProduction } = require("../utils/common");

let entryNames = [];
/**
 * 获取所有窗口名称
 * */
function getAllWindowName() {
  const dirPath = resolve("src/renderer");

  if (!fs.statSync(dirPath).isDirectory()) {
    throw new Error("渲染窗口路径不存在");
  }

  entryNames = fs.readdirSync(dirPath);
}

/**
 * 填充meta标签
 * */
function getMeta() {
  const securityPolicy = {
    "Content-Security-Policy": {
      "http-equiv": "Content-Security-Policy",
      content: "default-src 'self'; script-src 'self'",
    },
    "X-Content-Security-Policy": {
      "http-equiv": "X-Content-Security-Policy",
      content: "default-src 'self'; script-src 'self'",
    },
  };

  let resultMetaObj = {};

  // 生产环境开启安全策略
  if (isProduction) {
    resultMetaObj = { ...securityPolicy };
  }

  return resultMetaObj;
}
const metaObj = getMeta();

/**
 * 获取窗口html模板
 * */
const defaultTemplate = resolve("./index.html");
function htmlTemplate(name) {
  let templatePath = resolve(`src/renderer/${name}/index.html`);
  try {
    if (fs.statSync(dirPath).isFile()) {
      return { template: templatePath };
    }
  } catch {}

  return { template: defaultTemplate };
}

getAllWindowName();

let entry = {};
let plugins = [];
entryNames.forEach((name) => {
  // 过滤掉不是窗口的文件夹
  if (!/_window$/.test(name)) {
    return;
  }

  const entryPath = resolve(`src/renderer/${name}/index.tsx`);
  try {
    if (!fs.statSync(entryPath).isFile()) {
      return;
    }
  } catch {
    return;
  }

  // 填充所有入口
  entry[name] = entryPath;

  // 填充所有渲染窗口
  plugins.push(
    new HtmlWebpackPlugin({
      ...htmlTemplate(name),
      filename: `${name}.html`,
      chunks: [name],
      meta: {
        ...metaObj,
      },
    })
  );
});

module.exports = {
  entry,
  plugins,
};
