
var BloodSplat = function(texture, x, y) {
	this.image = texture;
	
	this.position = new Vector2();	
	this.position.set(x, y);
};

BloodSplat.prototype.draw = function(c) 
{
	c.drawImage(this.image, 0, 0, this.image.width, this.image.height,
			this.position.x - this.image.width/2, 
			this.position.y - this.image.height/2, 
			this.image.width, this.image.height);
};
