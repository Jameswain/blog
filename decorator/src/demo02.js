// @ts-nocheck

// src/demo02.js
// 带参数的类装饰器
function withRouter(params) { // 接收参数的函数
  console.log('withRouter.params:', params);
  return function(target) { // 装饰器函数
    // 给被装饰的类添加一个静态属性
    target.params = params;
  	console.log('withRouter.target:', target);
  }
}

@withRouter('Jameswain')
class App {
}
console.log(App)

