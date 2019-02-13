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

	var platforms;

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
		p1Solid.width = 32;
		p1Solid.height = 32;
		p1Pattern = game.add.sprite(100, 300, 'p1pattern');
		p1Pattern.width = 32;
		p1Pattern.height = 32;
		p2Solid = game.add.sprite(300, 100, 'p2solid');
		p2Solid.width = 32;
		p2Solid.height = 32;
		p2Pattern = game.add.sprite(300, 300, 'p2pattern');
		p2Pattern.width=32;
		p2Pattern.height=32;
	

	}
	function update() {

	}

}
