//http://michalbe.blogspot.com.au/2010/09/tutorial-simple-game-with-html5-canvas_30.html

//the width and height of the game screen on the web page
var width = 320;
var height = 500;

//this variable will be used to assign the length of time 
//to wait for each frame
var gLoop;

var points = 0;

var playGameState = true;

//the canvas onto which the elements of the game will be drawn
var gameCanvas = document.getElementById("gameCanvas");

//the context in which the game will be drawn
var gameContext = gameCanvas.getContext("2d");

//assigning the predefined width and height to the
//member variables of the game canvas
gameCanvas.width = width;
gameCanvas.height = height;

//to move objects around the canvas surface, the screen
//must be cleared regularly to show changes in movement
//of sprites and objects onscreen
var ClearScreen = function() {
	//colour with which to fill the rectangle
	gameContext.fillStyle = "d0e7f9";
	
	gameContext.clearRect(0,0,width,height);
	
	//start drawing
	gameContext.beginPath();
	
	//have an area that covers the whole screen
	gameContext.rect(0,0,width,height);
	
	//end drawing
	gameContext.closePath();
	
	//fill the rectangle, making it active
	gameContext.fill();
}

//these circles will be used in the background of the game
var numCircles = 10;
var arrayOfCircles = [];

//loop to generate the circles that are drawn to the screen
//randomises width and height, and pushes each into the array
for (var i = 0; i < numCircles; ++i) {
	arrayOfCircles.push([Math.random() * width, Math.random() * height, Math.random() * 100, Math.random() / 2]);
}

//iterates through the array of circles and draws each one
var DrawCircles = function() {
	for (var i = 0; i < numCircles; ++i) {
		gameContext.fillStyle = 'rgba(255,255,255, ' + arrayOfCircles[i][3] + ')';
		gameContext.beginPath();
		gameContext.arc(arrayOfCircles[i][0],arrayOfCircles[i][1],arrayOfCircles[i][2],0,Math.PI * 2,true);
		gameContext.closePath();
		gameContext.fill();
	}
};

var MoveCircles = function(dt) {
	for (var i = 0; i < numCircles; ++i) {
		//check to see if the distance between two circles are
		//greater than the height of the screen - if it is, then
		//reposition all the circles
		if (arrayOfCircles[i][1] - arrayOfCircles[i][2] > height) {
		
			arrayOfCircles[i][0] = Math.random() * width;
			arrayOfCircles[i][2] = Math.random() * 100;
			arrayOfCircles[i][1] = 0 - arrayOfCircles[i][2];
			arrayOfCircles[i][3] = Math.random() / 2;
		}
		//otherwise move them down the screen
		else {
			arrayOfCircles[i][1] += dt;
		}
	}
};

var player = new (function() {
	
	var currentContext = this;
	
	//creating a new image and setting it's source
	currentContext.image = new Image();
	currentContext.image.src = "playerTexture.png";
	
	//setting the width and height of a single frame
	currentContext.width = 65;
	currentContext.height = 95;
	
	currentContext.X = 0;
	currentContext.Y = 0;
	
	//bools for checking whether jumping or falling state
	currentContext.isJumping = false;
	currentContext.isFalling = false;
	
	//speeds at which player is falling or jumping
	currentContext.jumpSpeed = 0;
	currentContext.fallSpeed = 0;
	
	//frames and interval changes
	currentContext.frames = 1;
	currentContext.actualFrame = 0;
	currentContext.interval = 0;
	
	//function to set the position of the player
	currentContext.setPosition = function(x,y) {
		currentContext.X = x;
		currentContext.Y = y;
	}
	
	currentContext.moveLeft = function() {
		if (currentContext.X > 0) {
			currentContext.setPosition(currentContext.X - 5, currentContext.Y);
		}
	}
	
	currentContext.moveRight = function() {
		if (currentContext.X + currentContext.width < width) {
			currentContext.setPosition(currentContext.X + 5, currentContext.Y);
		}
	}
	
	//function for making the player jump
	currentContext.Jump = function() {
		//if the player is not current jumping or falling, then the player is stationary
		//and as such, the player can jump
		if (!currentContext.isJumping && !currentContext.isFalling) {
			currentContext.fallSpeed = 0;
			currentContext.isJumping = true;
			currentContext.jumpSpeed = 10;
		}
	}
	
	//while the function above is to initiate the jump, this function executes it with the
	//correct values as well as resolving anything occurring afterwards
	//to make the player appear to be progressing along the level, the screen will move downwards
	//while the player remains stationary - stop the character in one place and move everything
	//else in the opposite direction - this is done in the check jump function
	currentContext.CheckJump = function() {
		//move the player on the y axis by a certain amount of pixels equal to the current
		//value of jumpSpeed - need a check to see if player is within certain limits, otherwise
		//constantly moving upwards, in this case the check sees if the player is under about half
		//of the screen, if it is true, then the player can move, otherwise move the background down
		if (currentContext.Y > height * 0.4) {
			currentContext.setPosition(currentContext.X,currentContext.Y - currentContext.jumpSpeed);
		}
		else {
			if (currentContext.jumpSpeed > 10) {
				points++;
			}
			
			//move the circles in the background based on the player's jump speed
			MoveCircles(currentContext.jumpSpeed * 0.5);
			
			//generate new platforms
			platformsArray.forEach(function(platform,ind) {
				platformsArray.y += currentContext.jumpSpeed;
				if (platform.y > height) {
					var type = ~~(Math.random() * 5);
					if (type == 0) {
						type = 1;
					}
					else {
						type = 0;
					}
					
					platformArray[ind] = new Platforms(Math.random() * (width - platformWidth), platform.y - height, type);
				}
			});
		}
		
		//simulating gravity, the jump speed will decrease as well
		currentContext.jumpSpeed--;
		
		//if the jumpSpeed is zero, then the player will start to fall
		if (currentContext.jumpSpeed == 0) {
			//need to set the respective values
			//player is no longer jumping
			currentContext.isJumping = false;
			
			//player is now falling
			currentContext.isFalling = true;
			
			//fall speed is 1
			currentContext.fallSpeed = 1;
		}
	}
	
	//function to execute the act of falling
	currentContext.CheckFall = function() {
		//if the player's Y value is less than the height of the screen minus
		//the height of the player - if the player meets the bottom of the screen
		if (currentContext.Y < height - currentContext.height) {
			//keep moving the player down
			currentContext.setPosition(currentContext.X, currentContext.Y + currentContext.fallSpeed);
			currentContext.fallSpeed++;
		}
		else {
			//make the player stop falling
			if (points === 0) {
				currentContext.fallStop();
			}
			else {
				GameOver();
			}
		}
	}
	
	//causes the player to stop falling, and sets the respective booleans
	//to the correct values
	currentContext.fallStop = function() {
		currentContext.isFalling = false;
		currentContext.fallSpeed = 0;
		currentContext.Jump();
	}
	
	currentContext.Draw = function() {
		try {
			gameContext.drawImage(currentContext.image,0,
			currentContext.height * currentContext.actualFrame,
			currentContext.width,currentContext.height,
			currentContext.X,currentContext.Y,currentContext.width,
			currentContext.height);
		}
		catch (e) {};
		
		if (currentContext.interval == 4) {
			if (currentContext.actualFrame == currentContext.frames) {
				currentContext.actualFrame = 0;
			}
			else {
				currentContext.actualFrame++;
			}
			currentContext.interval = 0;
		}
		currentContext.interval++;
	}
}) ();

//platform attributes
var numPlatforms = 7;
var platformsArray = [];
var platformWidth = 70;
var platformHeight = 20;

var Platforms = function(x,y,type) {
	//assigning the current object (platform)
	//to a variable that can be referred to later
	var currentContext = this;
	
	//setting up the first and second colours
	currentContext.firstColour = '#FF8C00';
	currentContext.secondColour = '#EEEE00';
	
	currentContext.isMoving = ~~(Math.random() * 2);
	currentContext.Direction = ~~(Math.random() * 2) ? -1 : 1;
	
	//what to do when something collides with
	//the platform - because there is only
	//one possible object that can collide
	//only one thing happens
	currentContext.onCollide = function() {
		player.fallStop();
	};
	
	//when player jumps on green coloured platform -
	//the player will stop falling and jump speed will increase
	if (type === 1) {
		currentContext.firstColour = '#AADD00';
		currentContext.secondColour = '#698B22';
		player.fallStop();
		player.jumpSpeed = 50;
	}
	
	currentContext.x = ~~x;
	currentContext.y = y;
	currentContext.type = type;
	
	currentContext.Draw = function() {
		gameContext.fillStyle = 'rgba(255,255,255,1)';
		var gradient = gameContext.createRadialGradient(currentContext.x + (platformWidth / 2),
					   currentContext.y + (platformHeight / 2), 5, 
					   currentContext.x + (platformWidth / 2), currentContext.y + (platformHeight / 2), 45);
		
		gradient.addColorStop(0,currentContext.firstColour);
		gradient.addColorStop(1,currentContext.secondColour);
		
		gameContext.fillStyle = gradient;
		gameContext.fillRect(currentContext.x, currentContext.y, platformWidth, platformHeight);
	};
	
	return currentContext;
};

var generatePlatforms = function() {
	//y variable
	var position = 0, type;
	
	for (var i = 0; i < numPlatforms; ++i) {
		type = ~~(Math.random() * 5);
		
		if (type === 0) {
			type = 1;
		}
		else {
			type = 0;
		}
		
		platformsArray[i] = new Platforms(Math.random() * (width - platformWidth), position, type);
		
		if (position < height - platformHeight) {
			position += ~~(height / numPlatforms);
		}
	}
} ();

var CheckCollisions = function() {
	platformsArray.forEach(function(e,ind) {
		if (
			(player.isFalling) && 
			(player.X < e.x + platformWidth) &&
			(player.X + player.width > e.x) && 
			(player.Y + player.height > e.y) &&
			(player.Y + player.height < e.y + platformHeight)
			) {
				e.onCollide();
			}
	})
}

player.setPosition(~~((width-player.width) / 2), ((height - player.height) / 2));
player.Jump();

document.onmousemove = function(e) {
	if (player.X + gameCanvas.offsetLeft > e.pageX) {
		player.moveLeft();
	}
	else if (player.X + gameCanvas.offsetLeft < e.pageX) {
		player.moveRight();
	}
}

//each frame will clear the screen, move the circles
//down the screen slightly (update), and then draw them 
var GameLoop = function() {
	ClearScreen();
	
	DrawCircles();
	
	if (player.isJumping) {
		player.CheckJump();
	}
	
	if (player.isFalling) {
		player.CheckFall();
	}
	
	player.Draw();
	
	platformsArray.forEach(function(platform,index) {
		if (platform.isMoving) {
			if (platform.x < 0) {
				platform.Direction = 1;
			}
			else if (platform.x > width - platformWidth) {
				platform.Direction = -1;
			}
			platform.x += platform.Direction * (index / 2) * ~~(points / 100);
		}
		platform.Draw();
	});
	
	CheckCollisions();
	
	gameContext.fillStyle = "Black";
	gameContext.fillText("Score: " + points, 10, height - 10);
	
	//make the program wait - this also determines the frames per second
	if (playGameState) {
		gLoop = setTimeout(GameLoop, 1000 / 50);
	}
}
var GameOver = function() {
	state = false;
	clearTimeout(gLoop);
	
	setTimeout(function() {
	ClearScreen();
	gameContext.fillStyle = "Black";
	gameContext.font = "22pt Arial";
	gameContext.fillText("YOUR RESULT", width / 2 - 60, height / 2 - 30);
		}, 100);
};

GameLoop();