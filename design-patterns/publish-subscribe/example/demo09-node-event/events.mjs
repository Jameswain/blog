// example/demo09-node-event/events.mjs
/**
 * 事件函数检查
 */
 function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw Error('你传入的不是一个函数');
  }
}

class Events {
  constructor() {
    /** 事件记录 */
    this.MAP_EVENTS = {};
  }
  /**
   * 订阅事件
   * @param {String} key 事件名称
   * @param {Function} listener 事件回调函数
   * @param {Boolean} once 是否触发一次后移除事件
   */
  on(key, listener, once = false) {
    checkListener(listener);
    if (this.MAP_EVENTS[key]) {
      this.MAP_EVENTS[key].push({ listener, once });
    } else {
      this.MAP_EVENTS[key] = [{ listener, once }];
    }
    return this.MAP_EVENTS;
  }
  /**
   * 订阅事件 - 只有第一次触发事件时被回调
   * @param {String} key
   * @param {Function} listener
   */
  once(key, listener) {
    checkListener(listener);
    this.on(key, listener, true);
  }
  /**
   * 取消订阅
   * @param {String} key 事件名称
   * @param {Function} listener 事件回调函数，匿名函数无效
   */
  off(key, listener) {
    if (!listener) {
      this.MAP_EVENTS[key] = [];
      return;
    }
    checkListener(listener);
    const arrEvents = this.MAP_EVENTS[key] || [];
    if (arrEvents.length) {
      // 移除事件是后进先出，后监听的事件会被先移除
      const index = arrEvents.lastIndexOf(e => e.listener === listener);
      this.MAP_EVENTS[key].splice(index, 1);
    } else {
      console.log(`你从来都没有订阅过${key}事件，所以你取消个🥚`);
    }
  }
  /**
   * 触发事件
   * @param {String} key 事件名称
   * @param  {...any} args 事件参数
   */
  emit(key, ...args) {
    const arrEvents = this.MAP_EVENTS[key] || [];
    // 执行事件是先进先出；先监听的事情会被先执行
    arrEvents.forEach(e => e.listener.call(this, ...args));
    // once事件触发后，都需要全部移除掉
    this.MAP_EVENTS[key] = arrEvents.filter(e => !e.once);
  }
}

// 默认事件对象，挂载在静态函数上
const defaultEvent = new Events();
Events.on = Events.prototype.on.bind(defaultEvent)
Events.once = Events.prototype.once.bind(defaultEvent)
Events.off = Events.prototype.off.bind(defaultEvent)
Events.emit = Events.prototype.emit.bind(defaultEvent)

export default Events;
