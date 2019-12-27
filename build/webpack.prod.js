const path = require('path')
const webpackConfig = require('./webpack.config.js')
const WebpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const HappyPack = require('happypack'); // 多核编译
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin'); // 压缩优化
module.exports = WebpackMerge(webpackConfig, {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    rules: [{
            test: /\.js$/,
            use: [
                {
                    loader: 'happypack/loader?id=happyBabel'
                }
            ],
            exclude: /node_modules/
        },
        // cache loader example
        // {
        //     test: /\.ext$/,
        //     use: [
        //         'cache-loader',
        //         ...loaders
        //     ],
        //     include: path.resolve(__dirname, 'src')
        // }
    ],
    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../public'),
            to: path.resolve(__dirname, '../dist')
        }]),
        new HappyPack({
            id: 'happyBabel',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env']
                    ],
                    cacheDirectory: true
                }
            }],
            threadsPool: happyThreadPool // 共享进程池
        })
    ],
    optimization: {
        minimizer: [
            new ParallelUglifyPlugin({ // 压缩js文件
                cacheDir: '.cache/',
                uglifyJS: {
                    output: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }),
            new OptimizeCssAssetsPlugin({}) // 压缩css文件
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: "chunk-libs",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                }
            }
        }
    }
})