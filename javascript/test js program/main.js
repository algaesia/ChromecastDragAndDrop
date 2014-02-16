var game = {};

game.canvas = document.getElementById("gameCanvas");
game.context = game.canvas.getContext("2d");
var gameCanvasContext = game.canvas.getContext("2d");

gameCanvasContext.font = "30px Arial";
gameCanvasContext.fillText("Hello, World!",200,50);

var playerTexture = new Image();
playerTexture.src = 'player texture.png';

var abeTexture = new Image();
abeTexture.src = 'abe.png';

gameCanvasContext.drawImage(playerTexture,150,150,playerTexture.width,playerTexture.height);
gameCanvasContext.drawImage(abeTexture,0,0,abeTexture.width,abeTexture.height);

gameCanvasContext.fillStyle = "#000";
gameCanvasContext.fillRect(100,100,game.canvas.width,game.canvas.height);