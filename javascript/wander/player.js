
var Player = function(sprite, x, y) {
	this.sprite = sprite;
	this.health = 100;	
	
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();
	
	this.rotation = 0;	// amount of rotation of the player, in radians
	
	this.fired = false;
	this.lastFired = 0;
};

Player.prototype.update = function(dt) {
	if(game.keyboard.isKeyDown(game.keyboard.KEY_W))
	{
		var m = new Matrix3x3();
		m.setupRotation(this.rotation);
		
		this.velocity = m.multiplyByVectorXY(0, -100*dt);
		
		this.sprite.update(dt);
	}
	else if(game.keyboard.isKeyDown(game.keyboard.KEY_S))
	{
		var m = new Matrix3x3();
		m.setupRotation(this.rotation);
		
		this.velocity = m.multiplyByVectorXY(0, 100*dt);
		
		this.sprite.update(dt);
	}
	else
	{
		this.velocity.zero();
	}
	
	if(game.keyboard.isKeyDown(game.keyboard.KEY_A))
	{
		this.rotation -= 10*dt;
	}
	if(game.keyboard.isKeyDown(game.keyboard.KEY_D))
	{
		this.rotation += 10*dt;
	}

	if(this.lastFired > 0)
		this.lastFired -= dt;
			
	if(game.keyboard.isKeyDown(game.keyboard.KEY_SHIFT))
	{
		// fire gun
		if(this.lastFired <= 0)
		{
			this.fired = true;
			this.lastFired = 0.3;
		}
	}
	
	this.position.add(this.velocity);
};

Player.prototype.draw = function(c) {
	var trans = new Matrix3x3();
	trans.setupTranslationWithVector(this.position);
	
	var rot = new Matrix3x3();
	rot.setupRotation(this.rotation);
	
	var m = rot.multiplyByMatrix(trans);
	
	m.applyToContext(c);
		
	this.sprite.draw(c);
		
	game.identityMatrix.applyToContext(c);
};

Player.prototype.fire = function() {
	this.fired = false;
	
	for(var i=0; i<BULLET_COUNT; i++)
	{
		if(game.bullets[i].alive == false)
		{
			var vel = new Vector2();
			vel.set(0, -300);
			
			var m = new Matrix3x3();
			m.setupRotation(this.rotation);
			var vel = m.multiplyByVector(vel);
			
			game.bullets[i].initialize(game.player.position.x, game.player.position.y, vel.x, vel.y);
			break;
		}
	}
};
