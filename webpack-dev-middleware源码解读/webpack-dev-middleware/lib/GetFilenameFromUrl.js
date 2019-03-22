var pathJoin = require("./PathJoin");
var querystring = require("querystring");
var urlParse = require("url").parse;

/**
 * 从请求URL中获取文件名称和绝对路径
 * @param publicPath
 * @param outputPath
 * @param url
 * @return {*}
 */
function getFilenameFromUrl(publicPath, outputPath, url) {
	var filename;

	// localPrefix is the folder our bundle should be in
	/**
	 * localPrefix应该是我们的bundle所在的文件夹
	 * 解析 URL 字符串并返回 URL 对象
	 * urlString <string> 要解析的 URL 字符串。
	 * parseQueryString <boolean> 如果设为 true，则返回的 URL 对象的 query 属性会是一个使用 querystring 模块的 parse() 生成的对象。 如果设为 false，则 query 会是一个未解析未解码的字符串。 默认为 false。
	 * slashesDenoteHost <boolean> 如果设为 true，则 // 之后至下一个 / 之前的字符串会解析作为 host。 例如， //foo/bar 会解析为 {host: 'foo', pathname: '/bar'} 而不是 {pathname: '//foo/bar'}。 默认为 false。
	 */
	var localPrefix = urlParse(publicPath || "/", false, true);

	var urlObject = urlParse(url);

	// publicPath has the hostname that is not the same as request url's, should fail
	// publicPath的主机名与请求url的主机名不相同，应该会失败
	if(localPrefix.hostname !== null && urlObject.hostname !== null &&
		localPrefix.hostname !== urlObject.hostname) {
		return false;
	}

	// publicPath is not in url, so it should fail
	// publicPath不在url中，因此应该会失败
	if(publicPath && localPrefix.hostname === urlObject.hostname && url.indexOf(publicPath) !== 0) {
		return false;
	}

	// strip localPrefix from the start of url
	// 从url的开头去掉localPrefix
	if(urlObject.pathname.indexOf(localPrefix.pathname) === 0) {
		filename = urlObject.pathname.substr(localPrefix.pathname.length);
	}

	if(!urlObject.hostname && localPrefix.hostname &&
		url.indexOf(localPrefix.path) !== 0) {
		return false;
	}
	// and if not match, use outputPath as filename
	// 如果不匹配，则使用outputPath作为文件名
	return querystring.unescape(filename ? pathJoin(outputPath, filename) : outputPath);
}

// support for multi-compiler configuration
// 支持多编译器配置
// see: https://github.com/webpack/webpack-dev-server/issues/641
function getPaths(publicPath, compiler, url) {
	var compilers = compiler && compiler.compilers;
	if(Array.isArray(compilers)) {
		var compilerPublicPath;
		for(var i = 0; i < compilers.length; i++) {
			compilerPublicPath = compilers[i].options
				&& compilers[i].options.output
				&& compilers[i].options.output.publicPath;
			if(url.indexOf(compilerPublicPath) === 0) {
				return {
					publicPath: compilerPublicPath,
					outputPath: compilers[i].outputPath
				};
			}
		}
	}
	return {
		publicPath: publicPath,
		outputPath: compiler.outputPath
	};
}

module.exports = function(publicPath, compiler, url) {
	var paths = getPaths(publicPath, compiler, url);
	return getFilenameFromUrl(paths.publicPath, paths.outputPath, url);
};
