"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var w;
	var a;
	var s;
	var d;
	var timeLeft = 60;
	var frame = 0;	
	var player = null;
    	var background = null;
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        //game.state.start('MainMenu');

    }
    
    function checkKeys(){

	if(w.isDown){
		player.body.velocity.y = -200;
		console.log("z");
	} else if (s.isDown){
		player.body.velocity.y = 200;
	} else {
		player.body.velocity.y = 0;
	}

	if(a.isDown){
		player.body.velocity.x = -200;
	} else if(d.isDown){
		player.body.velocity.x = 200;
	} else {
		player.body.velocity.x = 0;
	}
    }
	
    return {
    
        create: function () {
    		w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    		a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    		s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    		d = game.input.keyboard.addKey(Phaser.Keyboard.D);
		
		game.world.setBounds(0, 0, 800, 1400);
		background = game.add.sprite(0, 0, 'background');
            	player = game.add.sprite(400, 400, 'player');
		player.anchor.setTo(0.5, 0.5);
        	game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		game.camera.follow(player);


	},
    
        update: function () {
    		while(timeLeft > 0){
			if(frame==60){
				frame=0;
				timeLeft--;
			}
			frame++;
			//checkKeys();
			game.physics.arcade.accelerateToPointer(player, game.input.activePointer, 500, 500, 500);
		}
        }


    };
};
