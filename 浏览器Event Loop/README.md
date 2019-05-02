# 简介

​    我把JavaScript在浏览器中运行主要分为以下几种类型的任务：

- **同步任务（MainTask）  ：同步任务是指JavaScript按照正常顺序执行的代码，比如：函数调用，数值运算等等，只要是执行后立即能够得到结果的就是同步任务。**
- **宏任务   （MacroTask）：setTimeout、setInterval、I/O、UI渲染**    
- **微任务   （MicroTask） ：Promise、Object.obsever、MutationObsever**
- 用户交互事件（User Interaction Event）：点击事件onclick、键盘事件onkeywodn、鼠标事件onmouseover等等

# 执行顺序

![img](https://raw.githubusercontent.com/Jameswain/blog/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop/images/73205145.png)

**具体流程：**

1. 执行完主逻辑中的同步任务
2. 取出微任务队列（MicroTask Queue）中的任务执行，直到队列被完全清空
3. 取出宏任务队列（MacroTask Queue）中的一个任务执行。
4. 取出微任务队列（MicroTask Queue）中的任务执行，直到队列被完全清空
5. 重复 3 和 4，直到宏任务队列（MacroTask Queue）被清空。

![img](https://raw.githubusercontent.com/Jameswain/blog/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop/images/73784125.png)



## demo1：宏任务(MacroTask)和微任务(MicroTask)执行顺序

demo1.html

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>demo1：宏任务(MacroTask)和微任务(MicroTask)执行顺序</title>
</head>
<body>
    <script type="text/javascript">
        console.log('同步任务1 start');
        setTimeout(function () {
            console.log('宏任务1：setTimeout...');
        }, 0);
        Promise.resolve().then(function () {
            console.log('微任务1 Promise.then() 1')
        }).then(function () {
            console.log('微任务2 Promise.then() 2')
        });
        setTimeout(function () {
            console.log('宏任务2：setTimeout...');
            Promise.resolve().then(function () {
                console.log('宏任务2：setTimeout => 微任务 Promise.then()')
            });
        }, 0);
        setTimeout(function () {
            console.log('宏任务3：setTimeout...');
        }, 0);
        Promise.resolve().then(function () {
            console.log('微任务3 Promise.then() 1')
        }).then(function () {
            console.log('微任务3 Promise.then() 2')
        })
        console.log('同步任务2 end');
    </script>
</body>
</html>
```



运行结果：

![img](https://raw.githubusercontent.com/Jameswain/blog/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop/images/74485363.png)

以上代码详细的运行步骤队列图，我已经写成了PPT，大家可以下载打开看效果，可以详细了解每一段代码在队列中的样子：

[https://github.com/Jameswain/blog/tree/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop](https://github.com/Jameswain/blog/tree/master/浏览器Event Loop) 

![img](https://raw.githubusercontent.com/Jameswain/blog/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop/images/86305693.png)



## demo2：setInterval —— setTimeout的语法糖 

​    setInterval其实可以说是setTimeout的语法糖，因为setInterval能够实现的功能，setTimeout也能实现，下面通过一个小例子实现使用setTimeout实现setInterval的定时调度功能：

```javascript
function logic() {
    console.log(Date.now());
    setTimeout(logic, 1000);
}
logic();
```



## demo3：setInterval宏任务和微任务深入

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>demo1：setTimeout与setInterval</title>
</head>
<body>
    <div class="demo">demo</div>
    <script type="text/javascript">
        console.log('同步任务1 start');
        setInterval(() => {
            console.log('宏任务1：setInterval...');
            Promise.resolve().then(function () {
                console.log('宏任务1：setInterval => 微任务1 Promise.then()')
            });
            Promise.resolve().then(function () {
                console.log('宏任务1：setInterval => 微任务2 Promise.then()')
            });
            Promise.resolve().then(function () {
                console.log('宏任务1：setInterval => 微任务3 Promise.then()')
            });
        }, 3000);
        setTimeout(function () {
            console.log('宏任务2：setTimeout...');
        }, 0);
        // 微任务：监听DOM属性变化，当属性发生变化时触发回调函数
        const demo = document.querySelector('.demo');
        new MutationObserver(() => {
            console.log('MutationObserver Callback...');
        }).observe(demo, { attributes: true });

        Promise.resolve().then(function () {
            console.log('微任务1 Promise.then() 1')
            Promise.resolve().then(() => {
                console.log('微任务1-1 Promise.then() 1')
            });
            Promise.resolve().then(() => {
                console.log('微任务1-2 Promise.then() 2')
                Promise.resolve().then(() => {
                    console.log('微任务1-2-1 Promise.then() 1')
                });
            });
        });
        // 修改DOM元素属性，将回调变化回调函数放入微任务队列中
        demo.setAttribute('data-random', Math.random());
        console.log('同步任务2 end');
    </script>
</body>
</html>
```





**运行结果：**

![img](https://raw.githubusercontent.com/Jameswain/blog/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop/images/84362615.png)

​        从运行结果可以发现，JavaScript的代码在浏览器中的执行顺序是【同步任务】 => 【清空微任务队列】=>【宏任务】=> 【清空微任务队列】，如果在执行微任务时，又发现了微任务，它会把这个微任务放入到微任务队列的末尾。宏任务也一样，如果在执行宏任务的时候发现了宏任务，它也会把这个宏任务放入宏任务队列的末尾。

​        上代码详细的运行步骤队列图，我已经写成了PPT，大家可以下载打开看效果，可以详细了解每一段代码在队列中的样子：

[https://github.com/Jameswain/blog/tree/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop](https://github.com/Jameswain/blog/tree/master/浏览器Event Loop) 

![img](https://raw.githubusercontent.com/Jameswain/blog/master/%E6%B5%8F%E8%A7%88%E5%99%A8Event%20Loop/images/86305693.png)

**参考文档：**

[Tasks, microtasks, queues 和 schedules](https://hongfanqie.github.io/tasks-microtasks-queues-and-schedules/)

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

[浏览器和Node不同的事件循环（Event Loop）](https://segmentfault.com/a/1190000013660033)

















































































**浏览器运行机制**

​    浏览器中的异步事件主要有：ajax请求、setTimeout、setInterval、requestAnimationFrame、onload事件、DOMCOntentLoaded事件、用户点击、键盘事件等等；其中DOM相关事件和setTimeout、setInterval事件都比较特殊，它们都是在指定的条件下才会执行，并不是按照代码设置的顺序执行的。下面通过一段代码说明一下各个异步事件的运行机制：

**1、创建demo2.js文件，创建一个简单的http服务：**













 

```
const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'demo2.html'));
});

app.get('/user', (req, res) => {
    for (let i = 0; i < 10000000000; i ++) {}
    res.json({
        uid: 1001449,
        nick: '\t💫鸭💫鸭💫🐥🐥\t',
        sex: 1,
        level: 129,
        fans: 5607
    });
    console.log(req.url);
});

app.get('/list', (req, res) => {
    res.json([
        {
            uid: 1001449,
            nick: '\t💫鸭💫鸭💫🐥🐥\t',
            sex: 1,
            level: 129
        },
        {
            uid: 10000007,
            nick: '🌸爱侗',
            sex: 1,
            level: 99
        },
        {
            uid: 10000025,
            nick: '♋️7♋️',
            sex: 1,
            level: 80
        }
    ]);
    console.log(req.url);
});

app.listen(9000, () => {
    console.log('服务启动成功！');
});

```





**2、创建demo2.html文件，实现各类异步事件的调用**













 

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JavaScript运行机制</title>
    <style type="text/css">
        body {
            height: 800px;
        }
    </style>
</head>
<body>
    <button id="red">红色</button>
    <button id="green">绿色</button>
    <button id="blue">蓝色</button>
    <script type="text/javascript">
        (function(){
            window.$ = function () {}
            function ajax(method, url, success) {
                var r = new XMLHttpRequest();
                r.onreadystatechange = function() {
                    if(r.readyState == 4 && (r.status == 200 || r.status == 0))
                        success(JSON.parse(r.responseText));
                };
                r.open(method,url,true);
                r.setRequestHeader('X-Requested-With','XMLHttpRequest');
                r.send(null);
            }

            $.get = function(url, success){ ajax('GET', url, success); };
            $.post = function(url, success){ ajax('POST', url, success); };
            $.getJSON = function(url, success){
                $.get(url, function(json){ success(JSON.parse(json)) });
            };
        })();
    </script>
    <script type="text/javascript">
        setInterval(function () {
            console.log('setInterval...');
        }, 0);
        setTimeout(() => {
            console.log('setTimeout1...')
        }, 1000 * 60);   // 60秒后执行
        window.onload = function() {    // 页面包含图片等文件在内的所有元素都加载完成。
            console.log('onload before...');
            for (let i = 0; i < 9000000000; i ++) {}
            console.log('onload after...');
        }
        setTimeout(() => {
            console.log('setTimeout2...')
        }, 0);
        document.addEventListener('DOMContentLoaded', function () {     // dom结构加载完毕后执行
            console.log('DOMContentLoaded before...');
            for (let i = 0; i < 9000000000; i ++) {}
            console.log('DOMContentLoaded after...');
        });
        setTimeout(() => {
            console.log('setTimeout3 before...')
            for (let i = 0; i < 9000000000; i ++) {}
            console.log('setTimeout3 after...')
        }, 0);
        $.get('/user', function (res) {
            console.log('/user before => ', res);
            // for (let i = 0; i < 9000000000; i ++) {} // 阻塞下一个ajax请求的回调函数执行，下一个ajax请求函数会一只处于pending状态，直到这个回调函数的逻辑执行完毕。其实服务端早就返回
            console.log('/user after => ', res);
        });
        setTimeout(() => {
            console.log('setTimeout4...')
        }, 0);
        $.get('/list', function (res) {
            console.log('/list => ', res);
        });
        document.querySelector('#red').addEventListener('click', function (e) { // 点击事件监听
            console.log('red');
            document.querySelector('body').style.backgroundColor = 'red';
        });
        document.querySelector('#green').addEventListener('click', function (e) {
            console.log('green')
            document.querySelector('body').style.backgroundColor = 'green'; // 异步的，颜色会等主逻辑代码全部执行完毕后才变化
            console.log(document.querySelector('body').style.backgroundColor);
            for (let i = 0; i < 5000000000; i ++) {}
        });
        document.querySelector('#blue').addEventListener('click', function (e) {
            console.log('blue')
            document.querySelector('body').style.backgroundColor = 'blue';
        });
        Promise.resolve({name: 'wen'}).then(res => {
            console.log('1.promise...', res);
        });
        const rafcb = function() {
            console.log('requestAnimationFrame...');
            requestAnimationFrame(rafcb);
        }
        requestAnimationFrame(rafcb);
        Promise.resolve({name: 'wen'}).then(res => {
            console.log('2.promise...', res);
            for (let i = 0; i < 5000000000; i ++) {}
        });
        for (let i = 0; i < 3000000000; i ++) {}
        console.log('main logic .....')
    </script>
</body>
</html>
```





**运行结果：**



​        从运行结果，通过运行结果我们可以发现，当主逻辑执行完毕后，会立即按照代码顺序执行ajax异步队列中的内容，/user 回调函数中有大量的逻辑，会阻塞后面的ajax请求回调函数，它会让后面的/list请求一直处于pending状态。实际上/list接口服务端早就返回结果了，只是它被/user回调函数中的逻辑给阻塞住了，所以它会一直等，直到/user回调函数的逻辑执行完毕。ajax异步队列的内容执行完毕后，会立即执行DOMContentLoaded回调函数，如果该回调函数中有大量的计算逻辑，它也会阻塞后面的setTimeout和onload的执行。如果setTimeout中有大量的计算逻辑，也会阻塞onload回调函数的执行。不管是主逻辑还是setTimeout、setInterval、DOMContentLoaded、onload、ajax的回调函数中如果存在大量的计算逻辑都会阻塞掉对方的执行，而且页面是无法监听用户操作的，用户无法对按钮进行点击等一系列用户行为操作。

​        总结一下浏览器的执行顺序是：主逻辑 => ajax异步请求 => DOMContentLoaded => setTimeout(fn, 0) => onload => 用户行为事件（点击、键盘输入、鼠标移动、touch）。下面通过一幅运行流程图看一下上述代码的运行过程：



**参考文档：**
[Tasks, microtasks, queues 和 schedules](https://hongfanqie.github.io/tasks-microtasks-queues-and-schedules/)

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

