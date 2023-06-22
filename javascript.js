const height = 40;
const width = 50;
const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
let interval;
let timerInterval;
let direction;
const snake = [6, 5, 4, 3, 2, 1, 0];
let head = snake[0];
let itsGameOver = false;
const rightBorders = [];
const leftBorders = [];
let random;
const score = document.getElementById("score");
const easy = document.getElementById("easy");
const normal = document.getElementById("normal");
const hard = document.getElementById("hard");
const level = document.getElementById("level");
let points = 0;
let snakeSpeed = 250;
let seconds;
for (let i = 0; i < height; i++) {
  rightBorders.push(i * width - 1);
}
for (let i = 1; i <= height; i++) {
  leftBorders.push(i * width);
}
function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement("div");
    board.appendChild(cell);
  }
  color();
  setRandom();
}
function color() {
  const cells = board.querySelectorAll("div");
  cells.forEach((element) => element.classList.remove("snake", "head"));
  snake.forEach((num) => cells[num].classList.add("snake"));
  cells[head].classList.add("head");
}
function move(dir) {
  startMoving = false;
  if (itsGameOver) {
    return;
  }
  const cells = board.querySelectorAll("div");
  if (dir === "up") {
    if (direction === "down") {
      return;
    }
    head -= width;
    if (!cells[head]) {
      gameOver();
      return;
    }
  } else if (dir === "right") {
    if (direction === "left") {
      return;
    }
    head--;
    if (rightBorders.includes(head)) {
      gameOver();
      return;
    }
  } else if (dir === "left") {
    if (direction === "right") {
      return;
    }
    head++;
    if (leftBorders.includes(head)) {
      gameOver();
      return;
    }
  } else if (dir === "down") {
    if (direction === "up") {
      return;
    }
    if (!cells[head]) {
      gameOver();
      return;
    }
    head += width;
  }
  if (snake.includes(head)) {
    gameOver();
    return;
  }
  snake.unshift(head);
  direction = dir;
  if (random == head) {
    scorePoint();
    setRandom();
    clearInterval(timerInterval);
    resetTimer();
    if (snakeSpeed <= 70) {
      return;
    }
    snakeSpeed -= 2;
  } else {
    snake.pop();
  }
  color();
  startAuto();
}

window.addEventListener("keydown", (event) => {
  event.preventDefault();
  switch (event.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowRight":
      move("right");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowDown":
      move("down");
      break;
  }
});

function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => {
    move(direction);
  }, snakeSpeed);
}

function setRandom() {
  random = Math.floor(Math.random() * (width * height));

  if (snake.includes(random)) {
    setRandom();
  } else {
    const cells = board.querySelectorAll("div");
    cells.forEach((element) => element.classList.remove("blueberry"));
    cells[random].classList.add("blueberry");
  }
}
function scorePoint() {
  points = (snake.length - 7) * 10;
  score.innerHTML = points;
}

function gameOver() {
  itsGameOver = true;
  alert("game over");
  location.reload();
}
function timeSetting(duration, display) {
  let timer = duration,
    minutes,
    seconds;
  timerInterval = setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.innerHTML = minutes + ":" + seconds;
    if (--timer == -2) {
      gameOver();
      return;
    }
  }, 1000);
}
easy.addEventListener("click", () => {
  (seconds = 60), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
});
normal.addEventListener("click", () => {
  (seconds = 30), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
});
hard.addEventListener("click", () => {
  (seconds = 10), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
});
function resetTimer() {
  seconds;
  display = document.querySelector("#time");
  timeSetting(seconds, display);
}
