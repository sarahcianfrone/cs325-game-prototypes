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

	var INV_SPACE = SNAKE_TILE/4;
	var INV_LOW = 2;
	var INV_HIGH = WIDTH-((WIDTH/SNAKE_TILE)*2);
	var INV_BOT = (HEIGHT/SNAKE_TILE)-3;

	var up;
	var down;
	var left;
	var right;

	var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
	var gameStarted = false;
	var gameEnded = false;

	var graphics;

	function preload() {
		game.load.image('spaceship', 'assets/spaceship.png');
		game.load.audio('laser', 'assets/laser.wav');
		game.load.audio('eat', 'assets/eat.wav');
	}
	//The objects that are used for the pong portion of the game
	var paddle1;
	var paddle2;
	var pongBall;

	var snake;
	var apple;
	var tailX=[10]
	var tailY=[10]

	var spaceship;
	var bullet;

	var shot;
	var eat;

	var score=-1;
	var text;

	function create() {
		game.time.desiredFps=10;
		graphics = game.add.graphics(0,0);

		paddle1 = {xPos: PONG_SPACE, yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};
		paddle2 = {xPos: WIDTH-(PONG_SPACE+PONG_WIDTH), yPos: PONG_SPACE, xVel: 0, yVel: 0, accel: 10, maxVel: 20};
		pongBall = {xPos: (WIDTH-PONG_WIDTH)/2, yPos: 100, xVel:10, yVel:10};

		snake = {xPos:10, yPos:10, xVel:0, yVel:0, score:0, tailLength:3, tailX:[3], tailY:[3], speed:1}
		apple = {x:Math.floor(Math.random() * 20), y:Math.floor(Math.random()*20)};


		spaceship = {sprite: game.add.sprite((INV_LOW+4)*SNAKE_TILE, -100, 'spaceship'), xPos: INV_LOW+4, yPos:HEIGHT-10, speed: 0.5, goingTo: Math.floor(Math.random()*WIDTH/SNAKE_TILE-4)+2};
		spaceship.sprite.anchor.x=0.5;
		spaceship.sprite.anchor.y=1;
		spaceship.sprite.scale.x=0.7;
		spaceship.sprite.scale.y=0.7;

		bullet = {xPos: INV_LOW+4, yPos: INV_BOT, speed: 1};

		up=game.input.keyboard.addKey(Phaser.Keyboard.UP);
		down=game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		left=game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		right=game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	
		shot = game.add.audio('laser');
		eat = game.add.audio('eat');
		text = game.add.text(0, 0, "SCORE: "+score, {font:"15px Arial", fill: "#FF00FF", boundsAlignH: "center", boundsAlignV: "middle"});
	}

	function update() {
		draw();
		checkKeys();
		if(!gameStarted){
			text = game.add.text(0, 0, "PRESS ARROW KEY TO START", {font: "25px Arial", fill: "#FF00FF"});	
		}
		if(gameStarted){
			if(score == -1) increaseScore();
			if(!gameEnded){
				movePong();
				moveSnake();
				moveInvaders();
				testCollision();	
				if(isDead()){
					gameEnded = true;
					spaceship.sprite.destroy();
					text.destroy();
					text=game.add.text(0, 0, "You Lost!\nYour score was: "+score, {font: "bold 30px Arial", fill: "#FF00FF", boundsAlignH:"center", boundsAlignV: "middle"});
				}
			} else {
				//Expand this soon
				drawRect(0, 0, WIDTH, HEIGHT, 0x000000);
			}
		} else {
			drawRect(0, 0, WIDTH, HEIGHT, 0X000000);
		}
	}

	function draw(){
		drawPong();
		drawSnake();
		drawInvaders();
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

		if(paddle.yPos == ball.yPos) paddle.yVel = 0;
		if(paddle.yPos > HEIGHT-(PONG_HEIGHT+PONG_SPACE)) paddle.yPos = HEIGHT-(PONG_HEIGHT+PONG_SPACE);
		if(paddle.yPos < PONG_SPACE) paddle.yPos = PONG_SPACE;
	}

	function testCollision(){
		if(pongBall.xPos < PONG_SPACE+PONG_WIDTH*0.4 || pongBall.xPos > WIDTH-(PONG_SPACE+PONG_WIDTH*0.4)){
			//The ball is out of bounds
			resetBall();
		} else if(pongBall.xPos <= PONG_SPACE+PONG_WIDTH && pongBall.yPos >= paddle1.yPos-PONG_WIDTH && pongBall.yPos <= paddle1.yPos+PONG_HEIGHT){
			//Ball collides with paddle1 (left)
			pongBall.xVel*=-1;
			pongBall.yVel+=paddle2.yVel*0.4;
		} else if(pongBall.xPos >= WIDTH-(PONG_SPACE+PONG_WIDTH && pongBall.yPos >= paddle2.yPos-PONG_WIDTH && pongBall.yPos <= paddle2.yPos+PONG_HEIGHT)){
			//Ball collides with paddle2 (right)
			pongBall.xVel*=1;
			pongBall.yVel+=paddle2.yVel*0.4;
		}

		if(pongBall.yPos >= HEIGHT-PONG_WIDTH)	pongBall.yVel *= -1;
		if(pongBall.yPos <= 0) pongBall.yVel *= -1;
	}

	function resetBall(){
		pongBall.xPos = WIDTH-PONG_WIDTH/2;
		pongBall.yPos = HEIGHT/4 + PONG_WIDTH/2;
		pongBall.xVel = Math.floor(Math.random() * 20)-10;
		pongBall.yVel = Math.floor(Math.random() * 20)-10;
	}

	function drawSnake(){
		for(var i=0;i<snake.tailLength;i++){
			drawRect(snake.tailX[i]*SNAKE_TILE+SNAKE_SPACE, snake.tailY[i]*SNAKE_TILE+SNAKE_SPACE, SNAKE_TILE-(2*SNAKE_SPACE), SNAKE_TILE-(2*SNAKE_SPACE), 0x0000FF);
		}
		drawRect(apple.x*SNAKE_TILE, apple.y*SNAKE_TILE, SNAKE_TILE, SNAKE_TILE, 0xFF0000);
		drawRect(snake.xPos*SNAKE_TILE+SNAKE_SPACE, snake.yPos*SNAKE_TILE+SNAKE_SPACE, SNAKE_TILE-(2*SNAKE_SPACE), SNAKE_TILE-(2*SNAKE_SPACE), 0x00FF00);

	}

	function moveSnake(){
		if(snake.xPos == apple.x && snake.yPos == apple.y){
			snake.tailLength++;
			increaseScore();
			eat.play();
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
		if(snake.yPos >= HEIGHT/SNAKE_TILE) snake.yPos = 0;
		if(snake.yPos < 0) snake.yPos = HEIGHT/SNAKE_TILE-1;
	}

	function increaseScore(){
		score++;
		text.destroy();
		text = game.add.text(0, 0, "SCORE: "+score, {font:"15px Arial", fill: '#FF00FF', boundsAlignH: "center", boundsAlignV: "middle"});
		text.setTextBounds(0, 0, WIDTH, HEIGHT/8);
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


	function drawInvaders(){
		drawRect(bullet.xPos*SNAKE_TILE+INV_SPACE, bullet.yPos*SNAKE_TILE, INV_SPACE*2, INV_SPACE*3, 0xFF2222);
	}

	function moveInvaders(){
		if(spaceship.xPos < spaceship.goingTo){
			spaceship.xPos+=spaceship.speed;
		} else if (spaceship.xPos > spaceship.goingTo){
			spaceship.xPos -= spaceship.speed;
		} else if (spaceship.xPos == spaceship.goingTo){
			spaceship.goingTo = Math.floor(Math.random()*WIDTH/SNAKE_TILE-4)+2;
		}
			
		spaceship.sprite.x = spaceship.xPos*SNAKE_TILE;
		spaceship.sprite.y = spaceship.yPos;

		if(bullet.yPos == -2){
			bullet.yPos = INV_BOT;
			if(spaceship.goingTo > spaceship.xPos) bullet.xPos = Math.ceil(spaceship.xPos)
			else bullet.xPos = Math.floor(spaceship.xPos);
			shot.play();
		}
		else bullet.yPos -= 1;
	}

	function isDead(){
		//The player dies if they hit their own tail
		for(var i=0;i<snake.tailLength;i++){
			if(snake.xPos == snake.tailX[i] && snake.yPos == snake.tailY[i]) return true;
		}
		//Convert the snake's x and y from tiles to pixels so it's compatible with the pong stuff
		var snX = snake.xPos*SNAKE_TILE;
		var snY = snake.yPos*SNAKE_TILE;
		
		if(isOverlapping(pongBall, PONG_WIDTH, PONG_WIDTH, snX, snY) || isOverlapping(paddle1, PONG_WIDTH, PONG_HEIGHT, snX, snY) || isOverlapping(paddle2, PONG_WIDTH, PONG_HEIGHT, snX, snY)) return true;
		
		if(bullet.xPos == snake.xPos && bullet.yPos == snake.yPos) return true;
		
		return false;
	}

	function isOverlapping(thing, w, h, x, y){	
		//My algorithm to determine whether the two squares interlap assumes that there's an imaginary
		//second square with the bottom right corner the same as the pongBall and the top left corner being
		//one width of the snake tile to the left and one height of the snake tile above. This way I only
		//have to check if the top left corner of the snake tile is in that area instead of checking all 4 corners
		
		var lft = thing.xPos-(SNAKE_TILE-SNAKE_SPACE);	
		var upr = thing.yPos-(SNAKE_TILE-SNAKE_SPACE);
		var rgt = thing.xPos+w;
		var bot = thing.yPos+h; 

		if(x >= lft && x <= rgt && y >= upr && y <= bot) return true;
		else return false;
	}

	function drawRect(x, y, w, h, c){
		graphics.beginFill(c, 1);
		graphics.drawRect(x, y, w, h);
	}
	
};

