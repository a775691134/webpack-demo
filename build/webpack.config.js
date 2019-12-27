const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 将编译后的文件名插入到html文件中
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin'); // 编译之前删除之前编译的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 将css合并并以外链方式引入html文件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') // 拆分成多个css并引入
let indexLess = new ExtractTextWebpackPlugin('index.less');
let indexCss = new ExtractTextWebpackPlugin('index.css');
const Webpack = require('webpack')

module.exports = {
    mode: 'development', // 开发模式
    entry: {
        main: path.resolve(__dirname, '../src/main.js'),
        header: path.resolve(__dirname, '../src/header.js')
    },
    output: {
        filename: '[name].[hash:8].js', // 打包后的文件名称
        path: path.resolve(__dirname, '../dist') // 打包后的目录
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            chunks: ['main'] // 与入口文件对应的模块名
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/header.html'),
            filename: 'header.html',
            chunks: ['header'] // 与入口文件对应的模块名
        }),
        new CleanWebpackPlugin(),
        require('autoprefixer'), // postcss 添加css前缀
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].css",
        }),
        indexLess,
        indexCss,
        new Webpack.HotModuleReplacementPlugin() // 热更新
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: indexCss.extract({
                    use: ['css-loader']
                })
            },
            {
                test: /\.less$/,
                use: indexLess.extract({
                    use: ['css-loader', 'less-loader']
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/i, //图片文件
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'img/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'media/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10240,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: 'fonts/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/
            },
        ]
    },
    devServer: {
        port: 3000,
        hot: true,
        contentBase: '../dist'
    },
}