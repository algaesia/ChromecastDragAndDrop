
var ZOMBIE_COUNT = 10;
var BULLET_COUNT = 6;

// single global variable to contain all variables used in the
// game in a structured hierarchy
// By reducing our global footprint to a single name, we significantly 
// reduce the chance of bad interactions with other applications, 
// widgets, or libraries. 
var game = {};

	// get first canvas element and its context
game.canvas = document.getElementById("gameCanvas");
game.context = game.canvas.getContext("2d");

game.identityMatrix = new Matrix3x3();

game.rand = new PseudoRandom(5423339992.21, Math.random(), 10000);


	// might take time for image to download - TODO: need loading function
game.textures = {
	backgrounds: {
	}
};

	// load the actual textures
game.textures.backgrounds.grass = loadImage("http://samuelcartwright.com.au/zombiegame/grass.png");
game.textures.bullet = loadImage("http://samuelcartwright.com.au/zombiegame/bullet.png");
game.textures.splat = loadImage("http://samuelcartwright.com.au/zombiegame/bloodsplat.png");

game.sprites = {
};

game.sprites.player = new Sprite("http://samuelcartwright.com.au/zombiegame/player.png");
game.sprites.player.buildFrames(8, 1, 32, 32, 0, 0, 0, 0, 0.05);
game.sprites.player.setOffset(16, 16);

game.sprites.zombie = new Sprite("http://samuelcartwright.com.au/zombiegame/zombie.png");
game.sprites.zombie.buildFrames(8, 1, 32, 32, 0, 0, 0, 0, 0.08);
game.sprites.zombie.setOffset(16, 16);



	// store the frame timing information inside the game structure.
	// This gives us easy access to fps variables throughout the game
	// (more useful for debugging)
game.frame = {
	fps: 0,
	fpsCount: 0,
	fpsTime: 0,
	dt: 0,
	startFrameMillis: Date.now(),
	endFrameMillis: Date.now()
};

	// initialize the data structure that will hold the tiles used to 
	// draw the background images
game.tilesets = {
	background: new Array(15)
};

for(var y=0;y<15;y++)
{
	game.tilesets.background[y] = new Array(28);
	for(var x=0; x<20; x++)
		game.tilesets.background[y][x] = game.textures.backgrounds.grass;
} 


	// create the player object
game.player = new Player(game.sprites.player, game.canvas.width/2, game.canvas.height/2);

	// set up the mouse and keyboard event handler
game.keyboard = new Keyboard();

game.zombies = new Array();
for(var zombieIdx=0; zombieIdx<ZOMBIE_COUNT; zombieIdx++)
{	
	game.zombies[zombieIdx] = new Zombie(game.sprites.zombie.copy(), 
			game.rand.next()&game.canvas.width, game.rand.next()%game.canvas.height);
			//game.canvas.width>>1, game.canvas.height>>1);
}

game.bullets = new Array();
for(var bulletIdx=0; bulletIdx<BULLET_COUNT; bulletIdx++)
{
	game.bullets[bulletIdx] = new Bullet(game.textures.bullet);
}

game.bloodsplats = new Array();


//
// update(deltaTime)
// Updates the objects in our game.
// dt refers to the delta time - the amount of time it took the last frame to 
// update. We use this value to control the speed of animations, etc. in 
// the game
// Author: Samuel Cartwright, 30/10/12
function update(dt)
{
	game.player.update(dt);

	if(game.player.fired === true)
	{
		game.player.fire();
	}

	
	for(var zombieIdx=0; zombieIdx<ZOMBIE_COUNT; zombieIdx++)
	{
		if(game.zombies[zombieIdx].alive == true)
		{
			game.zombies[zombieIdx].update(dt);
		}
	}
	
	for(var bulletIdx=0; bulletIdx<game.bullets.length; bulletIdx++)
	{
		if(game.bullets[bulletIdx].alive == true)
		{
			game.bullets[bulletIdx].update(dt);
			
			for(var zombieIdx=0; zombieIdx<ZOMBIE_COUNT; zombieIdx++)
			{
				if(game.zombies[zombieIdx].alive == true)
				{
					if(game.bullets[bulletIdx].checkCollision(game.zombies[zombieIdx]) == true)
					{
						// handle what happens when a zombie dies
						
						// make a new blood splat. (The zombie is already marked as dead by the
						// checkCollision function)
						game.bloodsplats.push(
								new BloodSplat(game.textures.splat, 
								game.zombies[zombieIdx].position.x, 
								game.zombies[zombieIdx].position.y));
					}
				}
			}
		}
	}
	
	
}

//
// draw(context)
// Draws a single frame of our game.
// Author: Samuel Cartwright, 30/10/12
function draw(c)
{
	// clear the background with black
	c.fillStyle = "#000";		
	c.fillRect(0, 0, game.canvas.width, game.canvas.height);


	for(var y=0; y<15; y++)
	{
		for(var x=0; x<20; x++)
		{
			c.drawImage(game.tilesets.background[y][x], x<<5, y<<5);  	
		}
	} 
		
	for(var i=0; i<game.bloodsplats.length; i++)
	{
		game.bloodsplats[i].draw(c);
	}
	
	for(var i=0; i<game.bullets.length; i++)
	{
		if(game.bullets[i].alive == true)
		{
			game.bullets[i].draw(c);
		}
	}

	game.player.draw(c);
	
	for(var i=0; i<ZOMBIE_COUNT; i++)
	{
		if(game.zombies[i].alive == true)
		{
			game.zombies[i].draw(c);
		}
	}
		// draw some debugging information
	c.fillStyle = "#f00";
	c.fillText("FPS: " + game.frame.fps, 5, 20, 100);
}


//
// drawFrame(context)
// This is the main game loop. The function will draw/update one frame of 
// the game.
// This function is called repeatedly by setting up a setTimeout, with an 
// interval of 0 milliseconds (i.e., run the game as fast as we can).
// Timing for animations etc is controlled using the game.frame.dt delta
// time variable.
// Author: Samuel Cartwright, 30/10/12
function drawFrame(c)
{		
	game.frame.endFrameMillis = game.frame.startFrameMillis;
	game.frame.startFrameMillis = Date.now();

	game.frame.dt = game.frame.startFrameMillis - game.frame.endFrameMillis;
	
		// modify the delta time to something we can use
		// we want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var dt = game.frame.dt * 0.001;
		// validate it within range
	if(dt > .4)
		dt = .4;
	
		// update the game object
	update(dt);
		// draw the scene
	draw(c);		
	
	// update the frame counter 
	game.frame.fpsTime += game.frame.dt;
	game.frame.fpsCount++;
	if(game.frame.fpsTime >= 1000)
	{
		game.frame.fpsTime = 0;
		game.frame.fps = game.frame.fpsCount;
		game.frame.fpsCount = 0;
	}
	
	setTimeout("drawFrame(game.context)", 0);
}

	// call the drawFrame function to start the game loop.
	// call frame will recursively call itself
drawFrame(game.context);
