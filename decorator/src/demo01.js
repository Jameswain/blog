// src/demo01.js
// 类装饰器：只要target一个参数，而且target代表被装饰的类本身
function withRouter(target) {
  console.log('withRouter:', target);
  // 📢注意：返回值可以不写，但是不能随便写返回值，即使要写也只能是target，或者是一个类，如果返回是一个对象，会导致装饰后的类无法被new
  // 类装饰器的返回值只能以下3种：target（类本身）、新的类、(null、undefined、false、0) 返回为false值，编译后的代码装饰器也会处理为target
}

@withRouter
class App {}