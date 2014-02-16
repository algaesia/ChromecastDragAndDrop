var gameCanvas = document.getElementById("gameCanvas");
var gameContext = gameCanvas.getContext("2d");

var canvasWidth = $(window).outerWidth();
var canvasHeight = $(window).outerHeight();

var deltaTime = 0.01;

var gLoop;

gameCanvas.width = canvasWidth;
gameCanvas.height = canvasHeight;

function clearScreen() {
	gameContext.fillStyle = "#97ED78";
	gameContext.beginPath();
	gameContext.rect(0,0,canvasWidth,canvasHeight);
	gameContext.fill();
}

function Paddle(posX, posY, speedX, width, height) {
	var currentContext = this;
	currentContext.paddleX = posX;
	currentContext.paddleY = posY;
	currentContext.paddleWidth = width;
	currentContext.paddleHeight = height;
	currentContext.deltaX = 0;
	currentContext.speedX = speedX;
	currentContext.paddleMovement = "NONE";
	
	currentContext.update = function() {
		currentContext.checkKeys();
		currentContext.checkBounds();
		currentContext.movePaddle();
	}
	
	currentContext.checkKeys = function() {
		$(document).keydown(function(e) {
			if (e.keyCode == 39) {
				currentContext.paddleMovement = "RIGHT";
			} else if (e.keyCode == 37) {
				currentContext.paddleMovement = "LEFT";
			}
		});
		
		$(document).keyup(function(e) {
			if (e.keyCode == 39) {
				currentContext.paddleMovement = "NONE";
			} else if (e.keyCode == 37) {
				currentContext.paddleMovement = "NONE";
			}
		});
	}
	
	currentContext.checkBounds = function() {
		if (currentContext.paddleX < 0) {
			currentContext.paddleX = 0;
		}
		
		if (currentContext.paddleX + currentContext.paddleWidth > gameCanvas.width) {
			currentContext.paddleX = gameCanvas.width - currentContext.paddleWidth;
		}
	}
	
	currentContext.movePaddle = function() {
		if (currentContext.paddleMovement == "LEFT") {
			currentContext.deltaX = -speedX;
		} else if (currentContext.paddleMovement == "RIGHT") {
			currentContext.deltaX = speedX;
		} else {
			currentContext.deltaX = 0;
		}
		currentContext.paddleX += currentContext.deltaX * deltaTime;
	}
	
	currentContext.draw = function() {		
		gameContext.fillStyle = "rgba(0,0,0,1)";
		gameContext.fillRect(currentContext.paddleX,
							 currentContext.paddleY,
							 currentContext.paddleWidth,
							 currentContext.paddleHeight);
	}
}

function Ball(posX, posY, deltaX, deltaY, radius) {
	var currentContext = this;
	currentContext.ballX = posX;
	currentContext.ballY = posY;
	currentContext.ballDeltaX = deltaX;
	currentContext.ballDeltaY = deltaY;
	currentContext.ballRadius = radius;
	
	currentContext.update = function(a_x,a_y,a_width,XResult,YResult) {		
		currentContext.checkCollisions(a_x,a_y,a_width,XResult,YResult);
		
		currentContext.ballX += currentContext.ballDeltaX * deltaTime;
		currentContext.ballY += currentContext.ballDeltaY * deltaTime;
	}
	
	currentContext.checkCollisions = function(colliderX, colliderY, colliderWidth, XResult, YResult) {
		if (currentContext.ballX < 0 || currentContext.ballX + currentContext.ballRadius > gameCanvas.width || XResult) {
			currentContext.ballDeltaX = -currentContext.ballDeltaX;
		}
		
		if (currentContext.ballY < 0 || YResult) {
			currentContext.ballDeltaY = -currentContext.ballDeltaY;
		}
		
		if (currentContext.ballY > gameCanvas.height) {
			currentContext.ballX = gameCanvas.width * 0.5;
			currentContext.ballY = gameCanvas.height * 0.5;
			currentContext.ballDeltaX = Math.random() * 250 - 500;
			currentContext.ballDeltaY = Math.random() * 250 - 500;
			currentContext.ballRadius = (Math.random() * 1000 % 5) + 2;
		}
		
		if (currentContext.ballX >= colliderX && currentContext.ballX <= colliderX + colliderWidth) {
			if (currentContext.ballY + currentContext.ballRadius >= colliderY) {
				currentContext.ballDeltaY = -currentContext.ballDeltaY;
			}
		}
	}
	
	currentContext.draw = function() {
		gameContext.beginPath();
		gameContext.arc(currentContext.ballX,
					    currentContext.ballY,
					    currentContext.ballRadius,
					    0,
					    Math.PI * 2,
					    true);
		gameContext.fill();
		gameContext.closePath();
	}
}

function Bricks() {
	//Brick layout and points per brick
	//0 - no brick
	//1 - orange
	//2 - green
	//3 - blue

	var currentContext = this;
	currentContext.brickRows = 4; //h
	currentContext.brickColumns = 8; //v
	currentContext.brickWidth = canvasWidth / currentContext.brickColumns;
	currentContext.brickHeight = 10;
	
	//Math.random returns value between 0 - 1
	currentContext.bricks = [];
	
	//Generate columns - 8
	for (var i = 0; i < currentContext.brickRows; ++i) {
		currentContext.bricks.push(
				[ 
				  ~~(Math.random() * 100 % 4), 
				  ~~(Math.random() * 100 % 4),
				  ~~(Math.random() * 100 % 4),
				  ~~(Math.random() * 100 % 4),
				  ~~(Math.random() * 100 % 4),
				  ~~(Math.random() * 100 % 4),
				  ~~(Math.random() * 100 % 4),
				  ~~(Math.random() * 100 % 4)
				]
		);
	}
	
	//pass in details of ball
	currentContext.update = function(a_x, a_y, a_deltaX, a_deltaY, a_radius) {
		currentContext.checkXCollision(a_x, a_y, a_deltaX, a_deltaY, a_radius);
		currentContext.checkYCollision(a_x, a_y, a_deltaX, a_deltaY, a_radius);
	}
	
	currentContext.checkXCollision = function(a_x, a_y, a_deltaX, a_deltaY, a_radius) {
		var bumpedX = false;
		for (var i = 0; i < currentContext.bricks.length; ++i) {
			for (var j = 0; j < currentContext.bricks[i].length; ++j) {
				if (currentContext.bricks[i][j]) {
					var brickX = j * currentContext.brickWidth;
					var brickY = i * currentContext.brickHeight;
					
					if ( ((a_x + a_deltaX + a_radius >= brickX) && //approaching from the left since
						  (a_x + a_radius <= brickX)) 
									||
						 ((a_x + a_deltaX - a_radius <= brickX + currentContext.brickWidth) && //approaching from the right since
						  (a_x - a_radius >= brickX + currentContext.brickWidth)) ) 
					{
						if ( (a_y + a_deltaY - a_radius <= brickY + currentContext.brickHeight) && 
						     (a_y + a_deltaY + a_radius >= brickY) ) 
						{
							bumpedX = true;
						}
					}
				}
			}
		}
		return bumpedX;
	}
	
	currentContext.checkYCollision = function(a_x, a_y, a_deltaX, a_deltaY, a_radius) {
		var bumpedY = false;
		for (var i = 0; i < currentContext.bricks.length; ++i) {
			for (var j = 0; j < currentContext.bricks[i].length; ++j) {
				if (currentContext.bricks[i][j]) {
					var brickX = j * currentContext.brickWidth;
					var brickY = i * currentContext.brickHeight;
					
					if ( ((a_y - a_radius <= brickY + currentContext.brickHeight) &&
						  (a_y - a_radius >= brickY + currentContext.brickHeight))
										||
						 ((a_y + a_radius >= brickY) && 
						  (a_y + a_radius <= brickY)) ) 
				    {
					    if ( a_x + a_radius >= brickX &&
					    	 a_x - a_radius <= brickX + currentContext.brickWidth ) 
						{
							bumpedY = true;
						}
				    }
				}
			}
		}
		return bumpedY;
	}
	
	currentContext.checkBrickColour = function(x, y, type) {
		switch(type) {
			case 1:
				gameContext.fillStyle = "rgba(255,0,0,1)";
				break;
			case 2:
				gameContext.fillStyle = "rgba(0,0,0,1)";
				break;
			case 3:
				gameContext.fillStyle = "rgba(0,0,255,1)";
				break;
			default:
				gameContext.clearRect(x * currentContext.brickWidth,
									  y * currentContext.brickHeight,
									  currentContext.brickWidth,
									  currentContext.brickHeight);
				break;
		}
		if (type) {
			gameContext.fillRect(x * currentContext.brickWidth, 
								 y * currentContext.brickHeight, 
								 currentContext.brickWidth, 
								 currentContext.brickHeight);
			gameContext.strokeRect(x * currentContext.brickWidth + 1, 
								   y * currentContext.brickHeight + 1, 
								   currentContext.brickWidth - 2, 
								   currentContext.brickHeight - 2);
		}
	}
	
	//Loop through all the bricks and draw them
	//Switching based on the number that is returned
	//by the bricks array
	currentContext.drawBricks = function() {
		for (var i = 0; i < currentContext.bricks.length; ++i) {
			for (var j = 0; j < currentContext.bricks[i].length; ++j) {
				currentContext.checkBrickColour(j, i, currentContext.bricks[i][j]);
			}
		}
	}
}

function Scoreboard() {
	var currentContext = this;
	
	currentContext.score = 0;
	currentContext.draw = function() {
		gameContext.fillStyle = "rbga(0,0,0,1)";
		gameContext.font = "20px Times New Roman";
		
		gameContext.clearRect(0, canvasHeight - 30, canvasWidth, 30);
		gameContext.fillText("Score: " + currentContext.score, 10, canvasHeight - 5);
	}
}

var paddle1 = new Paddle(gameCanvas.width * 0.5, gameCanvas.height - 40, 400, 64, 8);
var ball = new Ball(gameCanvas.width * 0.5, gameCanvas.height - 300, Math.random() * 250 - 500, Math.random() * 250 - 500, ((Math.random() * 1000) % 5) + 2);
var bricks = new Bricks();
var scoreBoard = new Scoreboard();

var gameLoop = function() {
	clearScreen();
	
	paddle1.update();
	ball.update(paddle1.paddleX, paddle1.paddleY, paddle1.paddleWidth, paddle1.paddleHeight, bricks.checkXCollision, bricks.checkYCollsion);
	bricks.update(ball.ballX, ball.ballY, ball.ballDeltaX, ball.ballDeltaY, ball.ballRadius);
	
	paddle1.draw();
	ball.draw();
	bricks.drawBricks();	
	scoreBoard.draw();
	
	//if (gameEnd) {
	//	clearInterval(gameLoop);
	//	gameContext.fillText("GAME OVER. YOUR SCORE IS: " + paddle1.score, canvasWidth * 0.5, canvasHeight * 0.5);
	//}
	
	gLoop = setTimeout(gameLoop, deltaTime);
}

gameLoop();























