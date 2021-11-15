const { merge } = require("webpack-merge");
const { resolve, packageInfo } = require("../utils/common");
const preloadCfg = require("../utils/preloadCfg");
const base = require("./webpack.base");
module.exports = merge(base, {
  target: `electron${packageInfo.electronVersion}-preload`,
  entry: preloadCfg.entry,
  devtool: "inline-source-map",
  output: {
    path: resolve(".webpack/preload"),
  },
  resolve: {
    // 配置省略文件路径的后缀名
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@/":resolve("./src/"),
      "@main/": resolve("./src/main/"),
      "@preload/": resolve("./src/preload/"),
      "@renderer/": resolve("./src/renderer/")
    },
  },
});
