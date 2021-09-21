const { merge } = require("webpack-merge");

const { resolve, packageInfo } = require("../utils/common");
const base = require("./webpack.base");

module.exports = merge(base, {
  target: `electron${packageInfo.electronVersion}-main`,
  entry: resolve("src/main.ts"),
  output: {
    path: resolve(".webpack"),
  },
});
