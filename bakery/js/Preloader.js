"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = game.add.sprite(0, 0, 'preloaderBackground');
            preloadBar = game.add.sprite(300, 400, 'preloaderBar');
    
            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.
            game.load.setPreloadSprite(preloadBar);   
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
           	game.load.image('story0', 'assets/story/story_1.png');
	    	game.load.image('story1', 'assets/story/story_2.png');
		    game.load.image('story2', 'assets/story/story_3.png');
            game.load.image('background', 'assets/game/background.png');
            game.load.image('tabBackground', 'assets/tabs/tabBackground_basic.png');
            game.load.image('maintabBackground', 'assets/tabs/maintab_background.png');
            game.load.image('enemyInfoBox', 'assets/game/enemyInfoBox.png');
            game.load.image('moneyBox', 'assets/game/moneyBox.png');
            game.load.image('upgradeBox', 'assets/game/upgradeBox.png');
            game.load.image('tabBottom', 'assets/tabs/tabBottom.png');
            game.load.image('buttonBase', 'assets/game/buttonBase.png');
            game.load.image('win', 'assets/story/win.png');
            game.load.image('lose', 'assets/story/lose.png');
            game.load.image('subtabSelected', 'assets/tabs/subtab_selected.png')
            game.load.image('subtabUnselected', 'assets/tabs/subtab_unselected.png');
            game.load.image('mainTabSelected', 'assets/tabs/maintab_selected.png')
            game.load.image('mainTabUnselected', 'assets/tabs/maintab_unselected.png')
        },
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            preloadBar.cropEnabled = false;
    		game.state.start('MainMenu');
        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            //if (game.cache.isSoundDecoded('titleMusic') && ready == false)
            //{
                ready = true;
                game.state.start('MainMenu');
            //}
    
        }
    
    };
};
