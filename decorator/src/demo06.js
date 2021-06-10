// @ts-nocheck
// src/demo06.js
// 类函数 - 装饰器babel编译后源码解析

/**
 * 应用装饰描述符
 * @param {*} target 被装饰函数的类原型
 * @param {*} property 被装饰函数名称
 * @param {*} decorators 装饰器数组
 * @param {*} descriptor 被装饰函数的对象描述符
 * @param {*} context 被装饰函数的类原型
 * @returns 
 */
function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
 /**
   * 第一部分：被装饰函数的描述符对象处理
   * 这块代码逻辑主要是把被装饰函数的描述符对象配置复制到desc对象中
   * 其实这块逻辑完全就是多余的，完全没有必要写，理由有2点：
   *  1、Object.getOwnPropertyDescriptor每次都是返回一个全新的描述对象，同样的代码获取2次的描述对象是不相等的，所以不用担心直接使用会影响别的问题
   *  2、在类中直接创建的函数，描述对象默认就有value值，writable默认就是true，所以完全没有必要多此一举做判断
   */
  // Object.keys(descriptor).forEach(function (key) {
  //   desc[key] = descriptor[key];
  // });
  // desc.enumerable = !!desc.enumerable;
  // desc.configurable = !!desc.configurable;
  // if ('value' in desc || desc.initializer) {
  //   desc.writable = true;
  // }
  var desc = descriptor;

  // 第二部分：装饰器函数数组调用
  /**
   * 这里涉及到的三个数组函数，我都列举出来
   * Array.prototype.slice() - 返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。
   * Array.prototype.reverse() - 将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。
   * Array.prototype.reduce() - 对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
   * 
   * 逻辑剖析：
   * decorators传进来的是[log]，是一个全新的数组也没有任何的关联，所以完全没有必要使用[log].slice()返回一个全新的数组了，所以可以删除slice()调用操作
   * 
   */
  // 原始代码
  // desc = decorators.slice().reverse().reduce(function (desc, decorator) {
  //   return decorator(target, property, desc) || desc;
  // }, desc);
  // 精简后的代码
  desc = decorators.reverse().reduce(function (desc, decorator) {
    const decoratorRetuen = decorator(target, property, desc); // 这里其实就是调用log装饰器函数，没有写返回值，所以是undefined
    // 如果装饰器没有返回描述符对象，则使用传入的描述符对象
    return decoratorRetuen || desc;
  }, desc);
  

  // 第三部分：initializer的处理
  /**
   * context 其实就是App.prototype
   * desc.initializer 函数只有装饰属性是才会有值
   * void 0 其实就是 undefined
   * 因为这里装饰的是类函数，所以initializer就是等于undefined，所以说if里面的处理逻辑是执行不到的，其实我们也可以把它删掉 。
   */
  // if (context && desc.initializer !== undefined) {
  //   desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
  //   desc.initializer = undefined;
  // }
  
  // 第四部分：重新定义被装饰器的函数描述符
  /**
   * 这里装饰的是函数，所以描述符是不可能有initializer属性的，所以每次都会重新定义一次被装饰的函数，描述符对象取的是默认的获取是装饰器返回的；
   */
  // if (desc.initializer === void 0) {
  Object.defineProperty(target, property, desc);
  desc = null;
  // }
  return desc;
}

/**
 * 装饰器
 * @param {*} target 被装饰函数的类原型
 * @param {*} name 被装饰函数名
 * @param {*} descriptor 被装饰函数的描述对象
 */
function log(target, name, descriptor) {
  console.log('log.target: ', target);
  console.log('log.name: ', name);
  console.log('log.descriptor: ', descriptor);
}

// 创建App类
class App {
  onClientList() {
    console.log('App.onClientList');
  }
};

// 应用装饰描述符
const target = App.prototype; // 被装饰函数的类原型
const property = "onClientList"; // 被装饰函数名称
const decorators = [log]; // 装饰器数组
const descriptor = Object.getOwnPropertyDescriptor(App.prototype, "onClientList"); // 被装饰函数的对象描述符
const context = App.prototype;
applyDecoratedDescriptor(target, property, decorators, descriptor, context);

// 创建App实例
const app = new App();
app.onClientList();