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

Game.create = function(){
    //player map for keeping track of players
    Game.playerMap= {};
    var map = game.add.tilemap("map");
    map.addTilesetImage("tilesheet", "tileset"); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map
    Client.askNewPlayer();
}

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};