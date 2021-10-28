const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");

const { resolve } = require("../utils/common");
const rendererCfg = require("../utils/rendererCfg");
const base = require("./webpack.base");

module.exports = merge(base, {
  entry: rendererCfg.entry,
  output: {
    filename: "[name]/index.[contenthash:10].js",
    path: resolve(".webpack/renderer"),
  },
  plugins: [...rendererCfg.plugins, new ESLintPlugin()],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/images/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/font/[hash][ext][query]",
        },
      },
    ],
  },
  resolve: {
    // 配置省略文件路径的后缀名
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@/":resolve("./src/"),
      "@renderer/": resolve("./src/renderer/"),
      "@preload/": resolve("./src/preload/"),
      "@renderer/": resolve("./src/renderer/")
    },
  },
});
