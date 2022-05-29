// example/demo08-android-call-javascript/src/bridge.js
const bridge = {
  MAP_CALLJS: {},
  /**
   * 监听事件
   */
  on(type, fn) {
    if (this.MAP_CALLJS[type]) {
      this.MAP_CALLJS[type].push(fn)
    } else {
      this.MAP_CALLJS[type] = [fn];
    }
    console.log('this.MAP_CALLJS: ', this.MAP_CALLJS);
  },
  /**
   * 触发函数
   * @param {*} type 
   */
  emit(type, param) {
    if (!this.MAP_CALLJS[type]) return;
    this.MAP_CALLJS[type].forEach(fn => fn(param));
  }
}

window.callJs = ({ type, param }) => bridge.emit(type, param);

export default bridge;