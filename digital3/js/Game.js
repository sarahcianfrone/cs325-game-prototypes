"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var player = null;
	var background = null;
	var w;
	var a;
	var s;
	var d;

	var timeLeft = 60;
	var frame = 0;
	
	var greenHouse;
	
	
	class House{
		constructor(x, y, spritename){
			this.sprite = game.add.sprite(x, y, spritename);
			this.requested = false;
			this.numRequested = 0;
			this.generocity = 20;
		}

		//Returns the amount of tip money that the house gives 
		fulfillRequest(){
			var tip = this.numRequested * this.generocity / 20.0;
			this.requested = false;
			this.numRequested = 0;
			this.text.destroy();
			return tip;
		}

		//Generates a new request with generocity
		newRequest(){
			this.requested = true;
			this.numRequested = random() % 11 + 5;
			this.generocity = random() % 11 + 15;
			this.patience = random() % 5 + 1;
			this.text = game.add.text(sprite.x, sprite.y - 20, numRequested+"", {font: "15px Arial"});
		}

		//Every second the house is  there is a 1/patience chance that generocity will decrease
		wait(){
			if(this.requested){
				var rand = Math.random() % this.patience;
				if(rand == 0) this.generocity--;
			} else {
				var rand = Math.random() % 8;
				if(rand == 0) this.newRequest();
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

	function checkCollision(){
		game.physics.arcade.collide(greenHouse.sprite, player)
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

    };
};
