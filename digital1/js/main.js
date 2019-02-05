"use strict";

window.onload = function() {
    

	var WIDTH=800;
	var HEIGHT=800;
	
	var SNAKE_SPACE = 2;
	
	
	var PONG_SPACE = 8;
	var PONG_WIDTH = 20;
	var PONG_HEIGHT = 100;


	var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
	var graphics;

	function preload() {

	}

	var paddle1;
	var paddle2;
	var pongBall;
	function create() {
		
		paddle1 = {xPos: PONG_SPACE, yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};
		paddle2 = {xPos: WIDTH-(PONG_SPACE+PONG_WIDTH), yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};

		pongBall = {xPos: WIDTH-PONG_WIDTH/2, yPos: HEIGHT-PONG_WIDTH/2, xVel:0, yVel:0};
	}

	function update() {
		drawPong();
	}

	function drawPong(){
		beginFill(0xFFFFFF, 1);
		drawRect(paddle1.xPos, paddle1.yPos, PONG_WIDTH, PONG_HEIGHT);
		drawRect(paddle2.xPos, paddle2.yPos, PONG_WIDTH, PONG_HEIGHT);
		drawRect(pongBall.xPos, pongBall.yPos, PONG_WIDTH, PONG_WIDTH);
	}
};

