// webpackBootstrap
(function (modules) {
  debugger;
  // 模块缓存
  var installedModules = {};
  
  // require函数
  function __webpack_require__(moduleId) {
    // 检查模块是否在缓存中
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;  // 存在缓存中直接返回
    }
    
    // 创建一个新模块，并将它放入缓存中
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,       // 模块是否已加载
      exports: {}
    };
    
    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    
    // 标记模块为已加载
    module.l = true;
    
    // 返回模块的exports
    return module.exports;
  }
  
  // 暴露 所有的模块对象到__webpack_require__函数上
  __webpack_require__.m = modules;
  
  // 暴露 模块缓存对象
  __webpack_require__.c = installedModules;
  
  // 为exports定义get函数
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  }
  
  // 在exports上定义__esModule
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  }
  
  // Object.prototype.hasOwnProperty.call 判断对象的某个属性是否属于自己的属性
  __webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); }
  
  
  // 加载入口模块，并返回exports
  return __webpack_require__(__webpack_require__.s = './src/index.js');
})({
  '../../node_modules/css-loader/dist/runtime/api.js': (function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
  }),
  './src/index.js': (function (module, __webpack_exports__, __webpack_require__) {
    'use strict';
    __webpack_require__.r(__webpack_exports__);
    var _main_css_WEBPACK_IMPORTED_MODULE_0 = __webpack_require__('./src/main.css');
    console.log(_main_css_WEBPACK_IMPORTED_MODULE_0);
  }),
  './src/main.css': (function (module, __webpack_exports__, __webpack_require__) {
  }),
  './src/role.js': (function (module, __webpack_exports__, __webpack_require__) {
  })
});
