const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");
const { resolve } = require("../utils/common");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: {
      directory: resolve(".webpack/renderer/main_window"),
    },
    // 启动gzip 压缩
    compress: true,
    // 端口号
    port: 8888,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        include: [
          /node_modules/,
          resolve("src/renderer/public"),
        ],
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ],
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        exclude: [
          /node_modules/,
          resolve("src/renderer/public"),
        ],
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options:{
              modules:{
                   localIdentName: "[name]__[local]--[hash:base64:5]",
              }
            }
          },
          "sass-loader"
        ],
      },
    ],
  },
  plugins: [],
});
