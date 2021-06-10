const { isProduction } = require('../utils/common')

module.exports = {
    output: {
        filename: '[name].built.js',
        chunkFilename: '[name].[contenthash:10].chunk.js'
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? 'source-map' : 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.node$/,
                use: 'node-loader',
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }
            },

        ],
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 10 * 1024 // 10k以上的包进行拆包
        },
    },
    watchOptions: {
        ignored: '**/node_modules',
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    },
}