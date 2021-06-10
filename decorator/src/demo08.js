// src/demo08.js
// 无参数 - 函数装饰器 - 执行顺序

function log(target, name, descriptor) {
  console.log('log装饰器=>', name)  
}

function needLogin(target, name, descriptor) {
  console.log('needLogin装饰器=>', name)
}

function lockAsyncFunction(target, name, descriptor) {
  console.log('lockAsyncFunction装饰器=>', name);
}

class App {
  @log
  @needLogin
  @lockAsyncFunction
  onClientList() {
    console.log('App.onClientList');
  }

  @log
  @needLogin
  a() {
    console.log('a函数');
  }

  @lockAsyncFunction
  A() {
    console.log('A函数');
  }
}

const app = new App();
app.onClientList();