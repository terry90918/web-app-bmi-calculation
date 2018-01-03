// 時間
var date = new Date();
var year = date.getFullYear();
var month = addZero((date.getMonth() + 1), 2);
var day = addZero(date.getDate(), 2);

// 身高
var peopleHeight = document.querySelector("#peopleHeight");
// 體重
var peopleWeight = document.querySelector("#peopleWeight");
// BMI
var calculatorBMI = document.querySelector("#calculatorBMI");
// 列表
var list = document.querySelector(".grid-listView");
// 資料
var data = JSON.parse(localStorage.getItem("BmiData")) || [];

// 補 0 讓數字對齊
function addZero(num, digit) {
    var numString = String(num);
    while (numString.length < digit) {
        numString = '0' + numString;
    }
    return numString;
}

// 分析 BMI 的數值
function analysisBMI(e) {
    e.preventDefault();
    // 體重(公斤)
    var w = parseInt(peopleWeight.value);
    // 身高(公尺)
    var h = parseInt(peopleHeight.value) / 100;
    // BMI = 體重/身高平方
    var bmi = (w / Math.pow(h, 2)).toFixed(2);
    var bmiText, colorClass;
    if (bmi < 18.5) {
        bmiText = "過輕"
        colorClass = "thin";
    } else if (bmi >= 18.5 && bmi < 24) {
        bmiText = "理想"
        colorClass = "nice";
    } else if (bmi >= 24 && bmi < 27) {
        bmiText = "過重"
        colorClass = "tooHeavy";
    } else if (bmi >= 27 && bmi < 30) {
        bmiText = "輕度肥胖"
        colorClass = "aLittleFat";
    } else if (bmi >= 30 && bmi < 35) {
        bmiText = "中度肥胖"
        colorClass = "mediumFat";
    } else if (bmi >= 35) {
        bmiText = "重度肥胖"
        colorClass = "seriousObesity";
    } else {
        bmi = 0;
        alert("請輸入數字！");
    }

    if (bmi) {
        if (calculatorBMI.classList.contains("level")) {
            calculatorBMI.classList.remove("level", "thin", "nice", "tooHeavy", "aLittleFat", "mediumFat", "seriousObesity");
            calculatorBMI.textContent = "看結果";
            peopleWeight.value = "";
            peopleHeight.value = "";
            return;
        } else {
            calculatorBMI.classList.add("level", colorClass);
            calculatorBMI.textContent = bmiText;
            addData(w, h, bmi, bmiText, colorClass);
        }
    }
}

// 將資料回傳 DOM
function addData(weight, height, bmiVal, bmiText, color) {
    var time = month + "-" + day + "-" + year;
    var todo = {
        w: weight,
        h: height,
        bV: bmiVal,
        bT: bmiText,
        c: color,
        t: time
    };
    data.push(todo);
    updateList(data);
    localStorage.setItem("BmiData", JSON.stringify(data));
}

// 將 localstorage 資料帶入 DOM
function updateList(items) {
    var str = "";
    var len = items.length;
    for (var i = 0; i < len; i++) {
        str +=
        `<li class="${items[i].c}">
            <div class="grid-item">${items[i].bT}</div>
            <div class="grid-item"><em class="emi">BMI</em><span class="emiNum">${items[i].bV}</span></div>
            <div class="grid-item"><em class="weight">體重</em><span class="weightNum">${items[i].w}</span> kg</div>
            <div class="grid-item"><em class="height">身高</em><span class="heightNum">${items[i].h}</span> m</div>
            <div class="grid-item"><em class="date">${items[i].t}</em></div>
            <div class="grid-item"><button class="btn btn-danger" data-index="${i}">刪除</button></div>
        </li>`;
    }
    list.innerHTML = str;
}

// 刪除事件
function toggleDone(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'BUTTON') {
        return
    };
    var index = e.target.dataset.index;
    console.log(e.target.dataset.index);
    data.splice(index, 1);
    localStorage.setItem('BmiData', JSON.stringify(data));
    updateList(data);
}

// BMI 計算監聽
calculatorBMI.addEventListener("click", analysisBMI, false);
// 刪除項目監聽
list.addEventListener("click", toggleDone, false);
// 更新資料
updateList(data);