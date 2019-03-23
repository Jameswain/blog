const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, 'src/main.js'),      // 入口
    output: {                                           // 输出
        path: path.resolve(__dirname, 'dist'),          // 路径
        filename: 'bundle.[hash].js'                    // 文件名
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}
