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
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options:{
              modules: true
            }
          },
          "sass-loader"
        ],
      },
    ],
  },
  plugins: [],
});
