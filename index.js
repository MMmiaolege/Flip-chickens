window.onload = function () {
    let diff = document.getElementsByClassName("diff");
    let row, col;
    let maxSteps = 20; // 设置步数限制
    let stepsLeft = maxSteps;
    let matchedPairs = 0; // 计数器
    let flag = 0;
    let first, second;
    let table = document.getElementById("table");
    let outer = document.getElementById("outer");

    // 创建步数显示元素
    let stepsDisplay = document.createElement("div");
    stepsDisplay.id = "stepsDisplay";
    document.body.appendChild(stepsDisplay);
    updateStepsDisplay();

    for (let i = 0; i < diff.length; i++) {
        diff[i].onclick = function () {
            row = 2;
            col = 4;
            for (let j = 0; j < diff.length; j++) {
                diff[j].style.border = "1px solid black";
            }
            this.style.border = "3px solid blue";
            row = row + parseInt(this.id.substring(4));
            col = col + parseInt(this.id.substring(4));
            document.documentElement.style.setProperty('--col', col);
            console.log(row, col);
            creatSection();
            initpicArr();
            playGame();
            stepsLeft = maxSteps; // 重置步数限制
            matchedPairs = 0; // 重置匹配计数器
            updateStepsDisplay();
        }
    }

    function creatSection() {
        table.innerHTML = "";
        for (let i = 0; i < row; i++) {
            let tr = document.createElement("tr");
            table.appendChild(tr);
            for (let j = 0; j < col; j++) {
                let td = document.createElement('td');
                tr.appendChild(td);
                td.id = "td" + i + j; //与数组图片对应下标
                td.style.background = "url(./img/back.png)";
                td.style.backgroundSize = "100% 100%";
            }
        }
    }

    let picArr;
    function initpicArr() {
        picArr = [];
        for (let i = 0; i < row; i++) {
            picArr[i] = [];
            for (let j = 0; j < col / 2; j++) {
                let num = Math.floor(Math.random() * 9);
                picArr[i].push("pic" + num + ".png");
                picArr[i].push("pic" + num + ".png");
            }
        }
        // 打乱图片位置
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let r = Math.floor(Math.random() * row);
                let c = Math.floor(Math.random() * col);
                let tmp = picArr[r][c];
                picArr[r][c] = picArr[i][j];
                picArr[i][j] = tmp;
            }
        }
        console.log(picArr);

        // 显示所有图片
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let td = document.getElementById("td" + i + j);
                td.style.background = "url(./img/" + picArr[i][j] + ")";
                td.style.backgroundSize = "100% 100%";
            }
        }

        // 3秒后盖上所有图片
        setTimeout(function () {
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < col; j++) {
                    let td = document.getElementById("td" + i + j);
                    td.style.background = "url(./img/back.png)";
                    td.style.backgroundSize = "100% 100%";
                }
            }
        }, 3000);
    }

    function playGame() {
        let allTD = document.getElementsByTagName("td");
        for (let i = 0; i < allTD.length; i++) {
            allTD[i].onclick = compare;
        }
    }

    function compare() {
        if (stepsLeft <= 0) {
            alert("游戏结束，你的步数已用完！");
            return;
        }

        this.onclick = null;
        console.log(this.id);
        let r = this.id.substring(2, 3);
        let c = this.id.substring(3);
        console.log(r, c); // 控制台检查
        this.style.background = "url(./img/" + picArr[r][c] + ")";
        this.style.backgroundSize = "100% 100%";
        // 第一次
        if (flag === 0) {
            flag = 1;
            first = this; // 存储第一次点击对象
            console.log(first.id);
        } else { // 第二次
            flag = 0;
            second = this;
            // 如果第一次和第二次相等
            console.log(second.id);
            if (first.style.background === second.style.background) {
                matchedPairs++;
                setTimeout(function () {
                    first.style.visibility = "hidden";
                    second.style.visibility = "hidden";
                    checkGameComplete(); // 检查是否完成游戏
                }, 50);
            } else {
                setTimeout(function () {
                    first.style.background = "url(./img/back.png)";
                    first.style.backgroundSize = "100% 100%";
                    second.style.background = "url(./img/back.png)";
                    second.style.backgroundSize = "100% 100%";
                    first.onclick = compare;
                    second.onclick = compare;
                }, 500);
            }
            stepsLeft--;
            updateStepsDisplay();
        }
    }

    function checkGameComplete() {
        if (matchedPairs === (row * col) / 2) {
            alert("恭喜你，通关了！");
        }
    }

    function updateStepsDisplay() {
        stepsDisplay.innerText = "剩余步数: " + stepsLeft;
    }
}
