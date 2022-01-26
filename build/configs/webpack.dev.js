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
        oneOf:[
          {
            test: /\.((c|sa|sc)ss)$/i,
            use: [
              "style-loader",
              "css-loader",
              "sass-loader"
            ],
          },
          {
            test: /\.modules\.((c|sa|sc)ss)$/i,
            enforce: 'pre',
            exclude: [
              /node_modules/,
            ],
            use: [
              "style-loader",
              {
                loader: "css-loader",
                options:{
                  modules:{
                    localIdentName: "[path][name]__[local]--[hash:base64:5]",
                  }
                }
              },
              "sass-loader"
            ],
          },
        ]
      },
    ],
  },
  plugins: [],
});
