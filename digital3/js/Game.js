"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var bouncy = null;
	var cursors = null;
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
	if(cursors.up.isDown){
		player.body.velocity.y = -20;
	} else if (cursors.down.isDown){
		player.body.velocity.y = 20;
	} else {
		player.body.velocity.y = 0;
	}

	if(cursors.left.isDown){
		player.body.velocity.x = -20;
	} else if(cursors.right.isDown){
		player.body.velocity.x = 20;
	} else {
		player.body.velocity.x = 0;
	}
    }
	
    return {
    
        create: function () {
    		cursors = game.input.keyboard.createCursorKeys();
		game.world.setBounds(0, 0, 800, 1400);
		background = game.add.sprite(0, 0, 'background');
            	player = game.add.sprite(400, 400, 'player');
        	game.physics.arcade.enable(player);
		game.camera.follow(player);
	},
    
        update: function () {
    		while(timeLeft > 0){
			if(frame==60){
				frame=0;
				timeLeft--;
			}
			frame++;
			checkKeys();
			console.log("X");
		}
        }


    };
};
