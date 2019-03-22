[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]
[![chat][chat]][chat-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>webpack Dev Middleware</h1>
</div>
It's a simple wrapper middleware for webpack.   

它是webpack的简单包装中间件。

It serves the files emitted from webpack over a connect server.  

它通过连接服务器提供从webpack发出的文件。

This should be used for **development only**.

这应该仅用于**开发**。 

It has a few advantages over bundling it as files:

用它来打包文件有一些优势:

* No files are written to disk, it handle the files in memory
* 没有文件写入磁盘，它处理内存中的文件。（编译打包更快，没有频繁的IO读写操作）
* If files changed in watch mode, the middleware no longer serves the old bundle, but delays requests until the compiling has finished. You don't have to wait before refreshing the page after a file modification.
* 如果文件在监视模式下更改，中间件将不再服务于旧的包，但是在编译完成之前延迟请求。在修改文件后刷新页面之前，您不必等待。
* I may add some specific optimization in future releases.
* 我可能会在未来的版本中添加一些特定的优化。

<h2 align="center">Install</h2>

```
npm install webpack-dev-middleware --save-dev
```

<h2 align="center">Usage</h2>

``` javascript
var webpackMiddleware = require("webpack-dev-middleware");
app.use(webpackMiddleware(...));
```

Example usage: 

使用示例:

``` javascript
app.use(webpackMiddleware(webpack({
	// webpack options
    // webpack 选项
	// webpackMiddleware takes a Compiler object as first parameter 
    // webpackMiddleware将编译器对象作为第一个参数
	// which is returned by webpack(...) without callback.
    // 由webpack(…)返回，没有回调。
	entry: "...",
	output: {
		path: "/"
		// no real path is required, just pass "/"
        // 不需要实际路径，只需传递"/"即可
		// but it will work with other paths too.
        // 但它也适用于其他途径。
	}
}), {
	// publicPath is required, whereas all other options are optional
    // publicPath是必需的，而所有其他选项都是可选的

	noInfo: false,
	// display no info to console (only warnings and errors)
    // 没有显示信息到控制台(只有警告和错误)

	quiet: false,
	// display nothing to the console
    // 不向控制台显示任何内容

	lazy: true,
	// switch into lazy mode
    // 切换到延迟模式
	// that means no watching, but recompilation on every request
    // 这意味着不需要监视，而是对每个请求重新编译

	watchOptions: {
		aggregateTimeout: 300,
		poll: true
	},
	// watch options (only lazy: false)
    // webpack watch选项，只有lazy:true时才有效

	publicPath: "/assets/",
	// public path to bind the middleware to
    // 绑定中间件的公共路径
	// use the same as in webpack
    // 使用与webpack相同的方法

	index: "index.html",
	// The index path for web server, defaults to "index.html".
    // web服务器的索引路径，默认为“index.html”。
	// If falsy (but not undefined), the server will not respond to requests to the root URL.
    // 如果是falsy(但不是未定义)，服务器不会响应对根URL的请求。

	headers: { "X-Custom-Header": "yes" },
	// custom headers
    // 自定义请求头

	mimeTypes: { "text/html": [ "phtml" ] },
	// Add custom mime/extension mappings
    // 添加自定义mime/扩展映射
	// https://github.com/broofa/node-mime#mimedefine
	// https://github.com/webpack/webpack-dev-middleware/pull/150

	stats: {
		colors: true
	},
	// options for formating the statistics
    // 格式化统计信息选项

	reporter: null,
	// Provide a custom reporter to change the way how logs are shown.
	// 提供自定义报告器以更改日志的显示方式。
    
	serverSideRender: false,
	// Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
    // 关闭服务器端渲染模式。有关详细信息，请参阅服务器端渲染部分。
}));
```

## Advanced API  高级 API

This part shows how you might interact with the middleware during runtime:

这一部分展示了如何在运行时与中间件交互:

* `close(callback)` - stop watching for file changes.  停止监视文件更改

  ```js
  var webpackDevMiddlewareInstance = webpackMiddleware(/* see example usage */);
  app.use(webpackDevMiddlewareInstance);
  // After 10 seconds stop watching for file changes:
  setTimeout(function(){
    webpackDevMiddlewareInstance.close();
  }, 10000);
  ```

* `invalidate()` - recompile the bundle - e.g. after you changed the configuration

* `invalidate()` - 重新编译包——例如，在更改配置之后

  ```js
  var compiler = webpack(/* see example usage */);
  var webpackDevMiddlewareInstance = webpackMiddleware(compiler);
  app.use(webpackDevMiddlewareInstance);
  setTimeout(function(){
    // After a short delay the configuration is changed
    // 在短暂的延迟之后，配置将发生更改
    // in this example we will just add a banner plugin:
    // 在这个例子中，我们将添加一个横幅插件: 
    compiler.apply(new webpack.BannerPlugin('A new banner'));
    // Recompile the bundle with the banner plugin:
    // 用banner插件重新编译包:
    webpackDevMiddlewareInstance.invalidate();
  }, 1000);
  ```

* `waitUntilValid(callback)` - executes the `callback` if the bundle is valid or after it is valid again:

* `waitUntilValid(callback)` - 如果bundle有效或再次有效，则执行`callback`：

  ```js
  var webpackDevMiddlewareInstance = webpackMiddleware(/* see example usage */);
  app.use(webpackDevMiddlewareInstance);
  webpackDevMiddlewareInstance.waitUntilValid(function(){
    console.log('Package is in a valid state');
  });
  ```

## Server-Side Rendering 服务器渲染

**Note: this feature is experimental and may be removed or changed completely in the future.**

In order to develop a server-side rendering application, we need access to the [`stats`](https://github.com/webpack/docs/wiki/node.js-api#stats), which is generated with the latest build.

In the server-side rendering mode, __webpack-dev-middleware__ sets the `stat` to `res.locals.webpackStats` before invoking the next middleware, allowing a developer to render the page body and manage the response to clients.

Notice that requests for bundle files would still be responded by __webpack-dev-middleware__ and all requests will be pending until the building process is finished in the server-side rendering mode.

```javascript
// This function makes server rendering of asset references consistent with different webpack chunk/entry configurations
function normalizeAssets(assets) {
  return Array.isArray(assets) ? assets : [assets]
}

app.use(webpackMiddleware(compiler, { serverSideRender: true })

// The following middleware would not be invoked until the latest build is finished.
app.use((req, res) => {
  
  const assetsByChunkName = res.locals.webpackStats.toJson().assetsByChunkName
  
  // then use `assetsByChunkName` for server-sider rendering
  // For example, if you have only one main chunk:

	res.send(`
<html>
  <head>
    <title>My App</title>
		${
			normalizeAssets(assetsByChunkName.main)
			.filter(path => path.endsWith('.css'))
			.map(path => `<link rel="stylesheet" href="${path}" />`)
			.join('\n')
		}
  </head>
  <body>
    <div id="root"></div>
		${
			normalizeAssets(assetsByChunkName.main)
			.filter(path => path.endsWith('.js'))
			.map(path => `<script src="${path}"></script>`)
			.join('\n')
		}
  </body>
</html>		
	`)

})
```

<h2 align="center">Contributing 贡献</h2>

Don't hesitate to create a pull request. Every contribution is appreciated. In development you can start the tests by calling `npm test`.

<h2 align="center">Maintainers 维护</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150 height="150"
        src="https://avatars.githubusercontent.com/SpaceK33z?v=3">
        <br />
        <a href="https://github.com/SpaceK33z">Kees Kluskens</a>
      </td>
    <tr>
  <tbody>
</table>


<h2 align="center">LICENSE</h2>

#### [MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/webpack-dev-middleware.svg
[npm-url]: https://npmjs.com/package/webpack-dev-middleware

[node]: https://img.shields.io/node/v/webpack-dev-middleware.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/webpack/webpack-dev-middleware.svg
[deps-url]: https://david-dm.org/webpack/webpack-dev-middleware

[tests]: http://img.shields.io/travis/webpack/webpack-dev-middleware.svg
[tests-url]: https://travis-ci.org/webpack/webpack-dev-middleware

[cover]: https://codecov.io/gh/webpack/webpack-dev-middleware/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/webpack/webpack-dev-middleware

[chat]: https://badges.gitter.im/webpack/webpack.svg
[chat-url]: https://gitter.im/webpack/webpack
