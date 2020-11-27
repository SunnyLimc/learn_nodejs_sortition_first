const addItemBtn = document.getElementById('add-item').getElementsByTagName('button')[0];
const addResultBtn = document.getElementById('add-result').getElementsByTagName('button')[0];
const addItemInput = document.getElementById('add-item').getElementsByTagName('input')[0];
const addResultInput = document.getElementById('add-result').getElementsByTagName('input')[0];
const notice = document.getElementsByClassName('notice-content')[0];
const noticeDiv = document.getElementsByClassName('notice')[0];
const tbody = document.getElementsByTagName("tbody")[0];
const submitBtn = document.getElementById("submit");
const clearBtn = document.getElementById("clear");
const result = document.getElementsByClassName('result');
const resultList = document.getElementsByClassName('result-list')[0];
const switchBtn = document.getElementsByClassName('switch')[0];
const option = document.getElementsByClassName('option')[0];
delBtnIcon = "<button class='del'></button>";
plusBtnIcon = "<button class='plus'></button>";
minusBtnIcon = "<button class='minus'></button>";
rCnt = 0; // currency row count
resultCnt = 0;
string = "";
resultArry = new Array();
allowStart = 0;
optionDisplay = 0;
timerId = 0;

function showBtn() {
    delBtn = document.getElementsByClassName('del');
    plusBtn = document.getElementsByClassName('plus');
    minusBtn = document.getElementsByClassName('minus');
    for (var i = 0; i < rCnt; i++) {
        delBtn[i].style.display = "inline-block";
        plusBtn[i].style.display = "inline-block";
        minusBtn[i].style.display = "inline-block";
    }
}
function hideBtn() {
    delBtn = document.getElementsByClassName('del');
    plusBtn = document.getElementsByClassName('plus');
    minusBtn = document.getElementsByClassName('minus');
    for (var i = 0; i < rCnt; i++) {
        delBtn[i].style.display = "none";
        plusBtn[i].style.display = "none";
        minusBtn[i].style.display = "none";
    }
}
function showOption() {
    option.style.display = "block";
    switchBtn.innerHTML = "隐藏选项？";
}
function hideOption() {
    option.style.display = "none";
    switchBtn.innerHTML = "显示选项？";
}
function timerNotice(value, color) {
    clearTimeout(timerId);
    noticeDiv.style.display = "block";
    notice.innerHTML = value;
    notice.style.color = color;
    timerId = setTimeout(closeNotice, 4000);
}
function closeNotice() {
    noticeDiv.style.display = "none";
}
function clearResult() {
    for (var i = 0; i < rCnt; i++) {
        result[i].innerHTML = "";
    }
}
function clearResultInput() {
    addResultInput.value = "";
}
function clearResultList() {
    resultList.innerHTML = "";
}
function clearResultListN() {
    resultList.innerHTML = "无";
    resultArry = {};
    resultCnt = 0;
}
function clearNotice() {
    notice.style.color = "black";
    notice.innerHTML = "无";
}
function addCnt(obj) {
    clearNotice();
    var i = obj.parentNode.getElementsByTagName('span')[0];
    var tmp = parseInt(i.innerHTML) + 1;
    i.innerHTML = tmp;
}
function minusCnt(obj) {
    clearNotice();
    var i = obj.parentNode.getElementsByTagName('span')[0];
    var tmp = parseInt(i.innerHTML) - 1;
    if (tmp < 0) {
        timerNotice("数量不能为负", "red");
    }
    else
        i.innerHTML = tmp;
}
function delTableRowLast() {
    tbody.deleteRow(rCnt - 1);
    rCnt--;
}
function delTableRowAll() {
    while (rCnt != 0) {
        delTableRowLast();
    }
}
function delTableRow(obj) {
    clearNotice();
    var i = obj.parentNode.parentNode.rowIndex;
    tbody.deleteRow(i - 1);
    rCnt--;
    // 提示
    timerNotice("样例删除成功", "green");
}
function addTableRow(obj) {
    clearNotice();
    if (rCnt >= 6) {
        timerNotice("数量超出限制", "red");
    }
    else if (obj.length == 0) {
        timerNotice("内容不能为空", "red");
    }
    else if (obj.length > 6) {
        timerNotice("文本长度超过限制(6)", "red");
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
        cell0.innerHTML = obj + delBtnIcon;
        cell1.innerHTML = "<span>" + 0 + "</span>" + plusBtnIcon + minusBtnIcon;
        cell2.innerHTML = "暂无";
        // 定义按钮事件
        var delBtn = document.getElementsByClassName("item")[rCnt].getElementsByTagName("button")[0];
        var plusBtn = document.getElementsByClassName("count")[rCnt].getElementsByTagName("button")[0];
        var minusBtn = document.getElementsByClassName("count")[rCnt].getElementsByTagName("button")[1];
        delBtn.onclick = function () { delTableRow(this) };
        plusBtn.onclick = function () { addCnt(this) };
        minusBtn.onclick = function () { minusCnt(this) };
        delBtn.style.display = "inline-block";
        plusBtn.style.display = "inline-block";
        minusBtn.style.display = "inline-block";
        // 提示
        timerNotice("第" + (rCnt + 1) + "行添加成功", "green");
        // 数量加一
        rCnt++;
        // 清空输入框
        addItemInput.value = "";
    }
}
function converReq() {
    allowStart = 1;
    string = "";
    var countTol = 0;
    if (rCnt == 0) {
        timerNotice("不能没有数据", "red");
        allowStart = 0;
    }
    for (var i = 0; i < rCnt; i++) {
        var span = tbody.getElementsByClassName('count')[i].getElementsByTagName('span')[0];
        if (span.textContent == "0") {
            timerNotice("数量不能为0", "red");
            allowStart = 0;
        }
        countTol += parseInt(span.textContent);
        string = string + "arr" + i + "=" + span.textContent + "&";
    }
    if (countTol != resultCnt) {
        timerNotice("请添加与总数量同样多的结果", "red");
        allowStart = 0;
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
                timerNotice("正在处理", "green");
                timerNotice(xhr.responseText, "black");
                outputRes();
                timerNotice("抽签完成", "green");
            }
        }
    }
}
function outputRes() {
    clearResult();
    string = notice.innerHTML;
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
    if (allowStart == 1)
        submitGet();
}
function addResult() {
    if (addResultInput.value.length == 0) {
        timerNotice("请输入一个非空值", "red");
        return 0;
    }
    else if (addResultInput.value.length > 6) {
        timerNotice("文本长度超过限制(6)", "red");
        return 0;
    }
    if (resultCnt == 0) {
        clearResultList()
        resultList.innerHTML = resultList.innerHTML + addResultInput.value;
    }
    else
        resultList.innerHTML = resultList.innerHTML + "、" + addResultInput.value;
    resultArry[resultCnt] = addResultInput.value;
    resultCnt++;
    timerNotice("添加成功", "green");
    clearResultInput();
}
function clear() {
    delTableRowAll();
    clearResult();
    clearResultInput();
    clearResultListN();
    clearNotice();
    closeNotice();
    timerNotice("全部删除成功", "green");
}
function switchDisplay() {
    if (optionDisplay == 0) {
        showOption();
        showBtn();
        optionDisplay = 1;
    }
    else {
        hideOption();
        hideBtn();
        optionDisplay = 0;
    }
}

addItemBtn.onclick = function () { addTableRow(addItemInput.value) };
submitBtn.onclick = function () { submit() };
addResultBtn.onclick = function () { addResult(); };
clearBtn.onclick = function () { clear(); };
switchBtn.onclick = function () { switchDisplay(); }

// For Test
// function test() {
//     for (var i = 0; i < 3; i++) { addTableRow(i); }
// }
// test();