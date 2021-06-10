// @ts-nocheck

// src/demo01.js
// 类装饰器
function withRouter(target) {
  console.log('withRouter:', target);
}

var _class = class App {};

let App = withRouter(_class) || _class;