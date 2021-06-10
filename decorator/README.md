# 简介

装饰器其实就是一个函数，用于描述类、函数、属性、参数，通过`@函数名`的方式进行调用，它可以放在类和属性的前面。例如：

```javascript
// 创建一个装饰器函数
function log(target) {
  console.log('我是log装饰器函数')
}
// 装饰器调用
@log
class App {}
```

 装饰器只是一种语法糖，只是调用方式不一样而已，转换后的代码其实本质上还是下面这样：

```javascript
function log(target) {
  console.log('我是log装饰器函数')
}

var _class = class App {};
let App = log(_class) || _class;
```

装饰是前置执行，例如：类装饰器，会在类被使用前进行调用；函数装饰器会在函数被调用前执行。	

# 环境搭建

因为装饰器decorator是ES7中的一个[提案](https://github.com/tc39/proposal-decorators)，目前处于stage-2阶段，所以不管是node还是浏览器，现在都没有直接支持这个语法，我们要想使用该语法，就必须要通过babel将它进行一个编译转换，所以我们需要搭建一个babel编译环境。

**1、安装babel相关包**

```shell
npm i @babel/cli @babel/core @babel/plugin-proposal-decorators -D
```

**2、在项目根目录下创建`.babelrc`**

```json
{
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  ]
}
```

基础环境搭建好以后，接下来我们就可以尽情的使用装饰器了！

💡提示：如果你不想在本地搭建babel环境，也可以使用[babel-repl](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=usage&corejs=3.6&spec=false&loose=true&code_lz=PTAEm8fRRiMB0zAs1AoAZgVwHYGMAuBLA9q0Ad20wAsAlXZTAUwCcAKTAQzoHMbMBKUAb3lCh0-AM64ANjQB043GwYByYmUrV6ALgUAaUC3acuAbngBfePAACyilVp146ccxEjQAQQAOHviaA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=true&fileSize=false&timeTravel=false&sourceType=module&lineWrap=false&presets=env%2Cstage-2&prettier=false&targets=&version=7.14.4&externalPlugins=)在线转换工具实时将装饰器转换成ES5的语法

# **类装饰器**

类装饰器，顾名思义就是用来装饰整个类的，可以用来修改类的一些行为。

**参数：**类装饰器只有一个参数target，就是被装饰类的本身。

**返回值：**只能是一个类（被装饰的类target或者一个新的类），也可以是一个为false的值：undefined、null、false、0，或者不写返回值。

## 简单类装饰器

源码位置：

```javascript
// src/demo01.js
// 类装饰器：只要target一个参数，而且target代表被装饰的类本身
function withRouter(target) {
  console.log('withRouter:', target);
  // 📢注意：返回值可以不写，但是不能随便写返回值，即使要写也只能是target，或者是一个类，如果返回是一个对象，会导致装饰后的类无法被new
  // 类装饰器的返回值只能以下3种：target（类本身）、新的类、(null、undefined、false、0) 返回为false值，编译后的代码装饰器也会处理为target
}

@withRouter
class App {}
```

编译 & 执行：

```shell
 // 使用babel编译，将代码编译输出到dist文件夹
npx babel src/demo01.js -d dist   
// 执行编译后的代码
node dist/demo01.js
// 执行输出
withRouter: [class App]
```

编译后的代码：

```javascript
// dist/demo01.js
var _class;

// src/demo01.js
// 类装饰器
function withRouter(target) {
  console.log('withRouter:', target);
}

let App = withRouter(_class = class App {}) || _class;
```

上面babel编译后的代码读起来可能有点绕，为了方便理解我整理一下：

```javascript
function withRouter(target) {
  console.log('withRouter:', target);
}

var _class = class App {};
let App = withRouter(_class) || _class; // 如果withRouter装饰器有返回值，直接将装饰器的返回值给App
```

​		可以看到其实类装饰器就是一个函数，接收一个类作为参数，装饰器函数内部的target参数就是被装饰的类本身，我们可以在装饰器函数内部对这个类进行一些修改，比如：添加静态属性，给原型添加函数等等。

​		装饰器其实就是一种语法糖而已，本质上还是一个函数，只是通过`@函数名`这方式调用而已，跟`函数名()`调用方式没有任何区别。

## 带参数的类装饰器

源码位置：

带参数的装饰器，需要在外面再套一层接受参数的函数，像下面这样：

```javascript
// src/demo02.js
// 带参数的类装饰器
function withRouter(params) { // 接收参数的函数
  console.log('withRouter.params:', params);
  return function(target) { // 装饰器函数
    // 给被装饰的类添加一个静态属性
    target.params = params;
    // 也可以给原型添加函数和属性，例如：target.prottotype.name = 'Jameswain';
  	console.log('withRouter.target:', target);
  }
}

@withRouter('Jameswain')
class App {
}
console.log(App)


```

**编译 & 执行：**

```she
// 编译
npx babel src/demo02.js -d dist   
// 执行
node src/demo02.js

// 输出结果：
withRouter.params: Jameswain
withRouter.target: [class App] { params: 'Jameswain' }
[class App] { params: 'Jameswain' }
```

为了方便大家理解，我将babel编译后的代码进行了逻辑上简化整理，如果大家想看babel编译后的源码，自己执行命令编译一下即可：

```javascript
// src/demo02.js
// 带参数的类装饰器
function withRouter(params) { // 接收参数的函数
  console.log('withRouter.params:', params);
  return function (target) { // 装饰器函数
    // 给被装饰的类添加一个静态属性
    target.params = params;
    console.log('withRouter.target:', target);
  };  
}

var _dec = withRouter('Jameswain'); // 传入参数给装饰器，其实就是执行@withRouter('Jameswain')
var _class = class App {};
let App = _dec(_class) || _class; // 调用装饰器函数，对类进行装饰
console.log(App);
```

带参数的装饰器，其实就是函数柯里化。

## 类装饰器的执行顺序

源码位置：

类装饰器其实就是两种，一种是有参数，一种是无参数。当一个类被多个装饰器装饰时，并且有带参数的装饰，则执行顺序跟dom事件差不多：**从上往下进入，从下往上返回**；先捕获（从上往下执行参数层函数），后冒泡（从下往上执行装饰器层函数）。

```javascript
// src/demo03.js
// 装饰器的执行顺序
function log(name) { // 接收参数层
  console.log('log.name:', name)
  return function logDecorator(target) { // 装饰器层
    console.log('log.target: ', target);
  }
}

function connect(name) { // 接收参数层
  console.log('connect.name', name);
  return function connectDecorator(target) { // 装饰器层
    console.log('connect.target: ', target);
  }
}

function withRouter(target) { // 装饰器层
  console.log('withRouter.target: ', target);
}

@log('日志')
@withRouter
@connect('连接器')
class App {
}
```

**编译 & 执行：**

```shell
// 编译
npx babel src/demo03.js -d dist
// 执行
node dist/demo03.js

// 输出结果：
log.name: 日志
connect.name 连接器
connect.target:  [class App]
withRouter.target:  [class App]
log.target:  [class App]
```

执行流程图：

![执行流程图](https://img.ikstatic.cn/MTYyMjM4NDk5Mjg1MSM3NjYjanBn.jpg)

babel编译后的装饰器源码：

```javascript
// src/demo03.js
// 装饰器的执行顺序
var _dec, _dec2, _class;

function log(name) { // 接收参数层
  console.log('log.name:', name);
  return function logDecorator(target) { // 装饰器层
    console.log('log.target: ', target);
  };
}

function connect(name) { // 接收参数层
  console.log('connect.name', name);
  return function connectDecorator(target) { // 装饰器层
    console.log('connect.target: ', target);
  };
}

function withRouter(target) { // 装饰器层
  console.log('withRouter.target: ', target);
}

// 装饰器执行核心逻辑，其实就是一层一层的嵌套函数调用
let App = (_dec = log('日志'), _dec2 = connect('连接器'), _dec(_class = withRouter(_class = _dec2(_class = class App {}) || _class) || _class) || _class);
```

从编译后的代码中可以看出，多个装饰器其实就是一层层的函数嵌套调用，现在知道装饰器出现的好处了吧，语法糖的出现就是为了增加代码的可读性。

为了方便大家理解装饰编译后的装饰器执行顺序，我对代码进行可读性优化：

```javascript
// 装饰器的执行顺序
function log(name) { // 接收参数层
  console.log('log.name:', name);
  return function logDecorator(target) { // 装饰器层
    console.log('log.target: ', target);
  };
}

function connect(name) { // 接收参数层
  console.log('connect.name', name);
  return function connectDecorator(target) { // 装饰器层
    console.log('connect.target: ', target);
  };
}

function withRouter(target) { // 装饰器层
  console.log('withRouter.target: ', target);
}

var App = class App {}

// 优化后的装饰器核心执行流程
// 调用装饰器接收参数层函数
var logDecorator = log('日志');
var connectDecorator = connect('连接器');
// 调用装饰器层函数
App = connectDecorator(App) || App;
App = withRouter(App) || App;
App = logDecorator(App) || App;
```

其实不管怎么优化，代码的可读性，还是不如装饰器高。

## 案例：模拟react-redux的connect实现

我们平时开发中使用的`react-redux`就有一个`connect`装饰器，它可以把redux中的变量注入到指定类创建的实例中，下面我们就通过一个例子模拟实现`connect`的功能：	

```javascript
// src/demo04.js
// 模拟实现react-redux的connect功能

// connect装饰器
function connect(mapStateToProps, mapDispatchToProps) { // 参数接受层
  return function connectDecorator(target) { // 装饰器层
    const defaultState = {
      name: 'Jameswain',
      text: 'redux默认信息'
    };

    // 模拟dispatch函数
    const dispatch = payload => console.log('payload: ', payload);
  
    const { props } = target.prototype;
    // 将传入的函数进行执行，并且合并到原型的props熟悉中
    target.prototype.props = { ...props, ...mapStateToProps(defaultState), ...mapDispatchToProps(dispatch) };
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  setUser: () => dispatch({ type: 'SET_USER' })
})

@connect(mapStateToProps, mapDispatchToProps)
class App {
  render() {
    console.log('渲染函数');
  }
}

const app = new App();
console.log('app: ', app);
console.log('app.props: ', app.props);
```

**编译 & 执行：**

```shell
// 编译
npx babel src/demo04.js
// 执行
node dist/demo04.js
// 输出结果
app:  App {}
app.props:  { name: 'Jameswain', text: 'redux默认信息', setUser: [Function: setUser] }
```

从输出结果中可以看到，效果跟`react-redux`的`connect`装饰器一样，返回值都被注入到App实例中的props属性中，下面我们来看看编译出来的代码长什么样子，老规矩为了方便大家理解，我优化一下代码逻辑：

```javascript
// src/demo04.js
// 模拟实现react-redux的connect功能

// connect装饰器
function connect(mapStateToProps, mapDispatchToProps) {
  // 参数接受层
  return function connectDecorator(target) {
    // 装饰器层
    const defaultState = {
      name: 'Jameswain',
      text: 'redux默认信息'
    }; // 模拟dispatch函数

    const dispatch = payload => console.log('payload: ', payload);

    const {
      props
    } = target.prototype; // 将传入的函数进行执行，并且合并到原型的props熟悉中

    target.prototype.props = {
      ...props,
      ...mapStateToProps(defaultState),
      ...mapDispatchToProps(dispatch)
    };
  };
}

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  setUser: () => dispatch({
    type: 'SET_USER'
  })
});

var App = class App {
  render() {
    console.log('渲染函数');
  }
}

var connectDecorator = connect(mapStateToProps, mapDispatchToProps);
App = connectDecorator(App) || App;

const app = new App();
console.log('app: ', app);
console.log('app.props: ', app.props);
```

对比编译后的代码，可以发现其实装饰器就是一个语法糖而已，实现一模一样，只是调用的方式不一样。

```javascript
// 装饰器用法
@connect(mapStateToProps, mapDispatchToProps)
class App {}

// 函数式用法
connect(mapStateToProps, mapDispatchToProps)(class App {})

// 所以在react中，如果是函数组件想取redux中的状态时，可以使用函数式的方式，例如：
import { connect } from 'react-redux';
const App = connect(state => state)(function App(props) {
  return <div>{ props }</div>;
});
```

# 函数装饰器

函数装饰器也只能装饰**类中的函数**或者**对象中的函数**，它可以用来修改函数的一些行为。

* **参数：**函数装饰器总共接收3个参数
  * **target：**被装饰函数的实例，如果是类中的函数，就是类的原型对象；
  * **name：**被装饰的函数名
  * **descriptor：**被装饰函数的描述对象
    * [**Object.defineProperty() ：**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。
    * [**Object.getOwnPropertyDescriptor()：**](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)返回指定对象上一个自有属性对应的属性描述符

* **返回值：**被装饰函数的descriptor描述对象，或者是一个为false的值：undefined、null、false、0、不写返回值。

## 无参数 - 函数装饰器

不管是类装饰还是函数装饰器。只要是无参数都是一层函数：

```javascript
// src/demo05.js
// 类函数 - 装饰器
function log(target, name, descriptor) {
  console.log('log.target: ', target);
  console.log('log.name: ', name);
  console.log('log.descriptor: ', descriptor);
  
}

class App {
  @log
  onClientList() {
    console.log('App.onClientList');
  }
}

const app = new App();
app.onClientList();
```

**编译 & 执行：**

```javascript
// 编译
npx babel src/demo05.js
// 执行
node dist/demo05.js
// 输出结果
log.target:  {}
log.name:  onClientList
log.descriptor:  {
  value: [Function: onClientList],
  writable: true,
  enumerable: false,
  configurable: true
}
App.onClientList
```

从输出结果中可以发现`函数装饰器`除了`参数`、`返回值和`和`类装饰器`不一样之外，其他都一样；`函数装饰器`经过`babel`编译后的代码比`类装饰器`要复杂一点，我们首先来看一下babel编译后的代码：

```javascript
var _class;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}

// src/demo05.js
// 类函数 - 装饰器
function log(target, name, descriptor) {
  console.log('log.target: ', target);
  console.log('log.name: ', name);
  console.log('log.descriptor: ', descriptor);
}

let App = (_class = class App {
  onClientList() {
    console.log('App.onClientList');
  }

}, (_applyDecoratedDescriptor(_class.prototype, "onClientList", [log], Object.getOwnPropertyDescriptor(_class.prototype, "onClientList"), _class.prototype)), _class);

const app = new App();
app.onClientList();
```

乍一看代码逻辑还是有点难读的，下面我来逐步拆分讲解，逻辑就会清晰了

### 函数装饰器babel编译后源码解析

源码地址：

看编译后的源码，需要遵循一个原则，就是先粗后细，从上往下读，然后根据理解将代码转换成可读的方式。

**1、从编译后的代码，可以看出它首先声明了一个_applyDecoratedDescriptor的函数，函数内部的实现逻辑咱们先不要看，你就当做它只是声明了一个普通函数名字叫_applyDecoratedDescriptor，函数体什么逻辑都没有，然后跟着我继续往下看。**

```javascript
// 类函数 - 装饰器babel编译后源码解析
/**
 * 应用装饰描述符
 * @param {*} target 被装饰函数的类原型
 * @param {*} property 被装饰函数名称
 * @param {*} decorators 装饰器数组
 * @param {*} descriptor 被装饰函数的属性描述符
 * @param {*} context 被装饰函数的类原型
 * @returns 
 */
function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};

  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  
  return desc;
}
```

**2、声明装饰器函数log，其实装饰器函数被编译前一模一样，没有任何区别**

```javascript
/**
 * 装饰器
 * @param {*} target 被装饰函数的类原型
 * @param {*} name 被装饰函数名
 * @param {*} descriptor 被装饰函数的描述对象
 */
function log(target, name, descriptor) {
  console.log('log.target: ', target);
  console.log('log.name: ', name);
  console.log('log.descriptor: ', descriptor);
}
```

**3、创建App类这一段代码应该是最难读的一个地方，其实这里是4步操作，只是babel把这些操作合并到一个表达式里，所看起来比较凌乱，下面我对照源码进行步骤拆分：**

```javascript
// 整理后：将表达式进行拆解
// 创建App类，并赋值给_class变量
var _class = class App {
  onClientList() {
    console.log('App.onClientList');
  }
};

// 调用【应用装饰器描述】函数，这个函数返回undefined
const desc = _applyDecoratedDescriptor(_class.prototype, "onClientList", [log], Object.getOwnPropertyDescriptor(_class.prototype, "onClientList"), _class.prototype);

// 注意：(10, 20, undefined, 0, 200, null)，这种表达式，永远只会返回最后一个值，所以我觉得这个表达式完全是多此一举，没有必要！
let App = (_class, desc, _class); // 所以这里返回的是_class，也就是App类

// 最后就是创建App实例了
const app = new App();
app.onClientList();
```

如果你觉得命名不太爽，掺杂着无用逻辑不太爽，下面我也整理了一个重命名并且删除无用逻辑的源代码片段

```javascript
// 创建App类
class App {
  onClientList() {
    console.log('App.onClientList');
  }
};

// 应用装饰描述符
applyDecoratedDescriptor(App.prototype, "onClientList", [log], Object.getOwnPropertyDescriptor(App.prototype, "onClientList"), App.prototype);

// 创建App实例
const app = new App();
app.onClientList();
```

 到这里整个代码的执行流程就已经捋顺了：

1、声明_applyDecoratedDescriptor函数

2、声明log装饰器函数

3、创建App类

4、调用_applyDecoratedDescriptor函数

5、创建app实例

6、调用app.onClientList()函数

现在我们再回过头来看看`_applyDecoratedDescriptor`函数的实现细节，进行逐个击破；看转换后的代码一定要多思考为什么要这么做？是否有必要这么做？学会删掉无用的逻辑，这样整个逻辑才会变得通顺。

**1、首先我们来看applyDecoratedDescriptor函数的第一部分：被装饰函数的描述符对象处理**

```javascript
/**
 * 应用装饰描述符
 * @param {*} target 被装饰函数的类原型
 * @param {*} property 被装饰函数名称
 * @param {*} decorators 装饰器数组
 * @param {*} descriptor 被装饰函数的属性描述符
 * @param {*} context 被装饰函数的类原型
 * @returns 
 */
function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  /**
   * 这块代码逻辑主要是把被装饰函数的描述符对象配置复制到desc对象中
   * 其实这块逻辑完全就是多余的，完全没有必要写，理由有2点：
   *  1、Object.getOwnPropertyDescriptor每次都是返回一个全新的描述对象，同样的代码获取2次的描述对象是不相等的，所以不用担心直接使用会影响别的问题
   *  2、在类中直接创建的函数，描述对象默认就有value值，writable默认就是true，所以完全没有必要多此一举做判断
   *  关于Object.getOwnPropertyDescriptor实验的例子可以见：src/demo07.js
   */
  // 把下面的逻辑删掉，直接将传入的描述符对象给desc，
  var desc = descriptor;   
  // Object.keys(descriptor).forEach(function (key) {
  //   desc[key] = descriptor[key];
  // });
  // desc.enumerable = !!desc.enumerable;
  // desc.configurable = !!desc.configurable;
  // if ('value' in desc || desc.initializer) {
  //   desc.writable = true;
  // }
}

// 应用装饰描述符
const target = App.prototype; // 被装饰函数的类原型
const property = "onClientList"; // 被装饰函数名称
const decorators = [log]; // 装饰器数组
const descriptor = Object.getOwnPropertyDescriptor(App.prototype, "onClientList"); // 被装饰函数的属性描述符
const context = App.prototype;
applyDecoratedDescriptor(target, property, decorators, descriptor, context);
```

**2、applyDecoratedDescriptor函数的第二部分：装饰器函数数组调用**

```javascript
/**
 * 应用装饰描述符
 * @param {*} target 被装饰函数的类原型
 * @param {*} property 被装饰函数名称
 * @param {*} decorators 装饰器数组
 * @param {*} descriptor 被装饰函数的属性描述符
 * @param {*} context 被装饰函数的类原型
 * @returns 
 */
function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {

  // 第二部分：装饰器函数数组调用
  /**
   * 这里涉及到的三个数组函数，我都列举出来
   * Array.prototype.slice() - 返回一个新的数组对象，这一对象是一个由 begin 和 end 决定的原数组的浅拷贝（包括 begin，不包括end）。原始数组不会被改变。
   * Array.prototype.reverse() - 将数组中元素的位置颠倒，并返回该数组。数组的第一个元素会变成最后一个，数组的最后一个元素变成第一个。该方法会改变原数组。
   * Array.prototype.reduce() - 对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。
   * 
   * 逻辑剖析：
   * decorators传进来的是[log]，是一个全新的数组也没有任何的关联，所以完全没有必要使用[log].slice()返回一个全新的数组了，所以可以删除slice()调用操作
   * 
   */
  // 原始代码
  // desc = decorators.slice().reverse().reduce(function (desc, decorator) {
  //   return decorator(target, property, desc) || desc;
  // }, desc);
  // 精简后的代码
  desc = decorators.reverse().reduce(function (desc, decorator) {
    const decoratorRetuen = decorator(target, property, desc); // 这里其实就是调用log装饰器函数，没有写返回值，所以是undefined
    // 如果装饰器没有返回描述符对象，则使用传入的描述符对象
    return decoratorRetuen || desc;
  }, desc);
}
```

**3、applyDecoratedDescriptor函数的第三部分：initializer的处理**

```javascript
function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  // 第三部分：initializer的处理
  /**
   * context 其实就是App.prototype
   * desc.initializer 函数只有装饰属性是才会有值
   * void 0 其实就是 undefined
   * 因为这里装饰的是类函数，所以initializer就是等于undefined，所以说if里面的处理逻辑是执行不到的，其实我们也可以把它删掉 。
   */
  if (context && desc.initializer !== undefined) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
}
```

因为initializer涉及到属性装饰器，后续讲到属性装饰器时会详细展开讲解，所以本章先简单介绍一下，大家知道只有装饰属性才会有值即可。

**4、applyDecoratedDescriptor函数的第四部分：重新定义被装饰函数的描述符**

```javascript
function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  // 第四部分：重新定义被装饰器的函数描述符
  /**
   * 因为这里装饰的是函数，所以描述符是不可能有initializer属性的，所以每次都会重新定义一次被装饰的函数，描述符对象取的是默认描述符或者是装饰器返回的描述符对象；
   */
  if (desc.initializer === void 0) { // 因为装饰的是函数，所以这个条件永远都为true，为了避免干扰，其实也可以把这个条件判断删掉
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}
```

**5、最后我把删减优化后的完整代码放出来，大家再看一下是不是很好理解了**

```javascript
// src/demo06.js
// 类函数 - 装饰器babel编译后源码解析

/**
 * 应用装饰描述符
 * @param {*} target 被装饰函数的类原型
 * @param {*} property 被装饰函数名称
 * @param {*} decorators 装饰器数组
 * @param {*} descriptor 被装饰函数的属性描述符
 * @param {*} context 被装饰函数的类原型
 * @returns 
 */
function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = descriptor;
  // 循环调用装饰器
  desc = decorators.reverse().reduce(function (desc, decorator) {
    const decoratorRetuen = decorator(target, property, desc); // 这里其实就是调用log装饰器函数，没有写返回值，所以是undefined
    return decoratorRetuen || desc; // 如果装饰器没有返回描述符对象，则使用传入的描述符对象
  }, desc);
  // 重新定义被装饰的函数
  Object.defineProperty(target, property, desc);
  desc = null;
  return desc;
}

/**
 * 装饰器
 * @param {*} target 被装饰函数的类原型
 * @param {*} name 被装饰函数名
 * @param {*} descriptor 被装饰函数的描述对象
 */
function log(target, name, descriptor) {
  console.log('log.target: ', target);
  console.log('log.name: ', name);
  console.log('log.descriptor: ', descriptor);
}

// 创建App类
class App {
  onClientList() {
    console.log('App.onClientList');
  }
};

// 应用装饰描述符
const target = App.prototype; // 被装饰函数的类原型
const property = "onClientList"; // 被装饰函数名称
const decorators = [log]; // 装饰器数组
const descriptor = Object.getOwnPropertyDescriptor(App.prototype, "onClientList"); // 被装饰函数的属性描述符
const context = App.prototype;
applyDecoratedDescriptor(target, property, decorators, descriptor, context);

// 创建App实例
const app = new App();
app.onClientList();
```

其实函数装饰器就是把所有的装饰器函数放到一个数组中，进行倒序循环执行；最后根据函数装饰器返回的属性描述符或者默认的属性描述符进行重新定义被装饰的函数。

### 执行顺序解析

`函数装饰器` 的执行顺序其实跟`类装饰器`一样：

* 无参数：从下往上执行装饰器层函数
* 有参数：从上往下进入参数层函数，从下往上执行装饰器层函数

如果一个类中有多个函数被装饰器装饰，则按照被装饰函数的声明顺序来执行

```javascript
// src/demo08.js
// 无参数 - 函数装饰器 - 执行顺序

function log(target, name, descriptor) {
  console.log('log装饰器=>', name)  
}

function needLogin(target, name, descriptor) {
  console.log('needLogin装饰器=>', name)
}

function lockAsyncFunction(target, name, descriptor) {
  console.log('lockAsyncFunction装饰器=>', name);
}

class App {
  @log
  @needLogin
  @lockAsyncFunction
  onClientList() {
    console.log('App.onClientList');
  }

  @log
  @needLogin
  a() { // 故意起名为a看看执行顺序会不会被排到前面
    console.log('a函数');
  }

  @lockAsyncFunction
  A() {
    console.log('A函数');
  }
}

const app = new App();
app.onClientList();
```

**编译 & 执行：**

```javascript
// 编译执行
babel src/demo08.js -d dist && node dist/demo08.js
// 输出结果
lockAsyncFunction装饰器=> onClientList
needLogin装饰器=> onClientList
log装饰器=> onClientList
needLogin装饰器=> a
log装饰器=> a
lockAsyncFunction装饰器=> A
App.onClientList
```

从运行结果可以看出无参数装饰器，都是秉承着一个原则 **“从下往上执行”** 如果一个类中存在多个函数被装饰，则按照函数声明的顺序执行，先执行完一个函数所有的装饰器，然后再执行下一个函数的所有装饰器。

老规矩，为了方便大家理解，我将编译后的ES5代码进行梳理，我们通过ES的代码看函数装饰器执行顺序的本质：

```javascript
// src/demo09.js
// 无参数 - 函数装饰器 - 执行顺序

/**
 * 应用装饰描述符
 * @param {*} target 被装饰函数的类原型
 * @param {*} property 被装饰函数名称
 * @param {*} decorators 装饰器数组
 * @param {*} descriptor 被装饰函数的属性描述符
 * @param {*} context 被装饰函数的类原型
 * @returns 
 */
 function applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = descriptor;
  // 循环调用装饰器
  desc = decorators.reverse().reduce(function (desc, decorator) {
    const decoratorRetuen = decorator(target, property, desc); // 这里其实就是调用log装饰器函数，没有写返回值，所以是undefined
    return decoratorRetuen || desc; // 如果装饰器没有返回描述符对象，则使用传入的描述符对象
  }, desc);
  // 重新定义被装饰的函数
  Object.defineProperty(target, property, desc);
  desc = null;
  return desc;
}

function log(target, name, descriptor) {
  console.log("log装饰器=>", name);
}

function needLogin(target, name, descriptor) {
  console.log("needLogin装饰器=>", name);
}

function lockAsyncFunction(target, name, descriptor) {
  console.log("lockAsyncFunction装饰器=>", name);
}

class App {
  onClientList() {
    console.log("App.onClientList");
  }

  a() {
    console.log("a函数");
  }

  A() {
    console.log("A函数");
  }
}

applyDecoratedDescriptor(
  App.prototype,
  "onClientList",
  [log, needLogin, lockAsyncFunction], // 一个函数被多个装饰器装饰时，其实就是把所有装饰器函数放在数组里
  Object.getOwnPropertyDescriptor(App.prototype, "onClientList"),
  App.prototype
)

applyDecoratedDescriptor(
  App.prototype,
  "a",
  [log, needLogin],
  Object.getOwnPropertyDescriptor(App.prototype, "a"),
  App.prototype
)

applyDecoratedDescriptor(
  App.prototype,
  "A",
  [lockAsyncFunction],
  Object.getOwnPropertyDescriptor(App.prototype, "A"),
  App.prototype
)

const app = new App();
app.onClientList();
```

通过上述代码我们可以发现，当一个函数被多个装饰器装饰时，其实就是把所有的装饰器函数放在数组里，然后循环调用装饰器。

一个类中存在多个函数被装饰时，其实就是调用了多次`applyDecoratedDescriptor`函数

## 有参数 - 函数装饰器





## 案例：登录拦截





## 案例：日志上报



# 属性装饰器





## 带参数的属性装饰器





## 属性装饰器的返回值

```javascript
// 方法装饰器的返回值，只能是这3类型：descriptor描述对象、空对象、(null、undefined、false、0) 返回为false值
```



## 案例：监听属性变化触发视图更新



# 参数装饰器



# 组合装饰器

在装饰器的提案中，还出现了一种组合了多种装饰器的装饰器例子。目前还没见到被使用。

通过使用 `decorator` 来声明一个组合装饰器 `xyz`，这个装饰器组合了多种装饰器。

```
decorator @xyz(arg, arg2 {
  @foo @bar(arg) @baz(arg2)
}
@xyz(1, 2) class C { }
```

和下面这种写法是一样的。

```
@foo @bar(1) @baz(2)
class C { }
```







# 节流(throttle)装饰器





# 防抖(debounce)装饰器





# 表单验证装饰器





# express 装饰器封装

参考https://juejin.cn/post/6844903635168526343#heading-3

# core-decorators.js 装饰器库

https://github.com/jayphelps/core-decorators#decorate



# axios-service装饰器





# create-decorator



# 装饰器在映客前端的最佳实践





# 总结

装饰器其实就是包装对象，然后返回一个新的对象描述（descriptor），其作用也非常单一简单；







































