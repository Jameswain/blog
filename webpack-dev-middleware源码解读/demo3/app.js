const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// 读取index.html文件
const htmlIndex = fs.readFileSync(path.resolve(__dirname,'index.html'));
// 读取图片
const img = fs.readFileSync(path.resolve(__dirname, 'node.jpg'));

app.use((req, res, next) => {
    console.log(req.url)
    if (req.url === '/' || req.url === '/index.html') {
        res.setHeader("Content-Type", 'text/html;charset=UTF-8');
        res.setHeader("Content-Length", htmlIndex.length);
        res.send(htmlIndex);    // 传送HTTP响应
        // res.end();           // 此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。 必须在每个响应上调用此 response.end() 方法。
        // res.sendFile(path.resolve(__dirname, 'index.html'));    //传送指定路径的文件 -会自动根据文件extension设定Content-Type
    } else if (req.url === '/node.jpg') {
        res.end(img);   // 此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。 必须在每个响应上调用此 response.end() 方法。
    }
});

app.listen(3000, () => console.log('express 服务启动成功。。。'));

//浏览器访问：http://localhost:3000/node.jpg
//浏览器访问：http://localhost:3000/
