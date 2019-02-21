"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var player = null;
	var background = null;
	var w;
	var a;
	var s;
	var d;

	int timeLeft = 60;
	int frame = 0;
	
	var greenHouse;
	
	
	class House(){
	
		var patience = 1;
		var generocity = 20;
		var sprite;
		var requested = false;
		var numRequested = 0;
		var text;
		constructor(x, y, spritename){
			sprite = game.add.sprite(x, y, spritename);
			requested = false;
			numRequested = 0;
			generocity = 20;
		}

		//Returns the amount of tip money that the house gives 
		fulfillRequest(){
			var tip = numRequested * generocity / 20.0;
			requested = false;
			numRequested = 0;
			text.destroy();
			return tip;
		}

		//Generates a new request with generocity
		newRequest(){
			requested = true;
			numRequested = random() % 11 + 5;
			generocity = random() % 11 + 15;
			patience = random() % 5 + 1;
			text = game.add.text(sprite.x, sprite.y - 20, numRequested+"", {font: "15px Arial"});
		}

		//Every second the house is  there is a 1/patience chance that generocity will decrease
		wait(){
			if(requested){
				var rand = random() % patience;
				if(rand == 0) generocity--;
			} else {
				var rand = random() % 8;
				if(rand == 0) newRequest();
			}
		}


	}


    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
	function checkKeys(){
		if(w.isDown){
			player.body.velocity.y = -200;
		} else if (s.isDown){
			player.body.velocity.y = 200;
		} else {
			player.body.velocity.y = 0;
		}

		if(a.isDown){
			player.body.velocity.x = -200;
		} else if (d.isDown){
			player.body.velocity.x = 200;
		} else {
			player.body.velocity.x = 0;
		}
	}

    return {
    
        create: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Create a sprite at the center of the screen using the 'logo' image.
            	w = game.input.keyboard.addKey(Phaser.Keyboard.W);
            	a = game.input.keyboard.addKey(Phaser.Keyboard.A);
            	s = game.input.keyboard.addKey(Phaser.Keyboard.S);
            	d = game.input.keyboard.addKey(Phaser.Keyboard.D);
		
		greenHouse = new House(200, 100, 'greenhouse');

		game.world.setBounds(0, 0, 800, 1400);
		background = game.add.sprite(0, 0, 'background');
		player = game.add.sprite( game.world.centerX, game.world.centerY, 'player' );
       		player.anchor.setTo( 0.5, 0.5 );
	       	game.physics.enable(player, Phaser.Physics.ARCADE );
       		player.body.collideWorldBounds = true;
		game.camera.follow(player);
        },
    
        update: function () {
		if(frame == 60){
			frame = 0;
			timeLeft--;
			greenHouse.wait();
		}
		frame++;
            	checkKeys();
		checkCollision();
        }

	function checkCollision(){
		game.physics.arcade.collide(greenHouse.sprite, player)
	}
    };
};
