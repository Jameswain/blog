const webpack = require('webpack');

// 创建编译器对象
const compiler = webpack({
  // mode模式：webpack4.0.0新增配置，用来指定webpack使用相应模式的内置优化。
  // mode: 'development'   // 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。
  mode: 'production'    // 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.
  // mode: 'none'             // 使用默认优化项
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
