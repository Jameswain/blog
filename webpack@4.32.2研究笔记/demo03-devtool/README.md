### 简介

​	devtool选项用于控制是否需要生成source map，以及如何生成source map。[源码地址](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%B3%BB%E5%88%97%E6%95%99%E7%A8%8B/demo03-devtool)

#### 什么是source map？

​	source map 一个存储源代码与编译代码对应位置的映射信息文件，它是专门给调试器准备的，它主要用于debug，目前我所知的只有Google Dev Tools 和 Fire Fox Debugger 支持source map。

​	Google Dev Tools 可以通过以下方式打开JavaScript的source map 和 CSS的source map：

![01](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/01.jpg)

![02](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/02.jpg)

​	source map主要用于将压缩混淆后的JavaScript代码和CSS代码映射到源码中，方便debug调试。更多关于source map的知识，大家可以参考阮一峰大神的文章：[JavaScript Source Map 详解](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

### 演示

​	最新的webpack官网中一共有13种devtool可选模式，不同的模式打包输出的代码和source map以及构建的速度都不一样，下面我演示几种比较常用的devtool模式。

#### eval

​	表示把每一个模块文件都转换为字符串，并且在每一个模块代码的尾部添加 //# sourceURL=webpack:/// 文件名.js，并使用eval执行。

**1、编写入口文件和依赖代码**

![003](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/03.jpg)

**2、编写webpack配置 & 启动webpack**

```javascript
const webpack = require('webpack');

// 创建编译器对象
const compiler = webpack({
  mode: 'development',
  devtool: 'eval'
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

**webpack运行结果**：

![04](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/04.jpg)

**打包输出的main.js文件**

![05](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/05.jpg)

​	从打包出来的main.js文件中我们可以发现index.js文件和role.js文件的所有代码都被转换成了字符串，使用eval进行执行，代码的最后面都加上了//# sourceURL 指向原始文件的位置，这种模式并不会输出map文件。

**浏览器运行结果：**

![06](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/06.jpg)

![07](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/07.jpg)

​	从浏览器的运行结果中，左侧多了一个webpack://，其实这个就是//# sourceURL设置值，如果我们在代码中修改了这个名字，那么浏览器就会显示的是另外一个名字，如果删除它，那么它的源码映射就会消失。而且它映射到的每一个源文件的头部都会加上一段webpack的代码，这对于我们来说并不友好，这种模式我使用的频率相当少。

#### cheap-module-source-map

​	没有列映射的source map，同时loader的source map也会被简化为每行一个映射，这个配置比较适合在开发环境使用，react脚手架开发模式下也是使用这个配置。

**1、安装css-loader**

```javascript
npm i -D css-loader
```

**2、修改webpack配置**

![13](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/13.jpg)

**3、创建main.css文件**

```css
body {
    background-color: greenyellow;
    color: red;
}
```

**4、src/index.js导入main.css**

![14](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/14.jpg)

**5、运行webpack**

![15](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/15.jpg)

![16](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/16.jpg)



#### source-map

​	source-map 适合在生产环境中使用，它会生成一个源代码对应的.map文件，这个文件描述的打包后的代码和源代码的映射关系。代码上线时不能把这个文件上传到线上服务器，可以把它上传到一个只可以内网访问服务器上，这样只要你是在公司内网环境内就可以很方便的进行线上问题定位。

**1、将devtool修改source-map**

```javascript
const webpack = require('webpack');

// 创建编译器对象
const compiler = webpack({
  mode: 'development',
  devtool: 'source-map'
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

运行webpack后，可以看到dist文件夹下会多出一个main.js.map文件，这个就是source map源码映射文件

![08](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/08.jpg)

**2、将main.js.map文件上传到内网服务器**

![09](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/09.jpg)

**3、修改sourceMappingURL映射文件的路径**

![10](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/10.jpg)

**4、在浏览器中运行webpack打包出来的main.js文件**

![11](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/11.jpg)

已经成功的跟源码建立了映射，如果此时我把内网的服务器关掉，看看会发生什么事情？

![12](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/12.jpg)

可以发现如果内网服务器关闭了，Google Dev Tools就找不到main.js.map映射文件了，此时浏览器就没有源码映射了，但是也不会报错。

### 总结

​	可以使用 [`SourceMapDevToolPlugin`](https://www.webpackjs.com/plugins/source-map-dev-tool-plugin) 插件进行更细粒度的配置。通过 [`source-map-loader`](https://www.webpackjs.com/loaders/source-map-loader) 来处理已有的 source map。

​	source-map：在生产环境使用

​	cheap-module-source-map：在开发环境使用

![17](https://github.com/Jameswain/blog/tree/master/webpack%404.32.2%E7%A0%94%E7%A9%B6%E7%AC%94%E8%AE%B0/demo03-devtool/docs/17.jpg)

​		这是官网上所有devtool的配置说明，感兴趣的同学可以对每个选项进行尝试。
