​    webpack-dev-middleware 是express的一个中间件，它的主要作用是以监听模式启动webpack，将webpack编译后的文件输出到内存里，然后将内存的文件输出到epxress服务器上；下面通过一张图片来看一下它的工作原理：

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/1e5d0dc8-271d-4e16-861f-d412dad45dc4.png)



了解了它的工作原理以后我们通过一个例子进行实操一下。

**demo1：初始化webpack-dev-middleware中间件，启动webpack监听模式编译，返回express中间件函数**

```
// src/app.js
console.log('App.js');
document.write('webpack-dev-middleware');
```

```
// demo1/index.js
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');     // webpack开发中间件
const HtmlWebpackPlugin = require('html-webpack-plugin');           // webpack插件：根据模版生成html，并且自动注入引用webpack编译出来的css和js文件

/**
 * 创建webpack编译器
 */
const comoiler = webpack({  // webpack配置
    entry: path.resolve(__dirname, 'src/app.js'),       // 入口文件
    output: {                                           // 输出配置
        path: path.resolve(__dirname, 'dist'),          // 输出路径
        filename: 'bundle.[hash].js'                    // 输出文件
    },
    plugins: [                                          // 插件
        new HtmlWebpackPlugin({                         // 根据模版自动生成html文件插件，并将webpack打包输出的js文件注入到html文件中
            title: 'webpack-dev-middleware'
        })
    ]
});

/**
 * 执行webpack-dev-middleware初始化函数，返回express中间件函数
 * 这个函数内部以监听模式启动了webpack编译，相当于执行cli的： webpack --watch命令
 * 也就是说执行到这一步，就已经启动了webpack的监听模式编译了，代码执行到这里可以看到控制台已经输出了webpack编译成功的相关日志了
 * 由于webpack-dev-middleware中间件内部使用memory-fs替换了compiler的outputFileSystem对象，将webpack打包编译的文件都输出到内存中
 * 所以磁盘上看不到任何webpack编译输出的文件
 */
const webpackDevMiddlewareInstance = webpackDevMiddleware(comoiler,{
    reportTime: true,           // webpack状态日志输出带上时间前缀
    stats: {
        colors: true,           // webpack编译输出日志带上颜色，相当于命令行 webpack --colors
        process: true
    }
});
```

运行结果：

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/62171372.png)

**源码链接：https://github.com/Jameswain/blog/tree/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/demo1** 

​        通过上述例子的运行结果，我们可以发现webpack-dev-middleware实际上是一个函数，通过执行它会返回一个express风格的中间件函数，并且会以监听模式启动webpack编译。由于webpack-dev-middleware中间件内部使用memory-fs替换了compiler的outputFileSystem对象，将webpack打包编译的文件都输出到内存中，所以虽然我们看到控制台上有webpack编译成功的日志，但是并没有看到任何的输出文件，就是这个原因，因为这些文件在内存里。

​        如果此时我们不想把文件输出到内存里，可以通过修改webpack-dev-middleware的源代码来实现。打开node_modules/webpack-dev-middleware/lib/Shared.js文件，将该文件的231行注视掉后，重新运行 **node demo1/index.js** 即可看到文件被输出到demo1/dist文件夹中。

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/64101705.png)

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/64287494.png)

​        问：为什么webpack-dev-middleware要将webpack打包后的文件输出到内存中，而不是直接到磁盘上呢？

​        答：速度，因为IO操作是非常耗资源时间的，直接在内存里操作会比磁盘操作会更加快速和高效。因为即使是webpack把文件输出到磁盘，要将磁盘上到文件通过一个服务输出到浏览器，也是需要将磁盘的文件读取到内存里，然后在通过流进行输出，然后浏览器上才能看到，所以中间件这么做其实还是省了一步读取磁盘文件的操作。

​        下面通过一个例子演示一下如何将本地磁盘上的文件通过Express服务输出到response，在浏览器上进行访问：

```
//demo3/app.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// 读取index.html文件
const htmlIndex = fs.readFileSync(path.resolve(__dirname,'index.html'));
// 读取图片
const img = fs.readFileSync(path.resolve(__dirname, 'node.jpg'));

app.use((req, res, next) => {
    console.log(req.url)
    if (req.url === '/' || req.url === '/index.html') {
        res.setHeader("Content-Type", 'text/html;charset=UTF-8');
        res.setHeader("Content-Length", htmlIndex.length);
        res.send(htmlIndex);    // 传送HTTP响应
        // res.end();           // 此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。 必须在每个响应上调用此 response.end() 方法。
        // res.sendFile(path.resolve(__dirname, 'index.html'));    //传送指定路径的文件 -会自动根据文件extension设定Content-Type
    } else if (req.url === '/node.jpg') {
        res.end(img);   // 此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。 必须在每个响应上调用此 response.end() 方法。
    }
});

app.listen(3000, () => console.log('express 服务启动成功。。。'));

//浏览器访问：http://localhost:3000/node.jpg
//浏览器访问：http://localhost:3000/
```

项目目录：

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/29870194.png)

运行结果：

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/29985101.png)

  通过上述代码我们可以看出不管是输出html文件还是图片文件都是需要先将这些文件读取到内存里，然后才能输出到response上。

​        

------

## middleware.js

​        下面我们就来看看webpack-dev-middleware这个函数内部是如何实现的，它的运行原理是什么？个人感觉读源码最主要的就是基础 + 耐心 + 流程

​        首先打开node_modules/webpack-dev-middleware/middleware.js文件，注意版本号，我这份代码的版本号是webpack-dev-middleware@1.12.2。

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/2752702.png)

​    middleware.js文件就是webpack-dev-middleware的入口文件，它主要做以下几件事情：

​    1、记录compiler对象和中间件配置

​    2、创建webpack操作对象shared

​    3、创建中间件函数webpackDevMiddleware

​    4、将webpack的一些常用操作函数暴露到中间件函数上，供外部直接调用

​    5、返回中间件函数

## Shared.js

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/41174537.png)

这个文件对webpack的compiler这个对象进行封装操作，我们大概先来看看这个文件主要做了哪些事情：

1. 首先设置中间件的一些默认选项配置

2. 使用memory-fs对象替换掉compiler的文件系统对象，让webpack编译后的文件输出到内存中

3. 监听webpack的钩子函数

4. 1. invalid：监听模式下，文件发生变化时调用，同时会传入2个参数，分别是文件名和时间戳
   2. watch-run：监听模式下，一个新的编译触发之后，完成编译之前调用
   3. done：编译完成时调用，并传入webpack编译日志对象stats
   4. run：在开始读取记录之前调用，只有调用compiler.run()函数时才会触发该钩子函数

5. 以观察者模式启动webpack编译

6. 返回share对象，该对象封装了很多关于compiler的操作函数



通过上面的截图我们大概知道了Shared.js文件的运行流程，下面我们再来看看它一些比较重要的细节。

### share.setOptions 设置中间件的默认配置

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/43723629.png)



### share.setFs(context.compiler) 设置compiler的文件操作对象

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/44042743.png)



### share.startWatch() 以观察模式启动webpack

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/44383225.png)

compiler.watch(watchOptions, callback) 这个函数表示以监听模式启动webpack并返回一个watching对象，这里特别需要注意的是当调用compiler.watch函数时会立即执行watch-run这个钩子回调函数，直到这个钩子回调函数执行完毕后，才会返回watching对象。



### share.compilerDone(stats) webpack编译完成回调处理函数

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/55396865.png)

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/55372833.png)

当webpack的一个编译完成时会进入done钩子回调函数，然后调用compilerDone函数，这个函数内部首先将context.state设置为true表示webpack编译完成，并记录webpack的统计信息对象stats，然后将webpack日志输出操作和回调函数执行都放到process.nextTick()任务队列执行，就是等主逻辑所有的代码执行完毕后才进行webpack的日志输出和中间件回调函数的执行。



### context.options.reporter (share.defaultReporter) webpack默认日志输出函数

context.options.reporter 和 share.defaultReporter 指向的都是同一个函数

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/57543532.png)

​    通过代码我们可以看出这个函数内部首先是要判断一下state这个状态，false表示webpack处于编译中，则直接输出 webpack: Compiling...。true：则表示webpack编译完成，则需要判断webpack-dev-middleware这个中间件都两个配置，noInfo和quiet，noInfo如果是为true则只输出错误和警告，quiet为true则不输出任何内容，默认这俩选项都是false，这时候会判断webpack编译成功后返回的stats对象里有没有错误和警告，有错误或警告就输出错误和警告，没有则输出webpack的编译日志，并且使用webpack-dev-middleware的options.stats配置项作为webpack日志输出配置，更多webpack日志输出配置选项见：<https://www.webpackjs.com/configuration/stats/>            <https://webpack.js.org/configuration/stats/> 



### handleCompilerCallback() - watch回调函数

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/59320658.png)

这个是watch回调函数，它是在compiler.plugin('done')钩子函数执行完毕之后执行，它有两个参数，一个是错误信息，一个是webpack编译成功的统计信息对象stats，可以看到这个回调函数内部只做错误信息的输出。



### webpack watch模式钩子函数执行流程图

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/e2513039-6288-4036-bb06-d138134fb99c.png)



## 使用webpack-dev-middleware中间件

​    之前我介绍的都是webpack-dev-middleware中间件初始化阶段主要做了什么事情，而且我的第一个代码例子里也只是调用了webpack-dev-middleware中间件的初始化函数而已，并没有和express结合使用，当时这么做的主要是为了说明这个中间件的初始化阶段的运行机制，下面我们通过一个完整一点的例子说明webpack-dev-middleware中间件如何和express进行结合使用以及它的运行流程和原理。 

```
// demo2/index.js
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
app.use(webpackDevMiddlewareInstance);      // 使用webpack-dev-middleware中间件，每一个web请求都会进入该中间件函数
app.listen(3000, () => console.log('启动express服务...'));  // 启动express服务器在3000端口上

// for (let i = 0; i < 10000022220; i++) {}    // 会阻塞webpack的编译操作
```

​    **源码地址：https://github.com/Jameswain/blog/tree/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/demo2** 

​        通过app.use进行使用中间件，然后我们通过在浏览器访问localhost:3000，然后就可以看到效果了，此时任何一个web请求都会执行webpack-dev-middleware的中间件函数，下面我们来看看这个中间件函数内部是如何实现的，到底做了哪些事情。



​        **1、我们先通过一个流程图看一下上面这段代码首次执行webpack-dev-middleware的内部运行流程**

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/1bc647a1-0727-41d0-b03c-584075ab42eb.jpg)

​    

​    **2、middleware.js文件中的webpackDevMiddleware函数代码解析** 

```
// webpack-dev-middleware 中间件函数，每一个http请求都会进入次函数
    function webpackDevMiddleware(req, res, next) {
        /**
         * 执行下一个中间件
         */
        function goNext() {
            // 如果不是服务器端渲染，则直接执行下一个中间件函数
            if(!context.options.serverSideRender) return next();
            return new Promise(function(resolve) {
                shared.ready(function() {
                    res.locals.webpackStats = context.webpackStats;
                    resolve(next());
                }, req);
            });
        }

        // 如果不是GET请求，则直接调用下一个中间件并返回退出函数
        if(req.method !== "GET") {
            return goNext();
        }

        // 根据请求的URL获取webpack编译输出文件的绝对路径；例如：req.url="/bundle.492db0756b0d8df3e6dd.js" 获取到的filename就是"/Users/jameswain/WORK/blog/demo2/dist/bundle.492db0756b0d8df3e6dd.js"
        // 可以看到其实就是webpack编译输出文件的绝对路径和名称
        var filename = getFilenameFromUrl(context.options.publicPath, context.compiler, req.url);
        if(filename === false) return goNext();

        return new Promise(function(resolve) {
            shared.handleRequest(filename, processRequest, req);
            function processRequest(stats) {
                try {
                    var stat = context.fs.statSync(filename);
                    // 处理当前请求是 / 的情况
                    if(!stat.isFile()) {
                        if(stat.isDirectory()) {
                            // 如果请求的URL是/，则将它的文件设置为中间件配置的index选项
                            var index = context.options.index;
                            // 如果中间件没有设置index选项，则默认设置为index.html
                            if(index === undefined || index === true) {
                                index = "index.html";
                            } else if(!index) {
                                throw "next";
                            }
                            // 将webpack的输出目录outputPath和index.html拼接起来
                            filename = pathJoin(filename, index);
                            stat = context.fs.statSync(filename);
                            if(!stat.isFile()) throw "next";
                        } else {
                            throw "next";
                        }
                    }
                } catch(e) {
                    return resolve(goNext());
                }

                // server content  服务器内容
                // 读取文件内容
                var content = context.fs.readFileSync(filename);
                // console.log(content.toString())  //输出文件内容
                // 处理可接受数据范围的请求头
                content = shared.handleRangeHeaders(content, req, res);
                // 获取文件的mime类型
                var contentType = mime.lookup(filename);
                // do not add charset to WebAssembly files, otherwise compileStreaming will fail in the client
                // 不要将charset添加到WebAssembly文件中，否则编译流将在客户端失败
                if(!/\.wasm$/.test(filename)) {
                    contentType += "; charset=UTF-8";
                }
                res.setHeader("Content-Type", contentType);
                res.setHeader("Content-Length", content.length);
                // 中间件自定义请求头配置，如果中间件有配置，则循环设置这些请求头
                if(context.options.headers) {
                    for(var name in context.options.headers) {
                        res.setHeader(name, context.options.headers[name]);
                    }
                }
                // Express automatically sets the statusCode to 200, but not all servers do (Koa).
                // Express自动将statusCode设置为200，但不是所有服务器都这样做(Koa)。
                res.statusCode = res.statusCode || 200;
                // 将请求的文件或数据内容输出到客户端（浏览器）
                if(res.send) res.send(content);
                else res.end(content);
                resolve();
            }
        });
    }
```

​    这是webpack-dev-middleware中间件的源代码，我加了一些注释和个人见解说明这个中间件内部的具体操作，这里我简单总结一下这个中间件函数主要做了哪些事情：

1. 首先判断如果不是GET请求，则调用下一个中间件函数，并退出当前中间件函数。
2. 根据请求的URL，拼接出该资源在webpack输出目录的绝对路径。例如：请求的URL为“/bundle.js”，那么在我电脑拼接出的绝对路径就为"/Users/jameswain/WORK/blog/demo2/dist/bundle.js"，如果请求的URL为/，设置文件为index.html
3. 读取请求文件的内容，是一个Buffer类型，可以立即为流
4. 判断客户端是否设置了range请求头，如果设置了，则需要对内容进行截取限制在指定范围之内。
5. 获取请求文件的mime类型
6. 设置请求头Content-Type和Content-Length，循环设置中间件配置的自定义请求头
7. 设置状态码为200
8. 将文件内容输出到客户端

​    下面通过一个流程图看一下这个中间件函数的执行流程：

![img](https://raw.githubusercontent.com/Jameswain/blog/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/imgs/f4f1ba7e-f38f-494b-b126-3897d379f075.png)



## 总结

​    webpack-dev-middleware这个中间件内部其实主就是做了两件事，第一就是在中间件函数初始化时，修改webpack的文件操作对象，让webpack编译后的文件输出到内存里，以监听模式启动webpack。第二就是当有http get请求过来时，中间件函数内部读取webpack输出到内存里的文件，然后输出到response上，这时候浏览器拿到的就是webpack编译后的资源文件了。

​    最后给出本文所有相关源代码的地址：<https://github.com/Jameswain/blog/tree/master/webpack-dev-middleware%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB>  

​    声明：本文纯属个人阅读webpack-dev-middleware@1.12.2源码的一些个人理解和感悟，由于本人技术水平有限，如有错误还望各位大神批评指正。













