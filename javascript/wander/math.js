
var KPI_OVER_180 = Math.PI / 180;
var K180_OVER_PI = 180 / Math.PI;
var KPI_OVER_2 = Math.PI / 2;


function deg2Rad(degrees)
{
	return degrees * KPI_OVER_180; // or: (degrees/180)*Math.PI
}

function rad2Deg(radians)
{
	return radians * K180_OVER_PI; // or: (radians/Math.PI)*180
}

//
// shear(c, kx, ky)
// Shear transform:
// x' = x + kx*y;
// y' = y + ky*x; 
// Author: Samuel Cartwright, 01/11/12
function shear(c, kx, ky)
{
	c.transform(1, ky, kx, 1, 0, 0); 
}

//
// rotateAbout(c, theta, x, y)
// Rotate theta radians clockwise around (x,y).
// This can also be accomplished with a translate,
// rotate, translate back sequence of transformations.
// Author: Samuel Cartwright, 01/11/12
function rotateAbout(c, theta, x, y) 
{
	var ct = Math.cos(theta), st = Math.sin(theta);
	c.transform(ct, -st, st, ct, -x*ct-y*st+x, x*st-y*ct+y);
}

//
// lookat(x, y)
// Return the angle of rotation necessary for an object to be 'looking at'
// an x,y coordinate
// The angle is returned in radians
// Author: Samuel Cartwright, 01/11/12
function lookAt(x, y)
{
	return Math.atan2(y, x) + KPI_OVER_2;
}

//
// rand(floor, ceil)
// Return a random number within the range of the two input variables
// Author: Samuel Cartwright, 01/11/12
function rand(floor, ceil)
{
	return Math.floor((Math.random()*ceil)+floor);
}

//
// PseuoRand
// A random function to produce predictable random numbers
// (also, the JavaScript random function doesn't give very good random numbers)
var PseudoRandom = function(gen1, seed, max) {
	this.gen1 = gen1;
	this.gen2 = gen1 * 2;
	this.seed = seed;
	this.max = max;
};

PseudoRandom.prototype.next = function(){
	var newSeed = (this.gen1 * this.seed) + this.gen2;
	
	newSeed %= this.max;
	this.seed = newSeed;
	return this.seed;
};

//
// nextClamped
// Returns a random number clamped between -1 and 1
//
PseudoRandom.prototype.nextClamped = function() {
	var r = this.next()/(this.max>>1);
	return r-1;
}




