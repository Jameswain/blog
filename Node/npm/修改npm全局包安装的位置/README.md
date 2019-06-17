# 简介

​	在`macOS`系统下，npm默认的全局安装路径是在`/usr/local/lib/node_modules`下。例如：当我们执行`npm i -g vue-cli`时，实际上是把`vue-cli`这个模块安装到了`/usr/local/lib/node_modules`目录下了。

​	⚠️**注意：** `/usr/local/lib`这个是系统目录，会有权限问题，虽然可以使用`sudo`执行，但是还是有部分机器，即使使用`root`用户执行`npm i -g xxx` 全局安装某个模块还是会出现`EACCES permissions`权限被拒绝问题。

​	🚀**解决办法：** 通过修改npm全局安装模块的路径解决，将npm全局安装模块的路径，修改到当前登陆用户的`HOME`目录下即可，这样用不用`sudo`都不会出现`EACCES permissions`权限被拒绝问题了。

​	⚠️**️注意：本教程不适合Windows系统**

# 操作

##### 0、查看当前npm的默认配置

```shell
npm config ls
```

#####  1、在你的用户主目录下创建.npm-global文件夹作为npm全局安装的目录

```shell
 mkdir ~/.npm-global
```

##### 2、修改npm使用新的全局安装路径

```shell
npm config set prefix '~/.npm-global'
```

##### 3、修改PATH环境变量

```shell
vim ~/.bash_profile  //编辑.bash_profile文件，这个文件是用户登陆终端的时候会自动执行的文件
```

##### 4、在~/.bash_profile文件添加下面这行代码

```shell
export PATH=~/.npm-global/bin:$PATH
```

![](https://raw.githubusercontent.com/Jameswain/blog/master/Node/npm/%E4%BF%AE%E6%94%B9npm%E5%85%A8%E5%B1%80%E5%8C%85%E5%AE%89%E8%A3%85%E7%9A%84%E4%BD%8D%E7%BD%AE/docs/01.jpg)

##### 5、更新系统变量，获取重启命令行终端

```shell
 source ~/.bash_profile
```

##### 6、测试配置，在不使用sodu的情况下全局安装一个包

```shell
npm install -g jshint
```

![](https://raw.githubusercontent.com/Jameswain/blog/master/Node/npm/%E4%BF%AE%E6%94%B9npm%E5%85%A8%E5%B1%80%E5%8C%85%E5%AE%89%E8%A3%85%E7%9A%84%E4%BD%8D%E7%BD%AE/docs/02.jpg)

​	可以看到此后全局安装的模块都被安装到了`/Users/jameswain/.npm-global`目录下了

# 总结

​	其实解决全局安装模块权限不足问题的方法：主要是将npm全局安装模块的目录修改到了用户的主目录下，这样用户不需要sodu也能够全局安装模块，因为它是在自己的主目录下操作，永远不会存在权限问题。
