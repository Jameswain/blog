"use strict";

var _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// 类装饰器的简单应用
function log(target, name, descriptor) {
  console.log('target: ', target);
  console.log('name: ', name);
  console.log('descriptor: ', descriptor);
}

var App = log(_class = function App() {
  _classCallCheck(this, App);
}) || _class;