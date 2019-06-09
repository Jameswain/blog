const webpack = require('webpack');

// 创建编译器对象
const compiler = webpack({
  mode: 'development',
  devtool: 'cheap-module-source-map',
  // devtool: 'source-map',
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
  // devtool: 'nosources-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'css-loader'
      }
    ]
  }
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
