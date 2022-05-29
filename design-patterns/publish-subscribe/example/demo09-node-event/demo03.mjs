// example/demo09-node-event/demo03.mjs
import Events from './events.mjs';

Events.on('coding', (...param) => {
  console.log('懒人 on coding => ', ...param);
})

Events.once('coding', (...param) => {
  console.log('懒人 once-coding => ', ...param);
})

Events.emit('coding', '张三');
console.log('============================');
Events.emit('coding', '李四');
console.log('============================');
Events.emit('coding', '王五');
console.log('============================');


// 除了使用使用静态函数，还可以创建一个新的事件对象，事件名称一样也不会冲突，互相隔离
const e1 = new Events();
e1.on('coding', (name) => {
  console.log('e1-on-coding', name);
});

e1.once('coding', (name) => {
  console.log('e1-once-coding', name);
});

e1.emit('coding', 'Ice King');
console.log('============================');
e1.emit('coding', 'Simon King');
console.log('============================');
e1.emit('coding', 'Alex King');
console.log('============================');

