"use strict";
GameStates.makeGame = function(game, shared){

	var WIDTH = 800;
	var HEIGHT = 800;

	var p1Solid;
	var p1Pattern;
	var p2Solid;
	var p2Pattern;
	
	var p1Weapon;
	var p2Weapon;

	var gold;

	var platforms;

	var w;
	var a;
	var s;
	var d;
	
	var j;
 	var k;
	var l;
	var i;

	var MAX_JUMPS = 4

	var p1Weight = 8;
	var p2Weight = 8;
	var p1Score = 0;
	var p2Score = 0;


	var p1ShootTimer = 0;
	var p2ShootTimer = 0;

	var p1Jumps = MAX_JUMPS;
	var p1JumpPressed = false;
	var p2Jumps = MAX_JUMPS;
	var p2JumpPressed = false;
	var text;
	var shoot;
	var coin;
	
	var gameEnded = false;
	var hasShot = 0;
	//var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});


//	function preload() {
//		game.load.image('p1solid', 'assets/purplesolid.png');
//		game.load.image('p2solid', 'assets/greensolid.png');
//		game.load.image('p1pattern', 'assets/purplepattern.png');
//		game.load.image('p2pattern', 'assets/greenpattern.png');
//		game.load.image('ground', 'assets/Ground.png');
//		game.load.image('background', 'assets/background.png');
//		game.load.image('p1bullet', 'assets/purplebullet.png');
//		game.load.image('p2bullet', 'assets/greenbullet.png');
		
//		game.load.image('gold', 'assets/gold.png');
	
//		game.load.audio('shoot', 'assets/shoot.wav');
//		game.load.audio('coin', 'assets/coin.wav');
	}



	
	function checkCollision(){
		game.physics.arcade.collide(p1Solid, platforms);
		game.physics.arcade.collide(p1Pattern, platforms, function() {p1Jumps = MAX_JUMPS;});
		game.physics.arcade.collide(p2Solid, platforms);
		game.physics.arcade.collide(p2Pattern, platforms, function() {p2Jumps = MAX_JUMPS;});
		
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
		p1Weight = 8;
		p2Weight = 8;
	}
		
	function p1hitPattern(sprite, bullet){
		bullet.kill();
		p1ScoreIncrease(1);
		if(p2ShootTimer < 20) p2ShootTimer = 120;
	}


	function p2hitPattern(sprite, bullet){
		bullet.kill();
		p2ScoreIncrease(1);
		if(p1ShootTimer < 20) p1ShootTimer = 120;
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
				p1Pattern.body.velocity.y = -350;
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
			if(p1ShootTimer == 0){
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
			if(p2ShootTimer == 0){
				p2Weapon.fire();
				if(hasShot == 0) shoot.play();
			}
		}
	}

	return{
	create:function() {
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
		p1Pattern.body.gravity.y = 600;
		
		p2Solid = game.add.sprite(WIDTH-120, HEIGHT-260, 'p2solid');
		p2Solid.width = 40;
		p2Solid.height = 40;
		game.physics.arcade.enable(p2Solid);
		p2Solid.body.moves = false;
		
		p2Pattern = game.add.sprite(WIDTH/2+60, 300, 'p2pattern');
		p2Pattern.width=40;
		p2Pattern.height=40;
		game.physics.arcade.enable(p2Pattern);
		p2Pattern.body.gravity.y = 600;

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

		j=game.input.keyboard.addKey(Phaser.Keyboard.J);
		k=game.input.keyboard.addKey(Phaser.Keyboard.K);
		l=game.input.keyboard.addKey(Phaser.Keyboard.L);
		i=game.input.keyboard.addKey(Phaser.Keyboard.I);
	
		text = game.add.text(WIDTH/2-100, 25, "Player 1: "+p1Score+"\nPlayer 2: "+p2Score, {font: "20px Arial", fill: "#fff", boundsAlignH: "center"}); 
	}

	update: function() {
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
			if(p1ShootTimer > 0) p1ShootTimer--;
			if(p2ShootTimer > 0) p2ShootTimer--;
			gold.x += (p2Weight - p1Weight)/10;

			if(p1Pattern.x < 0) p1Pattern.x = WIDTH;
			if(p2Pattern.x < 0) p2Pattern.x = WIDTH;
			if(p1Pattern.x > WIDTH) p1Pattern.x = 0;
			if(p2Pattern.x > WIDTH) p2Pattern.x = 0;
		}
	}
};

};
