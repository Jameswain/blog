// src/demo08.js
// 无参数 - 函数装饰器 - 执行顺序

/**
 * 应用装饰描述符
 * @param {*} target 被装饰函数的类原型
 * @param {*} property 被装饰函数名称
 * @param {*} decorators 装饰器数组
 * @param {*} descriptor 被装饰函数的属性描述符
 * @param {*} context 被装饰函数的类原型
 * @returns 
 */
 function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = descriptor;
  // 循环调用装饰器
  desc = decorators.reverse().reduce(function (desc, decorator) {
    const decoratorRetuen = decorator(target, property, desc); // 这里其实就是调用log装饰器函数，没有写返回值，所以是undefined
    return decoratorRetuen || desc; // 如果装饰器没有返回描述符对象，则使用传入的描述符对象
  }, desc);
  // 重新定义被装饰的函数
  Object.defineProperty(target, property, desc);
  desc = null;
  return desc;
}

function log(target, name, descriptor) {
  console.log("log装饰器=>", name);
}

function needLogin(target, name, descriptor) {
  console.log("needLogin装饰器=>", name);
}

function lockAsyncFunction(target, name, descriptor) {
  console.log("lockAsyncFunction装饰器=>", name);
}

class App {
  onClientList() {
    console.log("App.onClientList");
  }

  a() {
    console.log("a函数");
  }

  A() {
    console.log("A函数");
  }
}

applyDecoratedDescriptor(
  App.prototype,
  "onClientList",
  [log, needLogin, lockAsyncFunction],
  Object.getOwnPropertyDescriptor(App.prototype, "onClientList"),
  App.prototype
)

applyDecoratedDescriptor(
  App.prototype,
  "a",
  [log, needLogin],
  Object.getOwnPropertyDescriptor(App.prototype, "a"),
  App.prototype
)

applyDecoratedDescriptor(
  App.prototype,
  "A",
  [lockAsyncFunction],
  Object.getOwnPropertyDescriptor(App.prototype, "A"),
  App.prototype
)

const app = new App();
app.onClientList();