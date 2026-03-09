// ===== NAVIGATION =====
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  menu.classList.toggle('active');
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('active');
  });
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.15 });

reveals.forEach(reveal => observer.observe(reveal));

// ===== SNAKE GAME =====
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

let tileSize = 20;
let cols, rows;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cols = Math.floor(canvas.width / tileSize);
  rows = Math.floor(canvas.height / tileSize);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let snake, food, direction, playing = false;

function resetGame() {
  snake = [{x: 10, y: 10}];
  direction = {x: 1, y: 0};
  food = randomFood();
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows)
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#111";
  snake.forEach(part => {
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize-2, tileSize-2);
  });

  ctx.fillStyle = "#999";
  ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize-2, tileSize-2);
}

function move() {
  if (!playing) runAI();

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    head.x < 0 || head.y < 0 ||
    head.x >= cols || head.y >= rows ||
    snake.some(p => p.x === head.x && p.y === head.y)
  ) {
    resetGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = randomFood();
  } else {
    snake.pop();
  }
}

function runAI() {
  const head = snake[0];

  if (food.x > head.x) direction = {x:1,y:0};
  else if (food.x < head.x) direction = {x:-1,y:0};
  else if (food.y > head.y) direction = {x:0,y:1};
  else if (food.y < head.y) direction = {x:0,y:-1};
}

function gameLoop() {
  move();
  draw();
}

resetGame();
setInterval(gameLoop, 100);

document.addEventListener("keydown", e => {
  if (!playing) return;

  if (e.key === "ArrowUp") direction = {x:0,y:-1};
  if (e.key === "ArrowDown") direction = {x:0,y:1};
  if (e.key === "ArrowLeft") direction = {x:-1,y:0};
  if (e.key === "ArrowRight") direction = {x:1,y:0};
});

const toggle = document.getElementById("snakeToggle");

toggle.addEventListener("click", () => {
  playing = !playing;
  toggle.textContent = playing ? "Stop Playing" : "Play Snake";
});