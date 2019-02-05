"use strict";

<<<<<<< HEAD
window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'logo', 'assets/phaser.png' );
    }
    
    var bouncy;
    
    function create() {
        // Create a sprite at the center of the screen using the 'logo' image.
        bouncy = game.add.sprite( game.world.centerX, game.world.centerY, 'logo' );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        bouncy.anchor.setTo( 0.5, 0.5 );
        
        // Turn on the arcade physics engine for this sprite.
        game.physics.enable( bouncy, Phaser.Physics.ARCADE );
        // Make it bounce off of the world bounds.
        bouncy.body.collideWorldBounds = true;
        
        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
        var text = game.add.text( game.world.centerX, 15, "Build something amazing.", style );
        text.anchor.setTo( 0.5, 0.0 );
    }
    
    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        bouncy.rotation = game.physics.arcade.accelerateToPointer( bouncy, game.input.activePointer, 500, 500, 500 );
    }
};
=======
window.onload = function(){
	var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game', {preload:preload, create:create, update:update });
}

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
	game.load.image('moon', 'assets/phaser.png');
	game.load.image('earth', 'assets/earth.png');
	game.load.image('rocket', 'assets/rocket.png');
	game.load.image('rocketFire', 'assets/rocket_fire.png');
}

function create(){

	moonVelocity = GRAV*EARTH_MASS/200;

	activeObjects[ROCKET] = new Massive(ROCKET_MASS, 100, 100, 0, 0);
	rocket = game.add.sprite(100, 100, 'rocket');
	
	
	activeObjects[MOON] = new Massive(MOON_MASS, 600, 200, moonVelocity, 0);
	moon = game.add.sprite(600, 200, 'moon');
	moon.anchor.setTo(0.5, 0.5);
	
	activeObjects[EARTH] = new Massive(EARTH_MASS, game.world.centerX, game.world.centerY);
	earth = game.add.sprite(game.world.centerX, game.world.centerY);
	earth.anchor.setTo(0.5, 0.5);
}

function update(){

}

>>>>>>> e58cb8219240e7c6cc8d2b1129d54ab762763a3e
