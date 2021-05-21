// 类装饰器的简单应用
function log(target, name, descriptor) {
  console.log('target: ', target);
  console.log('name: ', name);
  console.log('descriptor: ', descriptor);
}

@log
class App {
}
