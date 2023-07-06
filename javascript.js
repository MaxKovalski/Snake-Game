// Constant
const height = 45;
const width = 55;
const rightBorders = [];
const leftBorders = [];
// let!
let snakeInterval;
let timerInterval;
let cherryTimeout;
let direction;
let snake = [6, 5, 4, 3, 2, 1, 0];
let head = snake[0];
let itsGameOver = false;
let liveCounter = 0;
let points = 0;
let snakeSpeed = 250;
let snakeBackToNormal = 250;
let cherrySpeedUp = 0;
let seconds;
let randomBerry;
let randomCherry;
let eatSound = new Audio("./Sounds/Eat.mp3");
let gameOverSound = new Audio("./Sounds/GameOver.mp3");
let soundOnOff = true;
// Get Elements
const board = document.querySelector(".board");
const score = document.getElementById("score");
const easy = document.getElementById("easy");
const normal = document.getElementById("normal");
const hard = document.getElementById("hard");
const level = document.getElementById("level");
const lives = document.getElementById("lives");
const soundId = document.getElementById("soundId");
// The Board
board.style.gridTemplateColumns = `repeat(${width}, 1fr)`;
// Left Right Check
for (let i = 0; i < height; i++) {
  rightBorders.push(i * width - 1);
}
for (let i = 1; i <= height; i++) {
  leftBorders.push(i * width);
}
// Create Board
function createBoard() {
  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement("div");
    board.appendChild(cell);
  }
}
// Snake Color
function color() {
  const cells = board.querySelectorAll("div");
  cells.forEach((element) => element.classList.remove("snake", "head"));
  snake.forEach((num) => cells[num].classList.add("snake"));
  cells[head].classList.add("head");
}
// Snake Moving && Eating && hits Walls
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
      resetTimer();
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
      direction = "left";
      snake.reverse();
      head = snake[0];
      color();
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
      direction = "right";
      snake.reverse();
      head = snake[0];
      color();
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
      direction = "up";
      snake.reverse();
      head = snake[0];
      color();
      return;
    }
  }
  // if snake colliding
  if (snake.includes(head)) {
    if (liveCounter == 3) {
      gameOver();
      return;
    }
    removeLive();
    liveCounter++;
    direction = "down";
    snake.reverse();
    head = snake[0];
    color();
    return;
  }
  snake.unshift(head);
  direction = dir;
  // When Eating
  if (randomBerry == head) {
    eatSound.play();
    scorePointBerry();
    setRandomBerry();
    clearInterval(timerInterval);
    resetTimer();
    if (snakeSpeed <= 70) {
      return;
    }
    snakeSpeed -= 2;
    snakeBackToNormal -= 2;
  } else if (randomCherry == head) {
    eatSound.play();
    if (points > 1000) {
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
  randomBerry = Math.floor(Math.random() * (width * height));

  if (snake.includes(randomBerry)) {
    setRandomBerry();
  } else {
    const cells = board.querySelectorAll("div");
    cells.forEach((element) => element.classList.remove("blueberry"));
    cells[randomBerry].classList.add("blueberry");
  }
}
// Random Cherry
function setRandomCherry() {
  randomCherry = Math.floor(Math.random() * (width * height));

  if (snake.includes(randomCherry)) {
    setRandomCherry();
  } else {
    const cells = board.querySelectorAll("div");
    cells.forEach((element) => element.classList.remove("cherry"));
    cells[randomCherry].classList.add("cherry");
  }
}
// Fruits Score
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
  clearInterval(timerInterval);
  resetTimer();
  clearInterval(snakeInterval);
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
    if (liveCounter == 4) {
      gameOver();
    }
    if (--timer == -1) {
      liveCounter++;
      removeLive();
      clearInterval(timerInterval);
      resetTimer();
      return;
    }
  }, 1000);
}
// reset Timer
function resetTimer() {
  clearInterval(timerInterval);
  seconds;
  display = document.querySelector("#time");
  timeSetting(seconds, display);
}
// Sound On/Off
function soundCheck() {
  if (soundOnOff) {
    eatSound.muted = true;
    gameOverSound.muted = true;
    soundOnOff = false;
    soundId.value = "Sound-Off";
  } else {
    soundId.value = "Sound-On";
    soundId.style.textDecorationThickness = "0.4rem";
    eatSound.muted = false;
    gameOverSound.muted = false;
    soundOnOff = true;
  }
}

// Game Over Function
function gameOver() {
  itsGameOver = true;
  clearInterval(timerInterval);
  gameOverSound.play();
  document.getElementById("gameOver").style.display = "flex";
}
// Difficult Button
easy.addEventListener("click", () => {
  color();
  setRandomBerry();
  setRandomCherry();
  cherrySpeedUp = 3500;
  (seconds = 45), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
});
normal.addEventListener("click", () => {
  color();
  setRandomBerry();
  setRandomCherry();
  cherrySpeedUp = 4500;
  (seconds = 30), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
  liveCounter = 1;
  removeLive();
});
hard.addEventListener("click", () => {
  color();
  setRandomBerry();
  setRandomCherry();
  cherrySpeedUp = 5500;
  (seconds = 10), (display = document.querySelector("#time"));
  timeSetting(seconds, display);
  level.style.display = "none";
  liveCounter = 2;
  removeLive();
  removeLive();
});
