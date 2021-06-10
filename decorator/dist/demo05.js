var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

// src/demo05.js
// 类函数 - 装饰器
function log(target, name, descriptor) {
  console.log('log.target: ', target);
  console.log('log.name: ', name);
  console.log('log.descriptor: ', descriptor);
}

let App = (_class = class App {
  onClientList() {
    console.log('App.onClientList');
  }

}, (_applyDecoratedDescriptor(_class.prototype, "onClientList", [log], Object.getOwnPropertyDescriptor(_class.prototype, "onClientList"), _class.prototype)), _class);
const app = new App();
app.onClientList();