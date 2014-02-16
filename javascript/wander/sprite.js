
function loadImage(filename) {
	var image = document.createElement("img");
	image.src = filename;
	return image;
}

var Frame = function(x, y, width, height, duration){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.duration = duration;
};

var Sprite = function(filename) {
	if(filename != null)
	{
		this.image = document.createElement("img");
		this.image.src = filename;
	}
	this.currentFrame = 0;
	this.frames = new Array();
	this.frameTime = 0;
	this.loop = true;
	this.offset = new Vector2();
};

Sprite.prototype.getWidth = function()
{
	return this.frames[this.currentFrame].width;
};

Sprite.prototype.getHeight = function()
{
	return this.frames[this.currentFrame].height;
};

Sprite.prototype.copy = function() {
	var newSprite = new Sprite();
	newSprite.image = this.image;
	newSprite.currentFrame = this.currentFrame;
	newSprite.frames = new Array();
	for(var i=0; i<this.frames.length; i++)
	{
		newSprite.addFrame(this.frames[i].x, this.frames[i].y, 
				this.frames[i].width, this.frames[i].height, this.frames[i].duration);
	}
	newSprite.frameTime = this.frameTime;
	newSprite.loop = this.loop;
	newSprite.offset = this.offset.copy();
	
	return newSprite;
};

Sprite.prototype.width = function() {
	return this.image.width;
};

Sprite.prototype.height = function() {
	return this.image.height;
};

Sprite.prototype.setLoop = function(loop) {
	return this.loop = loop;
};

Sprite.prototype.setOffset = function(x, y) {
	this.offset.set(x, y);
};

Sprite.prototype.addFrame = function(x, y, width, height, duration) {
	var frame = new Frame(x, y, width, height, duration);
	this.frames.push(frame);
};

Sprite.prototype.buildFrames = function(hFrameCount, vFrameCount, frameWidth, frameHeight, 
		xFrameOffset, yFrameOffset, xPadding, yPadding, frameDuration)
{
	var x = 0;
	var y = 0;
	var u = 0;	// x coord in texture
	var v = 0;	// y coord in texture
	
	v = yFrameOffset;
	for(y = 0; y < vFrameCount; y++)
	{
		u = xFrameOffset;
		for(x = 0; x < hFrameCount; x++)
		{
			this.addFrame(u, v, frameWidth, frameHeight, frameDuration);
			u += frameWidth + xPadding;
		}
		v += frameHeight + yPadding;
	}
};

Sprite.prototype.update = function(dt) {
	if(this.frames.length == 0)
		return;
	
	if(this.frames[this.currentFrame].duration < 0)
		return;
	
	this.frameTime += dt;
	
	while(this.frameTime > this.frames[this.currentFrame].duration)
	{
		this.currentFrame++;
		if(this.currentFrame >= this.frames.length)
			this.currentFrame = 0;
		this.frameTime -= this.frames[this.currentFrame].duration;
	}
};

Sprite.prototype.draw = function(c) {
	// img	Specifies the image, canvas, or video element to use	 
	// sx	Optional. The x coordinate where to start clipping	
	// sy	Optional. The y coordinate where to start clipping	
	// swidth	Optional. The width of the clipped image	
	// sheight	Optional. The height of the clipped image	
	// x	The x coordinate where to place the image on the canvas	
	// y	The y coordinate where to place the image on the canvas	
	// width	Optional. The width of the image to use (stretch or reduce the image)	
	// height	Optional. The height of the image to use (stretch or reduce the image)
		
	c.drawImage(this.image, 
			this.frames[this.currentFrame].x,
			this.frames[this.currentFrame].y,
			this.frames[this.currentFrame].width,
			this.frames[this.currentFrame].height,
			-this.offset.x, -this.offset.y,
			this.frames[this.currentFrame].width,
			this.frames[this.currentFrame].height);
};








