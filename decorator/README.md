# 简介





# 环境搭建

因为装饰器属于一个在提案中的语法，所以不管是node还是浏览器，现在都没有直接支持这个语法，我们要想使用该语法，就必须要通过babel将它进行一个编译转换，所以我们需要搭建一个babel编译环境。

**1、安装babel相关包**

```shell
npm i @babel/cli @babel/core @babel/plugin-proposal-decorators @babel/preset-env -D
```

**2、在项目根目录下创建`.babelrc`**

```json
{
  "presets": [
    "@babel/preset-env"
  ],
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

基础环境搭建好以后，接下来我们就可以尽情的使用装饰器了

# **类装饰器**

类装饰器，顾名思义就是用来装饰整个类的，可以用来修改类的一些行为。下面非常简单的一个装饰器的应用例子：

```javascript
// src/demo01.js
// 类装饰器的简单应用
function log(target, name, descriptor) {
  console.log('target: ', target);
  console.log('name: ', name);
  console.log('descriptor: ', descriptor);
}

@log
class App {
}
```

```shell
npx babel src/demo01.js -d dist
```







































