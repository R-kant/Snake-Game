let canvas = document.getElementById("ground");
let pen = canvas.getContext("2d");
let score = document.getElementById("score");
let w = 18 * 65;
let h = 8 * 65;
let snake, gameOver, sugar;
class Food {
  constructor(x, y, color, cellSize) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.cellSize = cellSize;
    this.food_img = new Image();
    this.food_img.src = "./assets/apple.png";
  }
  drawFood() {
    pen.fillStyle = this.color;
    pen.drawImage(
      this.food_img,
      this.x * this.cellSize,
      this.y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
}
class Snake {
  constructor(color) {
    this.len = 5;
    this.cellSize = 65;
    this.color = color;
    this.direction = "right";
  }
  createSnake() {
    this.cells = [];
    for (let i = this.len; i > 0; i--) {
      this.cells.push({ x: i, y: 0 });
    }
  }
  generateRandomFood() {
    let x = Math.round(Math.random() * ((w - this.cellSize) / this.cellSize));
    let y = Math.round(Math.random() * ((h - this.cellSize) / this.cellSize));
    if (this.collison_with_snake(x, y)) this.generateRandomFood();
    else {
      sugar = new Food(x, y, "Red", this.cellSize);
      sugar.drawFood();
    }
  }
  drawSnake() {
    pen.fillStyle = this.color;
    // pen.strokeStyle = "Red";
    for (let i = 0; i < this.len; i++) {
      pen.fillRect(
        this.cells[i].x * this.cellSize,
        this.cells[i].y * this.cellSize,
        this.cellSize - 1,
        this.cellSize - 1
      );
      // pen.strokeRect(
      //   this.cells[i].x * this.cellSize,
      //   this.cells[i].y * this.cellSize,
      //   this.cellSize,
      //   this.cellSize
      // );
    }
  }
  collison_with_snake(X, Y) {
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i].x == X && this.cells[i].y == Y) return true;
    }
    return false;
  }
  foodEaten(newx, newy) {
    if (newx == sugar.x && newy == sugar.y) return true;
    return false;
  }
  updateSnake() {
    let headx = this.cells[0].x;
    let heady = this.cells[0].y;
    let newx = headx;
    let newy = heady;
    console.log(this.direction);
    if (this.direction == "left") newx = headx - 1;
    else if (this.direction == "right") newx = headx + 1;
    else if (this.direction == "up") newy = heady - 1;
    else newy = heady + 1;
    if (this.foodEaten(newx, newy)) {
      this.generateRandomFood();
      this.len++;
    } else this.cells.pop();

    if (this.collison_with_snake(newx, newy)) gameOver = true;
    this.cells.unshift({ x: newx, y: newy });
    let lastx = w / this.cellSize;
    let lasty = h / this.cellSize;
    if (newx < 0 || newx >= lastx) gameOver = true;
    if (newy < 0 || newy >= lasty) gameOver = true;
  }
}

function changeDirection(e) {
  if (e.key == "ArrowRight") {
    if (snake.direction != "left") snake.direction = "right";
  } else if (e.key == "ArrowLeft") {
    if (snake.direction != "right") snake.direction = "left";
  } else if (e.key == "ArrowUp") {
    if (snake.direction != "down") snake.direction = "up";
  } else if (e.key == "ArrowDown") {
    if (snake.direction != "up") snake.direction = "down";
  }
}
function init() {
  snake = new Snake("blue");
  snake.createSnake();
  snake.generateRandomFood();
  gameOver = false;
  score.textContent = snake.len - 5;
  document.addEventListener("keydown", changeDirection);
  startAnimating(7);
}
function draw() {
  pen.clearRect(0, 0, w, h);
  sugar.drawFood();
  snake.drawSnake();
  score.textContent = snake.len - 5;
}
function update() {
  snake.updateSnake();
}
init();
//===============================================
function startAnimating(fps) {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  gameLoop();
}
function gameLoop() {
  if (!gameOver) requestAnimationFrame(gameLoop);
  else {
    alert("Game over");
    let yes = confirm("Wanna play again?");
    if (yes) init();
  }
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);

    // Put your drawing code here
    if (!gameOver) {
      draw();
      update();
    }
  }
}
