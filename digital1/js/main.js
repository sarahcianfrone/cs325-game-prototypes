"use strict";

window.onload = function() {
    

	var WIDTH=800;
	var HEIGHT=800;

	var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game', { preload: preload, create: create, update: update } );
    
	var graphics;

	function preload() {

	}
	function create() {
		graphics = game.add.graphics(0, 0);

		graphics.drawRect(0, 0, WIDTH, HEIGHT);
		graphics.drawRect(50, 250, 100, 100);
	}
	function update() {

	}
};

