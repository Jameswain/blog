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
    console.log('服务启动成功！', 'http://127.0.0.1:9000/');
});
