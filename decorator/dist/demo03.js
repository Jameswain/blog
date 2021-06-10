var _dec, _dec2, _class;

// @ts-nocheck
// src/demo03.js
// 装饰器的执行顺序
function log(name) {
  // 接收参数层
  console.log('log.name:', name);
  return function logDecorator(target) {
    // 装饰器层
    console.log('log.target: ', target);
  };
}

function connect(name) {
  // 接收参数层
  console.log('connect.name', name);
  return function connectDecorator(target) {
    // 装饰器层
    console.log('connect.target: ', target);
  };
}

function withRouter(target) {
  // 装饰器层
  console.log('withRouter.target: ', target);
}

let App = (_dec = log('日志'), _dec2 = connect('连接器'), _dec(_class = withRouter(_class = _dec2(_class = class App {}) || _class) || _class) || _class);