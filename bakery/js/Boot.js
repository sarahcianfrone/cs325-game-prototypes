"use strict";

var GameStates = {};

GameStates.makeBoot = function( game ) {
    return {
        init: function () {
    
            //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
            game.input.maxPointers = 1;
    
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            game.stage.disableVisibilityChange = true;
    
	    game.height = 800;
	    game.width  = 800;
    
        },
    
        preload: function () {
    
            //  Here we load the assets required for our Preloader state (in this case a background and a loading bar)
            game.load.image('preloaderBackground', 'assets/preload/preloader_background.jpg');
            game.load.image('preloaderBar', 'assets/preload/preloader_bar.png');
    
        },
    
        create: function () {
    
            //  By this point the preloader assets have loaded to the cache, we've set the game settings
            //  So now let's start the real preloader going
            game.state.start('Preloader');
    
        }
    };
};
