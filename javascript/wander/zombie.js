
var WANDER_JITTER = 10;
var WANDER_RADIUS = 30;
var WANDER_DISTANCE = 40;

var Zombie = function(sprite, x, y) {
	this.sprite = sprite;
	this.health = 100;	
		
	this.position = new Vector2();
	this.position.set(x, y);
	
	this.velocity = new Vector2();	
	this.rotation = 0;	// amount of rotation of the player, in radians
	
	this.target = new Vector2();
	this.wanderTarget = new Vector2();
	this.wanderSteerCentre = new Vector2();
	this.lastRotation = 0;
	
	this.alive = true;
};

Zombie.prototype.getWidth = function()
{
	return this.sprite.getWidth();
};

Zombie.prototype.getHeight = function() {
	return this.sprite.getHeight();
};

Zombie.prototype.setTarget = function(pos)
{
	this.target.set(pos.x, pos.y);
	
	if(this.target.x < 0)
		this.target.x = 0;
	if(this.target.x > game.canvas.width)
		this.target.x = game.canvas.width;
	if(this.target.y < 0)
		this.target.y = 0;
	if(this.target.y > game.canvas.height)
		this.target.y = game.canvas.height;
};

Zombie.prototype.update = function(dt) {	 
	if(this.alive == false)
		return;
	
	// seek to player
/*	this.velocity.x = game.player.position.x - this.position.x;
	this.velocity.y = game.player.position.y - this.position.y;
	
	// look at player
	this.rotation = lookAt(this.velocity.x, this.velocity.y);
	
	// scale down the velocity
	this.velocity.normalize();
	this.velocity.multiplyScalar(dt*30);
*/

	var force = this.wander(dt);	
	
	// validate force
	var finalPos = this.position.copy();
	finalPos.add(force);
	if(finalPos.x < 0 || finalPos.x > game.canvas.width ||
			finalPos.y < 0 || finalPos.y > game.canvas.height)
	{
		// apply a stronger force to get the zombie back onto the screen
		var returnForce = new Vector2();
		returnForce.set( (game.canvas.width>>1) - this.position.x,
							(game.canvas.height>>1) - this.position.y);
		force.multiplyScalar(0.3);
		returnForce.multiplyScalar(0.7*dt);
		
		
		force.add(returnForce);
	}
	
	this.velocity.set(force.x, force.y);

		// look at player
	this.rotation = lookAt(this.velocity.x, this.velocity.y);
		// scale down the velocity
	this.velocity.multiplyScalar(dt);
	
	this.position.add(this.velocity);
	this.sprite.update(dt);
};

//
// seek to player
//
Zombie.prototype.seek = function(dt) {
	var force = new Vector2();
	force.set(	game.player.position.x - this.position.x,
				game.player.position.y - this.position.y );
	return force;
};

//
// wander
//
Zombie.prototype.wander = function(dt) {
		// first, add a small random vector to the target’s position 
		// (rand.nextClamped returns a value between -1 and 1)
	this.wanderTarget.x += game.rand.nextClamped() * WANDER_JITTER;
	this.wanderTarget.y += game.rand.nextClamped() * WANDER_JITTER;
	
		// re-project this new vector back onto a unit circle
	this.wanderTarget.normalize();
		// increase the length of the vector to the same as the radius 
		// of the wander circle
	this.wanderTarget.multiplyScalar(WANDER_RADIUS);	
	
		// move the target into a position WANDER_DISTANCE in front of the agent
	var targetLocal = new Vector2();
	targetLocal.set( this.wanderTarget.x * dt, this.wanderTarget.y * dt - WANDER_DISTANCE);
			
		// project the target into world space	
	var trans = new Matrix3x3();
	trans.setupRotation(this.rotation);
	trans.setTranslationWithVector(this.position);
	
	var worldTarget = trans.multiplyByVector(targetLocal);
	
// debug only	
this.target.set( this.wanderTarget.x, this.wanderTarget.y - WANDER_DISTANCE);
this.target = trans.multiplyByVector(this.target);
this.wanderSteerCentre =  trans.multiplyByVectorXY(0, -WANDER_DISTANCE);	
	
		// and steer towards it
	worldTarget.subtract(this.position);
	return worldTarget;
};

//
// draw
//
Zombie.prototype.draw = function(c) {
	if(this.alive == false)
		return;
	
	var trans = new Matrix3x3();
	trans.setupRotation(this.rotation);
	trans.setTranslationWithVector(this.position);	
	trans.applyToContext(c);

	this.sprite.draw(c);	
	
	game.identityMatrix.applyToContext(c);
	
	
	
	// debug information
	
	c.beginPath();
	c.arc(this.target.x, this.target.y, 3, 0, 2*Math.PI);
	c.fill();
	
	c.beginPath();
	c.lineWidth="1";
	c.strokeStyle="green";
	c.arc(this.wanderSteerCentre.x, this.wanderSteerCentre.y, WANDER_RADIUS, 0, 2*Math.PI);
	c.stroke();
	
	c.beginPath(); 
	c.lineWidth="1";
	c.strokeStyle="green"; // Green path
	c.moveTo(this.position.x,this.position.y);
	c.lineTo(this.wanderSteerCentre.x, this.wanderSteerCentre.y);
	c.stroke();		
	
	c.beginPath(); 
	c.lineWidth="1";
	c.strokeStyle="white"; // Green path
	c.moveTo(this.position.x,this.position.y);
	c.lineTo(this.target.x, this.target.y);
	c.stroke();		
};
