
var Bullet = function(texture) {
	this.image = texture;
	
	this.position = new Vector2();	
	this.velocity = new Vector2();
	
	this.alive = false;
};

Bullet.prototype.initialize = function(posX, posY, velX, velY)
{
	this.position.set(posX, posY);
	this.velocity.set(velX, velY);
	
	this.alive = true;
};

Bullet.prototype.update = function(dt) 
{
	if(this.alive == false)
		return;
	
	this.position.x = this.position.x + this.velocity.x * dt;
	this.position.y = this.position.y + this.velocity.y * dt;
	
	if(this.position.x < 0 || this.position.x > game.canvas.width ||
			this.position.y < 0 || this.position.y > game.canvas.height)
	{
		this.alive = false;
	}
};

Bullet.prototype.draw = function(c) 
{
	if(this.alive == false)
		return; 
	
	c.drawImage(this.image, 0, 0, this.image.width, this.image.height,
			this.position.x - this.image.width/2, 
			this.position.y - this.image.height/2, 
			this.image.width, this.image.height);
};

Bullet.prototype.checkCollision = function(zombie)
{
	if(this.alive == false)
		return false;
	
	var halfW = zombie.getWidth()/2;
	var halfH = zombie.getHeight()/2;
	
	if(this.position.x > zombie.position.x - halfW && 
			this.position.x < zombie.position.x + halfW)
	{
		if(this.position.y > zombie.position.y - halfH && 
				this.position.y < zombie.position.y + halfH)
		{
			this.alive = false;
			zombie.alive = false;
			return true;
		}
	}
	return false;
};