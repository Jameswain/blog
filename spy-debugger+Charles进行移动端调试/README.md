# 简介

​		移动端调试一直都是一个痛点，因为移动终端对于我们来说是一个黑盒，它无法像PC端一样，我们可以通过F12很方便的调出开发者工具。在开发中经常会遇到同样一份代码在某个型号的手机上运行出现错误，其他手机都好好的，开发的时候Chrome上也没有报错。如果没有调试工具这种情况下我们就很难定位问题，接下来的主题就是介绍如何使用[spy-debugge](https://github.com/wuchangming/spy-debugger#readme)r + [Charles](https://www.charlesproxy.com/)进行移动端调试。

# 安装

**第1步：**全局安装 spy-debugger

```
npm install spy-debugger -g
```

# spy-debugger 证书

其实`spy-debugger`的代理是基于`node-mitmproxy`模块实现的，这里安装的证书其实是`node-mitmproxy`的证书，标题写`spy-debugger`证书是为了和`Charels`证书区分开来避免混淆。

##电脑安装证书

**第1步：**在命令行中执行`spy-debugger`启动`spy-debugger`服务，启动成功后，检查你的用户目录（home目录），会发现多了一个`node-mitmproxy`文件夹，这个文件夹内放的就是代理需要的证书。

我Mac电脑完整的路径是：`/Users/jameswain/node-mitmproxy`

![01](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/01.jpg)

**第2步：**在启动spy-debugger服务的电脑上安装证书，双击`node-mitmproxy.ca.crt`文件

![02](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/02.jpg)

**第3步：**双击`node-mitmproxy CA` 选择为 `始终信任`

![03](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/03.jpg)

**第4步：**输入你电脑的用户密码

![04](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/04.jpg)

出现这个+号表示证书已经安装成功

![05](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/05.jpg)

## IOS手机安装证书

**第1步：**首先需要将`node-mitmproxy.ca.crt`上传到手机上，可以通过`live-server` 在`node-mitmproxy.ca.crt`文件所在的目录下启动这个服务。如果你还没有`live-server`命令，可以通过以下命令进行安装：

```shell
npm i -g live-server
```

在`/Users/jameswain/node-mitmproxy`目录下执行`live-server`命令

![06](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/06.jpg)

**第2步：**在手机浏览器上访问这个服务，输入我电脑的IP地址和端口进行访问，⚠️手机和电脑必须是连接同一个WiFi网络才可以访问。

**点击`node-mitmproxy.ca.crt`文件进行下载安装**

![07](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/07.jpg)

![08](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/08.jpg)

**第3步：**在手机的 `设置` > `通用` > `描述文件与设备管理` 找到`node-mitmproxy CA` 证书，并点击安装

![09](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/09.jpg)

**输入手机锁屏密码**：

![10](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/10.jpg)

**选择安装**

![11](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/11.jpg)

**第4步：**在手机的 `设置` > `通用` > `关于本机` > `证书信任设置` 将 `node-mitmproxy CA` 打开

![12](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/12.jpg)![13](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/13.jpg) 

此时，spy-debugger的前期准备工作就已经全部完成了

# Charles 证书

这里简单介绍一下`Charles`的证书安装，如果你已经是`Charles`的老手了，可以直接跳过。`Charles`如果不安装证书的话是无法抓`https`的请求的。

## 电脑安装证书

**第1步：**点击Charles的`Help` > `SSL Proxying` > `Install Charles Root Cetificate` 然后就会弹出证书安装页面，将Charles的证书设置为始终信任即可：

![14](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/14.jpg)

![15](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/15.jpg)

**第2步：**点击Charles的`Proxy` > `Access Control Settings` 进行配置让手机连接代理时，不需要点允许连接确认操作。

![21](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/21.jpg)

上述配置，表示允许任意IP的设备连接该代理服务，不会有允许连接确认对话框。

##IOS手机安装证书

**第1步：**点击Charles的`Help` > `SSL Proxying` > `Install Charles Root Cetificate on a Mobile Device or Remote Browser ` 然后会弹出一个对话框，告诉你手机要设置的代理IP地址和端口，**⚠️注意：手机和电脑必须连接同一个WiFi才可以。**

![16](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/16.jpg)

![17](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/17.jpg)

**第2步：**根据提示在手机上配置Wi-Fi网络代理，在手机上点击`设置` > `无线局域网`

![18](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/18.jpg)

**第3步：**点击你当前所连接的WiFi网络

![19](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/19.jpg)

**第4步：**向下滑动，点击`配置代理`，选择`手动`，服务器和端口输入Charles对话显示的IP和端口号，配置好后，记得点击存储。

![20](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/20.jpg)

**第5步：**在`Safari浏览器`输入`chls.pro/ssl` ，下载并安装证书

![22](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/23.jpg)

![23](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/22.jpg)

**第6步：**在手机的 `设置` > `通用` > `描述文件与设备管理` 找到`Charles Proxy CA` 证书，点击安装

![24](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/24.jpg)

**第7步：**在手机的 `设置` > `通用` > `关于本机` > `证书信任设置` 将 `Charles Proxy CA` 打开

![25](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/25.jpg)

此时，Charles所有的准备工作都完成了，接下来我们就可以启动spy-debugger进行移动端H5调试了。



#启动spy-debugger 

**第1步：**启动命令

```shell
spy-debugger -e http://127.0.0.1:8888  // 启动spy-debugger服务，并设置外部代理为Charles的服务
```

![26](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/26.jpg)

上述命令表示启动spy-debugger调试服务，并将所有的资源请求都转发到Charles的代理服务上。其实我们打开Charles程序的时候，它实际上是在本地启动了一个http的服务，监听在8888端口上。

**第2步：**在手机上设置代理服务器和端口为`spy-debugger`的IP和端口:

![27](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/27.jpg)

**第3步：**在浏览器打开http://127.0.0.1:59365/client/ 

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/34.jpg)

**第4步：**在京东App里随便找一个H5页面打开，或者在手机浏览器上打开 https://m.jd.com/

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/31.jpg)

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/33.jpg)

**第5步：**此时在浏览器上的Remote选项卡上就可以看到，连接的终端了

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/28.jpg)

**第6步：**我们可以在Elements选项上进行页面元素的选择和调试，可以发现我们鼠标放到元素上，手机端上会实时看到选中效果

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/29.jpg)

**第7步：**我们还可以在Console选项卡下查看代码输出的console信息，我们也可以这里输入页面要执行的代码

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/30.jpg)

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/32.jpg)

**第8步：**此时我们发现所有的请求都被转发到了Charles上

![](https://raw.githubusercontent.com/Jameswain/blog/master/spy-debugger%2BCharles%E8%BF%9B%E8%A1%8C%E7%A7%BB%E5%8A%A8%E7%AB%AF%E8%B0%83%E8%AF%95/docs/35.jpg)

OK，到这里spy-debugger + Charles进行移动端调试的接入流程就介绍完了，更多关于`spy-debugger`的功能和使用方法，可以参考[spy-debuger的官方README](https://www.npmjs.com/package/spy-debugger)

