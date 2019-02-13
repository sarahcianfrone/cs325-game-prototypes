"use strict";

window.onload = function(){

	var WIDTH = 800;
	var HEIGHT = 800;

	var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});


	function preload() {
		game.load.image('p1solid', 'assets/purplesolid.png');
		game.load.image('p2solid', 'assets/greensolid.png');
		game.load.image('p1pattern', 'assets/purplepattern.png');
		game.load.image('p2pattern', 'assets/greenpattern.png');
		game.load.image('ground', 'assets/Ground.png');
		game.load.image('background', 'assets/background.png');
		game.load.image('gold', 'assets/gold.png');
	}
	
	var p1Solid;
	var p1Pattern;
	var p2Solid;
	var p2Pattern;
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

	var p1Jumps = 2;
	var p1JumpPressed = false;
	var p2Jumps = 2;
	var p2JumpPressed = false;
	function create() {
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.physics.arcade.gravity.y = 100;
		game.add.sprite(0, 0, 'background');


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


		p1Solid = game.add.sprite(100, 100, 'p1solid');
		p1Solid.width = 40;
		p1Solid.height = 40;
		game.physics.arcade.enable(p1Solid);
		p1Solid.body.moves = false;
		
		p1Pattern = game.add.sprite(100, 300, 'p1pattern');
		p1Pattern.width = 40;
		p1Pattern.height = 40;
		game.physics.arcade.enable(p1Pattern);
		p1Pattern.body.gravity.y = 500;
		
		p2Solid = game.add.sprite(300, 100, 'p2solid');
		p2Solid.width = 40;
		p2Solid.height = 40;
		game.physics.arcade.enable(p2Solid);
		p2Solid.body.moves = false;
		
		p2Pattern = game.add.sprite(300, 300, 'p2pattern');
		p2Pattern.width=40;
		p2Pattern.height=40;
		game.physics.arcade.enable(p2Pattern);
		p2Pattern.body.gravity.y = 500;
	
		gold = game.add.sprite(WIDTH/2, HEIGHT-150, 'gold');
		gold.anchor = (0.5, 0.5);
		gold.width = 25;
		gold.height = 25;
		game.physics.arcade.enable(gold);
		gold.body.gravity.y = 0;

		w=game.input.keyboard.addKey(Phaser.Keyboard.W);
		a=game.input.keyboard.addKey(Phaser.Keyboard.A);
		s=game.input.keyboard.addKey(Phaser.Keyboard.S);
		d=game.input.keyboard.addKey(Phaser.Keyboard.D);

		j=game.input.keyboard.addKey(Phaser.Keyboard.J);
		k=game.input.keyboard.addKey(Phaser.Keyboard.K);
		l=game.input.keyboard.addKey(Phaser.Keyboard.L);
		i=game.input.keyboard.addKey(Phaser.Keyboard.I);
	
		p1Pattern.body.onCollide = new Phaser.Signal();
		p1Pattern.body.onCollide.add(function () { p1Jumps=2 }, this);
		p2Pattern.body.onCollide = new Phaser.Signal();	
		p2Pattern.body.onCollide.add(function () { p2Jumps=2 }, this);
	
	}


	function update() {
		checkCollision();	
		checkKeys();
	
	}
	
	function checkCollision(){
		game.physics.arcade.collide(p1Solid, platforms);
		game.physics.arcade.collide(p1Pattern, platforms);
		game.physics.arcade.collide(p2Solid, platforms);
		game.physics.arcade.collide(p2Pattern, platforms);
		
		game.physics.arcade.collide(p1Solid, p1Pattern);
		game.physics.arcade.collide(p1Solid, p2Pattern);
		game.physics.arcade.collide(p2Solid, p1Pattern);
		game.physics.arcade.collide(p2Solid, p2Pattern);
	}

	function checkKeys(){
		if(w.isDown){
			if(p1Jumps > 0 && !p1JumpPressed){
				p1Pattern.body.velocity.y = -550;
				p1Jumps--;
			}
			p1JumpPressed = true;
		} else p1JumpPressed = false; 
		if(a.isDown){
			p1Pattern.body.velocity.x = -250;
		} else if(d.isDown){
			p1Pattern.body.velocity.x = 250;
		} else {
			p1Pattern.body.velocity.x = 0;
		}
		if(s.isDown){
			//Player 1 shoot
		}

	


		if(i.isDown){
			if(p2Jumps > 0 && !p2JumpPressed){
				p2Pattern.body.velocity.y = -350;
				p2Jumps--;
			}
			p2JumpPressed = true;
		} else p2JumpPressed = false; 
		if(j.isDown){
			p2Pattern.body.velocity.x = -250;
		} else if(l.isDown){
			p2Pattern.body.velocity.x = 250;
		} else {
			p2Pattern.body.velocity.x = 0;
		}
		if(k.isDown){
			//Player 2 shoot
		}
	}

}
