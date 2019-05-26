### 核心概念
​		webpack是一个前端资源模块打包工具，它可以根据模块的依赖关系进行打包输出成浏览器能够识别的静态资源，可以把多个文件打包成一个，减少http请求。

![001](https://raw.githubusercontent.com/Jameswain/blog/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo01-ZeroConfiguration/images/001.png)


### 零配置启动

​		从webpack4.0.0开始，webpack可以零配置启动，webpack命令被迁移到一个单独的npm包 —— webpack-cli上，webpack的cli功能变得更加丰富强大。

下面我通过一段代码来演示一下，零配置启动webpack：

**第1步：安装webpack**

```shell
npm i -D webpack
```

**第2步：编写入口文件和依赖代码**

```javascript
// webpack@4.32.2系列教程/demo01-ZeroConfiguration/src/role.js
export default class Role {
  constructor(name, skill) {
    this.name = name;
    this.skill = skill;
  }
}
```

```javascript
// webpack@4.32.2系列教程/demo01-ZeroConfiguration/src/index.js
import Role from './role'
const role = new Role('乔峰', '降龙十八掌');
console.log(role);
```

**第3步：使用Node API 启动webpack**

```javascript
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
```

**第4步：cd到demo01-ZeroConfiguration文件夹下，运行node scripts/build.js**

![002](https://raw.githubusercontent.com/Jameswain/blog/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo01-ZeroConfiguration/images/002.png)

![003](https://raw.githubusercontent.com/Jameswain/blog/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo01-ZeroConfiguration/images/003.png)

[源码地址](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo01-ZeroConfiguration)





