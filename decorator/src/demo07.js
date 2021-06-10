// @ts-nocheck
// src/demo07.js
// Object.getOwnPropertyDescriptor - 获取指定对象上一个自有属性对应的属性描述符
const obj = {
  onClientList() { },
  onClick: () => {}
};

class App {
  onClientList() { }
  onClick = () => {}
}

console.log('obj:', Object.getOwnPropertyDescriptor(obj, 'onClientList'));
console.log('App:', Object.getOwnPropertyDescriptor(App.prototype, 'onClientList'));

console.log('obj:', Object.getOwnPropertyDescriptor(obj, 'onClientList'));
console.log('App:', Object.getOwnPropertyDescriptor(App.prototype, 'onClick'));

console.log(Object.getOwnPropertyDescriptor(App.prototype, 'onClientList') === Object.getOwnPropertyDescriptor(App.prototype, 'onClientList'))

