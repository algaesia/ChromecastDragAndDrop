//var player = {
//	setPosition: function(x,y) {
//		this.posX = x;
//		this.posY = y;
//	}
//}
//
//player.setPosition(10,10);
//alert(player.posX); //prints out 10
//function player(x,y) {
//	this.posX = x;
//	this.posY = y;
//}
//
//var newPlayer = new player(10,10);
//alert(newPlayer.posX); //prints out 10

var gameCanvas = document.getElementById("gameCanvas");
var gameContext = gameCanvas.getContext("2d");

var canvasWidth;
var canvasHeight;

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2AABB = Box2D.Collision.b2AABB;
var b2BodyDef = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;

var worldScale, fixDef;
var shapes = {};
var needToDraw, debug = false;
var gameWorld;

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};
})();

var addRandomShape = function(options) {
	options = options || {};
	if (Math.random() < 0.5) {
		this.circle(options);
	} else {
		this.box(options);
	}
}

var addCircle = function(options) {
	options.radius = 0.5 + Math.random();
	var shape = new Circle(options);
	shapes[shape.id] = shape;
	box2d.addToWorld(shape);
}

var addBox = function(options) {
	options.width = options.width || 0.5 + Math.random() * 2;
	options.height = options.height || 0.5 + Math.random() * 2;
	var shape = new Box(options);
	shapes[shape.id] = shape;
	box2d.addToWorld(shape);
}

var box2d = function() {	
	this.CreateWorld = function() {
		gameWorld = new b2World(new b2Vec2(0, 10), false);
		if (debug) 
		{
			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(ctx);
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
        }
	}
	
	this.CreateDefaultFixture = function(shape) {
		fixDef = new b2FixtureDef;
		fixDef.density = 1.0;
		fixDef.friction = 0.5;
		fixDef.restitution = 0.2;
	}

	this.CreateBodyDef = function(shape) {
		var bodyDef = new b2BodyDef;
		if (shape.isStatic) {
			bodyDef.type = b2Body.b2_staticBody;
		} else {
			bodyDef.type = b2Body.b2_dynamicBody;
		}
		bodyDef.position.x = shape.x;
		bodyDef.position.y = shape.y;
		bodyDef.userData = shape.id;
		bodyDef.angle = shape.angle;
		return bodyDef;
	}
	
	this.CreateBody = function(bodyDef) {
		return gameWorld.CreateBody(bodyDef);
	}
	
	this.CreateFixtures_Circle = function(body,shape) {
		fixDef.shape = new b2CircleShape(shape.radius);
		body.CreateFixture(fixDef);
	}
	
	this.CreateFixtures_Box = function(body, shape) {
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(shape.width * 0.5, shape.height * 0.5);
		body.CreateFixture(fixDef);
	}
	
	this.GetBodySpec = function(body) {
		return {
			x: body.GetPosition().x,
			y: body.GetPosition().y,
			angle: body.GetAngle(),
			centre: {
				x: body.GetWorldCenter().x,
				y: body.GetWorldCenter().y
			}
		}
	}
	
	this.addToWorld = function(shape) {
		var bodyDef = this.CreateBodyDef(shape);
		var body = this.CreateBody(bodyDef);
		
		//if it has radius, then it's a circle, so create a circle
		if (shape.radius) {
			this.CreateFixtures_Circle(body, shape);
		} else {
			this.CreateFixtures_Box(body, shape);
		}
	}
}

function gameLoop() {
	this.step = function() {
		//Compulsory Box2D step function
		var stepRate = 1 / 60;
		gameWorld.step(stepRate, 10, 10);
		gameWorld.clearForces();
	}
	
	this.update = function() {
		//update all the bodies in the game world - in this case,
		//all it's doing is setting the updated positions from
		//the step function that was called above
		for (var body = gameWorld.GetBodyList(); body; body = body.m_next) {
			if (body.IsActive() && typeof(body.GetUserData()) !== "undefined" && body.GetUserData() != null) {
				shapes[body.GetUserData()].update(box2d.GetBodySpec(body));
			}
		}
		needToDraw = true;
	}
	
	this.draw = function() {
		if (!needToDraw) {
			return;
		}
		
		if (!debug) {
			gameContext.clearRect(0,0,gameCanvas.width, gameCanvas.height);
		}
		
		for (var i in shapes) {
			shapes[i].draw(gameContext);
		}
		needToDraw = false;
	}
}

//Generates colour in hexadecimal
var generateColour = function() {
	var letters = "0123456789ABCDEF".split('');
	var colour = "#";
	for (var i = 0; i < 6; ++i) {
		colour += letters[Math.round(Math.random() * 15)];
	}
	return colour;
}

var init = function() {	
	this.simulate = function() {
		loop.step();
		loop.update();
		if (debug) {
			gameWorld.DrawDebugData();
		}
		loop.draw();
		requestAnimFrame(simulate);
	}

	this.defaultProperties = function() {
		worldScale = 30;
	}

	this.surroundings_rightWall = function() {
		addBox({
			x: 26.5, y: 13.7, width: 24.6, height: 2, isStatic: true
		});
	}
	
	this.surroundings_ground = function() {
		addBox({
			x: 12.3, y: 13.7, width: 24.6, height: 2, isStatic: true
		});
	}
	
	this.surroundings_leftWall = function() {
		addBox({
			x: -1, y: 6.3, width: 2, height: 12.6, isStatic: true
		});
	}
	
	this.callbacks = function() {
		gameCanvas.addEventListener("click", function(e) {
			var shapeOptions = {
				x: (gameCanvas.width / worldScale) * (e.offsetX / gameCanvas.width),
				y: 0
			};
			addRandomShape(shapeOptions);
		}, false);
	}
	
	this.start = function() {
		defaultProperties();
		
		box2d.CreateWorld();
		box2d.CreateDefaultFixture();
		
		surroundings_leftWall();
		surroundings_rightWall();
		surroundings_ground();
		
		callbacks();
		simulate();
	}
}

//Parent from which other shapes will inherit from
var BaseShape = function(vector) {
	this.id = Math.round(Math.random() * 1000000);
	this.x = vector.x || Math.random() * 23 + 1;
	this.y = vector.y || 0;
	this.angle = 0;
	this.colour = generateColour();
	this.centre = { x: null, y: null }
	this.isStatic = vector.isStatic || false;
	
	this.update = function(options) {
		this.angle = options.angle;
		this.centre = options.centre;
		this.x = options.x;
		this.y = options.y;
	}
}

var Circle = function(options) {
	BaseShape.call(this, options);
	this.radius = options.radius || 1;
	
	this.draw = function() {
		//pushes current drawing state onto the stack
		//includes things like transformation matrix, clipping space, fillStyle, font, strokeStyle and more
		//so instead of moving back and forwards from one context to another using matrix multiplication
		//saving simply stores the previous one while things are happening with the new one
		//restore simply reverts back to how things were before
		gameContext.save();
		gameContext.translate(this.x * worldScale, this.y * worldScale);
		gameContext.rotate(this.angle);
		gameContext.translate(-(this.x) * worldScale, -(this.y) * worldScale);
		
		gameContext.fillStyle = this.colour;
		gameContext.beginPath();
		gameContext.arc(this.x * worldScale, this.y * worldScale, this.radius * worldScale, 0, Math.PI * 2, true);
		gameContext.closePath();
		gameContext.fill();
		gameContext.restore();
	}
}
Circle.prototype = BaseShape;

var Box = function(options) {
	BaseShape.call(this, options);
	this.width = options.width || Math.random() * 2 + 0.5;
	this.height = options.height || Math.random() * 2 + 0.5;
	
	this.draw = function() {
		gameContext.save();
		gameContext.translate(this.x * worldScale, this.y * worldScale);
		gameContext.rotae(this.angle);
		gameContext.translate(-(this.x) * worldScale, -(this.y) * worldScale);
		gameContext.fillStyle = this.colour;
		gameContext.fillRect( (this.x - (this.width * 0.5)) * worldScale,
							  (this.y - (this.height * 0.5)) * worldScale,
							   this.width * worldScale,
							   this.height * worldScale
							 );
		gameContext.restore();
	}
}
Box.prototype = BaseShape;

init.start();

















