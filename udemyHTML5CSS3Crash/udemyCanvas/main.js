function makeCanvas() {
	var canvas1ID = document.getElementById('canvas1');
	var canvas2ID = document.getElementById('canvas2');
	var canvas3ID = document.getElementById('canvas3');
	var canvas4ID = document.getElementById('canvas4');
	var canvas5ID = document.getElementById('canvas5');
	
	var canvas1Context = canvas1ID.getContext('2d');
	var canvas2Context = canvas2ID.getContext('2d');
	var canvas3Context = canvas3ID.getContext('2d');
	var canvas4Context = canvas4ID.getContext('2d');
	var canvas5Context = canvas5ID.getContext('2d');
	
	//Canvas 1 - Text
	canvas1Context.font = '32pt Arial';
	canvas1Context.fillStyle = '#bead23';
	canvas1Context.strokeStyle = '#435678';
	canvas1Context.fillText('WRITE SOMETHING', 45, 150);
	canvas1Context.strokeText('WRITE SOMETHING', 45, 150);
	
	//Canvas 2 - Squares
	canvas2Context.lineWidth = 10; //the stroke that will be drawn next will be 10 px wide
	
	//Top right square
	canvas2Context.fillStyle = '#786543';
	canvas2Context.strokeStyle = '#987654';
	canvas2Context.fillRect(10,10,100,100);
	canvas2Context.strokeRect(10,10,100,100);
	
	//bottom left square
	canvas2Context.fillStyle = '#f8a54f';
	canvas2Context.strokeStyle = '#5f76f4';
	canvas2Context.fillRect(120,120,100,100);
	canvas2Context.strokeRect(120,120,100,100);
	
	//top left square
	canvas2Context.fillStyle = '#a8a54b';
	canvas2Context.fillRect(120,10,100,100);
	
	//bottom left square
	canvas2Context.fillStyle = '#b8a5fb';
	canvas2Context.fillRect(10,120,100,100);
	
	//Canvas 3 - Lines	
	//Defining the properties of the line used to draw the shape
	canvas3Context.strokeStyle = '#face99';
	canvas3Context.fillStyle = '#dab321';
	canvas3Context.lineWidth = 5;
	
	canvas3Context.beginPath();
	
	//Moving the position of the 'pencil'
	canvas3Context.moveTo(50,200);
	canvas3Context.lineTo(150,210);
	canvas3Context.lineTo(190,220);
	canvas3Context.lineTo(100,20);
	canvas3Context.lineTo(120,180);
	
	canvas3Context.moveTo(100,300);
	canvas3Context.lineTo(150,210);
	canvas3Context.lineTo(120,180);
	canvas3Context.stroke();
	canvas3Context.fill();
	
	canvas3Context.closePath();
	
	//Canvas 4 - Circles
	canvas4Context.fillStyle = '#dab321';
	
	canvas4Context.beginPath();
	canvas4Context.arc(200,30,25,0,Math.PI * 2);
	canvas4Context.fill();
	canvas4Context.closePath();
	
	canvas4Context.fillStyle = 'fab42d';
	canvas4Context.beginPath();
	canvas4Context.arc(250,30,15,0,Math.PI * 2);
	canvas4Context.fill();
	canvas4Context.closePath();
	
	canvas4Context.fillStyle = 'aabc2d';
	canvas4Context.beginPath();
	canvas4Context.arc(300,30,5,0,Math.PI * 2);
	canvas4Context.fill();
	canvas4Context.closePath();
	
	canvas4Context.fillStyle = 'faf42f';
	canvas4Context.beginPath();
	canvas4Context.arc(200,50,25,0,Math.PI * 2);
	canvas4Context.fill();
	canvas4Context.closePath();
	
	canvas4Context.fillStyle = 'fab4fd';
	canvas4Context.beginPath();
	canvas4Context.arc(200,80,15,0,Math.PI * 2);
	canvas4Context.fill();
	canvas4Context.closePath();
	
	canvas4Context.fillStyle = 'cabf2d';
	canvas4Context.beginPath();
	canvas4Context.arc(200,100,5,0,Math.PI * 2);
	canvas4Context.fill();
	canvas4Context.closePath();
	
	//Canvas 5 - Animation
	//Calls function inside parameter every 30 seconds
	var posX = 200;
	var posY = 220;
	
	setInterval(function() {
		canvas5Context.fillStyle = 'black';
		
		//Doesn't go all the way to edges because of the padding added in CSS file
		canvas5Context.fillRect(0,0,canvas5ID.width,canvas5ID.height);
		
		canvas5Context.fillStyle = 'white';
		canvas5Context.beginPath();
		canvas5Context.arc(posX, posY, 75, 0, Math.PI * 2);
		canvas5Context.fill();
		canvas5Context.closePath();
		posX -= 1;
		posY -= 1;
	}, 30);
}