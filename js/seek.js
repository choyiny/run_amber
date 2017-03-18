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

    // load location and image of the tiles
    game.load.tilemap('map', 'assets/map/basemap.json', null, Phaser.Tilemap.TILED_JSON);
    //game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.spritesheet('walltiles', 'assets/map/tiles/Objects/Wall.png',16,16);
    game.load.spritesheet('floortiles', 'assets/map/tiles/Objects/Floor.png',16,16);

    // load player sprite
    game.load.image('sprite','assets/sprites/sprite.png');
};

Game.create = function(){
    Game.playerMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    //testKey.onDown.add(Client.sendTest, this);
    var map = game.add.tilemap('map');
    //map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    map.addTilesetImage('Wall', 'walltiles');
    map.addTilesetImage('Floor', 'floortiles');
    /*var layer;
    *for(var i = 0; i < map.layers.length; i++) {
    *   layer = map.createLayer(i);
    }*/

    var underground = map.createLayer("Underground");
    var groundlayer = map.createLayer("Ground layer");
    var secondlayer = map.createLayer("Second layer");

    secondlayer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    secondlayer.events.onInputUp.add(Game.getCoordinates, this);
    Client.askNewPlayer();
};


// adds player to dictionary
Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};

// Removes the player from the dictionary
Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

// get coordinates of player
Game.getCoordinates = function(layer, pointer) {
    Client.sendClick(pointer.worldX, pointer.worldY)
};

// temp: move player
Game.movePlayer = function(id, x, y) {
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x, player.y, x, y)
    var duration = distance * 10
    var tween = game.add.tween(player);
    tween.to({x:x, y:y}, duration);
    tween.start();
}
