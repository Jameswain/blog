// example/demo09-node-event/demo01.mjs
import EventEmitter from 'events';

const emitter = new EventEmitter();

emitter.once('a', e => {
  console.log('1once.a', e);
});

emitter.on('a', e => {
  console.log('a1', e);
});

function callback() {
  console.log('a callback');
}
emitter.on('a', callback);
emitter.on('a', callback);
emitter.once('a', callback);
emitter.off('a', callback);

emitter.once('a', e => {
  console.log('2once.a', e);
});

emitter.once('a', e => {
  console.log('3once.a', e);
});

emitter.on('a', e => {
  console.log('a2', e);
});

emitter.emit('a', 'emit发出事件1');
console.log('==================');
emitter.emit('a', 'emit发出事件2');
console.log('==================');
emitter.emit('a', 'emit发出事件3')
console.log('==================');
emitter.emit('a', 'emit发出事件4');
console.log('==================');
emitter.emit('a', 'emit发出事件5');
console.log('==================');
emitter.emit('a', 'emit发出事件6');