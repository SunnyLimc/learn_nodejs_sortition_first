const addItemBtn = document.getElementById('add-item').getElementsByTagName('button')[0];
const addResultBtn = document.getElementById('add-result').getElementsByTagName('button')[0];
const addItemInput = document.getElementById('add-item').getElementsByTagName('input')[0];
const addResultInput = document.getElementById('add-result').getElementsByTagName('input')[0];
const notice = document.getElementsByClassName('notice')[0];
const tbody = document.getElementsByTagName("tbody")[0];
const submitBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");
const result = document.getElementsByClassName('result');
const resultList = document.getElementsByClassName('result-list')[0];


delBtnIcon = "<button class='del'></button>";
plusBtnIcon = "<button class='plus'></button>";
minusBtnIcon = "<button class='minus'></button>";
rCnt = 0; // currency row count
resultCnt = 0;
string = "";
resultArry = new Array();

function clearResult() {
    for (var i = 0; i < rCnt; i++) {
        result[i].innerHTML = "";
    }
}
function clearResultInput() {
    addResultInput.value = "";
}
function clearResultList() {
    for (var i = 0; i < rCnt; i++) {
        resultList.innerHTML = "";
    }
    resultArry = {};
    resultCnt = 0;
}
function clearNotice() {
    notice.innerHTML = "";
}
function addCnt(obj) {
    clearNotice();
    var i = obj.parentNode.getElementsByTagName('span')[0];
    // cnt = document.getElementsByClassName('count')[i];
    var tmp = parseInt(i.innerHTML) + 1;
    i.innerHTML = tmp;
}
function minusCnt(obj) {
    clearNotice();
    var i = obj.parentNode.getElementsByTagName('span')[0];
    // cnt = document.getElementsByClassName('count')[i];
    var tmp = parseInt(i.innerHTML) - 1;
    if (tmp < 0) {
        notice.style.color = "red";
        notice.innerHTML = "数量不能为负";
    }
    else
        i.innerHTML = tmp;
}
function delTableRow(obj) {
    clearNotice();
    var i = obj.parentNode.parentNode.rowIndex;
    tbody.deleteRow(i - 1);
    rCnt--;
    // 提示
    notice.style.color = "green";
    notice.innerHTML = "样例删除成功";
}
function addTableRow(req) {
    clearNotice();
    if (rCnt >= 6) {
        notice.style.color = "red";
        notice.innerHTML = "数量超出限制";
    }
    else if (req.length == 0) {
        notice.style.color = "red";
        notice.innerHTML = "内容不能为空";
    }
    else {
        // 定义当前行 // cell是列数
        var row = tbody.insertRow(rCnt);
        var cell0 = row.insertCell(0);
        var cell1 = row.insertCell(1);
        var cell2 = row.insertCell(2);
        // 定义id
        row.id = rCnt;
        // 定义类型
        cell0.className = "item";
        cell1.className = "count";
        cell2.className = "result";
        // 定义按钮内容
        cell0.innerHTML = req + delBtnIcon;
        cell1.innerHTML = "<span>" + 2 + "</span>" + plusBtnIcon + minusBtnIcon;
        cell2.innerHTML = "暂无";
        // 定义按钮事件
        var delBtn = document.getElementsByClassName("item")[rCnt].getElementsByTagName("button")[0];
        var plusBtn = document.getElementsByClassName("count")[rCnt].getElementsByTagName("button")[0];
        var minusBtn = document.getElementsByClassName("count")[rCnt].getElementsByTagName("button")[1];
        delBtn.onclick = function () { delTableRow(this) };
        plusBtn.onclick = function () { addCnt(this) };
        minusBtn.onclick = function () { minusCnt(this) };
        // 提示
        notice.style.color = "green";
        notice.innerHTML = "第" + (rCnt + 1) + "行添加成功";
        // 数量加一
        rCnt++;
        // 清空输入框
        addItemInput.value = "";
    }
}
function converReq() {
    string = "";
    if (rCnt == 0) {
        notice.style.color = "red";
        notice.innerHTML = "不能没有数据";
        return 0;
    }
    for (var i = 0; i < rCnt; i++) {
        var span = tbody.getElementsByClassName('count')[i].getElementsByTagName('span')[0];
        if (span.textContent == "0") {
            notice.style.color = "red";
            notice.innerHTML = "数量不能为0";
            return 0;
        }
        string = string + "arr" + i + "=" + span.textContent + "&";
    }
}
function submitGet() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:8000/submit?' + string, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                notice.style.color = "green";
                notice.innerHTML = "正在处理";
                notice.style.color = "black";
                notice.innerHTML = xhr.responseText;
                outputRes();
                notice.style.color = "green";
                notice.innerHTML = "抽签完成";
            }
        }
    }
}
function outputRes() {
    clearResult();
    string = notice.innerHTML;
    console.log("0")
    for (var i = 0, cnt = 1; i < rCnt; i++) {
        var count = document.getElementsByClassName('count')[i].getElementsByTagName('span')[0].textContent;
        for (var j = 0; j < count; j++) {
            if (j == 0)
                result[i].innerHTML = result[i].innerHTML + resultArry[[string[cnt]]];
            else
                result[i].innerHTML = result[i].innerHTML + "、" + resultArry[[string[cnt]]];
            cnt += 2;
        }
    }
}
function submit() {
    converReq();
    submitGet();
}
function addResult() {
    var input = addResultInput.value;
    if (resultCnt == 0) {
        clearResultList()
        resultList.innerHTML = resultList.innerHTML + input;
    }
    else
        resultList.innerHTML = resultList.innerHTML + "、" + input;
    resultArry[resultCnt] = input;
    resultCnt++;
    clearResultInput()
}
addItemBtn.addEventListener('click', function () { addTableRow(addItemInput.value) });
submitBtn.addEventListener('click', function () { submit() });
addResultBtn.addEventListener('click', function () { addResult(); });


// For Test
function test() {
    for (var i = 0; i < 3; i++) { addTableRow(i); }
}
test();

