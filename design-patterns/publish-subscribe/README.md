# 什么是设计模式？

* 设计模式（Design pattern）代表了最佳的实践，通常被有经验的面向对象的软件开发人员所采用。设计模式是软件开发人员在软件开发过程中面临的一般问题的解决方案。这些解决方案是众多软件开发人员经过相当长的一段时间的试验和错误总结出来的。
* 在 1994 年，由 Erich Gamma、Richard Helm、Ralph Johnson 和 John Vlissides 四人合著出版了一本名为 **Design Patterns - Elements of Reusable Object-Oriented Software（中文译名：设计模式 - 可复用的面向对象软件元素）** 的书，该书首次提到了软件开发中设计模式的概念。四位作者合称 **GOF（四人帮，全拼 Gang of Four）**。
* 设计模式其实是一种解决方案、一种编程套路、一种解决问题的思想，并不是具体的代码，代码只是它具体的实现，它跟编程语言无关，框架无关，你可以用JavaScript实现、也可以是Go实现、你可以在Vue里用，也可以在React里用。
* **特别注意：["使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性、程序的重用性。"](https://baike.baidu.com/item/%E8%BD%AF%E4%BB%B6%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/2117635?fromtitle=%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F&fromid=1212549&fr=aladdin)如果你不能满足这个前提，那就不要用，一定要根据业务场景去选择合适的设计模式，不要生搬硬套。**

> 📢 文本所有代码都是用node v17.8.0 版本进行开发和运行；使用pnpm包管理进行依赖管理和安装；

# 什么是发布订阅？

* 发布订阅其实就是一个事件模型，平时咱们前端开发常用的事件监听，其实就是一个发布订阅模式；它把一些列用户监听(订阅)的事件收集起来，然后当用户点击监听(订阅)的按钮时，就触发(发布)该事件的所有监听(订阅)函数;
* 咱们的公众号也是发布订阅模式；关注(订阅)一个公众号，当这个公众号有新文章发布时，所有关注这种公众号的用户都能收到新文章发布的消息！
* 下面我们来看一个平时开发中最常见的发布订阅例子：
```html
<!-- example/demo01-default-event.html-->
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>发布订阅 - 事件监听</title>
</head>
<body>
  <div id="click-me" style="border: 1px solid green; width: 300px; height: 300px">点我</div>
  <script>
    const div = document.querySelector('#click-me');
    // 监听（订阅）点击事件，当用户点击这个元素时调用这个函数
    div.addEventListener('click', e => {
      console.log('点我', e)
    });

    // 监听(订阅)点击时间，多次订阅，点击时，会触发这个元素所有的订阅事件
    div.addEventListener('click', e => {
      console.log('点我 第2个订阅时间', e)
    })
  </script>
</body>
</html>
```
* 运行结果：

![image-20220425230355831](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220425230355831.png)

* 可以发现，发布订阅其实是我们前端最早接触到的设计模式，也是最最常用的设计模式；像`click`或者`keydown`这种都是浏[览器内置定义好的事件](https://developer.mozilla.org/zh-CN/docs/Web/Events#%E6%9C%80%E5%B8%B8%E8%A7%81%E7%9A%84%E7%B1%BB%E5%88%AB)，只有点击元素或者按下键盘时才会触发！
* 如果说我想弄一个浏览器没有定义的事件行不行？当然可以，因为浏览器是支持自定义事件的，下面通过例子演示一下如何使用浏览器的自定义事件：
```html
<!-- example/demo02-custom-event.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>发布订阅 - 浏览器自定义事件</title>
</head>
<body>
  <script>
    document.addEventListener('jameswain', function (e) {
      console.log('事件触发了', e, this);
    });

    document.addEventListener('jameswain', function (e) {
      console.log('第二次订阅，事件触发了', e, this);
    });


    // 控制台调用此函数触发
    function triggrtCustomEvent() {
      // 触发事件
      const event = new CustomEvent('jameswain', { detail: { tips: '我是事件自定义参数', age: 18 } });
      document.dispatchEvent(event);
    }
  </script>
</body>
</html>
```
**运行结果：**

![image-20220425230411062](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220425230411062.png)

通过上述两个例子可以发现，如果要在浏览器内使用发布订阅模式，直接使用浏览器的自定义事件即可，无需引入三方库和自己造轮子了；但是缺点就是移植性差，你只能在支持`CustomEvent`的浏览器中使用，你无法将你的代码移植到Node环境中或者不支持`CustomEvent`的小程序环境中使用。
![image-20220425230540918](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220425230540918.png)
通过[caniuse](https://caniuse.com/?search=CustomEvent)可以发现，各大浏览器厂商从2011年开始陆续支持`CustomEvent`到2013年基本当时所有主流的浏览器都支持了，后面像Edge这种新浏览器从2015年推出的第一个版本就支持了；2013~2022至今9年时间，所以大家可以放心大胆使用了。

# 发布订阅的应用场景
通过上述的两个小例子，咱们基本上已经了解了什么是发布订阅模式了；咱们先忘掉那些高深的概念，先记住发布订阅如何使用，用一句话来记住它的用法:"先订阅(监听)事件，然后发布(触发)事件"就这么简单，但是上述的两个小例子并不能完全展示发布订阅的真正威力，下面我通过一系列的应用场景来展示一下发布订阅的真正威力。

## 跨IFrame传递数据
我们日常工作中经常会遇到一种情况，需要在一个系统里面通过iframe嵌入其他域名下的某个页面；这时候两个系统之间的数据通讯，我们也可以通过发布订阅的方式进行，下面通过一个简单的例子演示一下：
* 被嵌入的iframe页面：
```html
<!-- example/demo03-iframe/iframe.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>我是iframe页面</title>
    <style>
        body {
            text-align: center;
        }
        h4 {
            text-align: center;
        }
        #text {
            width: 100%;
        }
        #send-data {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h4>我是iframe</h4>
    <textarea id="text" rows="4" ></textarea>
    <button id="send-data">发送数据到主index.html页面中</button>
    <script>
        const text = document.querySelector('#text');
        const btnSendData = document.querySelector('#send-data');
        btnSendData.addEventListener('click', () => {
            const content = text.value;
            top.document.dispatchEvent(new CustomEvent('iframe-data', { detail: { content } }));
        });
    </script>
</body>
</html>
```
* 主页面：
```html
<!-- example/demo03-iframe/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>主页面</title>
    <style>
        .main {
            width: 100%;
            border: 1px solid black;
            text-align: center;
        }

        .iframe {
            text-align: center;
            margin-top: 100px;
            width: 100%;
            border: 1px dotted orange;
        }
        .iframe iframe {
            width: 100%;
            height: 300px;
        }
    </style>
</head>
<body>
    <div class="main">
        <h4>我是主页面index</h4>
        <p>以下内容是从iframe中通过发布订阅模式传递过来的：</p>
        <div id="content"></div>
    </div>
    <div class="iframe">
        <iframe src="iframe.html"></iframe>
    </div>
    <script>
        const content = document.querySelector('#content');
        document.addEventListener('iframe-data', (e) => {
            content.innerHTML = e.detail.content;
        });
    </script>
</body>
</html>
```
** 运行结果：**
![image.png](https://segmentfault.com/img/bVcY3C8)
* 通过上述代码可以发现，我们通过在`index.html`中订阅一个`iframe-data`自定义事件，然后在`iframe.html`页面中发布`iframe-data`事件通过参数将数据传递给主页面上！
* 此时有的同学会说，你通过`top.document.querySelector('#content').innerHTML`进行修改元素的内容不就可以了吗？为什么非要使用发布订阅这种模式呢？当前这个例子的场景下是可以的，而且更加简单；但是如果说`index.html`页面是使用`vue`编写的而且`div#content`渲染时机还不确定，`iframe.html`页面是使用`React`编写的；这个时候你用`top.document.querySelector('#content')`就会找不到元素了，下面通过例子模拟演示一下：

**被嵌入的iframe页面：**

```html
<!-- example/demo04-iframe-async/iframe.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>我是iframe页面</title>
    <style>
        body {
            text-align: center;
        }
        h4 {
            text-align: center;
        }
        #text {
            width: 100%;
        }
        #send-data {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h4>发布者：我是iframe，用React编写的</h4>
    <textarea id="text" rows="4" ></textarea>
    <button id="send-data">发送数据到主index.html页面中</button>
    <script>
        const text = document.querySelector('#text');
        const btnSendData = document.querySelector('#send-data');
        btnSendData.addEventListener('click', () => {
            const content = text.value;
            top.document.dispatchEvent(new CustomEvent('iframe-data', { detail: { content } }));
        });
    </script>
</body>
</html>
```
**主页面：**

```html
<!--  example/demo04-iframe-async/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>主页面</title>
    <style>
        .main {
            width: 100%;
            border: 1px solid black;
            text-align: center;
        }

        .iframe {
            text-align: center;
            margin-top: 100px;
            width: 100%;
            border: 1px dotted orange;
        }
        .iframe iframe {
            width: 100%;
            height: 300px;
        }
    </style>
</head>
<body>
    <div class="main">
        <h4>订阅者：我是主页面index，用Vue写的，content元素10秒后才会被插入</h4>
        <p>以下内容是从iframe中通过发布订阅模式传递过来的：</p>
    </div>
    <div class="iframe">
        <iframe src="iframe.html"></iframe>
    </div>
    <script>
        const insertReault = new Promise(resolve => {
            // 10秒以后才会插入元素
            setTimeout(() => {
                const content = document.createElement('div');
                content.setAttribute('id', 'content');
                document.querySelector('.main').appendChild(content);
                resolve();
            }, 10 * 1000);
        });
        document.addEventListener('iframe-data', async (e) => {
            // 等content元素插入后，再更新内容
            await insertReault;
            const content = document.querySelector('#content');
            content.innerHTML = e.detail.content;
        });
    </script>
</body>
</html>
```
**运行结果：**

![Apr-10-2022 18-21-09.gif](https://segmentfault.com/img/bVcY3EV)
感受到发布订阅的威力了吗？`发布者`不需要关心`订阅者`的业务逻辑，老子才不管你的dom元素啥时候渲染，我只管触发事件把数据传给你`订阅者`；至于`订阅者`你怎么使用或啥时候使用这个数据我不管，你什么业务逻辑我也不管；

## React跨组件之间传递数据

![image-20220426164205969](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220426164205969.png)

* 在说跨组件传递数据之前，我们先来看一下上述这张组织架构图，皇帝要下达一条消息，都是通过丞相层层传递到各级官员的；亭长要上报一条消息给皇帝，也得层层上报，才能到皇帝耳朵里。这种方式最大的问题消息传递链路很长，消息可能会被劫持不报，传丢了，下面我们通过代码来演示一下上述效果：

```jsx
// example/demo05-passing-data-across-components/src/donot-use-publish-subscribe.jsx
// @ts-nocheck
import React from "react";
import './app.css'

function 亭长(props) {
  return <div className="col">
    亭长{props.shengzhi ? ': 卑职明白' : ''}
    { props.shengzhi ? '' : <span className="shangzouze" onClick={() => props.上奏折('皇上，郎中令那个王八蛋抢了我老婆!')}>上奏折</span> }
  </div>
}

function 乡(props) {
  return <div>
    <div className="col">乡{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <亭长 {...props} />
    </div>
  </div>
}

function 县令(props) {
  return <div>
    <div className="col">县令{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <乡 {...props} />
    </div>
  </div>
}

function 郡守(props) {
  return <div>
    <div className="col">郡守{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <县令 {...props} />
    </div>
  </div>
}

function 少府(props) {
  return <div className="col">少府{props.shengzhi ? ': 卑职明白' : ''}</div>
}

function 郎中令(props) {
  return <div>
    <div className="col">郎中令{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <郡守 {...props} />
    </div>
  </div>
}

function 宗正(props) {
  return <div className="col">宗正{props.shengzhi ? ': 卑职明白' : ''}</div>
}


function 御史大夫(props) {
  return <div className="col">御史大夫{props.shengzhi ? ': 卑职明白' : ''}</div>
}

function 丞相(props) {
  return <div>
    <div className="col">丞相{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <少府 {...props} />
      <郎中令 {...props} />
      <宗正 {...props} />
    </div>
  </div>
}

function 太尉(props) {
  return <div className="col">太尉{props.shengzhi ? ': 卑职明白' : ''}</div>
}

export default class 皇帝 extends React.Component {
  state = {
    shengzhi: '',
    zhouze: ''
  }

  render() {
    return  <>
      <div className="col huangdi">
        皇帝
        { this.state.zhouze ? ': 大胆郎中令,你竟敢干出如此伤天害理之事!' : '' }
        <span className="shengzhi" onClick={this.下圣旨}>下圣旨</span>
      </div>
      <div className="row">
        <御史大夫 {...this.state} />
        <丞相 {...this.state} 上奏折={this.上奏折} />
        <太尉 {...this.state} />
      </div>
    </>
  }

  下圣旨 = () => {
    this.setState({ shengzhi: '朕要大赦天下' });
  }

  上奏折 = (奏折内容) => {
    this.setState({ zhouze: 奏折内容 })
  }
}
```

> 📢 注意: 上述代码是为了让大家能够更加清晰的看清楚这个组织架构，所以故意用的中文命名，实际开发中大家千万不要用中文命名挑战JavaScript的底线。

​		通过上述代码我们可以发现，每个组件之间传递数据都是通过props进行的，有很多的`props`，但凡有一点疏忽，把`props`传丢了，那么我们这个组件就接收不到数据了。		![image-20220426165247428](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220426165247428.png)

​		而且按照这种层层上报的机制，在上述古代官员的组织架构层级中就会存在一个问题，`亭长`他想跟`皇帝`告发`郎中令`抢了他老婆的这个禽兽行为，层层上报的话，它一定会经过这个`郎中令`的，到`郎中令`这里只有他不想死，那么他一定不会在往上传递了。如果此时亭长还想告发郎中令的禽兽行为，应该怎么办呢？还有条途径就是告御状，告御状跟咱们的发布订阅有着异曲同工之妙，相当于建立了一条亭长跟皇帝的专属通道，亭长可以直通皇帝，下面我们来看代码：

```jsx
// example/demo05-passing-data-across-components/src/use-publish-subscribe.jsx
// @ts-nocheck
import React from "react";
import './app.css'

function 亭长(props) {
  return <div className="col">
    亭长{props.shengzhi ? ': 卑职明白' : ''}
    { props.shengzhi ? '' : <span className="shangzouze" onClick={() => document.dispatchEvent(new CustomEvent('告御状', { detail: { zhouze: '皇上，郎中令那个王八蛋抢了我老婆!' }}))}>上奏折</span> }
  </div>
}

function 乡(props) {
  return <div>
    <div className="col">乡{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <亭长 {...props} />
    </div>
  </div>
}

function 县令(props) {
  return <div>
    <div className="col">县令{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <乡 {...props} />
    </div>
  </div>
}

function 郡守(props) {
  return <div>
    <div className="col">郡守{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <县令 {...props} />
    </div>
  </div>
}

function 少府(props) {
  return <div className="col">少府{props.shengzhi ? ': 卑职明白' : ''}</div>
}

function 郎中令(props) {
  return <div>
    <div className="col">郎中令{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <郡守 {...props} />
    </div>
  </div>
}

function 宗正(props) {
  return <div className="col">宗正{props.shengzhi ? ': 卑职明白' : ''}</div>
}


function 御史大夫(props) {
  return <div className="col">御史大夫{props.shengzhi ? ': 卑职明白' : ''}</div>
}

function 丞相(props) {
  return <div>
    <div className="col">丞相{props.shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <少府 {...props} />
      <郎中令 {...props} />
      <宗正 {...props} />
    </div>
  </div>
}

function 太尉(props) {
  return <div className="col">太尉{props.shengzhi ? ': 卑职明白' : ''}</div>
}

export default class 皇帝 extends React.Component {
  state = {
    shengzhi: '',
    zhouze: ''
  }

  componentDidMount() {
     // 接收御状消息
     document.addEventListener('告御状', (e) => {
       this.setState({ zhouze: e.detail.zhouze })
    });
  }

  render() {
    return  <>
      <div className="col huangdi">
        皇帝
        { this.state.zhouze ? ': 大胆郎中令,你竟敢干出如此伤天害理之事!' : '' }
        <span className="shengzhi" onClick={this.下圣旨}>下圣旨</span>
      </div>
      <div className="row">
        <御史大夫 {...this.state} />
        <丞相 {...this.state} />
        <太尉 {...this.state} />
      </div>
    </>
  }

  下圣旨 = () => {
    this.setState({ shengzhi: '朕要大赦天下' });
  }
}
```

![image-20220426172812491](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220426172812491.png)

* 通过上述代码我们可以发现，使用发布订阅模式亭长直接就把奏折消息传递给皇帝了，没有经过任何的其他组件，这就是发布订阅的威力；

## redux与发布订阅的区别		

​		这里有的同学会问有一个redux的东西也可以实现跨组件共享数据，这个跟发布订阅有什么区别呢？其实最本质的区别是redux是跨组件`共享数据`，把各个组件需要用到的数据，统一放到store里，所有组件都有能获取这里面的数据，也都有资格修改这里面的数据。

​		发布订阅只是传递数据，它并没有存储数据、修改数据的能力，它能够帮你无视掉各个组件之间的层级关系，直接把数据传递过去；你只要知道事件名称就可以了，真正存储数据修改数据还是在组件的本身，下面我们通过代码来看一下用redux实现上述组织架构的跨组件共享数据：

```jsx
// example/demo05-passing-data-across-components/src/use-react-redux.jsx
// @ts-nocheck
import React from "react";
import { Provider, useSelector, connect } from 'react-redux';
import store from './store';
import { reduxShangZhouZe, reduxXiaShengZhi } from './store/action';
import './app.css'

function 亭长() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">
    亭长{shengzhi ? ': 卑职明白' : ''}
    { shengzhi ? '' : <span className="shangzouze" onClick={() => reduxShangZhouZe('皇上，郎中令那个王八蛋抢了我老婆!')}>上奏折</span> }
  </div>
}

function 乡() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">乡{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <亭长 />
    </div>
  </div>
}

function 县令() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">县令{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <乡 />
    </div>
  </div>
}

function 郡守() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">郡守{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <县令 />
    </div>
  </div>
}

function 少府() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">少府{shengzhi ? ': 卑职明白' : ''}</div>
}

function 郎中令() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">郎中令{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <郡守 />
    </div>
  </div>
}

function 宗正() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">宗正{shengzhi ? ': 卑职明白' : ''}</div>
}


function 御史大夫() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">御史大夫{shengzhi ? ': 卑职明白' : ''}</div>
}

function 丞相() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div>
    <div className="col">丞相{shengzhi ? ': 卑职明白' : ''}</div>
    <div className="row">
      <少府 />
      <郎中令 />
      <宗正 />
    </div>
  </div>
}

function 太尉() {
  const shengzhi = useSelector(state => state.shengzhi)
  return <div className="col">太尉{shengzhi ? ': 卑职明白' : ''}</div>
}

@connect(state => state)
class 皇帝 extends React.Component {
  render() {
    return <>
      <div className="col huangdi">
        皇帝
        { this.props.zhouze ? ': 大胆郎中令,你竟敢干出如此伤天害理之事!' : '' }
        <span className="shengzhi" onClick={this.下圣旨}>下圣旨</span>
      </div>
      <div className="row">
        <御史大夫 />
        <丞相 />
        <太尉 />
      </div>
    </>
  }

  下圣旨 = () => {
    reduxXiaShengZhi('朕要大赦天下');
  }
}

export default () => <Provider store={store}>
  <皇帝 />
</Provider>
```

**运行效果：**

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZdRY.gif)

​		从运行效果来看和发布订阅没有任何区别，但是给我们最大的感受就是代码量增加了很多，尤其是初始化redux一下就增加了5个文件；如果你从来没有接触过redux的话，这对于你来说这的确会有一点小小的难度，更加觉得发布订阅的简单；除了这个变化以外，还有一个变化就是咱们的state数据都被放入到了redux中，组件之间也不在需要通过props层层传递了，要让数据变化的时候，直接修改redux中的数据就可以了，组件展示数据也是从redux中取，任何组件都可以操作修改redux中的数据。


## CocosCreator 与 React 跨框架之间传递数据

![image-20220426175402144](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZgXJ.png)

* 跨组件传递数据只是发布订阅模式的牛刀小试，跨框架传递数据才能真正展示它的威力，玩过Cocos的同学都知道开发Cocos游戏必须要用CocosCreator这个软件进行开发，而且它跟React这个框架也有非常大的区别，如何做到低耦合、低侵入实现二者的相互数据通讯尤为重要；因为在实际工作中Cocos游戏开发和React前端开发通常都是两个团队，通常对彼此的框架都不太了解，所以框架之间的互相通讯解耦非常重要。
* 在我的工作生涯中就遇到过这么一种场景，有一个功能是用cocos编写实现的（是游戏团队负责开发的他们不懂React），但是需要嵌入到用React写的前端页面（前端团队负责开发页面他们不懂Cocos），并且需要在前端页面里操控cocos里面的一些行为；怎样做到我不需要了解对方的框架和逻辑细节，并且能够操控对方的框架的一些行为？用发布订阅就能够完美解决这个问题，下面我通过一个demo来模拟一下这个场景。

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZgXH.png)

* 上图是CocosCreator的开发界面，假设这是游戏团队开发的一个小游戏，他们不懂React，就会用CocosCreator开发游戏，开发好以后构建打包交给前端团队，由前端团队嵌入到他们的前端页面中，但是需要前端页面操作cocos里面的`关闭音乐`和`亢龙有悔`这两个功能；而且Cocos游戏和React前端页面都是独立仓库、独立部署。

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZhI0.png)

* 上图是CocosCreator打包编译后的源码和资源，可以发现资源和源码都进行了拆分和压缩，可读性很低了；我们前端要嵌入Cocos游戏也是一个编译后的代码，如果从这个切入点入手，显然是不可取的。
* 如果用发布订阅就很简单了，Cocos游戏团队开发人员只需要添加两行订阅事件的代码就可以了，代码如下：

```javascript 
// 订阅 亢龙有悔 事件
document.addEventListener('onKangLongYouHui', this.onKangLongYouHui.bind(this));
// 订阅 关闭音乐 事件
document.addEventListener('onCloseMusic', this.onCloseMusic.bind(this));
```

* Cocos开发人员不需要关心前端如何嵌入他的游戏？如何触发他的事件？他只要监听到两个事件被触发时，去做相关的处理就可以了；
* 前端开发人员也不需要关心Cocos内部是怎么关闭音乐的？怎么发出`亢龙有悔`技能的；前端只需要知道当我触发`onCloseMusic`事件就是关闭音乐，触发`onKangLongYouHui`事件就是触发`亢龙有悔`技能，至于你cocos内部逻辑如何实现，如何编写代码，我不需要关心，完全解耦，下面我们来看一下代码实现：
* 首先大家不需要安装CocosCreator相关环境和软件，你只需要进入`/blog/design-patterns/publish-subscribe/example/demo06-cocos-across-react/Kingdoms/build/web-mobile`这个目录下启动一个http服务即可，例如：

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZhVm.png)

* 服务端启动以后，可以在浏览器中进行访问，运行起来的效果如下：

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZhVH.png)

* Cocos游戏的demo已经顺利运行起来了，但是我们无法对游戏角色进行操作；此时如果我们项目触发`亢龙有悔`技能怎么办？其实可以通过控制台直接触发订阅的事件即可，例如：

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZhXj.gif)

- 可以看到，咱们只要在控制台中发布(触发)`onKangLongYouHui`这个事件就可以操作Cocos中的角色发出`亢龙有悔`这个技能，我们根本不需要懂Cocos也不需要了解这个技能是实现逻辑以及它的动画是如何控制的，是不是很解耦？但是，我们的前端程序员可以通过控制台触发，给用户用的话，咱们就不能这么暴力了，接下来我们需要通过一个页面将这个游戏嵌入到我们的页面中，然后通过按钮来触发，下面我们来看代码：

```jsx
// example/demo06-cocos-across-react/react-with-cocos/src/app.jsx
import { useCallback } from 'react';
import cs from './app.module.scss';

function App() {
  const onCloseMusic = useCallback(() => {
    document.querySelector('iframe').contentWindow.document.dispatchEvent(new CustomEvent('onCloseMusic'));
  }, []);

  const onKangLongYouHui = useCallback(() => {
    document.querySelector('iframe').contentWindow.document.dispatchEvent(new CustomEvent('onKangLongYouHui'))
    console.log(document.querySelector('iframe').contentWindow.document)
  }, []);

  return (
    <div className={cs.app}>
      <iframe className={cs.iframe} src='./web-mobile/index.html'></iframe>
      <h1 className={cs.h1}>下面是React框架里面的代码</h1>
      <div className={cs.tool}>
        <div className={cs.btn} onClick={onCloseMusic}>关闭音乐</div>
        <div className={cs.btn} onClick={onKangLongYouHui}>亢龙有悔</div>
      </div>
    </div>
  )
}

export default App
```

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZh41.gif)

* 通过运行效果可以发现，通过发布订阅我们已经成功实现了在React框架里控制了Cocos游戏里面的一些行为了，而且咱们都不需要安装CocosCreator相关的开发环境。当然这里只是演示React和Cocos的通讯，如果你是Vue或者Angular都是可以的，这个东西与框架语言无关，核心是思想。

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZinR.png)

- 通过发布订阅模式就能够实现Cocos游戏逻辑和前端React逻辑的解耦，双方只要约定好事件名称的功能就好了，至于对方的逻辑怎么实现，彼此都不需要关心；Cocos游戏团队订阅好`onKangLongYouHui`事件了，至于你前端什么时候触发我不管，你爱啥时候触发啥时候触发；我只关注当你触发的时候，我就给你放技能。


## 客户端（Android）与前端（JavaScript）通讯

![](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/bVcZiqg.png)

​		开发过hybrid的同学应该都知道前端和客户端有一种通讯方式叫做bridge，通过bridge可以实现客户端与前端的相互通讯，从而扩展前端的能力。其实我们开发的网页不管是移动端还是PC端，咱们的前端代码都不只是直接运行在系统上的，PC端是运行在操作系统上的一个浏览器软件上，移动端是运行在操作系统的一个APP里的Webview组件上的，所以我们前端并没有太多能够直接去操作系统底层的API，下面我们通过2个demo演示如何利用发布订阅实现前端与客户的数据通讯。

​		在说Android客户端与前端通讯之前，我们首先了解一下客户端调用前端的原理，其实Android客户端调用前端的方式很简单，是直接通过`webview.loadUrl`函数和`webview.evaluateJavascript`函数，这个跟我们直接在浏览器控制台里直接调用`window.call` 函数是一样的原理：

![image-20220529142230502](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220529142230502.png)



* 首先我们来看第一个案例，当Android客户端的音量发生变化时和用户按back建时需要调用前端的函数通知前端：

```javascript
// example/demo08-android-call-javascript/src/case1/index.jsx
import { useState, useEffect } from 'react'
import Other from './other';
import cs from './index.module.scss';

function Case1() {
  const [text, setText] = useState('');

  useEffect(() => {
    /** 客户端会调用这个函数 */
    window.callJs = function({ type, param }) {
      if (type === 'VOLUME_UP') {
        console.log('param: ', param);
        setText('音量调大了');
      } else if (type === 'BACK') {
        setText('用户按返回键');
      }
    }
  }, [])

  return (
    <div className={cs.app}>
      <h3>我是app组件</h3>
      <div>
        app组件的内容: {text}
      </div>
      <Other />
    </div>
  )
}

export default Case1
```

```javascript
// example/demo08-android-call-javascript/src/case1/other.jsx
import React from 'react';
import cs from './index.module.scss';

export default class Other extends React.PureComponent {
  state = {
    content: ''
  }
  
  render() {
    const { content } = this.state;
    return <div className={cs.other}>
      <h3>我是Other组件</h3>
      Other组件的内容: {content}
    </div>
  }

  componentDidMount() {
    /** 客户端会调用这个函数 */
    window.callJs = function({ type, param }) {
      if (type === 'VOLUME_DOWN') {
        this.setState({ content: '音量调小了' });
      }
    }
  }
}
```

上述代码中我们通过在window上挂载callJs函数给客户端调用，然后传递不同的type代表用户的不同操作，并且我们在两个组件中都在window上挂载了callJs函数，这样带来的后果就是Case1组件里的callJs函数会覆盖掉other.jsx里面挂载的callJs函数，下面我们看运行效果：

![May-29-2022 14-17-59](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/May-29-2022 14-17-59.gif)

* 既然我们已经知道后面挂载的callJs函数会把前面组件挂载的callJs逻辑覆盖掉，那么我们应该如何解决这样的问题呢？此时又到了发布订阅的表演时间了，首先我们利用发布订阅模式，将用户的操作逻辑通过事件收集起来，全局只挂载一次callJs，下面我们来看代码：

```javascript
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
```

* 使用bridge进行订阅事件：

```javascript
// example/demo08-android-call-javascript/src/case2/index.jsx
import { useState, useEffect } from 'react'
import bridge from '../bridge';
import Other from './other';
import cs from './index.module.scss';

function Case2() {
  const [text, setText] = useState('');

  useEffect(() => {
    // 订阅相关事件，等待客户端调用
    bridge.on('VOLUME_UP', param => {
      setText(param.msg);
    });
    // 订阅相关事件，等待客户端调用
    bridge.on('BACK', param => {
      setText(param.msg);
    });

  }, [])

  return (
    <div className={cs.app}>
      <h3>我是app组件</h3>
      <div>
        app组件的内容: {text}
      </div>
      <Other />
    </div>
  )
}

export default Case2
```

```javascript
// example/demo08-android-call-javascript/src/case2/other.jsx
import React from 'react';
import bridge from '../bridge';
import cs from './index.module.scss';

export default class Other extends React.PureComponent {
  state = {
    content: ''
  }
  
  render() {
    const { content } = this.state;
    return <div className={cs.other}>
      <h3>我是Other组件</h3>
      Other组件的内容: {content}
    </div>
  }

  componentDidMount() {
    bridge.on('VOLUME_DOWN', param => {
      this.setState({ content: '音量调小了' });
    });

    bridge.on('VOLUME_UP', param => {
      this.setState({ content: param.msg });
    });
  }
}
```

通过上述代码可以发现，我们通过发布订阅模式将用户的事件操作逻辑收集起来，全局只挂载一次`window.callJs`然后当客户端调用前端的`callJs`函数时，根据事件类型循环调用刚刚前端监听的事件，并且把参数传递过去，下面我们看执行结果：

![May-29-2022 14-34-42](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/May-29-2022 14-34-42.gif)

通过运行结果发现逻辑已经不会被覆盖了，而且我们可以在任意组件中进行监听相关的bridge事件。

# Node.js 事件触发器

在node.js中有一个内置模块叫事件触发器`events`，这块模块就是一个标准的发布订阅实现，下面我们通过代码来感受一下它的功能和使用：

```javascript
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
```

**运行结果：**

![image-20220426093003134](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220426093003134.png)

> 📢 这里使用的node版本为 v17.8.0

# 发布订阅的实现原理

* 感受完发布订阅的威力和应用场景之后，我们需要了解一下这个设计模式的实现原理，如何实现一个发布订阅？我们以node.js的事件触发器的功能为参考基准，用70行代码来实现一个通用的发布订阅功能。
* 一个最基本的发布订阅最主要有3大功能：
  * 监听（on）    => 收集事件处理函数，进行分类存放到数组里。
  * 触发（emit）=> 执行收集到的数据处理函数；先进先出，先监听的事件会被先触发。
  * 移除（off）   => 移除收集到的数据处理函数；后进先出，后监听的事件会被先移除。

> 📢 订阅（监听）； 发布（触发）

* 了解了基本功能之后，我们只要记住一句话就能手推出发布订阅设计模式的实现："订阅其实就是将事件处理函数收集起来，进行分类存到数组里；发布其实就是将收集起来的这些事件处理函数进行调用执行"，所以这就是为什么要先订阅后发布的原因。

```javascript
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
    // 第一次触发后需要把once事件全部移除掉
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
```

* 然后可以把前面例子中用的node内置的`events`换成咱们自己实现的；可以发现得到的结果是一模一样的，这就证明咱们实现的发布订阅是正确的了。

```javascript
// example/demo09-node-event/demo02.mjs
import EventEmitter from './events.mjs';    // 其他逻辑代码没有变化，只需要把这个换成自己实现发布订阅即可
```



![image-20220426094017180](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220426094017180.png)

* 细心的同学会发现咱们自己实现的`events.mjs`里面有这么一段代码：

```javascript
// 默认事件对象，挂载在静态函数上
const defaultEvent = new Events();
Events.on = Events.prototype.on.bind(defaultEvent)
Events.once = Events.prototype.once.bind(defaultEvent)
Events.off = Events.prototype.off.bind(defaultEvent)
Events.emit = Events.prototype.emit.bind(defaultEvent)
```

* 这么设计的主要是为了给`懒人`准备，因为有些人不想new直接用，那么你就可以像下面这样用：

```javascript
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
```

运行结果：

![image-20220426122742322](/Users/jameswain/prod/blog/design-patterns/publish-subscribe/README.assets/image-20220426122742322.png)

通过运行结果可以发现，对象之间虽然事件名称一样，但是都是互相隔离的，所以你可以根据你的业务场景创建不同的事件对象，进行分类管理，有效的避免事件名称同名冲突问题。

# 最后

​		发布订阅这个设计模式的实现其实并不是特别的复杂，我觉得最主要的不是它的代码实现，而是它的设计思想，以及应用场景；只有在对的应用场景下才能发挥出它真正的威力；这篇文章我只是模拟演示了一些比较常见的应用场景，它还有很多变种分支和使用技巧也是非常巧妙的。







