"use strict";

window.onload = function() {
    
	//All the constants for my program - mostly just spacing and sizing of things
	var WIDTH=400;
	var HEIGHT=400;
	
	var SNAKE_SPACE = 2;
	var SNAKE_TILE = WIDTH/20;

	var PONG_SPACE = 8;
	var PONG_WIDTH = 20;
	var PONG_HEIGHT = 100;


	var up;
	var down;
	var left;
	var right;

	var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
	var gameStarted = false;

	var graphics;

	function preload() {

	}
	//The objects that are used for the pong portion of the game
	var paddle1;
	var paddle2;
	var pongBall;

	var snake;
	var apple;
	var tailX=[10]
	var tailY=[10]

	function create() {
		graphics = game.add.graphics(0,0);

		paddle1 = {xPos: PONG_SPACE, yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};
		paddle2 = {xPos: WIDTH-(PONG_SPACE+PONG_WIDTH), yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};
		pongBall = {xPos: (WIDTH-PONG_WIDTH)/2, yPos: (HEIGHT-PONG_WIDTH)/2, xVel:10, yVel:10};

		snake = {xPos:10, yPos:10, xVel:0, yVel:0, score:0, tailLength:3, tailX:[3], tailY:[3], speed:1}
		apple = {x:Math.floor(Math.random() * 20), y:Math.floor(Math.random()*20)};

		up=game.input.keyboard.addKey(Phaser.Keyboard.UP);
		down=game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		left=game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		right=game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	}
	var x=0;
	function update() {
		if(x%6==0){
			drawPong();
			movePong();
			testCollision();
			checkKeys();
			drawSnake();
			moveSnake();
		}
		x++;
		if(x == 60) x=0;
	}

	function drawPong(){
		drawRect(0, 0, WIDTH, HEIGHT, 0x000000);
		drawRect(paddle1.xPos, paddle1.yPos, PONG_WIDTH, PONG_HEIGHT, 0xFFFFFF);
		drawRect(paddle2.xPos, paddle2.yPos, PONG_WIDTH, PONG_HEIGHT,0xFFFFFF);
		drawRect(pongBall.xPos, pongBall.yPos, PONG_WIDTH, PONG_WIDTH, 0xFFFFFF);
	}

	function movePong(){
		if(gameStarted){
			pongBall.xPos+=pongBall.xVel;
			pongBall.yPos+=pongBall.yVel;
			accelerateTowards(paddle1, pongBall);
			accelerateTowards(paddle2, pongBall);
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
		if(pongBall.yPos >= HEIGHT-PONG_WIDTH)	pongBall.yVel *= -1;
		if(pongBall.yPos <= 0) pongBall.yVel *= -1;
	}

	function drawSnake(){
		for(var i;i<snake.tailLength;i++){
			drawRect(snake.tailX[i]*SNAKE_TILE+SNAKE_SPACE, snake.tailY[i]*SNAKE_TILE+SNAKE_SPACE, SNAKE_TILE-(2*SNAKE_SPACE), SNAKE_TILE-(2*SNAKE_SPACE), 0x0000FF);
		}
		console.log(snake.tailX);
		drawRect(apple.x*SNAKE_TILE, apple.y*SNAKE_TILE, SNAKE_TILE, SNAKE_TILE, 0xFF0000);
		drawRect(snake.xPos*SNAKE_TILE+SNAKE_SPACE, snake.yPos*SNAKE_TILE+SNAKE_SPACE, SNAKE_TILE-(2*SNAKE_SPACE), SNAKE_TILE-(2*SNAKE_SPACE), 0x00FF00);

	}

	function moveSnake(){
		if(snake.xPos == apple.x && snake.yPos == apple.y){
			snake.tailLength++;
			//score increase
			apple.x = Math.floor(Math.random() * 20);
			apple.y = Math.floor(Math.random() * 20);
		}
		snake.tailX.unshift(snake.xPos);
		snake.tailY.unshift(snake.yPos);
		if(snake.tailX.length > snake.tailLength){
			snake.tailX.pop();
			snake.tailY.pop();
		}
		snake.xPos += snake.xVel;
		snake.yPos += snake.yVel;

		if(snake.xPos >= WIDTH/SNAKE_TILE) snake.xPos = 0;
		if(snake.xPos < 0) snake.xPos = WIDTH/SNAKE_TILE-1;
		if(snake.yPos >= HEIGHT.SNAKE_TILE) snake.yPos = 0;
		if(snake.yPos < 0) snake.yPos = HEIGHT/SNAKE_TILE-1;
	}

	function checkKeys(){
		if(left.isDown){
			snake.xVel=-1*snake.speed;
			snake.yVel=0;
			gameStarted=true;
		} else if(right.isDown){
			gameStarted=true;
			snake.xVel=snake.speed;
			snake.yVel=0;
		} else if(up.isDown){
			gameStarted=true;
			snake.xVel=0;
			snake.yVel=-1*snake.speed;
		} else if(down.isDown){
			gameStarted=true;
			snake.xVel=0;
			snake.yVel=snake.speed;
		} 
	}

	function drawRect(x, y, w, h, c){
		graphics.beginFill(c, 1);
		graphics.drawRect(x, y, w, h);
	}
	
};

