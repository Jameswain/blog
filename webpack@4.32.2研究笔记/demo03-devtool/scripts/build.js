const webpack = require('webpack');

// 创建编译器对象
const compiler = webpack({
  mode: 'production',
  // devtool: 'cheap-module-source-map',   // 切勿同时使用 devtool 选项和 SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin 插件
  // devtool: 'source-map',
  devtool: 'nosources-source-map',      // 生成一个没有源码的source map映射，仅仅可以用来映射浏览器上的堆栈跟踪，而不会暴露源码。
  // devtool: 'eval',
  // devtool: 'cheap-eval-source-map',
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'eval-source-map',
  // devtool: 'cheap-source-map',
  // devtool: 'cheap-module-source-map',
  // devtool: 'inline-cheap-source-map',
  // devtool: 'inline-cheap-module-source-map',
  // devtool: 'inline-source-map',
  // devtool: 'hidden-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader'
      }
    ]
  },
  plugins: [
    // new webpack.SourceMapDevToolPlugin({      // 切勿同时使用 devtool 选项和 SourceMapDevToolPlugin/EvalSourceMapDevToolPlugin 插件
    //   filename: '[name].[hash].js.map',
    //   publicPath: 'http://127.0.0.1:9999/',
    //   fileContext: 'public',
    //   noSources: !true
    // })
  ]
});

// 启动webpack
compiler.run((err, stats) => {
  if (err) {
    console.error(err);
    return;
  }
  // 输出编译成功信息
  console.log(stats.toString({ colors: true }));
});
