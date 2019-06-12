const webpack = require('webpack');
// webpack4.0.0 开始支持零配置启动webpack
const compiler = webpack({});
// 使用Node Api 启动webpack编译，webpack4.0.0开始，已经把webpack命令迁移出去了，成为一个单独的npm模块包，叫做webpack-cli，这个包的功能更多更强大。
// 如果想使用webpack命令，就必须要安装webpack-cli这个包
// 如果你不需要使用webpack cli命令功能，那么你只需安装webpack这个包就够了，如果只安装webpack这个包，那么只能通过node api来启动webpack
// vue和react的脚手架的就是用node api来操作webpack的

// 启动webpack
compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  // 输出编译成功信息
  console.log(stats.toString({ colors: true }));
})
