"use strict";
//MOST RECENT VERSION : 2/5 11:02AM
window.onload = function(){
	var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game', {preload:preload, create:create, update:update });


	var ROCKET_MASS = 2;
	var MOON_MASS = 1;
	var EARTH_MASS = 9;
	var ROCKET = 0;
	var MOON = 1;
	var EARTH = 2;

	var GRAV = 9.8;
	
	var SCALE = 0.1;
	function Massive(mass, xPos, yPos, xVel, yVel){
		this.mass=mass;
		this.xPos=xPos;
		this.yPos=yPos;
		this.xVel=xVel;
		this.yVel=yVel;
	}

	var activeObjects = Array(3);
	
	function preload(){
		game.load.image('moon', 'assets/moon.png');
		game.load.image('earth', 'assets/earth.png');
		game.load.image('rocket', 'assets/rocket.png');
		game.load.image('rocketFire', 'assets/rocket_fire.png');
		game.load.image('background', 'assets/background.png');
	}
	var rocket;
	var moon;
	var earth;
	var background;

	function create(){

			var moonVelocity = GRAV*EARTH_MASS/200;
	
			activeObjects[ROCKET] = new Massive(ROCKET_MASS, 100, 100, 0, 0);
			rocket = game.add.sprite(100, 100, 'rocket');
			
		
			activeObjects[MOON] = new Massive(MOON_MASS, 600, 200, moonVelocity, 0);
			moon = game.add.sprite(600, 200, 'moon');
			moon.anchor.setTo(0.5, 0.5);
		
			activeObjects[EARTH] = new Massive(EARTH_MASS, game.world.centerX, game.world.centerY);
			earth = game.add.sprite(game.world.centerX, game.world.centerY, 'earth');
			earth.scale.setTo(4, 4);
			earth.anchor.setTo(0.5, 0.5);
			
			background = game.add.sprite(0, 0, 'background');
			
	}
	var runs = 0;
	function update(){
		doGravity();
		moveObjects();
		drawObjects();
	}


	function doGravity(){
		/*Uses the other doGravity method to handle gravity of everything on each other*/
		doGravity(EARTH, MOON, EARTH_MASS, MOON_MASS);
		doGravity(ROCKET, MOON, ROCKET_MASS, MOON_MASS);
		doGravity(ROCKET, EARTH, ROCKET_MASS, EARTH_MASS);
	}

	function doGravity(ind1, ind2, ind1M, ind2M){
		var yDist = activeObjects[ind1].yPos - activeObjects[ind2].yPos;
		var xDist = activeObjects[ind1].xPos - activeObjects[ind2].xPos;

		var gravY = GRAV*ind1M*ind2M/yDist*1.0;
		var gravX = GRAV*ind1M*ind2M/xDist*1.0;

		activeObjects[ind1].yVel += gravY*-1.0;
		activeObjects[ind2].yVel+= gravY;

		activeObjects[ind1].xVel += gravX*-1.0
		activeObjects[ind2].xVal+= gravX;
	}

	function moveObjects(){
		activeObjects[MOON].xPos+=activeObjects[MOON].xVel*SCALE;	
		activeObjects[MOON].yPos+=activeObjects[MOON].yVel*SCALE;
		
		activeObjects[EARTH].xPos+=activeObjects[EARTH].xVel*SCALE;
		activeObjects[EARTH].yPos+=activeObjects[EARTH].yVel*SCALE;
	}

	function drawObjects(){
		background = game.add.sprite(0, 0, 'background');
		rocket = game.add.sprite(activeObjects[ROCKET].xPos, activeObjects[ROCKET].yPos, 'rocket');
		moon = game.add.sprite(activeObjects[MOON].xPos, activeObjects[MOON].yPos, 'moon');
		earth = game.add.sprite(activeObjects[EARTH].xPos, activeObjects[EARTH].yPos, 'earth');	
	}
}
