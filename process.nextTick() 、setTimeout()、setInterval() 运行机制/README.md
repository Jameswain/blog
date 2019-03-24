JavaScript是一个单线程的语言，也就是说它同一时间只能执行一段代码，接下来我们通过两个例子说明一下单线程语言和多线程语言的区别。

## setTimeout()

**setTimeout 代码单线程运行机制：**

```javascript
/**
 * setTimeout 执行是要等主线线程的流程执行完毕之后才会进行，并且按照setTimeout设置的顺序进行排队执行。
 * 如果某一个setTimeout进行大量的计算，那么它就会阻塞在当前的setTimeout回调函数中，等待该计算完成后，再执行下一个setTimeout的回调函数。
 */

setTimeout(() => {
    console.log('setTimeout - a');
},0);
console.log(1);
console.log(2);
setTimeout(() => {
    for (let i = 0; i < 10000022200; i++){}
    console.log('setTimeout - b');
},0);
console.log(3);
setTimeout(() => {
    console.log('setTimeout - c');
},0);
console.log(4);
setTimeout(() => {
    console.log('setTimeout - d');
},0);
console.log(5);

for (let i = 0; i < 10000222200; i++) {}        //25：一直等待它执行完毕后，才会执行setTimeout的回调。
```

![img](https://raw.githubusercontent.com/Jameswain/blog/master/process.nextTick()%20%E3%80%81setTimeout()%E3%80%81setInterval()%20%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/imgs/762547.png)

​        从运行结果上可以看出，虽然setTimeout - a 是写在代码当最开头，延时时间也为0，但是，它并没有立即执行；而是等主逻辑的代码执行完毕后才进行调用的，当代码运行到25行的时候，由于这里有一个长长的循环，所以这里会阻塞等待一段时间，才会运行到第一个setTimeout。setTimeout的运行顺序是根据你代码中编写的顺序和延时时间决定的，下面通过一张图来说明上述代码的运行机制：

![img](https://raw.githubusercontent.com/Jameswain/blog/master/process.nextTick()%20%E3%80%81setTimeout()%E3%80%81setInterval()%20%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/imgs/452d9c2b-0edf-48b4-b51d-71ccabd4a60e.png)

​        从运行结果中，可以看出如果主逻辑代码没有执行完毕，setTimeout的回调函数是永远不会触发的，这就是单线程，它同一时间只能做一件事。

​        **注意：如果主逻辑的代码执行时间已经超过了setTimeout第二个参数设置的timeout时间，那么等运行到该回调函数时，它会忽略掉这个时间，并立即执行。下面通过一段代码进行验证：

```javascript
/**
 * setTimeout 执行是要等主线线程的流程执行完毕之后才会进行，并且按照setTimeout设置的顺序进行排队执行。
 * 如果某一个setTimeout进行大量的计算，那么它就会阻塞在当前的setTimeout回调函数中，等待该计算完成后，再执行下一个setTimeout的回调函数。
 *
 * 执行顺序：即使setTimeout放在最前面执行，它也是等到主线程执行完毕后，才运行，这就是单线程运行机制。
 * setTimeout中的第二个参数timeout这个延时时间，是一个相对时间，如果主线程运行的时间，已经超过了这个时间，那么执行到这个setTimeout的时候，会忽略这个时间，直接调用函数。
 */

setTimeout(() => {
    console.log('setTimeout - a');
},0);
setTimeout(() => {
    for (let i = 0; i < 10000022200; i++){}
    console.log('setTimeout - b');
},0);
setTimeout(() => {
    console.log('setTimeout - c');
},0);
setTimeout(() => {
    console.log('setTimeout - d');
},10000);

console.log(1);
console.log(2);
console.log(3);
console.log(4);
console.log(5);

for (let i = 0; i < 10000222200; i++) {}        //一直等待它执行完毕后，才会执行setTimeout的回调。
```

![img](https://raw.githubusercontent.com/Jameswain/blog/master/process.nextTick()%20%E3%80%81setTimeout()%E3%80%81setInterval()%20%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/imgs/46885403.png)

从上述运行结果可以看出，即使setTimeout放在主逻辑到最前边，但是它依然是要等到主逻辑到代码完全执行完毕后才执行。

由于29行有大量的循环逻辑，主逻辑大概会阻塞20秒钟左右，所以当调用到19行的setTimeout的回调函数时，会忽略掉它设置timeout参数，并立即执行该回调函数。



下面我们通过一段Java的代码演示一下多线程，以此说明一下单线程与多线程的区别：

**Java多线程代码运行机制：**

```java
public class Main {
    public static void main(String[] args) {
        // 控制台打印输出
        System.out.println("1");
        // 启动一个线程
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("线程1 before");
                for(int i = 0; i < 2099222220L; i++) {}
                System.out.println("线程1 after");
            }
        }).start();
        // 控制台打印输出
        System.out.println("2");
        // 启动一个线程
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("线程2");
            }
        }).start();
        // 控制台打印输出
        System.out.println("3");
        // 通过一个大的循环阻塞主线程一段时间，看看会不会影响线程的运行
        for(int i = 0; i < 2099222220L; i++) {}
        // 控制台打印输出
        System.out.println("4");
    }
}
```

![img](https://raw.githubusercontent.com/Jameswain/blog/master/process.nextTick()%20%E3%80%81setTimeout()%E3%80%81setInterval()%20%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/imgs/3722023.png)

从运行结果上可以看出，多线程的语言，主线程与子线程之间是完全相互独立的，即使主线程中存在大量的计算逻辑，也不会阻塞子线程的运行；子线程之间也是相互独立的，例如：线程1中存在大量计算逻辑并不会影响线程2的正在执行。

Java默认的子线程执行顺序是由cpu随机调度的，上述的线程1启动后，cpu就没有马上调度到它。



**process.nextTick()**

​        process.nextTick() 是Node.js提供的一个异步执行函数，它不是setTimeout(fn, 0)的别名，它的效率更高，它的执行顺序要早于setTimeout和setInterval，它是在主逻辑的末尾任务队列调用之前执行。下面通过一段代码进行验证：

```javascript
/**
 * 执行顺序：主线程逻辑 => nextTick => setTimeout
 *
 */
console.log(1);
setTimeout(() => console.log('setTimeout=> 1'),0);
process.nextTick(() => console.log('nextTick=> 1'));
console.log(2);
setTimeout(() => console.log('setTimeout=> 2'),0);
process.nextTick(() => {
    console.log('nextTick=> 2');
    for (let i = 0; i < 10000222200; i++) {}    //一直等待它执行完毕后，才会执行下一个nextTick()和之后的任务队列中的回调函数
});
console.log(3);
process.nextTick(() => console.log('nextTick=> 3'));
setTimeout(() => console.log('setTimeout=> 3'),0);
console.log(4);
setTimeout(() => console.log('setTimeout=> 4'),0);
process.nextTick(() => console.log('nextTick=> 4'));
console.log(5);

for (let i = 0; i < 10000222200; i++) {}        //一直等待它执行完毕后，才会执行nextTick和setTimeout的回调。
```





![img](https://raw.githubusercontent.com/Jameswain/blog/master/process.nextTick()%20%E3%80%81setTimeout()%E3%80%81setInterval()%20%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/imgs/70262924.png)

从运行结果中我们可以发现，即使setTimeout设置的时机要早于process.nextTick()，但是process.nextTick()的执行时机还是要早于setTimeout，这就证明是了process.nextTick() 的执行时机是在任务队列调用之前进行执行的。



## setInterval()

​        setInterval() 是一个定时器函数，可按照指定的周期（以毫秒计）来不断调用函数或计算表达式。但是由于JavaScript是一个单线程的语言，所以这个定时器的指定的周期回调时间，并不准确；下面通过一段代码来说明一下：

```javascript
/**
 * setInterval 也是要等待主线程执行完毕后，才会进行调用, 如果timeout时间一样，就按照setInterval设置的顺序进行执行。
 * 如果有一个setInterval回调函数中有大量的计算，那么线程就阻塞在这个回调函数里，其他的setInterval也会等到这个回调执行完毕后才会调用。
 */

console.log('main => 1');
setInterval(() => {
    console.log('setInterval=> 2 before');
    for (let i = 0; i < 10022222220; i++) {}    // 此处会阻塞一段时间，等待计算完毕后才会执行下一个setInterval的回调。
    console.log('setInterval=> 2 after');
}, 1000);
setInterval(() => {
    console.log('setInterval=> 1');
}, 1000);
console.log('main => 2');

for (let i = 0; i < 1002222200; i++) {}     // 此处主逻辑会阻塞一段时间进行循环计算，只有主逻辑代码执行完毕后才会调用setInterval
```

![img](https://raw.githubusercontent.com/Jameswain/blog/master/process.nextTick()%20%E3%80%81setTimeout()%E3%80%81setInterval()%20%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6/imgs/71471274.png)

​        上述代码中同时启动了两个setInterval() 并且它们的回调周期时间都为1000毫秒， 但是从运行结果中我们可以发现这俩setInterval()的回调周期时间远远超出了1000毫秒；造成这种情况的主要有两个地方：

​        第一是在代码的第17行，这里有一个很大的循环计算，它的循环时间远远超过了1000毫秒，所以这俩setInterval只能等主逻辑的代码执行完毕后才能执行。

​        第二是在代码的第9行，在第一个setInterval里也有一个很大的循环计算，它的循环时间也超过了1000毫秒，所以第二个setInterval的回调函数也必须要等待前一个setInterval执行完毕后才能进行调用。

​        由此我们可以得出一个结论：setInterval()的执行时机是在主逻辑执行完毕之后，它的执行顺序是根据回调周期的时间和设置的顺序进行调用，同一时间只会执行一个setInterval的回调函数，只有等待上一个setInterval回调函数执行完毕后，才能执行下一个setInterval的回调函数。
