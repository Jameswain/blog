const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');     // webpack开发中间件
const HtmlWebpackPlugin = require('html-webpack-plugin');           // webpack插件：根据模版生成html，并且自动注入引用webpack编译出来的css和js文件

/**
 * 创建webpack编译器
 */
const comoiler = webpack({
    entry: path.resolve(__dirname, 'src/app.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.[hash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'webpack-dev-middleware'
        })
    ]
});

/**
 * 执行webpack-dev-middleware初始化函数，返回express中间件函数
 * 这个函数内部以监听模式启动了webpack编译，相当于执行cli的： webpack --watch命令
 * 也就是说执行到这一步，就已经启动了webpack的监听模式编译了。
 * 由于webpack-dev-middleware中间件内部使用memory-fs替换了compiler的outputFileSystem对象，将webpack打包编译的文件都输出到内存中
 * 所以磁盘上看不到任何webpack编译输出的文件
 */
const webpackDevMiddlewareInstance = webpackDevMiddleware(comoiler,{
    reportTime: true,           // webpack状态日志输出带上时间前缀
    stats: {
        colors: true,           // webpack编译输出日志带上颜色，相当于命令行 webpack --colors
        process: true
    }
});
