const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 创建compiler webpack编译器
const compiler = webpack({      // webpack的配置
    entry: path.resolve(__dirname, 'src/main.js'),      // 入口
    output: {                                           // 输出
        path: path.resolve(__dirname, 'dist'),          // 路径
        filename: 'bundle.[hash].js'                    // 文件名
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
});

/**
 *  钩子函数
 *  监听模式下，一个新的编译(compilation)触发之后，在实际编译开始之前调用，这是同步的钩子函数，调用compiler.watch()函数后会马上执行这个钩子函数，执行完这个钩子函数后才会返回watching对象
 */
compiler.plugin('watch-run', (watching, next) => {
    console.log('watch-run', watching.startTime);
    next();     // 继续往下执行webpack，如果不调用它，webpack不会执行编译了。
});

/**
 * 启动webpack编译
 * @param err 编译错误
 * @param stats: webpack编译成功统计信息
 */
// compiler.run((err, stats) => {
//     console.log(stats.toString({
//         colors: true
//     }))
// });

/**
 * 监听模式启动webpack
 * @param watchOptions 监听配置
 * @param callback 编译成功回调
 */
const watching = compiler.watch({ aggregateTimeout: 200 },(err, stats) => {
    console.log(stats.toString({
        colors: true
    }))
});


for (let i = 0; i < 10000222209; i++) { }       // 阻塞一些主逻辑，验证webpack的编译操作是否是放在异步任务队列里进行的
console.log('main logic finish...')

