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
    var buttonsInfo = [];

    function decreaseTimeLeft(){
        frame = 0;
        timeLeft--;
        timeLeftText.setText(timeToString(timeLeft))
        if(timeLeft == 0) timeUp();
    }

    function timeUp(){
        if(lifetimeEarnings > enemyMoney) console.log("Win");
        else console.log("Lose");
        quitGame();
    }


    function timeToString(seconds){
        var sec = seconds % 60;
        var min = (seconds - sec) / 60;
        if(sec < 10) return ""+min+":0"+sec;
        else return ""+min+":"+sec;
    }
    //EnemyMoney and enemyEarningPerSecond used for the loss case also
    //By the end of 5 minutes = 300 seconds, the enemy will have 100,000+300*10,000 = 400,000
    //These numbers subject to change
    var enemyMoney = 100000;
    var enemyEarningPerSecond = 1000;
    var enemyMoneyEarnedThisSecond = 0;
    var enemyMoneyText = null;
    var lifetimeMoneyText = null;

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

            var hundreds = numChanging % 1000;
            numChanging-=numChanging%1000;
            numChanging/=1000;

            if(hundreds >= 100 || ret.length == 0 || numChanging == 0) ret = ""+hundreds+ret;
            else if(hundreds >= 10) ret = "0"+hundreds+ret
            else ret = "00"+hundreds+ret;
            
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
        Unit("Wheat Bread", 100, 20, 0);
        Unit("Banana Bread", 1000, 100, 0);
        Unit("Brioche", 10000, 1000, 0);
        Unit("Sourdough", 25000, 2000, 0);
    }

    function moneyIncrease(){
        var increase = 0;
        for(var i=0;i<units.length;i++){
            increase = units[i].perSec*units[i].numOwned/60.0;
            money+=increase;
            lifetimeEarnings+=increase;
        }
    }

    function Button(x, y, ind){
        var styleL = {font: "25px Arial", fill: "#fff", boundsAlignH: "left"};
        var styleR = {font: "20px Arial", fill: "#fff", boundsAlignH: "right"};
        var bttn =  game.add.button(x, y, 'buttonBase', function(){buttonClicked(ind)});
        bttn.scale.setTo(2, 1);
        var buttonInfo =  { nameText: game.add.text(x+5, y+5, units[ind].name, styleL),
            perSecText: game.add.text(x+150, y+5, "$/s = "+units[ind].perSec, styleR),
            numOwnedText: game.add.text(x+150, y+35, "Owned : "+units[ind].numOwned, styleR),
            costText: game.add.text(x+150, y+65, "Cost = "+units[ind].cost, styleR), 
            index: ind};
        buttonsInfo.push(buttonInfo);
        buttons.push(bttn);
       
    }

    function buttonClicked(info){
        if(money >= units[info].cost){
            money-=units[info].cost;
            units[info].numOwned++;
            units[info].cost = Math.floor(units[info].cost*INCREASE);
            buttonsInfo[info].numOwnedText.setText("Owned: "+units[info].numOwned);
            buttonsInfo[info].costText.setText("Cost = "+units[info].cost);
            displayMoney();
        }
    }

    function makeButtons(){
        Button(20, 50, WHITE_BREAD);
        Button(20, 200, WHEAT_BREAD);
        Button(20, 350, BANANA_BREAD);
        Button(20, 500, BRIOCHE);
    }

    function destroyButtons(){
        for(var i=0;i<buttons.length;i++){
            buttons[i].destroy();
            buttonsInfo[i].nameText.destroy();
            buttonsInfo[i].perSecText.destroy();
            buttonsInfo[i].numOwnedText.destroy();
            buttonsInfo[i].costText.destroy();
        }
    }

    function displayMoney(){
        moneyText.setText(numberToString(Math.floor(money)));
        lifetimeMoneyText.setText(numberToString(Math.floor(lifetimeEarnings)));
    }

    function quitGame() {
        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.
        timeLeftText.destroy();
        enemyMoneyText.destroy();
        moneyText.destroy();
        lifetimeMoneyText.destroy();
        background.destroy();

        destroyButtons();
        //  Then let's go back to the main menu.
        game.state.start('MainMenu');
    }
    
    function toggleVisibility(){
        for(var i = 0; i < buttonsInfo.length ; i++){
            buttons[i].visibility = !buttons[i].visibility;
            buttonsInfo[i].nameText.visibility = !buttonsInfo[i].nameText.visibility;
            buttonsInfo[i].perSecText.visibility = !buttonsInfo[i].perSecText.visibility;
            buttonsInfo[i].numOwnedText.visibility = ! buttonsInfo[i].numOwnedText.visibility;
            buttonsInfo[i].costTest.visibility = !buttonsInfo[i].costTest.visibility.visibility;
        }
    }

    return {
    
        create: function () {
            background = game.add.sprite(0, 0, 'background');
            timeLeftText = game.add.text(WIDTH - 50, 10, "5:00", {font: "25px Arial", fill: "#000", boundsAlignH: "right"});
            enemyMoneyText = game.add.text(WIDTH - 100, 50, ""+enemyMoney, {font: "25px Arial", fill: "#000", boundsAlignH: "right"});
            moneyText = game.add.text(WIDTH*0.75, 500, "0", {font: "40px Arial", fill: "#000", boundsAlignH: "center"});
            lifetimeMoneyText = game.add.text(WIDTH*0.75, 600, "0", {font: "25px Arial", fill: "#000", boundsAlignH: "center"});
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
            if(key.isDown) toggleVisibility();
        }
    };
};
