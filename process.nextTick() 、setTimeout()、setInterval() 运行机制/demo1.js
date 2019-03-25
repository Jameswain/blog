const fs = require('fs');
const path = require('path');

// 异步读取文件
fs.readFile(path.resolve(__dirname,'README.md'), (err, data) => {
    console.log('readFile1 =>', data);  // 异步操作的内容都会被放入任务队列中，等主逻辑执行完毕后再进行执行
    for (let i = 0; i < 10000000002; i ++) {}       //阻塞任务队列，等该队列的内容执行完毕后才会执行下一个队列的回调
});
// 异步读取文件
fs.readFile(path.resolve(__dirname, '..', 'package-lock.json'), (err, data) => {
    console.log('readFile2 =>', data.toString());
});

// 主逻辑末尾执行，比任务队列先执行
process.nextTick(() => {
    console.log('process.nextTick => 111');
    for (let i = 0; i < 10000000002; i ++) {}       //阻塞主逻辑末尾队列
});
// 主逻辑末尾执行，比任务队列先执行
process.nextTick(() => {
    console.log('process.nextTick => 222');
});


console.log('main logic 1....');
for (let i = 0; i < 10000000002; i ++) {}       //阻塞主线程
console.log('main logic 2....');


/**
 * 异步操作内容都会被放入任务队列中，等主逻辑中的同步代码执行完毕后，才会按顺序执行任务队列中的内容，
 * 如果某一个任务队列中有大量的计算，那它就会等到该对象内容执行完毕，才会执行下一个队列的内容。
 */

