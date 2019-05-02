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

