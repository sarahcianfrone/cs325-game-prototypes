"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var playButton = null;
    
    function startGame(pointer) {

        game.state.start('Game');

    }
    
    function nextIndex(){
        index++;
        switch(index){
            case 1:
                story.destroy();
                story = game.add.sprite(0, 0, 'story1');
                story.scale.setTo(2, 2);
            break;
            case 2:
                story.destroy();
                story = game.add.sprite(0, 0, 'story2');
                story.scale.setTo(2, 2);
            break;
            case 3:
                story.destroy();
                game.state.start('Game');
            break;

        }
    }
    var story = null;
    var index = 0;
    var key = null;
    return {

        create: function () {
    
            story = game.add.sprite(0, 0, 'story0');
            story.scale.setTo(2, 2);
            key = game.input.keyboard.addKey(Phaser.KeyCode.ENTER);
            key.onDown.add(nextIndex);

    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }
        
    };
};
