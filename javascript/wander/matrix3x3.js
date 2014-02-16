
//
// MATRIX ORGANIZATION
//
// The purpose of this class is so that a user might perform transformations
// without fiddling with plus or minus signs or transposing the matrix
// until the output "looks right." But of course, the specifics of the
// internal representation is important. Not only for the implementation
// in this file to be correct, but occasionally direct access to the
// matrix variables is necessary, or beneficial for optimization. Thus,
// we document our matrix conventions here.
//
// We use row vectors, so multiplying by our matrix looks like this:
//
//               | m11 m12 m23 |
//     [ x y 1 ] | m21 m22 m23 | = [ x' y' 1 ]
//				 | m31 m32 m33 |
//
// For completeness, this translates to:
//
//               | cos0   sine0  0 |
//     [ x y 1 ] | -sin0  cos0   0 | = [ x' y' 1 ]
//		         | tx     ty     1 |

var Matrix3x3 = function() {
	this.m11 = 1; this.m12 = 0; this.m13 = 0;
	this.m21 = 0; this.m22 = 1; this.m23 = 0;
	this.m31 = 0; this.m32 = 0; this.m33 = 1;
};

Matrix3x3.prototype.identity = function() {
	this.m11 = 1; this.m12 = 0; this.m13 = 0;
	this.m21 = 0; this.m22 = 1; this.m23 = 0;
	this.m31 = 0; this.m32 = 0; this.m33 = 1;
};

Matrix3x3.prototype.zeroTranslation = function()	{
	this.m31 = 0.0; this.m32 = 0.0; this.m33 = 1.0;	
};

Matrix3x3.prototype.setTranslation = function(x, y) {
	this.m31 = x; this.m32 = y; this.m33 = 1.0;	
};

Matrix3x3.prototype.incTranslation = function(x, y) {
	this.m31 += x; this.m32 += y; this.m33 = 1.0;	
};

Matrix3x3.prototype.setTranslationWithVector = function(v2)
{
	this.m31 = v2.x; this.m32 = v2.y; this.m33 = 1.0;	
};

Matrix3x3.prototype.setupTranslation = function(x, y) {
	this.m11 = 1; this.m12 = 0; this.m13 = 0;
	this.m21 = 0; this.m22 = 1; this.m23 = 0;
	this.m31 = x; this.m32 = y; this.m33 = 1;	
};

Matrix3x3.prototype.setupTranslationWithVector = function(v2) {
	this.m11 = 1; this.m12 = 0; this.m13 = 0;
	this.m21 = 0; this.m22 = 1; this.m23 = 0;
	this.m31 = v2.x; this.m32 = v2.y; this.m33 = 1;	
};

Matrix3x3.prototype.setupScale = function(sx, sy)
{
	this.m11 = sx; this.m12 = 0; this.m13 = 0;
	this.m21 = 0; this.m22 = sy; this.m23 = 0;
	this.m31 = 0; this.m32 = 0; this.m33 = 1.0;	
};

Matrix3x3.prototype.setupScaleWithVector = function(v2) {
	this.m11 = v2.x; this.m12 = 0; this.m13 = 0;
	this.m21 = 0; this.m22 = v2.y; this.m23 = 0;
	this.m31 = 0; this.m32 = 0; this.m33 = 1;	
};

Matrix3x3.prototype.setupRotation = function(theta) {
	var s = Math.sin(theta);
	var c = Math.cos(theta);
	
	this.m11 = c; this.m12 = s; this.m13 = 0;
	this.m21 = -s; this.m22 = c; this.m23 = 0;
	this.m31 = 0; this.m32 = 0; this.m33 = 1;	
};

Matrix3x3.prototype.setupShear = function(fx, fy) {
	this.m11 = 1; this.m12 = fy; this.m13 = 0;
	this.m21 = fx; this.m22 = 1; this.m23 = 0;
	this.m31 = 0; this.m32 = 0; this.m33 = 1.0;	
};

Matrix3x3.prototype.multiplyByVector = function(v2) {
	var v = new Vector2();
	
	v.x = v2.x * this.m11 + v2.y * this.m21 + this.m31;
	v.y = v2.x * this.m12 + v2.y * this.m22 + this.m32;
	return v;
};

Matrix3x3.prototype.multiplyByVectorXY = function(x, y) {
	var v = new Vector2();
	
	v.x = x * this.m11 + y * this.m21 + this.m31;
	v.y = x * this.m12 + y * this.m22 + this.m32;
	return v;
};

Matrix3x3.prototype.multiplyByMatrix = function(m) {
	var r = new Matrix3x3();
	
	r.m11 = this.m11*m.m11 + this.m12*m.m21 + this.m13*m.m31;
	r.m12 = this.m11*m.m12 + this.m12*m.m22 + this.m13*m.m32;
	r.m13 = this.m11*m.m13 + this.m12*m.m23 + this.m13*m.m33;

	r.m21 = this.m21*m.m11 + this.m22*m.m21 + this.m23*m.m31;
	r.m22 = this.m21*m.m12 + this.m22*m.m22 + this.m23*m.m32;
	r.m23 = this.m21*m.m13 + this.m22*m.m23 + this.m23*m.m33;

	r.m31 = this.m31*m.m11 + this.m32*m.m21 + this.m33*m.m31;
	r.m32 = this.m31*m.m12 + this.m32*m.m22 + this.m33*m.m32;
	r.m33 = this.m31*m.m13 + this.m32*m.m23 + this.m33*m.m33;
	
	return r;
};

Matrix3x3.prototype.applyToContext = function(context) {
	// the JavaScript setTransform function work a little differently in that
	// it takes a 2x2 matrix, plus a tx and ty value.
	// So we don't pass in the third column of the matrix.
	context.setTransform(this.m11, this.m12, this.m21, this.m22, this.m31, this.m32);
};



