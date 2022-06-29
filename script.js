var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var canvasWidth
var canvasHeight
var flag=1;
if(window.innerHeight>window.innerWidth)
{
  flag=1;
  canvasWidth=window.innerWidth;
  canvasHeight=canvasWidth*0.667;
  ctx.canvas.width=canvasHeight*0.95;
  ctx.canvas.height=canvasHeight;
}
else{
  flag=0;
  canvasHeight=window.innerHeight-15;
  canvasWidth=window.innerWidth;
  ctx.canvas.width=canvasWidth;
  ctx.canvas.height=canvasHeight;
}
var ballRadius = canvasWidth/48;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = canvasWidth/120;
var dy = -canvasWidth/120;
var paddleHeight = canvasWidth/48;
var paddleWidth = canvasWidth/6.4;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = (flag)?3:5;
var brickColumnCount = (flag)?5:4;;
var brickWidth = canvasWidth/6.4;
var brickHeight = canvasWidth/30;
var brickPadding = canvasWidth/48;
var brickOffsetTop = canvasWidth/16;
var brickOffsetLeft = canvasWidth/16;
var score = 0;
var lives = 3;
var scorebox=document.getElementById("scorebox");
var livebox=document.getElementById("livebox");
var colors=["red", "#2c99ac"]
var bricks = [];
var random,highScore=0;
var totalBricks=brickRowCount*brickColumnCount;
var darkBricks=0,lightBricks=0;
var leftButton=document.getElementById("left");
var rightButton=document.getElementById("right");
var displayTimes=0;

for(var c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(var r=0; r<brickRowCount; r++) {
    random = Math.round(Math.random() * (colors.length));
    bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[random] };
    if(colors[random]===colors[0])
      {
      darkBricks++;
      if(darkBricks<=(totalBricks)/2)
        {
          bricks[c][r].status=2;
          highScore+=10;
        }
      else{
          bricks[c][r].color=colors[1];
          bricks[c][r].status=1;
          highScore+=5;
        }
      }
    else{
      lightBricks++;
      if(lightBricks<=(totalBricks)/2)
        {
          bricks[c][r].status=1;
          highScore+=5;
        }
      else{
          bricks[c][r].color=colors[0];
          bricks[c][r].status=2;
          highScore+=10;
        }      
    }
  }
}

if(window.innerWidth<990){
  document.addEventListener("touchmove", mouseMoveHandler);
  leftButton.addEventListener("touchstart",left);
  rightButton.addEventListener("touchstart",right);
  leftButton.addEventListener("touchend",left_init);
  rightButton.addEventListener("touchend",right_init);
}
else{
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  document.addEventListener("mousemove", mouseMoveHandler);
    
}

function right_init(){
  rightPressed=false;
}


function left_init(){
  leftPressed=false;
}

function right(){
  rightPressed=true;
}

function left(){
  leftPressed=true;
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
  }
}
function collisionDetection() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      var b = bricks[c][r];
      if(b.status >= 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          if(b.status===1)
            {
              b.status = 0;
              score+=5;
            }
          else{
            b.status=1;
            score+=5;
          }
          if((score == highScore)&&(displayTimes==0)) {
            alert("YOU WIN, CONGRATS!\n Your score is: "+highScore);
            displayTimes=1;
            document.location.reload();
           }
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "gold";
  ctx.globalAlpha=1;
  ctx.fill();
  ctx.closePath();
}
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "brown";
  ctx.globalAlpha=1;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for(var c=0; c<brickColumnCount; c++) {
    for(var r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status >= 1) {
        var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
        var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        if(bricks[c][r].status===1) ctx.globalAlpha=0.5;
        else ctx.globalAlpha=1;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}
function drawScore() {
  if(window.innerHeight>window.innerWidth){
    scorebox.innerHTML="Score: "+score;
  }
  else{
    livebox.innerHTML="<br><br>";
  } 
}
function drawLives() {
  if(window.innerHeight>window.innerWidth){
    livebox.innerHTML="Lives: "+lives;
  } 
  else{
    livebox.innerHTML="<br><br>";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if(y + dy < ballRadius) {
    dy = -dy;
  }
  else if(y + dy > canvas.height-ballRadius) {
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    }
    else {
      if(lives>0)
        lives--;
      if(!lives&&(displayTimes==0)) {
        displayTimes=1;
        alert("....GAME OVER....\nYour score was "+score+".\n .....Try Again.....");
        document.location.reload();

      }
      else if(lives>0){
        if(lives!=1)
         alert(" Oops! Lost a life \n Only "+lives+" lives left");
        else
         alert(" Oops! Lost a life \n Only "+lives+" life left");
        x = canvas.width/2;
        y = canvas.height-30;
        dx = canvasWidth/120;
        dy = -canvasWidth/120;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }

  if(rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += canvas.width/60;
  }
  else if(leftPressed && paddleX > 0) {
    paddleX -= canvas.width/60;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();