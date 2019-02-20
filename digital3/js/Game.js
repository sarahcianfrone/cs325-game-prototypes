"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var player = null;
	var background = null;
	var w;
	var a;
	var s;
	var d;
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
		
		game.world.setBounds(0, 0, 800, 1400);
		background = game.add.sprite(0, 0, 'background');
		player = game.add.sprite( game.world.centerX, game.world.centerY, 'player' );
       		player.anchor.setTo( 0.5, 0.5 );
	       	game.physics.enable(player, Phaser.Physics.ARCADE );
       		player.body.collideWorldBounds = true;
        },
    
        update: function () {
    
            //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
            
            // Accelerate the 'logo' sprite towards the cursor,
            // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
            // in X or Y.
            // This function returns the rotation angle that makes it visually match its
            // new trajectory.
            checkKeys();
        }
    };
};
