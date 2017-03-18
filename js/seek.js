/**
 * Created by choyiny on 17/3/2017.
 */

var Game = {};

// Initializes the game
Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

// preloads game with tiles and background
Game.preload = function() {

    // location and image of the tiles
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);

    // player sprite
    game.load.image('sprite','assets/sprites/sprite.png');
};