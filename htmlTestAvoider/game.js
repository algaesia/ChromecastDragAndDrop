var gAvatarImage = new Image();
gAvatarImage.src = "avatarIcon.png";

var gEnemyImage = new Image();
gEnemyImage.src = "aboutYouIcon.png";

var stopGame = false;

function drawAvatar() {
	var gameCanvas = document.getElementById("gameCanvas");
	var gameContext = gameCanvas.getContext("2d");
	
	gameContext.drawImage(gAvatarImage,100,100);
	gameContext.drawImage(gEnemyImage, Math.random() * gameCanvas.width, Math.random() * gameCanvas.height);
	gameCanvas.addEventListener("mousemove", redrawAvatar);
	gameCanvas.addEventListener("mousemove", redrawEnemy);
}

function redrawAvatar(mouseEvent) {
	var gameCanvas = document.getElementById("gameCanvas");
	var gameContext = gameCanvas.getContext("2d");
	
	var mousePosX = mouseEvent.offsetX - (gAvatarImage.width * 0.5);
	var mousePosY = mouseEvent.offsetY - (gAvatarImage.height * 0.5);
	
	gameCanvas.width = 1280;
	gameContext.drawImage(gAvatarImage, mousePosX, mousePosY);
}

function redrawEnemy(mouseEvent) {
	var gameCanvas = document.getElementById("gameCanvas");
	var gameContext = gameCanvas.getContext("2d");
	
	var enemyX = gameCanvas.width - gEnemyImage.width;
	var enemyY = gameCanvas.height - gEnemyImage.height;
	
	var distX = (enemyX - mouseEvent.offsetX) * (enemyX - mouseEvent.offsetX);
	var distY = (enemyY - mouseEvent.offsetY) * (enemyY - mouseEvent.offsetY);
	
	alert(distX);
	alert(distY);
	
	if (distX < 4 || distY < 4) {
		gameCanvas.width = 1280;
		gameContext.drawImage(gEnemyImage, Math.random() * gameCanvas.width, Math.random() * gameCanvas.height);
	}
}