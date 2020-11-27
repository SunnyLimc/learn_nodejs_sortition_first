const express = require("express");
const querystring = require("querystring");

// 用app代替express
const app = express();

function randomSort(a, b) { return Math.random() > 0.5 ? -1 : 1; }

app.get('/submit', (req, res) => {

    // 设置响应头  设置允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*')
    // 处理
    // for (let i in req.query) {
    // sum += i;
    // }
    var sum = 0;
    arry = new Array();
    obj = new Object();
    for (var i in req.query) {
        sum += parseInt(req.query[i]);
    }
    for (var i = 0; i < sum; i++) {
        arry[i] = i;
    }
    arry.sort(randomSort);
    res.send(arry);
})

app.listen(8000, () => {
    console.log("服务启动，8000端口监听ing...");
})