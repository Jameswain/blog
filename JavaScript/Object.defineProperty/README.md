# 简介
![01](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/01.jpg)

Object.defineProperty(对象，属性，属性描述符) 用于在一个对象上定义一个新的属性，或者修改一个对象现有的属性，并返回这个对象。

## demo01 - 属性描述符默认值

| 属性         | 默认值    | 说明                                                      |
| ------------ | --------- | --------------------------------------------------------- |
| configurable | false     | 描述属性是否可以被删除，默认为 false                      |
| enumerable   | false     | 描述属性是否可以被for...in或Object.keys枚举，默认为 false |
| writable     | false     | 描述属性是否可以修改，默认为 false                        |
| get          | undefined | 当访问属性时触发该方法，默认为undefined                   |
| set          | undefined | 当属性被修改时触发该方法，默认为undefined                 |
| value        | undefined | 属性值，默认为undefined                                   |

```javascript
// demo01-default.html

// Object.defineProperty(对象，属性，属性描述符)
  var obj = {};
  console.log('obj:', obj);
  // 默认不可删除，不可枚举，不可修改
  Object.defineProperty(obj, 'name', {
    value: 'Jameswain'
  });
  console.log('obj默认值:', obj);
  delete obj.name;
  console.log('obj删除后:', obj);
  console.log('obj枚举:', Object.keys(obj));
  obj.name = '詹姆斯，韦恩';
  console.log('obj修改后:', obj);
  // 不能重新定义，会报重复定义错误: Uncaught TypeError: Cannot redefine property: name
  Object.defineProperty(obj, 'name', {
    value: '詹姆斯，韦恩'
  });
```
**运行结果：**

![02](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/02.jpg)

​		从运行结果可以发现，使用Object.defineProperty()定义的属性，默认是不可以被修改，不可以被枚举，不可以被删除的。可以与常规的方式定义属性对比一下：如果不使用Object.defineProperty()定义的属性，默认是可以修改、枚举、删除的：

```javascript
 const obj = {};
 obj.name = 'Jameswain';
 console.log('枚举：', Object.keys(obj));
 obj.name = '詹姆斯-韦恩';
 console.log('修改：', obj);
 delete obj.name;
 console.log('删除：', obj);
```

![03](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/03.jpg)



## demo02 - 属性描述符

```javascript
// JavaScript/Object.defineProperty/demo02-descriptor.html
  const o = {};
  Object.defineProperty(o, 'name', {
    value: 'Jameswain',   // name属性值
    writable: true,       // 可以被修改
    enumerable: true,     // 可以被枚举
    configurable: true,   // 可以被删除
  });
  console.log(o);
  console.log('枚举：', Object.keys(o));
  o.name = '詹姆斯-韦恩';
  console.log('修改：', o);
  Object.defineProperty(o, 'name', {
    value: 'Po'
  });
  console.log('修改：', o);
  delete o.name;
  console.log('删除：', o);
```

**运行结果：**

![04](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/04.jpg)

**⚠️注意：如果writable为false，configurable为true时，通过o.name = "詹姆斯-韦恩"是无法修改成功的，但是使用Object.defineProperty()修改是可以成功的代码如下：**

```javascript
 const o = {};
  Object.defineProperty(o, 'name', {
    value: 'Jameswain',   // name属性值
    writable: false       // 不可被修改
    enumerable: true,     // 可以被枚举
    configurable: true,   // 可以被删除
  });
  console.log(o);
  console.log('枚举：', Object.keys(o));
  o.name = '詹姆斯-韦恩';
  console.log('修改：', o);
  Object.defineProperty(o, 'name', {
    value: 'Po'
  });
  console.log('修改：', o);
  delete o.name;
  console.log('删除：', o);
```

![05](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/05.jpg)

**⚠️注意：如果writable和configurable都为false时，如果使用Object.defineProperty()修改属性值会报错：Cannot redefine property: name**

```javascript
const o = {};
  Object.defineProperty(o, 'name', {
    value: 'Jameswain',   // name属性值
    writable: false,       // 不可被修改
    enumerable: true,     // 可以被枚举
    configurable: false,   // 不可被删除
  });
  console.log(o);
  console.log('枚举：', Object.keys(o));
  o.name = '詹姆斯-韦恩';
  console.log('修改：', o);
  Object.defineProperty(o, 'name', {
    value: 'Po'
  });
  console.log('修改：', o);
  delete o.name;
  console.log('删除：', o);
```

![06](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/06.jpg)



## demo03 - enumerable

```javascript
// JavaScript/Object.defineProperty/demo03-enumerable.html
const o = {};
Object.defineProperty(o, 'name', { value: 'Jameswain', enumerable: true });
Object.defineProperty(o, 'trim', { value: (str) => { return str.trim() }, enumerable: false });
Object.defineProperty(o, 'email', { value: 'Jameswain@163.com' });
o.skill = 'node.js';
console.log('枚举：', Object.keys(o));
console.log('trim: ', o.trim('      8888       ') + '1')
console.log(`o.propertyIsEnumerable('name'): `, o.propertyIsEnumerable('name'));
console.log(`o.propertyIsEnumerable('trim'): `, o.propertyIsEnumerable('trim'));
console.log(`o.propertyIsEnumerable('email'): `, o.propertyIsEnumerable('email'));
```

![07](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/07.jpg)



## demo04 - set 和 get

**⚠️注意：设置set或者get，就不能在设置value和wriable，否则会报错**

```javascript
 const o = {
    __name: ''
  };
  Object.defineProperty(o, 'name', {
    enumerable: true,
    configurable: true,
    // writable: true,    // 如果设置了get或者set，writable和value属性必须注释掉
    // value: '',         // writable和value无法与set和get共存
    get: function () {    // 如果设置了get 或者 set 就不能设置writable和value
      console.log('get', this);
      return 'My name is ' + this.__name;
    },
    set: function (newVal) {
      localStorage.setItem('name', newVal);
      console.log('set', newVal);
      this.__name = newVal;
    }
  });
  console.log(o);
  o.name = 'Jameswain';
  o.name;
  console.log(o);
  o.name = '詹姆斯-韦恩';
  console.log(o);
```

![08](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/08.jpg)



## demo05 - set 和 get 数据驱动视图

​		我们可以利用set和get实现数据驱动视图变化功能，主要通过监听属性，属性变化时更新视图，获取数据从视图中获取：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>set & get 数据驱动视图</title>
</head>
<body>
  <div id="name"></div>
  <div id="skills"></div>
  <script type="text/javascript">
    const profile = {};
    Object.defineProperty(profile, 'name', {
      enumerable: true,
      configurable: true,
      get: function () {
        return document.querySelector('#name').innerHTML;
      },
      set: function (newVal) {
        document.querySelector('#name').innerHTML = newVal;
      }
    });
    Object.defineProperty(profile, 'skills', {
      get: () => document.querySelector('#skills').innerHTML.split(','),
      set: newVal => document.querySelector('#skills').innerHTML = newVal.toString()
    });
  </script>
</body>
</html>
```

**运行结果：**

![09](https://raw.githubusercontent.com/Jameswain/blog/master/JavaScript/Object.defineProperty/docs/09.jpg)

​		从运行结果中，我们可以发现profile.skills属性是一个数组，如果直接更新整个数组内容是可以驱动视图变化的，但是如果更新数组对象中的某个元素是不会触发set函数的。
