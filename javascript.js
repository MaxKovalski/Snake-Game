const height = 55;
const width = 60;
const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
let snakeInterval;
let timerInterval;
let cherryTimeout;
let direction;
let snake = [6, 5, 4, 3, 2, 1, 0];
let head = snake[0];
let itsGameOver = false;
const rightBorders = [];
const leftBorders = [];
let random;
let random1;
const score = document.getElementById("score");
const easy = document.getElementById("easy");
const normal = document.getElementById("normal");
const hard = document.getElementById("hard");
const level = document.getElementById("level");
const lives = document.getElementById("lives");
let liveCounter = 0;
let points = 0;
let snakeSpeed = 250;
let snakeBackToNormal = 250;
let cherrySpeedUp = 0;
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
  setRandomBerry();
  setRandomCherry();
}
function color() {
  const cells = board.querySelectorAll("div");
  cells.forEach((element) => element.classList.remove("snake", "head"));
  snake.forEach((num) => cells[num].classList.add("snake"));
  cells[head].classList.add("head");
}
function move(dir) {
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
      if (liveCounter == 3) {
        gameOver();
        return;
      }
      removeLive();
      liveCounter++;
      snake.reverse();
      head = snake[0];
      color();
      clearInterval(snakeInterval);
      direction = "down";
      return;
    }
  } else if (dir === "right") {
    if (direction === "left") {
      return;
    }
    head--;
    if (rightBorders.includes(head)) {
      if (liveCounter == 3) {
        gameOver();
        return;
      }
      removeLive();
      liveCounter++;
      snake.reverse();
      head = snake[0];
      color();
      clearInterval(snakeInterval);
      direction = "left";
      return;
    }
  } else if (dir === "left") {
    if (direction === "right") {
      return;
    }
    head++;
    if (leftBorders.includes(head)) {
      if (liveCounter == 3) {
        gameOver();
        return;
      }
      removeLive();
      liveCounter++;

      snake.reverse();
      head = snake[0];
      color();
      clearInterval(snakeInterval);
      direction = "right";

      return;
    }
  } else if (dir === "down") {
    if (direction === "up") {
      return;
    }
    head += width;
    if (!cells[head]) {
      if (liveCounter == 3) {
        gameOver();
        return;
      }
      removeLive();
      liveCounter++;
      snake.reverse();
      head = snake[0];
      color();
      clearInterval(snakeInterval);
      direction = "up";
      return;
    }
  }
  if (snake.includes(head)) {
    if (liveCounter == 3) {
      gameOver();
      return;
    }
    removeLive();
    liveCounter++;
    snake.reverse();
    head = snake[0];
    color();
    clearInterval(snakeInterval);
    direction = "up";
    return;
  }
  snake.unshift(head);
  direction = dir;
  if (random == head) {
    scorePointBerry();
    setRandomBerry();
    clearInterval(timerInterval);
    resetTimer();
    if (snakeSpeed <= 70) {
      return;
    }
    snakeSpeed -= 2;
    snakeBackToNormal -= 2;
  } else if (random1 == head) {
    if (points == 701) {
      cells.forEach((element) => element.classList.remove("cherry"));
      return;
    } else {
      scorePointCherry();
      setRandomCherry();
      clearInterval(timerInterval);
      resetTimer();
      snakeSpeed -= 2;
      snakeBackToNormal -= 2;
    }
  } else {
    snake.pop();
  }
  startAuto();
  color();
}
// move with keys
window.addEventListener("keydown", (event) => {
  event.preventDefault();
  switch (event.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowRight":
      move("left");
      break;
    case "ArrowLeft":
      move("right");
      break;
    case "ArrowDown":
      move("down");
      break;
  }
});
// Auto move Snake
function startAuto() {
  clearInterval(snakeInterval);
  snakeInterval = setInterval(() => {
    move(direction);
  }, snakeSpeed);
}
// Random Berry
function setRandomBerry() {
  random = Math.floor(Math.random() * (width * height));

  if (snake.includes(random)) {
    setRandomBerry();
  } else {
    const cells = board.querySelectorAll("div");
    cells.forEach((element) => element.classList.remove("blueberry"));
    cells[random].classList.add("blueberry");
  }
}
// Random Cherry
function setRandomCherry() {
  random1 = Math.floor(Math.random() * (width * height));

  if (snake.includes(random1)) {
    setRandomCherry();
  } else {
    const cells = board.querySelectorAll("div");
    cells.forEach((element) => element.classList.remove("cherry"));
    cells[random1].classList.add("cherry");
  }
}
function scorePointBerry() {
  points += 10;
  score.innerHTML = points;
}
function scorePointCherry() {
  points += 20;
  score.innerHTML = points;
  snakeSpeed = 52;
  clearInterval(cherryTimeout);
  cherryTimeout = setTimeout(() => {
    snakeSpeed = snakeBackToNormal;
  }, cherrySpeedUp);
}
// live remove
function removeLive() {
  lives.removeChild(lives.firstElementChild);
}
// Game Over Function
function gameOver() {
  itsGameOver = true;
  alert("game over");
  location.reload();
}
// Timer Setting
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
function resetTimer() {
  seconds;
  display = document.querySelector("#time");
  timeSetting(seconds, display);
}
// Difficult Button
easy.addEventListener("click", () => {
  cherrySpeedUp = 3500;
  (seconds = 45), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
});
normal.addEventListener("click", () => {
  cherrySpeedUp = 4500;
  (seconds = 30), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
  liveCounter = 1;
  removeLive();
});
hard.addEventListener("click", () => {
  cherrySpeedUp = 5500;
  (seconds = 10), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
  liveCounter = 2;
  removeLive();
  removeLive();
});
