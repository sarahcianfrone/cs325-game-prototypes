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

	var GRAV = 10;
	
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

		runs++;	
		rocket=game.add.sprite(100, 100+runs, 'rocket');
		moon=game.add.sprite(200, 200+runs/2, 'moon');
		earth=game.add.sprite(game.world.centerX+runs, game.world.centerY+runs, 'earth');	
		background=game.add.sprite(0, 0);
		if (runs > 700) runs = 0;
	}
}
