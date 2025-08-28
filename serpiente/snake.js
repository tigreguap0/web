const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
const canvasSize = 400;
canvas.width = canvasSize;
canvas.height = canvasSize;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let nextDirection = null;
let score = 0;
let speed = 100;
let animationId;
let lastTime = 0;
let gameRunning = true;

let food = generateFood();

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowUp" && direction !== "DOWN") nextDirection = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") nextDirection = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") nextDirection = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") nextDirection = "RIGHT";
});

restartBtn.addEventListener("click", restartGame);

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
}

function drawBackground() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "lime" : "green";
    ctx.fillRect(segment.x, segment.y, box, box);
  });
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

function update() {
  if (nextDirection) {
    direction = nextDirection;
    nextDirection = null;
  }

  if (!direction) return;

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;
  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvasSize ||
    snakeY >= canvasSize ||
    collision(newHead)
  ) {
    gameOver();
    return;
  }

  if (snakeX === food.x && snakeY === food.y) {
    score++;
    scoreElement.innerText = score;
    food = generateFood();

    if (speed > 50 && score % 3 === 0) {
      speed -= 5;
    }
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function collision(head) {
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
  cancelAnimationFrame(animationId);
  gameRunning = false;

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("¡GAME OVER!", canvasSize / 2, canvasSize / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText(`Puntuación: ${score}`, canvasSize / 2, canvasSize / 2 + 20);

  restartBtn.classList.add("show"); // Ahora usamos la clase show
}

function restartGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  nextDirection = null;
  score = 0;
  speed = 100;
  scoreElement.innerText = score;
  food = generateFood();
  lastTime = 0;
  gameRunning = true;
  restartBtn.classList.remove("show"); // Ocultamos el botón con animación
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (timestamp - lastTime > speed) {
    update();
    drawBackground();
    drawSnake();
    drawFood();
    lastTime = timestamp;
  }
  if (gameRunning) animationId = requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
