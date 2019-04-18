"use strict";

GameStates.makeLose = function( game , shared) {

    return {
    
        create: function () {
    
            //	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
            game.add.sprite(0, 0, 'lose');
        },
    
        update: function () {

        }
    
    };
};
