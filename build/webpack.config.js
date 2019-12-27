const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 将编译后的文件名插入到html文件中
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 编译之前删除之前编译的文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 拆分css
module.exports = {
    mode:'development', // 开发模式
    entry: {
        main:path.resolve(__dirname,'../src/main.js'),
        header:path.resolve(__dirname,'../src/header.js')
    }, 
    output: {
        filename: '[name].[hash:8].js',      // 打包后的文件名称
        path: path.resolve(__dirname,'../dist')  // 打包后的目录
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/index.html'),
            filename:'index.html',
            chunks:['main'] // 与入口文件对应的模块名
        }),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/header.html'),
            filename:'header.html',
            chunks:['header'] // 与入口文件对应的模块名
        }),
        new CleanWebpackPlugin(),
        require('autoprefixer'), // postcss 添加css前缀
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].css",
        })
    ],
    module:{
        rules:[
            {
                test:/\.less$/,
                use:[ // 从右向左解析原则
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ]
            }
        ]
    }
}