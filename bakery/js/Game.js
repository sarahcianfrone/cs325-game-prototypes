"use strict";

GameStates.makeGame = function( game, shared ) {
    //Constant fields
    const WIDTH = 800;
    const HEIGHT = 800;
    //Multiplier for each consecutive buy
    const INCREASE = 1.2;

    const WHITE_BREAD = 0;
    const WHEAT_BREAD = 1;
    const BANANA_BREAD = 2;
    const BRIOCHE = 3;
    const SOURDOUGH = 4;

    var key;

    //Sprites
    var background;

    //Used for the timer to include a loss case
    var timeLeft = 301;
    var timeLeftText;
    var frame = 0;

    var units = [];
    var buttons = [];

    function decreaseTimeLeft(){
        frame = 0;
        timeLeft--;
        var secondsLeft = timeLeft%60;
        var minutesLeft = (timeLeft - secondsLeft) / 60;
        timeLeftText.setText(""+minutesLeft+":"+secondsLeft)
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
        enemyMoneyText.setText(numberToString(enemyMoney));
    }

    //Converts a number from 12345678 format -> 12,345,678 format
    function numberToString(num){
        var ret = "";
        var numChanging = num;
        while(numChanging > 0){
            if(ret.length!=0) ret = ","+ret;
            ret = ""+numChanging%1000 + ret;
            numChanging-=numChanging%1000;
            numChanging/=1000;
        }
        return ret;
    }
    //Player money decreases when they buy things, lifetimeEarnings does not.
    var lifetimeEarnings = 0;
    var money = 0;
    var moneyText;

    function Unit(newName, newCost, newPerSec, newNumOwned){
        units.push({name: newName, cost: newCost, perSec: newPerSec, numOwned: newNumOwned});
    }

    function makeUnits(){
        Unit("White Bread", 5, 1, 1);
        Unit("Wheat Bread", 20, 5, 0);
        Unit("Banana Bread", 100, 35, 0);
        Unit("Brioche", 1000, 400, 0);
        Unit("Sourdough", 10000, 5000, 0);
    }

    function moneyIncrease(){
        var increase = 0;
        for(var i=0;i<units.length;i++){
            increase = units[i].perSec*units[i].numOwned/60.0;
            money+=increase;
            lifetimeEarnings+=increase;
        }
    }

    function Button(x, y, ind, clickFunc){
        var styleL = {font: "30px Arial", fill: "#fff", boundsAlignH: "left"};
        var styleR = {font: "20px Arial", fill: "#fff", boundsAlignH: "right"};
        var button = {  sprite: game.add.sprite(x, y, 'buttonBase'),
                        nameText: game.add.text(x+5, y+5, units[ind].name, styleL),
                        perSecText: game.add.text(x+150, y+5, "$/s = "+units[ind].perSec, styleR),
                        numOwnedText: game.add.text(x+150, y+35, "Owned : "+units[ind].numOwned, styleR),
                        costText: game.add.text(x+150, y+65, "Cost = "+units[ind].cost, styleR), 
                        index: ind,
                        func: clickFunc
                    };
         
    }

    function makeButtons(){
        Button(20, 50, WHITE_BREAD, function(){
            if(money >= units[WHITE_BREAD].cost){
                money-=units[WHITE_BREAD].cost;
                units[WHITE_BREAD].cost*=INCREASE;
                units[WHITE_BREAD].numOwned++;
            }
        });
    }

    function destroyButtons(){
        for(var i=0;i<buttons.length;i++){
            buttons[i].sprite.destroy();
            buttons[i].nameText.destroy();
            buttons[i].perSecText.destroy();
            buttons[i].numOwnedText.destroy();
            buttons[i].costText.destroy();
        }
    }

    function displayMoney(){
        var floorMoney = Math.floor(money);
        moneyText.setText(numberToString(floorMoney));
    }

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        timeLeftText.destroy();
        enemyMoneyText.destroy();
        moneyText.destroy();
        background.destroy();

        destroyButtons();
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');

    }
    
    return {
    
        create: function () {
            background = game.add.sprite(0, 0, 'background');
            timeLeftText = game.add.text(WIDTH - 50, 10, "5:00", {font: "25px Arial", fill: "#000", boundsAlignH: "right"});
            enemyMoneyText = game.add.text(WIDTH - 100, 50, ""+enemyMoney, {font: "25px Arial", fill: "#000", boundsAlignH: "right"});
            moneyText = game.add.text(WIDTH/2, 100, "0", {font: "40px Arial", fill: "#000", boundsAlignH: "center"});
            key = game.input.keyboard.addKey(Phaser.Keyboard.W);
     
            makeUnits();
            makeButtons();
        },
    
        update: function () {
            frame++;
            if(frame == 60) decreaseTimeLeft();
            if(timeLeft > 0) enemyMoneyIncrease();
            moneyIncrease();
            displayMoney();
        }
    };
};
