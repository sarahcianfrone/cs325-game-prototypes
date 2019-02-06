"use strict";

window.onload = function() {
    
	//All the constants for my program - mostly just spacing and sizing of things
	var WIDTH=800;
	var HEIGHT=800;
	
	var SNAKE_SPACE = 2;
	
	var PONG_SPACE = 8;
	var PONG_WIDTH = 20;
	var PONG_HEIGHT = 100;


	var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
	var gameStarted = true;

	var graphics;

	function preload() {

	}
	//The objects that are used for the pong portion of the game
	var paddle1;
	var paddle2;
	var pongBall;

	function create() {
	
		graphics = game.add.graphics(0,0);

		paddle1 = {xPos: PONG_SPACE, yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};
		paddle2 = {xPos: WIDTH-(PONG_SPACE+PONG_WIDTH), yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};

		pongBall = {xPos: (WIDTH-PONG_WIDTH)/2, yPos: (HEIGHT-PONG_WIDTH)/2, xVel:0, yVel:0};
	}

	function update() {
		drawPong();
	}

	function drawPong(){
		graphics.beginFill(0xFFFFFF, 1);
		graphics.drawRect(paddle1.xPos, paddle1.yPos, PONG_WIDTH, PONG_HEIGHT);
		graphics.drawRect(paddle2.xPos, paddle2.yPos, PONG_WIDTH, PONG_HEIGHT);
		graphics.drawRect(pongBall.xPos, pongBall.yPos, PONG_WIDTH, PONG_WIDTH);
	}

	function movePong(){
		if(gameStarted){
			pongBall.xPos+=pongBall.xVel;
			pongBall.yPos+=pongBall.yVel;

			accelerateTowards(paddle1, pongBall);
			accelerateTowards(paddle2, pongBall);

			testCollision();
		}
	}

	function accelerateTowards(paddle, ball){
		var distance = ball.yPos - paddle.yPos;
		if(distance < 0){
			//Ball position < paddle position - paddle position goes down
			if(distance >= -1*paddle.accel) paddle.yPos = ball.yPos;
			else paddle.yPos -= paddle.accel;
		} else if (distance > 0){
			//Ball position > paddle position - paddle position goes up
			if(distance <= paddle.accel) paddle.yPos = ball.yPos;
			else paddle.yPos += paddle.accel;
		}
	}

	function testCollision(){
		if(!(pongBall.xPos > PONG_SPACE+(PONG_WIDTH*3/2) && pongBall.xPos < WIDTH-(PONG_SPACE+(PONG_WIDTH*3/2)))){
			pongBall.xVel*=-1;
		}
	}
};

