const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 创建webpack编译器
const compiler = webpack({
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

// webpack开发中间件：其实这个中间件函数执行完成时，中间件内部就会执行webpack的watch函数，启动webpack的监听模式，相当于执行cli的： webpack --watch命令
const webpackDevMiddlewareInstance = webpackDevMiddleware(compiler, {
    reportTime: true,           // webpack状态日志输出带上时间前缀
    stats: {
        colors: true,           // webpack编译输出日志带上颜色，相当于命令行 webpack --colors
        process: true
    },
    // noInfo: true,            // 不输出任何webpack编译日志(只有警告和错误)
    // quiet: true,             // 不向控制台显示任何内容
    // reporter: function (context) {   // 提供自定义报告器以更改webpack日志的输出方式。
    //     console.log(context.stats.toString(context.options.stats))
    // },
});

/**
 * webpack第一次编译完成并且输出编译日志后调用
 * 之后监听到文件变化重新编译不会再执行此函数
 */
webpackDevMiddlewareInstance.waitUntilValid(stats => {
    console.log('webpack第一次编译成功回调函数');
});

// 创建express对象
const app = express();
app.use(webpackDevMiddlewareInstance);
app.listen(3000, () => console.log('启动express服务...'));

// for (let i = 0; i < 10000022220; i++) {}    // 会阻塞webpack的编译操作
