var mime = require("mime");					// mime类型
var parseRange = require("range-parser");
var pathIsAbsolute = require("path-is-absolute");
var MemoryFileSystem = require("memory-fs");
var timestamp = require("time-stamp");

var HASH_REGEXP = /[0-9a-f]{10,}/;

module.exports = function Shared(context) {
	var share = {
		/**
		 * 设置中间件的默认配置
		 * @param options
		 */
		setOptions: function(options) {
			if(!options) options = {};
			// webpack输入日志是否需要添加前缀
			if(typeof options.reportTime === "undefined") options.reportTime = false;
			// webpack watch 配置项
			if(typeof options.watchOptions === "undefined") options.watchOptions = {};
			// webpack 日志输出函数
			if(typeof options.reporter !== "function") options.reporter = share.defaultReporter;
			// log输出函数
			if(typeof options.log !== "function") options.log = console.log.bind(console);
			// 警告输出函数
			if(typeof options.warn !== "function") options.warn = console.warn.bind(console);
			// 错误输出函数
			if(typeof options.error !== "function") options.error = console.error.bind(console);
			// webpack 监听文件变化延迟时间，单位：毫秒
			if(typeof options.watchDelay !== "undefined") {
				// TODO remove this in next major version
				options.warn("options.watchDelay is deprecated: Use 'options.watchOptions.aggregateTimeout' instead");
				options.watchOptions.aggregateTimeout = options.watchDelay;
			}
			// webpack 观察模式，默认检查文件变化时间为200毫秒，没200毫秒检查一次文件是否发生变化，如果发生变化则让webpack重新进行编译
			if(typeof options.watchOptions.aggregateTimeout === "undefined") options.watchOptions.aggregateTimeout = 200;
			//
			if(typeof options.stats === "undefined") options.stats = {};
			// 程序入口文件所在的目录
			if(!options.stats.context) options.stats.context = process.cwd();
			// webpack日志输出格式配置
			if(options.lazy) {
				if(typeof options.filename === "string") {
					var str = options.filename
						.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
						.replace(/\\\[[a-z]+\\\]/ig, ".+");
					options.filename = new RegExp("^[\/]{0,1}" + str + "$");
				}
			}
			// 定义自定义MIME类型
			if(options.mimeTypes) mime.define(options.mimeTypes);

			context.options = options;
		},
		/**
		 * webpack默认日志输出函数
		 * @param reporterOptions 输出配置
		 */
		defaultReporter: function(reporterOptions) {
			var time = "";
			var state = reporterOptions.state;
			var stats = reporterOptions.stats;
			var options = reporterOptions.options;

			if(!!options.reportTime) {
				time = "[" + timestamp("HH:mm:ss") + "] ";
			}
			if(state) {
				var displayStats = (!options.quiet && options.stats !== false);
				// 安静模式，不输出任何webpack信息
				if(displayStats && !(stats.hasErrors() || stats.hasWarnings()) && options.noInfo)
					displayStats = false;
				// 输出webpack编译信息
				if(displayStats) {
					if(stats.hasErrors()) {				//输出webpack错误
						options.error(stats.toString(options.stats));
					} else if(stats.hasWarnings()) {	//输出webpack警告
						options.warn(stats.toString(options.stats));
					} else {							//输出webpack编译日志
						options.log(stats.toString(options.stats));
					}
				}
				if(!options.noInfo && !options.quiet) {
					var msg = "Compiled successfully.";
					if(stats.hasErrors()) {
						msg = "Failed to compile.";			// 失败完成
					  } else if(stats.hasWarnings()) {
						msg = "Compiled with warnings.";	// 警告完成
					}
					options.log(time + "webpack: " + msg);	// 编译成功
				}
			} else {
				options.log(time + "webpack: Compiling..."); // 编译中....
			}
		},
		/**
		 * 处理接受数据范围和请求头
		 * 判断客户端请求数据时是否设置了Accept-Ranges的请求头
		 * 如果设置了，则需要将数据进行截取，限制在指定范围之内
		 * @param content
		 * @param req
		 * @param res
		 * @return {*}
		 */
		handleRangeHeaders: function handleRangeHeaders(content, req, res) {
			//assumes express API. For other servers, need to add logic to access alternative header APIs
			// 设置响应头：首部字段 Accept-Ranges 是用来告知客户端服务器是否能处理范围请求，以指定获取服务器某个部分资源。 可指定的字段值有两种，可处理范围请求时指定其为 bytes ，反之则指定为 none。
			res.setHeader("Accept-Ranges", "bytes");
			// 判断是否有请求范围头
			if(req.headers.range) {
				var ranges = parseRange(content.length, req.headers.range);

				// unsatisfiable
				if(-1 == ranges) {
					res.setHeader("Content-Range", "bytes */" + content.length);
					res.statusCode = 416;
				}

				// valid (syntactically invalid/multiple ranges are treated as a regular response)
				if(-2 != ranges && ranges.length === 1) {
					// Content-Range
					res.statusCode = 206;
					var length = content.length;
					res.setHeader(
						"Content-Range",
						"bytes " + ranges[0].start + "-" + ranges[0].end + "/" + length
					);

					content = content.slice(ranges[0].start, ranges[0].end + 1);
				}
			}
			return content;
		},
		/**
		 * 设置webpack 编译器所使用的文件操作对象
		 * 设置webpack的文件操作系统为内存文件操作系统，让webpack所有编译输出的文件都输出到内存里
		 * @param compiler
		 */
		setFs: function(compiler) {
			// 判断输出路径是否是一个绝对路径
			if(typeof compiler.outputPath === "string" && !pathIsAbsolute.posix(compiler.outputPath) && !pathIsAbsolute.win32(compiler.outputPath)) {
				throw new Error("`output.path` needs to be an absolute path or `/`.");
			}

			// store our files in memory
			// 将文件存储在内存中
			var fs;
			// 判断compiler当前的outputFileSystem对象是否是 memory-fs的实例对象
			var isMemoryFs = !compiler.compilers && compiler.outputFileSystem instanceof MemoryFileSystem;
			if(isMemoryFs) {
				fs = compiler.outputFileSystem;
			} else {
				fs = compiler.outputFileSystem = new MemoryFileSystem();		// 内存文件操作系统，所有到文件操作行为都在内存中进行
			}
			context.fs = fs;
		},
		/**
		 * webpack编译完成回调函数
		 * @param stats
		 */
		compilerDone: function(stats) {
			// We are now on valid state   我们现在处于有效状态
			context.state = true;
			context.webpackStats = stats;

			// Do the stuff in nextTick, because bundle may be invalidated	在nextTick中执行这些操作，因为bundle可能会失效
			// if a change happened while compiling 如果在编译时发生了变化
			/**
			 * process.nextTick是一个异步执行队列，跟setTimeout效果一样，但是它的执行顺序会比setTimeout快
			 * Node 执行完所有同步任务，接下来就会执行process.nextTick的任务队列。
			 * 如果你希望异步任务尽可能快地执行，那就使用process.nextTick
			 */
			process.nextTick(function() {
				// check if still in valid state 检查是否仍处于有效状态
				if(!context.state) return;
				// print webpack output 打印webpack输出
				context.options.reporter({
					state: true,
					stats: stats,
					options: context.options
				});

				// execute callback that are delayed 执行延迟的回调
				var cbs = context.callbacks;
				// 清空执行过的回调函数
				context.callbacks = [];
				cbs.forEach(function continueBecauseBundleAvailable(cb) {
					cb(stats);
				});
			});

			// In lazy mode, we may issue another rebuild 在延迟模式下，我们可能会发出另一个重新构建
			if(context.forceRebuild) {
				context.forceRebuild = false;
				share.rebuild();
			}
		},
		/**
		 * 输出webpack编译日志
		 */
		compilerInvalid: function(watching, next) {
			if(context.state && (!context.options.noInfo && !context.options.quiet))
				// 输出webpack编译日志
				context.options.reporter({
					state: false,
					options: context.options
				});

			// We are now in invalid state	我们现在处于无效状态
			context.state = false;		//编译中
			// context.compiler.plugin("watch-run") 回调
			// resolve async	解决异步
			if(arguments.length === 2 && typeof arguments[1] === "function") {
				var callback = arguments[1];
				callback();	//调用next()函数，继续往下执行，如果不调用，则webpack会停止运行
			}
		},
		/**
		 * 如果webpack编译完成，则执行回调函数，并且将webpack的编译结果对象传入回调函数
		 * 如果webpack在编译中，则将回调函数装如回调数组中，等待webpack编译完成后统一调用
		 * @param fn
		 * @param req
		 * @return {*}
		 */
		ready: function ready(fn, req) {
			console.log('Share.ready...');
			var options = context.options;
			if(context.state) return fn(context.webpackStats);
			if(!options.noInfo && !options.quiet)
				options.log("webpack: wait until bundle finished: " + (req.url || fn.name));
			context.callbacks.push(fn);
		},
		/**
		 * 以监听模式启动webpack相当于在命令行中执行 webpack --watch
		 */
		startWatch: function() {
			var options = context.options;
			var compiler = context.compiler;
			// start watching   开始监听
			if(!options.lazy) {
				// 执行 compiler.watch 这个方法之后会马上调用 context.compiler.plugin("watch-run", callabck); 回调函数
				// 并且等待回调函数执行完毕后，才会返回watching对象
				var watching = compiler.watch(options.watchOptions, share.handleCompilerCallback);
				console.log('watching after....')
				context.watching = watching;
			} else {
				context.state = true;
			}
		},
		/**
		 * 重新编译
		 */
		rebuild: function rebuild() {
			if(context.state) {
				context.state = false;
				context.compiler.run(share.handleCompilerCallback);
			} else {
				context.forceRebuild = true;
			}
		},
		/**
		 * compiler watch和run完成回调函数
		 * @param err 错误信息
		 * @param stats webpack编译成功的统计信息对象
		 */
		handleCompilerCallback: function(err, stats) {
			console.log('handleCompilerCallback...');
			// for (let i = 0; i < 10000022220; i++) {}
			// 如果编译错误，则输出错误
			if(err) {
				context.options.error(err.stack || err);
				if(err.details) context.options.error(err.details);
			}
		},
		/**
		 * 处理request
		 * @param filename
		 * @param processRequest
		 * @param req
		 */
		handleRequest: function(filename, processRequest, req) {
			// in lazy mode, rebuild on bundle request
			// lazy模式，根据bundle请求重新构建
			if(context.options.lazy && (!context.options.filename || context.options.filename.test(filename)))
				share.rebuild();
			if(HASH_REGEXP.test(filename)) {
				try {
					if(context.fs.statSync(filename).isFile()) {
						processRequest();
						return;
					}
				} catch(e) {
				}
			}
			share.ready(processRequest, req);
		},
		/**
		 * webpack第一次编译完成回调函数
		 * @param callback
		 */
		waitUntilValid: function(callback) {
			console.log('Share.waitUntilValid...');
			callback = callback || function() {};
			share.ready(callback, {});
		},
		/**
		 * 重新编译
		 * @param callback 重新编译成功后回调函数
		 */
		invalidate: function(callback) {
			callback = callback || function() {};
			if(context.watching) {
				share.ready(callback, {});
				context.watching.invalidate();
			} else {
				callback();
			}
		},
		/**
		 * 关闭webpack监听模式
		 * @param callback
		 */
		close: function(callback) {
			callback = callback || function() {};
			if(context.watching) context.watching.close(callback);
			else callback();
		}
	};
	// 设置中间件选项配置
	share.setOptions(context.options);
	// 设置webpack的文件操作系统为内存文件操作系统，不会产生实际的文件，所有的文件都存在内存中，能够加快编译速度，因为读写文件是一个及其耗时和资源的过程。
	share.setFs(context.compiler);

	// context.compiler.plugin("done",share.compilerDone);				// 编译(compilation)完成。
	// context.compiler.plugin("invalid", share.compilerInvalid);		// 监听模式下，编译无效时。
	// context.compiler.plugin("watch-run", share.compilerInvalid);		// 监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。
	// context.compiler.plugin("run", share.compilerInvalid);			// 在开始读取记录之前

	/**
	 * https://www.webpackjs.com/api/compiler-hooks/#invalid 	中文网翻译
	 * https://webpack.js.org/api/compiler-hooks/#invalid   	官网解释
	 * 监听模式下，文件发生变化时调用
	 * @filename 发生变化的文件，绝对路径+文件名
	 * @timestamp 文件发生变化的时间戳
	 */
	context.compiler.plugin("invalid", (filename, timestamp) => {		// 监听模式下，文件发生变化时-异步回调
		console.log('compiler.plugin("invalid") ...');
		// for (let i = 0; i < 10000002222222220; i++) {}
		share.compilerInvalid(filename, timestamp);
	});
	context.compiler.plugin("watch-run", (watching, next) => {			// 监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。 同步回调
		// for (let i = 0; i < 10000002222222200; i++) {}
		console.log('compiler.plugin("watch-run") ...');
		// next();
		share.compilerInvalid(watching, next);
	});
	context.compiler.plugin("done", stats => {							// 编译(compilation)完成。异步回调
	  	// for (let i = 0; i < 10000022220; i++) {}
		console.log('context.compiler.plugin("done") ...');
		share.compilerDone(stats);
	});

	context.compiler.plugin("run", function () {						// 在开始读取记录之前-异步回调
		console.log('compiler.plugin("run") ...');
		share.compilerInvalid(arguments);
	});

	// 启动webpack观察模式编译
	share.startWatch();
	return share;
};
