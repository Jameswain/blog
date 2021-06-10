// @ts-nocheck
// src/demo02.js
// 带参数的类装饰器
function withRouter(params) { // 接收参数的函数
  console.log('withRouter.params:', params);
  return function (target) { // 装饰器函数
    // 给被装饰的类添加一个静态属性
    target.params = params;
    console.log('withRouter.target:', target);
  };  
}

var _dec = withRouter('Jameswain'); // 传入参数给装饰器，其实就是执行@withRouter('Jameswain')
var _class = class App {};
let App = _dec(_class) || _class; // 调用装饰器函数，对类进行装饰
console.log(App);