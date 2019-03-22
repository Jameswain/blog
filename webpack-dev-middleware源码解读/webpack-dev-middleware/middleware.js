/*
 MIT License http://www.opensource.org/licenses/mit-license.php
 Author Tobias Koppers @sokra
 */
var mime = require("mime");										// mime类型
var getFilenameFromUrl = require("./lib/GetFilenameFromUrl");	// 从URL中获取文件名称
var Shared = require("./lib/Shared");							// webpack compiler对象功能封装
var pathJoin = require("./lib/PathJoin");						// 路径拼接

// constructor for the middleware  中间件的构造函数
module.exports = function(compiler, options) {

	var context = {
		/** 记录webpack编译状态，false 编译中，true  编译完成 **/
		state: false,
		/** webpack编译完成信息 **/
		webpackStats: undefined,
		/** 回调函数 **/
		callbacks: [],
		/** 中间件配置 **/
		options: options,
		/** webpack 编译器 **/
		compiler: compiler,
		/** 监听对象 **/
		watching: undefined,
		/** 强制重新构建 **/
		forceRebuild: false
	};

	// 创建webpack操作对象
	var shared = Shared(context);

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

		// 根据请求的URL获取webpack编译输出文件的绝对路径；例如：req.url="/bundle.492db0756b0d8df3e6dd.js" 获取到的filename就是"/Users/jameswain/WORK/bocs/test/webpack-dev-middleware/demo1/dist/bundle.492db0756b0d8df3e6dd.js"
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
				// console.log(content.toString())
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

	webpackDevMiddleware.getFilenameFromUrl = getFilenameFromUrl.bind(this, context.options.publicPath, context.compiler);
	// 等待webpack第一次编译成功后回调
	webpackDevMiddleware.waitUntilValid = shared.waitUntilValid;
	// 重新编译函数
	webpackDevMiddleware.invalidate = shared.invalidate;
	// 关闭webpack监听模式
	webpackDevMiddleware.close = shared.close;
	// webpack文件操作系统
	webpackDevMiddleware.fileSystem = context.fs;
	return webpackDevMiddleware;
};
