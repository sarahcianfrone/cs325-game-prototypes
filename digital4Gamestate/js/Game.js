"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    	var p1Solid;
	var p1Pattern;
	var p2Solid;
	var p2Pattern;
	var HEIGHT = 800;
	var WIDTH = 800;
	var p1Weapon;
	var p2Weapon;

	var gold;

	var platforms;

	var w;
	var a;
	var s;
	var d;
	var e;
	var j;
 	var k;
	var l;
	var i;
	var o;

	var MAX_JUMPS = 4

	var p1Weight = 8;
	var p2Weight = 8;
	var p1Score = 0;
	var p2Score = 0;

	var p1SwapTimer = 0;
	var p2SwapTimer = 0;
	var p1ShootTimer = 0;
	var p2ShootTimer = 0;

	var p1Jumps = MAX_JUMPS;
	var p1JumpPressed = false;
	var p2Jumps = MAX_JUMPS;
	var p2JumpPressed = false;

	var shoot;
	var coin;

	var text;

	var gameEnded = false;
	var hasShot = 0;	

function moveGold(){
		var theta1 = game.math.angleBetween(p1Solid.x, p1Solid.y, gold.x, gold.y);
		var theta2 = game.math.angleBetween(p2Solid.x, p2Solid.y, gold.x, gold.y);

		gold.y-=(p1Weight*Math.sin(theta1) + p2Weight*Math.sin(theta2))/10;
		gold.x-=(p1Weight*Math.cos(theta1) + p2Weight*Math.cos(theta2))/10;
	}

	function checkCollision(){
		game.physics.arcade.collide(p1Solid, platforms);
		game.physics.arcade.collide(p1Pattern, platforms, function() {	
			p1Jumps = MAX_JUMPS;
			if(e.isDown && p1SwapTimer == 0){
				p1SwapTimer = 60*5;
				var temp = p1Pattern.x;
				p1Pattern.x = p1Solid.x;
				p1Solid.x = temp;
				temp = p1Pattern.y;
				p1Pattern.y = p1Solid.y;
				p1Solid.y = temp;
			}
		});
		game.physics.arcade.collide(p2Solid, platforms);
		game.physics.arcade.collide(p2Pattern, platforms, function() {
			p2Jumps = MAX_JUMPS;
			if(o.isDown && p2SwapTimer == 0){
				p2SwapTimer = 60*5;
				var temp = p2Pattern.x;
				p2Pattern.x = p2Solid.x;
				p2Solid.x = temp;
				temp = p2Pattern.y;
				p2Pattern.y = p2Solid.y;
				p2Solid.y = temp;
			}
		});
		
		game.physics.arcade.collide(p1Solid, p1Pattern);
		game.physics.arcade.collide(p1Solid, p2Pattern);
		game.physics.arcade.collide(p2Solid, p1Pattern);
		game.physics.arcade.collide(p2Solid, p2Pattern);
		
		game.physics.arcade.collide(p1Weapon.bullets, p2Solid, p1hitSolid);
		game.physics.arcade.collide(p1Weapon.bullets, p2Pattern, p1hitPattern);
		game.physics.arcade.collide(p2Weapon.bullets, p1Pattern, p2hitPattern);
		game.physics.arcade.collide(p2Weapon.bullets, p1Solid, p2hitSolid);

		game.physics.arcade.collide(gold, p1Solid, function(){ resetGold(); p1ScoreIncrease(50); coin.play();});
		game.physics.arcade.collide(gold, p2Solid, function(){ resetGold(); p2ScoreIncrease(50); coin.play();});
	}

	function p1ScoreIncrease(amount){
		p1Score+=amount;
		text.destroy();
		text = game.add.text(WIDTH/2, 25, "Player 1: "+p1Score+"\nPlayer 2: "+p2Score, {font: "20px Arial", fill: "#fff", boundsAlignH: "center"}); 
	}

	function p2ScoreIncrease(amount){
		p2Score+=amount;
		text.destroy();
		text = game.add.text(WIDTH/2-100, 25, "Player 1: "+p1Score+"\nPlayer 2: "+p2Score, {font: "20px Arial", fill: "#fff", boundsAlignH: "center"}); 
	}

	function resetGold(){
		gold.x = WIDTH/2 - 12.5;
		gold.y = HEIGHT-255;
		p1Weight = 8;
		p2Weight = 8;
	}
		
	function p1hitPattern(sprite, bullet){
		bullet.kill();
		p1ScoreIncrease(1);
		if(p2ShootTimer <= -60) p2ShootTimer = 60;
	}


	function p2hitPattern(sprite, bullet){
		bullet.kill();
		p2ScoreIncrease(1);
		if(p1ShootTimer <= -60) p1ShootTimer = 60;
	}


	function p1hitSolid(sprite, bullet){
		bullet.kill();
		if(p2Weight > 0) p2Weight--;
		else p1Weight+=0.5;
	}

	function p2hitSolid(sprite, bullet){
		bullet.kill();
		if(p1Weight > 0) p1Weight--;
		else p2Weight+=0.5
	}


	function checkKeys(){
		if(w.isDown){
			if(p1Jumps > 0 && !p1JumpPressed){
				p1Pattern.body.velocity.y = -450;
				p1Jumps--;
			}
			p1JumpPressed = true;
		} else p1JumpPressed = false; 
		if(a.isDown){
			p1Pattern.body.velocity.x = -350;
			p1Weapon.fireAngle = 180;
		} else if(d.isDown){
			p1Weapon.fireAngle = 0;
			p1Pattern.body.velocity.x = 350;
		} else {
			p1Pattern.body.velocity.x = 0;
		}
		if(s.isDown){
			if(p1ShootTimer <= 0){
				p1Weapon.fire();
				if(hasShot == 0) shoot.play();
			}
		}

	


		if(i.isDown){
			if(p2Jumps > 0 && !p2JumpPressed){
				p2Pattern.body.velocity.y = -350;
				p2Jumps--;
			}
			p2JumpPressed = true;
		} else p2JumpPressed = false; 
		if(j.isDown){
			p2Weapon.fireAngle = 180;
			p2Pattern.body.velocity.x = -350;
		} else if(l.isDown){
			p2Weapon.fireAngle = 0;
			p2Pattern.body.velocity.x = 350;
		} else {
			p2Pattern.body.velocity.x = 0;
		}
		if(k.isDown){
			if(p2ShootTimer <= 0){
				p2Weapon.fire();
				if(hasShot == 0) shoot.play();
			}
		}
	}

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
           game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.physics.arcade.gravity.y = 100;
		//game.add.sprite(0, 0, 'background');

		shoot = game.add.audio('shoot');
		coin = game.add.audio('coin');

		platforms = game.add.group();
		platforms.enableBody = true;
		var plat = platforms.create(0, HEIGHT-50, 'ground');
		plat.body.immovable = true;
		plat.body.gravity.y = 0;	
		plat.body.moves = false;

		plat = platforms.create(0, HEIGHT-220, 'ground');
		plat.scale.setTo(0.25 , 0.4);
		plat.body.immovable = true;
		plat.body.gravity.y = 0;	
		plat.body.moves = false;
		
		plat = platforms.create(WIDTH-200, HEIGHT-220, 'ground');
		plat.scale.setTo(0.25, 0.4);
		plat.body.immovable = true;
		plat.body.gravity.y = 0;	
		plat.body.moves = false;
		
		plat = platforms.create(250, HEIGHT-390, 'ground');
		plat.scale.setTo(0.625, 0.4);
		plat.body.immovable = true;
		plat.body.gravity.y = 0;	
		plat.body.moves = false;

		plat = platforms.create(20, 100, 'ground');
		plat.scale.setTo(0.3, 0.4);
		plat.body.immovable = true;
		plat.body.gravity.y = 0;	
		plat.body.moves = false;

		plat = platforms.create(WIDTH-260, 100, 'ground');
		plat.scale.setTo(0.3, 0.4);
		plat.body.immovable = true;
		plat.body.gravity.y = 0;	
		plat.body.moves = false;


		p1Solid = game.add.sprite(80, HEIGHT-260, 'p1solid');
		p1Solid.width = 40;
		p1Solid.height = 40;
		game.physics.arcade.enable(p1Solid);
		p1Solid.body.moves = false;
		
		p1Pattern = game.add.sprite(WIDTH/2-100, 300, 'p1pattern');
		p1Pattern.width = 40;
		p1Pattern.height = 40;
		game.physics.arcade.enable(p1Pattern);
		p1Pattern.body.gravity.y = 700;
		
		p2Solid = game.add.sprite(WIDTH-120, HEIGHT-260, 'p2solid');
		p2Solid.width = 40;
		p2Solid.height = 40;
		game.physics.arcade.enable(p2Solid);
		p2Solid.body.moves = false;
		
		p2Pattern = game.add.sprite(WIDTH/2+60, 300, 'p2pattern');
		p2Pattern.width=40;
		p2Pattern.height=40;
		game.physics.arcade.enable(p2Pattern);
		p2Pattern.body.gravity.y = 700;

		p1Weapon = game.add.weapon(20, 'p1bullet');
		p1Weapon.bulletSpeed = 600;
		p1Weapon.bullets.setAll('scale.x', 0.004);
		p1Weapon.bullets.setAll('scale.y', 0.004);
		p1Weapon.fireRate = 80;
		p1Weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
		p1Weapon.bulletKillDistance = 500;
		p1Weapon.trackSprite(p1Pattern);
		p1Weapon.offsetX = 20;
		p1Weapon.offsetY = 20;

		p2Weapon = game.add.weapon(20, 'p2bullet');
		p2Weapon.bulletSpeed = 600;
		p2Weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
		p2Weapon.fireRate = 80;
		p2Weapon.bullets.setAll('scale.x', 0.004);
		p2Weapon.bullets.setAll('scale.y', 0.004);
		p2Weapon.bulletKillDistance = 500;
		p2Weapon.trackSprite(p2Pattern);
		p2Weapon.offsetX = 20;
		p2Weapon.offsetY = 20;

		gold = game.add.sprite(WIDTH/2, HEIGHT-255, 'gold');
		//gold.anchor = (0.5, 0.5);
		game.physics.arcade.enable(gold);
		//gold.x = 200;
		//gold.y = 200;
		gold.width = 25;
		gold.height = 25;
		gold.body.gravity.y = 0;

		w=game.input.keyboard.addKey(Phaser.Keyboard.W);
		a=game.input.keyboard.addKey(Phaser.Keyboard.A);
		s=game.input.keyboard.addKey(Phaser.Keyboard.S);
		d=game.input.keyboard.addKey(Phaser.Keyboard.D);
		e=game.input.keyboard.addKey(Phaser.Keyboard.E);
		j=game.input.keyboard.addKey(Phaser.Keyboard.J);
		k=game.input.keyboard.addKey(Phaser.Keyboard.K);
		l=game.input.keyboard.addKey(Phaser.Keyboard.L);
		i=game.input.keyboard.addKey(Phaser.Keyboard.I);
		o=game.input.keyboard.addKey(Phaser.Keyboard.O);
		text = game.add.text(WIDTH/2-100, 25, "Player 1: "+p1Score+"\nPlayer 2: "+p2Score, {font: "20px Arial", fill: "#fff", boundsAlignH: "center"}); 

        },
    
        update: function () {
    if(p1Score >= 200){
			if(!gameEnded){
				text.destroy();
				text = game.add.text(WIDTH/2-100, 25, "Player 1 Wins!", {font: "25px Arial", fill: "#fff", boundsAlignH: "center"});
			} 
		} else if (p2Score >= 200){
			if(!gameEnded){
				text.destroy();
				text = game.add.text(WIDTH/2-100, 25, "Player 2 Wins!", {font: "25px Arial", fill: "#fff", boundsAlignH: "center"});
			} 
		} else {
			hasShot++;
			if(hasShot == 4) hasShot = 0;
			checkCollision();	
			checkKeys();
			if(p1ShootTimer > -60) p1ShootTimer--;
			if(p2ShootTimer > -60) p2ShootTimer--;
	
		
			moveGold();
			if(p1SwapTimer > 0) p1SwapTimer--;
			if(p2SwapTimer > 0) p2SwapTimer--;
			if(p1Pattern.x < 0) p1Pattern.x = WIDTH;
			if(p2Pattern.x < 0) p2Pattern.x = WIDTH;
			if(p1Pattern.x > WIDTH) p1Pattern.x = 0;
			if(p2Pattern.x > WIDTH) p2Pattern.x = 0;
		}
		}
    };
};
