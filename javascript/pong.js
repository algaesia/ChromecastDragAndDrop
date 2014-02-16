// Javascript Pong
var stage;
var stageH;
var stageW;
var b;

var bX;
var bY;
var bXS;
var bYS;
var vIsPause = false;
var kLeft = false;
var kRight = false;

var grid = 10;
var pW = 50;

var p1;
var p1X;
var p1Y;
var p1S;

var p2;
var p2X;
var p2Y;
var p2S;

function fnInit(){
	//Stage
	stage = document.getElementById('stage');
	stageH = document.getElementById('stage').offsetHeight-grid;
	stageW = document.getElementById('stage').offsetWidth-grid;
	
	p1X = stageW / 2;
	p1Y = 290;
	p1S = 0;
	p2X = stageW / 2;
	p2Y = 0;
	p2S = 0;
	
	//Ball
	b = document.createElement("div");
	b.style['position'] = 'absolute';
	b.style['background'] = 'url(bola.gif)';
	b.style['left'] = stageW / 2 + 'px';
	b.style['top'] = stageH / 2 + 'px';	
	b.style['width'] = grid + 'px';
	b.style['height'] = grid + 'px';
	
	//Player1
	p1 = document.createElement("div");
	p1.style['position'] = 'absolute';
	p1.style['background'] = 'url(p1.gif)';
	p1.style['left'] = p1X + 'px';
	p1.style['top'] = p1Y + 'px';	
	p1.style['width'] = pW + 'px';
	p1.style['height'] = grid + 'px';
	
	//Player2
	p2 = document.createElement("div");
	p2.style['position'] = 'absolute';
	p2.style['background'] = 'url(p1.gif)';
	p2.style['left'] = p2X + 'px';
	p2.style['top'] = p2Y + 'px';	
	p2.style['width'] = pW + 'px';
	p2.style['height'] = grid + 'px';
		
	//Addchild
	stage.appendChild(b);
	stage.appendChild(p1);
	stage.appendChild(p2);
	
	//Event Listener
	window.document.onkeydown = oKeyDown;
	window.document.onkeyup = oKeyUp;
	
	setInterval(fnLoop, 50);	
	fnStart();
}


function oKeyDown(e){
	var ev = e ? e.keyCode : event.keyCode  
	if(ev == 37){ kLeft = true;	} else if(ev == 39){ kRight = true;	}
}
function oKeyUp(e){
	kLeft = false;	kRight = false;
}

function fnStart(){
	document.getElementById('ui').innerHTML = 'JAVASCRIPT PONG | YOU:' + p1S + ' COMPUTER:' + p2S;
	bX = Math.random() *(stageW - grid);
	bY = stageH / 2;
	if(p1S > p2S) { bXS = 3; bYS = 3 } else { bXS = -3; bYS = -3;}
}


function fnLoop(){
if(!vIsPause){
	//Someone scores
	if(bY > stageH){ p2S++; fnStart(); }
	if(bY < 0){ p1S++; fnStart(); } 
	
	//Collision - Boundary 
	if(bX > stageW || bX < 0){ bXS *= -1; } 
	
	//Collision - Players
	if((bY > p1Y-grid && bX > p1X && bX < p1X+pW)||(bY < grid && bX > p2X && bX < p2X+pW)){bYS *= -1.1; bXS *= 1.1;}
	
	//Move ball
	bX+=bXS; bY+=bYS;	
	b.style['left'] = bX + 'px';
	b.style['top'] = bY + 'px';
	
	//Move Player1
	if(kLeft && p1X > 0){ p1X-=5; } else if (kRight && p1X+pW-grid < stageW){ p1X+=5;}
	p1.style['left'] = p1X + 'px';
	
	//Move Player2
	if(bX > p2X+pW){ p2X+=5; } else if(bX < p2X){ p2X-=5; }
	p2.style['left'] = p2X + 'px';
}
}