"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
	var glasses;
	var brokenGlasses;
	var pig;
	var botY = 600;
	var midY = 500;
	var topY = 400;
	var cursors;
	var frame = 0;
	var score;

	function addObjects(){
    		var random = game.rnd.integerInRange(0, 120);
		if(random <= frame / 60.0 * score+5){
			var mod3 = random%3;
			var yVal = 0;
			if(mod3 == 0) yVal = topY
			else if(mod3 == 1) yVal = topY;
			else yVal = topY;
			if(random % 2 == 0){
				brokenGlass = brokenGlasses.create(800, yVal, 'brokenGlasses');
				brokenGlass.body.moves = false;
				brokenGlass.anchor.setTo(0.5, 0.5);
			} else {
				glass = glasses.create(800, yVal, 'glasses');
				glass.body.moves = false;
				glass.anchor.setTo(0.5, 0.5);
			}
		}
	}

	function checkCollision(){
		game.physics.arcade.collide(pig, brokenGlasses, hitBrokenGlasses);
		game.physics.arcade.collide(pig, glasses, hitGlasses);
	}

	function hitBrokenGlasses(sprite, glasses){
		glasses.kill();
		score--;
		updateText();
	}

	function hitGlasses(sprite, glasses){
		glasses.kill();
		score++;
		updateText();
	}

	function checkKeys(){
		if(cursors.up.isDown){
			if(pig.y > topY) pig.y -= (midY-topY);
		} else if(cursors.down.isDown){
			if(pig.x < botY) pig.y += (midY-topY);
		}
	}

	function updateText(){
		console.log("Score = "+score);
	}
    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {

       		pig = game.add.sprite(60, midY, 'pig');
		pig.anchor.setTo(0.5, 0.5);
		game.physics.enable(pig, Phaser.Physics.ARCADE);
		pig.body.velocity.x = 50;
            	game.camera.follow(pig);

		brokenGlasses = game.add.group();
		brokenGlasses.enableBody = true;	
		brokenGlasses.physicsBodyType = Phaser.Physics.ARCADE;


		glasses = game.add.group();
		glasses.enableBody = true;
		glasses.physicsBodyType = Phaser.Physics.ARCADE;
		

		cursors = game.input.keyboard.createCursorKeys();
            
		

        },
    
        update: function () {
		frame = frame < 60 ? frame+1 : 0;
		addObjects();
		checkCollision();
		checkKeys();

        } //end update
    };
};
