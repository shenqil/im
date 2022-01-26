const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { resolve } = require("../utils/common");

const common = require("./webpack.common.js");

module.exports = merge(common, {
  module: {
    rules: [
      {
        oneOf:[
          {
            test: /\.((c|sa|sc)ss)$/i,
            exclude: [
              /node_modules/,
            ],
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../../",
                },
              },
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
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../../",
                },
              },
              // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
              {
                loader: "css-loader",
                options:{
                  modules:{
                    localIdentName: "[hash:base64]",
                  }
                }
              },
              "sass-loader",
            ],
          },
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:10].css",
      chunkFilename: "[id].css",
    }),
  ],
});
