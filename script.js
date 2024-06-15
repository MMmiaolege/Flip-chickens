window.onload = function () {
    let diff = document.getElementsByClassName("diff");
    let row, col;
    let maxSteps;
    let stepsLeft;
    let matchedPairs = 0;
    let flag = 0;
    let first, second;
    let table = document.getElementById("table");
    let outer = document.getElementById("outer");
    let memoryStartTime, memoryEndTime;
    let gameStarted = false;
    let difficultyScore = 0;
    let difficulty = "";

    // 创建步数显示元素
    let stepsDisplay = document.getElementById("stepsDisplay");

    // 创建记忆完成按钮
    let memoryButton = document.getElementById("memoryButton");

    // 创建排行榜显示元素
    let leaderboardDisplay = document.getElementById("leaderboardDisplay");
    updateLeaderboardDisplay();

    for (let i = 0; i < diff.length; i++) {
        diff[i].onclick = function () {
            row = 2;
            col = 4;
            difficulty = this.innerText;
            switch (difficulty) {
                case "简单":
                    difficultyScore = 50;
                    maxSteps = 20;
                    break;
                case "中等":
                    difficultyScore = 100;
                    maxSteps = 40;
                    break;
                case "困难":
                    difficultyScore = 200;
                    maxSteps = 80;
                    break;
                case "特难":
                    difficultyScore = 600;
                    maxSteps = 160;
                    break;
            }
            for (let j = 0; j < diff.length; j++) {
                diff[j].style.border = "1px solid black";
            }
            this.style.border = "3px solid blue";
            row = row + parseInt(this.id.substring(4));
            col = col + parseInt(this.id.substring(4));
            document.documentElement.style.setProperty('--col', col);
            console.log(row, col);
            createSection();
            initPicArr();
            memoryStartTime = new Date();
            memoryButton.style.display = "block";
            stepsLeft = maxSteps;
            matchedPairs = 0;
            updateStepsDisplay();
            gameStarted = false;
            stepsDisplay.style.display = "none";  // 隐藏步数显示
        }
    }

    function createSection() {
        table.innerHTML = "";
        for (let i = 0; i < row; i++) {
            let tr = document.createElement("tr");
            table.appendChild(tr);
            for (let j = 0; j < col; j++) {
                let td = document.createElement('td');
                tr.appendChild(td);
                td.id = "td" + i + j;
                td.style.background = "url(./img/back.png)";
                td.style.backgroundSize = "100% 100%";
            }
        }
    }

    let picArr;
    function initPicArr() {
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
    }

    // 添加记忆完成按钮的事件监听器
    memoryButton.onclick = function () {
        memoryEndTime = new Date();
        gameStarted = true;
        memoryButton.style.display = "none";
        stepsDisplay.style.display = "block";  // 显示步数显示

        // 盖上所有图片
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let td = document.getElementById("td" + i + j);
                td.style.background = "url(./img/back.png)";
                td.style.backgroundSize = "100% 100%";
            }
        }

        playGame();
    };

    function playGame() {
        let allTD = document.getElementsByTagName("td");
        for (let i = 0; i < allTD.length; i++) {
            allTD[i].onclick = compare;
        }
    }

function compare() {
    if (!gameStarted) return;

    outer.style.display = "block";
    this.onclick = null;

    let r = this.id.substring(2, 3);
    let c = this.id.substring(3);
    this.style.background = "url(./img/" + picArr[r][c] + ")";
    this.style.backgroundSize = "100% 100%";

    // 第一次点击
    if (flag == 0) {
        flag = 1;
        first = this;
        setTimeout(function () {
            outer.style.display = "none";
        }, 500);
    } else {
        // 如果第二次点击的是同一个格子，则取消选择
        if (first === this) {
            flag = 0;
            this.style.background = "url(./img/back.png)";
            this.style.backgroundSize = "100% 100%";
            this.onclick = compare;
            setTimeout(function () {
                outer.style.display = "none";
            }, 500);
            return;
        }

        // 第二次点击
        flag = 0;
        second = this;

        // 如果匹配成功
        if (first.style.background == second.style.background) {
            matchedPairs++;
            outer.style.display = "block";
            setTimeout(function () {
                first.style.visibility = "hidden";
                second.style.visibility = "hidden";
                outer.style.display = "none";

                // 检查是否已经完成游戏
                if (matchedPairs == (row * col) / 2) {
                    let memoryTime = Math.floor((memoryEndTime - memoryStartTime) / 1000);
                    let score = difficultyScore - memoryTime + stepsLeft;
                    alert(`你过关！你的得分是：${score}`);
                    let playerName = prompt("请输入你的名字：");
                    saveScore(playerName, score, difficulty);
                    updateLeaderboardDisplay();
                }
            }, 50);
        } else {
            // 如果匹配失败
            outer.style.display = "block";
            setTimeout(function () {
                first.style.background = "url(./img/back.png)";
                first.style.backgroundSize = "100% 100%";
                second.style.background = "url(./img/back.png)";
                second.style.backgroundSize = "100% 100%";
                first.onclick = compare;
                second.onclick = compare;
                outer.style.display = "none";
            }, 50);
        }

        // 减少步数并检查步数
        stepsLeft--;
        updateStepsDisplay();
        if (stepsLeft <= 0 || stepsLeft < (row * col - matchedPairs) / 2) {
            alert("游戏结束！步数不足以完成游戏。");
            resetGame();
        }
    }
}

    function updateStepsDisplay() {
        stepsDisplay.innerText = `剩余步数: ${stepsLeft}`;
    }

    function resetGame() {
        table.innerHTML = "";
        stepsDisplay.style.display = "none";
        memoryButton.style.display = "none";
        gameStarted = false;
        for (let i = 0; i < diff.length; i++) {
            diff[i].style.border = "1px solid black";
        }
    }

    function saveScore(name, score, difficulty) {
        let scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push({ name: name, score: score, difficulty: difficulty });
        scores.sort((a, b) => b.score - a.score);
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    function updateLeaderboardDisplay() {
        let scores = JSON.parse(localStorage.getItem("scores")) || [];
        leaderboardDisplay.innerHTML = "<h2>排行榜</h2><ol>";

        scores.forEach((record, index) => {
            let listItem = document.createElement("li");
            listItem.innerHTML = `${record.name} - ${record.score} 分 (${record.difficulty}) 
                                  <button onclick="deleteScore(${index})">删除</button>`;
            leaderboardDisplay.appendChild(listItem);
        });

        leaderboardDisplay.innerHTML += "</ol>";
    }

    function deleteScore(index) {
        let scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.splice(index, 1);
        localStorage.setItem("scores", JSON.stringify(scores));
        updateLeaderboardDisplay();
    }
}
