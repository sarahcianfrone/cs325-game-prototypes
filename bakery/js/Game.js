"use strict";

GameStates.makeGame = function( game, shared ) {
    // Create your own variables.
    var WIDTH = 800;
    var HEIGHT = 800;
    
    //Used for the timer to include a loss case
    var timeLeft = 300;
    var timeLeftText = null;
    var frame = 0;

    function decreaseTimeLeft(){
        frame = 0;
        timeLeft--;
        if(timeLeftText != null) timeLeftText.destroy();
        var secondsLeft = timeLeft%60;
        var minutesLeft = (timeLeft - secondsLeft) / 60;
        timeLeftText = game.add.text(WIDTH - 50, 10, ""+minutesLeft+":"+secondsLeft, {font: "25px Arial", fill: "#fff", boundsAlignH: "center"});
        if(timeLeft == 0) timeUp();
    }

    function timeUp(){
        if(lifetimeEarnings > enemyMoney) console.log("Win");
        else console.log("Lose");
        quitGame();
    }

    //EnemyMoney and enemyEarningPerSecond used for the loss case also
    //By the end of 5 minutes = 300 seconds, the enemy will have 100,000+300*10,000 = 400,000
    //These numbers subject to change
    var enemyMoney = 100000;
    var enemyEarningPerSecond = 1000;
    var enemyMoneyEarnedThisSecond = 0;
    var enemyMoneyText = null;

    function enemyMoneyIncrease(){
        var enemyEarningPerTick = Math.floor(enemyEarningPerSecond/60);
        enemyMoneyEarnedThisSecond+=enemyEarningPerTick;
        if(frame == 60 && enemyMoneyEarnedThisSecond != enemyEarningPerSecond){
            enemyEarningPerTick = enemyEarningPerSecond-enemyMoneyEarnedThisSecond;
        }
        enemyMoney+=enemyEarningPerTick;
        if(enemyMoneyText != null) enemyMoneyText.destroy();
        enemyMoneyText = timeLeftText = game.add.text(WIDTH - 50, 50, ""+numberToString(enemyMoney)+"", {font: "25px Arial", fill: "#fff", boundsAlignH: "center"});
    }

    //Converts a number from 12345678 format -> 12,345,678 format
    function numberToString(num){
        var ret = "";
        var numChanging = num;
        var place = 1000;
        while(numChanging > 0){
            if(ret.length!=0) ret = ","+ret;
            ret = ""+numChanging%place + ret;
            numChanging-=numChanging%place;
            place*=1000;
        }
    }
    //Player money decreases when they buy things, lifetimeEarnings does not.
    var lifetimeEarnings = 0;
    var money = 0;



    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        if(timeLeftText != null) timeLeftText.destroy();
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
    
       
        },
    
        update: function () {
            frame++;
            if(frame == 60) decreaseTimeLeft();
            enemyMoneyIncrease();
        }
    };
};
