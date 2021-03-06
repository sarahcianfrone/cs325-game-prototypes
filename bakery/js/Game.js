"use strict";

GameStates.makeGame = function( game, shared ) {
    //Constant fields
    const WIDTH = 800;
    const HEIGHT = 800;
    //Multiplier for each consecutive buy
    const INCREASE = 1.2;

    const WHITE_BREAD =             [0, 0, 0];
    const WHEAT_BREAD =             [0, 0, 1];
    const BANANA_BREAD =            [0, 0, 2];
    const BRIOCHE =                 [0, 0, 3];

    const SODA_BREAD =              [0, 1, 0];
    const BEER_BREAD =              [0, 1, 1];
    const PUMPKIN_BREAD =           [0, 1, 2];
    const SOURDOUGH =               [0, 1, 3];
    
    const PLAIN_BAGEL =             [0, 2, 0];
    const CINNAMON_RAISIN_BAGEL =   [0, 2, 1];
    const FRENCH_TOAST_BAGEL =      [0, 2, 2];
    const RAINBOW_BAGEL =           [0, 2, 3];
    
    const VICTORIA_SPONGE =         [1, 0, 0];
    const CHIFFON_CAKE =            [1, 0, 1];
    const ANGEL_FOOD_CAKE =         [1, 0, 2];
    const SWISS_ROLL =              [1, 0, 3];

    const POUND_CAKE =              [1, 1, 0];
    const YELLOW_CAKE =             [1, 1, 1];
    const FUNFETTI_CAKE=            [1, 1, 2];
    const CHOCOLATE_CAKE=           [1, 1, 3];

    const NOBAKE_CHEESECAKE =       [1, 2, 0];
    const CHOCOLATE_MOUSSE_CAKE=    [1, 2, 1];
    const CHOCOLATE_FLOURLESS_CAKE= [1, 2, 2];
    const NY_STYLE_CHEESECAKE=      [1, 2, 3];
   
    const VANILLA_SCONE =           [2, 0, 0];
    const CHOCOLATE_CROISSANT =     [2, 0, 1];
    const CINNAMON_ROLL =           [2, 0, 2];
    const STICKY_BUN =              [2, 0, 3];

    const CHURRO =                  [2, 1, 0];
    const BEIGNET =                 [2, 1, 1];
    const ECLAIR=                   [2, 1, 2];
    const MACARON=                  [2, 1, 3];

    const OATMEAL_RAISIN_COOKIE =   [2, 2, 0];
    const SUGAR_COOKIE=             [2, 2, 1];
    const CHOCOLATE_CHIP_COOKIE=    [2, 2, 2];
    const GINGERBREAD=              [2, 2, 3];

    const APPLE_PIE =               [3, 0, 0];
    const CHERRY_PIE =              [3, 0, 1];
    const BLUEBERRY_PIE =           [3, 0, 2];
    const RHUBARB_PIE =             [3, 0, 3];

    const BANANA_CREAM_PIE =        [3, 1, 0];
    const STRAWBERRY_CREAM_PIE =    [3, 1, 1];
    const COCONUT_CREAM_PIE=        [3, 1, 2];
    const CHOCOLATE_SILK_PIE=       [3, 1, 3];

    const PECAN_PIE =               [3, 2, 0];
    const PUMPKIN_PIE=              [3, 2, 1];
    const KEY_LIME_PIE=             [3, 2, 2];
    const LEMON_MERINGUE_PIE=       [3, 2, 3];




    var a;
    var d;

    var currentIndex = [0, 0];
    //Sprites
    var background;
    var tabBackground;
    var maintabBackground;
    var enemyInfoBox;
    var moneyBox;
    //Used for the timer to include a loss case
    var timeLeft = 301;
    var timeLeftText;
    var frame = 0;

    var units = [];
    var buttons = [[[null, null, null, null], [null, null, null, null], [null, null, null, null]],
                   [[null, null, null, null], [null, null, null, null], [null, null, null, null]],
                   [[null, null, null, null], [null, null, null, null], [null, null, null, null]],
                   [[null, null, null, null], [null, null, null, null], [null, null, null, null]]];
    var buttonsInfo = [[[null, null, null, null], [null, null, null, null], [null, null, null, null]],
    [[null, null, null, null], [null, null, null, null], [null, null, null, null]],
    [[null, null, null, null], [null, null, null, null], [null, null, null, null]],
    [[null, null, null, null], [null, null, null, null], [null, null, null, null]]];

    var tabs = [null, null, null, null];
    function decreaseTimeLeft(){
        frame = 0;
        timeLeft--;
        timeLeftText.setText("Time Left: "+timeToString(timeLeft))
        if(timeLeft == 0) timeUp();
    }

    function timeUp(){
        if(lifetimeEarnings > enemyMoney) game.state.start('Win');
        else game.state.start('Lose');
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
    var enemyMoney = 250000;
    var enemyEarningPerSecond = 2500;
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
        enemyMoneyText.setText("Enemy $ "+numberToString(enemyMoney));
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

            if(hundreds >= 100 || (ret.length == 0 || numChanging == 0)) ret = ""+hundreds+ret;
            else if(hundreds >= 10) ret = "0"+hundreds+ret
            else ret = "00"+hundreds+ret;
            
        }
        return ret;
    }
    //Player money decreases when they buy things, lifetimeEarnings does not.
    var lifetimeEarnings = 0;
    var money = 0;
    var moneyText;
    var moneyPerSecond = 0;
    var moneyPerSecondText = 0;
    function Unit(newName, newCost, newPerSec, newNumOwned){
        return {name: newName, cost: newCost, perSec: newPerSec, numOwned: newNumOwned};
    }

    
    function makeBreadTab(){
        var sub1 = [];
        sub1.push(Unit("White Bread", 5, 1, 1));
        sub1.push(Unit("Wheat Bread", 100, 20, 0));
        sub1.push(Unit("Rye Bread", 1000, 100, 0));
        sub1.push(Unit("Brioche", 10000, 1000, 0));
        var sub2 = [];
        sub2.push(Unit("Soda Bread", 10, 2, 0));
        sub2.push(Unit("Beer Bread", 50, 12, 0));
        sub2.push(Unit("Pumpkin Bread", 400, 100, 0));
        sub2.push(Unit("Sourdough", 10000, 1000, 0));
        var sub3 = [];
        sub3.push(Unit("Basic Bagel", 25, 5, 0));
        sub3.push(Unit("Cinnamon Raisin\nBagel", 36, 6, 0));
        sub3.push(Unit("French Toast Bagel", 49, 7, 0));
        sub3.push(Unit("Rainbow Bagel", 64, 8, 0));
        var tab = [sub1, sub2, sub3];
        units.push(tab);
    }

    function makeCakeTab(){
        var sub1 = [];
        sub1.push(Unit("Victoria Sponge", 50, 10, 0));
        sub1.push(Unit("Chiffon Cake", 800, 150, 0));
        sub1.push(Unit("Angel Food Cake", 2000, 500, 0));
        sub1.push(Unit("Swiss Roll", 10000, 2500, 0));
        var sub2 = [];
        sub2.push(Unit("Pound Cake", 4, 1, 0));
        sub2.push(Unit("Yellow Cake", 10, 2, 0));
        sub2.push(Unit("Funfetti Cake", 400, 100, 0));
        sub2.push(Unit("Chocolate Cake", 10000, 1000, 0));
        var sub3 = [];
        sub3.push(Unit("No-Bake Cheesecake", 25, 4, 0));
        sub3.push(Unit("Chocolate Mousse\nCake", 150, 20, 0));
        sub3.push(Unit("Chocolate Flourless\nCake", 200, 40, 0));
        sub3.push(Unit("NY Style Cheesecake", 500, 100, 0));
        var tab = [sub1, sub2, sub3];
        units.push(tab);
    }

    function makePastryTab(){
        var sub1 = [];
        sub1.push(Unit("Vanilla Scone", 20, 2, 0));
        sub1.push(Unit("Chocolate Croissant", 200, 25, 0));
        sub1.push(Unit("Cinnamon Roll", 1000, 150, 0));
        sub1.push(Unit("Sticky Bun", 1500, 250, 0));
        var sub2 = [];
        sub2.push(Unit("Churro", 5, 2, 0));
        sub2.push(Unit("Beignet", 10, 5, 0));
        sub2.push(Unit("Eclair", 100, 65, 0));
        sub2.push(Unit("Macaron", 100000, 20000, 0));
        var sub3 = [];
        sub3.push(Unit("Oatmeal Raisin\nCookie", 6, 1, 0));
        sub3.push(Unit("Sugar Cookie", 15, 20, 0));
        sub3.push(Unit("Chocolate Chip\nCookie", 30, 40, 0));
        sub3.push(Unit("Gingerbread", 50, 100, 0));
        var tab = [sub1, sub2, sub3];
        units.push(tab);
    }

    function makePieTab(){
        var sub1 = [];
        sub1.push(Unit("Apple Pie", 20, 2, 0));
        sub1.push(Unit("Cherry Pie", 200, 25, 0));
        sub1.push(Unit("Blueberry Pie", 1000, 150, 0));
        sub1.push(Unit("Rhubarb Pie", 1500, 250, 0));
        var sub2 = [];
        sub2.push(Unit("Banana Cream Pie", 5, 2, 0));
        sub2.push(Unit("Strawberry Cream Pie", 10, 5, 0));
        sub2.push(Unit("Coconut Cream Pie", 100, 65, 0));
        sub2.push(Unit("Chocolate Silk Pie", 100000, 20000, 0));
        var sub3 = [];
        sub3.push(Unit("Pecan Pie", 6, 1, 0));
        sub3.push(Unit("Pumpkin Pie", 15, 20, 0));
        sub3.push(Unit("Key Lime Pie", 30, 40, 0));
        sub3.push(Unit("Lemon Meringue Pie", 50, 100, 0));
        var tab = [sub1, sub2, sub3];
        units.push(tab);
    }

    function makeUnits(){
      makeBreadTab();
      makeCakeTab();
      makePastryTab();
      makePieTab();
    }

    function moneyIncrease(){
        var increase = 0;
        var totalIncrease = 0;
        for(var a = 0; a < 4; a++){
            for(var b = 0; b < 3; b++){
                for(var c = 0; c < 4; c++){
                    increase = units[a][b][c].perSec*units[a][b][c].numOwned;
                    money+=increase/60.0;
                    lifetimeEarnings+=increase/60.0;
                    totalIncrease+=increase;
                }
            }
        }
        moneyPerSecond = totalIncrease;
    }

    function Button(x, y, ind){
        var styleL = {font: "25px Arial", fill: "#000", boundsAlignH: "left"};
        var styleR = {font: "20px Arial", fill: "#000", boundsAlignH: "right"};
        var bttn =  game.add.button(x, y, 'buttonBase', function(){buttonClicked(ind)});
        var buttonInfo =  { nameText: game.add.text(x+5, y+5, units[ind[0]][ind[1]][ind[2]].name, styleL),
            perSecText: game.add.text(x+5, y+67, "$/s = "+units[ind[0]][ind[1]][ind[2]].perSec, styleR),
            numOwnedText: game.add.text(320, y+35, "Owned : "+units[ind[0]][ind[1]][ind[2]].numOwned, styleR),
            costText: game.add.text(320, y+67, "Cost = "+units[ind[0]][ind[1]][ind[2]].cost, styleR), 
            index: ind};
        


        buttonInfo.costText.anchor.set(1, 0);
        buttonInfo.numOwnedText.anchor.set(1, 0);
        buttonInfo.nameText.visible = false;
        buttonInfo.perSecText.visible = false;
        buttonInfo.numOwnedText.visible = false;
        buttonInfo.costText.visible = false;
        buttonsInfo[ind[0]][ind[1]][ind[2]] = buttonInfo;
        bttn.visible = false;
        buttons[ind[0]][ind[1]][ind[2]] = bttn;
       
    }

    function buttonClicked(info){
        if(money >= units[info[0]][info[1]][info[2]].cost){
            money-=units[info[0]][info[1]][info[2]].cost;
            units[info[0]][info[1]][info[2]].numOwned++;
            units[info[0]][info[1]][info[2]].cost = Math.floor(units[info[0]][info[1]][info[2]].cost*INCREASE);
            buttonsInfo[info[0]][info[1]][info[2]].numOwnedText.setText("Owned: "+units[info[0]][info[1]][info[2]].numOwned);
            buttonsInfo[info[0]][info[1]][info[2]].costText.setText("Cost = "+units[info[0]][info[1]][info[2]].cost);
            displayMoney();
        }
    }

    function makeButtons(){
        for(var a = 0; a < 4; a++){
            for(var b = 0; b < 3; b++){
                for(var c = 0; c < 4; c++){
                    Button(75, 250+(125*c), [a, b, c]);
                }
            }
        }
       
        toggleVisibility([0, 0, 0]);
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
        moneyText.setText("$"+numberToString(Math.floor(money)));
        lifetimeMoneyText.setText("Lifetime $"+numberToString(Math.floor(lifetimeEarnings)));
        moneyPerSecondText.setText("$/sec: "+numberToString(moneyPerSecond));
    }

    function subTabClicked(ind){
        toggleVisibility(currentIndex);
        toggleVisibility([currentIndex[0], ind]);
        tabs[currentIndex[0]].subtabs[currentIndex[1]].up.visible = false;
        tabs[currentIndex[0]].subtabs[currentIndex[1]].down.visible = true;
        tabs[currentIndex[0]].subtabs[ind].up.visible = true;
        tabs[currentIndex[0]].subtabs[ind].down.visible = false;
        currentIndex = [currentIndex[0], ind];
    }

    function SubTab(ind, name){
        var tab = {up: null, down: null, name: null, text: null};
        tab.up = game.add.sprite(50+(ind*100), 150, 'subtabSelected');
        tab.down = game.add.button(50+(ind*100), 150, 'subtabUnselected', function(){subTabClicked(ind)});
        tab.name = name;
        tab.text = game.add.text(50+ind*100+5, 163, name, {font: "15px Arial", fill: "#000", align: "center"});
        tab.up.visible = false;
        tab.down.visible = false;
        tab.text.visible = false;
        return tab;
    }

    function MainTab(ind, name1, name2, name3, name){
        var tab = {up: null, down:null, name:null, text:null, subtabs:null};
        tab.up = game.add.sprite(50+(ind*75), 100, 'mainTabSelected');
        tab.down = game.add.button(50+(ind*75), 100, 'mainTabUnselected', function(){mainTabClicked(ind)});
        tab.up.visible = false;
        tab.down.visible = true;
        tab.name = name;
        tab.text = game.add.text(50+(ind*75)+5, 115, name, {font: "20px Arial", fill: "#000", align: "center"});
        tab.subtabs = [SubTab(0, name1), SubTab(1, name2), SubTab(2, name3)];
        return tab;
    }
    
    function mainTabClicked(ind){
        var current = currentIndex[0];

        for(var i=0;i<3;i++){
            tabs[ind].subtabs[i].down.visible = true;
            tabs[ind].subtabs[i].up.visible = false;
            tabs[ind].subtabs[i].text.visible = true;

            tabs[current].subtabs[i].up.visible = false;
            tabs[current].subtabs[i].down.visible = false;
            tabs[current].subtabs[i].text.visible = false;
        }

        tabs[ind].subtabs[0].up.visible = true;
        tabs[ind].subtabs[0].down.visible = false;

        tabs[current].up.visible = false;
        tabs[current].down.visible = true;
        tabs[ind].up.visible = true;
        tabs[ind].down.visible = false;
        toggleVisibility(currentIndex);
        toggleVisibility([ind, 0]);
        currentIndex = [ind, 0];
    }

    function makeTabs(){
        tabs = [MainTab(0, "Yeasted", "Nonyeasted", "Bagels", "Bread"), MainTab(1, "Foam Cake", "Butter Cake", "Flourless", "Cake"), MainTab(2, "Breakfast", "Dessert", "Cookies", "Pastry"), MainTab(3, "Fruit Pies", "Cream Pies","Custard Pies", "Pie")];
        for(var i=0;i<3;i++){
            tabs[0].subtabs[i].down.visible = true;
            tabs[0].subtabs[i].up.visible = false;
            tabs[0].subtabs[i].text.visible = true;
        }
        tabs[0].subtabs[0].up.visible = true;
        tabs[0].subtabs[0].down.visible = false;
        tabs[0].down.visible = false;
        tabs[0].up.visible = true;
        currentIndex = [0, 0];
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
    
    function toggleVisibility(index){
        for(var i=0;i<4;i++){
            buttonsInfo[index[0]][index[1]][i].nameText.visible = ! buttonsInfo[index[0]][index[1]][i].nameText.visible;
            buttonsInfo[index[0]][index[1]][i].perSecText.visible = !  buttonsInfo[index[0]][index[1]][i].perSecText.visible ;
            buttonsInfo[index[0]][index[1]][i].numOwnedText.visible = ! buttonsInfo[index[0]][index[1]][i].numOwnedText.visible;
            buttonsInfo[index[0]][index[1]][i].costText.visible = !buttonsInfo[index[0]][index[1]][i].costText.visible;
            buttons[index[0]][index[1]][i].visible = !buttons[index[0]][index[1]][i].visible;
        }
    }


    function tabLeft(){
        var newIndex = [0, 0];
        if(currentIndex[0] != 0 || currentIndex[1] != 0){
            if(currentIndex[1] == 0){
                newIndex = [currentIndex[0]-1, 2]
            } else {
                newIndex = [currentIndex[0], currentIndex[1]-1];
            }
            toggleVisibility(currentIndex);
            toggleVisibility(newIndex);
            currentIndex = newIndex;
        }
    }

    function tabRight(){
        var newIndex = [0, 0];
        if(currentIndex[0] != 2 || currentIndex[1] != 2){
            if(currentIndex[1] == 2){
                newIndex = [currentIndex[0]+1, 0]
            } else {
                newIndex = [currentIndex[0], currentIndex[1]+1];
            }
            toggleVisibility(currentIndex);
            toggleVisibility(newIndex);
            currentIndex = newIndex;
        }
    }

    return {
    
        create: function () {
            background = game.add.sprite(0, 0, 'background');
            maintabBackground=  game.add.sprite(50, 125, 'maintabBackground');
            enemyInfoBox = game.add.sprite(450, 100, 'enemyInfoBox');
            moneyBox = game.add.sprite(450, 500, 'moneyBox');
            game.add.sprite(450, 225, 'upgradeBox');
            tabBackground = game.add.sprite(50, 225, 'tabBackground');
            timeLeftText = game.add.text(460, 140, "5:00", {font: "25px Arial", fill: "#000", boundsAlignH: "right"});
            enemyMoneyText = game.add.text(460, 105, ""+enemyMoney, {font: "25px Arial", fill: "#000", boundsAlignH: "right"});
            moneyText = game.add.text(460, 510, "0", {font: "40px Arial", fill: "#000", boundsAlignH: "center"});
            lifetimeMoneyText = game.add.text(460, 600, "0", {font: "25px Arial", fill: "#000", align: "center"});
            moneyPerSecondText = game.add.text(460, 660, "0", {font: "25px Arial", fill: "#000", boundsAlignH: "center"});
            a = game.input.keyboard.addKey(Phaser.Keyboard.A);
            d = game.input.keyboard.addKey(Phaser.Keyboard.D);

            makeUnits();
            makeButtons();
            makeTabs();
        },
    
        update: function () {
            frame++;
            if(frame == 60) decreaseTimeLeft();
            if(timeLeft > 0) enemyMoneyIncrease();
            moneyIncrease();
            displayMoney();
            if(lifetimeEarnings > enemyMoney){
                timeUp();
            }
        }
        
    };
};
