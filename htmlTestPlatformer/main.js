var canvasWidth = 1280;
var canvasHeight = 720;

var gLoop;

var gameCanvas = document.getElementById("gameCanvas");
var gameContext = gameCanvas.getContext("2d");

var numOfCircles = 100;
var circles = [];			//one dimensional array
var radiusRange = 100;
var imageSources = [];
var pressedKeys = {};

imageSources[0] = "aboutYouIcon.png";
imageSources[1] = "avatarIcon.png";
imageSources[2] = "blankSquare.png";

gameCanvas.width = canvasWidth;
gameCanvas.height = canvasHeight;

element.onkeydown = function(e) {
	e = e || window.event;
	pressedKeys[e.keyCode] = true;
}

element.onkeyup = function(e) {
	e = e || window.event;
	delete pressedKeys[e.keyCode];
}

var clearScreen = function() {
	gameContext.fillStyle = "#97ED78";
	gameContext.beginPath();
	gameContext.rect(0,0,canvasWidth,canvasHeight);
	gameContext.fill();
}

var generateCircles = function() {
	for (var i = 0; i < numOfCircles; ++i) {
		circles.push([Math.random() * canvasWidth, Math.random() * canvasHeight,
					  Math.random() * radiusRange, Math.random() * 0.5]);
		//Pushing x, y, radius, transparency
	}
}

var drawCircles = function() {
	for (var i = 0; i < numOfCircles; ++i) {
		gameContext.fillStyle = 'rgba(132, 78, 13, ' + circles[i][3] + ')';
		//Transparency based on randomly generated third element of array
		gameContext.beginPath();
		
		gameContext.arc(circles[i][0], circles[i][1], circles[i][2], 0,
						Math.PI * 2, true);
		//Filling in x, y, radius, start angle, end angle, clockwise?
		
		gameContext.closePath();
		gameContext.fill();
	}
}

var moveCircles = function(deltaY) {
	for (var i = 0; i < numOfCircles; ++i) {
		if (circles[i][1] - circles[i][2] > canvasHeight) {
			//When circle pos goes off screen
			
			//Reset x pos
			circles[i][0] = Math.random() * canvasWidth;
			
			//Rest y pos
			circles[i][1] = Math.random() * canvasHeight;
			
			//Reset radius
			circles[i][2] = Math.random() * radiusRange;
			
			//Reset alpha
			circles[i][3] = Math.random() * 0.5;		
		} else {
			//Circle pos is still on screen, so keep moving them
			circles[i][1] += deltaY;
		}
	}
}

var player = new (function(posX, posY, moveSpeed) {
	var currentContext = this;
	
	currentContext.image = new Image();
	currentContext.image.src = "aboutYouIcon.png";
	
	currentContext.width = 64;
	currentContext.height = 64;
	
	currentContext.X = posX;
	currentContext.Y = posY;
	currentContext.movementSpeed = moveSpeed;
	
	currentContext.framesInAnimation = 2; //indexed from zero
	currentContext.actualFrame = 0;
	currentContext.frameInterval = 0; //Don't switch frames every game loop
	
	currentContext.setPosition = function(x,y) {
		currentContext.X = x;
		currentContext.Y = y;
	}
	
	currentContext.update = function(deltaTime) {
		
	}
	
	currentContext.draw = function() {
		try {
			gameContext.drawImage(currentContext.image, //Image to draw
								  0,	//source X
								  0, 	//source Y
								  currentContext.width, //source width
								  currentContext.height, //source height
								  currentContext.X, //destination X
								  currentContext.Y, //destination Y
								  currentContext.width, //destination width
								  currentContext.height); //destination height
		} catch (e) {
			alert("CAUGHT SOMETHING");
		}
		
		if (currentContext.frameInterval == 8) {
			currentContext.image.src = imageSources[currentContext.actualFrame];
			//switch frames every 4 game loops
			if (currentContext.actualFrame == currentContext.framesInAnimation) {
				//reset frame counter
				currentContext.actualFrame = 0;	
			} else {
				currentContext.actualFrame++;
			}
			
			//reset frame interval
			currentContext.frameInterval = 0;
		}
		
		//nothing happened, so just increase frame interval
		currentContext.frameInterval++;
	}
})(~~((canvasWidth - 64) * 0.5),
    ~~((canvasHeight - 64) * 0.5), 1);

var gameLoop = function() {
	clearScreen();
	moveCircles(5);
	player.draw();
	drawCircles();
	
	gLoop = setTimeout(gameLoop, 1000 / 50);
}

generateCircles();
gameLoop();

























