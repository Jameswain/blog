### 简介
​		 mode（模式）是webpack4.0.0新增的配置，用来指定webpack使用对应模式的内置优化；它有三个可选模式：production、development、none；默认为production。

| 选项        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| development | 将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。 |
| production  | 将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin. |
| none        | 将 process.env.NODE_ENV 的值设为 node。使用默认的优化项。    |

下面通过一段代码分别演示一个每一个模式打包输出的文件内容：

**第一步：编写入口文件和依赖代码**

```javascript
// webpack@4.32.2系列教程/demo02-mode/src/role.js
export default class Role {
  constructor(name, skill) {
    this.name = name;
    this.skill = skill;
  }
}
```

```javascript
// webpack@4.32.2系列教程/demo02-mode/src/index.js
import Role from './role'

const role = new Role('乔峰', '降龙十八掌');
console.log(role);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
```

**第二步：编写webpack配置 & 启动webpack**

```javascript
// webpack@4.32.2系列教程/demo02-mode/scripts/build.js
const webpack = require('webpack');

// 创建编译器对象
const compiler = webpack({
  // mode模式：webpack4.0.0新增配置，用来指定webpack使用相应模式的内置优化。
  // mode: 'development'   // 会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。
  // mode: 'production'    // 会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin.
  mode: 'none'             // 使用默认优化项
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
```

**第三步：cd到demo02-mode文件夹下，运行node scripts/build.js**

![01](https://raw.githubusercontent.com/Jameswain/blog/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo02-mode/docs/01.png)

**mode: none 打包输出的main.js文件内容**

![02](https://raw.githubusercontent.com/Jameswain/blog/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo02-mode/docs/02.png)

**mode:development  打包输出的main.js文件内容**

![03](https://raw.githubusercontent.com/Jameswain/blog/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo02-mode/docs/03.png)

**mode:production  打包输出的main.js文件内容**

![04](https://raw.githubusercontent.com/Jameswain/blog/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo02-mode/docs/04.png)

**小结：** 可以看到每一种模式，打包后输出的代码都不一样，我们平时开发使用development模式，当代码需要发布上线时使用production模式。

**注意：** 上面说的process.env.NODE_ENV并不是Node.js的process.env.NODE_ENV运行环境变量，它是webpack内部维护的一个全局变量。

