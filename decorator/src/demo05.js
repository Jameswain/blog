// src/demo05.js
// 类函数 - 装饰器
function log(target, name, descriptor) {
  console.log('log.target: ', target);
  console.log('log.name: ', name);
  console.log('log.descriptor: ', descriptor);
  
}

class App {
  @log
  onClientList() {
    console.log('App.onClientList');
  }
}

const app = new App();
app.onClientList();